'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Sparkles, Gift, Flame, PartyPopper, CreditCard } from 'lucide-react'

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
  
  // Flexible Payment Details
  const [bankDetails, setBankDetails] = useState('')

  const [description, setDescription] = useState('')
  const [theme, setTheme] = useState('minimal')
  const [isLoading, setIsLoading] = useState(false)
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
        description: description,
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
        .insert({ ...eventData, user_id: user.id })
        .select('id, management_key')
        .single()

      if (error) throw error

      if (data.management_key) {
        localStorage.setItem(`event_${data.id}_key`, data.management_key)
        const myEvents = JSON.parse(localStorage.getItem('my_events') || '[]')
        if (!myEvents.find((e: any) => e.id === data.id)) {
          myEvents.push({ id: data.id, title: eventTitle, date: combinedDateTime, location, management_key: data.management_key, created_at: new Date().toISOString() })
          localStorage.setItem('my_events', JSON.stringify(myEvents))
        }
      }

      router.push(`/manage/${data.id}?key=${data.management_key}`)
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to create event.')
    } finally {
      setIsLoading(false)
    }
  }

  const inputClass = "inline-block bg-transparent border-b-2 border-gray-300 focus:border-black outline-none px-1 py-0 placeholder:text-gray-300 text-center mx-1 font-bold text-gray-900 transition-all duration-300"
  const revealClass = "animate-in fade-in slide-in-from-bottom-2 duration-700"
  
  const themeOptions = [
    { id: 'minimal', color: 'bg-slate-100 border-slate-300', icon: Sparkles, label: 'Clean' },
    { id: 'birthday', color: 'bg-blue-100 border-blue-300', icon: PartyPopper, label: 'Party' },
    { id: 'christmas', color: 'bg-red-100 border-red-300', icon: Gift, label: 'Xmas' },
    { id: 'diwali', color: 'bg-amber-100 border-amber-300', icon: Flame, label: 'Festive' },
  ]

  return (
    <div className="max-w-3xl mx-auto py-6 px-2 sm:px-4">
      
      <div className="flex justify-center mb-10">
        <div className="inline-flex items-center gap-1 p-1.5 bg-slate-50 border border-slate-200 rounded-full shadow-sm">
          {themeOptions.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTheme(t.id)}
              className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 ${t.color} ${
                theme === t.id ? 'ring-2 ring-offset-2 ring-black scale-110 shadow-md z-10' : 'opacity-60 hover:opacity-100 hover:scale-105'
              }`}
              title={t.label}
            >
              <t.icon className={`w-4 h-4 ${theme === t.id ? 'text-black' : 'text-slate-600'}`} />
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="transition-[height] duration-500 ease-in-out">
        <div className="text-3xl md:text-4xl leading-[1.8] font-medium text-gray-400 transition-all">
          <span className="text-gray-600">I am organizing </span>
          <input type="text" placeholder="a birthday party" value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} required autoFocus className={`${inputClass} w-[300px] sm:w-auto`} />

          {eventTitle.length > 2 && (
            <span className={revealClass}>
              <span> on </span>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className={`${inputClass} min-w-[160px]`} />
            </span>
          )}
          
          {date && (
            <span className={revealClass}>
              <span> at </span>
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required className={`${inputClass} min-w-[110px]`} />
            </span>
          )}
          
          {time && (
            <span className={revealClass}>
              <span> at </span>
              <input type="text" placeholder="Location / Address" value={location} onChange={(e) => setLocation(e.target.value)} required className={`${inputClass} w-full sm:w-[350px]`} />
              <span>.</span>
            </span>
          )}

          {location.length > 3 && (
            <div className={`mt-8 space-y-8 ${revealClass}`}>
               <div className="text-xl md:text-2xl border-l-4 border-slate-200 pl-4 py-2 bg-slate-50/50 rounded-r-xl">
                  <span className="block text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Personal Note (Optional)</span>
                  <span className="text-gray-400 font-serif italic">"</span>
                  <input 
                    type="text" 
                    placeholder="Can't wait to celebrate with you all! 🥳"  // <--- FIXED HERE
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    className={`${inputClass} w-full sm:w-[80%] text-left font-normal not-italic`} 
                  />
                  <span className="text-gray-400 font-serif italic">"</span>
               </div>

               <div className="pt-8 border-t border-dashed border-gray-200">
                  <span className="text-sm font-bold text-slate-400 uppercase tracking-wider block mb-2">Ticket Price (Optional)</span>
                  <span>Tickets are £</span>
                  <input type="number" step="0.01" placeholder="0" value={pricePerAdult} onChange={(e) => setPricePerAdult(e.target.value)} className={`${inputClass} w-24`} />
                  <span> for adults.</span>
                  
                  {pricePerAdult && parseFloat(pricePerAdult) > 0 && (
                      <div className={revealClass}>
                         <span className="inline-block mt-2">
                           & £
                           <input type="number" step="0.01" placeholder="0" value={pricePerChild} onChange={(e) => setPricePerChild(e.target.value)} className={`${inputClass} w-24`} />
                           <span> for kids.</span>
                         </span>
                         
                         {/* Universal Bank Details Text Area */}
                         <div className="mt-8 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm max-w-lg">
                            <div className="flex items-center gap-2 mb-4 text-slate-500">
                               <CreditCard className="w-4 h-4" />
                               <span className="text-xs font-bold uppercase tracking-wider">Payment Details (For Guests)</span>
                            </div>
                            
                            <div>
                               <label className="block text-xs font-medium text-slate-400 mb-2 ml-1">
                                 Enter Bank Details, UPI ID, IBAN, or Pay ID
                               </label>
                               <textarea 
                                 rows={3}
                                 placeholder={`Examples:\n• Sort: 20-00-00 | Acc: 12345678\n• IBAN: GB33 WEST...\n• UPI: name@okhdfcbank`}
                                 value={bankDetails}
                                 onChange={(e) => setBankDetails(e.target.value)}
                                 className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-base font-medium focus:ring-2 focus:ring-black focus:outline-none transition-all resize-none placeholder:text-slate-400"
                               />
                            </div>
                         </div>

                      </div>
                  )}
               </div>
            </div>
          )}
        </div>

        {location.length > 3 && (
          <div className={`mt-12 text-center ${revealClass}`}>
            <Button type="submit" disabled={isLoading} size="lg" className="min-w-[240px] text-xl h-16 rounded-full bg-black text-white shadow-xl hover:scale-105 transition-transform">
              {isLoading ? 'Creating...' : '🚀 Create Event Link'}
            </Button>
          </div>
        )}
      </form>
    </div>
  )
}