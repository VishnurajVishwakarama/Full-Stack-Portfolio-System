'use client'
import { useState, useEffect } from 'react'
import { cvService } from '@/lib/services'
import type { CVFile } from '@/types'
import { Button } from '@/components/ui'
import toast from 'react-hot-toast'
import { UploadCloud, FileText, CheckCircle2 } from 'lucide-react'

export default function CVAdmin() {
  const [currentCV, setCurrentCV] = useState<CVFile | null>(null)
  const [file, setFile] = useState<File | undefined>(undefined)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    cvService.getActive().then(setCurrentCV)
  }, [loading])

  const handleUpload = async () => {
    if (!file) return toast.error('Please select a PDF file')
    setLoading(true)
    try {
      await cvService.upload(file, "Latest Version")
      toast.success('CV Successfully Updated!')
      setFile(undefined)
      // File input reset is tricky w/o a ref, but state is cleared.
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / 1048576).toFixed(1) + ' MB'
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-white font-mono tracking-widest mb-6">CV MANAGEMENT</h1>
      
      <div className="bg-ink-900 border border-white/10 rounded-xl overflow-hidden mb-8">
        <div className="p-6 border-b border-white/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#00f0ff]/10 text-[#00f0ff] flex items-center justify-center">
            <FileText size={24} />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-white">Current Active CV</h2>
            {currentCV ? (
              <p className="text-ink-400 font-mono text-xs mt-1">
                Version: {currentCV.version}
              </p>
            ) : (
              <p className="text-[#ff4d6d] font-mono text-xs mt-1">No CV currently uploaded</p>
            )}
          </div>
          {currentCV && (
            <div className="flex items-center gap-2 text-[#7fff6e] bg-[#7fff6e]/10 px-3 py-1.5 rounded-full text-xs font-bold font-mono">
              <CheckCircle2 size={14} /> Live
            </div>
          )}
        </div>
        
        {currentCV && (
          <div className="bg-ink-950 p-4">
            <a href={currentCV.url} target="_blank" className="text-[#00f0ff] text-sm hover:underline flex items-center gap-2">
               View Current Live PDF Document
            </a>
          </div>
        )}
      </div>

      <div className="bg-ink-900 border border-white/10 rounded-xl p-8 mb-8 text-center flex flex-col items-center justify-center border-dashed">
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-ink-400 mb-4">
          <UploadCloud size={32} />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">Upload New CV Replacement</h3>
        <p className="text-sm text-ink-400 mb-6 max-w-sm">
          Uploading a new PDF will automatically deactivate the old one and instantly update the download link on your public portfolio page.
        </p>
        
        <input 
          type="file" 
          accept="application/pdf" 
          onChange={(e: any) => setFile(e.target.files?.[0])} 
          className="text-sm text-ink-400 file:mr-4 file:py-2.5 file:px-5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#00f0ff] file:text-ink-950 hover:file:bg-[#00d0e0] file:cursor-pointer mb-4" 
        />
        
        <Button 
          onClick={handleUpload} 
          loading={loading} 
          disabled={!file} 
          size="lg"
          className="bg-white text-ink-950 w-full max-w-xs mt-2 disabled:opacity-50"
        >
          Push to Live Portfolio
        </Button>
      </div>
    </div>
  )
}
