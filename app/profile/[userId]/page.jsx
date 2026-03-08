'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '../../../lib/supabase'
import { useRouter } from 'next/navigation'
import Navbar from '../../../components/NavBar'

export default function PublicProfile() {
  const { userId } = useParams()
  const [profile, setProfile] = useState(null)
  const [reviews, setReviews] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [error, setError] = useState(null)

  const router = useRouter()

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUser(user);
    const { data, error } = await supabase.from('users').select('*').eq('id', userId).single();
    if (error) {
      setError(error.message);
    } else {
      supabase.from('reviews')
        .select('*, reviewer:users!reviewer_id(id, name)')
        .eq('reviewee_id', userId)
      setProfile(data)
      setReviews(reviewData)
    }

    setLoading(false)
    
  }

  const submitReview = async (e) => {
    e.preventDefault()

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      router.push('/auth/login')
      return
    }

    const { error } = await supabase.from('reviews').insert({ reviewer_id: currentUser.id, reviewee_id: userId, rating, comment })

    const { data: reviewData } = await supabase
      .from('reviews')
      .select('*, reviewer:users!reviewer_id(id, name)')
      .eq('reviewee_id', userId)
    setProfile(data)
    setReviews(reviewData)

    setComment('')
    setRating(5)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=Syne:wght@700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --yellow: #FFE033;
          --orange: #FF5C1A;
          --black: #0D0D0D;
          --gray: #141414;
          --gray2: #1A1A1A;
          --border: rgba(255,255,255,0.08);
          --muted: rgba(245,242,235,0.4);
        }

        body { background: var(--black); }

        .root {
          min-height: 100vh;
          background: var(--black);
          font-family: 'Instrument Sans', sans-serif;
          color: #F5F2EB;
        }

        /* ── BODY ── */
        .body {
          max-width: 1040px;
          margin: 0 auto;
          padding: 64px 40px 100px;
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 24px;
          align-items: start;
        }

        /* ── LEFT CARD ── */
        .left-card {
          background: var(--gray);
          border: 1px solid var(--border);
          border-radius: 24px;
          padding: 36px 28px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          position: sticky;
          top: 84px;
        }

        .avatar {
          width: 88px;
          height: 88px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--yellow), var(--orange));
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Syne', sans-serif;
          font-size: 30px;
          font-weight: 800;
          color: var(--black);
          margin-bottom: 18px;
          flex-shrink: 0;
        }

        .profile-name {
          font-family: 'Syne', sans-serif;
          font-size: 20px;
          font-weight: 800;
          letter-spacing: -.02em;
          margin-bottom: 6px;
        }

        .profile-email {
          font-size: 12px;
          color: rgba(245,242,235,0.3);
          margin-bottom: 16px;
          word-break: break-all;
          line-height: 1.4;
        }

        .role-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 14px;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .08em;
          text-transform: uppercase;
          margin-bottom: 24px;
        }

        .role-badge.teen {
          background: rgba(255,224,51,0.1);
          border: 1px solid rgba(255,224,51,0.22);
          color: var(--yellow);
        }

        .role-badge.employer {
          background: rgba(255,92,26,0.1);
          border: 1px solid rgba(255,92,26,0.22);
          color: var(--orange);
        }

        /* rating display */
        .rating-display {
          width: 100%;
          background: var(--black);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 18px;
          margin-bottom: 16px;
        }

        .rating-num {
          font-family: 'Syne', sans-serif;
          font-size: 40px;
          font-weight: 800;
          color: var(--yellow);
          letter-spacing: -.03em;
          line-height: 1;
          margin-bottom: 6px;
        }

        .rating-stars {
          font-size: 16px;
          color: var(--yellow);
          letter-spacing: 2px;
          margin-bottom: 6px;
        }

        .rating-count {
          font-size: 12px;
          color: rgba(245,242,235,0.3);
          font-weight: 500;
        }

        .card-divider {
          width: 100%;
          height: 1px;
          background: var(--border);
          margin: 16px 0;
        }

        .card-meta {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          color: var(--muted);
          margin-bottom: 8px;
        }

        /* message btn */
        .msg-btn {
          width: 100%;
          margin-top: 8px;
          padding: 13px;
          background: var(--yellow);
          color: var(--black);
          border: none;
          border-radius: 12px;
          font-family: 'Syne', sans-serif;
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
          letter-spacing: -.01em;
          transition: opacity .15s, transform .15s;
          text-align: center;
          text-decoration: none;
          display: block;
        }

        .msg-btn:hover { opacity: .88; transform: translateY(-1px); }

        /* ── RIGHT ── */
        .right { display: flex; flex-direction: column; gap: 12px; }

        /* banner */
        .banner {
          background: var(--gray);
          border: 1px solid var(--border);
          border-radius: 24px;
          padding: 36px;
          position: relative;
          overflow: hidden;
        }

        .banner::before {
          content: attr(data-name);
          position: absolute;
          right: -10px;
          top: 50%;
          transform: translateY(-50%);
          font-family: 'Syne', sans-serif;
          font-size: 110px;
          font-weight: 800;
          color: rgba(255,255,255,0.025);
          white-space: nowrap;
          pointer-events: none;
          letter-spacing: -.04em;
          text-transform: uppercase;
        }

        .banner-eyebrow {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: .14em;
          text-transform: uppercase;
          color: var(--orange);
          margin-bottom: 10px;
        }

        .banner-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(32px, 4vw, 48px);
          font-weight: 800;
          letter-spacing: -.03em;
          line-height: 1.0;
          position: relative;
          z-index: 1;
        }

        .banner-title span { color: var(--yellow); }

        /* section card */
        .section-card {
          background: var(--gray);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 28px 32px;
        }

        .section-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--border);
        }

        .section-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .14em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.25);
        }

        .section-count {
          font-size: 12px;
          font-weight: 700;
          color: var(--yellow);
          background: rgba(255,224,51,0.1);
          border: 1px solid rgba(255,224,51,0.18);
          padding: 3px 10px;
          border-radius: 100px;
        }

        .bio-text {
          font-size: 15px;
          font-weight: 400;
          color: rgba(245,242,235,0.6);
          line-height: 1.8;
        }

        .bio-empty {
          font-size: 14px;
          color: rgba(245,242,235,0.2);
          font-style: italic;
        }

        /* ── REVIEWS ── */
        .reviews-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .review-card {
          background: var(--black);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 20px 20px;
          transition: border-color .15s;
        }

        .review-card:hover { border-color: rgba(255,255,255,0.14); }

        .review-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
          gap: 12px;
        }

        .review-author {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .review-avatar {
          width: 32px; height: 32px;
          border-radius: 50%;
          background: var(--gray2);
          border: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Syne', sans-serif;
          font-size: 12px;
          font-weight: 800;
          color: var(--muted);
          flex-shrink: 0;
        }

        .review-name {
          font-size: 14px;
          font-weight: 700;
          color: #F5F2EB;
        }

        .review-date {
          font-size: 11px;
          color: rgba(245,242,235,0.25);
          font-weight: 500;
        }

        .review-stars {
          font-size: 14px;
          color: var(--yellow);
          letter-spacing: 1px;
          flex-shrink: 0;
        }

        .review-comment {
          font-size: 14px;
          font-weight: 400;
          color: rgba(245,242,235,0.55);
          line-height: 1.65;
        }

        .reviews-empty {
          text-align: center;
          padding: 32px 0 8px;
        }

        .reviews-empty-icon { font-size: 36px; margin-bottom: 12px; }

        .reviews-empty-text {
          font-size: 14px;
          color: rgba(245,242,235,0.2);
        }

        /* ── REVIEW FORM ── */
        .form-eyebrow {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .14em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.25);
          margin-bottom: 10px;
        }

        .form-title {
          font-family: 'Syne', sans-serif;
          font-size: 20px;
          font-weight: 800;
          letter-spacing: -.02em;
          margin-bottom: 24px;
        }

        /* star picker */
        .star-picker {
          display: flex;
          gap: 6px;
          margin-bottom: 18px;
        }

        .star-btn {
          font-size: 28px;
          background: none;
          border: none;
          cursor: pointer;
          line-height: 1;
          transition: transform .1s;
          color: rgba(255,255,255,0.15);
          padding: 0;
        }

        .star-btn.active { color: var(--yellow); }
        .star-btn:hover { transform: scale(1.2); }

        .field {
          margin-bottom: 16px;
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .field label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
        }

        .field textarea {
          background: var(--black);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 10px;
          padding: 14px 16px;
          color: #F5F2EB;
          font-family: 'Instrument Sans', sans-serif;
          font-size: 14px;
          font-weight: 400;
          outline: none;
          resize: none;
          transition: border-color .18s, box-shadow .18s;
        }

        .field textarea::placeholder { color: rgba(245,242,235,0.18); }

        .field textarea:focus {
          border-color: var(--yellow);
          box-shadow: 0 0 0 3px rgba(255,224,51,0.08);
        }

        .error-box {
          background: rgba(255,80,60,0.08);
          border: 1px solid rgba(255,80,60,0.25);
          border-radius: 10px;
          padding: 12px 16px;
          font-size: 13px;
          color: #ff7060;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .submit-btn {
          width: 100%;
          padding: 15px;
          background: var(--yellow);
          color: var(--black);
          border: none;
          border-radius: 12px;
          font-family: 'Syne', sans-serif;
          font-size: 15px;
          font-weight: 800;
          letter-spacing: -.01em;
          cursor: pointer;
          transition: opacity .18s, transform .15s;
          margin-top: 4px;
        }

        .submit-btn:hover:not(:disabled) { opacity: .88; transform: translateY(-1px); }
        .submit-btn:disabled { opacity: .45; cursor: not-allowed; }

        .spinner {
          display: inline-block;
          width: 14px; height: 14px;
          border: 2px solid rgba(0,0,0,0.25);
          border-top-color: var(--black);
          border-radius: 50%;
          animation: spin .6s linear infinite;
          vertical-align: middle;
          margin-right: 8px;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── SPINNER ── */
        .spinner-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
        }

        .page-spinner {
          width: 36px; height: 36px;
          border: 3px solid rgba(255,255,255,0.07);
          border-top-color: var(--yellow);
          border-radius: 50%;
          animation: spin .7s linear infinite;
        }

        /* ── ERROR STATE ── */
        .error-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
          gap: 14px;
          text-align: center;
          padding: 40px;
        }

        .error-state-icon { font-size: 48px; }

        .error-state-title {
          font-family: 'Syne', sans-serif;
          font-size: 24px;
          font-weight: 800;
          color: rgba(245,242,235,0.25);
          letter-spacing: -.02em;
        }

        .error-state-sub { font-size: 14px; color: rgba(245,242,235,0.18); }
        .error-state-sub a { color: var(--yellow); text-decoration: none; font-weight: 600; }

        @media (max-width: 800px) {
          .nav { padding: 0 20px; }
          .body { grid-template-columns: 1fr; padding: 40px 20px 80px; }
          .left-card { position: static; }
        }
      `}</style>

      <div className="root">
        <Navbar />

        {loading ? (
          <div className="spinner-wrap"><div className="page-spinner" /></div>
        ) : error ? (
          <div className="error-state">
            <div className="error-state-icon">⚠️</div>
            <p className="error-state-title">Something went wrong</p>
            <p className="error-state-sub">{error}</p>
            <p className="error-state-sub"><a href="/jobs">← Back to jobs</a></p>
          </div>
        ) : !profile ? (
          <div className="error-state">
            <div className="error-state-icon">🔎</div>
            <p className="error-state-title">Profile Not Found</p>
            <p className="error-state-sub"><a href="/jobs">← Browse jobs</a></p>
          </div>
        ) : (
          <div className="body">

            {/* ── LEFT ── */}
            <div className="left-card">
              <div className="avatar">{initials}</div>
              <p className="profile-name">{profile.name}</p>
              <p className="profile-email">{profile.email}</p>
              <span className={`role-badge ${profile.role}`}>
                {profile.role === 'teen' ? '👋 Teen' : '🏢 Employer'}
              </span>

              {avgRating && (
                <div className="rating-display">
                  <div className="rating-num">{avgRating}</div>
                  <div className="rating-stars">
                    {Array.from({ length: 5 }, (_, i) => (
                      <span key={i} style={{ opacity: i < Math.round(Number(avgRating)) ? 1 : 0.2 }}>★</span>
                    ))}
                  </div>
                  <div className="rating-count">{reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}</div>
                </div>
              )}

              {profile.location && (
                <>
                  <div className="card-divider" />
                  <div className="card-meta">
                    <span>📍</span>
                    <span>{profile.location}</span>
                  </div>
                </>
              )}

              {currentUser && currentUser.id !== userId && (
                <a href={`/messages/new?to=${userId}`} className="msg-btn">
                  💬 Send Message
                </a>
              )}
            </div>

            {/* ── RIGHT ── */}
            <div className="right">

              {/* Banner */}
              <div className="banner" data-name={profile.name?.split(' ')[0] || ''}>
                <p className="banner-eyebrow">👤 Public Profile</p>
                <h1 className="banner-title">
                  {profile.name?.split(' ')[0]}'s <span>Profile</span>
                </h1>
              </div>

              {/* Bio */}
              {(profile.bio || true) && (
                <div className="section-card">
                  <div className="section-head">
                    <span className="section-label">About</span>
                  </div>
                  {profile.bio
                    ? <p className="bio-text">{profile.bio}</p>
                    : <p className="bio-empty">This user hasn't added a bio yet.</p>
                  }
                </div>
              )}

              {/* Reviews */}
              <div className="section-card">
                <div className="section-head">
                  <span className="section-label">Reviews</span>
                  {reviews.length > 0 && (
                    <span className="section-count">{reviews.length}</span>
                  )}
                </div>

                {reviews.length === 0 ? (
                  <div className="reviews-empty">
                    <div className="reviews-empty-icon">⭐</div>
                    <p className="reviews-empty-text">No reviews yet — be the first!</p>
                  </div>
                ) : (
                  <div className="reviews-list">
                    {reviews.map((review, i) => {
                      const reviewerInitials = review.reviewer?.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?'
                      const date = review.created_at
                        ? new Date(review.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                        : ''
                      return (
                        <div key={review.id || i} className="review-card">
                          <div className="review-top">
                            <div className="review-author">
                              <div className="review-avatar">{reviewerInitials}</div>
                              <div>
                                <p className="review-name">{review.reviewer?.name || 'Anonymous'}</p>
                                <p className="review-date">{date}</p>
                              </div>
                            </div>
                            <div className="review-stars">
                              {Array.from({ length: 5 }, (_, i) => (
                                <span key={i} style={{ opacity: i < review.rating ? 1 : 0.18 }}>★</span>
                              ))}
                            </div>
                          </div>
                          {review.comment && (
                            <p className="review-comment">{review.comment}</p>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Leave a review — only if logged in and not own profile */}
              {currentUser && currentUser.id !== userId && (
                <div className="section-card">
                  <div className="section-head">
                    <span className="section-label">Leave a Review</span>
                  </div>

                  <p className="form-eyebrow">Your rating</p>
                  <div className="star-picker">
                    {[1, 2, 3, 4, 5].map(n => (
                      <button
                        key={n}
                        type="button"
                        className={`star-btn ${n <= rating ? 'active' : ''}`}
                        onClick={() => setRating(n)}
                      >
                        ★
                      </button>
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

                    {error && (
                      <div className="error-box"><span>⚠️</span> {error}</div>
                    )}

                    <button type="submit" className="submit-btn" disabled={submitting}>
                      {submitting && <span className="spinner" />}
                      {submitting ? 'Submitting…' : 'Submit Review →'}
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