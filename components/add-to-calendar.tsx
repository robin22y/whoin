'use client'

import { Button } from '@/components/ui/button'
import { Calendar } from 'lucide-react'

interface AddToCalendarProps {
  event: {
    title: string
    date: string
    location: string
    description?: string
  }
}

export function AddToCalendar({ event }: AddToCalendarProps) {
  const generateCalendarUrl = () => {
    const startDate = new Date(event.date)
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000) // 2 hours later
    
    const formatCalendarDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    }
    
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: event.title,
      dates: `${formatCalendarDate(startDate)}/${formatCalendarDate(endDate)}`,
      details: `Location: ${event.location}${event.description ? `\n\n${event.description}` : ''}`,
      location: event.location,
    })
    
    return `https://calendar.google.com/calendar/render?${params.toString()}`
  }

  return (
    <Button
      asChild
      variant="outline"
      size="sm"
      className="gap-2 bg-white/20 text-white border-white/30 hover:bg-white/30 hover:text-white backdrop-blur-sm font-medium"
    >
      <a
        href={generateCalendarUrl()}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Calendar className="w-4 h-4" />
        Add to Calendar
      </a>
    </Button>
  )
}

