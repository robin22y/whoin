'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Footer } from '@/components/footer'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [codeSent, setCodeSent] = useState(false)
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
          router.push('/my-events')
        }
      }
    })

    // Handle authentication state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const pendingEvent = localStorage.getItem('pending_event')
        if (pendingEvent) {
          createPendingEvent(session.user.id, JSON.parse(pendingEvent))
        } else {
          router.push('/my-events')
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

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
        },
      })

      if (error) throw error

      setCodeSent(true)
      setMessage('Check your email for the 6-digit code!')
    } catch (error: any) {
      console.error('Error sending OTP code:', error)
      setMessage('Failed to send code. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    if (otpCode.length !== 6) {
      setMessage('Please enter a valid 6-digit code.')
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otpCode,
        type: 'email',
      })

      if (error) throw error

      // Success - redirect immediately to my-events
      router.push('/my-events')
    } catch (error: any) {
      console.error('Error verifying OTP code:', error)
      setMessage('Invalid code. Please try again.')
      setOtpCode('')
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    setCodeSent(false)
    setOtpCode('')
    setMessage('')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 max-w-md mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-8">Organizer Login</h1>
        
        {!codeSent ? (
          <>
            <p className="text-muted-foreground mb-6">
              Enter your email to receive a 6-digit code. No password needed!
            </p>

            <form onSubmit={handleSendCode} className="space-y-4">
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="w-full"
              />
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full min-h-[48px]"
              >
                {isLoading ? 'Sending...' : 'Send Code'}
              </Button>
            </form>
          </>
        ) : (
          <>
            <p className="text-muted-foreground mb-6">
              We sent a 6-digit code to <strong>{email}</strong>
            </p>

            <form onSubmit={handleVerifyCode} className="space-y-4">
              <Input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="123456"
                value={otpCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                  setOtpCode(value)
                }}
                required
                disabled={isLoading}
                className="w-full text-center text-2xl tracking-widest font-mono"
                maxLength={6}
                autoFocus
              />
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  disabled={isLoading}
                  className="flex-1 min-h-[48px]"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || otpCode.length !== 6}
                  className="flex-1 min-h-[48px]"
                >
                  {isLoading ? 'Verifying...' : 'Verify Code'}
                </Button>
              </div>
            </form>
          </>
        )}

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

