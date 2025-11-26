import { ImageResponse } from 'next/og'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'edge'

// Helper function to extract emoji from text
function extractEmoji(text: string): { emoji: string; cleanText: string } {
  const emojiRegex = /(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)/u
  const match = text.match(emojiRegex)
  if (match) {
    return {
      emoji: match[0],
      cleanText: text.replace(match[0], '').trim(),
    }
  }
  return { emoji: '', cleanText: text }
}

// Helper function to format date
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  // Fetch event data from Supabase
  let event: { title: string; date: string; location: string } | null = null

  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('events')
      .select('title, date, location')
      .eq('id', id)
      .single()

    if (!error && data) {
      event = data
    }
  } catch (error) {
    console.error('Error fetching event:', error)
  }

  // If event not found, return default image
  if (!event) {
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(to bottom right, #f8fafc, #e2e8f0)',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'white',
              borderRadius: '24px',
              padding: '60px',
              width: '80%',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }}
          >
            <div
              style={{
                fontSize: '60px',
                fontWeight: 'bold',
                color: '#000000',
                textAlign: 'center',
                marginBottom: '20px',
              }}
            >
              WhoIn.uk
            </div>
            <div
              style={{
                fontSize: '30px',
                color: '#2563eb',
                textAlign: 'center',
                position: 'absolute',
                bottom: '40px',
              }}
            >
              ✅ RSVP via WhoIn.uk
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  }

  // Extract emoji from title
  const { emoji, cleanText } = extractEmoji(event.title)

  // Format date
  const formattedDate = formatDate(event.date)

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(to bottom right, #f8fafc, #e2e8f0)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          position: 'relative',
        }}
      >
        {/* Main Card */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
            borderRadius: '24px',
            padding: '60px',
            width: '80%',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            position: 'relative',
          }}
        >
          {/* Content Section */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              gap: '20px',
            }}
          >
            {/* Title */}
            <div
              style={{
                fontSize: '60px',
                fontWeight: 'bold',
                color: '#000000',
                lineHeight: '1.2',
                maxWidth: emoji ? '85%' : '100%',
              }}
            >
              {cleanText || event.title}
            </div>

            {/* Date and Location Row */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                fontSize: '30px',
                color: '#475569',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>📅</span>
                <span>{formattedDate}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>📍</span>
                <span>{event.location}</span>
              </div>
            </div>
          </div>

          {/* Large Emoji (if present) */}
          {emoji && (
            <div
              style={{
                fontSize: '100px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: '40px',
              }}
            >
              {emoji}
            </div>
          )}
        </div>

        {/* Footer - Positioned absolutely at bottom */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            fontSize: '30px',
            color: '#2563eb',
            fontWeight: '600',
          }}
        >
          ✅ RSVP via WhoIn.uk
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}

