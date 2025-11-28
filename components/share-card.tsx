'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Copy, MessageCircle, MessageSquare } from 'lucide-react'

interface ShareCardProps {
  eventId: string
  shortCode?: string // <--- Add this optional prop
  eventTitle: string
  eventDate: string
  eventLocation: string
}

export function ShareCard({ eventId, shortCode, eventTitle, eventDate, eventLocation }: ShareCardProps) {
  const [includeCalendar, setIncludeCalendar] = useState(false)
  
  // Logic: Use Short Code if available, otherwise fallback to UUID
  const eventLink = typeof window !== 'undefined' 
    ? `${window.location.origin}/e/${shortCode || eventId}`
    : `theinvitelink.com/e/${shortCode || eventId}`

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

  const getShareMessage = () => {
    const formattedDate = formatDate(eventDate)
    let message = `You're invited to ${eventTitle}! 📅 ${formattedDate} 📍 ${eventLocation}. Sign up here: ${eventLink} (via theinvitelink.com)`
    
    if (includeCalendar) {
      message += '\n\nP.S. Save this to your calendar'
    }
    
    return message
  }

  const shareOnWhatsApp = () => {
    const message = getShareMessage()
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`
    
    window.open(whatsappUrl, '_blank')
  }

  const shareViaSMS = () => {
    const message = getShareMessage()
    const encodedMessage = encodeURIComponent(message)
    const smsUrl = `sms:?&body=${encodedMessage}`
    
    window.location.href = smsUrl
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
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={shareOnWhatsApp}
            className="w-full min-h-[48px] bg-[#25D366] hover:bg-[#128C7E] text-white"
            size="lg"
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            WhatsApp
          </Button>
          <Button
            onClick={shareViaSMS}
            className="w-full min-h-[48px] bg-[#007AFF] hover:bg-[#0056b3] text-white"
            size="lg"
          >
            <MessageSquare className="mr-2 h-5 w-5" />
            Text / iMessage
          </Button>
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

        <div className="space-y-2">
          <Label htmlFor="event-link">Copy Link</Label>
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
      </CardContent>
    </Card>
  )
}

