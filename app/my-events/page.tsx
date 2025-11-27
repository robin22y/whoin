'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Footer } from '@/components/footer'
import { Calendar, MapPin, Settings, LogIn, Plus, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { LogoutButton } from '@/components/logout-button'

export default function MyEventsPage() {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    async function loadEvents() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      let dbEvents: any[] = []
      
      if (user) {
        const { data } = await supabase
          .from('events')
          .select('id, title, date, location, management_key, created_at, short_code')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
        
        if (data) dbEvents = data
      }

      const localEvents = JSON.parse(localStorage.getItem('my_events') || '[]')

      // Create a Map where 'ID' is the key (automatically removes duplicates)
      // We put local first, then overwrite with DB events (so DB is the source of truth)
      const eventMap = new Map([...localEvents, ...dbEvents].map(e => [e.id, e]))

      // Convert back to array and sort
      const allEvents = Array.from(eventMap.values())
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

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
    })
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F6F3] text-slate-900 font-sans">
      
      {/* Background Pattern */}
      <div className="fixed inset-0 h-full w-full pointer-events-none z-0 opacity-[0.4]" 
           style={{ backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
      </div>

      {/* HEADER */}
      <header className="relative z-20 w-full px-6 py-4 flex items-center justify-between border-b border-slate-200/60 bg-white/40 backdrop-blur-md sticky top-0">
        <Link href="/" className="flex items-center gap-2 group hover:opacity-80 transition-opacity">
           <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold text-xl">
              W
            </div>
            <span className="font-bold text-xl tracking-tight">Whozin</span>
        </Link>
        
        <div className="flex items-center gap-2">
           {user ? (
             <LogoutButton />
           ) : (
             <Link href="/auth">
               <Button size="sm" className="bg-black text-white hover:bg-slate-800">
                 <LogIn className="mr-2 h-4 w-4" />
                 Log In
               </Button>
             </Link>
           )}
        </div>
      </header>

      <main className="relative z-10 flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-12">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2">My Events</h1>
            <p className="text-slate-500 font-medium">
              {loading ? 'Loading...' : `${events.length} active events`}
            </p>
          </div>
          
          <Link href="/">
            <Button size="lg" className="rounded-full h-12 px-6 shadow-lg shadow-blue-900/20 hover:shadow-xl hover:scale-105 transition-all bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="mr-2 h-5 w-5" />
              New Event
            </Button>
          </Link>
        </div>

        {loading ? (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {[1,2,3].map(i => (
               <div key={i} className="h-48 rounded-3xl bg-white/50 animate-pulse" />
             ))}
           </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20 bg-white/60 backdrop-blur-sm rounded-[2.5rem] border border-white/60 shadow-sm">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No events yet</h3>
            <p className="text-slate-500 max-w-xs mx-auto mb-8">
              Create your first event page in 30 seconds and share it with your friends.
            </p>
            <Link href="/">
              <Button size="lg" variant="outline" className="rounded-full h-12 px-8 border-slate-300 hover:border-black hover:bg-transparent">
                Create Event
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div 
                key={event.id} 
                className="group relative bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-100"
              >
                {/* Card Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-xl text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {event.title}
                    </h3>
                    {/* Badge */}
                    {user && event.management_key ? (
                       <span className="inline-flex mt-2 items-center px-2 py-0.5 rounded text-[10px] font-bold bg-green-50 text-green-700 border border-green-100 uppercase tracking-wider">
                         Cloud Synced
                       </span>
                    ) : (
                       <span className="inline-flex mt-2 items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-100 uppercase tracking-wider">
                         Local Device
                       </span>
                    )}
                  </div>
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                    <Calendar className="w-5 h-5" />
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2 mb-8">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Calendar className="w-4 h-4 opacity-50" />
                    <span>{formatDate(event.date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <MapPin className="w-4 h-4 opacity-50" />
                    <span className="line-clamp-1">{event.location}</span>
                  </div>
                </div>

                {/* Action Footer */}
                <div className="pt-4 border-t border-slate-100 flex gap-3">
                   <Link href={`/manage/${event.id}?key=${event.management_key || ''}`} className="flex-1">
                      <Button variant="default" className="w-full rounded-xl bg-black text-white hover:bg-slate-800">
                        <Settings className="w-4 h-4 mr-2" />
                        Manage
                      </Button>
                   </Link>
                   <Link href={`/e/${event.short_code || event.id}`} className="flex-none">
                      <Button variant="outline" size="icon" className="rounded-xl border-slate-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600">
                        <ArrowRight className="w-5 h-5" />
                      </Button>
                   </Link>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* Login Prompt Footer */}
        {!user && !loading && events.length > 0 && (
          <div className="mt-12 p-6 bg-blue-50/50 border border-blue-100 rounded-2xl text-center backdrop-blur-sm">
            <p className="text-sm text-blue-900 mb-3">
              These events are only saved on this device. 
              <br/>Log in to sync them to the cloud and manage them anywhere.
            </p>
            <Link href="/auth">
              <Button size="sm" variant="outline" className="bg-white border-blue-200 text-blue-700 hover:bg-blue-50">
                <LogIn className="mr-2 h-3 w-3" />
                Sync to Cloud
              </Button>
            </Link>
          </div>
        )}

      </main>
      
      <div className="relative z-10 border-t border-slate-200/60 bg-white/40 backdrop-blur-md">
        <Footer />
      </div>
    </div>
  )
}