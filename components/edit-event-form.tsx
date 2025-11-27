'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Pencil } from 'lucide-react'
import { ImageUpload } from '@/components/image-upload'

interface EditEventFormProps {
  event: any
}

export function EditEventForm({ event }: EditEventFormProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(event.title)
  const [location, setLocation] = useState(event.location)
  const [description, setDescription] = useState(event.description || '')
  const [priceAdult, setPriceAdult] = useState(event.price_per_adult || 0)
  const [priceChild, setPriceChild] = useState(event.price_per_child || 0)
  const [bannerUrl, setBannerUrl] = useState(event.banner_url || '')
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
        description,
        price_per_adult: priceAdult,
        price_per_child: priceChild,
        banner_url: bannerUrl
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
      <Button 
        variant="outline" 
        onClick={() => setIsEditing(true)} 
        className="bg-white text-[#0F172A] hover:bg-blue-50 border-0 shadow-md font-medium"
      >
        <Pencil className="w-4 h-4 mr-2" /> Edit Details
      </Button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <form 
        onSubmit={handleUpdate} 
        className="w-full max-w-md bg-white p-6 rounded-3xl shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-xl text-slate-900">Edit Event</h3>
          <button type="button" onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-600">✕</button>
        </div>
        
        <div className="space-y-5">
          {/* IMAGE UPLOAD */}
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Event Banner</label>
            <ImageUpload onUploadComplete={setBannerUrl} defaultImage={bannerUrl} />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1 ml-1">Event Title</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} required className="bg-slate-50 border-slate-200 text-slate-900" />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1 ml-1">Location</label>
            <Input value={location} onChange={(e) => setLocation(e.target.value)} required className="bg-slate-50 border-slate-200 text-slate-900" />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1 ml-1">Welcome Note</label>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} className="bg-slate-50 border-slate-200 text-slate-900" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1 ml-1">Adult Price (£)</label>
              <Input type="number" step="0.01" value={priceAdult} onChange={(e) => setPriceAdult(e.target.value)} className="bg-slate-50 border-slate-200 text-slate-900" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1 ml-1">Child Price (£)</label>
              <Input type="number" step="0.01" value={priceChild} onChange={(e) => setPriceChild(e.target.value)} className="bg-slate-50 border-slate-200 text-slate-900" />
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <Button type="button" variant="ghost" onClick={() => setIsEditing(false)} className="flex-1">Cancel</Button>
          <Button type="submit" disabled={loading} className="flex-1 bg-[#0F172A] text-white hover:bg-slate-800">
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  )
}