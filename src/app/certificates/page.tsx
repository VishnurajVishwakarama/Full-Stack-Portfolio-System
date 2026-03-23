'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Shield, ArrowLeft, Award } from 'lucide-react'
import { certificatesService } from '@/lib/services'
import type { Certificate } from '@/types'
import { Modal, Button } from '@/components/ui'
import { motion } from 'framer-motion'
import Cursor from '@/components/ui/Cursor'

export default function CertificatesPage() {
  const [certs, setCerts] = useState<Certificate[]>([])
  const [selected, setSelected] = useState<Certificate | null>(null)
  const router = useRouter()

  useEffect(() => {
    certificatesService.getAll(true).then(setCerts)
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
            <p className="font-mono text-xs font-bold uppercase text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-[#00f0ff] dark:to-purple-500 tracking-[0.2em]">Achievements</p>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-ink-950 to-ink-700 dark:from-white dark:to-ink-300 tracking-tight pb-2">Verified Credentials</h1>
          <p className="text-ink-600 dark:text-ink-400 text-lg mt-4 max-w-2xl font-medium">Every certificate links to a live verification source.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {certs.map((c, i) => (
            <motion.div
              key={c.id}
              onClick={() => setSelected(c)}
              className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-ink-200 dark:border-white/10 rounded-3xl overflow-hidden group cursor-pointer hover:border-blue-400 dark:hover:border-[#00f0ff]/50 hover:shadow-[0_10px_30px_-10px_rgba(0,120,255,0.2)] dark:hover:shadow-[0_0_30px_-10px_rgba(0,240,255,0.2)] hover:-translate-y-2 transition-all duration-300 flex flex-col"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            >
              <div className="h-44 bg-ink-100 dark:bg-ink-950 flex items-center justify-center relative overflow-hidden p-4">
                <div className="absolute inset-0 bg-blue-500/5 dark:bg-[#00f0ff]/5 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none" />
                {c.imageUrl ? (
                  <Image src={c.imageUrl} alt={c.title} fill className="object-contain p-2 opacity-90 transition-transform duration-700 group-hover:scale-105" />
                ) : (
                  <Award className="text-blue-200 dark:text-blue-900/50 transition-transform duration-500 group-hover:scale-110" size={64} />
                )}
              </div>
              <div className="p-8 flex-1 flex flex-col relative z-20 bg-white/50 dark:bg-transparent">
                <p className="font-extrabold text-xl text-transparent bg-clip-text bg-gradient-to-br from-ink-950 to-ink-700 dark:from-white dark:to-ink-300 mb-2 line-clamp-2 group-hover:from-blue-700 group-hover:to-indigo-700 dark:group-hover:from-[#00f0ff] dark:group-hover:to-purple-400 transition-all">{c.title}</p>
                <p className="font-bold text-sm text-blue-600 dark:text-[#00f0ff] mb-6 flex-1">{c.issuer}</p>
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
          {certs.length === 0 && (
            <p className="text-ink-500 col-span-full">No certificates published yet.</p>
          )}
        </div>
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.title}>
        {selected && (
          <div>
            <p className="font-mono text-sm text-blue-600 dark:text-[#00f0ff] mb-2">{selected.issuer}</p>
            <p className="font-mono text-xs text-ink-500 mb-5">{selected.date}</p>
            {selected.description && <p className="text-sm text-ink-700 dark:text-ink-300 leading-relaxed mb-6">{selected.description}</p>}
            <div className="flex gap-3 mt-4">
              <Button onClick={() => window.open(selected.verifyUrl, '_blank')} className="bg-green-600 text-white hover:bg-green-700 dark:bg-[#7fff6e] dark:text-ink-950 dark:hover:bg-[#6ee55d] w-full">
                <Shield size={16} className="mr-2" /> Verify Live
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
