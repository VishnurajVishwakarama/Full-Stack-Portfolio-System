'use client'
import { useState, useEffect } from 'react'
import { certificatesService } from '@/lib/services'
import type { Certificate } from '@/types'
import { Button, Input, Modal, Textarea } from '@/components/ui'
import toast from 'react-hot-toast'
import { Pencil, Trash2, Plus, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'

export default function CertificatesAdmin() {
  const [certs, setCerts] = useState<Certificate[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [editing, setEditing] = useState<Certificate | null>(null)
  const [file, setFile] = useState<File | undefined>(undefined)
  const [loading, setLoading] = useState(false)

  const emptyForm = { title: '', issuer: '', date: '', description: '', verifyUrl: '', order: 0 }
  const [formData, setFormData] = useState(emptyForm)

  useEffect(() => {
    return certificatesService.subscribe(setCerts)
  }, [])

  const handleOpen = (cert?: Certificate) => {
    if (cert) {
      setEditing(cert)
      setFormData({
        title: cert.title,
        issuer: cert.issuer,
        date: cert.date,
        description: cert.description || '',
        verifyUrl: cert.verifyUrl,
        order: cert.order || 0
      })
    } else {
      setEditing(null)
      setFormData(emptyForm)
    }
    setFile(undefined)
    setIsOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (editing) {
        await certificatesService.update(editing.id, formData, file)
        toast.success('Certificate updated')
      } else {
        await certificatesService.create(formData, file)
        toast.success('Certificate created')
      }
      setIsOpen(false)
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (cert: Certificate) => {
    if (!window.confirm('Delete this certificate forever?')) return
    try {
      await certificatesService.delete(cert.id, cert.imageUrl)
      toast.success('Certificate deleted')
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white font-mono tracking-widest">CERTIFICATES</h1>
        <Button onClick={() => handleOpen()} className="bg-[#00f0ff] text-ink-950 hover:bg-[#00d0e0]">
          <Plus size={16} className="mr-2" /> Add Certificate
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {certs.map(cert => (
          <div key={cert.id} className="bg-ink-900 border border-white/10 rounded-xl overflow-hidden flex flex-col">
            <div className="h-40 bg-ink-950 relative border-b border-white/10 flex items-center justify-center p-4">
              {cert.imageUrl ? (
                <Image src={cert.imageUrl} alt={cert.title} fill className="object-contain p-4" />
              ) : (
                <ImageIcon size={48} className="text-ink-800" />
              )}
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <h3 className="font-bold text-white text-md mb-1 line-clamp-2">{cert.title}</h3>
              <p className="text-[#00f0ff] font-mono text-[10px] tracking-wider uppercase mb-1">{cert.issuer}</p>
              <p className="text-ink-500 font-mono text-[10px] mb-4">{cert.date}</p>
              <div className="flex gap-2 mt-auto pt-4 border-t border-white/10">
                <button onClick={() => handleOpen(cert)} className="flex-1 py-2 text-xs font-semibold bg-white/5 text-ink-300 rounded hover:bg-[#00f0ff]/10 hover:text-[#00f0ff] transition-colors flex items-center justify-center gap-2"><Pencil size={14} /> Edit</button>
                <button onClick={() => handleDelete(cert)} className="flex-1 py-2 text-xs font-semibold bg-white/5 text-ink-300 rounded hover:bg-[#ff4d6d]/10 hover:text-[#ff4d6d] transition-colors flex items-center justify-center gap-2"><Trash2 size={14} /> Trash</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal open={isOpen} onClose={() => setIsOpen(false)} title={editing ? 'Edit Certificate' : 'New Certificate'} size="lg">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input label="Certificate Title" value={formData.title} onChange={(e: any) => setFormData({ ...formData, title: e.target.value })} required />
          
          <div className="grid grid-cols-2 gap-4">
            <Input label="Issuing Organization" value={formData.issuer} onChange={(e: any) => setFormData({ ...formData, issuer: e.target.value })} required />
            <Input label="Issue Date" value={formData.date} onChange={(e: any) => setFormData({ ...formData, date: e.target.value })} required placeholder="Aug 2024" />
          </div>
          
          <Textarea label="Description (Optional)" value={formData.description} onChange={(e: any) => setFormData({ ...formData, description: e.target.value })} />
          <Input label="Verification URL" type="url" value={formData.verifyUrl} onChange={(e: any) => setFormData({ ...formData, verifyUrl: e.target.value })} required placeholder="https://credential.net/..." />

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-mono text-ink-500 uppercase tracking-widest">Certificate Image</label>
            <input type="file" accept="image/*" onChange={(e: any) => setFile(e.target.files?.[0])} className="text-sm text-ink-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-[#00f0ff]/10 file:text-[#00f0ff] hover:file:bg-[#00f0ff]/20 bg-ink-950/50 rounded-md p-2 border border-white/5" />
          </div>

          <Input label="Display Order" type="number" value={formData.order} onChange={(e: any) => setFormData({ ...formData, order: Number(e.target.value) })} required />
          
          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-white/10">
            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit" loading={loading} className="bg-[#00f0ff] text-ink-950 hover:bg-[#00d0e0]">{editing ? 'Save Changes' : 'Publish Certificate'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
