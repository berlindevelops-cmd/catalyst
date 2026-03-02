'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function Jobs() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [error, setError] = useState(null)
  
  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    const { data, error } = await supabase.from('jobs').select('*');
    if (error) {
        setError(error.message);
    } else {
        setJobs(data);
    }
    setLoading(false);
  }

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(search.toLowerCase()) ||
    job.location.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Epilogue:wght@300;400;500;700;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .jobs-root {
          min-height: 100vh;
          background: #0A0A0A;
          font-family: 'Epilogue', sans-serif;
          color: #F5F2EB;
        }

        /* NAV */
        .jobs-nav {
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
        .jobs-nav-logo {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 26px;
          letter-spacing: .08em;
          color: #FFE033;
          text-decoration: none;
        }
        .jobs-nav-right {
          display: flex;
          align-items: center;
          gap: 24px;
        }
        .jobs-nav-link {
          font-size: 13px;
          color: rgba(245,242,235,0.45);
          text-decoration: none;
          transition: color .2s;
        }
        .jobs-nav-link:hover { color: #F5F2EB; }
        .jobs-nav-cta {
          background: #FFE033;
          color: #0A0A0A;
          padding: 9px 22px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 700;
          text-decoration: none;
          transition: opacity .2s;
        }
        .jobs-nav-cta:hover { opacity: .85; }

        /* HEADER */
        .jobs-header {
          padding: 72px 48px 48px;
          position: relative;
          overflow: hidden;
        }
        .jobs-header::before {
          content: '';
          position: absolute;
          top: -150px; right: -150px;
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(255,224,51,0.07) 0%, transparent 70%);
          pointer-events: none;
        }
        .jobs-header-top {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 32px;
          margin-bottom: 40px;
          flex-wrap: wrap;
        }
        .jobs-header-tag {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .18em;
          text-transform: uppercase;
          color: #FF5C1A;
          margin-bottom: 16px;
        }
        .jobs-header-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(56px, 8vw, 96px);
          line-height: .92;
          letter-spacing: .03em;
        }
        .jobs-header-title span { color: #FFE033; }
        .jobs-count {
          font-size: 13px;
          color: rgba(245,242,235,0.35);
          white-space: nowrap;
          padding-bottom: 12px;
        }
        .jobs-count strong { color: #FFE033; }

        /* SEARCH */
        .search-wrap {
          position: relative;
          max-width: 560px;
        }
        .search-icon {
          position: absolute;
          left: 18px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(245,242,235,0.3);
          font-size: 16px;
          pointer-events: none;
        }
        .search-input {
          width: 100%;
          background: #1A1A1A;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 16px 16px 16px 48px;
          color: #F5F2EB;
          font-family: 'Epilogue', sans-serif;
          font-size: 15px;
          outline: none;
          transition: border-color .2s, box-shadow .2s;
        }
        .search-input::placeholder { color: rgba(245,242,235,0.25); }
        .search-input:focus {
          border-color: #FFE033;
          box-shadow: 0 0 0 3px rgba(255,224,51,0.08);
        }

        /* GRID */
        .jobs-grid-wrap {
          padding: 0 48px 80px;
        }
        .jobs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 2px;
        }

        /* JOB CARD */
        .job-card {
          background: #111;
          padding: 36px 32px;
          cursor: pointer;
          text-decoration: none;
          color: inherit;
          display: flex;
          flex-direction: column;
          gap: 16px;
          transition: background .2s;
          position: relative;
          overflow: hidden;
        }
        .job-card::after {
          content: '→';
          position: absolute;
          bottom: 28px;
          right: 28px;
          font-size: 20px;
          color: rgba(255,224,51,0);
          transition: color .2s, transform .2s;
        }
        .job-card:hover { background: #1A1A1A; }
        .job-card:hover::after {
          color: #FFE033;
          transform: translateX(4px);
        }
        .job-card:first-child { border-radius: 16px 0 0 0; }
        .job-card:nth-child(2) { border-radius: 0 16px 0 0; }

        .job-card-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
        }
        .job-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 26px;
          letter-spacing: .04em;
          line-height: 1.1;
          color: #F5F2EB;
        }
        .job-pay {
          background: rgba(255,224,51,0.12);
          border: 1px solid rgba(255,224,51,0.25);
          color: #FFE033;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: .06em;
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
          font-weight: 500;
          color: rgba(245,242,235,0.35);
          letter-spacing: .04em;
          text-transform: uppercase;
        }
        .job-desc {
          font-size: 13px;
          font-weight: 300;
          color: rgba(245,242,235,0.45);
          line-height: 1.7;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* EMPTY STATE */
        .empty-state {
          grid-column: 1 / -1;
          padding: 80px 0;
          text-align: center;
        }
        .empty-icon { font-size: 48px; margin-bottom: 20px; }
        .empty-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 36px;
          letter-spacing: .04em;
          margin-bottom: 12px;
          color: rgba(245,242,235,0.4);
        }
        .empty-sub {
          font-size: 14px;
          color: rgba(245,242,235,0.25);
        }

        /* LOADING */
        .loading-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 2px;
        }
        .skeleton {
          background: #111;
          padding: 36px 32px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .skel {
          background: rgba(255,255,255,0.06);
          border-radius: 6px;
          animation: shimmer 1.4s ease infinite;
        }
        @keyframes shimmer {
          0%, 100% { opacity: 1; }
          50% { opacity: .4; }
        }

        @media (max-width: 768px) {
          .jobs-nav { padding: 20px 24px; }
          .jobs-header { padding: 48px 24px 32px; }
          .jobs-grid-wrap { padding: 0 24px 64px; }
          .jobs-grid { grid-template-columns: 1fr; }
          .job-card:first-child, .job-card:nth-child(2) { border-radius: 0; }
        }
      `}</style>

      <div className="jobs-root">
        {/* Nav */}
        <nav className="jobs-nav">
          <a href="/" className="jobs-nav-logo">Catalyst</a>
          <div className="jobs-nav-right">
            <a href="/jobs/post" className="jobs-nav-link">Post a Job</a>
            <a href="/auth/signup" className="jobs-nav-cta">Sign Up</a>
          </div>
        </nav>

        {/* Header */}
        <div className="jobs-header">
          <div className="jobs-header-top">
            <div>
              <p className="jobs-header-tag">📍 Plymouth, Indiana</p>
              <h1 className="jobs-header-title">
                Browse<br /><span>Jobs</span>
              </h1>
            </div>
            {!loading && (
              <p className="jobs-count">
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

        {/* Grid */}
        <div className="jobs-grid-wrap">
          {loading ? (
            <div className="loading-grid">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="skeleton">
                  <div className="skel" style={{height: '28px', width: '60%'}} />
                  <div className="skel" style={{height: '14px', width: '30%'}} />
                  <div className="skel" style={{height: '12px', width: '100%'}} />
                  <div className="skel" style={{height: '12px', width: '80%'}} />
                </div>
              ))}
            </div>
          ) : (
            <div className="jobs-grid">
              {filteredJobs.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">🔎</div>
                  <p className="empty-title">No Jobs Found</p>
                  <p className="empty-sub">Try a different search, or <a href="/jobs/post" style={{color: '#FFE033'}}>post one yourself</a>.</p>
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