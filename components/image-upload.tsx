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
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.')
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('Image size must be less than 10MB. Please choose a smaller image.')
      return
    }

    setIsUploading(true)

    try {
      // Check authentication
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        alert('Please log in to upload images.')
        setIsUploading(false)
        return
      }

      const compressedBlob = await processImage(file)
      const fileName = `${Math.random().toString(36).substring(7)}-${Date.now()}.webp`
      
      const { data, error } = await supabase.storage
        .from('banners')
        .upload(fileName, compressedBlob, {
          contentType: 'image/webp',
          cacheControl: '31536000',
          upsert: false
        })

      if (error) {
        console.error('Storage upload error:', error)
        // Provide more specific error messages
        if (error.message?.includes('new row violates row-level security policy') || error.message?.includes('violates row-level security')) {
          alert('Storage policy error: The INSERT policy exists but may be misconfigured. Please check:\n1. Policy target role is "authenticated" (not "anon")\n2. WITH CHECK expression is: bucket_id = \'banners\'\n3. Edit the existing policy in Storage → Policies → BANNERS section')
        } else if (error.message?.includes('Bucket not found')) {
          alert('Storage bucket "banners" not found. Please create it in Supabase Storage settings.')
        } else if (error.message?.includes('duplicate') || error.message?.includes('already exists')) {
          // Try again with a different filename
          const retryFileName = `${Math.random().toString(36).substring(7)}-${Date.now()}.webp`
          const { error: retryError } = await supabase.storage
            .from('banners')
            .upload(retryFileName, compressedBlob, {
              contentType: 'image/webp',
              cacheControl: '31536000'
            })
          if (retryError) {
            throw retryError
          }
          const { data: { publicUrl } } = supabase.storage
            .from('banners')
            .getPublicUrl(retryFileName)
          setPreview(publicUrl)
          onUploadComplete(publicUrl)
          setIsUploading(false)
          return
        } else if (error.message?.includes('JWT') || error.message?.includes('permission') || error.message?.includes('policy')) {
          alert('Permission denied. Please check your storage bucket policies allow authenticated uploads.')
        } else {
          throw error
        }
      } else {
        const { data: { publicUrl } } = supabase.storage
          .from('banners')
          .getPublicUrl(fileName)

        setPreview(publicUrl)
        onUploadComplete(publicUrl)
      }

    } catch (error: any) {
      console.error('Upload failed:', error)
      const errorMessage = error?.message || 'Unknown error occurred'
      
      // More user-friendly error messages
      let userMessage = 'Failed to upload image. '
      if (errorMessage.includes('Bucket not found')) {
        userMessage += 'The storage bucket does not exist. Please create a "banners" bucket in Supabase Storage.'
      } else if (errorMessage.includes('permission') || errorMessage.includes('policy')) {
        userMessage += 'You do not have permission to upload. Please check storage policies.'
      } else if (errorMessage.includes('JWT')) {
        userMessage += 'Authentication failed. Please try logging in again.'
      } else {
        userMessage += `Error: ${errorMessage}`
      }
      
      alert(userMessage)
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