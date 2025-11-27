import { createClient } from '@/lib/supabase/server'
import { GuestForm } from '@/components/guest-form'
import { ShareCard } from '@/components/share-card'
import { ManageButton } from '@/components/manage-button'
import { Footer } from '@/components/footer'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, MapPin, Users, ChevronDown } from 'lucide-react'

// ... (keep metadata and helper functions same as before) ...

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

  // ... (keep query logic same) ...
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)

  let query = supabase
    .from('events')
    .select('id, title, date, location, bank_details, price_per_adult, price_per_child, user_id, theme, short_code, description')

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Generate Google Calendar URL
  const generateCalendarUrl = () => {
    const startDate = new Date(event.date)
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000) // 2 hours later
    
    const formatCalendarDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    }
    
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: event.title,
      dates: `${formatCalendarDate(startDate)}/${formatCalendarDate(endDate)}`,
      details: `Location: ${event.location}${event.description ? `\n\n${event.description}` : ''}`,
      location: event.location,
    })
    
    return `https://calendar.google.com/calendar/render?${params.toString()}`
  }

  // Theme Logic (Updated to match new style if needed)
  const themes = {
    minimal: {
      bg: "bg-[#F7F6F3]",
      pattern: "radial-gradient(#e5e7eb 1px, transparent 1px)",
      header: "bg-[#0F172A]", // Navy
      text: "text-[#0F172A]"
    },
    christmas: {
      bg: "bg-[#FEF2F2]",
      pattern: "radial-gradient(#FECACA 2px, transparent 2px)",
      header: "bg-red-700",
      text: "text-red-900"
    },
    diwali: {
      bg: "bg-[#FFFBEB]",
      pattern: "radial-gradient(#FCD34D 2px, transparent 2px)",
      header: "bg-amber-600",
      text: "text-amber-900"
    },
    birthday: {
      bg: "bg-[#EFF6FF]",
      pattern: "radial-gradient(#93C5FD 2px, transparent 2px)",
      header: "bg-blue-600",
      text: "text-blue-900"
    }
  }

  // @ts-ignore
  const currentTheme = themes[event.theme] || themes.minimal

  return (
    <div className={`min-h-screen flex flex-col items-center font-sans ${currentTheme.bg} transition-colors duration-500 selection:bg-black selection:text-white`}>
      
      {/* Background Pattern */}
      <div className="fixed inset-0 h-full w-full pointer-events-none z-0 opacity-[0.4]" 
           style={{ backgroundImage: currentTheme.pattern, backgroundSize: '24px 24px' }}>
      </div>

      {/* Global Brand Header */}
      <header className="relative z-10 w-full max-w-md py-6 flex justify-center">
         <Link href="/" className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
            <div className="w-6 h-6 bg-[#0F172A] rounded-md flex items-center justify-center text-white font-bold text-xs shadow-sm">
               {/* Simple SVG Icon */}
               <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
               </svg>
            </div>
            <span className="font-bold text-lg text-[#0F172A] tracking-tight">The Invite Link</span>
         </Link>
      </header>

      <main className="relative z-10 w-full max-w-[420px] px-4 mb-12">
        
        {/* THE INVITE CARD */}
        <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-100 ring-1 ring-black/5">
          
          {/* Card Header */}
          <div className={`${currentTheme.header} p-8 text-center text-white relative overflow-hidden`}>
             
             {/* Organizer Actions (Top Right) */}
             {isOrganizer && (
                <div className="absolute top-4 right-4 z-20">
                  <div className="[&>a>button]:bg-white/10 [&>a>button]:text-white [&>a>button]:border-white/20 [&>a>button]:hover:bg-white/20 [&>a>button]:h-8 [&>a>button]:text-xs">
                    <ManageButton eventId={event.id} />
                  </div>
                </div>
             )}
             
             <h1 className="text-3xl sm:text-4xl font-extrabold mb-3 leading-tight tracking-tight relative z-10">{event.title}</h1>
             
             <div className="inline-flex flex-col gap-1.5 mt-2 text-sm font-medium text-white/90 relative z-10">
                <div className="flex items-center justify-center gap-2">
                  <Calendar className="w-4 h-4 opacity-80" /> 
                  <span>{formatDate(event.date)}</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <MapPin className="w-4 h-4 opacity-80" /> 
                  <span>{event.location}</span>
                </div>
                
                {/* Add to Calendar Button */}
                <div className="mt-3 pt-3 border-t border-white/20 w-full flex justify-center">
                   <a
                     href={generateCalendarUrl()}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg text-white text-xs font-medium hover:bg-white/20 transition-colors"
                   >
                     <Calendar className="w-3.5 h-3.5" />
                     Add to Calendar
                   </a>
                </div>
             </div>
          </div>

          {/* Card Body */}
          <div className="p-6 sm:p-8">
            
            {/* ORGANIZER CONTROLS (Collapsed by default to reduce clutter) */}
            {isOrganizer && (
              <details className="mb-8 group bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
                <summary className="flex items-center justify-between px-4 py-3 cursor-pointer list-none text-xs font-bold text-slate-500 uppercase tracking-wider hover:bg-slate-100 transition-colors">
                  Organizer: Share Link
                  <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
                </summary>
                <div className="p-4 border-t border-slate-200 bg-white">
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

            {/* Personal Note */}
            {event.description && (
              <div className="mb-8 text-center px-4">
                <p className="text-lg font-medium text-slate-600 italic leading-relaxed">
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

          {/* Guest List Footer */}
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