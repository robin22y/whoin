import { ImageResponse } from 'next/og'
import { createClient } from '@/lib/supabase/server'

// Image metadata
export const alt = 'Event Invitation'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { id } = await params
  
  // Logic to find event by UUID or ShortCode
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
  
  let query = supabase.from('events').select('title, date, location, theme')
  
  if (isUUID) {
    query = query.eq('id', id)
  } else {
    query = query.eq('short_code', id)
  }
  
  const { data: event } = await query.single()
  
  if (!event) {
    return new ImageResponse(
      (
        <div style={{
            background: '#F7F6F3',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: 80,
        }}>
          WhoIn.uk
        </div>
      )
    )
  }

  // Format Date
  const dateStr = new Date(event.date).toLocaleDateString('en-GB', { 
      weekday: 'long', day: 'numeric', month: 'short' 
  })
  const timeStr = new Date(event.date).toLocaleTimeString('en-GB', {
      hour: '2-digit', minute: '2-digit'
  })

  // Theme Colors
  const colors: any = {
    minimal: { bg: '#F7F6F3', text: '#0f172a', accent: '#0f172a' },
    christmas: { bg: '#FEF2F2', text: '#7f1d1d', accent: '#dc2626' },
    diwali: { bg: '#FFFBEB', text: '#78350f', accent: '#d97706' },
    birthday: { bg: '#EFF6FF', text: '#1e3a8a', accent: '#2563eb' },
  }
  
  // @ts-ignore
  const theme = colors[event.theme] || colors.minimal

  return new ImageResponse(
    (
      <div
        style={{
          background: theme.bg,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 80,
          fontFamily: 'sans-serif',
        }}
      >
        {/* Card Container */}
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'white',
            padding: '40px 80px',
            borderRadius: 40,
            boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
            border: '2px solid rgba(0,0,0,0.05)',
            textAlign: 'center',
        }}>
             {/* Branding */}
            <div style={{
                fontSize: 30,
                color: theme.accent,
                marginBottom: 20,
                fontWeight: 'bold',
                opacity: 0.7,
            }}>
                INVITATION
            </div>

            {/* Title */}
            <div style={{
                fontSize: 80,
                fontWeight: 900,
                color: theme.text,
                lineHeight: 1.1,
                marginBottom: 30,
                maxWidth: 900,
                textAlign: 'center',
                display: 'flex', // Important for wrapping
            }}>
                {event.title}
            </div>

            {/* Details */}
            <div style={{
                display: 'flex',
                gap: 40,
                fontSize: 36,
                color: '#64748b',
                fontWeight: 500,
            }}>
                <span>📅 {dateStr}</span>
                <span>⏰ {timeStr}</span>
            </div>
            
            {/* Footer */}
            <div style={{
                marginTop: 50,
                fontSize: 24,
                color: '#94a3b8',
                background: '#f1f5f9',
                padding: '10px 30px',
                borderRadius: 50,
            }}>
                RSVP via WhoIn.uk
            </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
