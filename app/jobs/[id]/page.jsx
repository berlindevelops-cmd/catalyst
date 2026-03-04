'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '../../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function JobDetail() {
  const { id } = useParams()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [applied, setApplied] = useState(false)
  const [error, setError] = useState(null)

  const router = useRouter()

  useEffect(() => { fetchJob() }, [])

  const fetchJob = async () => {
    const { data, error } = await supabase.from('jobs').select('*').eq('id', id).single()
    if (error) setError(error.message)
    else setJob(data)
    setLoading(false)
  }

  const handleApply = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth/login'); return }
    const { error } = await supabase.from('applications').insert({ job_id: id, teen_id: user.id })
    if (error) setError(error.message)
    else setApplied(true)
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

        /* ── NAV ── */
        .nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 40px;
          height: 64px;
          border-bottom: 1px solid var(--border);
          background: rgba(13,13,13,0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .nav-logo {
          font-family: 'Syne', sans-serif;
          font-size: 22px;
          font-weight: 800;
          color: #F5F2EB;
          text-decoration: none;
          letter-spacing: -.01em;
        }

        .nav-logo span { color: var(--yellow); }

        .nav-back {
          font-size: 14px;
          font-weight: 500;
          color: var(--muted);
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          border-radius: 8px;
          transition: color .15s, background .15s;
        }

        .nav-back:hover { color: #F5F2EB; background: rgba(255,255,255,0.06); }

        /* ── BODY ── */
        .body {
          max-width: 1100px;
          margin: 0 auto;
          padding: 64px 40px 100px;
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 56px;
          align-items: start;
        }

        /* ── MAIN ── */
        .main-eyebrow {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: .14em;
          text-transform: uppercase;
          color: var(--orange);
          margin-bottom: 16px;
        }

        .main-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(42px, 6vw, 72px);
          font-weight: 800;
          line-height: 1.0;
          letter-spacing: -.03em;
          margin-bottom: 28px;
        }

        .meta-row {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 48px;
        }

        .meta-chip {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 9px 16px;
          border-radius: 100px;
          font-size: 13px;
          font-weight: 600;
        }

        .meta-chip.pay {
          background: rgba(255,224,51,0.1);
          border: 1px solid rgba(255,224,51,0.22);
          color: var(--yellow);
        }

        .meta-chip.loc {
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--border);
          color: var(--muted);
        }

        .divider {
          height: 1px;
          background: var(--border);
          margin-bottom: 36px;
        }

        .section-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .14em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.25);
          margin-bottom: 20px;
        }

        .job-desc {
          font-size: 16px;
          font-weight: 400;
          color: rgba(245,242,235,0.65);
          line-height: 1.85;
          white-space: pre-wrap;
        }

        /* ── SIDEBAR ── */
        .sidebar {
          position: sticky;
          top: 84px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .sidebar-card {
          background: var(--gray);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 28px 24px;
        }

        .sidebar-card-title {
          font-family: 'Syne', sans-serif;
          font-size: 18px;
          font-weight: 800;
          letter-spacing: -.01em;
          margin-bottom: 8px;
        }

        .sidebar-card-sub {
          font-size: 13px;
          font-weight: 400;
          color: var(--muted);
          line-height: 1.6;
          margin-bottom: 24px;
        }

        .apply-btn {
          display: block;
          width: 100%;
          padding: 16px;
          background: var(--yellow);
          color: var(--black);
          border: none;
          border-radius: 12px;
          font-family: 'Syne', sans-serif;
          font-size: 16px;
          font-weight: 800;
          letter-spacing: -.01em;
          cursor: pointer;
          text-align: center;
          text-decoration: none;
          transition: opacity .18s, transform .15s;
        }

        .apply-btn:hover:not(:disabled) { opacity: .88; transform: translateY(-1px); }
        .apply-btn:active:not(:disabled) { transform: translateY(0); }
        .apply-btn:disabled { opacity: .6; cursor: default; background: #4ade80; }

        .apply-btn.success { background: #4ade80; color: #052e16; }

        .copy-btn {
          display: block;
          width: 100%;
          padding: 13px;
          background: transparent;
          color: var(--muted);
          border: 1px solid var(--border);
          border-radius: 10px;
          font-family: 'Instrument Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          text-align: center;
          margin-top: 10px;
          transition: border-color .18s, color .18s;
        }

        .copy-btn:hover { border-color: rgba(255,255,255,0.2); color: #F5F2EB; }

        /* quick info card */
        .info-row {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .info-item {}

        .info-item-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.25);
          margin-bottom: 5px;
        }

        .info-item-val {
          font-size: 16px;
          font-weight: 600;
          color: var(--yellow);
        }

        .info-item-val.loc {
          color: rgba(245,242,235,0.65);
          font-size: 15px;
          font-weight: 500;
        }

        /* ── STATES ── */
        .center {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
          gap: 16px;
          text-align: center;
          padding: 40px;
        }

        .center-icon { font-size: 48px; }

        .center-title {
          font-family: 'Syne', sans-serif;
          font-size: 28px;
          font-weight: 800;
          letter-spacing: -.02em;
          color: rgba(245,242,235,0.3);
        }

        .center-sub { font-size: 14px; color: rgba(245,242,235,0.2); }
        .center-sub a { color: var(--yellow); text-decoration: none; font-weight: 600; }

        .spinner-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
        }

        .spinner {
          width: 36px; height: 36px;
          border: 3px solid rgba(255,255,255,0.07);
          border-top-color: var(--yellow);
          border-radius: 50%;
          animation: spin .7s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 860px) {
          .nav { padding: 0 20px; }
          .body { grid-template-columns: 1fr; padding: 48px 20px 80px; gap: 40px; }
          .sidebar { position: static; }
        }
      `}</style>

      <div className="root">
        <nav className="nav">
          <a href="/" className="nav-logo">Catalyst<span>.</span></a>
          <a href="/jobs" className="nav-back">← All Jobs</a>
        </nav>

        {loading ? (
          <div className="spinner-wrap"><div className="spinner" /></div>
        ) : error ? (
          <div className="center">
            <div className="center-icon">⚠️</div>
            <p className="center-title">Something went wrong</p>
            <p className="center-sub">{error}</p>
            <p className="center-sub"><a href="/jobs">← Back to jobs</a></p>
          </div>
        ) : !job ? (
          <div className="center">
            <div className="center-icon">🔎</div>
            <p className="center-title">Job Not Found</p>
            <p className="center-sub"><a href="/jobs">← Browse all jobs</a></p>
          </div>
        ) : (
          <div className="body">
            {/* ── MAIN ── */}
            <div>
              <p className="main-eyebrow">📋 Job Listing</p>
              <h1 className="main-title">{job.title}</h1>

              <div className="meta-row">
                {job.pay && <span className="meta-chip pay">💰 {job.pay}</span>}
                {job.location && <span className="meta-chip loc">📍 {job.location}</span>}
              </div>

              <div className="divider" />

              <p className="section-label">About This Job</p>
              <p className="job-desc">{job.description}</p>
            </div>

            {/* ── SIDEBAR ── */}
            <div className="sidebar">
              <div className="sidebar-card">
                <p className="sidebar-card-title">Interested?</p>
                <p className="sidebar-card-sub">
                  Apply now and the employer will reach out to you directly with next steps.
                </p>
                <button
                  className={`apply-btn${applied ? ' success' : ''}`}
                  onClick={handleApply}
                  disabled={applied}
                >
                  {applied ? '✓ Applied!' : 'Apply Now →'}
                </button>
                <button
                  className="copy-btn"
                  onClick={() => navigator.clipboard.writeText(window.location.href)}
                >
                  🔗 Copy Link
                </button>
              </div>

              {(job.pay || job.location) && (
                <div className="sidebar-card">
                  <p className="section-label" style={{marginBottom: '20px'}}>Quick Info</p>
                  <div className="info-row">
                    {job.pay && (
                      <div className="info-item">
                        <p className="info-item-label">Pay</p>
                        <p className="info-item-val">{job.pay}</p>
                      </div>
                    )}
                    {job.location && (
                      <div className="info-item">
                        <p className="info-item-label">Location</p>
                        <p className="info-item-val loc">{job.location}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}