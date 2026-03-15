'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function Profile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [portfolio, setPortfolio] = useState([])
  const [reviews, setReviews] = useState([])
  const router = useRouter()

  useEffect(() => { fetchProfile() }, [])

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth/login'); return }
    const { data: profileData } = await supabase.from('users').select('*').eq('id', user.id).single()
    const { data: portfolioData } = await supabase.from('portfolio_items').select('*').eq('user_id', user.id)
    const { data: reviewData } = await supabase.from('reviews').select('*, reviewer:users!reviewer_id(id, name)').eq('reviewee_id', user.id)
    setProfile(profileData)
    setPortfolio(portfolioData || [])
    setReviews(reviewData || [])
    setLoading(false)
  }

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null

  return (
    <p>Hello</p>
  )
}