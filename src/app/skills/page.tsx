'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Database } from 'lucide-react'
import { skillsService } from '@/lib/services'
import type { Skill } from '@/types'
import { motion } from 'framer-motion'
import Cursor from '@/components/ui/Cursor'

function SkillBar({ name, level }: { name: string; level: number }) {
  return (
    <div className="flex items-center gap-4">
      <span className="text-sm font-medium text-ink-900 dark:text-ink-200 min-w-[120px]">{name}</span>
      <div className="flex-1 h-2 bg-ink-200 dark:bg-white/10 overflow-hidden rounded-sm">
        <motion.div
          className="h-full bg-blue-600 dark:bg-[#00f0ff]"
          initial={{ width: '0%' }}
          animate={{ width: `${level}%` }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </div>
      <span className="font-mono text-xs text-ink-500 dark:text-ink-400 min-w-[32px] text-right">{level}%</span>
    </div>
  )
}

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([])
  const router = useRouter()

  useEffect(() => {
    skillsService.getAll(true).then(setSkills)
  }, [])

  const categories = [...new Set(skills.map(s => s.category))]

  return (
    <div className="bg-white dark:bg-ink-950 text-ink-900 dark:text-ink-50 min-h-screen pt-24 px-8 pb-24 font-sans selection:bg-blue-200">
      <Cursor />
      <div className="max-w-7xl mx-auto">
        <button onClick={() => router.push('/')} className="mb-8 flex items-center gap-2 font-mono text-sm uppercase tracking-widest text-ink-500 hover:text-blue-600 dark:hover:text-[#00f0ff] transition-colors">
          <ArrowLeft size={16} /> Back
        </button>
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-3">
            <div className="h-px w-10 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-[#00f0ff] dark:to-purple-500 shadow-[0_0_10px_rgba(0,120,255,0.5)] dark:shadow-[0_0_10px_rgba(0,240,255,0.5)]" />
            <p className="font-mono text-xs font-bold uppercase text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-[#00f0ff] dark:to-purple-500 tracking-[0.2em]">Expertise</p>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-ink-950 to-ink-700 dark:from-white dark:to-ink-300 tracking-tight pb-2">Core Competencies</h1>
          <p className="text-ink-600 dark:text-ink-400 text-lg mt-4 max-w-2xl font-medium">Quantifiable proficiencies across Data and Engineering layers.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative z-10">
          {categories.map((cat, i) => (
            <motion.div key={cat} className="bg-white/80 dark:bg-white/5 backdrop-blur-2xl rounded-3xl p-8 border border-white dark:border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.02)] dark:shadow-none hover:border-blue-300 dark:hover:border-[#00f0ff]/30 hover:shadow-[0_20px_40px_-15px_rgba(0,120,255,0.15)] dark:hover:shadow-[0_0_40px_-10px_rgba(0,240,255,0.15)] hover:-translate-y-1 transition-all duration-500 group relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent dark:from-white/5 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="flex items-center gap-3 mb-6 relative">
                <div className="p-2.5 bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 dark:from-blue-900/40 dark:to-purple-900/40 dark:text-[#00f0ff] rounded-xl group-hover:scale-110 shadow-sm transition-transform duration-300">
                  <Database size={20} />
                </div>
                <h3 className="font-extrabold text-lg text-ink-950 dark:text-white">{cat}</h3>
              </div>
              <div className="flex flex-col gap-6 relative">
                {skills.filter(s => s.category === cat).map((skill) => (
                  <SkillBar key={skill.id} name={skill.name} level={skill.level} />
                ))}
              </div>
            </motion.div>
          ))}
          {skills.length === 0 && (
            <p className="text-ink-500 col-span-full">No skills published yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}
