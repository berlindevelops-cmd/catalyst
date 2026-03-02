'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

export default function JobDetail() {
  const { id } = useParams()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchJob()
  }, [])

  const fetchJob = async () => {
    const { data, error } = await supabase.from('jobs').select('*').eq('id', id).single();
    if (error) {
        setError(error.message);
    } else {
        setJob(data);
    }
    setLoading(false);
  }

  const handleApply = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        window.location.href = '/auth/login';
        return
    } else {
        const { error } = await supabase.from('applications').insert({ job_id: id, teen_id: user.id })
        if (error) {
            setError(error.message);
        }
        alert('Application sent!')
    }
  }

  return (
    <>
        <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Epilogue:wght@300;400;500;700;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .detail-root {
            min-height: 100vh;
            background: #0A0A0A;
            font-family: 'Epilogue', sans-serif;
            color: #F5F2EB;
        }

        /* NAV */
        .detail-nav {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 24px 48px;
            border-bottom: 1px solid rgba(255,255,255,0.06);
            position: sticky;
            top: 0;
            background: rgba(10,10,10,0.9);
            backdrop-filter: blur(12px);
            z-index: 10;
        }
        .detail-nav-logo {
            font-family: 'Bebas Neue', sans-serif;
            font-size: 26px;
            letter-spacing: .08em;
            color: #FFE033;
            text-decoration: none;
        }
        .detail-nav-back {
            font-size: 13px;
            color: rgba(245,242,235,0.4);
            text-decoration: none;
            display: flex;
            align-items: center;
            gap: 6px;
            transition: color .2s;
        }
        .detail-nav-back:hover { color: #F5F2EB; }

        /* LAYOUT */
        .detail-body {
            max-width: 1100px;
            margin: 0 auto;
            padding: 72px 48px 100px;
            display: grid;
            grid-template-columns: 1fr 340px;
            gap: 64px;
            align-items: start;
        }

        /* MAIN */
        .detail-tag {
            font-size: 11px;
            font-weight: 700;
            letter-spacing: .18em;
            text-transform: uppercase;
            color: #FF5C1A;
            margin-bottom: 16px;
        }
        .detail-title {
            font-family: 'Bebas Neue', sans-serif;
            font-size: clamp(56px, 8vw, 96px);
            line-height: .92;
            letter-spacing: .03em;
            margin-bottom: 32px;
        }

        .detail-meta {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            margin-bottom: 48px;
        }
        .meta-chip {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 10px 18px;
            border-radius: 100px;
            font-size: 13px;
            font-weight: 500;
        }
        .meta-chip.pay {
            background: rgba(255,224,51,0.12);
            border: 1px solid rgba(255,224,51,0.25);
            color: #FFE033;
        }
        .meta-chip.location {
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.1);
            color: rgba(245,242,235,0.6);
        }

        .detail-divider {
            height: 1px;
            background: rgba(255,255,255,0.07);
            margin-bottom: 40px;
        }

        .detail-section-label {
            font-size: 11px;
            font-weight: 700;
            letter-spacing: .18em;
            text-transform: uppercase;
            color: rgba(245,242,235,0.3);
            margin-bottom: 16px;
        }
        .detail-desc {
            font-size: 16px;
            font-weight: 300;
            color: rgba(245,242,235,0.7);
            line-height: 1.85;
            white-space: pre-wrap;
        }

        /* SIDEBAR */
        .detail-sidebar {
            position: sticky;
            top: 97px;
            display: flex;
            flex-direction: column;
            gap: 16px;
        }

        .sidebar-card {
            background: #111;
            border: 1px solid rgba(255,255,255,0.07);
            border-radius: 16px;
            padding: 32px 28px;
        }

        .sidebar-title {
            font-family: 'Bebas Neue', sans-serif;
            font-size: 20px;
            letter-spacing: .06em;
            margin-bottom: 8px;
        }
        .sidebar-sub {
            font-size: 13px;
            font-weight: 300;
            color: rgba(245,242,235,0.4);
            line-height: 1.6;
            margin-bottom: 24px;
        }

        .apply-btn {
            display: block;
            width: 100%;
            padding: 17px;
            background: #FFE033;
            color: #0A0A0A;
            border: none;
            border-radius: 10px;
            font-family: 'Bebas Neue', sans-serif;
            font-size: 22px;
            letter-spacing: .08em;
            cursor: pointer;
            text-align: center;
            text-decoration: none;
            transition: opacity .2s, transform .15s;
        }
        .apply-btn:hover { opacity: .88; transform: translateY(-2px); }
        .apply-btn:active { transform: translateY(0); }

        .share-btn {
            display: block;
            width: 100%;
            padding: 14px;
            background: transparent;
            color: rgba(245,242,235,0.45);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 10px;
            font-family: 'Epilogue', sans-serif;
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
            text-align: center;
            transition: border-color .2s, color .2s;
            margin-top: 10px;
        }
        .share-btn:hover {
            border-color: rgba(255,255,255,0.3);
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

        /* ERROR / NOT FOUND */
        .center-msg {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 60vh;
            gap: 16px;
            text-align: center;
        }
        .center-msg-icon { font-size: 48px; }
        .center-msg-title {
            font-family: 'Bebas Neue', sans-serif;
            font-size: 40px;
            letter-spacing: .04em;
            color: rgba(245,242,235,0.4);
        }
        .center-msg-sub {
            font-size: 14px;
            color: rgba(245,242,235,0.25);
        }
        .center-msg a { color: #FFE033; text-decoration: none; }

        @media (max-width: 860px) {
            .detail-nav { padding: 20px 24px; }
            .detail-body {
            grid-template-columns: 1fr;
            padding: 48px 24px 80px;
            gap: 40px;
            }
            .detail-sidebar { position: static; }
        }
        `}</style>

        <div className="detail-root">
        <nav className="detail-nav">
            <a href="/" className="detail-nav-logo">Catalyst</a>
            <a href="/jobs" className="detail-nav-back">← All Jobs</a>
        </nav>

        {loading ? (
            <div className="loading-wrap">
            <div className="loading-spinner" />
            </div>
        ) : error ? (
            <div className="center-msg">
            <div className="center-msg-icon">⚠️</div>
            <p className="center-msg-title">Something went wrong</p>
            <p className="center-msg-sub">{error}</p>
            <p className="center-msg-sub"><a href="/jobs">← Back to jobs</a></p>
            </div>
        ) : !job ? (
            <div className="center-msg">
            <div className="center-msg-icon">🔎</div>
            <p className="center-msg-title">Job Not Found</p>
            <p className="center-msg-sub"><a href="/jobs">← Browse all jobs</a></p>
            </div>
        ) : (
            <div className="detail-body">
            {/* Main content */}
            <div>
                <p className="detail-tag">📋 Job Listing</p>
                <h1 className="detail-title">{job.title}</h1>

                <div className="detail-meta">
                {job.pay && <span className="meta-chip pay">💰 {job.pay}</span>}
                {job.location && <span className="meta-chip location">📍 {job.location}</span>}
                </div>

                <div className="detail-divider" />

                <p className="detail-section-label">About This Job</p>
                <p className="detail-desc">{job.description}</p>
            </div>

            {/* Sidebar */}
            <div className="detail-sidebar">
                <div className="sidebar-card">
                <p className="sidebar-title">Interested?</p>
                <p className="sidebar-sub">
                    Apply now and the employer will reach out to you directly with next steps.
                </p>
                <button className="apply-btn" onClick={handleApply}>
                    Apply Now →
                </button>
                <button
                    className="share-btn"
                    onClick={() => { navigator.clipboard.writeText(window.location.href); alert('Link copied!') }}
                >
                    🔗 Copy Link
                </button>
                </div>

                {(job.pay || job.location) && (
                <div className="sidebar-card">
                    <p className="detail-section-label" style={{marginBottom: '20px'}}>Quick Info</p>
                    {job.pay && (
                    <div style={{marginBottom: '14px'}}>
                        <p style={{fontSize: '11px', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(245,242,235,0.3)', marginBottom: '4px'}}>Pay</p>
                        <p style={{fontSize: '16px', fontWeight: 500, color: '#FFE033'}}>{job.pay}</p>
                    </div>
                    )}
                    {job.location && (
                    <div>
                        <p style={{fontSize: '11px', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(245,242,235,0.3)', marginBottom: '4px'}}>Location</p>
                        <p style={{fontSize: '15px', fontWeight: 400, color: 'rgba(245,242,235,0.65)'}}>{job.location}</p>
                    </div>
                    )}
                </div>
                )}
            </div>
            </div>
        )}
        </div>
    </>
  )
}