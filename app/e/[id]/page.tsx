import { createClient } from '@/lib/supabase/server'
import { GuestForm } from '@/components/guest-form'
import { ShareCard } from '@/components/share-card'
import { ManageButton } from '@/components/manage-button'
import { AddToCalendar } from '@/components/add-to-calendar'
import { BrandLogo } from '@/components/brand-logo'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, MapPin, Users, ChevronDown, Clock, ShieldAlert } from 'lucide-react'

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

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
  let query = supabase.from('events').select('id, title, date, location, bank_details, price_per_adult, price_per_child, user_id, theme, short_code, description, banner_url, is_suspended')
  if (isUUID) query = query.eq('id', id)
  else query = query.eq('short_code', id)
  const { data: event, error } = await query.single()

  if (error || !event) notFound()

  // @ts-ignore
  if (event.is_suspended) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <ShieldAlert className="w-8 h-8 text-red-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Event Suspended</h1>
        <p className="text-slate-500 max-w-md">
          This event has been flagged for violating our terms of service or due to a safety report. 
          The invite link is no longer active.
        </p>
        <Link href="/" className="mt-8">
          <Button>Go Home</Button>
        </Link>
      </div>
    )
  }

  const { data: guests } = await supabase.from('guests').select('*').eq('event_id', event.id).order('created_at', { ascending: true })
  const { data: { user } } = await supabase.auth.getUser()
  const isOrganizer = user && event.user_id === user.id

  // Date Formatting
  const eventDate = new Date(event.date)
  const dateStr = eventDate.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })
  const timeStr = eventDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })

  // Theme Colors (Gradients)
  const themes = {
    minimal: "bg-gradient-to-b from-slate-900 to-slate-800",
    christmas: "bg-gradient-to-b from-red-900 to-red-800",
    diwali: "bg-gradient-to-b from-amber-900 to-amber-800",
    birthday: "bg-gradient-to-b from-blue-900 to-blue-800"
  }
  // @ts-ignore
  const themeBg = themes[event.theme] || themes.minimal

  return (
    <div className="min-h-screen bg-[#F7F6F3] font-sans selection:bg-slate-900 selection:text-white">
      
      {/* --- IMMERSIVE HEADER --- */}
      <div className={`relative w-full ${themeBg} text-white pt-10 pb-32 px-6 overflow-hidden`}>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10" 
             style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
        </div>

        {/* Top Bar */}
        <div className="relative z-10 flex justify-between items-center max-w-4xl mx-auto mb-12">
          <Link href="/" className="flex items-center gap-3 group hover:opacity-90 transition-opacity">
            {/* White Box, Navy Icon, Bigger Size (w-8 h-8) */}
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-[#0F172A] shadow-lg shadow-black/5 group-hover:scale-105 transition-transform">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
              </svg>
            </div>
            {/* White Text with Shadow (Readable on all themes) */}
            <span className="font-bold text-xl tracking-tight text-white drop-shadow-md">The Invite Link</span>
          </Link>
          {isOrganizer && (
             <div className="[&>a>button]:bg-white/10 [&>a>button]:text-white [&>a>button]:border-white/20 [&>a>button]:hover:bg-white/20">
                <ManageButton eventId={event.id} />
             </div>
          )}
        </div>

        {/* Event Hero Info */}
        <div className="relative z-10 text-center max-w-2xl mx-auto space-y-6">
           <h1 className="text-5xl sm:text-6xl font-serif font-bold leading-tight tracking-tight drop-shadow-md">
             {event.title}
           </h1>
           
           <div className="inline-flex flex-wrap justify-center gap-3 sm:gap-6 text-sm sm:text-base font-medium text-white/90">
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/10">
                <Calendar className="w-4 h-4" /> {dateStr}
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/10">
                <Clock className="w-4 h-4" /> {timeStr}
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/10">
                <MapPin className="w-4 h-4" /> {event.location}
              </div>
           </div>

           {/* Note / Description */}
           {event.description && (
             <p className="text-lg sm:text-xl text-white/80 italic font-serif max-w-lg mx-auto leading-relaxed">
               "{event.description}"
             </p>
           )}

           <div className="pt-2 opacity-80 hover:opacity-100 transition-opacity">
              <AddToCalendar event={event} />
           </div>
        </div>
      </div>

      {/* --- FLOATING CONTENT CARD --- */}
      <main className="relative z-20 -mt-20 px-4 pb-20">
        <div className="w-full max-w-[480px] mx-auto bg-white rounded-[2.5rem] shadow-2xl shadow-slate-900/10 border border-slate-100 overflow-hidden">
           
           {/* Banner Image (If exists) */}
           {event.banner_url && (
             <div className="h-48 sm:h-56 w-full relative">
                <img src={event.banner_url} alt="Cover" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
             </div>
           )}

           <div className="p-6 sm:p-10">
              
              {/* Organizer Tools (Collapsible) */}
              {isOrganizer && (
                <div className="mb-8 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                   <details className="group">
                      <summary className="flex items-center justify-between cursor-pointer list-none text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Organizer Controls
                        <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
                      </summary>
                      <div className="pt-4 mt-2 border-t border-slate-200">
                        <ShareCard eventId={event.id} shortCode={event.short_code} eventTitle={event.title} eventDate={event.date} eventLocation={event.location} />
                      </div>
                   </details>
                </div>
              )}

              {/* THE FORM */}
              <GuestForm 
                eventId={event.id} 
                pricePerAdult={event.price_per_adult || 0} 
                pricePerChild={event.price_per_child || 0} 
                bankDetails={event.bank_details || ''} 
              />

           </div>

           {/* Guest List Footer */}
           {isOrganizer && guests && guests.length > 0 && (
             <div className="bg-slate-50 border-t border-slate-100 p-6 sm:p-8 text-center">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                  <Users className="w-3 h-3 inline mr-1" /> Who's in? ({guests.length})
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {guests.map((guest) => (
                    <div key={guest.id} className="px-3 py-1.5 bg-white rounded-xl border border-slate-200 shadow-sm text-sm font-medium text-slate-700">
                      {guest.name}
                      {(guest.adult_count + guest.kid_count) > 1 && 
                        <span className="ml-1.5 text-xs text-slate-400">+{guest.adult_count + guest.kid_count - 1}</span>
                      }
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
