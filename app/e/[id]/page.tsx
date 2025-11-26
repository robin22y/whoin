import { createClient } from '@/lib/supabase/server'
import { GuestForm } from '@/components/guest-form'
import { ShareCard } from '@/components/share-card'
import { ManageButton } from '@/components/manage-button'
import { Footer } from '@/components/footer'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  return {
    robots: {
      index: false,
      follow: false,
    },
  }
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  // 1. Check if the ID is a UUID (Long ID)
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)

  // 2. Build the query based on the type of ID
  let query = supabase.from('events').select('id, short_code, title, date, location, bank_details, price_per_adult, price_per_child, user_id, created_at')

  if (isUUID) {
    query = query.eq('id', id) // Old links work
  } else {
    query = query.eq('short_code', id) // New short links work
  }

  const { data: event, error } = await query.single()

  if (error || !event) {
    notFound()
  }

  // Use the actual event.id (UUID) for subsequent queries
  const eventId = event.id

  // Fetch guests
  const { data: guests } = await supabase
    .from('guests')
    .select('*')
    .eq('event_id', eventId)
    .order('created_at', { ascending: true })

  // Fetch stats
  const { data: stats } = await supabase
    .from('event_stats')
    .select('*')
    .eq('event_id', eventId)
    .single()

  // Check if current user is the organizer
  const { data: { user } } = await supabase.auth.getUser()
  const isOrganizer = user && event.user_id === user.id

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 max-w-4xl mx-auto px-6 py-12">
        <div className="space-y-8">
          {/* Event Details - Clear Display at Top */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-4xl font-bold">{event.title}</h1>
                <div className="space-y-2 mt-2">
                  <p className="text-xl">
                    <strong>Time:</strong> {formatDate(event.date)}
                  </p>
                  <p className="text-xl">
                    <strong>Location:</strong> {event.location}
                  </p>
                </div>
              </div>
              {isOrganizer && <ManageButton eventId={eventId} />}
            </div>
          </div>

          {/* Share Card - Only show for organizer */}
          {isOrganizer && (
            <ShareCard
              eventId={eventId}
              eventTitle={event.title}
              eventDate={event.date}
              eventLocation={event.location}
              shortCode={event.short_code || undefined}
            />
          )}

          {/* Guest Form */}
          <GuestForm
            eventId={eventId}
            pricePerAdult={event.price_per_adult || 0}
            pricePerChild={event.price_per_child || 0} // <--- PASS IT HERE
            bankDetails={event.bank_details || ''}
          />

          {/* Event Stats */}
          {stats && (
            <div className="bg-muted/50 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4">Event Stats</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Guests</p>
                  <p className="text-2xl font-bold">{stats.total_guests || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Adults</p>
                  <p className="text-2xl font-bold">{stats.total_adults || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Kids</p>
                  <p className="text-2xl font-bold">{stats.total_kids || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Paid</p>
                  <p className="text-2xl font-bold">{stats.paid_count || 0}</p>
                </div>
              </div>
            </div>
          )}

          {/* Guest List */}
          {guests && guests.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Guest List</h2>
              <div className="space-y-2">
                {guests.map((guest) => (
                  <div
                    key={guest.id}
                    className="flex justify-between items-center p-4 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{guest.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {guest.adult_count} adult(s), {guest.kid_count} kid(s)
                        {guest.is_paid && ' • Paid'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

