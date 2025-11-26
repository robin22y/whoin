'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Copy, MessageCircle } from 'lucide-react'

interface ShareCardProps {
  eventId: string
  eventTitle: string
  eventDate: string
  eventLocation: string
  shortCode?: string
}

export function ShareCard({ eventId, eventTitle, eventDate, eventLocation, shortCode }: ShareCardProps) {
  const [includeCalendar, setIncludeCalendar] = useState(false)
  // Use shortCode if available, otherwise fall back to eventId
  const linkId = shortCode || eventId
  const eventLink = typeof window !== 'undefined' 
    ? `${window.location.origin}/e/${linkId}`
    : `whoin.uk/e/${linkId}`

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(eventLink)
    alert('Link copied to clipboard!')
  }

  const shareOnWhatsApp = () => {
    const formattedDate = formatDate(eventDate)
    let message = `You're invited to ${eventTitle}! 📅 ${formattedDate} 📍 ${eventLocation}. RSVP here: ${eventLink}. (Made with WhoIn.uk)`
    
    if (includeCalendar) {
      message += '\n\nP.S. Save this to your calendar'
    }

    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`
    
    window.open(whatsappUrl, '_blank')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Share Your Event</CardTitle>
        <CardDescription>
          Share the link with your guests on WhatsApp
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="event-link">Event Link</Label>
          <div className="flex gap-2">
            <Input
              id="event-link"
              value={eventLink}
              readOnly
              className="font-mono text-sm"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={copyToClipboard}
              className="min-h-[48px]"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between space-x-2 p-4 border rounded-lg">
          <div className="space-y-0.5">
            <Label htmlFor="calendar-toggle" className="text-base cursor-pointer">
              Include calendar reminder
            </Label>
            <p className="text-sm text-muted-foreground">
              Adds "P.S. Save this to your calendar" to the message
            </p>
          </div>
          <Switch
            id="calendar-toggle"
            checked={includeCalendar}
            onCheckedChange={setIncludeCalendar}
          />
        </div>

        <Button
          onClick={shareOnWhatsApp}
          className="w-full min-h-[48px]"
          size="lg"
        >
          <MessageCircle className="mr-2 h-5 w-5" />
          Share on WhatsApp
        </Button>
      </CardContent>
    </Card>
  )
}

