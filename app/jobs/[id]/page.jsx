'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '../../../lib/supabase'
import { useRouter } from 'next/navigation'
import Navbar from '../../../components/NavBar'
import { MapPin, DollarSign, ClipboardList, Check, Link2, AlertCircle, ArrowLeft } from 'lucide-react'

export default function JobDetail() {
  const { id } = useParams()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [applied, setApplied] = useState(false)
  const [copied, setCopied] = useState(false)
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
    if (!user) { window.location.href = '/auth/login'; return }

    const { error } = await supabase.from('applications').insert({ job_id: id, teen_id: user.id })
    if (error) { setError(error.message); return }

    const { data: teenProfile } = await supabase.from('users').select('name').eq('id', user.id).single()
    const { data: jobData } = await supabase.from('jobs').select('title, employer_id').eq('id', id).single()
    const { data: employer } = await supabase.from('users').select('email').eq('id', jobData.employer_id).single()

    await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: employer.email,
        subject: `New application for ${jobData.title}`,
        html: `<p>${teenProfile.name} applied to your job <strong>${jobData.title}</strong>.</p><p><a href="https://catalyst-jet.vercel.app/profile/${user.id}">View their profile</a></p>`
      })
    })

    await supabase.from('messages').insert({
      sender_id: user.id,
      receiver_id: jobData.employer_id,
      content: `Hi! I just applied to your job "${jobData.title}". Here's my profile: https://catalyst-jet.vercel.app/profile/${user.id}`
    })

    setApplied(true)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

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

        .back-link {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 13px; font-weight: 800; color: var(--black);
          text-decoration: none; margin: 24px 40px 0;
          border-bottom: 2px solid var(--black); padding-bottom: 2px;
          transition: color .15s, border-color .15s;
        }
        .back-link:hover { color: var(--orange); border-color: var(--orange); }

        .body {
          max-width: 1100px; margin: 0 auto;
          padding: 48px 40px 100px;
          display: grid; grid-template-columns: 1fr 320px;
          gap: 40px; align-items: start;
        }

        /* MAIN */
        .main-eyebrow {
          font-family: 'Unbounded', sans-serif; font-size: 10px; font-weight: 700;
          letter-spacing: .16em; text-transform: uppercase; color: var(--orange);
          margin-bottom: 14px; display: flex; align-items: center; gap: 6px;
        }
        .main-title {
          font-family: 'Unbounded', sans-serif;
          font-size: clamp(36px, 6vw, 64px); font-weight: 900;
          line-height: 1.0; letter-spacing: -.04em; margin-bottom: 28px;
        }
        .meta-row { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 40px; }
        .meta-chip {
          display: flex; align-items: center; gap: 7px;
          padding: 9px 16px; border-radius: 100px;
          font-size: 13px; font-weight: 800;
          border: 2.5px solid var(--black); box-shadow: 2px 2px 0 var(--black);
        }
        .meta-chip.pay { background: var(--yellow); color: var(--black); }
        .meta-chip.loc { background: var(--white); color: #666; }

        .divider { height: 3px; background: rgba(0,0,0,0.08); border-radius: 2px; margin-bottom: 32px; }

        .section-label {
          font-family: 'Unbounded', sans-serif; font-size: 10px; font-weight: 700;
          letter-spacing: .16em; text-transform: uppercase; color: #aaa; margin-bottom: 20px;
        }
        .job-desc {
          font-size: 16px; font-weight: 600; color: #555; line-height: 1.85; white-space: pre-wrap;
        }

        /* SIDEBAR */
        .sidebar { position: sticky; top: 84px; display: flex; flex-direction: column; gap: 14px; }

        .sidebar-card {
          background: var(--cream); border: 3px solid var(--black);
          border-radius: 20px; padding: 28px 24px; box-shadow: var(--shadow);
        }
        .sidebar-title {
          font-family: 'Unbounded', sans-serif; font-size: 18px; font-weight: 900;
          letter-spacing: -.03em; margin-bottom: 8px;
        }
        .sidebar-sub { font-size: 13px; font-weight: 700; color: #888; line-height: 1.6; margin-bottom: 24px; }

        .apply-btn {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          width: 100%; padding: 16px; background: var(--orange); color: var(--white);
          border: 2.5px solid var(--black); border-radius: 12px;
          font-family: 'Nunito', sans-serif; font-size: 15px; font-weight: 800;
          cursor: pointer; box-shadow: var(--shadow);
          transition: transform .12s, box-shadow .12s, background .12s;
          text-align: center; text-decoration: none;
        }
        .apply-btn:hover:not(:disabled) { transform: translate(-2px,-2px); box-shadow: var(--shadow-lg); }
        .apply-btn:active:not(:disabled) { transform: translate(2px,2px); box-shadow: none; }
        .apply-btn:disabled { background: #4ade80; border-color: #16a34a; color: #052e16; cursor: default; box-shadow: none; }

        .copy-btn {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          width: 100%; padding: 12px; background: transparent; color: #888;
          border: 2.5px solid #ddd; border-radius: 10px;
          font-family: 'Nunito', sans-serif; font-size: 13px; font-weight: 800;
          cursor: pointer; margin-top: 10px;
          transition: border-color .15s, color .15s;
        }
        .copy-btn:hover { border-color: var(--black); color: var(--black); }

        .info-row { display: flex; flex-direction: column; gap: 18px; }
        .info-item-label {
          font-family: 'Unbounded', sans-serif; font-size: 9px; font-weight: 700;
          letter-spacing: .14em; text-transform: uppercase; color: #aaa; margin-bottom: 5px;
        }
        .info-item-val { font-size: 18px; font-weight: 900; font-family: 'Unbounded', sans-serif; color: var(--orange); letter-spacing: -.02em; }
        .info-item-val.loc { color: #555; font-size: 15px; font-family: 'Nunito', sans-serif; font-weight: 800; }

        /* states */
        .spinner-wrap { display: flex; align-items: center; justify-content: center; min-height: 60vh; }
        .spinner { width: 36px; height: 36px; border: 3px solid rgba(0,0,0,0.08); border-top-color: var(--orange); border-radius: 50%; animation: spin .7s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .center { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; gap: 14px; text-align: center; padding: 40px; }
        .center-title { font-family: 'Unbounded', sans-serif; font-size: 24px; font-weight: 900; color: #ccc; letter-spacing: -.03em; }
        .center-sub { font-size: 14px; color: #bbb; font-weight: 700; }
        .center-sub a { color: var(--orange); text-decoration: none; }

        @media (max-width: 860px) {
          .back-link { margin: 20px 20px 0; }
          .body { grid-template-columns: 1fr; padding: 32px 20px 80px; gap: 32px; }
          .sidebar { position: static; }
        }
      `}</style>

      <div className="page">
        <Navbar />
        <a href="/jobs" className="back-link"><ArrowLeft size={14} strokeWidth={2.5} /> All Jobs</a>

        {loading ? (
          <div className="spinner-wrap"><div className="spinner" /></div>
        ) : error ? (
          <div className="center">
            <AlertCircle size={48} color="#ddd" strokeWidth={1.5} />
            <p className="center-title">Something went wrong</p>
            <p className="center-sub">{error}</p>
            <p className="center-sub"><a href="/jobs">← Back to jobs</a></p>
          </div>
        ) : !job ? (
          <div className="center">
            <ClipboardList size={48} color="#ddd" strokeWidth={1.5} />
            <p className="center-title">Job Not Found</p>
            <p className="center-sub"><a href="/jobs">← Browse all jobs</a></p>
          </div>
        ) : (
          <div className="body">
            <div>
              <p className="main-eyebrow"><ClipboardList size={12} strokeWidth={2.5} /> Job Listing</p>
              <h1 className="main-title">{job.title}</h1>
              <div className="meta-row">
                {job.pay && <span className="meta-chip pay"><DollarSign size={14} strokeWidth={2.5} />{job.pay}</span>}
                {job.location && <span className="meta-chip loc"><MapPin size={14} strokeWidth={2.5} />{job.location}</span>}
              </div>
              <div className="divider" />
              <p className="section-label">About This Job</p>
              <p className="job-desc">{job.description}</p>
            </div>

            <div className="sidebar">
              <div className="sidebar-card">
                <p className="sidebar-title">Interested?</p>
                <p className="sidebar-sub">Apply now and the employer will reach out to you directly with next steps.</p>
                <button className="apply-btn" onClick={handleApply} disabled={applied}>
                  {applied ? <><Check size={16} strokeWidth={2.5} /> Applied!</> : 'Apply Now →'}
                </button>
                <button className="copy-btn" onClick={handleCopy}>
                  <Link2 size={14} strokeWidth={2.5} />
                  {copied ? 'Copied!' : 'Copy Link'}
                </button>
              </div>

              {(job.pay || job.location) && (
                <div className="sidebar-card">
                  <p className="section-label" style={{marginBottom:'20px'}}>Quick Info</p>
                  <div className="info-row">
                    {job.pay && <div><p className="info-item-label">Pay</p><p className="info-item-val">{job.pay}</p></div>}
                    {job.location && <div><p className="info-item-label">Location</p><p className="info-item-val loc">{job.location}</p></div>}
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