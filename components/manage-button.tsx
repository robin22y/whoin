'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Settings } from 'lucide-react'

interface ManageButtonProps {
  eventId: string
}

export function ManageButton({ eventId }: ManageButtonProps) {
  const [managementKey, setManagementKey] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (typeof window !== 'undefined') {
      const key = localStorage.getItem(`event_${eventId}_key`)
      setManagementKey(key)
    }
  }, [eventId])

  if (!mounted || !managementKey) {
    return null
  }

  return (
    <Link href={`/manage/${eventId}?key=${managementKey}`}>
      <Button variant="outline" className="min-h-[48px]">
        <Settings className="mr-2 h-4 w-4" />
        Manage Event
      </Button>
    </Link>
  )
}

