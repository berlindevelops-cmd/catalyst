'use client'

import { useState } from 'react'
import { supabase } from '../../../lib/supabase'
import { useRouter } from 'next/navigation'
import { AlertCircle, ArrowRight, Loader, User, Briefcase } from 'lucide-react'

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
    const { data, error: err } = await supabase.auth.signUp({ email, password })
    if (err) {
      setError(err.message)
    } else if (!data.user) {
      setError('Please check your email to confirm your account.')
    } else {
      const { error: insertError } = await supabase
        .from('users')
        .insert({ id: data.user.id, email, name, role })
      if (insertError) setError(insertError.message)
      else router.push('/jobs')
    }
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
          background: var(--yellow);
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
          color: rgba(0,0,0,0.06);
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

        .live-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: var(--black);
          border-radius: 100px;
          padding: 5px 14px 5px 8px;
          font-family: 'Unbounded', sans-serif;
          font-size: 10px;
          font-weight: 700;
          color: var(--yellow);
          letter-spacing: .08em;
          text-transform: uppercase;
          margin-bottom: 28px;
          box-shadow: var(--shadow);
        }

        .live-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: var(--orange);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: .8; }
        }

        .left-headline {
          font-family: 'Unbounded', sans-serif;
          font-size: clamp(38px, 5vw, 60px);
          font-weight: 900;
          line-height: 1.0;
          letter-spacing: -.04em;
          color: var(--black);
          margin-bottom: 24px;
        }

        .left-headline .orange-box {
          background: var(--orange);
          color: var(--white);
          padding: 0 8px;
          border-radius: 6px;
          border: 2px solid var(--black);
          display: inline;
        }

        .left-sub {
          font-size: 16px;
          font-weight: 600;
          color: rgba(0,0,0,0.5);
          max-width: 340px;
          line-height: 1.65;
          margin-bottom: 40px;
        }

        .proof-cards {
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-width: 360px;
        }

        .proof-card {
          background: var(--white);
          border: 2.5px solid var(--black);
          border-radius: 14px;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          box-shadow: var(--shadow);
        }

        .proof-icon {
          width: 42px; height: 42px;
          border-radius: 10px;
          border: 2px solid var(--black);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: var(--black);
        }

        .proof-icon.orange-bg { background: var(--orange); color: var(--white); border-color: var(--black); }
        .proof-icon.black-bg { background: var(--black); color: var(--yellow); }

        .proof-text strong {
          display: block;
          font-size: 14px;
          font-weight: 800;
          margin-bottom: 2px;
          color: var(--black);
        }

        .proof-text span {
          font-size: 12px;
          font-weight: 600;
          color: #888;
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
          width: 500px;
          min-height: 100vh;
          background: var(--cream);
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 64px 52px;
          overflow-y: auto;
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
          margin-bottom: 28px;
          color: var(--black);
        }

        /* role toggle */
        .role-toggle {
          display: flex;
          background: var(--white);
          border: 2.5px solid var(--black);
          border-radius: 12px;
          padding: 4px;
          margin-bottom: 28px;
          gap: 4px;
          box-shadow: var(--shadow);
        }

        .role-btn {
          flex: 1;
          padding: 11px 0;
          background: transparent;
          border: 2px solid transparent;
          border-radius: 8px;
          color: #999;
          font-family: 'Nunito', sans-serif;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all .15s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .role-btn.active {
          background: var(--black);
          color: var(--yellow);
          border-color: var(--black);
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
          background: var(--orange);
          color: var(--white);
          border: 2.5px solid var(--black);
          border-radius: 12px;
          font-family: 'Nunito', sans-serif;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
          box-shadow: var(--shadow);
          transition: transform .12s, box-shadow .12s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          letter-spacing: .01em;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translate(-2px, -2px);
          box-shadow: var(--shadow-lg);
        }

        .submit-btn:active:not(:disabled) {
          transform: translate(2px, 2px);
          box-shadow: none;
        }

        .submit-btn:disabled { opacity: .5; cursor: not-allowed; }

        .spinning { animation: spin .6s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .terms {
          margin-top: 14px;
          font-size: 12px;
          font-weight: 600;
          color: #aaa;
          text-align: center;
          line-height: 1.5;
        }

        .terms a { color: var(--orange); text-decoration: none; font-weight: 700; }
        .terms a:hover { text-decoration: underline; }

        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 24px 0;
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
          color: var(--black);
          text-decoration: none;
          font-weight: 800;
          border-bottom: 2px solid var(--black);
          padding-bottom: 1px;
          transition: color .15s, border-color .15s;
        }

        .bottom-link a:hover { color: var(--orange); border-color: var(--orange); }

        @media (max-width: 860px) {
          .left { display: none; }
          .right { width: 100%; padding: 48px 28px; }
        }
      `}</style>

      <div className="root">
        {/* LEFT */}
        <div className="left">
          <div className="left-bg">GO.</div>
          <a href="/" className="left-logo">
            <span className="logo-dot" />
            Catalyst
          </a>
          <div className="left-body">
            <div className="live-badge">
              <span className="live-dot" />
              Live · Plymouth, IN
            </div>
            <h1 className="left-headline">
              Your first<br />
              <span className="orange-box">hustle</span><br />
              starts here.
            </h1>
            <p className="left-sub">
              Join Plymouth teens finding flexible, local work — on their schedule, their terms.
            </p>
            <div className="proof-cards">
              <div className="proof-card">
                <div className="proof-icon orange-bg">
                  <Briefcase size={18} strokeWidth={2.5} />
                </div>
                <div className="proof-text">
                  <strong>Earn $15–$30/hr</strong>
                  <span>For local gigs in Plymouth</span>
                </div>
              </div>
              <div className="proof-card">
                <div className="proof-icon black-bg">
                  <User size={18} strokeWidth={2.5} />
                </div>
                <div className="proof-text">
                  <strong>No experience needed</strong>
                  <span>Most jobs just need a good attitude</span>
                </div>
              </div>
            </div>
          </div>
          <div className="left-footer">Est. 2026 · Catalyst · Plymouth, IN</div>
        </div>

        {/* RIGHT */}
        <div className="right">
          <p className="form-eyebrow">Get started</p>
          <h2 className="form-title">Create your account</h2>

          <div className="role-toggle">
            <button
              type="button"
              className={`role-btn ${role === 'teen' ? 'active' : ''}`}
              onClick={() => setRole('teen')}
            >
              <User size={15} strokeWidth={2.5} />
              I'm a Teen
            </button>
            <button
              type="button"
              className={`role-btn ${role === 'employer' ? 'active' : ''}`}
              onClick={() => setRole('employer')}
            >
              <Briefcase size={15} strokeWidth={2.5} />
              I'm an Employer
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
                <AlertCircle size={16} strokeWidth={2.5} />
                {error}
              </div>
            )}

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading
                ? <><Loader size={16} className="spinning" /> Creating account…</>
                : <>Create Account <ArrowRight size={16} strokeWidth={2.5} /></>
              }
            </button>
          </form>

          <p className="terms">
            By signing up you agree to our <a href="#">Terms</a> and <a href="#">Privacy Policy</a>.
          </p>

          <div className="divider">Already have an account?</div>
          <p className="bottom-link">
            <a href="/auth/login">Sign in instead →</a>
          </p>
        </div>
      </div>
    </>
  )
}