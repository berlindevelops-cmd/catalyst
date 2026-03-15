'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function Jobs() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [error, setError] = useState(null)

  useEffect(() => { fetchJobs() }, [])

  const fetchJobs = async () => {
    const { data, error } = await supabase.from('jobs').select('*')
    if (error) setError(error.message)
    else setJobs(data)
    setLoading(false)
  }

  const filteredJobs = jobs.filter(job =>
    job.title?.toLowerCase().includes(search.toLowerCase()) ||
    job.location?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <p>Hello</p>
  )
}