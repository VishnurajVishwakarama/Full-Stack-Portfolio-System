'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Github, ExternalLink, ArrowLeft, BarChart3 } from 'lucide-react'
import { projectsService } from '@/lib/services'
import type { Project } from '@/types'
import { Badge } from '@/components/ui'
import { motion } from 'framer-motion'
import Cursor from '@/components/ui/Cursor'

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const router = useRouter()

  useEffect(() => {
    projectsService.getAll(true).then(setProjects)
  }, [])

  return (
    <div className="bg-ink-50 dark:bg-ink-950 text-ink-900 dark:text-ink-50 min-h-screen pt-24 px-8 pb-24 font-sans selection:bg-blue-200">
      <Cursor />
      <div className="max-w-7xl mx-auto">
        <button onClick={() => router.push('/')} className="mb-8 flex items-center gap-2 font-mono text-sm uppercase tracking-widest text-ink-500 hover:text-blue-600 dark:hover:text-[#00f0ff] transition-colors">
          <ArrowLeft size={16} /> Back
        </button>
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-3">
            <div className="h-px w-10 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-[#00f0ff] dark:to-purple-500 shadow-[0_0_10px_rgba(0,120,255,0.5)] dark:shadow-[0_0_10px_rgba(0,240,255,0.5)]" />
            <p className="font-mono text-xs font-bold uppercase text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-[#00f0ff] dark:to-purple-500 tracking-[0.2em]">Archive</p>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-ink-950 to-ink-700 dark:from-white dark:to-ink-300 tracking-tight pb-2">Business Systems & Models</h1>
          <p className="text-ink-600 dark:text-ink-400 text-lg mt-4 max-w-2xl font-medium">Dashboards, predictive models, and operational software shipped to production.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((p, i) => (
            <motion.div
              key={p.id}
              className="bg-white/90 dark:bg-white/5 backdrop-blur-2xl border border-ink-200 dark:border-white/10 rounded-3xl overflow-hidden group hover:shadow-[0_20px_40px_-15px_rgba(0,120,255,0.15)] dark:hover:shadow-[0_0_40px_-10px_rgba(0,240,255,0.2)] dark:hover:border-[#00f0ff]/40 transition-all duration-500 flex flex-col relative hover:-translate-y-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <div className="h-52 bg-ink-100 dark:bg-ink-950/80 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-600/5 dark:bg-[#00f0ff]/5 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none" />
                {p.imageUrl ? (
                   <Image src={p.imageUrl} alt={p.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                ) : (
                  <BarChart3 className="text-ink-300 dark:text-ink-800 transition-transform duration-500 group-hover:scale-110" size={64} />
                )}
                {p.proofUrl && (
                  <Badge variant="lime" dot className="absolute top-4 right-4 shadow-md backdrop-blur-md bg-white/90 dark:bg-black/80 z-20">Verified Metric</Badge>
                )}
              </div>
              <div className="p-8 flex-1 flex flex-col relative z-20 bg-white/50 dark:bg-transparent">
                <h3 className="font-extrabold text-2xl text-transparent bg-clip-text bg-gradient-to-br from-ink-950 to-ink-700 dark:from-white dark:to-ink-300 mb-3 group-hover:from-blue-700 group-hover:to-indigo-700 dark:group-hover:from-[#00f0ff] dark:group-hover:to-purple-400 transition-all">{p.title}</h3>
                <p className="text-ink-600 dark:text-ink-300 text-sm leading-relaxed mb-6 flex-1 line-clamp-3 font-medium">{p.description}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {p.stack.map(t => <span key={t} className="px-3 py-1.5 bg-blue-50/50 text-blue-800 border border-blue-100 dark:border-white/5 dark:bg-white/5 dark:text-ink-200 text-xs font-bold rounded-lg shadow-sm">{t}</span>)}
                </div>
                <div className="flex gap-3 pt-6 border-t border-ink-100 dark:border-white/10 mt-auto">
                  {p.githubUrl && (
                    <a href={p.githubUrl} target="_blank" className="flex-1 flex justify-center items-center gap-2 text-sm font-bold text-ink-700 dark:text-ink-200 bg-white dark:bg-white/5 border border-ink-200 dark:border-white/10 hover:border-blue-400 dark:hover:border-[#00f0ff]/50 py-3 rounded-xl transition-all hover:shadow-sm">
                      <Github size={16} /> Repository
                    </a>
                  )}
                  {p.liveUrl && (
                    <a href={p.liveUrl} target="_blank" className="flex-1 flex justify-center items-center gap-2 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-md shadow-blue-500/20 py-3 rounded-xl transition-all">
                      <ExternalLink size={16} /> Live View
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          {projects.length === 0 && (
            <p className="text-ink-500 col-span-full">No projects published yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}
