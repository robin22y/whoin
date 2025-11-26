'use client'

import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

interface ExportButtonProps {
  eventTitle: string
  guests: Array<{
    name: string
    adult_count: number
    kid_count: number
    is_paid: boolean
  }>
}

export function ExportButton({ eventTitle, guests }: ExportButtonProps) {
  const handleExport = () => {
    // Convert guests data to CSV string
    const headers = ['Name', 'Adult Count', 'Kid Count', 'Paid Status']
    
    // Create CSV rows
    const rows = guests.map(guest => [
      guest.name,
      guest.adult_count.toString(),
      guest.kid_count.toString(),
      guest.is_paid ? 'Paid' : 'Pending'
    ])
    
    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
    ].join('\n')
    
    // Create blob and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    // Sanitize event title for filename (remove special characters)
    const sanitizedTitle = eventTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()
    const filename = `${sanitizedTitle}_GuestList.csv`
    
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Button
      onClick={handleExport}
      variant="outline"
      className="w-full min-h-[48px]"
    >
      <Download className="mr-2 h-4 w-4" />
      Export to Excel
    </Button>
  )
}

