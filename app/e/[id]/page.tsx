import { createClient } from '@/lib/supabase/server'
import { GuestForm } from '@/components/guest-form'
import { ShareCard } from '@/components/share-card'
import { ManageButton } from '@/components/manage-button'
import { AddToCalendar } from '@/components/add-to-calendar'
import { Footer } from '@/components/footer'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Calendar, MapPin, Users, ChevronDown, Clock } from 'lucide-react'
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

  // 1. Check if it's a UUID (Old Link) or Short Code (New Link)
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)

  // 2. CRITICAL: Fetch 'banner_url', 'theme', 'description', etc.
  let query = supabase
    .from('events')
    .select('id, title, date, location, bank_details, price_per_adult, price_per_child, user_id, theme, short_code, description, banner_url')

  if (isUUID) {
    query = query.eq('id', id)
  } else {
    query = query.eq('short_code', id)
  }

  const { data: event, error } = await query.single()

  if (error || !event) {
    notFound()
  }

  const { data: guests } = await supabase
    .from('guests')
    .select('*')
    .eq('event_id', event.id)
    .order('created_at', { ascending: true })

  const { data: { user } } = await supabase.auth.getUser()
  const isOrganizer = user && event.user_id === user.id

  const eventDate = new Date(event.date)
  const dateStr = eventDate.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })
  const timeStr = eventDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })

  // Theme Logic
  const themes = {
    minimal: { bg: "bg-[#F7F6F3]", header: "bg-[#0F172A]", text: "text-[#0F172A]" },
    christmas: { bg: "bg-[#FEF2F2]", header: "bg-red-700", text: "text-red-900" },
    diwali: { bg: "bg-[#FFFBEB]", header: "bg-amber-600", text: "text-amber-900" },
    birthday: { bg: "bg-[#EFF6FF]", header: "bg-blue-600", text: "text-blue-900" }
  }
  
  // @ts-ignore
  const currentTheme = themes[event.theme] || themes.minimal

  return (
    <div className={`min-h-screen flex flex-col items-center font-sans ${currentTheme.bg} transition-colors duration-500 selection:bg-black selection:text-white`}>
      
      {/* Background Pattern */}
      <div className="fixed inset-0 h-full w-full pointer-events-none z-0 opacity-[0.4]" 
           style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
      </div>

      {/* HEADER with Dark Background - Matching Home Page */}
      <header className="relative z-10 w-full bg-[#0F172A] py-4 flex justify-center">
         <div className="w-full max-w-md px-6 flex justify-center">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity group">
               <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-[#0F172A] font-bold text-xl shadow-lg shadow-white/10 group-hover:scale-110 transition-transform">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                     <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                     <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                  </svg>
               </div>
               <span className="font-bold text-xl tracking-tight text-white">The Invite Link</span>
            </Link>
         </div>
      </header>

      <main className="relative z-10 w-full max-w-[420px] px-4 mb-12 mt-4">
        
        {/* THE INVITE CARD */}
        <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-100 ring-1 ring-black/5">
          
          {/* BANNER IMAGE - Reduced height to prevent scrolling */}
          {event.banner_url && (
            <div className="relative w-full h-32 sm:h-40 bg-slate-100">
               <img 
                 src={event.banner_url} 
                 alt="Event Banner" 
                 className="w-full h-full object-cover"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
          )}

          {/* Card Header - More compact */}
          <div className={`${currentTheme.header} p-6 sm:p-7 text-center text-white relative overflow-hidden`}>
             {isOrganizer && (
                <div className="absolute top-4 right-4 z-20">
                  <div className="[&>a>button]:bg-white/10 [&>a>button]:text-white [&>a>button]:border-white/20 [&>a>button]:hover:bg-white/20 [&>a>button]:h-8 [&>a>button]:text-xs">
                    <ManageButton eventId={event.id} />
                  </div>
                </div>
             )}
             
             <h1 className="text-2xl sm:text-3xl font-extrabold mb-2 leading-tight tracking-tight relative z-10">{event.title}</h1>
             
             <div className="inline-flex flex-col gap-1 mt-1.5 text-xs sm:text-sm font-medium text-white/90 relative z-10">
                <div className="flex items-center justify-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 opacity-80" /> 
                  <span>{dateStr}</span>
                </div>
                <div className="flex items-center justify-center gap-1.5">
                   <Clock className="w-3.5 h-3.5 opacity-80" />
                   <span>{timeStr}</span>
                </div>
                <div className="flex items-center justify-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 opacity-80" /> 
                  <span className="max-w-[280px] truncate">{event.location}</span>
                </div>
                
                <div className="mt-2 pt-2 border-t border-white/20 w-full flex justify-center">
                   <div className="[&>button]:bg-white/10 [&>button]:text-white [&>button]:border-white/20 [&>button]:hover:bg-white/20 [&>button]:h-7 [&>button]:text-xs [&>button]:px-3">
                      <AddToCalendar event={event} />
                   </div>
                </div>
             </div>
          </div>

          {/* Card Body - Reduced padding */}
          <div className="p-5 sm:p-6">
            
            {/* Organizer Controls */}
            {isOrganizer && (
              <details className="mb-4 group bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
                <summary className="flex items-center justify-between px-3 py-2 cursor-pointer list-none text-xs font-bold text-slate-500 uppercase tracking-wider hover:bg-slate-100 transition-colors">
                  Organizer Controls
                  <ChevronDown className="w-3.5 h-3.5 transition-transform group-open:rotate-180" />
                </summary>
                <div className="p-3 border-t border-slate-200 bg-white">
                  <ShareCard
                    eventId={event.id}
                    shortCode={event.short_code}
                    eventTitle={event.title}
                    eventDate={event.date}
                    eventLocation={event.location}
                  />
                </div>
              </details>
            )}

            {/* Personal Note - More compact */}
            {event.description && (
              <div className="mb-4 text-center px-2">
                <p className="text-base sm:text-lg font-medium text-slate-600 italic leading-relaxed">
                  "{event.description}"
                </p>
              </div>
            )}

            <GuestForm
              eventId={event.id}
              pricePerAdult={event.price_per_adult || 0}
              pricePerChild={event.price_per_child || 0}
              bankDetails={event.bank_details || ''}
            />
          </div>

          {/* Guest List */}
          {guests && guests.length > 0 && (
            <div className="bg-slate-50 border-t border-slate-100 p-6">
              <div className="flex items-center justify-center gap-2 mb-4 opacity-50">
                <Users className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Who is in? ({guests.length})</span>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {guests.map((guest) => (
                  <span key={guest.id} className="inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-medium bg-white border border-slate-200 text-slate-700 shadow-sm">
                    {guest.name}
                    {(guest.adult_count + guest.kid_count) > 1 && (
                      <span className="ml-1.5 text-[10px] font-bold bg-slate-100 text-slate-500 px-1.5 rounded-full border border-slate-200">
                        +{guest.adult_count + guest.kid_count - 1}
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          )}
        
        </div>
      </main>
      
      <div className="pb-8 opacity-50 text-xs text-slate-500 hover:opacity-100 transition-opacity">
        <Footer />
      </div>
    </div>
  )
}
