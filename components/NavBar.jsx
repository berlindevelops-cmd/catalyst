'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function Navbar() {
  const [user, setUser] = useState(null)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      subscription.unsubscribe()
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/auth/login'
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=Syne:wght@700;800&display=swap');

        .nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 40px;
          height: 64px;
          font-family: 'Instrument Sans', sans-serif;
          transition: background .2s, border-color .2s, box-shadow .2s;
          background: rgba(13,13,13,0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }

        .nav.scrolled {
          background: rgba(13,13,13,0.96);
          box-shadow: 0 1px 0 rgba(255,255,255,0.06);
        }

        .nav-logo {
          font-family: 'Syne', sans-serif;
          font-size: 22px;
          font-weight: 800;
          color: #F5F2EB;
          text-decoration: none;
          letter-spacing: -.01em;
          flex-shrink: 0;
        }

        .nav-logo span { color: #FFE033; }

        .nav-right {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .nav-link {
          font-size: 14px;
          font-weight: 500;
          color: rgba(245,242,235,0.5);
          text-decoration: none;
          padding: 7px 14px;
          border-radius: 8px;
          transition: color .15s, background .15s;
          white-space: nowrap;
        }

        .nav-link:hover {
          color: #F5F2EB;
          background: rgba(255,255,255,0.06);
        }

        .nav-divider {
          width: 1px;
          height: 18px;
          background: rgba(255,255,255,0.1);
          margin: 0 6px;
          flex-shrink: 0;
        }

        .nav-signout {
          font-size: 14px;
          font-weight: 500;
          color: rgba(245,242,235,0.5);
          background: none;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          padding: 7px 14px;
          cursor: pointer;
          font-family: 'Instrument Sans', sans-serif;
          transition: color .15s, border-color .15s, background .15s;
          white-space: nowrap;
        }

        .nav-signout:hover {
          color: #F5F2EB;
          border-color: rgba(255,255,255,0.22);
          background: rgba(255,255,255,0.04);
        }

        .nav-cta {
          background: #FFE033;
          color: #0D0D0D !important;
          font-weight: 700 !important;
          padding: 8px 18px !important;
          border-radius: 10px !important;
        }

        .nav-cta:hover {
          background: #f0d020 !important;
          color: #0D0D0D !important;
        }

        /* spacer so page content doesn't hide under fixed nav */
        .nav-spacer {
          height: 64px;
          flex-shrink: 0;
        }

        @media (max-width: 640px) {
          .nav { padding: 0 20px; }
          .nav-link-hide { display: none; }
          .nav-divider { display: none; }
        }
      `}</style>

      <nav className={`nav${scrolled ? ' scrolled' : ''}`}>
        {/* Logo */}
        <a href="/" className="nav-logo">Catalyst<span>.</span></a>

        {/* Right side */}
        <div className="nav-right">
          <a href="/jobs" className="nav-link nav-link-hide">Browse Jobs</a>

          {user ? (
            <>
              <a href="/messages" className="nav-link nav-link-hide">Messages</a>
              <a href="/applications" className="nav-link nav-link-hide">Applications</a>
              <a href="/portfolio" className="nav-link nav-link-hide">Portfolio</a>
              <div className="nav-divider" />
              <a href="/profile" className="nav-link">Profile</a>
              <button className="nav-signout" onClick={handleSignOut}>Sign Out</button>
            </>
          ) : (
            <>
              <div className="nav-divider" />
              <a href="/auth/login" className="nav-link">Log In</a>
              <a href="/auth/signup" className="nav-link nav-cta">Sign Up →</a>
            </>
          )}
        </div>
      </nav>

      {/* Push page content below fixed nav */}
      <div className="nav-spacer" />
    </>
  )
}