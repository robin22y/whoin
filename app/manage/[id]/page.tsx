import { createClient } from '@/lib/supabase/server'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ExportButton } from '@/components/export-button'
import { notFound, redirect } from 'next/navigation'

export default async function ManageEventPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ key?: string }>
}) {
  const { id } = await params
  const { key } = await searchParams
  const supabase = await createClient()

  // Security: Require management_key in URL
  if (!key) {
    redirect(`/e/${id}`)
  }

  // Fetch event with management_key verification
  const { data: event, error: eventError } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .eq('management_key', key)
    .single()

  // If no match found (wrong key or no key) -> Redirect to Guest Page
  if (eventError || !event) {
    redirect(`/e/${id}`)
  }

  // Fetch all guests for this event
  const { data: guests, error: guestsError } = await supabase
    .from('guests')
    .select('*')
    .eq('event_id', id)
    .order('created_at', { ascending: true })

  if (guestsError) {
    console.error('Error fetching guests:', guestsError)
  }

  // Calculate totals
  const totalHeadcount = guests?.reduce((sum, guest) => sum + guest.adult_count + guest.kid_count, 0) || 0
  const totalAdults = guests?.reduce((sum, guest) => sum + guest.adult_count, 0) || 0
  const totalExpectedRevenue = totalAdults * (event.price_per_adult || 0)

  // Calculate deletion date (Event Date + 30 Days)
  const eventDate = new Date(event.date)
  const deletionDate = new Date(eventDate)
  deletionDate.setDate(deletionDate.getDate() + 30)

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
      <main className="flex-1 max-w-6xl mx-auto px-6 py-12">
        <div className="space-y-8">
          {/* Event Header */}
          <div>
            <h1 className="text-4xl font-bold mb-2">{event.title}</h1>
            <p className="text-muted-foreground">
              {formatDate(event.date)} • {event.location}
            </p>
          </div>

          {/* Summary Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Total Headcount</CardTitle>
                <CardDescription>Total number of people attending</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">{totalHeadcount}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {totalAdults} adult(s) + {totalHeadcount - totalAdults} kid(s)
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Total Expected Revenue</CardTitle>
                <CardDescription>Based on adult ticket price</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">£{totalExpectedRevenue.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {totalAdults} adult(s) × £{(event.price_per_adult || 0).toFixed(2)}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Guests Table */}
          <Card>
            <CardHeader>
              <CardTitle>Guest List</CardTitle>
              <CardDescription>
                {guests?.length || 0} {guests?.length === 1 ? 'guest' : 'guests'} registered
              </CardDescription>
            </CardHeader>
            <CardContent>
              {guests && guests.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead className="text-right">Adults</TableHead>
                        <TableHead className="text-right">Kids</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {guests.map((guest) => {
                        const guestTotal = guest.adult_count + guest.kid_count
                        const guestRevenue = guest.adult_count * (event.price_per_adult || 0)
                        return (
                          <TableRow key={guest.id}>
                            <TableCell className="font-medium">{guest.name}</TableCell>
                            <TableCell className="text-right">{guest.adult_count}</TableCell>
                            <TableCell className="text-right">{guest.kid_count}</TableCell>
                            <TableCell className="text-right">{guestTotal}</TableCell>
                            <TableCell className="text-right">
                              <span
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                  guest.is_paid
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                }`}
                              >
                                {guest.is_paid ? 'Paid' : 'Pending'}
                              </span>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No guests have RSVP'd yet.</p>
                  <p className="text-sm mt-2">Share the event link to invite guests!</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Export Button */}
          {guests && guests.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <ExportButton
                  eventTitle={event.title}
                  guests={guests}
                />
              </CardContent>
            </Card>
          )}

          {/* Data Retention Warning Card */}
          <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-base font-medium text-amber-900 dark:text-amber-100">
                  🔒 Guest data auto-deletes on {formatDate(deletionDate.toISOString())}.
                </p>
                {event.price_per_adult > 0 ? (
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    Please ensure all payments are settled by then.
                  </p>
                ) : (
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    Please export or screenshot your list by then if you need to keep it.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}

