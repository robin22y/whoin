'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Footer } from '@/components/footer'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [token, setToken] = useState('')
  const [isOtpSent, setIsOtpSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()
  const supabase = createClient()

  // Check if already logged in
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        handlePostLogin(user.id)
      }
    })
  }, [supabase])

  const handlePostLogin = async (userId: string) => {
    const pendingEvent = localStorage.getItem('pending_event')
    if (pendingEvent) {
      await createPendingEvent(userId, JSON.parse(pendingEvent))
    } else {
      router.push('/my-events')
    }
  }

  const createPendingEvent = async (userId: string, eventData: any) => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('events')
        .insert({
          title: eventData.title,
          date: eventData.date,
          location: eventData.location,
          price_per_adult: eventData.pricePerAdult || 0,
          bank_details: eventData.bankDetails,
          user_id: userId,
        })
        .select('id, management_key')
        .single()

      if (error) throw error

      if (data.management_key) {
        localStorage.setItem(`event_${data.id}_key`, data.management_key)
        
        const myEvents = JSON.parse(localStorage.getItem('my_events') || '[]')
        if (!myEvents.find((e: any) => e.id === data.id)) {
          myEvents.push({
            id: data.id,
            title: eventData.title,
            date: eventData.date,
            location: eventData.location,
            management_key: data.management_key,
            created_at: new Date().toISOString(),
          })
          localStorage.setItem('my_events', JSON.stringify(myEvents))
        }
      }

      localStorage.removeItem('pending_event')
      // Redirect to Dashboard, NOT guest page
      router.push(`/manage/${data.id}?key=${data.management_key}`)
    } catch (error) {
      console.error('Error creating event:', error)
      alert('Failed to create event. Please try again.')
      setIsLoading(false)
    }
  }

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      // NEW: No options object = Send Code
      const { error } = await supabase.auth.signInWithOtp({
        email
      })

      if (error) throw error

      setIsOtpSent(true)
      setMessage('Code sent! Check your email.')
    } catch (error: any) {
      console.error('Error sending code:', error)
      setMessage('Failed to send code. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'email',
      })

      if (error) throw error

      if (data.user) {
        setMessage('Success! Logging in...')
        await handlePostLogin(data.user.id)
      }
    } catch (error: any) {
      console.error('Error verifying code:', error)
      setMessage('Invalid code. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 max-w-md mx-auto px-6 py-12 w-full">
        <h1 className="text-3xl font-bold mb-8">Organizer Login</h1>
        
        {!isOtpSent ? (
          <>
            <p className="text-muted-foreground mb-6">
              Enter your email to receive a 6-digit login code.
            </p>
            <form onSubmit={handleSendCode} className="space-y-4">
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full text-lg h-12"
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
              Enter the code sent to <strong>{email}</strong>
            </p>
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <Input
                type="text"
                placeholder="123456"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                required
                maxLength={6}
                className="w-full text-center text-2xl tracking-widest h-14"
              />
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full min-h-[48px]"
              >
                {isLoading ? 'Verifying...' : 'Verify & Login'}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsOtpSent(false)}
                className="w-full"
              >
                Wrong email? Go back
              </Button>
            </form>
          </>
        )}

        {message && (
          <p className={`mt-6 text-sm text-center ${message.includes('Success') || message.includes('sent') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}
      </main>
      <Footer />
    </div>
  )
}