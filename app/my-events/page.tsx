'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Footer } from '@/components/footer'
import { Calendar, MapPin, Settings, LogIn, Plus, ArrowRight, Cloud, Smartphone } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { LogoutButton } from '@/components/logout-button'
import Image from 'next/image'

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
          .select('id, title, date, location, management_key, created_at, short_code, banner_url')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
        
        if (data) dbEvents = data
      }

      const localEvents = JSON.parse(localStorage.getItem('my_events') || '[]')

      const allEvents = [...dbEvents]
      localEvents.forEach((localEv: any) => {
        if (!allEvents.find(dbEv => dbEv.id === localEv.id)) {
          allEvents.push(localEv)
        }
      })

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
    })
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F6F3] text-slate-900 font-sans">
      
      {/* --- NAVY HEADER BACKGROUND --- */}
      <div className="absolute top-0 left-0 right-0 h-72 bg-[#0F172A] -z-0">
         <div className="absolute inset-0 opacity-10" 
             style={{ backgroundImage: 'linear-gradient(#94a3b8 1px, transparent 1px), linear-gradient(to right, #94a3b8 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
        </div>
      </div>

      {/* HEADER */}
      <header className="relative z-20 w-full px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group hover:opacity-80 transition-opacity">
           <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-[#0F172A] font-bold text-xl shadow-lg">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
              </svg>
            </div>
            <span className="font-bold text-xl tracking-tight text-white">The Invite Link</span>
        </Link>
        
        <div className="flex items-center gap-2">
           {user ? (
             <LogoutButton />
           ) : (
             <Link href="/auth">
               <Button size="sm" className="bg-white text-[#0F172A] hover:bg-blue-50 font-semibold">
                 <LogIn className="mr-2 h-4 w-4" />
                 Log In
               </Button>
             </Link>
           )}
        </div>
      </header>

      <main className="relative z-10 flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-8">
        
        {/* PAGE TITLE ROW */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-10 text-white">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight mb-2">My Events</h1>
            <p className="text-blue-200 font-medium text-lg">
              {loading ? 'Loading...' : `${events.length} active events`}
            </p>
          </div>
          
          <Link href="/">
            <Button size="lg" className="rounded-full h-12 px-6 shadow-xl bg-white text-[#0F172A] hover:bg-blue-50 font-bold transition-transform hover:scale-105">
              <Plus className="mr-2 h-5 w-5" />
              Create New Event
            </Button>
          </Link>
        </div>

        {/* EMPTY STATE */}
        {!loading && events.length === 0 && (
          <div className="text-center py-24 bg-white rounded-[2rem] shadow-sm border border-slate-200">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">No events yet</h3>
            <p className="text-slate-500 max-w-md mx-auto mb-8 text-lg">
              Ready to get started? Create your first event page in seconds and share it with your friends.
            </p>
            <Link href="/">
              <Button size="lg" className="rounded-full h-14 px-8 text-lg bg-[#0F172A] text-white hover:bg-slate-800">
                Create First Event
              </Button>
            </Link>
          </div>
        )}

        {/* EVENTS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div 
                key={event.id} 
                className="group relative bg-white rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-200 flex flex-col h-full overflow-hidden"
              >
                {/* Banner Image */}
                {event.banner_url && (
                  <div className="relative h-40 w-full bg-slate-100">
                    <Image 
                      src={event.banner_url} 
                      alt={event.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60"></div>
                  </div>
                )}

                <div className="p-6 flex flex-col flex-1">
                {/* Card Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1 pr-4">
                    <h3 className="font-bold text-xl text-slate-900 line-clamp-1 mb-2 group-hover:text-blue-600 transition-colors">
                      {event.title}
                    </h3>
                    
                    {/* Status Badge */}
                    {user && event.management_key ? (
                       <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wider">
                         <Cloud className="w-3 h-3" /> Synced
                       </div>
                    ) : (
                       <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-amber-50 text-amber-700 text-[10px] font-bold uppercase tracking-wider">
                         <Smartphone className="w-3 h-3" /> Local Only
                       </div>
                    )}
                  </div>
                  
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex flex-col items-center justify-center text-slate-500 font-bold border border-slate-100 group-hover:border-blue-100 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                    <span className="text-xs uppercase">{new Date(event.date).toLocaleString('en-GB', { month: 'short' })}</span>
                    <span className="text-lg leading-none">{new Date(event.date).getDate()}</span>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-8 font-medium">
                  <MapPin className="w-4 h-4 opacity-50" />
                  <span className="line-clamp-1">{event.location}</span>
                </div>

                {/* Action Footer (Pushed to bottom) */}
                <div className="mt-auto pt-4 border-t border-slate-100 flex gap-3">
                   <Link href={`/manage/${event.id}?key=${event.management_key || ''}`} className="flex-1">
                      <Button variant="outline" className="w-full rounded-xl border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 font-semibold">
                        <Settings className="w-4 h-4 mr-2" />
                        Manage
                      </Button>
                   </Link>
                   <Link href={`/e/${event.short_code || event.id}`} className="flex-none">
                      <Button size="icon" className="rounded-xl bg-[#0F172A] text-white hover:bg-slate-800 shadow-md">
                        <ArrowRight className="w-5 h-5" />
                      </Button>
                   </Link>
                </div>
                </div>

              </div>
            ))}
        </div>

        {/* Login Prompt Footer */}
        {!user && !loading && events.length > 0 && (
          <div className="mt-16 p-8 bg-white border border-slate-200 rounded-3xl text-center shadow-sm max-w-2xl mx-auto">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Sync your events</h3>
            <p className="text-slate-500 mb-6 leading-relaxed">
              These events are only saved on this specific device. <br/>
              Log in to save them to the cloud and manage them from anywhere.
            </p>
            <Link href="/auth">
              <Button className="rounded-full bg-[#0F172A] text-white hover:bg-slate-800 px-8 h-12 text-base font-semibold">
                <LogIn className="mr-2 h-4 w-4" />
                Log In / Sign Up
              </Button>
            </Link>
          </div>
        )}

      </main>
      
      <div className="relative z-10 border-t border-slate-200 bg-white mt-auto">
        <Footer />
      </div>
    </div>
  )
}