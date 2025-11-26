'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Pencil } from 'lucide-react'

interface EditEventFormProps {
  event: any
}

export function EditEventForm({ event }: EditEventFormProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(event.title)
  const [location, setLocation] = useState(event.location)
  const [priceAdult, setPriceAdult] = useState(event.price_per_adult || 0)
  const [priceChild, setPriceChild] = useState(event.price_per_child || 0)
  const [description, setDescription] = useState(event.description || '')
  const [loading, setLoading] = useState(false)
  
  const router = useRouter()
  const supabase = createClient()

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase
      .from('events')
      .update({
        title,
        location,
        price_per_adult: priceAdult,
        price_per_child: priceChild,
        description: description
      })
      .eq('id', event.id)

    if (error) {
      alert('Error updating event')
    } else {
      setIsEditing(false)
      router.refresh()
    }
    setLoading(false)
  }

  if (!isEditing) {
    return (
      <Button variant="outline" onClick={() => setIsEditing(true)} className="w-full">
        <Pencil className="w-4 h-4 mr-2" /> Edit Event Details
      </Button>
    )
  }

  return (
    <form onSubmit={handleUpdate} className="space-y-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
      <h3 className="font-bold">Edit Details</h3>
      
      <div>
        <label className="text-xs font-bold text-slate-500">Event Title</label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      
      <div>
        <label className="text-xs font-bold text-slate-500">Location</label>
        <Input value={location} onChange={(e) => setLocation(e.target.value)} required />
      </div>

      <div>
        <label className="text-xs font-bold text-slate-500">Custom Note</label>
        <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g. Bring your own drinks!" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-slate-500">Adult Price (£)</label>
          <Input type="number" step="0.01" value={priceAdult} onChange={(e) => setPriceAdult(e.target.value)} />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500">Child Price (£)</label>
          <Input type="number" step="0.01" value={priceChild} onChange={(e) => setPriceChild(e.target.value)} />
        </div>
      </div>

      <div className="flex gap-2">
        <Button type="button" variant="ghost" onClick={() => setIsEditing(false)} className="flex-1">Cancel</Button>
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  )
}

