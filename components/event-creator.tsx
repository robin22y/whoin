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
  const [form, setForm] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    priceAdult: '',
    priceChild: '',
    bankDetails: '',
    description: '',
    theme: 'minimal',
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Logic Validation: Check if date/time is in the past
      if (form.date) {
        const now = new Date()
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        const selectedDateOnly = new Date(form.date)
        selectedDateOnly.setHours(0, 0, 0, 0)
        
        let selectedDateTime: Date
        if (form.time) {
          const [hours, minutes] = form.time.split(':').map(Number)
          selectedDateTime = new Date(form.date)
          selectedDateTime.setHours(hours, minutes, 0, 0)
        } else {
          selectedDateTime = new Date(selectedDateOnly)
          selectedDateTime.setHours(23, 59, 59, 999) // End of day if no time specified
        }

        // If the selected date is in the past, block it
        if (selectedDateTime < now) {
          alert('Please pick a future date 📅')
          setIsLoading(false)
          return
        }
      }

      const { data: { user } } = await supabase.auth.getUser()
      const shortCode = generateShortCode()
      const combinedDateTime = form.date && form.time ? `${form.date}T${form.time}:00` : form.date || ''
      
      const eventData = {
        title: form.title,
        date: combinedDateTime,
        location: form.location,
        price_per_adult: parseFloat(form.priceAdult) || 0,
        price_per_child: parseFloat(form.priceChild) || 0,
        bank_details: form.bankDetails,
        description: form.description,
        short_code: shortCode,
        theme: form.theme,
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
          myEvents.push({ id: data.id, title: form.title, date: combinedDateTime, location: form.location, management_key: data.management_key, created_at: new Date().toISOString() })
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

  const inputClass = "mad-libs-input inline-block"
  const revealClass = "animate-in fade-in slide-in-from-bottom-2 duration-500"
  
  const themeOptions = [
    { id: 'minimal', color: 'bg-slate-100 border-slate-300', icon: Sparkles, label: 'Clean' },
    { id: 'birthday', color: 'bg-blue-100 border-blue-300', icon: PartyPopper, label: 'Party' },
    { id: 'christmas', color: 'bg-red-100 border-red-300', icon: Gift, label: 'Xmas' },
    { id: 'diwali', color: 'bg-amber-100 border-amber-300', icon: Flame, label: 'Festive' },
  ]

  return (
    <div className="max-w-3xl mx-auto py-4">
      
      <div className="flex justify-center mb-8">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-slate-600">Card Style:</span>
          <div className="inline-flex items-center gap-1 p-1 bg-slate-50 border border-slate-200 rounded-lg">
            {themeOptions.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => handleChange('theme', t.id)}
                className={`relative flex items-center justify-center w-8 h-8 rounded transition-all duration-200 ${t.color} ${
                  form.theme === t.id ? 'ring-2 ring-slate-600 shadow-sm' : 'opacity-60 hover:opacity-100'
                }`}
                title={t.label}
              >
                <t.icon className={`w-3.5 h-3.5 ${form.theme === t.id ? 'text-slate-900' : 'text-slate-600'}`} />
              </button>
            ))}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="transition-[height] duration-500 ease-in-out">
        <div className="text-2xl md:text-3xl leading-[1.8] font-medium text-slate-700 transition-all">
          <span className="text-slate-900">I am organizing </span>
          <input type="text" placeholder="Sunday Roast at The Crown" value={form.title} onChange={(e) => handleChange('title', e.target.value)} required autoFocus className={`${inputClass} w-[300px] sm:w-auto`} />

          {form.title.length > 2 && (
            <span className={revealClass}>
              <span> on </span>
              <input 
                type="date" 
                value={form.date} 
                onChange={(e) => handleChange('date', e.target.value)} 
                required 
                min={new Date().toISOString().split('T')[0]}
                className={`${inputClass} min-w-[160px]`} 
              />
            </span>
          )}
          
          {form.date && (
            <span className={revealClass}>
              <span> at </span>
              <input type="time" value={form.time} onChange={(e) => handleChange('time', e.target.value)} required className={`${inputClass} min-w-[110px]`} />
            </span>
          )}
          
          {form.time && (
            <span className={revealClass}>
              <span> at </span>
              <input type="text" placeholder="Location / Address" value={form.location} onChange={(e) => handleChange('location', e.target.value)} required className={`${inputClass} w-full sm:w-[350px]`} />
              <span>.</span>
            </span>
          )}

          {form.location.length > 3 && (
            <div className={`mt-8 space-y-8 ${revealClass}`}>
               <div className="text-xl md:text-2xl border-l-4 border-slate-200 pl-4 py-2 bg-slate-50/50 rounded-r-xl">
                  <span className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Personal Note (Optional)</span>
                  <input 
                    type="text" 
                    placeholder="Looking forward to seeing everyone there"
                    value={form.description} 
                    onChange={(e) => handleChange('description', e.target.value)} 
                    className={`${inputClass} w-full sm:w-[80%] text-left font-normal`} 
                  />
               </div>

               <div className="pt-8 border-t border-dashed border-gray-200">
                  <span className="text-sm font-bold text-slate-400 uppercase tracking-wider block mb-2">Ticket Price (Optional)</span>
                  <span>Tickets are £</span>
                  <input type="number" step="0.01" placeholder="0" value={form.priceAdult} onChange={(e) => handleChange('priceAdult', e.target.value)} className={`${inputClass} w-24`} />
                  <span> for adults.</span>
                  
                  {form.priceAdult && parseFloat(form.priceAdult) > 0 && (
                      <div className={revealClass}>
                         <span className="inline-block mt-2">
                           & £
                           <input type="number" step="0.01" placeholder="0" value={form.priceChild} onChange={(e) => handleChange('priceChild', e.target.value)} className={`${inputClass} w-24`} />
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
                                 value={form.bankDetails}
                                 onChange={(e) => handleChange('bankDetails', e.target.value)}
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

        {form.location.length > 3 && (
          <div className={`mt-12 text-center ${revealClass}`}>
            <Button type="submit" disabled={isLoading} size="lg" className="min-w-[240px] text-lg h-14 rounded-lg bg-[#0f172a] text-white hover:bg-slate-800 transition-colors">
              {isLoading ? 'Creating...' : 'Create Event Link'}
            </Button>
          </div>
        )}
      </form>
    </div>
  )
}