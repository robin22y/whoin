import { createClient } from '@/lib/supabase/server'
import { GuestForm } from '@/components/guest-form'
import { ShareCard } from '@/components/share-card'
import { ManageButton } from '@/components/manage-button'
import { Footer } from '@/components/footer'
import { notFound } from 'next/navigation'

export default async function EventPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch event (exclude management_key from public API)
  const { data: event, error } = await supabase
    .from('events')
    .select('id, title, date, location, bank_details, price_per_adult, user_id, created_at, updated_at')
    .eq('id', id)
    .single()

  if (error || !event) {
    notFound()
  }

  // Fetch guests
  const { data: guests } = await supabase
    .from('guests')
    .select('*')
    .eq('event_id', id)
    .order('created_at', { ascending: true })

  // Fetch stats
  const { data: stats } = await supabase
    .from('event_stats')
    .select('*')
    .eq('event_id', id)
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
              {isOrganizer && <ManageButton eventId={id} />}
            </div>
          </div>

          {/* Share Card - Only show for organizer */}
          {isOrganizer && (
            <ShareCard
              eventId={id}
              eventTitle={event.title}
              eventDate={event.date}
              eventLocation={event.location}
            />
          )}

          {/* Guest Form */}
          <GuestForm
            eventId={id}
            pricePerAdult={event.price_per_adult || 0}
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

