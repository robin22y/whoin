'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { Minus, Plus, CreditCard, CheckCircle2 } from 'lucide-react'
import { useLocalStorage } from '@/hooks/use-local-storage'

interface GuestFormProps {
  eventId: string
  pricePerAdult: number
  pricePerChild: number
  bankDetails: string
}

export function GuestForm({ eventId, pricePerAdult, pricePerChild, bankDetails }: GuestFormProps) {
  const [storedName, setStoredName] = useLocalStorage('user_name', '')
  const [name, setName] = useState(storedName)
  const [adultCount, setAdultCount] = useState(1)
  const [kidCount, setKidCount] = useState(0)
  const [saveToDevice, setSaveToDevice] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [existingGuest, setExistingGuest] = useState<any>(null)
  const [isCheckingGuest, setIsCheckingGuest] = useState(true)
  const supabase = createClient()

  // ... (Keep existing checkExistingGuest logic) ...
  const checkExistingGuest = async (guestName: string) => {
    // Only check if name is at least 2 characters to avoid unnecessary queries
    if (!guestName || guestName.trim().length < 2) {
      setExistingGuest(null)
      setIsCheckingGuest(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .eq('event_id', eventId)
        .eq('name', guestName.trim())
        .maybeSingle() // Use maybeSingle instead of single to handle no results gracefully

      if (data && !error) {
        setExistingGuest(data)
        setAdultCount(data.adult_count)
        setKidCount(data.kid_count)
      } else {
        setExistingGuest(null)
      }
    } catch (error) {
      // No existing guest found or query error
      setExistingGuest(null)
    } finally {
      setIsCheckingGuest(false)
    }
  }

  useEffect(() => {
    setMounted(true)
    if (storedName) {
      setName(storedName)
      checkExistingGuest(storedName)
    } else {
      setIsCheckingGuest(false)
    }
  }, [])

  // Check for existing guest when name changes (with debouncing)
  useEffect(() => {
    if (!name.trim() || !mounted || isCheckingGuest) {
      return
    }

    // Debounce: only check after user stops typing for 500ms
    const timeoutId = setTimeout(() => {
      if (name.trim().length >= 2) {
        checkExistingGuest(name.trim())
      } else {
        setExistingGuest(null)
      }
    }, 500)

    return () => clearTimeout(timeoutId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, eventId, mounted])

  const calculateTotal = () => {
    return (adultCount * pricePerAdult) + (kidCount * pricePerChild)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('guests')
        .upsert({
          ...(existingGuest?.id ? { id: existingGuest.id } : {}),
          name: name.trim(),
          adult_count: adultCount,
          kid_count: kidCount,
          event_id: eventId,
          consent_given: true,
          is_paid: existingGuest?.is_paid || false,
        })
        .select()
        .single()

      if (error) throw error

      // ONLY save to LocalStorage if they checked the box (PECR Compliance)
      if (saveToDevice) {
        setStoredName(name.trim())
      } else {
        // Optional: Clear it if they uncheck it (good privacy practice)
        setStoredName('')
      }
      setExistingGuest(data)
      alert('Counted! Thanks for signing up.')
      window.location.reload()
    } catch (error) {
      console.error('Error submitting RSVP:', error)
      alert('Failed to submit. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePaymentConfirmation = async () => {
    if (!existingGuest) return
    try {
      const { error } = await supabase
        .from('guests')
        .update({ is_paid: true })
        .eq('id', existingGuest.id)
      if (error) throw error
      alert('Payment confirmed! Thank you.')
      window.location.reload()
    } catch (error) {
      alert('Failed to confirm payment.')
    }
  }

  if (!mounted || isCheckingGuest) return <div className="text-center py-10">Loading...</div>

  const totalToPay = calculateTotal()

  // If already RSVP'd and paid, show simple success state
  if (existingGuest && existingGuest.is_paid && totalToPay > 0) {
    return (
      <div className="text-center py-8 bg-green-50 rounded-xl border border-green-100">
        <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-green-800">You are all set!</h3>
        <p className="text-green-600">Paid: £{totalToPay.toFixed(2)}</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* NAME INPUT */}
        <div className="text-center space-y-2">
          <Label htmlFor="name" className="text-slate-400 uppercase text-xs font-bold tracking-wider">
            Your Name
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="Type your name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="text-center text-xl py-6 border-0 border-b-2 border-slate-200 rounded-none focus-visible:ring-0 focus-visible:border-black px-0 placeholder:text-slate-300 bg-transparent transition-colors"
          />
        </div>

        {/* COUNTERS */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-50 p-4 rounded-2xl text-center border border-slate-100">
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Adults</span>
            <div className="flex items-center justify-center gap-4">
              <Button type="button" variant="outline" size="icon" onClick={() => setAdultCount(Math.max(0, adultCount - 1))} className="h-8 w-8 rounded-full border-slate-200 hover:bg-white hover:text-black">
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-2xl font-bold w-4 text-slate-700">{adultCount}</span>
              <Button type="button" variant="outline" size="icon" onClick={() => setAdultCount(adultCount + 1)} className="h-8 w-8 rounded-full border-slate-200 hover:bg-white hover:text-black">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl text-center border border-slate-100">
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Kids</span>
            <div className="flex items-center justify-center gap-4">
              <Button type="button" variant="outline" size="icon" onClick={() => setKidCount(Math.max(0, kidCount - 1))} className="h-8 w-8 rounded-full border-slate-200 hover:bg-white hover:text-black">
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-2xl font-bold w-4 text-slate-700">{kidCount}</span>
              <Button type="button" variant="outline" size="icon" onClick={() => setKidCount(kidCount + 1)} className="h-8 w-8 rounded-full border-slate-200 hover:bg-white hover:text-black">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* PAYMENT SUMMARY BOX */}
        {(pricePerAdult > 0 || pricePerChild > 0) && (
          <div className="bg-slate-900 text-white p-6 rounded-xl text-center shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Total to Pay</p>
              <p className="text-4xl font-bold tracking-tight">£{totalToPay.toFixed(2)}</p>
              {bankDetails && (
                <div className="mt-4 pt-4 border-t border-slate-700">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Bank Transfer Details</p>
                  <p className="font-mono text-sm text-slate-200 bg-slate-800/50 py-2 rounded select-all">
                    {bankDetails}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SUBMIT ACTION */}
        <div className="space-y-4 pt-2">
          {/* GDPR / PECR Checkbox - OPTIONAL now */}
          <div className="flex items-start space-x-3 pt-2 justify-center">
            <Checkbox
              id="save-info"
              checked={saveToDevice}
              onCheckedChange={(checked) => setSaveToDevice(checked === true)}
              className="mt-1 border-slate-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
            />
            <div className="grid gap-1.5 leading-none text-left">
              <Label
                htmlFor="save-info"
                className="text-sm text-slate-600 font-medium cursor-pointer"
              >
                Remember me for next time
              </Label>
              <p className="text-[11px] text-slate-400">
                Saves your name on this device for future RSVPs.
              </p>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-14 text-lg font-bold rounded-xl bg-black hover:bg-slate-800 text-white shadow-xl shadow-slate-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            {isLoading ? 'Saving...' : "Count Me In! 👋"}
          </Button>
        </div>
      </form>

      {/* PAYMENT CONFIRM BUTTON (If Total > 0) */}
      {totalToPay > 0 && existingGuest && !existingGuest.is_paid && (
        <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          <p className="text-sm text-muted-foreground mb-3">Already made the transfer?</p>
          <Button
            onClick={handlePaymentConfirmation}
            variant="outline"
            className="w-full border-dashed border-2 border-slate-300 hover:border-slate-400 text-slate-600"
          >
            <CreditCard className="mr-2 h-4 w-4" />
            Yes, I have paid
          </Button>
        </div>
      )}
    </div>
  )
}
