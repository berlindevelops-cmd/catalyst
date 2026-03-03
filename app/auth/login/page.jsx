'use client'

import { useState } from 'react'
import { supabase } from '../../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { data, err } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });

    if (err) {
        setError(err.message);
    } else {
        router.push('/jobs')
    }
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
          --border: rgba(255,255,255,0.08);
        }

        body {
          background: var(--black);
          font-family: 'Instrument Sans', sans-serif;
          color: #fff;
        }

        .root {
          min-height: 100vh;
          display: flex;
          align-items: stretch;
          overflow: hidden;
        }

        /* ── LEFT PANEL ── */
        .left {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 48px 64px;
          position: relative;
          overflow: hidden;
          background: var(--black);
        }

        .left-glow-top {
          position: absolute;
          top: -80px; right: -80px;
          width: 480px; height: 480px;
          background: radial-gradient(circle, rgba(255,224,51,0.1) 0%, transparent 65%);
          pointer-events: none;
        }

        .left-glow-bottom {
          position: absolute;
          bottom: -80px; left: -40px;
          width: 380px; height: 380px;
          background: radial-gradient(circle, rgba(255,92,26,0.08) 0%, transparent 65%);
          pointer-events: none;
        }

        .left-logo {
          font-family: 'Syne', sans-serif;
          font-size: 22px;
          font-weight: 800;
          color: #fff;
          text-decoration: none;
          letter-spacing: -.01em;
          position: relative;
          z-index: 1;
        }

        .left-logo span { color: var(--yellow); }

        .left-body {
          position: relative;
          z-index: 1;
        }

        .left-eyebrow {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: .14em;
          text-transform: uppercase;
          color: var(--orange);
          margin-bottom: 20px;
        }

        .left-headline {
          font-family: 'Syne', sans-serif;
          font-size: clamp(42px, 5vw, 68px);
          font-weight: 800;
          line-height: 1.0;
          letter-spacing: -.03em;
          margin-bottom: 20px;
        }

        .left-headline .yellow { color: var(--yellow); }

        .left-sub {
          font-size: 15px;
          font-weight: 400;
          color: rgba(255,255,255,0.4);
          max-width: 340px;
          line-height: 1.7;
          margin-bottom: 48px;
        }

        /* stat row */
        .stat-row {
          display: flex;
          gap: 0;
          border: 1px solid var(--border);
          border-radius: 16px;
          overflow: hidden;
          max-width: 380px;
        }

        .stat-box {
          flex: 1;
          padding: 20px 20px;
          background: rgba(255,255,255,0.03);
          border-right: 1px solid var(--border);
          text-align: center;
        }

        .stat-box:last-child { border-right: none; }

        .stat-num {
          font-family: 'Syne', sans-serif;
          font-size: 26px;
          font-weight: 800;
          color: var(--yellow);
          letter-spacing: -.02em;
          line-height: 1;
        }

        .stat-label {
          font-size: 11px;
          font-weight: 500;
          color: rgba(255,255,255,0.3);
          margin-top: 5px;
          letter-spacing: .04em;
          text-transform: uppercase;
        }

        .left-footer {
          font-size: 12px;
          color: rgba(255,255,255,0.18);
          letter-spacing: .06em;
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .left-footer::before {
          content: '';
          display: block;
          width: 32px; height: 1px;
          background: rgba(255,255,255,0.15);
        }

        /* ── RIGHT PANEL ── */
        .right {
          width: 500px;
          min-height: 100vh;
          background: var(--gray);
          border-left: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 64px 52px;
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
          margin-bottom: 8px;
        }

        .form-sub {
          font-size: 14px;
          color: rgba(255,255,255,0.35);
          margin-bottom: 36px;
          line-height: 1.5;
        }

        .field {
          margin-bottom: 16px;
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

        .field input {
          background: var(--black);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 10px;
          padding: 14px 16px;
          color: #fff;
          font-family: 'Instrument Sans', sans-serif;
          font-size: 14px;
          font-weight: 400;
          outline: none;
          transition: border-color .18s, box-shadow .18s;
        }

        .field input::placeholder { color: rgba(255,255,255,0.18); }

        .field input:focus {
          border-color: var(--yellow);
          box-shadow: 0 0 0 3px rgba(255,224,51,0.08);
        }

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
          margin-top: 8px;
          background: var(--yellow);
          color: #0d0d0d;
          border: none;
          border-radius: 12px;
          font-family: 'Syne', sans-serif;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
          letter-spacing: -.01em;
          transition: opacity .18s, transform .15s;
        }

        .submit-btn:hover:not(:disabled) { opacity: .88; transform: translateY(-1px); }
        .submit-btn:active:not(:disabled) { transform: translateY(0); }
        .submit-btn:disabled { opacity: .45; cursor: not-allowed; }

        .spinner {
          display: inline-block;
          width: 15px; height: 15px;
          border: 2px solid rgba(0,0,0,0.25);
          border-top-color: #0d0d0d;
          border-radius: 50%;
          animation: spin .6s linear infinite;
          vertical-align: middle;
          margin-right: 8px;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 24px 0;
          color: rgba(255,255,255,0.15);
          font-size: 12px;
        }

        .divider::before, .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.08);
        }

        .signup-link {
          text-align: center;
          font-size: 13px;
          color: rgba(255,255,255,0.3);
        }

        .signup-link a {
          color: var(--yellow);
          text-decoration: none;
          font-weight: 600;
        }

        .signup-link a:hover { text-decoration: underline; }

        @media (max-width: 860px) {
          .left { display: none; }
          .right { width: 100%; border-left: none; padding: 48px 28px; }
        }
      `}</style>

      <div className="root">
        {/* ── LEFT PANEL ── */}
        <div className="left">
          <div className="left-glow-top" />
          <div className="left-glow-bottom" />

          <a href="/" className="left-logo">Catalyst<span>.</span></a>

          <div className="left-body">
            <p className="left-eyebrow">👋 Welcome back</p>
            <h1 className="left-headline">
              Good to see<br />
              you <span className="yellow">again.</span>
            </h1>
            <p className="left-sub">
              Sign in to find your next opportunity or manage your posted jobs.
            </p>

            <div className="stat-row">
              <div className="stat-box">
                <div className="stat-num">530+</div>
                <div className="stat-label">Teens</div>
              </div>
              <div className="stat-box">
                <div className="stat-num">$20</div>
                <div className="stat-label">Avg/hr</div>
              </div>
              <div className="stat-box">
                <div className="stat-num">Free</div>
                <div className="stat-label">Always</div>
              </div>
            </div>
          </div>

          <div className="left-footer">EST. 2026 · CATALYST · PLYMOUTH, IN</div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="right">
          <p className="form-eyebrow">Welcome back</p>
          <p className="form-title">Sign in</p>
          <p className="form-sub">Enter your email and password to continue.</p>

          <form onSubmit={handleLogin}>
            <div className="field">
              <label>Email</label>
              <input
                type="email"
                placeholder="jane@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label>Password</label>
              <input
                type="password"
                placeholder="Your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="error-box">
                <span>⚠️</span> {error}
              </div>
            )}

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading && <span className="spinner" />}
              {loading ? 'Signing in…' : 'Sign In →'}
            </button>
          </form>

          <div className="divider">new to catalyst?</div>

          <p className="signup-link">
            <a href="/auth/signup">Create a free account →</a>
          </p>
        </div>
      </div>
    </>
  )
}