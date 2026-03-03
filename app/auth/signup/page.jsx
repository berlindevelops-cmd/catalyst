'use client'

import { useState } from 'react'
import { supabase } from '../../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState('teen')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const router = useRouter()

  const handleSignUp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { data, err } = await supabase.auth.signUp({
        email: email,
        password: password,
    });

    if (err) {
      setError(err.message)
    } else if (!data.user) {
      setError('Please check your email to confirm your account')
    } else {
        const { error: insertError } = await supabase
            .from('users')
            .insert({ id: data.user.id, email, name, role });
        if (insertError) {
            setError(insertError.message);
        } else {
            router.push('/jobs')
        }
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
          top: -100px; right: -100px;
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(255,92,26,0.14) 0%, transparent 65%);
          pointer-events: none;
        }

        .left-glow-bottom {
          position: absolute;
          bottom: -100px; left: -50px;
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(255,224,51,0.08) 0%, transparent 65%);
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

        .left-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 100px;
          padding: 5px 14px 5px 8px;
          font-size: 12px;
          font-weight: 500;
          color: rgba(255,255,255,0.6);
          margin-bottom: 28px;
        }

        .left-badge-dot {
          background: var(--orange);
          color: #fff;
          font-size: 10px;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: 100px;
          letter-spacing: .04em;
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
        .left-headline .orange { color: var(--orange); }

        .left-sub {
          font-size: 15px;
          font-weight: 400;
          color: rgba(255,255,255,0.4);
          max-width: 360px;
          line-height: 1.7;
          margin-bottom: 48px;
        }

        /* social proof cards */
        .proof-cards {
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-width: 360px;
        }

        .proof-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .proof-icon {
          width: 40px; height: 40px;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
        }

        .proof-icon.yellow { background: rgba(255,224,51,0.12); }
        .proof-icon.orange { background: rgba(255,92,26,0.12); }

        .proof-text strong {
          display: block;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 2px;
        }

        .proof-text span {
          font-size: 12px;
          color: rgba(255,255,255,0.35);
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
          margin-bottom: 32px;
        }

        /* role toggle */
        .role-toggle {
          display: flex;
          background: var(--black);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 4px;
          margin-bottom: 28px;
          gap: 4px;
        }

        .role-btn {
          flex: 1;
          padding: 11px 0;
          background: transparent;
          border: none;
          border-radius: 9px;
          color: rgba(255,255,255,0.35);
          font-family: 'Instrument Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all .18s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
        }

        .role-btn.active {
          background: var(--yellow);
          color: #0d0d0d;
          font-weight: 700;
        }

        /* field */
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

        /* error */
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

        /* submit */
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

        .signin-link {
          text-align: center;
          font-size: 13px;
          color: rgba(255,255,255,0.3);
        }

        .signin-link a {
          color: var(--yellow);
          text-decoration: none;
          font-weight: 600;
        }

        .signin-link a:hover { text-decoration: underline; }

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
            <div className="left-badge">
              <span className="left-badge-dot">LIVE</span>
              Plymouth, Indiana
            </div>
            <h1 className="left-headline">
              Your first<br />
              <span className="yellow">hustle</span><br />
              starts here.
            </h1>
            <p className="left-sub">
              Join hundreds of Plymouth teens finding flexible, local work — on their schedule.
            </p>

            <div className="proof-cards">
              <div className="proof-card">
                <div className="proof-icon yellow">💸</div>
                <div className="proof-text">
                  <strong>Earn $15–$30/hr</strong>
                  <span>For local gigs in Plymouth</span>
                </div>
              </div>
              <div className="proof-card">
                <div className="proof-icon orange">⚡</div>
                <div className="proof-text">
                  <strong>No experience needed</strong>
                  <span>Most jobs just need a good attitude</span>
                </div>
              </div>
            </div>
          </div>

          <div className="left-footer">EST. 2026 · CATALYST · PLYMOUTH, IN</div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="right">
          <p className="form-eyebrow">Step 1 of 1</p>
          <p className="form-title">Create your account</p>

          <div className="role-toggle">
            <button
              type="button"
              className={`role-btn ${role === 'teen' ? 'active' : ''}`}
              onClick={() => setRole('teen')}
            >
              👋 I'm a Teen
            </button>
            <button
              type="button"
              className={`role-btn ${role === 'employer' ? 'active' : ''}`}
              onClick={() => setRole('employer')}
            >
              🏢 I'm an Employer
            </button>
          </div>

          <form onSubmit={handleSignUp}>
            <div className="field">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Jane Smith"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>

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
                placeholder="At least 8 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>

            {error && (
              <div className="error-box">
                <span>⚠️</span> {error}
              </div>
            )}

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading && <span className="spinner" />}
              {loading ? 'Creating account…' : 'Create Account →'}
            </button>
          </form>

          <div className="divider">already have an account?</div>

          <p className="signin-link">
            <a href="/auth/login">Sign in instead →</a>
          </p>
        </div>
      </div>
    </>
  )
}