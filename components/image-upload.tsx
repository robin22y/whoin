'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { ImagePlus, X, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'

interface ImageUploadProps {
  onUploadComplete: (url: string) => void
  defaultImage?: string
}

export function ImageUpload({ onUploadComplete, defaultImage }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(defaultImage || null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  // Client-side compression to WebP
  const processImage = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = document.createElement('img')
      const reader = new FileReader()
      
      reader.onload = (e) => {
        img.src = e.target?.result as string
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          
          const maxWidth = 1200
          const scale = maxWidth / img.width
          const width = Math.min(img.width, maxWidth)
          const height = img.height * (scale < 1 ? scale : 1)
          
          canvas.width = width
          canvas.height = height
          
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height)
            canvas.toBlob((blob) => {
              if (blob) resolve(blob)
              else reject(new Error('Compression failed'))
            }, 'image/webp', 0.8)
          }
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    
    const file = e.target.files[0]
    setIsUploading(true)

    try {
      const compressedBlob = await processImage(file)
      const fileName = `${Math.random().toString(36).substring(7)}-${Date.now()}.webp`
      
      const { error } = await supabase.storage
        .from('banners')
        .upload(fileName, compressedBlob, {
          contentType: 'image/webp',
          cacheControl: '31536000'
        })

      if (error) throw error

      const { data: { publicUrl } } = supabase.storage
        .from('banners')
        .getPublicUrl(fileName)

      setPreview(publicUrl)
      onUploadComplete(publicUrl)

    } catch (error) {
      console.error('Upload failed:', error)
      alert('Failed to upload image. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const removeImage = () => {
    setPreview(null)
    onUploadComplete('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="w-full">
      <input 
        type="file" 
        accept="image/*" 
        className="hidden" 
        ref={fileInputRef}
        onChange={handleFileSelect}
      />

      {preview ? (
        <div className="relative w-full h-40 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 group">
           <Image 
             src={preview} 
             alt="Event Banner" 
             fill 
             className="object-cover" 
           />
           <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button variant="destructive" size="sm" onClick={removeImage} className="rounded-full">
                <X className="w-4 h-4 mr-2" /> Remove
              </Button>
           </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="w-full h-32 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:border-slate-400 hover:bg-slate-50 transition-all"
        >
          {isUploading ? (
            <div className="flex flex-col items-center">
               <Loader2 className="w-6 h-6 animate-spin mb-2 text-blue-600" />
               <span className="text-xs font-medium text-blue-600">Optimizing...</span>
            </div>
          ) : (
            <>
               <ImagePlus className="w-8 h-8 mb-2 opacity-50" />
               <span className="text-sm font-medium">Upload Cover Image</span>
            </>
          )}
        </button>
      )}
    </div>
  )
}