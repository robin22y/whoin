'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

// Helper to generate short code
function generateShortCode() {
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
  const [pricePerChild, setPricePerChild] = useState('')
  const [bankDetails, setBankDetails] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [theme, setTheme] = useState('minimal')
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      const shortCode = generateShortCode()
      const combinedDateTime = date && time ? `${date}T${time}:00` : date || ''
      
      const eventData = {
        title: eventTitle,
        date: combinedDateTime,
        location,
        price_per_adult: parseFloat(pricePerAdult) || 0,
        price_per_child: parseFloat(pricePerChild) || 0,
        bank_details: bankDetails,
        short_code: shortCode,
        theme: theme,
      }

      if (!user) {
        localStorage.setItem('pending_event', JSON.stringify(eventData))
        router.push('/auth')
        return
      }

      const { data, error } = await supabase
        .from('events')
        .insert({
          ...eventData,
          user_id: user.id,
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
            date: combinedDateTime,
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

  const inputClass = "inline-block bg-transparent border-b-2 border-gray-300 focus:border-black outline-none px-1 py-0 placeholder:text-gray-300 text-center mx-1 font-bold text-gray-900 transition-all duration-300"
  
  // Animation class for revealing new sections
  const revealClass = "animate-in fade-in slide-in-from-bottom-2 duration-700"

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto py-6 px-2 sm:px-4">
      
      {/* THEME PICKER */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          type="button"
          onClick={() => setTheme('minimal')}
          className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-xl transition-all ${theme === 'minimal' ? 'border-black scale-110 bg-slate-100' : 'border-transparent hover:bg-slate-50'}`}
          title="Minimal"
        >
          ⚪
        </button>
        <button
          type="button"
          onClick={() => setTheme('christmas')}
          className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-xl transition-all ${theme === 'christmas' ? 'border-red-500 scale-110 bg-red-50' : 'border-transparent hover:bg-red-50/50'}`}
          title="Christmas"
        >
          🎄
        </button>
        <button
          type="button"
          onClick={() => setTheme('diwali')}
          className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-xl transition-all ${theme === 'diwali' ? 'border-amber-500 scale-110 bg-amber-50' : 'border-transparent hover:bg-amber-50/50'}`}
          title="Celebration"
        >
          🪔
        </button>
        <button
          type="button"
          onClick={() => setTheme('birthday')}
          className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-xl transition-all ${theme === 'birthday' ? 'border-blue-500 scale-110 bg-blue-50' : 'border-transparent hover:bg-blue-50/50'}`}
          title="Birthday"
        >
          🎂
        </button>
      </div>
      
      <div className="text-3xl md:text-4xl leading-[1.8] font-medium text-gray-400 transition-all">
        
        {/* STEP 1: Always Visible */}
        <span className="text-gray-600">I am organizing </span>
        <input
          type="text"
          placeholder="a birthday party"
          value={eventTitle}
          onChange={(e) => setEventTitle(e.target.value)}
          required
          autoFocus
          className={`${inputClass} w-[300px] sm:w-auto`}
        />

        {/* STEP 2: Reveals when Title is typed */}
        {eventTitle.length > 2 && (
          <span className={revealClass}>
            <span> on </span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className={`${inputClass} min-w-[160px]`}
            />
          </span>
        )}
        
        {/* STEP 3: Reveals when Date is picked */}
        {date && (
          <span className={revealClass}>
            <span> at </span>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
              className={`${inputClass} min-w-[110px]`}
            />
          </span>
        )}
        
        {/* STEP 4: Reveals when Time is picked */}
        {time && (
          <span className={revealClass}>
            <span> at </span>
            <input
              type="text"
              placeholder="Location / Address"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className={`${inputClass} w-full sm:w-[350px]`}
            />
            <span>.</span>
          </span>
        )}

        {/* STEP 5: The "Optional" Money Section - Reveals after Location */}
        {location.length > 3 && (
          <div className={`mt-8 pt-8 border-t border-dashed border-gray-200 ${revealClass}`}>
             <span className="text-2xl text-gray-500 block mb-4">👇 Optional: Collect Money</span>
             
             <span>Tickets are </span>
             <span className="whitespace-nowrap">
               £
               <input
                 type="number"
                 step="0.01"
                 placeholder="0"
                 value={pricePerAdult}
                 onChange={(e) => setPricePerAdult(e.target.value)}
                 className={`${inputClass} w-24 text-3xl`}
               />
             </span>
             <span> for adults.</span>
             
             {/* Show Kids price only if Adults price is set */}
             {pricePerAdult && parseFloat(pricePerAdult) > 0 && (
                <span className={revealClass}>
                   <br/>And 
                   <span className="whitespace-nowrap ml-2">
                    £
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0"
                      value={pricePerChild}
                      onChange={(e) => setPricePerChild(e.target.value)}
                      className={`${inputClass} w-24 text-3xl`}
                    />
                   </span>
                   <span> for kids.</span>
                   
                   <div className="h-6"></div>
                   <span>Send money to: </span>
                   <input
                     type="text"
                     placeholder="Sort Code & Account"
                     value={bankDetails}
                     onChange={(e) => setBankDetails(e.target.value)}
                     className={`${inputClass} w-full sm:w-[400px]`}
                   />
                   <span>.</span>
                </span>
             )}
          </div>
        )}

      </div>

      {/* SUBMIT BUTTON - Only appears when minimum fields are ready */}
      {location.length > 3 && (
        <div className={`mt-12 text-center ${revealClass}`}>
          <Button 
            type="submit" 
            disabled={isLoading} 
            size="lg"
            className="min-w-[240px] text-xl h-16 rounded-full bg-black text-white shadow-xl hover:scale-105 transition-transform"
          >
            {isLoading ? 'Creating...' : '🚀 Create Event Link'}
          </Button>
        </div>
      )}
    </form>
  )
}
