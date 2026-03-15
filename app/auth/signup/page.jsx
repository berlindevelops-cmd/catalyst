'use client'

import { useState } from 'react'
import { supabase } from '../../../lib/supabase'
import { useRouter } from 'next/navigation'
import { AlertCircle, ArrowRight, Loader, User, Briefcase } from 'lucide-react'

export default function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState('teen')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const router = useRouter()

  const handleSignUp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { data, error: err } = await supabase.auth.signUp({ email, password })
    if (err) {
      setError(err.message)
    } else if (!data.user) {
      setError('Please check your email to confirm your account.')
    } else {
      const { error: insertError } = await supabase
        .from('users')
        .insert({ id: data.user.id, email, name, role })
      if (insertError) setError(insertError.message)
      else router.push('/jobs')
    }
    setLoading(false)
  }

  return (
    <p>Hello</p>
  )
}