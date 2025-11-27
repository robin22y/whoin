'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useState, useEffect } from 'react'
import { Download } from 'lucide-react'
import { useInstallPrompt } from '@/hooks/use-install-prompt'

export function Footer() {
  const [isDeleting, setIsDeleting] = useState(false)
  const [mounted, setMounted] = useState(false)
  const supabase = createClient()
  const { isInstallable, handleInstallClick } = useInstallPrompt()

  useEffect(() => {
    setMounted(true)
  }, [])

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

      const { error } = await supabase
        .from('events')
        .delete()
        .eq('user_id', user.id)

      if (error) throw error

      alert('All your data has been deleted successfully.')
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
    <footer className="border-t mt-auto py-8 px-6 bg-white/50 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground underline underline-offset-4">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-foreground underline underline-offset-4">
              Terms of Service
            </Link>
            <Link href="/cookies" className="hover:text-foreground underline underline-offset-4">
              Cookie Policy
            </Link>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            {mounted && isInstallable && (
              <Button 
                onClick={handleInstallClick}
                variant="outline" 
                className="gap-2 min-h-[48px]"
              >
                <Download className="w-4 h-4" />
                Install App
              </Button>
            )}
            <Button
              variant="ghost"
              onClick={handleDeleteData}
              disabled={isDeleting}
              className="min-h-[48px] w-full sm:w-auto text-slate-400 hover:text-red-600 hover:bg-red-50"
            >
              {isDeleting ? 'Deleting...' : 'Delete My Data'}
            </Button>
          </div>
        </div>
        <p className="text-xs text-slate-400 text-center sm:text-left">
          © {new Date().getFullYear()} The Invite Link • Simple Event Sign-up. All data stored in UK/EU.
        </p>
      </div>
    </footer>
  )
}