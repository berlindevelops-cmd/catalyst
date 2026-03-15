'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '../../../lib/supabase'
import { useRouter } from 'next/navigation'
import Navbar from '../../../components/NavBar'
import { MapPin, MessageCircle, Star, AlertCircle, User, Briefcase, ArrowLeft } from 'lucide-react'

export default function PublicProfile() {
  const { userId } = useParams()
  const [profile, setProfile] = useState(null)
  const [reviews, setReviews] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const router = useRouter()

  useEffect(() => { fetchProfile() }, [])

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setCurrentUser(user)
    const { data, error } = await supabase.from('users').select('*').eq('id', userId).single()
    if (error) { setError(error.message); setLoading(false); return }
    const { data: reviewData } = await supabase
      .from('reviews').select('*, reviewer:users!reviewer_id(id, name)').eq('reviewee_id', userId)
    setProfile(data)
    setReviews(reviewData || [])
    setLoading(false)
  }

  const submitReview = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth/login'); return }
    const { error: err } = await supabase.from('reviews').insert({ reviewer_id: user.id, reviewee_id: userId, rating, comment })
    if (!err) {
      const { data: reviewData } = await supabase.from('reviews').select('*, reviewer:users!reviewer_id(id, name)').eq('reviewee_id', userId)
      setReviews(reviewData || [])
      setComment('')
      setRating(5)
    }
    setSubmitting(false)
  }

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null

  const initials = profile?.name?.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase() || '?'

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@400;700;900&family=Nunito:wght@400;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --orange: #FF5C1A; --yellow: #FFE033; --black: #111111;
          --white: #FEFCF7; --cream: #FFF6E8;
          --shadow: 4px 4px 0px #111111; --shadow-lg: 6px 6px 0px #111111;
        }
        body { background: var(--white); font-family: 'Nunito', sans-serif; color: var(--black); }
        .page { min-height: 100vh; background: var(--white); }

        .body {
          max-width: 1040px; margin: 0 auto;
          padding: 56px 40px 100px;
          display: grid; grid-template-columns: 268px 1fr;
          gap: 32px; align-items: start;
        }

        .left-card {
          background: var(--cream); border: 3px solid var(--black);
          border-radius: 20px; padding: 36px 28px;
          display: flex; flex-direction: column; align-items: center;
          text-align: center; position: sticky; top: 84px;
          box-shadow: var(--shadow-lg);
        }

        .avatar {
          width: 88px; height: 88px; border-radius: 50%;
          background: var(--orange); border: 3px solid var(--black);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Unbounded', sans-serif; font-size: 28px; font-weight: 900;
          color: var(--white); margin-bottom: 18px; box-shadow: var(--shadow);
        }

        .profile-name {
          font-family: 'Unbounded', sans-serif; font-size: 18px; font-weight: 900;
          letter-spacing: -.02em; margin-bottom: 6px;
        }

        .profile-email { font-size: 12px; color: #888; margin-bottom: 16px; word-break: break-all; font-weight: 600; }

        .role-badge {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 6px 14px; border-radius: 100px;
          font-family: 'Unbounded', sans-serif; font-size: 10px; font-weight: 700;
          letter-spacing: .08em; text-transform: uppercase;
          margin-bottom: 20px; border: 2px solid var(--black);
          box-shadow: 2px 2px 0 var(--black);
        }
        .role-badge.teen { background: var(--yellow); color: var(--black); }
        .role-badge.employer { background: var(--orange); color: var(--white); }

        .rating-box {
          width: 100%; background: var(--black); border-radius: 14px;
          padding: 18px; margin-bottom: 16px; text-align: center;
        }
        .rating-num { font-family: 'Unbounded', sans-serif; font-size: 36px; font-weight: 900; color: var(--yellow); line-height: 1; }
        .rating-stars { color: var(--yellow); font-size: 14px; letter-spacing: 2px; margin: 6px 0 4px; }
        .rating-count { font-size: 11px; color: rgba(255,255,255,0.4); font-weight: 700; letter-spacing: .06em; text-transform: uppercase; }

        .card-divider { width: 100%; height: 2px; background: rgba(0,0,0,0.08); margin: 16px 0; }
        .card-meta { width: 100%; display: flex; align-items: center; gap: 8px; font-size: 13px; color: #777; font-weight: 700; }

        .msg-btn {
          width: 100%; margin-top: 12px; padding: 13px;
          background: var(--black); color: var(--white);
          border: 2.5px solid var(--black); border-radius: 12px;
          font-family: 'Nunito', sans-serif; font-size: 14px; font-weight: 800;
          cursor: pointer; text-decoration: none; display: flex;
          align-items: center; justify-content: center; gap: 8px;
          box-shadow: var(--shadow); transition: transform .12s, box-shadow .12s, background .12s;
        }
        .msg-btn:hover { transform: translate(-2px,-2px); box-shadow: var(--shadow-lg); background: var(--orange); }

        .right { display: flex; flex-direction: column; gap: 16px; }

        .banner {
          background: var(--orange); border: 3px solid var(--black);
          border-radius: 20px; padding: 40px 40px;
          position: relative; overflow: hidden;
          box-shadow: var(--shadow-lg);
        }
        .banner-bg {
          position: absolute; right: -20px; top: 50%; transform: translateY(-50%);
          font-family: 'Unbounded', sans-serif; font-size: 130px; font-weight: 900;
          color: rgba(0,0,0,0.07); white-space: nowrap; pointer-events: none;
          letter-spacing: -.05em; user-select: none;
        }
        .banner-eyebrow {
          font-family: 'Unbounded', sans-serif; font-size: 10px; font-weight: 700;
          letter-spacing: .16em; text-transform: uppercase;
          color: rgba(255,255,255,0.6); margin-bottom: 10px;
        }
        .banner-title {
          font-family: 'Unbounded', sans-serif;
          font-size: clamp(28px, 4vw, 44px); font-weight: 900;
          letter-spacing: -.04em; line-height: 1; color: var(--white);
          position: relative; z-index: 1;
        }
        .banner-title .box { background: var(--yellow); color: var(--black); padding: 0 8px; border-radius: 4px; border: 2px solid var(--black); }

        .section-card {
          background: var(--cream); border: 3px solid var(--black);
          border-radius: 20px; padding: 28px 32px; box-shadow: var(--shadow);
        }
        .section-head {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 20px; padding-bottom: 16px;
          border-bottom: 2px solid rgba(0,0,0,0.08);
        }
        .section-label {
          font-family: 'Unbounded', sans-serif; font-size: 10px; font-weight: 700;
          letter-spacing: .16em; text-transform: uppercase; color: #aaa;
        }
        .section-count {
          font-family: 'Unbounded', sans-serif; font-size: 11px; font-weight: 700;
          color: var(--orange); background: rgba(255,92,26,0.1);
          border: 2px solid var(--orange); padding: 3px 10px; border-radius: 100px;
        }

        .bio-text { font-size: 15px; font-weight: 600; color: #555; line-height: 1.8; }
        .bio-empty { font-size: 14px; color: #bbb; font-weight: 700; font-style: italic; }

        .reviews-list { display: flex; flex-direction: column; gap: 12px; }

        .review-card {
          background: var(--white); border: 2.5px solid var(--black);
          border-radius: 14px; padding: 20px;
          box-shadow: 3px 3px 0 var(--black);
          transition: transform .12s, box-shadow .12s;
        }
        .review-card:hover { transform: translate(-2px,-2px); box-shadow: var(--shadow); }

        .review-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; gap: 12px; }
        .review-author { display: flex; align-items: center; gap: 10px; }
        .review-avatar {
          width: 34px; height: 34px; border-radius: 50%;
          background: var(--yellow); border: 2px solid var(--black);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Unbounded', sans-serif; font-size: 11px; font-weight: 900; color: var(--black);
        }
        .review-name { font-size: 14px; font-weight: 800; }
        .review-date { font-size: 11px; color: #aaa; font-weight: 600; }
        .review-stars { color: var(--orange); font-size: 14px; letter-spacing: 1px; flex-shrink: 0; }
        .review-comment { font-size: 14px; font-weight: 600; color: #666; line-height: 1.65; }

        .reviews-empty { text-align: center; padding: 28px 0 8px; }
        .reviews-empty-icon { font-size: 32px; margin-bottom: 10px; color: var(--yellow); }
        .reviews-empty-text { font-size: 14px; color: #bbb; font-weight: 700; }

        /* Review form */
        .form-sub-label {
          font-family: 'Unbounded', sans-serif; font-size: 10px; font-weight: 700;
          letter-spacing: .12em; text-transform: uppercase; color: #aaa; margin-bottom: 12px;
        }
        .star-picker { display: flex; gap: 6px; margin-bottom: 20px; }
        .star-btn {
          font-size: 28px; background: none; border: none; cursor: pointer;
          line-height: 1; color: #ddd; padding: 0;
          transition: transform .1s, color .1s;
        }
        .star-btn.active { color: var(--orange); }
        .star-btn:hover { transform: scale(1.2); color: var(--orange); }

        .field { margin-bottom: 16px; display: flex; flex-direction: column; gap: 7px; }
        .field label {
          font-family: 'Unbounded', sans-serif; font-size: 10px; font-weight: 700;
          letter-spacing: .12em; text-transform: uppercase; color: #888;
        }
        .field textarea {
          background: var(--white); border: 2.5px solid var(--black);
          border-radius: 10px; padding: 14px 16px; color: var(--black);
          font-family: 'Nunito', sans-serif; font-size: 15px; font-weight: 600;
          outline: none; resize: none; box-shadow: 3px 3px 0 var(--black);
          transition: box-shadow .12s, transform .12s;
        }
        .field textarea::placeholder { color: #bbb; font-weight: 600; }
        .field textarea:focus { box-shadow: 5px 5px 0 var(--black); transform: translate(-1px,-1px); }

        .error-box {
          background: #fff0ee; border: 2px solid #ff5c5c; border-radius: 10px;
          padding: 12px 16px; font-size: 13px; font-weight: 700; color: #cc2200;
          margin-bottom: 16px; display: flex; align-items: center; gap: 8px;
          box-shadow: 3px 3px 0 #ff5c5c;
        }

        .submit-btn {
          width: 100%; padding: 15px; background: var(--orange); color: var(--white);
          border: 2.5px solid var(--black); border-radius: 12px;
          font-family: 'Nunito', sans-serif; font-size: 15px; font-weight: 800;
          cursor: pointer; box-shadow: var(--shadow);
          transition: transform .12s, box-shadow .12s;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .submit-btn:hover:not(:disabled) { transform: translate(-2px,-2px); box-shadow: var(--shadow-lg); }
        .submit-btn:disabled { opacity: .5; cursor: not-allowed; }

        .spinning { animation: spin .6s linear infinite; }

        /* states */
        .spinner-wrap { display: flex; align-items: center; justify-content: center; min-height: 60vh; }
        .page-spinner { width: 36px; height: 36px; border: 3px solid rgba(0,0,0,0.08); border-top-color: var(--orange); border-radius: 50%; animation: spin .7s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .error-state { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; gap: 14px; text-align: center; padding: 40px; }
        .error-state-title { font-family: 'Unbounded', sans-serif; font-size: 24px; font-weight: 900; color: #ccc; letter-spacing: -.02em; }
        .error-state-sub { font-size: 14px; color: #bbb; font-weight: 700; }
        .error-state-sub a { color: var(--orange); text-decoration: none; }

        .back-link {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 13px; font-weight: 800; color: var(--black);
          text-decoration: none; margin: 24px 40px 0;
          border-bottom: 2px solid var(--black); padding-bottom: 2px;
          transition: color .15s, border-color .15s;
        }
        .back-link:hover { color: var(--orange); border-color: var(--orange); }

        @media (max-width: 800px) {
          .body { grid-template-columns: 1fr; padding: 32px 20px 80px; }
          .left-card { position: static; }
        }
      `}</style>

      <div className="page">
        <Navbar />
        <a href="/jobs" className="back-link"><ArrowLeft size={14} strokeWidth={2.5} /> Back to Jobs</a>

        {loading ? (
          <div className="spinner-wrap"><div className="page-spinner" /></div>
        ) : error ? (
          <div className="error-state">
            <AlertCircle size={48} color="#ddd" strokeWidth={1.5} />
            <p className="error-state-title">Something went wrong</p>
            <p className="error-state-sub">{error}</p>
            <p className="error-state-sub"><a href="/jobs">← Back to jobs</a></p>
          </div>
        ) : !profile ? (
          <div className="error-state">
            <User size={48} color="#ddd" strokeWidth={1.5} />
            <p className="error-state-title">Profile Not Found</p>
            <p className="error-state-sub"><a href="/jobs">← Browse jobs</a></p>
          </div>
        ) : (
          <div className="body">
            {/* LEFT */}
            <div className="left-card">
              <div className="avatar">{initials}</div>
              <p className="profile-name">{profile.name}</p>
              <p className="profile-email">{profile.email}</p>
              <span className={`role-badge ${profile.role}`}>
                {profile.role === 'teen' ? <><User size={12} strokeWidth={3} /> Teen</> : <><Briefcase size={12} strokeWidth={3} /> Employer</>}
              </span>
              {avgRating && (
                <div className="rating-box">
                  <div className="rating-num">{avgRating}</div>
                  <div className="rating-stars">
                    {Array.from({length:5},(_,i)=><span key={i} style={{opacity: i < Math.round(Number(avgRating)) ? 1 : 0.2}}>★</span>)}
                  </div>
                  <div className="rating-count">{reviews.length} {reviews.length===1?'review':'reviews'}</div>
                </div>
              )}
              {profile.location && (
                <>
                  <div className="card-divider" />
                  <div className="card-meta"><MapPin size={14} strokeWidth={2.5} />{profile.location}</div>
                </>
              )}
              {currentUser && currentUser.id !== userId && (
                <a href={`/messages/new?to=${userId}`} className="msg-btn">
                  <MessageCircle size={16} strokeWidth={2.5} /> Send Message
                </a>
              )}
            </div>

            {/* RIGHT */}
            <div className="right">
              <div className="banner">
                <div className="banner-bg">{profile.name?.split(' ')[0]?.toUpperCase()}</div>
                <p className="banner-eyebrow">Public Profile</p>
                <h1 className="banner-title">
                  <span className="box">{profile.name?.split(' ')[0]}</span>'s Profile
                </h1>
              </div>

              <div className="section-card">
                <div className="section-head"><span className="section-label">About</span></div>
                {profile.bio ? <p className="bio-text">{profile.bio}</p> : <p className="bio-empty">This user hasn't added a bio yet.</p>}
              </div>

              <div className="section-card">
                <div className="section-head">
                  <span className="section-label">Reviews</span>
                  {reviews.length > 0 && <span className="section-count">{reviews.length}</span>}
                </div>
                {reviews.length === 0 ? (
                  <div className="reviews-empty">
                    <div className="reviews-empty-icon"><Star size={32} strokeWidth={1.5} color="var(--yellow)" /></div>
                    <p className="reviews-empty-text">No reviews yet — be the first!</p>
                  </div>
                ) : (
                  <div className="reviews-list">
                    {reviews.map((review, i) => {
                      const ri = review.reviewer?.name?.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase() || '?'
                      const date = review.created_at ? new Date(review.created_at).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}) : ''
                      return (
                        <div key={review.id || i} className="review-card">
                          <div className="review-top">
                            <div className="review-author">
                              <div className="review-avatar">{ri}</div>
                              <div>
                                <p className="review-name">{review.reviewer?.name || 'Anonymous'}</p>
                                <p className="review-date">{date}</p>
                              </div>
                            </div>
                            <div className="review-stars">
                              {Array.from({length:5},(_,i)=><span key={i} style={{opacity: i < review.rating ? 1 : 0.18}}>★</span>)}
                            </div>
                          </div>
                          {review.comment && <p className="review-comment">{review.comment}</p>}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {currentUser && currentUser.id !== userId && (
                <div className="section-card">
                  <div className="section-head"><span className="section-label">Leave a Review</span></div>
                  <p className="form-sub-label">Your rating</p>
                  <div className="star-picker">
                    {[1,2,3,4,5].map(n => (
                      <button key={n} type="button" className={`star-btn ${n <= rating ? 'active' : ''}`} onClick={() => setRating(n)}>★</button>
                    ))}
                  </div>
                  <form onSubmit={submitReview}>
                    <div className="field">
                      <label>Comment</label>
                      <textarea
                        rows={4}
                        placeholder={`Tell others what it was like working with ${profile.name?.split(' ')[0]}...`}
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                        required
                      />
                    </div>
                    {error && <div className="error-box"><AlertCircle size={16} strokeWidth={2.5} />{error}</div>}
                    <button type="submit" className="submit-btn" disabled={submitting}>
                      {submitting ? 'Submitting…' : <>Submit Review <Star size={15} strokeWidth={2.5} /></>}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}