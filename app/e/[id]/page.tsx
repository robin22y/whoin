import { createClient } from '@/lib/supabase/server'
import { GuestForm } from '@/components/guest-form'
import { ShareCard } from '@/components/share-card'
import { ManageButton } from '@/components/manage-button'
import { Footer } from '@/components/footer'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, MapPin, Users } from 'lucide-react'

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
      details: `Location: ${event.location}\n\n${event.description || ''}`,
      location: event.location,
    })
    
    return `https://calendar.google.com/calendar/render?${params.toString()}`
  }

  // Theme Logic
  const themes = {
    minimal: {
      bg: "bg-[#F7F6F3]",
      pattern: "radial-gradient(#e5e7eb 1px, transparent 1px)",
      header: "bg-slate-900",
      text: "text-slate-900"
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
    <div className={`min-h-screen flex flex-col items-center px-4 font-sans ${currentTheme.bg} transition-colors duration-500`}>
      
      {/* Background Pattern */}
      <div className="fixed inset-0 h-full w-full pointer-events-none z-0 opacity-[0.4]" 
           style={{ backgroundImage: currentTheme.pattern, backgroundSize: '24px 24px' }}>
      </div>

      {/* NEW BRAND HEADER */}
      <header className="relative z-10 w-full max-w-md flex justify-between items-center py-6">
        <Link href="/" className="flex items-center gap-2 group hover:opacity-80 transition-opacity">
           <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-sm ${currentTheme.header}`}>
              W
            </div>
            <span className={`font-bold text-xl tracking-tight ${currentTheme.text}`}>Whozin</span>
        </Link>
      </header>

      <main className="relative z-10 w-full max-w-md bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-2xl overflow-hidden border border-white/50 ring-1 ring-black/5 mb-12">
        
        {/* EVENT HEADER */}
        <div className={`${currentTheme.header} text-white p-8 text-center relative transition-colors duration-500`}>
          {isOrganizer && (
            <div className="absolute top-4 right-4">
              <div className="[&>a>button]:bg-white/10 [&>a>button]:text-white [&>a>button]:border-white/20 [&>a>button]:hover:bg-white/20">
                <ManageButton eventId={event.id} />
              </div>
            </div>
          )}
          <h1 className="text-3xl font-bold mb-4 leading-tight">{event.title}</h1>
          
          <div className="flex flex-col items-center gap-2 text-white/80 text-sm font-medium">
            <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-full backdrop-blur-sm">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatDate(event.date)}</span>
            </div>
            <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-full backdrop-blur-sm">
              <MapPin className="w-3.5 h-3.5" />
              <span>{event.location}</span>
            </div>
          </div>
        </div>

        {/* Calendar Add Button */}
        <div className="px-6 pt-4 pb-2">
          <a
            href={generateCalendarUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Calendar className="w-4 h-4" />
            Add to Calendar
          </a>
        </div>

        <div className="p-6 sm:p-8 space-y-8">
          
          {/* WORD ART NOTE */}
          {event.description && (
            <div className="relative py-6 px-4 text-center group perspective-1000">
               <div className="relative inline-block transform transition-transform duration-500 hover:scale-105 hover:rotate-2 cursor-default">
                  {/* Glow Background */}
                  <div className={`absolute -inset-4 opacity-20 blur-xl rounded-[50%] ${
                      // @ts-ignore
                      event.theme === 'christmas' ? 'bg-red-500' :
                      // @ts-ignore
                      event.theme === 'diwali' ? 'bg-amber-400' :
                      // @ts-ignore
                      event.theme === 'birthday' ? 'bg-blue-400' :
                      'bg-pink-400'
                  }`}></div>

                  {/* Text with Gradient */}
                  <p className="relative text-2xl sm:text-3xl font-bold leading-tight tracking-tight"
                     style={{
                       background: 
                         // @ts-ignore
                         event.theme === 'christmas' ? 'linear-gradient(to bottom right, #ef4444, #b91c1c)' :
                         // @ts-ignore
                         event.theme === 'diwali' ? 'linear-gradient(to bottom right, #d97706, #b45309)' :
                         // @ts-ignore
                         event.theme === 'birthday' ? 'linear-gradient(to bottom right, #2563eb, #1e40af)' :
                         'linear-gradient(to bottom right, #1f2937, #000000)',
                       WebkitBackgroundClip: 'text',
                       WebkitTextFillColor: 'transparent',
                       filter: 'drop-shadow(2px 4px 0px rgba(0,0,0,0.05))'
                     }}
                  >
                    " {event.description} "
                  </p>
               </div>
            </div>
          )}

          {/* Organizer Share Control */}
          {isOrganizer && (
            <div className="mb-8 p-1 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner">
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 text-center">Organizer Controls</p>
                <ShareCard
                  eventId={event.id}
                  shortCode={event.short_code}
                  eventTitle={event.title}
                  eventDate={event.date}
                  eventLocation={event.location}
                />
              </div>
            </div>
          )}

          <GuestForm
            eventId={event.id}
            pricePerAdult={event.price_per_adult || 0}
            pricePerChild={event.price_per_child || 0}
            bankDetails={event.bank_details || ''}
          />

          {guests && guests.length > 0 && (
            <div className="pt-8 border-t border-slate-200">
              <div className={`flex items-center justify-center gap-2 mb-6 ${currentTheme.text} opacity-70`}>
                <Users className="w-4 h-4" />
                <span className="text-sm font-semibold uppercase tracking-wider">Attendees ({guests.length})</span>
              </div>
              <div className="space-y-2">
                {guests.map((guest) => (
                  <div key={guest.id} className="flex items-center justify-between px-4 py-2 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="font-medium text-slate-900">{guest.name}</span>
                    <span className="text-sm text-slate-600">
                      {guest.adult_count} adult{guest.adult_count !== 1 ? 's' : ''}
                      {guest.kid_count > 0 && `, ${guest.kid_count} kid${guest.kid_count !== 1 ? 's' : ''}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trust Signal */}
          <div className="pt-6 mt-6 border-t border-slate-200">
            <p className="text-xs text-slate-500 text-center flex items-center justify-center gap-1">
              <span>🔒</span>
              <span>Your data is private and auto-deleted in 30 days.</span>
            </p>
          </div>
        </div>
      </main>
      
      <div className="opacity-60 hover:opacity-100 transition-opacity pb-8">
        <Footer />
      </div>
    </div>
  )
}
