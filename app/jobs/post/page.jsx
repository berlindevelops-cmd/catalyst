'use client'
import { useState } from 'react'
import { supabase } from '../../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function PostJob() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [pay, setPay] = useState('')
  const [location, setLocation] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const router = useRouter()

  const handlePostJob = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase.from('jobs').insert({
      title, description, pay, location, employer_id: user?.id
    })
    if (error) setError(error.message)
    else router.push('/jobs')
    setLoading(false)
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
          display: flex;
          flex-direction: column;
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
          flex: 1;
          display: grid;
          grid-template-columns: 1fr 500px;
          min-height: calc(100vh - 64px);
        }

        /* ── LEFT ── */
        .left {
          padding: 72px 64px;
          border-right: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .left-glow {
          position: absolute;
          top: -120px; left: -80px;
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(255,224,51,0.08) 0%, transparent 65%);
          pointer-events: none;
        }

        .left-eyebrow {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: .14em;
          text-transform: uppercase;
          color: var(--orange);
          margin-bottom: 16px;
          position: relative;
          z-index: 1;
        }

        .left-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(44px, 5.5vw, 72px);
          font-weight: 800;
          line-height: 1.0;
          letter-spacing: -.03em;
          margin-bottom: 20px;
          position: relative;
          z-index: 1;
        }

        .left-title span { color: var(--yellow); }

        .left-sub {
          font-size: 15px;
          font-weight: 400;
          color: var(--muted);
          max-width: 360px;
          line-height: 1.7;
          margin-bottom: 48px;
          position: relative;
          z-index: 1;
        }

        .tips {
          display: flex;
          flex-direction: column;
          gap: 10px;
          position: relative;
          z-index: 1;
          max-width: 420px;
        }

        .tip {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          background: var(--gray);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 16px 18px;
          transition: border-color .18s;
        }

        .tip:hover { border-color: rgba(255,255,255,0.14); }

        .tip-icon {
          width: 36px; height: 36px;
          border-radius: 10px;
          background: rgba(255,224,51,0.1);
          display: flex; align-items: center; justify-content: center;
          font-size: 16px;
          flex-shrink: 0;
        }

        .tip-text {
          font-size: 13px;
          font-weight: 400;
          color: var(--muted);
          line-height: 1.6;
          padding-top: 2px;
        }

        .tip-text strong { color: #F5F2EB; font-weight: 600; }

        /* ── RIGHT / FORM ── */
        .right {
          background: var(--gray);
          border-left: 1px solid var(--border);
          padding: 56px 48px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .form-eyebrow {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .14em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          margin-bottom: 10px;
        }

        .form-title {
          font-family: 'Syne', sans-serif;
          font-size: 26px;
          font-weight: 800;
          letter-spacing: -.02em;
          margin-bottom: 36px;
        }

        .field {
          margin-bottom: 18px;
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .field label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
        }

        .field input, .field textarea {
          background: var(--black);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 10px;
          padding: 14px 16px;
          color: #F5F2EB;
          font-family: 'Instrument Sans', sans-serif;
          font-size: 14px;
          font-weight: 400;
          outline: none;
          transition: border-color .18s, box-shadow .18s;
          resize: none;
        }

        .field input::placeholder, .field textarea::placeholder {
          color: rgba(245,242,235,0.18);
        }

        .field input:focus, .field textarea:focus {
          border-color: var(--yellow);
          box-shadow: 0 0 0 3px rgba(255,224,51,0.08);
        }

        .field-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          margin-bottom: 18px;
        }

        .field-row .field { margin-bottom: 0; }

        .error-box {
          background: rgba(255,80,60,0.08);
          border: 1px solid rgba(255,80,60,0.25);
          border-radius: 10px;
          padding: 12px 16px;
          font-size: 13px;
          color: #ff7060;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .submit-btn {
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
          transition: opacity .18s, transform .15s;
          margin-top: 8px;
        }

        .submit-btn:hover:not(:disabled) { opacity: .88; transform: translateY(-1px); }
        .submit-btn:active:not(:disabled) { transform: translateY(0); }
        .submit-btn:disabled { opacity: .45; cursor: not-allowed; }

        .spinner {
          display: inline-block;
          width: 15px; height: 15px;
          border: 2px solid rgba(0,0,0,0.25);
          border-top-color: var(--black);
          border-radius: 50%;
          animation: spin .6s linear infinite;
          vertical-align: middle;
          margin-right: 8px;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 900px) {
          .nav { padding: 0 20px; }
          .body { grid-template-columns: 1fr; }
          .left { padding: 56px 24px 40px; border-right: none; border-bottom: 1px solid var(--border); }
          .right { padding: 48px 24px; border-left: none; }
          .field-row { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="root">
        <nav className="nav">
          <a href="/" className="nav-logo">Catalyst<span>.</span></a>
          <a href="/jobs" className="nav-back">← Back to Jobs</a>
        </nav>

        <div className="body">
          {/* ── LEFT ── */}
          <div className="left">
            <div className="left-glow" />
            <p className="left-eyebrow">🏢 For Employers</p>
            <h1 className="left-title">
              Find your<br />
              <span>perfect</span><br />
              teen hire.
            </h1>
            <p className="left-sub">
              Post a job in under 2 minutes. Reach 530+ local Plymouth teens actively looking for flexible work.
            </p>
            <div className="tips">
              <div className="tip">
                <div className="tip-icon">💡</div>
                <p className="tip-text"><strong>Be specific about pay.</strong> Teens apply 3× more when the hourly rate is listed up front.</p>
              </div>
              <div className="tip">
                <div className="tip-icon">📍</div>
                <p className="tip-text"><strong>Include a neighborhood.</strong> Local teens filter by distance first.</p>
              </div>
              <div className="tip">
                <div className="tip-icon">⚡</div>
                <p className="tip-text"><strong>Mention flexibility.</strong> It's the #1 reason teens choose one gig over another.</p>
              </div>
            </div>
          </div>

          {/* ── RIGHT / FORM ── */}
          <div className="right">
            <p className="form-eyebrow">New listing</p>
            <p className="form-title">Job Details</p>

            <form onSubmit={handlePostJob}>
              <div className="field">
                <label>Job Title</label>
                <input
                  type="text"
                  placeholder="e.g. Weekend Babysitter, Lawn Mowing"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="field">
                <label>Description</label>
                <textarea
                  rows={5}
                  placeholder="Describe the job — what needs to be done, when, any requirements..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="field-row">
                <div className="field">
                  <label>Pay</label>
                  <input
                    type="text"
                    placeholder="e.g. $15/hr or $50 flat"
                    value={pay}
                    onChange={e => setPay(e.target.value)}
                    required
                  />
                </div>
                <div className="field">
                  <label>Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Plymouth, IN"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="error-box">
                  <span>⚠️</span> {error}
                </div>
              )}

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading && <span className="spinner" />}
                {loading ? 'Posting…' : 'Post Job →'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}