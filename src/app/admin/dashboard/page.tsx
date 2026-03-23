'use client'
import { useEffect, useState } from 'react'
import { projectsService, certificatesService, skillsService, messagesService, galleryService } from '@/lib/services'
import type { DashboardStats } from '@/types'

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)

  useEffect(() => {
    let unmounted = false
    const loadStats = async () => {
      try {
        const [projects, certs, skills, images] = await Promise.all([
          projectsService.getAll(),
          certificatesService.getAll(),
          skillsService.getAll(),
          galleryService.getAll()
        ])
        
        if (!unmounted) {
          setStats(prev => ({
            ...prev,
            totalProjects: projects.length,
            publishedProjects: projects.length,
            totalCertificates: certs.length,
            totalSkills: skills.length,
            totalImages: images.length,
            unreadMessages: prev?.unreadMessages || 0
          }))
        }
      } catch (e) {
        console.error("Failed to load dashboard stats", e)
      }
    }
    
    loadStats()
    const unsub = messagesService.subscribeUnread((count) => {
      setStats(prev => ({
        ...prev,
        totalProjects: prev?.totalProjects || 0,
        publishedProjects: prev?.publishedProjects || 0,
        totalCertificates: prev?.totalCertificates || 0,
        totalSkills: prev?.totalSkills || 0,
        totalImages: prev?.totalImages || 0,
        unreadMessages: count
      }))
    })
    
    return () => {
      unmounted = true
      unsub()
    }
  }, [])

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-white mb-6 font-mono tracking-widest">SYSTEM OVERVIEW</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Projects', value: stats?.totalProjects || 0 },
          { label: 'Certificates', value: stats?.totalCertificates || 0 },
          { label: 'Skills', value: stats?.totalSkills || 0 },
          { label: 'Unread Msgs', value: stats?.unreadMessages || 0 },
        ].map(s => (
          <div key={s.label} className="bg-ink-900 border border-white/10 rounded-xl p-5">
            <p className="text-[10px] font-mono text-ink-400 uppercase tracking-widest mb-1">{s.label}</p>
            <p className="text-3xl font-bold text-white">{s.value}</p>
          </div>
        ))}
      </div>
      <div className="bg-ink-900 border border-white/10 rounded-xl p-6">
        <h2 className="text-lg font-bold text-white mb-4">Welcome to Admin Panel</h2>
        <p className="text-ink-300 text-sm leading-relaxed">
          From the left sidebar navigation, you can manage your Projects, Certificates, Gallery Images, Upload your CV, configure Skills, and monitor incoming Contact Messages.
        </p>
      </div>
    </div>
  )
}
