'use client'

import { useState } from 'react'
import { supabase } from '../../../lib/supabase'
import { useRouter } from 'next/navigation'
import { MapPin, AlertCircle, ArrowRight, Loader } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { data, error: err } = await supabase.auth.signInWithPassword({ email, password })
    if (err) setError(err.message)
    else router.push('/jobs')
    setLoading(false)
  }

  return (
    <p>Hello</p>
  )
}