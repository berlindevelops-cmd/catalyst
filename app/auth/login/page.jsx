'use client'

import { useState } from 'react'
import { supabase } from '../../../lib/supabase'
import { useRouter } from 'next/navigation'
import { MapPin, AlertCircle, ArrowRight, Loader } from 'lucide-react'

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
    const { data, error: err } = await supabase.auth.signInWithPassword({ email, password })
    if (err) setError(err.message)
    else router.push('/jobs')
    setLoading(false)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@400;700;900&family=Nunito:wght@400;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --orange: #FF5C1A;
          --yellow: #FFE033;
          --black: #111111;
          --white: #FEFCF7;
          --cream: #FFF6E8;
          --shadow: 4px 4px 0px #111111;
          --shadow-lg: 6px 6px 0px #111111;
        }

        body {
          background: var(--white);
          font-family: 'Nunito', sans-serif;
          color: var(--black);
          min-height: 100vh;
        }

        .root {
          min-height: 100vh;
          display: flex;
        }

        /* ── LEFT PANEL ── */
        .left {
          flex: 1;
          background: var(--orange);
          border-right: 3px solid var(--black);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 48px 56px;
          position: relative;
          overflow: hidden;
        }

        .left-bg {
          position: absolute;
          bottom: -40px;
          right: -40px;
          font-family: 'Unbounded', sans-serif;
          font-size: 220px;
          font-weight: 900;
          color: rgba(0,0,0,0.07);
          white-space: nowrap;
          pointer-events: none;
          letter-spacing: -.05em;
          line-height: 1;
          user-select: none;
        }

        .left-logo {
          font-family: 'Unbounded', sans-serif;
          font-size: 20px;
          font-weight: 900;
          color: var(--black);
          text-decoration: none;
          letter-spacing: -.02em;
          display: flex;
          align-items: center;
          gap: 8px;
          position: relative;
          z-index: 1;
        }

        .logo-dot {
          width: 10px; height: 10px;
          border-radius: 50%;
          background: var(--black);
        }

        .left-body {
          position: relative;
          z-index: 1;
        }

        .left-eyebrow {
          font-family: 'Unbounded', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .16em;
          text-transform: uppercase;
          color: rgba(0,0,0,0.5);
          margin-bottom: 20px;
        }

        .left-headline {
          font-family: 'Unbounded', sans-serif;
          font-size: clamp(40px, 5vw, 64px);
          font-weight: 900;
          line-height: 1.0;
          letter-spacing: -.04em;
          color: var(--black);
          margin-bottom: 24px;
        }

        .left-headline .underline-box {
          background: var(--yellow);
          border: 2px solid var(--black);
          padding: 0 6px;
          border-radius: 4px;
          display: inline;
        }

        .left-sub {
          font-size: 16px;
          font-weight: 600;
          color: rgba(0,0,0,0.55);
          max-width: 340px;
          line-height: 1.65;
          margin-bottom: 48px;
        }

        .stat-row {
          display: flex;
          gap: 12px;
        }

        .stat-box {
          background: var(--black);
          border: 2.5px solid var(--black);
          border-radius: 14px;
          padding: 18px 20px;
          text-align: center;
          box-shadow: var(--shadow);
          min-width: 90px;
        }

        .stat-num {
          font-family: 'Unbounded', sans-serif;
          font-size: 22px;
          font-weight: 900;
          color: var(--yellow);
          letter-spacing: -.03em;
          line-height: 1;
        }

        .stat-label {
          font-size: 10px;
          font-weight: 700;
          color: rgba(255,255,255,0.4);
          margin-top: 5px;
          letter-spacing: .06em;
          text-transform: uppercase;
        }

        .left-footer {
          font-family: 'Unbounded', sans-serif;
          font-size: 10px;
          font-weight: 700;
          color: rgba(0,0,0,0.3);
          letter-spacing: .1em;
          text-transform: uppercase;
          position: relative;
          z-index: 1;
        }

        /* ── RIGHT PANEL ── */
        .right {
          width: 480px;
          min-height: 100vh;
          background: var(--cream);
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 64px 52px;
        }

        .form-eyebrow {
          font-family: 'Unbounded', sans-serif;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: .16em;
          text-transform: uppercase;
          color: var(--orange);
          margin-bottom: 10px;
        }

        .form-title {
          font-family: 'Unbounded', sans-serif;
          font-size: 28px;
          font-weight: 900;
          letter-spacing: -.03em;
          margin-bottom: 6px;
          color: var(--black);
        }

        .form-sub {
          font-size: 14px;
          font-weight: 600;
          color: #888;
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
          font-family: 'Unbounded', sans-serif;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: .12em;
          text-transform: uppercase;
          color: #888;
        }

        .field input {
          background: var(--white);
          border: 2.5px solid var(--black);
          border-radius: 10px;
          padding: 14px 16px;
          color: var(--black);
          font-family: 'Nunito', sans-serif;
          font-size: 15px;
          font-weight: 600;
          outline: none;
          box-shadow: 3px 3px 0 var(--black);
          transition: box-shadow .12s, transform .12s;
        }

        .field input::placeholder { color: #bbb; font-weight: 600; }

        .field input:focus {
          box-shadow: 5px 5px 0 var(--black);
          transform: translate(-1px, -1px);
        }

        .error-box {
          background: #fff0ee;
          border: 2px solid #ff5c5c;
          border-radius: 10px;
          padding: 12px 16px;
          font-size: 13px;
          font-weight: 700;
          color: #cc2200;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 3px 3px 0 #ff5c5c;
        }

        .submit-btn {
          width: 100%;
          padding: 16px;
          margin-top: 8px;
          background: var(--black);
          color: var(--white);
          border: 2.5px solid var(--black);
          border-radius: 12px;
          font-family: 'Nunito', sans-serif;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
          box-shadow: var(--shadow);
          transition: transform .12s, box-shadow .12s, background .12s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          letter-spacing: .01em;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translate(-2px, -2px);
          box-shadow: var(--shadow-lg);
          background: var(--orange);
        }

        .submit-btn:active:not(:disabled) {
          transform: translate(2px, 2px);
          box-shadow: none;
        }

        .submit-btn:disabled { opacity: .5; cursor: not-allowed; }

        .spinning { animation: spin .6s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 28px 0;
          color: #ccc;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: .06em;
          text-transform: uppercase;
        }

        .divider::before, .divider::after {
          content: '';
          flex: 1;
          height: 2px;
          background: #e8e0d4;
          border-radius: 2px;
        }

        .bottom-link {
          text-align: center;
          font-size: 14px;
          font-weight: 700;
          color: #999;
        }

        .bottom-link a {
          color: var(--orange);
          text-decoration: none;
          font-weight: 800;
          border-bottom: 2px solid var(--orange);
          padding-bottom: 1px;
          transition: color .15s;
        }

        .bottom-link a:hover { color: var(--black); border-color: var(--black); }

        @media (max-width: 860px) {
          .left { display: none; }
          .right { width: 100%; padding: 48px 28px; }
        }
      `}</style>

      <div className="root">
        {/* LEFT */}
        <div className="left">
          <div className="left-bg">HI.</div>
          <a href="/" className="left-logo">
            <span className="logo-dot" />
            Catalyst
          </a>
          <div className="left-body">
            <p className="left-eyebrow">Welcome back</p>
            <h1 className="left-headline">
              Good to see<br />
              you <span className="underline-box">again.</span>
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
                <div className="stat-num">Local</div>
                <div className="stat-label">Plymouth</div>
              </div>
            </div>
          </div>
          <div className="left-footer">Est. 2026 · Catalyst · Plymouth, IN</div>
        </div>

        {/* RIGHT */}
        <div className="right">
          <p className="form-eyebrow">Welcome back</p>
          <h2 className="form-title">Sign in</h2>
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
                <AlertCircle size={16} strokeWidth={2.5} />
                {error}
              </div>
            )}

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading
                ? <><Loader size={16} className="spinning" /> Signing in…</>
                : <>Sign In <ArrowRight size={16} strokeWidth={2.5} /></>
              }
            </button>
          </form>

          <div className="divider">New to Catalyst?</div>
          <p className="bottom-link">
            <a href="/auth/signup">Create a free account →</a>
          </p>
        </div>
      </div>
    </>
  )
}