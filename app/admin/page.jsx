'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'
import Navbar from '../../components/Navbar'

export default function Admin() {
  const [users, setUsers] = useState([])
  const [jobs, setJobs] = useState([])
  const [applications, setApplications] = useState([])
  const [activeTab, setActiveTab] = useState('users')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const router = useRouter()

  useEffect(() => {
    fetchAll()
  }, [])

  const fetchAll = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        router.push('/auth/login')
        return
    }

    const { data, error } = await supabase.from('users').select('*').eq('id', user.id).single();
    if (error) {
        setError(error.message);
    } else {
      if (!data.is_admin) {
        router.push('/jobs')
        return
      }

      const { data: allUsers } = await supabase.from('users').select('*')
      setUsers(allUsers)

      const { data: allJobs } = await supabase.from('jobs').select('*')
      setJobs(allJobs)

      const { data: allApplications } = await supabase.from('applications').select('*')
      setApplications(allApplications)
    }
    setLoading(false);
  }

  const deleteJob = async (jobId) => {
    await supabase.from('jobs').delete().eq('id', jobId)
    const { data } = await supabase.from('jobs').select('*')
    setJobs(data)
  }

  const deleteUser = async (userId) => {
    await supabase.from('users').delete().eq('id', userId)
    const { data } = await supabase.from('users').select('*')
    setUsers(data)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=Syne:wght@700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --yellow: #FFE033;
          --orange: #FF5C1A;
          --red: #ff4444;
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
          top: -100px; right: -100px;
          width: 450px; height: 450px;
          background: radial-gradient(circle, rgba(255,92,26,0.1) 0%, transparent 65%);
          pointer-events: none;
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
          font-size: clamp(36px, 5vw, 60px);
          font-weight: 800;
          letter-spacing: -.03em;
          line-height: 1.0;
          margin-bottom: 32px;
          position: relative;
          z-index: 1;
        }

        .header-title span { color: var(--yellow); }

        /* stat row */
        .stat-row {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          position: relative;
          z-index: 1;
        }

        .stat-chip {
          background: var(--gray);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 16px 22px;
          min-width: 130px;
        }

        .stat-num {
          font-family: 'Syne', sans-serif;
          font-size: 28px;
          font-weight: 800;
          color: var(--yellow);
          letter-spacing: -.02em;
          line-height: 1;
          margin-bottom: 5px;
        }

        .stat-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.25);
        }

        /* ── TABS ── */
        .tabs-wrap {
          padding: 0 40px;
          border-bottom: 1px solid var(--border);
          display: flex;
          gap: 4px;
        }

        .tab-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 16px 20px;
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

        .tab-btn:hover { color: #F5F2EB; }

        .tab-btn.active {
          color: #F5F2EB;
          border-bottom-color: var(--yellow);
        }

        .tab-count {
          background: rgba(255,255,255,0.07);
          border-radius: 100px;
          padding: 2px 8px;
          font-size: 11px;
          font-weight: 700;
        }

        .tab-btn.active .tab-count {
          background: rgba(255,224,51,0.12);
          color: var(--yellow);
        }

        /* ── TABLE AREA ── */
        .table-wrap {
          padding: 32px 40px 80px;
        }

        .table-container {
          background: var(--gray);
          border: 1px solid var(--border);
          border-radius: 20px;
          overflow: hidden;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        thead tr {
          border-bottom: 1px solid var(--border);
        }

        th {
          padding: 14px 20px;
          text-align: left;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: .12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.25);
        }

        tbody tr {
          border-bottom: 1px solid var(--border);
          transition: background .15s;
        }

        tbody tr:last-child { border-bottom: none; }
        tbody tr:hover { background: rgba(255,255,255,0.02); }

        td {
          padding: 16px 20px;
          font-size: 14px;
          font-weight: 400;
          color: rgba(245,242,235,0.75);
          vertical-align: middle;
        }

        .td-name {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .td-avatar {
          width: 34px; height: 34px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--yellow), var(--orange));
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Syne', sans-serif;
          font-size: 12px;
          font-weight: 800;
          color: var(--black);
          flex-shrink: 0;
        }

        .td-bold {
          font-weight: 600;
          color: #F5F2EB;
        }

        .td-muted {
          font-size: 12px;
          color: rgba(245,242,235,0.3);
          margin-top: 2px;
        }

        .role-pill {
          display: inline-flex;
          align-items: center;
          padding: 3px 10px;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .06em;
          text-transform: uppercase;
        }

        .role-pill.teen {
          background: rgba(255,224,51,0.1);
          border: 1px solid rgba(255,224,51,0.2);
          color: var(--yellow);
        }

        .role-pill.employer {
          background: rgba(255,92,26,0.1);
          border: 1px solid rgba(255,92,26,0.2);
          color: var(--orange);
        }

        .role-pill.admin {
          background: rgba(150,100,255,0.1);
          border: 1px solid rgba(150,100,255,0.2);
          color: #b494ff;
        }

        .pay-pill {
          display: inline-flex;
          align-items: center;
          padding: 3px 10px;
          border-radius: 100px;
          font-size: 12px;
          font-weight: 700;
          background: rgba(255,224,51,0.08);
          border: 1px solid rgba(255,224,51,0.18);
          color: var(--yellow);
        }

        .delete-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          background: rgba(255,68,68,0.08);
          border: 1px solid rgba(255,68,68,0.18);
          border-radius: 8px;
          color: #ff7070;
          font-family: 'Instrument Sans', sans-serif;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: background .15s, border-color .15s, color .15s;
          white-space: nowrap;
        }

        .delete-btn:hover {
          background: rgba(255,68,68,0.15);
          border-color: rgba(255,68,68,0.35);
          color: #ff5555;
        }

        .delete-btn:disabled {
          opacity: .4;
          cursor: not-allowed;
        }

        /* empty state */
        .table-empty {
          padding: 64px 24px;
          text-align: center;
          color: rgba(245,242,235,0.2);
        }

        .table-empty-icon { font-size: 36px; margin-bottom: 12px; }

        .table-empty-text {
          font-size: 14px;
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          letter-spacing: -.01em;
        }

        /* ── SPINNER ── */
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

        /* error */
        .error-box {
          margin: 32px 40px;
          background: rgba(255,68,68,0.08);
          border: 1px solid rgba(255,68,68,0.2);
          border-radius: 14px;
          padding: 16px 20px;
          font-size: 14px;
          color: #ff7070;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        @media (max-width: 768px) {
          .nav { padding: 0 20px; }
          .header { padding: 40px 20px 32px; }
          .tabs-wrap { padding: 0 20px; overflow-x: auto; }
          .table-wrap { padding: 20px 20px 64px; }
          .stat-row { gap: 8px; }
          th, td { padding: 12px 14px; }
        }
      `}</style>

      <div className="root">
        {/* ── NAV ── */}
        <Navbar />

        {loading ? (
          <div className="spinner-wrap"><div className="spinner" /></div>
        ) : error ? (
          <div className="error-box">⚠️ {error}</div>
        ) : (
          <>
            {/* ── HEADER ── */}
            <div className="header">
              <div className="header-glow" />
              <p className="header-eyebrow">🔐 Admin Dashboard</p>
              <h1 className="header-title">Platform <span>Overview</span></h1>
              <div className="stat-row">
                <div className="stat-chip">
                  <div className="stat-num">{users.length}</div>
                  <div className="stat-label">Total Users</div>
                </div>
                <div className="stat-chip">
                  <div className="stat-num">{jobs.length}</div>
                  <div className="stat-label">Active Jobs</div>
                </div>
                <div className="stat-chip">
                  <div className="stat-num">{applications.length}</div>
                  <div className="stat-label">Applications</div>
                </div>
                <div className="stat-chip">
                  <div className="stat-num">{users.filter(u => u.role === 'teen').length}</div>
                  <div className="stat-label">Teens</div>
                </div>
                <div className="stat-chip">
                  <div className="stat-num">{users.filter(u => u.role === 'employer').length}</div>
                  <div className="stat-label">Employers</div>
                </div>
              </div>
            </div>

            {/* ── TABS ── */}
            <div className="tabs-wrap">
              {tabs.map(t => (
                <button
                  key={t.id}
                  className={`tab-btn ${activeTab === t.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(t.id)}
                >
                  {t.icon} {t.label}
                  <span className="tab-count">{t.count}</span>
                </button>
              ))}
            </div>

            {/* ── TABLE ── */}
            <div className="table-wrap">

              {/* USERS */}
              {activeTab === 'users' && (
                <div className="table-container">
                  {users.length === 0 ? (
                    <div className="table-empty">
                      <div className="table-empty-icon">👥</div>
                      <p className="table-empty-text">No users yet</p>
                    </div>
                  ) : (
                    <table>
                      <thead>
                        <tr>
                          <th>User</th>
                          <th>Role</th>
                          <th>Location</th>
                          <th>Joined</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map(u => {
                          const initials = u.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?'
                          return (
                            <tr key={u.id}>
                              <td>
                                <div className="td-name">
                                  <div className="td-avatar">{initials}</div>
                                  <div>
                                    <div className="td-bold">{u.name || '—'}</div>
                                    <div className="td-muted">{u.email}</div>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <span className={`role-pill ${u.is_admin ? 'admin' : u.role}`}>
                                  {u.is_admin ? '⚡ Admin' : u.role === 'teen' ? '👋 Teen' : '🏢 Employer'}
                                </span>
                              </td>
                              <td>{u.location || <span style={{color:'rgba(245,242,235,0.2)'}}>—</span>}</td>
                              <td style={{fontSize:'13px'}}>{fmt(u.created_at)}</td>
                              <td>
                                {!u.is_admin && (
                                  <button
                                    className="delete-btn"
                                    onClick={() => deleteUser(u.id)}
                                    disabled={deletingId === u.id}
                                  >
                                    {deletingId === u.id ? '…' : '🗑 Delete'}
                                  </button>
                                )}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              {/* JOBS */}
              {activeTab === 'jobs' && (
                <div className="table-container">
                  {jobs.length === 0 ? (
                    <div className="table-empty">
                      <div className="table-empty-icon">💼</div>
                      <p className="table-empty-text">No jobs posted yet</p>
                    </div>
                  ) : (
                    <table>
                      <thead>
                        <tr>
                          <th>Job Title</th>
                          <th>Pay</th>
                          <th>Location</th>
                          <th>Posted</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {jobs.map(j => (
                          <tr key={j.id}>
                            <td>
                              <div className="td-bold">{j.title}</div>
                              {j.description && (
                                <div className="td-muted" style={{maxWidth:'280px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>
                                  {j.description}
                                </div>
                              )}
                            </td>
                            <td>
                              {j.pay
                                ? <span className="pay-pill">{j.pay}</span>
                                : <span style={{color:'rgba(245,242,235,0.2)'}}>—</span>
                              }
                            </td>
                            <td>{j.location || <span style={{color:'rgba(245,242,235,0.2)'}}>—</span>}</td>
                            <td style={{fontSize:'13px'}}>{fmt(j.created_at)}</td>
                            <td>
                              <button
                                className="delete-btn"
                                onClick={() => deleteJob(j.id)}
                                disabled={deletingId === j.id}
                              >
                                {deletingId === j.id ? '…' : '🗑 Delete'}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              {/* APPLICATIONS */}
              {activeTab === 'applications' && (
                <div className="table-container">
                  {applications.length === 0 ? (
                    <div className="table-empty">
                      <div className="table-empty-icon">📋</div>
                      <p className="table-empty-text">No applications yet</p>
                    </div>
                  ) : (
                    <table>
                      <thead>
                        <tr>
                          <th>Applicant</th>
                          <th>Job</th>
                          <th>Applied</th>
                        </tr>
                      </thead>
                      <tbody>
                        {applications.map(a => {
                          const initials = a.teen?.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?'
                          return (
                            <tr key={a.id}>
                              <td>
                                <div className="td-name">
                                  <div className="td-avatar" style={{background:'var(--gray2)', color:'var(--muted)', border:'1px solid var(--border)'}}>
                                    {initials}
                                  </div>
                                  <span className="td-bold">{a.teen?.name || 'Unknown'}</span>
                                </div>
                              </td>
                              <td>{a.job?.title || <span style={{color:'rgba(245,242,235,0.2)'}}>Deleted job</span>}</td>
                              <td style={{fontSize:'13px'}}>{fmt(a.created_at)}</td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

            </div>
          </>
        )}
      </div>
    </>
  )
}