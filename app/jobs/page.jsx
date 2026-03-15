'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Navbar from '../../components/NavBar'
import { MapPin, Search, ArrowRight, Briefcase } from 'lucide-react'

export default function Jobs() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [error, setError] = useState(null)

  useEffect(() => { fetchJobs() }, [])

  const fetchJobs = async () => {
    const { data, error } = await supabase.from('jobs').select('*')
    if (error) setError(error.message)
    else setJobs(data)
    setLoading(false)
  }

  const filteredJobs = jobs.filter(job =>
    job.title?.toLowerCase().includes(search.toLowerCase()) ||
    job.location?.toLowerCase().includes(search.toLowerCase())
  )

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

        /* HEADER */
        .header {
          background: var(--cream); border-bottom: 3px solid var(--black);
          padding: 56px 40px 48px; position: relative; overflow: hidden;
        }
        .header-bg {
          position: absolute; right: -20px; bottom: -30px;
          font-family: 'Unbounded', sans-serif; font-size: 180px; font-weight: 900;
          color: rgba(0,0,0,0.04); white-space: nowrap; pointer-events: none;
          letter-spacing: -.05em; user-select: none;
        }
        .header-inner {
          display: flex; align-items: flex-end; justify-content: space-between;
          gap: 32px; flex-wrap: wrap; margin-bottom: 32px; position: relative; z-index: 1;
        }
        .header-eyebrow {
          font-family: 'Unbounded', sans-serif; font-size: 10px; font-weight: 700;
          letter-spacing: .16em; text-transform: uppercase; color: var(--orange); margin-bottom: 12px;
          display: flex; align-items: center; gap: 6px;
        }
        .header-title {
          font-family: 'Unbounded', sans-serif;
          font-size: clamp(44px, 7vw, 80px); font-weight: 900;
          line-height: 1.0; letter-spacing: -.04em;
        }
        .header-title .box { background: var(--yellow); border: 2px solid var(--black); padding: 0 8px; border-radius: 6px; }
        .header-count {
          font-family: 'Unbounded', sans-serif; font-size: 13px; font-weight: 700;
          color: #aaa; padding-bottom: 8px; white-space: nowrap;
        }
        .header-count strong { color: var(--orange); }

        .search-wrap { position: relative; max-width: 560px; z-index: 1; }
        .search-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: #aaa; pointer-events: none; }
        .search-input {
          width: 100%; background: var(--white);
          border: 2.5px solid var(--black); border-radius: 12px;
          padding: 15px 16px 15px 48px; color: var(--black);
          font-family: 'Nunito', sans-serif; font-size: 15px; font-weight: 700;
          outline: none; box-shadow: var(--shadow);
          transition: box-shadow .12s, transform .12s;
        }
        .search-input::placeholder { color: #bbb; font-weight: 600; }
        .search-input:focus { box-shadow: var(--shadow-lg); transform: translate(-2px,-2px); }

        /* POST BANNER */
        .post-banner {
          margin: 24px 40px; background: var(--black);
          border: 3px solid var(--black); border-radius: 20px;
          padding: 24px 32px; display: flex;
          align-items: center; justify-content: space-between;
          gap: 24px; overflow: hidden; position: relative;
          box-shadow: var(--shadow);
        }
        .post-banner-bg {
          position: absolute; right: 16px; top: 50%; transform: translateY(-50%);
          font-family: 'Unbounded', sans-serif; font-size: 100px; font-weight: 900;
          color: rgba(255,255,255,0.04); pointer-events: none; white-space: nowrap;
          letter-spacing: -.03em; user-select: none;
        }
        .post-banner-text strong { display: block; font-family: 'Unbounded', sans-serif; font-size: 16px; font-weight: 900; color: var(--yellow); margin-bottom: 4px; letter-spacing: -.02em; }
        .post-banner-text span { font-size: 13px; color: rgba(255,255,255,0.5); font-weight: 700; }
        .post-banner-btn {
          background: var(--orange); color: var(--white);
          padding: 12px 24px; border-radius: 10px;
          font-family: 'Nunito', sans-serif; font-size: 14px; font-weight: 800;
          text-decoration: none; white-space: nowrap; flex-shrink: 0;
          border: 2.5px solid var(--white); position: relative; z-index: 1;
          box-shadow: 3px 3px 0 rgba(255,255,255,0.2);
          transition: transform .12s, box-shadow .12s;
        }
        .post-banner-btn:hover { transform: translate(-2px,-2px); box-shadow: 5px 5px 0 rgba(255,255,255,0.2); }

        /* GRID */
        .grid-wrap { padding: 0 40px 80px; }

        .jobs-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 14px; }

        .job-card {
          background: var(--cream); border: 3px solid var(--black);
          border-radius: 20px; padding: 28px 26px;
          text-decoration: none; color: inherit;
          display: flex; flex-direction: column; gap: 12px;
          box-shadow: var(--shadow); position: relative; overflow: hidden;
          transition: transform .12s, box-shadow .12s;
        }
        .job-card:hover { transform: translate(-3px,-3px); box-shadow: var(--shadow-lg); }

        .job-card-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
        .job-title { font-family: 'Unbounded', sans-serif; font-size: 17px; font-weight: 900; letter-spacing: -.03em; line-height: 1.2; }
        .job-pay {
          background: var(--yellow); color: var(--black);
          font-family: 'Unbounded', sans-serif; font-size: 11px; font-weight: 700;
          padding: 5px 12px; border-radius: 100px; white-space: nowrap; flex-shrink: 0;
          border: 2px solid var(--black); box-shadow: 2px 2px 0 var(--black);
        }
        .job-location {
          display: flex; align-items: center; gap: 5px;
          font-size: 12px; font-weight: 800; color: #888; letter-spacing: .04em; text-transform: uppercase;
        }
        .job-desc {
          font-size: 13px; font-weight: 600; color: #777; line-height: 1.65;
          display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; flex: 1;
        }
        .job-footer {
          display: flex; align-items: center; justify-content: space-between;
          margin-top: 4px; padding-top: 14px; border-top: 2px solid rgba(0,0,0,0.08);
        }
        .job-apply-hint { font-size: 12px; font-weight: 800; color: #aaa; letter-spacing: .04em; text-transform: uppercase; }
        .job-arrow {
          width: 32px; height: 32px; border-radius: 8px;
          background: var(--black); border: 2px solid var(--black);
          display: flex; align-items: center; justify-content: center;
          color: var(--yellow); flex-shrink: 0;
          transition: background .12s;
        }
        .job-card:hover .job-arrow { background: var(--orange); border-color: var(--orange); }

        /* EMPTY */
        .empty-state { grid-column: 1/-1; padding: 80px 0; text-align: center; }
        .empty-title { font-family: 'Unbounded', sans-serif; font-size: 24px; font-weight: 900; color: #ccc; margin: 16px 0 10px; letter-spacing: -.03em; }
        .empty-sub { font-size: 14px; color: #bbb; font-weight: 700; }
        .empty-sub a { color: var(--orange); text-decoration: none; }

        /* SKELETONS */
        .skel-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 14px; }
        .skel-card {
          background: var(--cream); border: 3px solid var(--black);
          border-radius: 20px; padding: 28px 26px;
          display: flex; flex-direction: column; gap: 14px;
          box-shadow: var(--shadow);
        }
        .skel-block { background: rgba(0,0,0,0.06); border-radius: 8px; animation: pulse 1.5s ease infinite; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.35} }

        @media (max-width: 768px) {
          .header { padding: 40px 20px 32px; }
          .post-banner { margin: 20px; }
          .grid-wrap { padding: 0 20px 64px; }
          .jobs-grid, .skel-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="page">
        <Navbar />

        <div className="header">
          <div className="header-bg">JOBS</div>
          <div className="header-inner">
            <div>
              <p className="header-eyebrow"><MapPin size={12} strokeWidth={2.5} /> Plymouth, Indiana</p>
              <h1 className="header-title">Browse <span className="box">Jobs</span></h1>
            </div>
            {!loading && (
              <p className="header-count"><strong>{filteredJobs.length}</strong> {filteredJobs.length === 1 ? 'job' : 'jobs'} available</p>
            )}
          </div>
          <div className="search-wrap">
            <span className="search-icon"><Search size={18} strokeWidth={2.5} /></span>
            <input
              className="search-input" type="text"
              placeholder="Search by title or location..."
              value={search} onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="post-banner">
          <div className="post-banner-bg">HIRE</div>
          <div className="post-banner-text">
            <strong>Need to hire a teen?</strong>
            <span>Post your first listing in under 2 minutes.</span>
          </div>
          <a href="/jobs/post" className="post-banner-btn">Post a Job →</a>
        </div>

        <div className="grid-wrap">
          {loading ? (
            <div className="skel-grid">
              {[...Array(6)].map((_,i) => (
                <div key={i} className="skel-card">
                  <div className="skel-block" style={{height:'22px',width:'55%'}} />
                  <div className="skel-block" style={{height:'12px',width:'28%'}} />
                  <div className="skel-block" style={{height:'12px',width:'100%'}} />
                  <div className="skel-block" style={{height:'12px',width:'75%'}} />
                  <div className="skel-block" style={{height:'12px',width:'85%'}} />
                </div>
              ))}
            </div>
          ) : (
            <div className="jobs-grid">
              {filteredJobs.length === 0 ? (
                <div className="empty-state">
                  <Search size={48} color="#ddd" strokeWidth={1.5} />
                  <p className="empty-title">No Jobs Found</p>
                  <p className="empty-sub">Try a different search, or <a href="/jobs/post">post one yourself</a>.</p>
                </div>
              ) : (
                filteredJobs.map(job => (
                  <a key={job.id} href={`/jobs/${job.id}`} className="job-card">
                    <div className="job-card-top">
                      <h2 className="job-title">{job.title}</h2>
                      {job.pay && <span className="job-pay">{job.pay}</span>}
                    </div>
                    {job.location && <p className="job-location"><MapPin size={12} strokeWidth={2.5} />{job.location}</p>}
                    {job.description && <p className="job-desc">{job.description}</p>}
                    <div className="job-footer">
                      <span className="job-apply-hint">View & Apply</span>
                      <span className="job-arrow"><ArrowRight size={16} strokeWidth={2.5} /></span>
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