'use client'

import { useEffect, useRef, useState } from 'react'
import { useTheme } from 'next-themes'
import { motion, useInView } from 'framer-motion'
import { useInView as useInViewObs } from 'react-intersection-observer'
import Image from 'next/image'
import Link from 'next/link'
import { Github, Linkedin, Mail, Phone, Moon, Sun, ExternalLink, Shield, Download, Eye, CheckCircle2, ArrowUpRight, BarChart3, Database, Network, Award } from 'lucide-react'
import { projectsService, certificatesService, skillsService, galleryService, cvService, messagesService, settingsService } from '@/lib/services'
import type { Project, Certificate, Skill, GalleryImage, CVFile, SiteSettings } from '@/types'
import { Badge, Button, Modal, Input, Textarea } from '@/components/ui'
import Cursor from '@/components/ui/Cursor'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

// ─── SKILL BAR ────────────────────────────────────────────────────────────────

function SkillBar({ name, level }: { name: string; level: number }) {
  const { ref, inView } = useInViewObs({ triggerOnce: true, threshold: 0.5 })
  return (
    <div ref={ref} className="flex items-center gap-4">
      <span className="text-sm font-medium text-ink-900 dark:text-ink-200 min-w-[120px]">{name}</span>
      <div className="flex-1 h-2 bg-ink-200 dark:bg-white/10 overflow-hidden rounded-sm">
        <motion.div
          className="h-full bg-blue-600 dark:bg-[#00f0ff]"
          initial={{ width: '0%' }}
          animate={inView ? { width: `${level}%` } : { width: '0%' }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </div>
      <span className="font-mono text-xs text-ink-500 dark:text-ink-400 min-w-[32px] text-right">{level}%</span>
    </div>
  )
}

// ─── COUNTER ─────────────────────────────────────────────────────────────────

function Counter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const { ref, inView } = useInViewObs({ triggerOnce: true })
  useEffect(() => {
    if (!inView) return
    let start = 0
    const step = () => {
      start += Math.max(1, Math.floor((value - start) / 8))
      setCount(Math.min(start, value))
      if (start < value) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [inView, value])
  return <span ref={ref}>{count}{suffix}</span>
}

// ─── NAV ─────────────────────────────────────────────────────────────────────

function Nav({ settings }: { settings: SiteSettings | null }) {
  const [scrolled, setScrolled] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 flex items-center justify-between px-8 py-4 transition-all duration-500 ${scrolled ? 'bg-white/70 dark:bg-ink-950/70 backdrop-blur-2xl border-b border-ink-200/50 dark:border-white/10 shadow-sm' : ''}`}>
      {settings?.profileImage ? (
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-500/30 dark:border-[#00f0ff]/30 relative group-hover:border-blue-500 dark:group-hover:border-[#00f0ff] transition-colors shadow-[0_0_15px_rgba(0,120,255,0.1)] dark:shadow-[0_0_15px_rgba(0,240,255,0.1)]">
            <Image src={settings.profileImage} alt="Profile" fill className="object-cover" />
          </div>
          <span className="font-extrabold text-xl text-ink-900 dark:text-white tracking-tight hidden sm:block">
            {settings?.name || 'VV.'}
          </span>
        </div>
      ) : (
        <span className="font-extrabold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600 dark:from-[#00f0ff] dark:to-purple-400 tracking-tight flex items-center gap-2">
          <Database size={24} className="text-blue-600 dark:text-[#00f0ff]" /> VV.
        </span>
      )}
      <ul className="hidden md:flex items-center gap-8">
        {[
          { label: 'About', href: '/#about' },
          { label: 'Skills', href: '/skills' },
          { label: 'Projects', href: '/projects' },
          { label: 'Certificates', href: '/certificates' },
          { label: 'Experience', href: '/#experience' },
          { label: 'Contact', href: '/#contact' }
        ].map((item) => (
          <li key={item.label}>
            <Link href={item.href} className="relative text-sm font-semibold tracking-wide text-ink-600 hover:text-blue-700 dark:text-ink-300 dark:hover:text-[#00f0ff] transition-colors group py-1">
              {item.label}
              <span className="absolute left-0 bottom-0 top-auto w-0 h-[2px] bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-[#00f0ff] dark:to-purple-500 transition-all duration-300 group-hover:w-full rounded-full" />
            </Link>
          </li>
        ))}
      </ul>
      {mounted && (
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-ink-100 hover:bg-ink-200 dark:bg-white/5 dark:hover:bg-white/10 text-ink-700 dark:text-ink-300 transition-all focus:outline-none ring-1 ring-ink-200 dark:ring-white/10 hover:ring-blue-300 dark:hover:ring-[#00f0ff]/50 shadow-sm"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      )}
    </nav>
  )
}

// ─── HERO ─────────────────────────────────────────────────────────────────────

function Hero({ settings }: { settings: SiteSettings | null }) {
  const name = settings?.name || 'Vishnuraj Vishwakarma'
  const role = settings?.role || 'Founder & COO — Austrange Solutions Pvt Ltd'
  const tagline = settings?.tagline || 'Turning raw data into decisions that shape the future.'
  
  return (
    <section id="home" className="min-h-screen relative flex items-center px-8 overflow-hidden bg-white dark:bg-ink-950">
      {/* Grid background for light & dark */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] dark:bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)]" />
      
      {/* Vibrant Animated Ambient Glows */}
      <motion.div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/20 dark:bg-[#00f0ff]/10 rounded-full blur-[140px] pointer-events-none mix-blend-screen" animate={{ scale: [1, 1.2, 1], x: [0, -50, 0], opacity: [0.4, 0.7, 0.4] }} transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="absolute -bottom-96 -left-48 w-[1000px] h-[1000px] bg-indigo-500/20 dark:bg-purple-900/30 rounded-full blur-[160px] pointer-events-none mix-blend-screen" animate={{ scale: [1, 1.1, 1], y: [0, -50, 0], opacity: [0.4, 0.6, 0.4] }} transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }} />
      <motion.div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-teal-400/20 dark:bg-[#7fff6e]/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 5 }} />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center pt-24 z-10">
        <motion.div
          initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", staggerChildren: 0.1 }}
        >
          <motion.div className="flex items-center gap-3 mb-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Network size={16} className="text-blue-600 dark:text-[#00f0ff]" />
            <span className="font-mono text-xs tracking-widest uppercase text-blue-600 dark:text-[#00f0ff] font-bold">
              {settings?.location || 'Mumbai, India'} {settings?.availability !== false ? '• Available' : ''}
            </span>
          </motion.div>
          <motion.h1 
            className="text-[clamp(3.5rem,8vw,5.5rem)] font-extrabold leading-[1.1] mb-4 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-ink-950 via-blue-900 to-blue-700 dark:from-white dark:via-blue-100 dark:to-[#00f0ff]"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          >
            {name}
          </motion.h1>
          <motion.p 
            className="text-ink-700 dark:text-ink-200 text-xl font-bold leading-relaxed max-w-lg mb-3"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          >
            {role}
          </motion.p>
          <motion.p 
            className="text-ink-500 dark:text-ink-400 text-base max-w-lg leading-relaxed relative pl-4 border-l-2 border-blue-500 dark:border-[#00f0ff]"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          >
            {tagline}
          </motion.p>
          <motion.div className="mt-10 flex gap-4 flex-wrap" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <Button size="lg" className="relative group overflow-hidden bg-blue-600 text-white hover:bg-blue-700 dark:bg-white dark:text-ink-950 dark:hover:bg-gray-100 shadow-xl shadow-blue-500/20 dark:shadow-[#00f0ff]/10 border-none transition-all duration-300" onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}>
              <span className="relative z-10 flex items-center gap-2">View Analytics & Work <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></span>
              <div className="absolute inset-0 h-full w-full opacity-0 group-hover:opacity-100 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%,transparent_100%)] dark:bg-[linear-gradient(45deg,transparent_25%,rgba(0,240,255,0.3)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%,100%_100%] animate-pulse" />
            </Button>
            <Button variant="ghost" size="lg" className="border-ink-200 dark:border-white/20 hover:border-blue-500 dark:hover:border-[#00f0ff] transition-colors group" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
              Connect <ArrowUpRight size={16} className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform opacity-50 group-hover:opacity-100 group-hover:text-blue-500 dark:group-hover:text-[#00f0ff]" />
            </Button>
          </motion.div>
        </motion.div>

        {/* Corporate / Data Node Hero Graphic */}
        <motion.div
          className="hidden lg:flex justify-center relative h-[500px]"
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
        >
          <div className="relative w-full h-full">
            {/* Minimalist Data Nodes */}
            <motion.div className="absolute top-5 right-10 w-32 h-32 bg-white/60 dark:bg-ink-900/60 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/50 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] z-20" animate={{ y: [0, -15, 0], rotate: [0, 2, 0] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}>
               <BarChart3 size={40} className="text-blue-600 dark:text-[#00f0ff]" />
            </motion.div>
            <motion.div className="absolute bottom-10 left-0 w-36 h-36 bg-white/60 dark:bg-ink-900/60 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/50 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] rotate-12 z-20" animate={{ y: [0, 20, 0], rotate: [12, 5, 12] }} transition={{ repeat: Infinity, duration: 8, ease: "easeInOut", delay: 1 }}>
               <Database size={48} className="text-indigo-600 dark:text-purple-400" />
            </motion.div>
            {/* Center Focus Box */}
            <div className="absolute inset-0 flex items-center justify-center z-10 mt-8">
              <div className="w-[340px] h-[400px] bg-white/80 dark:bg-ink-900/40 backdrop-blur-2xl border border-white/60 dark:border-white/10 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_0_40px_rgba(0,240,255,0.1)] flex flex-col overflow-hidden relative transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(0,120,255,0.2)] dark:hover:shadow-[0_0_60px_rgba(0,240,255,0.15)] group">
                 <div className="h-12 border-b border-ink-100/50 dark:border-white/10 flex items-center px-5 bg-ink-50/50 dark:bg-ink-950/20 gap-2">
                   <div className="w-3 h-3 rounded-full bg-red-400 opacity-80" />
                   <div className="w-3 h-3 rounded-full bg-amber-400 opacity-80" />
                   <div className="w-3 h-3 rounded-full bg-green-400 opacity-80" />
                   <div className="flex-1" />
                   <span className="font-mono text-[10px] text-ink-400 dark:text-ink-600">VV.OS</span>
                 </div>
                 <div className="flex-1 p-6 flex flex-col items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[#00f0ff]/5 dark:bg-white/5 group-hover:bg-[#00f0ff]/10 dark:group-hover:bg-white/10 transition-colors duration-500" />
                    {settings?.profileImage ? (
                      <div className="relative w-56 h-56 rounded-full overflow-hidden border-2 border-white/50 dark:border-white/10 shadow-2xl z-10 mt-[-20px]">
                        <Image src={settings.profileImage} alt="Profile" fill className="object-cover transition-transform duration-1000 group-hover:scale-[1.03]" />
                        <div className="absolute inset-0 ring-1 ring-inset ring-white/20 rounded-full pointer-events-none" />
                      </div>
                    ) : (
                      <div className="relative w-56 h-56 rounded-full bg-blue-50 dark:bg-ink-950/50 border border-blue-100 dark:border-white/10 flex items-center justify-center shadow-inner z-10 mt-[-20px]">
                        <span className="font-bold text-7xl text-blue-600 dark:text-[#00f0ff] opacity-90 drop-shadow-sm">VV</span>
                      </div>
                    )}
                    {/* Dynamic sweeping laser effect */}
                    <motion.div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 via-transparent to-indigo-600/10 dark:from-[#00f0ff]/10 dark:to-purple-500/10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <motion.div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-400 to-indigo-600 dark:from-[#00f0ff] dark:to-purple-500" animate={{ width: ['0%', '100%', '0%'] }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }} />
                 </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* KPI Stats replacing generic stats */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-ink-200/50 dark:border-white/10 bg-white/70 dark:bg-ink-950/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex gap-10 overflow-x-auto py-6 px-8">
          {[
            { num: 9.4, suffix: '', label: 'SGPA Academic Score' },
            { num: 5, suffix: '+', label: 'Systems Shipped' },
            { num: 3, suffix: '', label: 'Industry Awards' },
            { num: 80, suffix: '%', label: 'Manual Work Reduced' },
          ].map((s, i) => (
            <motion.div key={s.label} className="flex-shrink-0" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 + i*0.1 }}>
              <div className="font-bold text-3xl text-ink-900 dark:text-white">
                <Counter value={s.num} suffix={s.suffix} />
              </div>
              <div className="text-xs text-ink-500 font-medium mt-1 uppercase tracking-widest">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── SECTION HEADER ──────────────────────────────────────────────────────────

function SectionHeader({ num, title, sub, center }: { num: string; title: string; sub?: string; center?: boolean }) {
  return (
    <div className={`mb-16 ${center ? 'text-center' : ''}`}>
      <div className={`flex items-center gap-4 mb-3 ${center ? 'justify-center' : ''}`}>
        <div className="h-px w-10 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-[#00f0ff] dark:to-purple-500 shadow-[0_0_10px_rgba(0,120,255,0.5)] dark:shadow-[0_0_10px_rgba(0,240,255,0.5)]" />
        <p className="font-mono text-xs font-bold uppercase text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-[#00f0ff] dark:to-purple-500 tracking-[0.2em]">{num}</p>
      </div>
      <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-ink-950 to-ink-700 dark:from-white dark:to-ink-300 tracking-tight pb-2">{title}</h2>
      {sub && <p className={`text-ink-600 dark:text-ink-400 text-lg mt-4 max-w-2xl font-medium ${center ? 'mx-auto' : ''}`}>{sub}</p>}
    </div>
  )
}

// ─── ABOUT SECTION ────────────────────────────────────────────────────────────

function AboutSection({ settings }: { settings: SiteSettings | null }) {
  const bio = settings?.bio || 'B.Sc IT graduate (SGPA: 9.4) and Founder & COO of Austrange Solutions Pvt Ltd, combining data science depth with real-world entrepreneurial execution. Proficient in Python, Pandas, NumPy, SQL, Excel, Power BI, Tableau, Machine Learning, and EDA.'
  return (
    <section id="about" className="py-24 px-8 bg-ink-50 dark:bg-ink-950">
      <div className="max-w-7xl mx-auto">
        <SectionHeader num="01" title="Summary" sub="Synthesizing tech capabilities with executive management." />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <div className="prose prose-lg dark:prose-invert max-w-none text-ink-700 dark:text-ink-300 font-medium">
              {bio.split('\n').map((p, i) => <p key={i} className="mb-4 leading-relaxed">{p}</p>)}
            </div>
            <div className="flex flex-wrap gap-2 mt-8">
              {['Python','SQL','Power BI','Tableau','Scikit-learn','OpenCV','Google Apps Script','IoT'].map(tag => (
                <span key={tag} className="text-xs font-bold px-4 py-2 bg-white/50 dark:bg-white/5 backdrop-blur-md border border-ink-200 dark:border-white/10 rounded-full text-ink-800 dark:text-ink-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-blue-400 dark:hover:border-[#00f0ff]/40 transition-all">{tag}</span>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Education', value: 'B.Sc IT · Chetana College · SGPA 9.4' },
              { label: 'Current Role', value: 'Founder & COO · Austrange Solutions' },
              { label: 'Location', value: settings?.location || 'Mumbai, India' },
              { label: 'Research', value: 'Published cybersecurity optimization paper' },
            ].map((item, i) => (
              <motion.div key={item.label} className="p-6 bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-ink-200 dark:border-white/10 rounded-2xl hover:shadow-[0_8px_30px_rgba(0,120,255,0.08)] dark:hover:shadow-[0_8px_30px_rgba(0,240,255,0.1)] dark:hover:border-[#00f0ff]/30 hover:-translate-y-1 transition-all duration-300 group"
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <p className="text-xs font-bold uppercase text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-[#00f0ff] dark:to-purple-400 mb-2">{item.label}</p>
                <p className="text-sm font-semibold text-ink-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-[#00f0ff] transition-colors">{item.value}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── SKILLS SECTION ───────────────────────────────────────────────────────────

function SkillsSection({ skills }: { skills: Skill[] }) {
  const categories = [...new Set(skills.map(s => s.category))]
  return (
    <section id="skills" className="py-24 px-8 bg-white dark:bg-ink-950 border-y border-ink-100 dark:border-white/10 relative overflow-hidden">
      {/* Background soft glow for skills */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 dark:bg-[#00f0ff]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeader num="02" title="Core Competencies" sub="Quantifiable proficiencies across Data and Engineering layers." />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, i) => (
            <motion.div key={cat} className="bg-white/80 dark:bg-white/5 backdrop-blur-2xl rounded-3xl p-8 border border-white dark:border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.02)] dark:shadow-none hover:border-blue-300 dark:hover:border-[#00f0ff]/30 hover:shadow-[0_20px_40px_-15px_rgba(0,120,255,0.15)] dark:hover:shadow-[0_0_40px_-10px_rgba(0,240,255,0.15)] hover:-translate-y-1 transition-all duration-500 group relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              {/* Card internal gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent dark:from-white/5 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="flex items-center gap-3 mb-6 relative">
                <div className="p-2.5 bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 dark:from-blue-900/40 dark:to-purple-900/40 dark:text-[#00f0ff] rounded-xl group-hover:scale-110 shadow-sm transition-transform duration-300">
                  <Database size={20} />
                </div>
                <h3 className="font-extrabold text-lg text-ink-950 dark:text-white">{cat}</h3>
              </div>
              <div className="flex flex-col gap-6 relative">
                {skills.filter(s => s.category === cat).map((skill, j) => (
                  <SkillBar key={skill.id} name={skill.name} level={skill.level} />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── PROJECTS SECTION ─────────────────────────────────────────────────────────

function ProjectsSection({ projects }: { projects: Project[] }) {
  return (
    <section id="projects" className="py-24 px-8 bg-ink-50 dark:bg-ink-950 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/5 dark:bg-purple-900/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeader num="03" title="Business Systems & Models" sub="Dashboards, predictive models, and operational software shipped to production." />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((p, i) => (
            <motion.div
              key={p.id}
              className="bg-white/90 dark:bg-white/5 backdrop-blur-2xl border border-ink-200 dark:border-white/10 rounded-3xl overflow-hidden group hover:shadow-[0_20px_40px_-15px_rgba(0,120,255,0.15)] dark:hover:shadow-[0_0_40px_-10px_rgba(0,240,255,0.2)] dark:hover:border-[#00f0ff]/40 transition-all duration-500 flex flex-col relative hover:-translate-y-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
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
                  {p.stack.slice(0, 4).map(t => <span key={t} className="px-3 py-1.5 bg-blue-50/50 text-blue-800 border border-blue-100 dark:border-white/5 dark:bg-white/5 dark:text-ink-200 text-xs font-bold rounded-lg shadow-sm">{t}</span>)}
                  {p.stack.length > 4 && <span className="px-3 py-1.5 text-ink-500 text-xs font-bold">+{p.stack.length - 4}</span>}
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
        </div>
      </div>
    </section>
  )
}

// ─── EXPERIENCE SECTION ───────────────────────────────────────────────────────

function ExperienceSection() {
  const items = [
    { date: 'Dec 2025 — Present', role: 'Founder & COO', company: 'Austrange Solutions Pvt Ltd · Mumbai', bullets: ['Leading end-to-end business operations while building a technology product.','Built internal KPI dashboards using Python and Google Sheets for real-time decisions.','Managing cross-functional teams, SOPs, budgeting, and go-to-market strategy.'] },
    { date: 'Jan 2024 — Jan 2025', role: 'Web Developer / Analyst', company: 'Vishnushakti Foundation (NGO) · Mumbai', bullets: ['Enhanced responsive web portals, increasing engagement metrics by 35% in Q1.','Automated admin workflows via Google Apps Script and custom datasets, reducing manual entry overhead by 80%.'] },
    { date: '2024', role: 'Business Analytics Program', company: 'Dr. Shuhila Gandhi Skill Center · UAV Pharmaceuticals', bullets: ['Completed certified training in business analytics, KPI frameworks, and Power BI dashboarding.'] },
  ]
  return (
    <section id="experience" className="py-24 px-8 bg-white dark:bg-ink-950 border-y border-ink-100 dark:border-white/10">
      <div className="max-w-4xl mx-auto">
        <SectionHeader num="04" title="Professional Timeline" />
        <div className="relative pl-8 border-l-2 border-transparent ml-4 mt-10">
          <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-blue-500 via-indigo-500 to-transparent dark:from-[#00f0ff] dark:via-purple-500 dark:to-transparent" />
          {items.map((item, i) => (
            <motion.div key={i} className="mb-14 last:mb-0 relative group"
              initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <div className="absolute -left-[41px] w-5 h-5 rounded-full bg-white dark:bg-ink-950 border-4 border-blue-500 dark:border-[#00f0ff] shadow-[0_0_10px_rgba(0,120,255,0.5)] dark:shadow-[0_0_10px_rgba(0,240,255,0.5)] group-hover:scale-125 transition-transform duration-300" />
              <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-ink-200 dark:border-white/10 rounded-2xl p-8 hover:shadow-[0_8px_30px_rgba(0,120,255,0.08)] dark:hover:shadow-[0_8px_30px_rgba(0,240,255,0.1)] dark:hover:border-[#00f0ff]/30 hover:-translate-y-1 transition-all duration-300">
                <span className="inline-block px-4 py-1.5 bg-blue-50/80 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 text-xs font-bold uppercase tracking-wider rounded-lg mb-5 border border-blue-100 dark:border-blue-800/50 shadow-sm">{item.date}</span>
                <h3 className="font-extrabold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-ink-950 to-ink-700 dark:from-white dark:to-ink-300 mb-1">{item.role}</h3>
                <p className="font-bold text-sm text-blue-600 dark:text-[#00f0ff] mb-6">{item.company}</p>
                <ul className="flex flex-col gap-4">
                  {item.bullets.map((b, j) => (
                    <li key={j} className="text-ink-700 dark:text-ink-200 text-sm leading-relaxed pl-6 relative before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:bg-indigo-500 dark:before:bg-purple-500 before:rounded-sm font-medium">{b}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── CERTIFICATES SECTION ─────────────────────────────────────────────────────

function CertificatesSection({ certs }: { certs: Certificate[] }) {
  const [selected, setSelected] = useState<Certificate | null>(null)
  return (
    <section id="certificates" className="py-24 px-8 bg-ink-50 dark:bg-ink-950 relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-400/5 dark:bg-[#00f0ff]/5 rounded-full blur-[140px] pointer-events-none mix-blend-screen" />
      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeader num="05" title="Verified Credentials" sub="Every certificate links to a live verification source." />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {certs.map((c, i) => (
            <motion.div
              key={c.id}
              onClick={() => setSelected(c)}
              className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-ink-200 dark:border-white/10 rounded-3xl overflow-hidden group cursor-pointer hover:border-blue-400 dark:hover:border-[#00f0ff]/50 hover:shadow-[0_10px_30px_-10px_rgba(0,120,255,0.2)] dark:hover:shadow-[0_0_30px_-10px_rgba(0,240,255,0.2)] hover:-translate-y-2 transition-all duration-300 flex flex-col"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.07 }}
            >
              <div className="h-40 bg-ink-100 dark:bg-ink-950 flex items-center justify-center relative overflow-hidden p-4">
                <div className="absolute inset-0 bg-blue-500/5 dark:bg-[#00f0ff]/5 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none" />
                {c.imageUrl
                  ? <Image src={c.imageUrl} alt={c.title} fill className="object-contain p-2 opacity-90 transition-transform duration-700 group-hover:scale-105" />
                  : <Award className="text-blue-200 dark:text-blue-900/50 transition-transform duration-500 group-hover:scale-110" size={64} />}
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <p className="font-extrabold text-base text-transparent bg-clip-text bg-gradient-to-br from-ink-950 to-ink-700 dark:from-white dark:to-ink-300 mb-2 line-clamp-2 group-hover:from-blue-700 group-hover:to-indigo-700 dark:group-hover:from-[#00f0ff] dark:group-hover:to-purple-400 transition-all">{c.title}</p>
                <p className="font-bold text-xs text-blue-600 dark:text-[#00f0ff] mb-6 flex-1">{c.issuer}</p>
                <div className="flex gap-2">
                  <button className="flex-1 font-bold text-xs py-2.5 bg-white dark:bg-white/5 border border-ink-200 dark:border-white/10 text-ink-700 dark:text-ink-300 rounded-xl hover:bg-ink-50 dark:hover:bg-white/10 hover:shadow-sm transition-all focus:outline-none">
                    Preview
                  </button>
                  <a href={c.verifyUrl} target="_blank" onClick={e => e.stopPropagation()}
                    className="flex items-center justify-center gap-1 font-bold text-xs py-2.5 px-4 bg-gradient-to-r from-green-500 to-emerald-500 dark:from-[#7fff6e]/20 dark:to-green-500/20 text-white dark:text-[#7fff6e] rounded-xl hover:shadow-[0_0_15px_rgba(34,197,94,0.4)] dark:hover:shadow-[0_0_15px_rgba(127,255,110,0.2)] transition-all">
                    <Shield size={14} /> Verify
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.title}>
        {selected && (
          <div>
            <p className="font-extrabold text-sm text-blue-600 dark:text-[#00f0ff] mb-2">{selected.issuer}</p>
            <p className="font-bold text-xs text-ink-500 mb-6 px-3 py-1 inline-block bg-ink-100 dark:bg-white/10 rounded-full">{selected.date}</p>
            {selected.description && <p className="text-sm text-ink-700 dark:text-ink-200 font-medium leading-relaxed mb-8">{selected.description}</p>}
            <div className="flex gap-4">
              <Button onClick={() => window.open(selected.verifyUrl, '_blank')} className="bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/20 border-none w-full sm:w-auto">
                <Shield size={16} className="mr-2" /> Verify Authenticity Live
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </section>
  )
}

// ─── GALLERY SECTION ──────────────────────────────────────────────────────────

function GallerySection({ images }: { images: GalleryImage[] }) {
  const [lightbox, setLightbox] = useState<GalleryImage | null>(null)
  return (
    <section id="gallery" className="py-24 px-8 bg-white dark:bg-ink-950 border-y border-ink-100 dark:border-white/10">
      <div className="max-w-7xl mx-auto">
        <SectionHeader num="06" title="Gallery" sub="Moments & milestones." />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((img, i) => (
            <motion.div
              key={img.id}
              onClick={() => setLightbox(img)}
              className="aspect-square rounded-2xl overflow-hidden cursor-pointer group relative bg-ink-100 dark:bg-ink-900 shadow-sm hover:shadow-[0_10px_30px_-10px_rgba(0,120,255,0.3)] dark:hover:shadow-[0_0_30px_-10px_rgba(0,240,255,0.3)] transition-all duration-300 transform hover:-translate-y-1"
              initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }} transition={{ delay: i * 0.05 }}
            >
              <Image src={img.url} alt={img.caption || ''} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-900/80 via-ink-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                <Eye size={28} className="text-white scale-75 group-hover:scale-100 transition-transform duration-300 drop-shadow-md" />
              </div>
              {img.caption && (
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-white text-xs font-bold line-clamp-2 drop-shadow-md">{img.caption}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
      <Modal open={!!lightbox} onClose={() => setLightbox(null)} size="lg">
        {lightbox && (
          <div>
            <div className="relative aspect-video w-full rounded-xl overflow-hidden mb-5 bg-ink-100 dark:bg-ink-950 shadow-inner">
              <Image src={lightbox.url} alt={lightbox.caption || ''} fill className="object-contain" />
            </div>
            {lightbox.caption && <p className="text-ink-700 dark:text-ink-200 text-sm text-center font-bold">{lightbox.caption}</p>}
          </div>
        )}
      </Modal>
    </section>
  )
}

// ─── AWARDS SECTION ───────────────────────────────────────────────────────────

function AwardsSection() {
  const awards = [
    { num: '01', title: '1st Prize — MSSU Ideation Competition 2.0', sub: 'Honored by Governor of Maharashtra Shri CP Radhakrishnan · Apr 2025', tag: 'Rs. 3,00,000' },
    { num: '02', title: 'Winner — TECH-MANIA 2k25', sub: 'First place at intercollegiate tech fest', tag: '1st Place' },
    { num: '03', title: 'Winner — NAVINNYA 2023', sub: 'Intercollegiate test — Smart Stick project', tag: '1st Place' },
    { num: '04', title: 'SMT. GEETA ISRANI Merit Scholarship', sub: 'Outstanding academic excellence', tag: 'SGPA 9.4' },
  ]
  return (
    <section id="awards" className="py-24 px-8 bg-ink-50 dark:bg-ink-950">
      <div className="max-w-7xl mx-auto">
        <SectionHeader num="07" title="Awards & Recognitions" />
        <div className="divide-y divide-ink-200/50 dark:divide-white/10">
          {awards.map((a, i) => (
            <motion.div key={i} className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 py-8 hover:bg-white/50 dark:hover:bg-white/5 px-6 -mx-6 rounded-2xl transition-all duration-300 group"
              initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
              <span className="font-extrabold text-5xl text-transparent bg-clip-text bg-ink-200 dark:bg-white/10 group-hover:bg-gradient-to-b group-hover:from-blue-600 group-hover:to-indigo-300 dark:group-hover:from-[#00f0ff] dark:group-hover:to-purple-500 transition-all min-w-[4rem]">{a.num}</span>
              <div className="flex-1">
                <p className="font-extrabold text-xl text-ink-950 dark:text-white group-hover:text-blue-700 dark:group-hover:text-[#00f0ff] transition-colors">{a.title}</p>
                <p className="text-ink-600 dark:text-ink-400 text-sm mt-1 font-medium">{a.sub}</p>
              </div>
              <Badge variant="gold" className="self-start sm:self-center shadow-sm whitespace-nowrap px-4 py-1.5 text-xs ring-1 ring-[#f5c842]/50">{a.tag}</Badge>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── CV & CONTACT SECTION ──────────────────────────────────────────────────────────

function ContactSection({ settings, cv }: { settings: SiteSettings | null, cv: CVFile | null }) {
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm()
  const onSubmit = async (data: any) => {
    try {
      await messagesService.create(data)
      toast.success('Inquiry submitted successfully.')
      reset()
    } catch {
      toast.error('Failed to submit. Please try again.')
    }
  }
  return (
    <section id="contact" className="py-24 px-8 bg-white dark:bg-ink-950 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 dark:bg-[#00f0ff]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeader num="08" title="Connect & Collaborate" center />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-16 max-w-5xl mx-auto">
          {/* Quick Info & CV */}
          <div className="flex flex-col gap-6">
            <div className="bg-white/80 dark:bg-ink-900/50 backdrop-blur-xl p-8 rounded-3xl border border-ink-200 dark:border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.03)] dark:shadow-none hover:shadow-[0_8px_30px_rgba(0,120,255,0.08)] dark:hover:border-[#00f0ff]/30 transition-all duration-300">
              <h3 className="text-2xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-ink-950 to-ink-700 dark:from-white dark:to-ink-300">Professional Details</h3>
              <div className="flex flex-col gap-6">
                {[
                  { icon: <Mail size={20} />, label: 'Email Address', value: settings?.email || 'vishnurajvishwakarma@gmail.com', href: `mailto:${settings?.email || 'vishnurajvishwakarma@gmail.com'}` },
                  { icon: <Linkedin size={20} />, label: 'LinkedIn', value: 'vishnuraj-vishwakarma', href: 'https://linkedin.com/in/vishnuraj-vishwakarma' },
                  { icon: <Github size={20} />, label: 'GitHub', value: 'VishnurajVishwakarama', href: 'https://github.com/VishnurajVishwakarama' }
                ].map(item => (
                   <a key={item.label} href={item.href} target="_blank" className="flex items-center gap-5 group">
                     <div className="w-14 h-14 rounded-2xl bg-ink-50 dark:bg-ink-950 flex items-center justify-center text-blue-600 dark:text-[#00f0ff] border border-ink-100 dark:border-white/5 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(0,120,255,0.2)] dark:group-hover:shadow-[0_0_15px_rgba(0,240,255,0.2)] transition-all duration-300">
                       {item.icon}
                     </div>
                     <div>
                       <p className="text-xs font-bold uppercase text-ink-500 tracking-wider mb-1">{item.label}</p>
                       <p className="text-base font-semibold text-ink-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-[#00f0ff] transition-colors">{item.value}</p>
                     </div>
                   </a>
                ))}
              </div>
            </div>

            {cv?.url && (
              <a href={cv.url} target="_blank" className="relative flex items-center justify-between p-8 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-[#00f0ff] dark:to-purple-600 text-white dark:text-ink-950 rounded-3xl hover:shadow-[0_15px_30px_rgba(0,120,255,0.3)] dark:hover:shadow-[0_0_30px_rgba(0,240,255,0.3)] hover:-translate-y-1 transition-all duration-300 shadow-md group overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%,transparent_100%)] dark:bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.5)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%,100%_100%] opacity-0 group-hover:opacity-100 animate-[shimmer_1.5s_infinite]" />
                <div className="relative z-10">
                  <h3 className="font-extrabold text-2xl mb-1">Download Resume</h3>
                  <p className="text-blue-100 dark:text-ink-900/80 text-sm font-semibold tracking-wide">PDF Version • Continuously Updated</p>
                </div>
                <div className="relative z-10 w-12 h-12 rounded-full bg-white/20 dark:bg-black/10 flex items-center justify-center group-hover:scale-110 transition-transform backdrop-blur-sm">
                  <Download size={24} />
                </div>
              </a>
            )}
          </div>

          {/* Form */}
          <div className="bg-white/80 dark:bg-ink-900/50 backdrop-blur-xl p-8 rounded-3xl border border-ink-200 dark:border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.03)] dark:shadow-none hover:shadow-[0_8px_30px_rgba(0,120,255,0.08)] dark:hover:border-[#00f0ff]/30 transition-all duration-300">
            <h3 className="text-2xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-ink-950 to-ink-700 dark:from-white dark:to-ink-300">Business Inquiry</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
              <div className="grid grid-cols-2 gap-5">
                <Input label="Name / Organization" placeholder="John Doe" {...register('name', { required: true })} />
                <Input label="Email" type="email" placeholder="john@company.com" {...register('email', { required: true })} />
              </div>
              <Input label="Subject" placeholder="Strategy Consulting / Tech Role" {...register('subject')} />
              <Textarea label="Message" placeholder="How can we collaborate..." {...register('message', { required: true })} />
              <Button type="submit" size="lg" loading={isSubmitting} className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 dark:from-[#00f0ff] dark:to-[#00d0e0] dark:text-ink-950 dark:hover:from-[#00e0f0] dark:hover:to-[#00c0d0] shadow-md hover:shadow-lg transition-all border-none">
                Submit Inquiry
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function PortfolioPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [certs, setCerts] = useState<Certificate[]>([])
  const [images, setImages] = useState<GalleryImage[]>([])
  const [cv, setCV] = useState<CVFile | null>(null)
  const [scrollY, setScrollY] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const unsubs = [
      settingsService.subscribe(setSettings),
      projectsService.subscribe(setProjects, true),
      skillsService.subscribe(setSkills),
      certificatesService.subscribe(setCerts, true),
      galleryService.subscribe(setImages)
    ]
    cvService.getActive().then(setCV)
    const scrollFn = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', scrollFn)
    return () => { unsubs.forEach(u => u()); window.removeEventListener('scroll', scrollFn) }
  }, [])

  const progress = mounted && typeof document !== 'undefined'
    ? (scrollY / Math.max(1, document.body.scrollHeight - window.innerHeight)) * 100 : 0

  return (
    <div className="bg-white dark:bg-ink-950 text-ink-900 dark:text-ink-50 min-h-screen font-sans selection:bg-blue-200 selection:text-ink-900 dark:selection:bg-[#00f0ff]/30 dark:selection:text-white transition-colors duration-300">
      <Cursor />
      {/* Scroll progress */}
      <div className="fixed top-0 left-0 z-[60] h-1 bg-blue-600 dark:bg-[#00f0ff] transition-none"
        style={{ width: `${progress}%` }} />
      <Nav settings={settings} />
      <Hero settings={settings} />
      <AboutSection settings={settings} />
      <SkillsSection skills={skills} />
      <ProjectsSection projects={projects} />
      <ExperienceSection />
      <CertificatesSection certs={certs} />
      <GallerySection images={images} />
      <AwardsSection />
      <ContactSection settings={settings} cv={cv} />
      <footer className="border-t border-ink-200 dark:border-white/10 px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4 bg-ink-50 dark:bg-ink-950">
        <span className="font-semibold text-sm text-ink-600 dark:text-ink-400">© 2026 Vishnuraj Vishwakarma. All rights reserved.</span>
        <span className="font-medium text-sm text-ink-500">Built with Next.js & Tailwind</span>
      </footer>
    </div>
  )
}

