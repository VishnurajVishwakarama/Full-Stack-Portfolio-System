'use client'
import { useState, useEffect } from 'react'
import { skillsService } from '@/lib/services'
import type { Skill } from '@/types'
import { Button, Input, Modal, Badge } from '@/components/ui'
import toast from 'react-hot-toast'
import { Pencil, Trash2, Plus } from 'lucide-react'

export default function SkillsAdmin() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [editing, setEditing] = useState<Skill | null>(null)
  const [formData, setFormData] = useState({ name: '', level: 50, category: 'Frontend', order: 0 })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    return skillsService.subscribe(setSkills)
  }, [])

  const handleOpen = (skill?: Skill) => {
    if (skill) {
      setEditing(skill)
      setFormData({ name: skill.name, level: skill.level, category: skill.category, order: skill.order || 0 })
    } else {
      setEditing(null)
      setFormData({ name: '', level: 50, category: 'Frontend', order: 0 })
    }
    setIsOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (editing) {
        await skillsService.update(editing.id, formData)
        toast.success('Skill updated')
      } else {
        await skillsService.create(formData)
        toast.success('Skill created')
      }
      setIsOpen(false)
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure?')) return
    try {
      await skillsService.delete(id)
      toast.success('Skill deleted')
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white font-mono tracking-widest">SKILLS MANAGEMENT</h1>
        <Button onClick={() => handleOpen()} className="bg-[#00f0ff] text-ink-950 hover:bg-[#00d0e0]">
          <Plus size={16} className="mr-2" /> Add Skill
        </Button>
      </div>

      <div className="bg-ink-900 border border-white/10 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm text-ink-300">
          <thead className="bg-ink-950/80 text-xs uppercase font-mono text-ink-500 border-b border-white/10">
            <tr>
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium">Category</th>
              <th className="px-6 py-4 font-medium">Proficiency</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {skills.map(skill => (
              <tr key={skill.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-medium text-white">{skill.name}</td>
                <td className="px-6 py-4"><Badge>{skill.category}</Badge></td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-1.5 bg-ink-950 rounded-full overflow-hidden">
                      <div className="h-full bg-[#00f0ff]" style={{ width: `${skill.level}%` }} />
                    </div>
                    <span className="font-mono text-xs">{skill.level}%</span>
                  </div>
                </td>
                <td className="px-6 py-4 flex justify-end gap-2">
                  <button onClick={() => handleOpen(skill)} className="p-2 text-ink-400 hover:text-[#00f0ff] hover:bg-[#00f0ff]/10 rounded-md transition-colors"><Pencil size={16} /></button>
                  <button onClick={() => handleDelete(skill.id)} className="p-2 text-ink-400 hover:text-[#ff4d6d] hover:bg-[#ff4d6d]/10 rounded-md transition-colors"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
            {skills.length === 0 && (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-ink-500 font-mono">No skills found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal open={isOpen} onClose={() => setIsOpen(false)} title={editing ? 'Edit Skill' : 'New Skill'}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input label="Skill Name" value={formData.name} onChange={(e: any) => setFormData({ ...formData, name: e.target.value })} required placeholder="e.g. React.js" className="bg-ink-950/50" />
          <Input label="Category" value={formData.category} onChange={(e: any) => setFormData({ ...formData, category: e.target.value })} required placeholder="e.g. Frontend" className="bg-ink-950/50" />
          
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-mono text-ink-500 uppercase tracking-widest">Proficiency ({formData.level}%)</label>
            <input type="range" min="1" max="100" value={formData.level} onChange={(e: any) => setFormData({ ...formData, level: Number(e.target.value) })} className="w-full accent-[#00f0ff]" />
          </div>
          
          <Input label="Display Order" type="number" value={formData.order} onChange={(e: any) => setFormData({ ...formData, order: Number(e.target.value) })} required className="bg-ink-950/50" />
          
          <div className="flex justify-end gap-3 mt-4">
            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit" loading={loading} className="bg-[#00f0ff] text-ink-950 hover:bg-[#00d0e0]">{editing ? 'Save Changes' : 'Create Skill'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
