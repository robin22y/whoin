'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'

export function Footer() {
  const [isDeleting, setIsDeleting] = useState(false)
  const supabase = createClient()

  const handleDeleteData = async () => {
    if (!confirm('Are you sure you want to delete all your data? This action cannot be undone.')) {
      return
    }

    setIsDeleting(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        alert('You must be logged in to delete your data.')
        return
      }

      // Delete all events (cascades to guests and event_stats)
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('user_id', user.id)

      if (error) throw error

      alert('All your data has been deleted successfully.')
      
      // Sign out and redirect to home
      await supabase.auth.signOut()
      window.location.href = '/'
    } catch (error) {
      console.error('Error deleting data:', error)
      alert('Failed to delete data. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <footer className="border-t mt-auto py-8 px-6">
      <div className="max-w-6xl mx-auto space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2">
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground hover:text-foreground underline"
            >
              Privacy Policy
            </Link>
          </div>
          <Button
            variant="ghost"
            onClick={handleDeleteData}
            disabled={isDeleting}
            className="min-h-[48px] w-full sm:w-auto text-muted-foreground hover:text-destructive"
          >
            {isDeleting ? 'Deleting...' : 'Delete My Data'}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} WhoIn.uk - RSVP Lite. All data stored in UK/EU.
        </p>
      </div>
    </footer>
  )
}

