'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button, Input } from '@/components/ui'
import toast from 'react-hot-toast'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) throw error
      
      toast.success('Logged in successfully')
      router.push('/admin/dashboard')
    } catch (error: any) {
      toast.error(error.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-ink-950 p-6">
      <div className="w-full max-w-md bg-ink-900 border border-white/10 rounded-2xl p-8 shadow-xl">
        <div className="text-center mb-8">
          <h1 className="font-display text-5xl font-bold text-[#00f0ff] tracking-tighter mb-2">VV.</h1>
          <p className="font-mono text-xs text-ink-400 uppercase tracking-wide">Admin Portal</p>
        </div>
        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <Input 
            label="Email Address" 
            type="email" 
            value={email} 
            onChange={(e: any) => setEmail(e.target.value)} 
            required 
            className="bg-black/20"
          />
          <Input 
            label="Password" 
            type="password" 
            value={password} 
            onChange={(e: any) => setPassword(e.target.value)} 
            required 
            className="bg-black/20"
          />
          <Button type="submit" size="lg" loading={loading} className="w-full mt-4 bg-[#00f0ff] text-ink-950 hover:bg-[#00d0e0]">
            Authenticate
          </Button>
        </form>
        
        <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#7fff6e] animate-pulse shadow-[0_0_10px_rgba(127,255,110,0.5)]" />
          <p className="font-mono text-[10px] text-[#7fff6e] uppercase tracking-widest">
            Database Connected: Supabase
          </p>
        </div>
      </div>
    </div>
  )
}
