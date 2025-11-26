'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Footer } from '@/components/footer'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Check if user is already authenticated
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        // Check for pending event
        const pendingEvent = localStorage.getItem('pending_event')
        if (pendingEvent) {
          createPendingEvent(user.id, JSON.parse(pendingEvent))
        } else {
          router.push('/')
        }
      }
    })

    // Handle magic link callback
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const pendingEvent = localStorage.getItem('pending_event')
        if (pendingEvent) {
          createPendingEvent(session.user.id, JSON.parse(pendingEvent))
        } else {
          router.push('/')
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [router, supabase])

  const createPendingEvent = async (userId: string, eventData: any) => {
    try {
      // eventData.date is already combined from EventCreator (date + time)
      const { data, error } = await supabase
        .from('events')
        .insert({
          title: eventData.title,
          date: eventData.date, // Already in ISO format: YYYY-MM-DDTHH:mm:00
          location: eventData.location,
          price_per_adult: eventData.pricePerAdult || 0,
          bank_details: eventData.bankDetails,
          user_id: userId,
        })
        .select('id, management_key, title, date, location')
        .single()

      if (error) throw error

      // Store management_key and event info in localStorage
      if (data.management_key) {
        // Store individual key
        localStorage.setItem(`event_${data.id}_key`, data.management_key)
        
        // Store event in "My Events" list
        const myEvents = JSON.parse(localStorage.getItem('my_events') || '[]')
        const eventEntry = {
          id: data.id,
          title: data.title,
          date: data.date,
          location: data.location,
          management_key: data.management_key,
          created_at: new Date().toISOString(),
        }
        
        // Add to list if not already present
        if (!myEvents.find((e: any) => e.id === data.id)) {
          myEvents.push(eventEntry)
          localStorage.setItem('my_events', JSON.stringify(myEvents))
        }
      }

      localStorage.removeItem('pending_event')
      router.push(`/e/${data.id}`)
    } catch (error) {
      console.error('Error creating pending event:', error)
      alert('Failed to create event. Please try again.')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error

      setMessage('Check your email for the magic link!')
    } catch (error: any) {
      console.error('Error sending magic link:', error)
      setMessage('Failed to send magic link. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 max-w-md mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-8">Organizer Login</h1>
        <p className="text-muted-foreground mb-6">
          Enter your email to receive a magic link. No password needed!
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full"
          />
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full min-h-[48px]"
          >
            {isLoading ? 'Sending...' : 'Send Magic Link'}
          </Button>
        </form>

        {message && (
          <p className={`mt-4 text-sm ${message.includes('Check') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}
      </main>
      <Footer />
    </div>
  )
}

