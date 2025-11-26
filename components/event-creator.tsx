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
  const [pricePerChild, setPricePerChild] = useState('') // <--- NEW
  const [bankDetails, setBankDetails] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      // Combine date/time
      const combinedDateTime = date && time ? `${date}T${time}:00` : date || ''
      const eventData = {
        title: eventTitle,
        date: combinedDateTime,
        location,
        price_per_adult: parseFloat(pricePerAdult) || 0,
        price_per_child: parseFloat(pricePerChild) || 0, // <--- NEW
        bank_details: bankDetails,
      }

      if (!user) {
        localStorage.setItem('pending_event', JSON.stringify({
            ...eventData, 
            pricePerAdult: eventData.price_per_adult, 
            pricePerChild: eventData.price_per_child
        }))
        router.push('/auth')
        return
      }

      // Generate short code for the event
      const shortCode = generateShortCode()

      const { data, error } = await supabase
        .from('events')
        .insert({
          ...eventData,
          user_id: user.id,
          short_code: shortCode,
        })
        .select('id, management_key, short_code')
        .single()

      if (error) throw error

      if (data.management_key) {
        localStorage.setItem(`event_${data.id}_key`, data.management_key)
        
        // Add to My Events list in localStorage
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

      router.push(`/manage/${data.id}?key=${data.management_key}`)
    } catch (error) {
      console.error('Error creating event:', error)
      alert('Failed to create event.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6">
      <div className="text-3xl leading-relaxed mb-8 flex flex-wrap items-baseline gap-x-2 gap-y-4">
        <span>I am organizing</span>
        <Input 
          placeholder="a birthday party" 
          value={eventTitle} 
          onChange={(e) => setEventTitle(e.target.value)} 
          required 
          className="mad-libs-input min-w-[200px]" 
        />
        <span>on</span>
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="mad-libs-input min-w-[150px]" />
        <span>at</span>
        <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} required className="mad-libs-input min-w-[100px]" />
        <span>at</span>
        <Input placeholder="123 Main St" value={location} onChange={(e) => setLocation(e.target.value)} required className="mad-libs-input min-w-[300px]" />
        <span>.</span>
        
        {/* PRICE SECTION */}
        <div className="w-full"></div> {/* Line break */}
        <span>Tickets are</span>
        <span className="inline-flex items-baseline">
          <span className="mr-1">£</span>
          <Input type="number" step="0.01" placeholder="0.00" value={pricePerAdult} onChange={(e) => setPricePerAdult(e.target.value)} className="mad-libs-input min-w-[80px]" />
        </span>
        <span>for adults, and</span>
        <span className="inline-flex items-baseline">
          <span className="mr-1">£</span>
          <Input type="number" step="0.01" placeholder="0.00" value={pricePerChild} onChange={(e) => setPricePerChild(e.target.value)} className="mad-libs-input min-w-[80px]" />
        </span>
        <span>for kids.</span>
        
        <div className="w-full"></div> {/* Line break */}
        <span>Send money to:</span>
        <Input placeholder="Sort code & Account" value={bankDetails} onChange={(e) => setBankDetails(e.target.value)} className="mad-libs-input min-w-[300px]" />
        <span>.</span>
      </div>

      <Button type="submit" disabled={isLoading} className="min-h-[48px] mt-6 text-lg font-bold">
        {isLoading ? 'Creating...' : 'Create Event'}
      </Button>
    </form>
  )
}
