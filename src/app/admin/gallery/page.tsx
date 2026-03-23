'use client'
import { useState, useEffect } from 'react'
import { galleryService } from '@/lib/services'
import type { GalleryImage } from '@/types'
import { Button, Input, Modal } from '@/components/ui'
import toast from 'react-hot-toast'
import { Trash2, Plus } from 'lucide-react'
import Image from 'next/image'

export default function GalleryAdmin() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [file, setFile] = useState<File | undefined>(undefined)
  const [caption, setCaption] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    return galleryService.subscribe(setImages)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return toast.error('Please select an image')
    setLoading(true)
    try {
      await galleryService.upload(file, caption)
      toast.success('Image uploaded')
      setIsOpen(false)
      setFile(undefined)
      setCaption('')
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (img: GalleryImage) => {
    if (!window.confirm('Delete image?')) return
    try {
      await galleryService.delete(img.id, img.url)
      toast.success('Image deleted')
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white font-mono tracking-widest">GALLERY</h1>
        <Button onClick={() => setIsOpen(true)} className="bg-[#00f0ff] text-ink-950 hover:bg-[#00d0e0]">
          <Plus size={16} className="mr-2" /> Upload Photo
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {images.map(img => (
          <div key={img.id} className="group relative aspect-square rounded-xl overflow-hidden bg-ink-900 border border-white/10">
            <Image src={img.url} alt={img.caption || 'Gallery Image'} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
              <p className="text-white text-xs font-semibold truncate mb-2">{img.caption || 'No caption'}</p>
              <button onClick={() => handleDelete(img)} className="w-full py-1.5 text-xs font-semibold bg-[#ff4d6d]/90 text-white rounded hover:bg-[#ff4d6d] transition-colors flex items-center justify-center gap-1.5 backdrop-blur-sm">
                <Trash2 size={12} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal open={isOpen} onClose={() => setIsOpen(false)} title="Upload Photo">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-mono text-ink-500 uppercase tracking-widest">Select Image</label>
            <input type="file" accept="image/*" onChange={(e: any) => setFile(e.target.files?.[0])} required className="text-sm text-ink-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-[#00f0ff]/10 file:text-[#00f0ff] hover:file:bg-[#00f0ff]/20 bg-ink-950/50 rounded-md p-2 border border-white/5" />
          </div>
          <Input label="Caption (Optional)" value={caption} onChange={(e: any) => setCaption(e.target.value)} placeholder="e.g. Speaking at Tech Conference" className="bg-ink-950/50" />
          
          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-white/10">
            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit" loading={loading} disabled={!file} className="bg-[#00f0ff] text-ink-950 hover:bg-[#00d0e0]">Upload Image</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
