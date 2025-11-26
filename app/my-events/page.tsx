'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Footer } from '@/components/footer'
import { Calendar, MapPin, Settings, LogIn } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function MyEventsPage() {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    async function loadEvents() {
      // 1. Check if user is logged in
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      let dbEvents: any[] = []
      
      // 2. If logged in, fetch from Database
      if (user) {
        const { data } = await supabase
          .from('events')
          .select('id, title, date, location, management_key, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
        
        if (data) dbEvents = data
      }

      // 3. Also fetch from LocalStorage (for anonymous events)
      const localEvents = JSON.parse(localStorage.getItem('my_events') || '[]')

      // 4. Merge them (avoid duplicates)
      const allEvents = [...dbEvents]
      localEvents.forEach((localEv: any) => {
        if (!allEvents.find(dbEv => dbEv.id === localEv.id)) {
          allEvents.push(localEv)
        }
      })

      // 5. Sort by date (newest first)
      allEvents.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

      setEvents(allEvents)
      setLoading(false)
    }

    loadEvents()
  }, [supabase])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 max-w-4xl mx-auto px-6 py-12">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h1 className="text-4xl font-bold">My Events</h1>
            
            {/* Show Login Button if not logged in */}
            {!user && !loading && (
              <Link href="/auth">
                <Button variant="secondary">
                  <LogIn className="mr-2 h-4 w-4" />
                  Organizer Login
                </Button>
              </Link>
            )}
            
            {user && (
               <Link href="/">
                 <Button variant="outline">Create New Event</Button>
               </Link>
            )}
          </div>

          {loading ? (
            <p>Loading your events...</p>
          ) : events.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground mb-4">
                  No events found on this device.
                </p>
                {!user ? (
                  <div className="space-y-2">
                    <p>Did you create them on another device?</p>
                    <Link href="/auth">
                      <Button>Log In to Sync</Button>
                    </Link>
                  </div>
                ) : (
                  <Link href="/">
                    <Button>Create Your First Event</Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <Card key={event.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle className="text-xl">{event.title}</CardTitle>
                      {/* Status Badge */}
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        Active
                      </span>
                    </div>
                    <CardDescription>
                      <div className="flex flex-col gap-1 mt-1">
                        <span className="flex items-center gap-2">
                          <Calendar className="h-3 w-3" /> {formatDate(event.date)}
                        </span>
                        <span className="flex items-center gap-2">
                          <MapPin className="h-3 w-3" /> {event.location}
                        </span>
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-3 mt-2">
                      <Link href={`/e/${event.id}`} className="flex-1">
                        <Button variant="outline" className="w-full">
                          View Page
                        </Button>
                      </Link>
                      {/* Pass the Key if we have it, otherwise page might handle it via auth */}
                      <Link 
                        href={`/manage/${event.id}?key=${event.management_key || ''}`} 
                        className="flex-1"
                      >
                        <Button className="w-full">
                          <Settings className="mr-2 h-4 w-4" />
                          Stats & Edit
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
