import { createClient } from '@/lib/supabase/server'
import { GuestForm } from '@/components/guest-form'
import { Footer } from '@/components/footer'
import { notFound } from 'next/navigation'

export default async function EventPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch event
  const { data: event, error } = await supabase
    .from('events')
    .select('*')
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
          <div>
            <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
            <div className="space-y-2 text-muted-foreground">
              <p className="text-lg">
                <strong>Date:</strong> {formatDate(event.date)}
              </p>
              <p className="text-lg">
                <strong>Location:</strong> {event.location}
              </p>
              {event.price_per_adult > 0 && (
                <p className="text-lg">
                  <strong>Price per adult:</strong> £{event.price_per_adult.toFixed(2)}
                </p>
              )}
              {event.bank_details && (
                <p className="text-lg">
                  <strong>Bank details:</strong> {event.bank_details}
                </p>
              )}
            </div>
          </div>

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

          <div>
            <h2 className="text-2xl font-semibold mb-6">RSVP</h2>
            <GuestForm
              eventId={id}
              pricePerAdult={event.price_per_adult || 0}
              bankDetails={event.bank_details || ''}
            />
          </div>

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

