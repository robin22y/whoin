'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { Minus, Plus } from 'lucide-react'

interface GuestFormProps {
  eventId: string
  pricePerAdult: number
  pricePerChild: number // <--- NEW PROP
  bankDetails: string
}

export function GuestForm({ eventId, pricePerAdult, pricePerChild, bankDetails }: GuestFormProps) {
  const [name, setName] = useState('')
  const [adultCount, setAdultCount] = useState(1)
  const [kidCount, setKidCount] = useState(0)
  const [consent, setConsent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [existingGuest, setExistingGuest] = useState<any>(null)
  const [isCheckingGuest, setIsCheckingGuest] = useState(true)
  const supabase = createClient()

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

  // Memory: Check localStorage for 'user_name' on mount
  useEffect(() => {
    setMounted(true)
    if (typeof window !== 'undefined') {
      const storedName = localStorage.getItem('user_name')
      if (storedName) {
        setName(storedName)
        // Check if this user already has an RSVP for this event
        checkExistingGuest(storedName)
      } else {
        setIsCheckingGuest(false)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    return (adultCount * pricePerAdult) + (kidCount * pricePerChild) // <--- NEW MATH
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!consent) {
      alert('Please agree to share your name for this event.')
      return
    }

    setIsLoading(true)

    try {
      const { data, error } = await supabase
        .from('guests')
        .insert({
          name: name.trim(),
          adult_count: adultCount,
          kid_count: kidCount,
          event_id: eventId,
          consent_given: true,
          is_paid: false,
        })
        .select()
        .single()

      if (error) throw error

      // Save name to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('user_name', name.trim())
      }

      // Update existing guest state
      setExistingGuest(data)

      alert('RSVP submitted successfully!')
      
      // Refresh the page to show updated guest list
      window.location.reload()
    } catch (error) {
      console.error('Error submitting RSVP:', error)
      alert('Failed to submit RSVP. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePaymentConfirmation = async () => {
    if (!existingGuest) {
      alert('Please submit your RSVP first.')
      return
    }

    try {
      const { error } = await supabase
        .from('guests')
        .update({ is_paid: true })
        .eq('id', existingGuest.id)

      if (error) throw error

      alert('Payment confirmed! Thank you.')
      window.location.reload()
    } catch (error) {
      console.error('Error confirming payment:', error)
      alert('Failed to confirm payment. Please try again.')
    }
  }

  if (!mounted || isCheckingGuest) {
    return <div>Loading...</div>
  }

  const totalToPay = calculateTotal()

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-base">
              My name is{' '}
              <Input
                id="name"
                type="text"
                placeholder="John Smith"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mad-libs-input inline-block w-auto min-w-[150px] text-base"
                style={{ fontSize: '16px' }}
              />
            </Label>
          </div>

          {/* Family Math: Adults and Kids Counters */}
          <div className="space-y-3">
            <Label className="text-base">I'm bringing:</Label>
            
            <div className="flex items-center gap-4">
              <Label htmlFor="adults" className="text-sm">Adults:</Label>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setAdultCount(Math.max(0, adultCount - 1))}
                  className="h-10 w-10"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  id="adults"
                  type="number"
                  min="0"
                  value={adultCount}
                  onChange={(e) => setAdultCount(Math.max(0, parseInt(e.target.value) || 0))}
                  required
                  className="w-20 text-center text-base"
                  style={{ fontSize: '16px' }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setAdultCount(adultCount + 1)}
                  className="h-10 w-10"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Label htmlFor="kids" className="text-sm">Kids:</Label>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setKidCount(Math.max(0, kidCount - 1))}
                  className="h-10 w-10"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  id="kids"
                  type="number"
                  min="0"
                  value={kidCount}
                  onChange={(e) => setKidCount(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-20 text-center text-base"
                  style={{ fontSize: '16px' }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setKidCount(kidCount + 1)}
                  className="h-10 w-10"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Calculation: Display Total to Pay */}
          {pricePerAdult > 0 && (
            <div className="text-xl font-semibold">
              Total to Pay: £{totalToPay.toFixed(2)}
            </div>
          )}

          {/* GDPR: Mandatory Checkbox */}
          <div className="flex items-start space-x-3 pt-4">
            <Checkbox
              id="consent"
              checked={consent}
              onCheckedChange={(checked) => setConsent(checked === true)}
              required
              className="mt-1"
            />
            <Label
              htmlFor="consent"
              className="text-sm leading-relaxed cursor-pointer"
            >
              I agree to share my name for this event.
            </Label>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading || !consent}
          className="w-full min-h-[48px] sm:w-auto text-lg font-bold"
        >
          {isLoading ? 'Saving...' : "I'm In! ✅"}
        </Button>
      </form>

      {/* Payment Card: Show if Total > 0 and guest has RSVP'd */}
      {totalToPay > 0 && bankDetails && existingGuest && (
        <Card>
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
            <CardDescription>
              Please transfer the amount to the organizer's bank account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">Bank Details:</p>
              <p className="text-base">{bankDetails}</p>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Amount to Transfer:</p>
              <p className="text-2xl font-bold">£{totalToPay.toFixed(2)}</p>
            </div>
            <Button
              onClick={handlePaymentConfirmation}
              className="w-full min-h-[48px]"
              variant="outline"
            >
              I have transferred £{totalToPay.toFixed(2)}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
