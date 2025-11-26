'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

// Helper function to generate a random 6-character alphanumeric string (lowercase)
function generateShortCode(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export function EventCreator() {
  const [eventTitle, setEventTitle] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [location, setLocation] = useState('')
  const [pricePerAdult, setPricePerAdult] = useState('')
  const [bankDetails, setBankDetails] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        // Combine date and time into ISO timestamp
        const combinedDateTime = date && time ? `${date}T${time}:00` : date || ''
        
        // Store event data in localStorage for magic link flow
        const eventData = {
          title: eventTitle,
          date: combinedDateTime,
          location,
          pricePerAdult: parseFloat(pricePerAdult) || 0,
          bankDetails,
        }
        localStorage.setItem('pending_event', JSON.stringify(eventData))
        // Redirect to auth
        router.push('/auth')
        return
      }

      // Combine date and time into ISO timestamp
      const combinedDateTime = date && time ? `${date}T${time}:00` : date || ''

      // Generate short code for the event
      const shortCode = generateShortCode()

      // Create event (select management_key and short_code for creator)
      const { data, error } = await supabase
        .from('events')
        .insert({
          title: eventTitle,
          date: combinedDateTime,
          location,
          price_per_adult: parseFloat(pricePerAdult) || 0,
          bank_details: bankDetails,
          user_id: user.id,
          short_code: shortCode,
        })
        .select('id, management_key, short_code, title, date, location')
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

      router.push(`/e/${data.id}`)
    } catch (error) {
      console.error('Error creating event:', error)
      alert('Failed to create event. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6">
      <div className="text-3xl leading-relaxed mb-8 flex flex-wrap items-baseline gap-x-2 gap-y-4">
        <span>I am organizing</span>
        <Input
          type="text"
          placeholder="a birthday party"
          value={eventTitle}
          onChange={(e) => setEventTitle(e.target.value)}
          required
          className="mad-libs-input inline-block w-auto min-w-[200px]"
          style={{ fontSize: 'inherit' }}
        />
        <span>on</span>
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="mad-libs-input inline-block w-auto min-w-[150px]"
          style={{ fontSize: 'inherit' }}
        />
        <span>at</span>
        <Input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
          className="mad-libs-input inline-block w-auto min-w-[100px]"
          style={{ fontSize: 'inherit' }}
        />
        <span>at</span>
        <Input
          type="text"
          placeholder="123 Main St, London"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
          className="mad-libs-input inline-block w-auto min-w-[300px]"
          style={{ fontSize: 'inherit' }}
        />
        <span>.</span>
        <span>Ticket price is</span>
        <span className="inline-flex items-baseline">
          <span className="mr-1">£</span>
          <Input
            type="number"
            step="0.01"
            placeholder="0.00"
            value={pricePerAdult}
            onChange={(e) => setPricePerAdult(e.target.value)}
            className="mad-libs-input inline-block w-auto min-w-[80px]"
            style={{ fontSize: 'inherit' }}
          />
        </span>
        <span>per adult.</span>
        <span>Send money to:</span>
        <Input
          type="text"
          placeholder="Sort code: 12-34-56, Account: 12345678"
          value={bankDetails}
          onChange={(e) => setBankDetails(e.target.value)}
          className="mad-libs-input inline-block w-auto min-w-[300px]"
          style={{ fontSize: 'inherit' }}
        />
        <span>.</span>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="min-h-[48px] mt-6"
      >
        {isLoading ? 'Creating...' : 'Create Event'}
      </Button>
    </form>
  )
}
