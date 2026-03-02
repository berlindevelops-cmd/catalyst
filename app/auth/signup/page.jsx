'use client'

import { useState } from 'react'
import { supabase } from '../../../lib/supabase'

export default function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState('teen')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSignUp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { data, err } = await supabase.auth.signUp({
        email: email,
        password: password,
    });

    if (err) {
        setError(err.message);
    } else {
        const { error: insertError } = await supabase
            .from('users')
            .insert(
                { 
                    id: data.user.id, 
                    email: email, 
                    name: name, 
                    role: role 
                });
        if (insertError) {
            setError(insertError.message);
        } else {
            window.location.href = '/jobs';
        }
    }
    setLoading(false)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .signup-root {
          min-height: 100vh;
          background: #0d0d0d;
          display: flex;
          align-items: stretch;
          font-family: 'DM Sans', sans-serif;
          color: #fff;
          overflow: hidden;
        }

        /* ── Left panel ── */
        .signup-left {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 64px 72px;
          position: relative;
        }

        .signup-left::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 80% 60% at 20% 50%, rgba(255,220,80,.08) 0%, transparent 70%),
            radial-gradient(ellipse 60% 80% at 80% 10%, rgba(255,100,60,.06) 0%, transparent 60%);
          pointer-events: none;
        }

        .signup-eyebrow {
          font-family: 'Syne', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .18em;
          text-transform: uppercase;
          color: #ffdc50;
          margin-bottom: 20px;
        }

        .signup-headline {
          font-family: 'Syne', sans-serif;
          font-size: clamp(2.6rem, 5vw, 4rem);
          font-weight: 800;
          line-height: 1.05;
          margin-bottom: 16px;
        }

        .signup-headline span {
          color: #ffdc50;
        }

        .signup-sub {
          font-weight: 300;
          font-size: 15px;
          color: rgba(255,255,255,.45);
          max-width: 340px;
          line-height: 1.7;
        }

        /* decorative line */
        .signup-deco {
          position: absolute;
          bottom: 48px;
          left: 72px;
          display: flex;
          align-items: center;
          gap: 12px;
          color: rgba(255,255,255,.2);
          font-size: 12px;
          letter-spacing: .1em;
        }
        .signup-deco::before {
          content: '';
          display: block;
          width: 48px;
          height: 1px;
          background: rgba(255,255,255,.2);
        }

        /* ── Right panel / form ── */
        .signup-right {
          width: 480px;
          min-height: 100vh;
          background: #141414;
          border-left: 1px solid rgba(255,255,255,.06);
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 64px 56px;
          position: relative;
        }

        .form-title {
          font-family: 'Syne', sans-serif;
          font-size: 22px;
          font-weight: 700;
          margin-bottom: 36px;
          color: #fff;
        }

        /* role toggle */
        .role-toggle {
          display: flex;
          background: #0d0d0d;
          border-radius: 10px;
          padding: 4px;
          margin-bottom: 28px;
          border: 1px solid rgba(255,255,255,.08);
        }

        .role-btn {
          flex: 1;
          padding: 10px 0;
          background: transparent;
          border: none;
          border-radius: 8px;
          color: rgba(255,255,255,.4);
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all .2s;
        }

        .role-btn.active {
          background: #ffdc50;
          color: #0d0d0d;
          font-weight: 600;
        }

        /* field */
        .field {
          margin-bottom: 18px;
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .field label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: .1em;
          text-transform: uppercase;
          color: rgba(255,255,255,.35);
        }

        .field input {
          background: #0d0d0d;
          border: 1px solid rgba(255,255,255,.1);
          border-radius: 10px;
          padding: 14px 16px;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          outline: none;
          transition: border-color .2s, box-shadow .2s;
        }

        .field input::placeholder { color: rgba(255,255,255,.2); }

        .field input:focus {
          border-color: #ffdc50;
          box-shadow: 0 0 0 3px rgba(255,220,80,.1);
        }

        /* error */
        .error-box {
          background: rgba(255,80,60,.1);
          border: 1px solid rgba(255,80,60,.3);
          border-radius: 10px;
          padding: 12px 16px;
          font-size: 13px;
          color: #ff6b5b;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        /* submit */
        .submit-btn {
          width: 100%;
          padding: 16px;
          margin-top: 8px;
          background: #ffdc50;
          color: #0d0d0d;
          border: none;
          border-radius: 10px;
          font-family: 'Syne', sans-serif;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          letter-spacing: .02em;
          transition: opacity .2s, transform .15s;
          position: relative;
          overflow: hidden;
        }

        .submit-btn:hover:not(:disabled) { opacity: .88; transform: translateY(-1px); }
        .submit-btn:active:not(:disabled) { transform: translateY(0); }
        .submit-btn:disabled { opacity: .5; cursor: not-allowed; }

        .submit-btn .spinner {
          display: inline-block;
          width: 16px; height: 16px;
          border: 2px solid rgba(0,0,0,.3);
          border-top-color: #0d0d0d;
          border-radius: 50%;
          animation: spin .6s linear infinite;
          vertical-align: middle;
          margin-right: 8px;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .signin-link {
          margin-top: 24px;
          text-align: center;
          font-size: 13px;
          color: rgba(255,255,255,.3);
        }

        .signin-link a {
          color: #ffdc50;
          text-decoration: none;
          font-weight: 500;
        }

        @media (max-width: 820px) {
          .signup-left { display: none; }
          .signup-right { width: 100%; border-left: none; padding: 48px 32px; }
        }
      `}</style>

      <div className="signup-root">
        {/* Left branding panel */}
        <div className="signup-left">
          <p className="signup-eyebrow">🚀 Now hiring</p>
          <h1 className="signup-headline">
            Find work.<br />
            <span>Make moves.</span>
          </h1>
          <p className="signup-sub">
            Connect teens with local opportunities and employers who actually care about real-world experience.
          </p>
          <div className="signup-deco">EST. 2026 · CATALYST</div>
        </div>

        {/* Right form panel */}
        <div className="signup-right">
          <p className="form-title">Create your account</p>

          {/* Role toggle */}
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
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="signin-link">
            Already have an account? <a href="login">Sign in</a>
          </p>
        </div>
      </div>
    </>
  )
}