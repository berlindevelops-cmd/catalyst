'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'
import Navbar from '../../components/NavBar'
import { MapPin, Pencil, Search, Briefcase, Star, ExternalLink, User } from 'lucide-react'

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

        /* ── LEFT CARD ── */
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
          font-family: 'Unbounded', sans-serif; font-size: 32px; font-weight: 900;
          color: var(--white); margin-bottom: 18px; box-shadow: var(--shadow);
        }

        .profile-name {
          font-family: 'Unbounded', sans-serif; font-size: 18px; font-weight: 900;
          letter-spacing: -.02em; margin-bottom: 6px;
        }

        .profile-email {
          font-size: 12px; color: #888; margin-bottom: 16px;
          word-break: break-all; line-height: 1.4; font-weight: 600;
        }

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

        .card-divider { width: 100%; height: 2px; background: var(--black); opacity: .08; margin: 16px 0; }

        .card-meta {
          width: 100%; display: flex; align-items: center; gap: 8px;
          font-size: 13px; color: #777; font-weight: 700;
        }

        .rating-box {
          width: 100%; background: var(--black); border-radius: 14px;
          padding: 18px; margin-top: 16px; text-align: center;
          border: 2px solid var(--black);
        }
        .rating-num {
          font-family: 'Unbounded', sans-serif; font-size: 36px; font-weight: 900;
          color: var(--yellow); letter-spacing: -.03em; line-height: 1;
        }
        .rating-stars { color: var(--yellow); font-size: 14px; letter-spacing: 2px; margin: 6px 0 4px; }
        .rating-count { font-size: 11px; color: rgba(255,255,255,0.4); font-weight: 700; text-transform: uppercase; letter-spacing: .06em; }

        /* ── RIGHT ── */
        .right { display: flex; flex-direction: column; gap: 16px; }

        .section-card {
          background: var(--cream); border: 3px solid var(--black);
          border-radius: 20px; padding: 28px 32px;
          box-shadow: var(--shadow);
          transition: box-shadow .12s, transform .12s;
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

        .edit-btn {
          display: flex; align-items: center; gap: 6px;
          font-size: 12px; font-weight: 800; color: var(--orange);
          background: none; border: none; cursor: pointer;
          font-family: 'Nunito', sans-serif;
          transition: color .15s;
        }
        .edit-btn:hover { color: var(--black); }

        .page-title {
          font-family: 'Unbounded', sans-serif;
          font-size: clamp(32px, 4vw, 52px); font-weight: 900;
          letter-spacing: -.04em; line-height: 1;
        }
        .page-title .highlight { background: var(--yellow); border: 2px solid var(--black); padding: 0 6px; border-radius: 4px; }

        .bio-text { font-size: 15px; font-weight: 600; color: #555; line-height: 1.8; }
        .bio-empty { font-size: 14px; color: #bbb; font-weight: 700; font-style: italic; }

        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

        .info-tile {
          background: var(--white); border: 2.5px solid var(--black);
          border-radius: 14px; padding: 20px;
          box-shadow: 3px 3px 0 var(--black);
        }
        .info-tile-label {
          font-family: 'Unbounded', sans-serif; font-size: 9px; font-weight: 700;
          letter-spacing: .14em; text-transform: uppercase; color: #aaa; margin-bottom: 8px;
        }
        .info-tile-value { font-size: 14px; font-weight: 800; color: var(--black); }
        .info-tile-value.accent { color: var(--orange); }
        .info-tile-value.empty { color: #ccc; font-style: italic; font-weight: 600; }

        .action-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

        .action-tile {
          background: var(--white); border: 2.5px solid var(--black);
          border-radius: 14px; padding: 20px 22px;
          text-decoration: none; color: inherit;
          display: flex; align-items: center; gap: 14px;
          box-shadow: 3px 3px 0 var(--black);
          transition: transform .12s, box-shadow .12s;
        }
        .action-tile:hover { transform: translate(-2px,-2px); box-shadow: var(--shadow); }

        .action-icon {
          width: 40px; height: 40px; border-radius: 10px;
          border: 2px solid var(--black); background: var(--yellow);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; color: var(--black);
        }
        .action-tile-label {
          font-family: 'Unbounded', sans-serif; font-size: 9px; font-weight: 700;
          letter-spacing: .1em; text-transform: uppercase; color: #aaa; margin-bottom: 3px;
        }
        .action-tile-title { font-size: 14px; font-weight: 800; color: var(--black); }

        .review-item {
          background: var(--white); border: 2.5px solid var(--black);
          border-radius: 14px; padding: 18px 20px;
          box-shadow: 3px 3px 0 var(--black); margin-bottom: 10px;
        }
        .review-top { display: flex; justify-content: space-between; margin-bottom: 8px; }
        .review-name { font-size: 14px; font-weight: 800; }
        .review-stars { color: var(--orange); font-size: 14px; }
        .review-comment { font-size: 13px; font-weight: 600; color: #666; line-height: 1.6; }

        .portfolio-link {
          font-size: 12px; font-weight: 800; color: var(--orange);
          text-decoration: none; display: flex; align-items: center; gap: 4px; margin-top: 8px;
        }

        .loading-wrap { display: flex; align-items: center; justify-content: center; min-height: 60vh; }
        .spinner {
          width: 40px; height: 40px; border: 3px solid rgba(0,0,0,0.08);
          border-top-color: var(--orange); border-radius: 50%; animation: spin .7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 768px) {
          .body { grid-template-columns: 1fr; padding: 32px 20px 80px; }
          .left-card { position: static; }
          .info-grid, .action-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="page">
        <Navbar />
        {loading ? (
          <div className="loading-wrap"><div className="spinner" /></div>
        ) : (
          <div className="body">
            {/* LEFT */}
            <div className="left-card">
              <div className="avatar">{profile?.name?.charAt(0).toUpperCase() || '?'}</div>
              <p className="profile-name">{profile?.name || 'Unknown'}</p>
              <p className="profile-email">{profile?.email}</p>
              <span className={`role-badge ${profile?.role}`}>
                {profile?.role === 'teen' ? <><User size={12} strokeWidth={3} /> Teen</> : <><Briefcase size={12} strokeWidth={3} /> Employer</>}
              </span>
              {profile?.location && (
                <>
                  <div className="card-divider" />
                  <div className="card-meta"><MapPin size={14} strokeWidth={2.5} />{profile.location}</div>
                </>
              )}
              {avgRating && (
                <div className="rating-box">
                  <div className="rating-num">{avgRating}</div>
                  <div className="rating-stars">
                    {Array.from({length:5},(_,i)=><span key={i} style={{opacity: i < Math.round(Number(avgRating)) ? 1 : 0.2}}>★</span>)}
                  </div>
                  <div className="rating-count">{reviews.length} {reviews.length===1?'review':'reviews'}</div>
                </div>
              )}
            </div>

            {/* RIGHT */}
            <div className="right">
              <div className="section-card">
                <div className="section-head"><span className="section-label">Profile</span></div>
                <h1 className="page-title">
                  <span className="highlight">{profile?.name?.split(' ')[0]}</span>'s Page
                </h1>
              </div>

              <div className="section-card">
                <div className="section-head">
                  <span className="section-label">About</span>
                  <button className="edit-btn"><Pencil size={13} strokeWidth={2.5} /> Edit</button>
                </div>
                {profile?.bio
                  ? <p className="bio-text">{profile.bio}</p>
                  : <p className="bio-empty">No bio yet — add one to stand out!</p>}
              </div>

              <div className="section-card">
                <div className="section-head"><span className="section-label">Details</span></div>
                <div className="info-grid">
                  <div className="info-tile">
                    <p className="info-tile-label">Role</p>
                    <p className={`info-tile-value ${profile?.role ? 'accent' : 'empty'}`}>
                      {profile?.role === 'teen' ? 'Teen' : profile?.role === 'employer' ? 'Employer' : 'Not set'}
                    </p>
                  </div>
                  <div className="info-tile">
                    <p className="info-tile-label">Location</p>
                    <p className={`info-tile-value ${profile?.location ? '' : 'empty'}`}>{profile?.location || 'Not set'}</p>
                  </div>
                  <div className="info-tile">
                    <p className="info-tile-label">Email</p>
                    <p className="info-tile-value" style={{fontSize:'13px',wordBreak:'break-all'}}>{profile?.email}</p>
                  </div>
                  <div className="info-tile">
                    <p className="info-tile-label">Member Since</p>
                    <p className="info-tile-value" style={{fontSize:'13px'}}>
                      {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US',{month:'long',year:'numeric'}) : 'Plymouth, IN'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="section-card">
                <div className="section-head"><span className="section-label">Quick Actions</span></div>
                <div className="action-grid">
                  <a href="/jobs" className="action-tile">
                    <div className="action-icon"><Search size={18} strokeWidth={2.5} /></div>
                    <div><p className="action-tile-label">Explore</p><p className="action-tile-title">Browse Jobs</p></div>
                  </a>
                  <a href="/jobs/post" className="action-tile">
                    <div className="action-icon"><Briefcase size={18} strokeWidth={2.5} /></div>
                    <div><p className="action-tile-label">Employer</p><p className="action-tile-title">Post a Job</p></div>
                  </a>
                </div>
              </div>

              <div className="section-card">
                <div className="section-head">
                  <span className="section-label">Portfolio</span>
                  <a href="/portfolio" className="edit-btn"><Pencil size={13} strokeWidth={2.5} /> Manage</a>
                </div>
                {portfolio.length === 0
                  ? <p className="bio-empty">No portfolio items yet — <a href="/portfolio" style={{color:'var(--orange)'}}>add some</a>.</p>
                  : <div className="info-grid">
                      {portfolio.map(item => (
                        <div key={item.id} className="info-tile">
                          <p className="info-tile-label">{item.title}</p>
                          <p style={{fontSize:'13px',fontWeight:600,color:'#666',marginTop:4}}>{item.description}</p>
                          {item.url && <a href={item.url} target="_blank" className="portfolio-link"><ExternalLink size={12} strokeWidth={2.5} /> View</a>}
                        </div>
                      ))}
                    </div>
                }
              </div>

              <div className="section-card">
                <div className="section-head">
                  <span className="section-label">Reviews</span>
                  <span style={{fontSize:'12px',fontWeight:800,color:'#aaa'}}>{reviews.length} total</span>
                </div>
                {reviews.length === 0
                  ? <p className="bio-empty">No reviews yet.</p>
                  : reviews.map(r => (
                      <div key={r.id} className="review-item">
                        <div className="review-top">
                          <p className="review-name">{r.reviewer?.name}</p>
                          <p className="review-stars">{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</p>
                        </div>
                        <p className="review-comment">{r.comment}</p>
                      </div>
                    ))
                }
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}