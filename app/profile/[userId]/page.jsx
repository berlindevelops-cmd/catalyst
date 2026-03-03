'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

export default function PublicProfile() {
  const { userId } = useParams()
  const [profile, setProfile] = useState(null)
  const [reviews, setReviews] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    // 1. get current user (no redirect needed, public page)
    // 2. fetch profile from users table where id = userId
    // 3. fetch all reviews where reviewee_id = userId
    //    join reviewer name: select('*, reviewer:users!reviewer_id(id, name)')
    // 4. setProfile, setReviews, setLoading(false)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        router.push('/auth/login')
        return
    }
    setCurrentUser(user)
    const { data, error } = await supabase.from('users').select('*').eq('id', user.id).single();

    
  }

  const submitReview = async (e) => {
    e.preventDefault()
    // 1. if no currentUser redirect to /auth/login
    // 2. insert into reviews: reviewer_id, reviewee_id (userId), rating, comment
    // 3. refetch reviews on success
    // 4. clear comment, reset rating to 5
  }

  return (
    // vibe code — show profile info
    // list of reviews with star ratings
    // review form at the bottom if currentUser exists
  )
}