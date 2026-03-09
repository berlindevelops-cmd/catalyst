'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'
import Navbar from '../../components/NavBar'

export default function Applications() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updatingId, setUpdatingId] = useState(null)
  const [filter, setFilter] = useState('all')
  const router = useRouter()

  useEffect(() => { fetchApplications() }, [])

  const fetchApplications = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth/login'); return }

    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        job:jobs!job_id(id, title, location),
        teen:users!teen_id(id, name, email, bio)
      `)
      .eq('jobs.employer_id', user.id)
      .order('created_at', { ascending: false })

    if (error) setError(error.message)
    else setApplications(data || [])
    setLoading(false)
  }

  const updateStatus = async (appId, status) => {
    setUpdatingId(appId)
    await supabase.from('applications').update({ status }).eq('id', appId)
    await fetchApplications()
    setUpdatingId(null)
  }

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'pending', label: 'Pending' },
    { id: 'accepted', label: 'Accepted' },
    { id: 'rejected', label: 'Rejected' },
  ]

  const filtered = filter === 'all'
    ? applications
    : applications.filter(a => (a.status || 'pending') === filter)

  const countFor = (f) => f === 'all'
    ? applications.length
    : applications.filter(a => (a.status || 'pending') === f).length

  const fmt = (d) => d
    ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : '—'

  const statusInfo = (status) => {
    switch (status) {
      case 'accepted': return { label: 'Accepted', color: '#4ade80', bg: 'rgba(74,222,128,0.1)', border: 'rgba(74,222,128,0.22)' }
      case 'rejected': return { label: 'Rejected', color: '#ff7070', bg: 'rgba(255,100,100,0.1)', border: 'rgba(255,100,100,0.22)' }
      default:         return { label: 'Pending',  color: '#FFE033', bg: 'rgba(255,224,51,0.1)',  border: 'rgba(255,224,51,0.22)' }
    }
  }

  const initials = (name) =>
    name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?'

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

        /* ── HEADER ── */
        .header {
          padding: 56px 40px 40px;
          border-bottom: 1px solid var(--border);
          position: relative;
          overflow: hidden;
        }

        .header-glow {
          position: absolute;
          top: -80px; right: -80px;
          width: 420px; height: 420px;
          background: radial-gradient(circle, rgba(255,92,26,0.1) 0%, transparent 65%);
          pointer-events: none;
        }

        .header-inner {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 32px;
          flex-wrap: wrap;
          margin-bottom: 32px;
        }

        .header-eyebrow {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: .14em;
          text-transform: uppercase;
          color: var(--orange);
          margin-bottom: 12px;
        }

        .header-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(40px, 5.5vw, 64px);
          font-weight: 800;
          letter-spacing: -.03em;
          line-height: 1.0;
          position: relative;
          z-index: 1;
        }

        .header-title span { color: var(--yellow); }

        /* stat chips */
        .stat-row {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          position: relative;
          z-index: 1;
        }

        .stat-chip {
          background: var(--gray);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 14px 20px;
        }

        .stat-num {
          font-family: 'Syne', sans-serif;
          font-size: 24px;
          font-weight: 800;
          letter-spacing: -.02em;
          line-height: 1;
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.25);
        }

        /* ── FILTER TABS ── */
        .filters {
          padding: 0 40px;
          border-bottom: 1px solid var(--border);
          display: flex;
          gap: 2px;
        }

        .filter-btn {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 15px 18px;
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          margin-bottom: -1px;
          color: var(--muted);
          font-family: 'Instrument Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: color .15s, border-color .15s;
          white-space: nowrap;
        }

        .filter-btn:hover { color: #F5F2EB; }

        .filter-btn.active {
          color: #F5F2EB;
          border-bottom-color: var(--yellow);
        }

        .filter-count {
          background: rgba(255,255,255,0.07);
          border-radius: 100px;
          padding: 2px 8px;
          font-size: 11px;
          font-weight: 700;
          color: rgba(245,242,235,0.5);
        }

        .filter-btn.active .filter-count {
          background: rgba(255,224,51,0.12);
          color: var(--yellow);
        }

        /* ── CONTENT ── */
        .content {
          padding: 32px 40px 80px;
          max-width: 1040px;
          margin: 0 auto;
        }

        /* ── APPLICATION CARDS ── */
        .apps-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .app-card {
          background: var(--gray);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 28px 28px;
          display: grid;
          grid-template-columns: auto 1fr auto;
          gap: 20px;
          align-items: center;
          transition: border-color .18s;
        }

        .app-card:hover { border-color: rgba(255,255,255,0.14); }

        /* avatar */
        .app-avatar {
          width: 52px; height: 52px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--yellow), var(--orange));
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Syne', sans-serif;
          font-size: 18px;
          font-weight: 800;
          color: var(--black);
          flex-shrink: 0;
        }

        /* middle info */
        .app-info {}

        .app-info-top {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 6px;
        }

        .app-name {
          font-family: 'Syne', sans-serif;
          font-size: 17px;
          font-weight: 800;
          letter-spacing: -.01em;
          color: #F5F2EB;
        }

        .app-status-pill {
          display: inline-flex;
          align-items: center;
          padding: 3px 10px;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .06em;
          text-transform: uppercase;
          border: 1px solid;
        }

        .app-email {
          font-size: 13px;
          color: rgba(245,242,235,0.35);
          margin-bottom: 8px;
        }

        .app-meta {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .app-meta-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 500;
          color: var(--muted);
        }

        .app-meta-item strong {
          color: #F5F2EB;
          font-weight: 600;
        }

        .app-bio {
          margin-top: 10px;
          font-size: 13px;
          color: rgba(245,242,235,0.4);
          line-height: 1.6;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          max-width: 540px;
        }

        /* right actions */
        .app-actions {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 10px;
          flex-shrink: 0;
        }

        .app-date {
          font-size: 11px;
          font-weight: 500;
          color: rgba(245,242,235,0.22);
          white-space: nowrap;
        }

        .action-btns {
          display: flex;
          gap: 8px;
        }

        .btn-accept {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 9px 16px;
          background: rgba(74,222,128,0.1);
          border: 1px solid rgba(74,222,128,0.22);
          border-radius: 10px;
          color: #4ade80;
          font-family: 'Instrument Sans', sans-serif;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: background .15s, border-color .15s;
          white-space: nowrap;
        }

        .btn-accept:hover {
          background: rgba(74,222,128,0.18);
          border-color: rgba(74,222,128,0.4);
        }

        .btn-reject {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 9px 16px;
          background: rgba(255,100,100,0.08);
          border: 1px solid rgba(255,100,100,0.18);
          border-radius: 10px;
          color: #ff7070;
          font-family: 'Instrument Sans', sans-serif;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: background .15s, border-color .15s;
          white-space: nowrap;
        }

        .btn-reject:hover {
          background: rgba(255,100,100,0.15);
          border-color: rgba(255,100,100,0.35);
        }

        .btn-accept:disabled, .btn-reject:disabled {
          opacity: .35;
          cursor: not-allowed;
        }

        .btn-profile {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 9px 14px;
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--border);
          border-radius: 10px;
          color: var(--muted);
          font-family: 'Instrument Sans', sans-serif;
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
          transition: background .15s, border-color .15s, color .15s;
          white-space: nowrap;
        }

        .btn-profile:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.16);
          color: #F5F2EB;
        }

        /* ── EMPTY ── */
        .empty {
          background: var(--gray);
          border: 1px dashed rgba(255,255,255,0.1);
          border-radius: 20px;
          padding: 80px 24px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .empty-icon { font-size: 44px; }

        .empty-title {
          font-family: 'Syne', sans-serif;
          font-size: 22px;
          font-weight: 800;
          letter-spacing: -.02em;
          color: rgba(245,242,235,0.2);
        }

        .empty-sub {
          font-size: 14px;
          color: rgba(245,242,235,0.15);
          max-width: 260px;
          line-height: 1.6;
        }

        .empty-sub a {
          color: var(--yellow);
          text-decoration: none;
          font-weight: 600;
        }

        /* ── ERROR ── */
        .error-box {
          margin: 24px 40px 0;
          background: rgba(255,80,60,0.08);
          border: 1px solid rgba(255,80,60,0.2);
          border-radius: 14px;
          padding: 14px 18px;
          font-size: 14px;
          color: #ff7060;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        /* ── SPINNER ── */
        .spinner-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 50vh;
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
          .header { padding: 40px 20px 32px; }
          .filters { padding: 0 20px; overflow-x: auto; }
          .content { padding: 24px 20px 64px; }
          .app-card {
            grid-template-columns: auto 1fr;
            grid-template-rows: auto auto;
          }
          .app-actions {
            grid-column: 1 / -1;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
          }
          .action-btns { flex-wrap: wrap; }
        }
      `}</style>

      <div className="root">
        <Navbar />

        {/* ── HEADER ── */}
        <div className="header">
          <div className="header-glow" />
          <div className="header-inner">
            <div>
              <p className="header-eyebrow">🏢 Employer View</p>
              <h1 className="header-title">
                Job <span>Applications</span>
              </h1>
            </div>
          </div>

          {!loading && (
            <div className="stat-row">
              <div className="stat-chip">
                <div className="stat-num" style={{color:'var(--yellow)'}}>{applications.length}</div>
                <div className="stat-label">Total</div>
              </div>
              <div className="stat-chip">
                <div className="stat-num" style={{color:'#FFE033'}}>{countFor('pending')}</div>
                <div className="stat-label">Pending</div>
              </div>
              <div className="stat-chip">
                <div className="stat-num" style={{color:'#4ade80'}}>{countFor('accepted')}</div>
                <div className="stat-label">Accepted</div>
              </div>
              <div className="stat-chip">
                <div className="stat-num" style={{color:'#ff7070'}}>{countFor('rejected')}</div>
                <div className="stat-label">Rejected</div>
              </div>
            </div>
          )}
        </div>

        {error && <div className="error-box">⚠️ {error}</div>}

        {/* ── FILTER TABS ── */}
        <div className="filters">
          {filters.map(f => (
            <button
              key={f.id}
              className={`filter-btn ${filter === f.id ? 'active' : ''}`}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
              {!loading && <span className="filter-count">{countFor(f.id)}</span>}
            </button>
          ))}
        </div>

        {/* ── CONTENT ── */}
        {loading ? (
          <div className="spinner-wrap"><div className="spinner" /></div>
        ) : (
          <div className="content">
            {filtered.length === 0 ? (
              <div className="empty">
                <div className="empty-icon">📭</div>
                <p className="empty-title">
                  {filter === 'all' ? 'No applications yet' : `No ${filter} applications`}
                </p>
                <p className="empty-sub">
                  {filter === 'all'
                    ? <><a href="/jobs/post">Post a job →</a> to start getting applicants.</>
                    : 'Try a different filter above.'}
                </p>
              </div>
            ) : (
              <div className="apps-list">
                {filtered.map(app => {
                  const s = statusInfo(app.status)
                  const busy = updatingId === app.id
                  return (
                    <div key={app.id} className="app-card">
                      {/* Avatar */}
                      <div className="app-avatar">{initials(app.teen?.name)}</div>

                      {/* Info */}
                      <div className="app-info">
                        <div className="app-info-top">
                          <span className="app-name">{app.teen?.name || 'Unknown'}</span>
                          <span
                            className="app-status-pill"
                            style={{ color: s.color, background: s.bg, borderColor: s.border }}
                          >
                            {s.label}
                          </span>
                        </div>
                        <p className="app-email">{app.teen?.email}</p>
                        <div className="app-meta">
                          {app.job?.title && (
                            <span className="app-meta-item">
                              💼 <strong>{app.job.title}</strong>
                            </span>
                          )}
                          {app.job?.location && (
                            <span className="app-meta-item">
                              📍 {app.job.location}
                            </span>
                          )}
                        </div>
                        {app.teen?.bio && (
                          <p className="app-bio">{app.teen.bio}</p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="app-actions">
                        <span className="app-date">Applied {fmt(app.created_at)}</span>
                        <div className="action-btns">
                          <a
                            href={`/users/${app.teen?.id}`}
                            className="btn-profile"
                          >
                            👤 Profile
                          </a>
                          <button
                            className="btn-accept"
                            onClick={() => updateStatus(app.id, 'accepted')}
                            disabled={busy || app.status === 'accepted'}
                          >
                            {busy && app.status !== 'accepted' ? '…' : '✓ Accept'}
                          </button>
                          <button
                            className="btn-reject"
                            onClick={() => updateStatus(app.id, 'rejected')}
                            disabled={busy || app.status === 'rejected'}
                          >
                            {busy && app.status !== 'rejected' ? '…' : '✕ Reject'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}