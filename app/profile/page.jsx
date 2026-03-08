'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'
import Navbar from '../../components/Navbar'

export default function Profile() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null) 
  
  const router = useRouter()

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        router.push('/auth/login')
        return
    }

    const { data, error } = await supabase.from('users').select('*').eq('id', user.id).single();
    if (error) {
        setError(error.message);
    } else {
        setProfile(data);
    }
    setLoading(false);
  }

  return (
    <>
        <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Epilogue:wght@300;400;500;700;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .profile-root {
            min-height: 100vh;
            background: #0A0A0A;
            font-family: 'Epilogue', sans-serif;
            color: #F5F2EB;
        }

        /* BODY */
        .profile-body {
            max-width: 1000px;
            margin: 0 auto;
            padding: 72px 48px 100px;
            display: grid;
            grid-template-columns: 280px 1fr;
            gap: 48px;
            align-items: start;
        }

        /* LEFT CARD */
        .profile-card {
            background: #111;
            border: 1px solid rgba(255,255,255,0.07);
            border-radius: 20px;
            padding: 40px 32px;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            position: sticky;
            top: 97px;
        }

        .profile-avatar {
            width: 88px;
            height: 88px;
            border-radius: 50%;
            background: linear-gradient(135deg, #FFE033, #FF5C1A);
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Bebas Neue', sans-serif;
            font-size: 36px;
            color: #0A0A0A;
            margin-bottom: 20px;
            flex-shrink: 0;
        }

        .profile-name {
            font-family: 'Bebas Neue', sans-serif;
            font-size: 28px;
            letter-spacing: .04em;
            margin-bottom: 8px;
        }

        .profile-email {
            font-size: 13px;
            color: rgba(245,242,235,0.35);
            margin-bottom: 20px;
            word-break: break-all;
        }

        .profile-role-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 6px 16px;
            border-radius: 100px;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: .1em;
            text-transform: uppercase;
            margin-bottom: 32px;
        }
        .profile-role-badge.teen {
            background: rgba(255,224,51,0.12);
            border: 1px solid rgba(255,224,51,0.25);
            color: #FFE033;
        }
        .profile-role-badge.employer {
            background: rgba(255,92,26,0.12);
            border: 1px solid rgba(255,92,26,0.25);
            color: #FF5C1A;
        }

        .profile-card-divider {
            width: 100%;
            height: 1px;
            background: rgba(255,255,255,0.07);
            margin-bottom: 24px;
        }

        .profile-meta-row {
            width: 100%;
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 13px;
            color: rgba(245,242,235,0.45);
            margin-bottom: 12px;
        }
        .profile-meta-row:last-child { margin-bottom: 0; }

        /* RIGHT CONTENT */
        .profile-right {}

        .profile-section {
            margin-bottom: 48px;
        }

        .section-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 20px;
            padding-bottom: 16px;
            border-bottom: 1px solid rgba(255,255,255,0.07);
        }

        .section-label {
            font-size: 11px;
            font-weight: 700;
            letter-spacing: .18em;
            text-transform: uppercase;
            color: rgba(245,242,235,0.3);
        }

        .edit-btn {
            font-size: 12px;
            font-weight: 600;
            color: #FFE033;
            background: none;
            border: none;
            cursor: pointer;
            font-family: 'Epilogue', sans-serif;
            letter-spacing: .04em;
            opacity: .7;
            transition: opacity .2s;
        }
        .edit-btn:hover { opacity: 1; }

        .section-title {
            font-family: 'Bebas Neue', sans-serif;
            font-size: 40px;
            letter-spacing: .04em;
            margin-bottom: 4px;
        }

        .bio-text {
            font-size: 15px;
            font-weight: 300;
            color: rgba(245,242,235,0.6);
            line-height: 1.8;
        }

        .bio-empty {
            font-size: 14px;
            color: rgba(245,242,235,0.2);
            font-style: italic;
        }

        /* INFO GRID */
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
        }

        .info-tile {
            background: #111;
            border: 1px solid rgba(255,255,255,0.07);
            border-radius: 14px;
            padding: 24px 22px;
        }

        .info-tile-label {
            font-size: 10px;
            font-weight: 700;
            letter-spacing: .14em;
            text-transform: uppercase;
            color: rgba(245,242,235,0.25);
            margin-bottom: 8px;
        }

        .info-tile-value {
            font-size: 15px;
            font-weight: 500;
            color: #F5F2EB;
        }

        .info-tile-value.accent { color: #FFE033; }
        .info-tile-value.empty { color: rgba(245,242,235,0.2); font-style: italic; font-weight: 300; }

        /* ACTION TILES */
        .action-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
        }

        .action-tile {
            background: #111;
            border: 1px solid rgba(255,255,255,0.07);
            border-radius: 14px;
            padding: 24px;
            text-decoration: none;
            color: inherit;
            display: flex;
            align-items: center;
            gap: 14px;
            transition: background .2s, border-color .2s;
        }
        .action-tile:hover {
            background: #1A1A1A;
            border-color: rgba(255,224,51,0.2);
        }

        .action-icon { font-size: 24px; }

        .action-tile-label {
            font-size: 11px;
            font-weight: 700;
            letter-spacing: .1em;
            text-transform: uppercase;
            color: rgba(245,242,235,0.3);
            margin-bottom: 4px;
        }

        .action-tile-title {
            font-size: 14px;
            font-weight: 600;
            color: #F5F2EB;
        }

        /* LOADING */
        .loading-wrap {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 60vh;
        }
        .loading-spinner {
            width: 40px; height: 40px;
            border: 3px solid rgba(255,255,255,0.08);
            border-top-color: #FFE033;
            border-radius: 50%;
            animation: spin .7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 768px) {
            .profile-nav { padding: 20px 24px; }
            .profile-body {
            grid-template-columns: 1fr;
            padding: 40px 24px 80px;
            gap: 32px;
            }
            .profile-card { position: static; }
            .info-grid { grid-template-columns: 1fr; }
            .action-grid { grid-template-columns: 1fr; }
        }
        `}</style>

        <div className="profile-root">
        <Navbar />

        {loading ? (
            <div className="loading-wrap">
            <div className="loading-spinner" />
            </div>
        ) : (
            <div className="profile-body">

            {/* Left card */}
            <div className="profile-card">
                <div className="profile-avatar">
                {profile?.name?.charAt(0).toUpperCase() || '?'}
                </div>
                <p className="profile-name">{profile?.name || 'Unknown'}</p>
                <p className="profile-email">{profile?.email}</p>
                <span className={`profile-role-badge ${profile?.role}`}>
                {profile?.role === 'teen' ? '👋 Teen' : '🏢 Employer'}
                </span>

                {profile?.location && (
                <>
                    <div className="profile-card-divider" />
                    <div className="profile-meta-row">
                    <span>📍</span>
                    <span>{profile.location}</span>
                    </div>
                </>
                )}
            </div>

            {/* Right content */}
            <div className="profile-right">

                {/* Headline */}
                <div className="profile-section">
                <div className="section-header">
                    <span className="section-label">Profile</span>
                </div>
                <h1 className="section-title">
                    {profile?.name?.split(' ')[0]}'s Page
                </h1>
                </div>

                {/* Bio */}
                <div className="profile-section">
                <div className="section-header">
                    <span className="section-label">About</span>
                    <button className="edit-btn">Edit ✏️</button>
                </div>
                {profile?.bio ? (
                    <p className="bio-text">{profile.bio}</p>
                ) : (
                    <p className="bio-empty">No bio yet — add one to stand out!</p>
                )}
                </div>

                {/* Info tiles */}
                <div className="profile-section">
                <div className="section-header">
                    <span className="section-label">Details</span>
                </div>
                <div className="info-grid">
                    <div className="info-tile">
                    <p className="info-tile-label">Role</p>
                    <p className={`info-tile-value ${profile?.role ? 'accent' : 'empty'}`}>
                        {profile?.role === 'teen' ? '👋 Teen' : profile?.role === 'employer' ? '🏢 Employer' : 'Not set'}
                    </p>
                    </div>
                    <div className="info-tile">
                    <p className="info-tile-label">Location</p>
                    <p className={`info-tile-value ${profile?.location ? '' : 'empty'}`}>
                        {profile?.location || 'Not set'}
                    </p>
                    </div>
                    <div className="info-tile">
                    <p className="info-tile-label">Email</p>
                    <p className="info-tile-value" style={{fontSize: '13px', wordBreak: 'break-all'}}>
                        {profile?.email}
                    </p>
                    </div>
                    <div className="info-tile">
                    <p className="info-tile-label">Member Since</p>
                    <p className="info-tile-value" style={{fontSize: '13px'}}>
                        {profile?.created_at
                        ? new Date(profile.created_at).toLocaleDateString('en-US', {month: 'long', year: 'numeric'})
                        : 'Plymouth, IN'}
                    </p>
                    </div>
                </div>
                </div>

                {/* Quick actions */}
                <div className="profile-section">
                <div className="section-header">
                    <span className="section-label">Quick Actions</span>
                </div>
                <div className="action-grid">
                    <a href="/jobs" className="action-tile">
                    <span className="action-icon">🔍</span>
                    <div>
                        <p className="action-tile-label">Explore</p>
                        <p className="action-tile-title">Browse Jobs</p>
                    </div>
                    </a>
                    <a href="/jobs/post" className="action-tile">
                    <span className="action-icon">✍️</span>
                    <div>
                        <p className="action-tile-label">Employer</p>
                        <p className="action-tile-title">Post a Job</p>
                    </div>
                    </a>
                </div>
                </div>

            </div>
            </div>
        )}
        </div>
    </>
  )
}