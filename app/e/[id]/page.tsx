import { createClient } from '@/lib/supabase/server'
import { GuestForm } from '@/components/guest-form'
import { ShareCard } from '@/components/share-card'
import { ManageButton } from '@/components/manage-button'
import { Footer } from '@/components/footer'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
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

  // Check if it's a UUID or Short Code
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)

  let query = supabase
    .from('events')
    .select('id, title, date, location, bank_details, price_per_adult, price_per_child, user_id, theme, short_code')

  if (isUUID) {
    query = query.eq('id', id)
  } else {
    query = query.eq('short_code', id)
  }

  const { data: event, error } = await query.single()

  if (error || !event) {
    notFound()
  }

  // Fetch guests
  const { data: guests } = await supabase
    .from('guests')
    .select('*')
    .eq('event_id', event.id) // Use the actual UUID from the event data
    .order('created_at', { ascending: true })

  // Check if current user is the organizer
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

  // Define themes
  const themes = {
    minimal: {
      bg: "bg-[#F7F6F3]",
      pattern: "radial-gradient(#e5e7eb 1px, transparent 1px)",
      accent: "bg-slate-900", // Header color
    },
    christmas: {
      bg: "bg-[#FEF2F2]", // Very light red
      pattern: "radial-gradient(#FECACA 2px, transparent 2px)", // Reddish dots (Snow-ish)
      accent: "bg-red-700",
    },
    diwali: {
      bg: "bg-[#FFFBEB]", // Very light amber
      pattern: "radial-gradient(#FCD34D 2px, transparent 2px)", // Gold dots
      accent: "bg-amber-700",
    },
    birthday: {
      bg: "bg-[#EFF6FF]", // Very light blue
      pattern: "radial-gradient(#93C5FD 2px, transparent 2px)", // Blue dots
      accent: "bg-blue-600",
    }
  }

  // Get current theme (fallback to minimal)
  const currentTheme = themes[event.theme as keyof typeof themes] || themes.minimal

  return (
    <div className={`min-h-screen flex flex-col items-center py-8 sm:py-12 px-4 font-sans ${currentTheme.bg}`}>
      
      {/* Dynamic Pattern */}
      <div className="fixed inset-0 h-full w-full pointer-events-none z-0 opacity-[0.4]" 
           style={{ backgroundImage: currentTheme.pattern, backgroundSize: '24px 24px' }}>
      </div>

      <main className="relative z-10 w-full max-w-md bg-white rounded-[2rem] shadow-xl overflow-hidden border border-slate-200/60">
        
        {/* HEADER: Dynamic Color */}
        <div className={`${currentTheme.accent} text-white p-8 text-center relative`}>
          {isOrganizer && (
            <div className="absolute top-4 right-4">
              <ManageButton eventId={event.id} />
            </div>
          )}
          <h1 className="text-3xl font-bold mb-4 leading-tight">{event.title}</h1>
          
          <div className="flex flex-col items-center gap-2 text-slate-300 text-sm font-medium">
            <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-full">
              <Calendar className="w-4 h-4 text-blue-400" />
              <span>{formatDate(event.date)}</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-full">
              <MapPin className="w-4 h-4 text-red-400" />
              <span>{event.location}</span>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-8">
          
          {/* Organizer Share Card (Only visible to Admin) */}
          {isOrganizer && (
            <div className="mb-6">
              <ShareCard
                eventId={event.id}
                shortCode={event.short_code || undefined}
                eventTitle={event.title}
                eventDate={event.date}
                eventLocation={event.location}
              />
            </div>
          )}

          {/* THE FORM */}
          <GuestForm
            eventId={event.id}
            pricePerAdult={event.price_per_adult || 0}
            pricePerChild={event.price_per_child || 0}
            bankDetails={event.bank_details || ''}
          />

          {/* GUEST LIST (Simple "Who's coming") */}
          {guests && guests.length > 0 && (
            <div className="pt-8 border-t border-dashed border-slate-200">
              <div className="flex items-center justify-center gap-2 mb-6 text-slate-400">
                <Users className="w-4 h-4" />
                <span className="text-sm font-semibold uppercase tracking-wider">Who is in? ({guests.length})</span>
              </div>
              
              <div className="flex flex-wrap justify-center gap-2">
                {guests.map((guest) => (
                  <span 
                    key={guest.id} 
                    className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-slate-50 text-slate-700 border border-slate-100"
                  >
                    {guest.name}
                    {(guest.adult_count + guest.kid_count) > 1 && (
                      <span className="ml-1.5 text-xs bg-slate-200 text-slate-600 px-1.5 rounded-full">
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
      
      <div className="mt-12 opacity-60 hover:opacity-100 transition-opacity">
        <Footer />
      </div>
    </div>
  )
}
