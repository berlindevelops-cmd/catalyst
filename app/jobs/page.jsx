'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Navbar from '../../components/Navbar'

export default function Jobs() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [error, setError] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    fetchJobs()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setCurrentUser(user)
    })
  }, [])

  const fetchJobs = async () => {
    const { data, error } = await supabase.from('jobs').select('*')
    if (error) setError(error.message)
    else setJobs(data)
    setLoading(false)
  }

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(search.toLowerCase()) ||
    job.location.toLowerCase().includes(search.toLowerCase())
  )

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
          --text-muted: rgba(245,242,235,0.4);
        }

        body { background: var(--black); }

        .root {
          min-height: 100vh;
          background: var(--black);
          font-family: 'Instrument Sans', sans-serif;
          color: #F5F2EB;
        }

        /* ── HEADER ── */
        .header {
          padding: 64px 40px 48px;
          position: relative;
          overflow: hidden;
        }

        .header-glow {
          position: absolute;
          top: -100px; right: -100px;
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(255,92,26,0.12) 0%, transparent 65%);
          pointer-events: none;
        }

        .header-inner {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 32px;
          flex-wrap: wrap;
          margin-bottom: 36px;
        }

        .header-eyebrow {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: .14em;
          text-transform: uppercase;
          color: var(--orange);
          margin-bottom: 14px;
        }

        .header-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(48px, 7vw, 80px);
          font-weight: 800;
          line-height: 1.0;
          letter-spacing: -.03em;
        }

        .header-title span { color: var(--yellow); }

        .header-count {
          font-size: 13px;
          font-weight: 500;
          color: var(--text-muted);
          padding-bottom: 10px;
          white-space: nowrap;
        }

        .header-count strong { color: var(--yellow); font-weight: 700; }

        /* ── SEARCH ── */
        .search-wrap {
          position: relative;
          max-width: 560px;
        }

        .search-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 15px;
          pointer-events: none;
          opacity: 0.4;
        }

        .search-input {
          width: 100%;
          background: var(--gray);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 15px 16px 15px 46px;
          color: #F5F2EB;
          font-family: 'Instrument Sans', sans-serif;
          font-size: 14px;
          font-weight: 400;
          outline: none;
          transition: border-color .18s, box-shadow .18s;
        }

        .search-input::placeholder { color: rgba(245,242,235,0.22); }

        .search-input:focus {
          border-color: var(--yellow);
          box-shadow: 0 0 0 3px rgba(255,224,51,0.08);
        }

        /* ── GRID ── */
        .grid-wrap {
          padding: 0 40px 80px;
        }

        .jobs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 12px;
        }

        /* ── JOB CARD ── */
        .job-card {
          background: var(--gray);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 32px 28px;
          text-decoration: none;
          color: inherit;
          display: flex;
          flex-direction: column;
          gap: 14px;
          transition: border-color .18s, transform .18s, background .18s;
          position: relative;
          overflow: hidden;
        }

        .job-card:hover {
          border-color: rgba(255,255,255,0.16);
          background: var(--gray2);
          transform: translateY(-3px);
        }

        .job-card-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
        }

        .job-title {
          font-family: 'Syne', sans-serif;
          font-size: 20px;
          font-weight: 800;
          letter-spacing: -.02em;
          line-height: 1.2;
          color: #F5F2EB;
        }

        .job-pay {
          background: rgba(255,224,51,0.1);
          border: 1px solid rgba(255,224,51,0.22);
          color: var(--yellow);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: .04em;
          padding: 5px 12px;
          border-radius: 100px;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .job-location {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 600;
          color: var(--text-muted);
          letter-spacing: .05em;
          text-transform: uppercase;
        }

        .job-desc {
          font-size: 13px;
          font-weight: 400;
          color: rgba(245,242,235,0.4);
          line-height: 1.65;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          flex: 1;
        }

        .job-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 4px;
          padding-top: 16px;
          border-top: 1px solid var(--border);
        }

        .job-apply-hint {
          font-size: 12px;
          font-weight: 600;
          color: var(--text-muted);
          letter-spacing: .04em;
          text-transform: uppercase;
        }

        .job-arrow {
          width: 32px; height: 32px;
          border-radius: 8px;
          background: rgba(255,224,51,0.08);
          border: 1px solid rgba(255,224,51,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          color: var(--yellow);
          transition: background .18s, transform .18s;
        }

        .job-card:hover .job-arrow {
          background: var(--yellow);
          color: var(--black);
          transform: translateX(2px);
        }

        /* ── EMPTY STATE ── */
        .empty-state {
          grid-column: 1 / -1;
          padding: 80px 0;
          text-align: center;
        }

        .empty-icon { font-size: 48px; margin-bottom: 20px; }

        .empty-title {
          font-family: 'Syne', sans-serif;
          font-size: 28px;
          font-weight: 800;
          letter-spacing: -.02em;
          margin-bottom: 10px;
          color: rgba(245,242,235,0.3);
        }

        .empty-sub {
          font-size: 14px;
          color: rgba(245,242,235,0.2);
        }

        .empty-sub a { color: var(--yellow); text-decoration: none; font-weight: 600; }

        /* ── SKELETONS ── */
        .skel-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 12px;
        }

        .skel-card {
          background: var(--gray);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 32px 28px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .skel-block {
          background: rgba(255,255,255,0.05);
          border-radius: 8px;
          animation: pulse 1.5s ease infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .35; }
        }

        /* ── POST JOB BANNER ── */
        .post-banner {
          margin: 0 40px 40px;
          background: var(--orange);
          border-radius: 20px;
          padding: 28px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          overflow: hidden;
          position: relative;
        }

        .post-banner::before {
          content: 'HIRE';
          position: absolute;
          right: 20px;
          top: 50%;
          transform: translateY(-50%);
          font-family: 'Syne', sans-serif;
          font-size: 100px;
          font-weight: 800;
          color: rgba(0,0,0,0.08);
          pointer-events: none;
          white-space: nowrap;
          letter-spacing: -.03em;
        }

        .post-banner-text strong {
          display: block;
          font-family: 'Syne', sans-serif;
          font-size: 18px;
          font-weight: 800;
          letter-spacing: -.02em;
          color: #fff;
          margin-bottom: 4px;
        }

        .post-banner-text span {
          font-size: 13px;
          color: rgba(255,255,255,0.65);
        }

        .post-banner-btn {
          background: #fff;
          color: var(--orange);
          padding: 11px 24px;
          border-radius: 10px;
          font-family: 'Syne', sans-serif;
          font-size: 14px;
          font-weight: 800;
          text-decoration: none;
          white-space: nowrap;
          flex-shrink: 0;
          position: relative;
          z-index: 1;
          transition: opacity .15s;
        }

        .post-banner-btn:hover { opacity: .9; }

        @media (max-width: 768px) {
          .nav { padding: 0 20px; }
          .header { padding: 48px 20px 32px; }
          .grid-wrap { padding: 0 20px 64px; }
          .jobs-grid { grid-template-columns: 1fr; }
          .post-banner { margin: 0 20px 32px; }
          .skel-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="root">
        {/* ── NAV ── */}
        <Navbar />

        {/* ── HEADER ── */}
        <div className="header">
          <div className="header-glow" />
          <div className="header-inner">
            <div>
              <p className="header-eyebrow">📍 Plymouth, Indiana</p>
              <h1 className="header-title">
                Browse <span>Jobs</span>
              </h1>
            </div>
            {!loading && (
              <p className="header-count">
                <strong>{filteredJobs.length}</strong> {filteredJobs.length === 1 ? 'job' : 'jobs'} available
              </p>
            )}
          </div>

          <div className="search-wrap">
            <span className="search-icon">🔍</span>
            <input
              className="search-input"
              type="text"
              placeholder="Search by title or location..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* ── POST JOB BANNER ── */}
        <div className="post-banner">
          <div className="post-banner-text">
            <strong>Need to hire a teen?</strong>
            <span>Post a job in under 2 minutes — free, always.</span>
          </div>
          <a href="/jobs/post" className="post-banner-btn">Post a Job →</a>
        </div>

        {/* ── GRID ── */}
        <div className="grid-wrap">
          {loading ? (
            <div className="skel-grid">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="skel-card">
                  <div className="skel-block" style={{height: '24px', width: '55%'}} />
                  <div className="skel-block" style={{height: '13px', width: '28%'}} />
                  <div className="skel-block" style={{height: '12px', width: '100%'}} />
                  <div className="skel-block" style={{height: '12px', width: '75%'}} />
                  <div className="skel-block" style={{height: '12px', width: '85%'}} />
                </div>
              ))}
            </div>
          ) : (
            <div className="jobs-grid">
              {filteredJobs.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">🔎</div>
                  <p className="empty-title">No Jobs Found</p>
                  <p className="empty-sub">
                    Try a different search, or <a href="/jobs/post">post one yourself</a>.
                  </p>
                </div>
              ) : (
                filteredJobs.map(job => (
                  <a key={job.id} href={`/jobs/${job.id}`} className="job-card">
                    <div className="job-card-top">
                      <h2 className="job-title">{job.title}</h2>
                      {job.pay && <span className="job-pay">{job.pay}</span>}
                    </div>
                    {job.location && (
                      <p className="job-location">📍 {job.location}</p>
                    )}
                    {job.description && (
                      <p className="job-desc">{job.description}</p>
                    )}
                    <div className="job-card-footer">
                      <span className="job-apply-hint">View & Apply</span>
                      <span className="job-arrow">→</span>
                    </div>
                  </a>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}