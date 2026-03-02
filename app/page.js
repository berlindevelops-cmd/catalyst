import { redirect } from 'next/navigation'

export default function Home() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Epilogue:wght@300;400;500;700;900&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --yellow: #FFE033;
          --orange: #FF5C1A;
          --black: #0A0A0A;
          --white: #F5F2EB;
          --gray: #1A1A1A;
        }

        html { scroll-behavior: smooth; }

        body {
          background: var(--black);
          color: var(--white);
          font-family: 'Epilogue', sans-serif;
          overflow-x: hidden;
        }

        /* ── NAV ── */
        .nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 48px;
          background: rgba(10,10,10,0.85);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        .nav-logo {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 28px;
          letter-spacing: .08em;
          color: var(--yellow);
          text-decoration: none;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 40px;
          list-style: none;
        }

        .nav-links a {
          color: rgba(245,242,235,0.5);
          text-decoration: none;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: .06em;
          text-transform: uppercase;
          transition: color .2s;
        }

        .nav-links a:hover { color: var(--white); }

        .nav-cta {
          background: var(--yellow);
          color: var(--black) !important;
          padding: 10px 24px;
          border-radius: 6px;
          font-weight: 700 !important;
          color: var(--black);
        }

        /* ── HERO ── */
        .hero {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 140px 48px 80px;
          position: relative;
          overflow: hidden;
        }

        /* big background text */
        .hero-bg-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(180px, 28vw, 380px);
          color: rgba(255,224,51,0.04);
          white-space: nowrap;
          pointer-events: none;
          user-select: none;
          letter-spacing: .05em;
        }

        /* orange blob */
        .hero::before {
          content: '';
          position: absolute;
          top: -200px;
          right: -200px;
          width: 700px;
          height: 700px;
          background: radial-gradient(circle, rgba(255,92,26,0.15) 0%, transparent 70%);
          pointer-events: none;
        }

        .hero::after {
          content: '';
          position: absolute;
          bottom: -100px;
          left: -100px;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(255,224,51,0.08) 0%, transparent 70%);
          pointer-events: none;
        }

        .hero-tag {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,224,51,0.1);
          border: 1px solid rgba(255,224,51,0.25);
          border-radius: 100px;
          padding: 6px 16px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: .1em;
          text-transform: uppercase;
          color: var(--yellow);
          margin-bottom: 32px;
          width: fit-content;
          animation: fadeUp .6s ease both;
        }

        .hero-tag::before {
          content: '';
          width: 6px; height: 6px;
          background: var(--yellow);
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: .4; transform: scale(1.4); }
        }

        .hero-headline {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(72px, 12vw, 160px);
          line-height: .92;
          letter-spacing: .02em;
          margin-bottom: 8px;
          animation: fadeUp .6s .1s ease both;
        }

        .hero-headline .outline {
          -webkit-text-stroke: 2px var(--white);
          color: transparent;
        }

        .hero-headline .accent { color: var(--yellow); }

        .hero-sub-row {
          display: flex;
          align-items: flex-end;
          gap: 48px;
          margin-top: 40px;
          animation: fadeUp .6s .2s ease both;
        }

        .hero-sub {
          font-size: 17px;
          font-weight: 300;
          color: rgba(245,242,235,0.55);
          max-width: 420px;
          line-height: 1.7;
        }

        .hero-sub strong {
          color: var(--white);
          font-weight: 500;
        }

        .hero-btns {
          display: flex;
          gap: 16px;
          margin-top: 48px;
          animation: fadeUp .6s .3s ease both;
        }

        .btn-primary {
          background: var(--yellow);
          color: var(--black);
          padding: 16px 36px;
          border-radius: 8px;
          font-family: 'Epilogue', sans-serif;
          font-size: 15px;
          font-weight: 700;
          text-decoration: none;
          letter-spacing: .02em;
          transition: transform .15s, opacity .15s;
          display: inline-block;
        }

        .btn-primary:hover { transform: translateY(-2px); opacity: .9; }

        .btn-secondary {
          background: transparent;
          color: var(--white);
          padding: 16px 36px;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.2);
          font-family: 'Epilogue', sans-serif;
          font-size: 15px;
          font-weight: 500;
          text-decoration: none;
          transition: border-color .2s, background .2s;
          display: inline-block;
        }

        .btn-secondary:hover {
          border-color: rgba(255,255,255,0.5);
          background: rgba(255,255,255,0.05);
        }

        /* stats row */
        .hero-stats {
          display: flex;
          gap: 48px;
          margin-top: 80px;
          padding-top: 48px;
          border-top: 1px solid rgba(255,255,255,0.08);
          animation: fadeUp .6s .4s ease both;
        }

        .stat-num {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 48px;
          color: var(--yellow);
          letter-spacing: .04em;
          line-height: 1;
        }

        .stat-label {
          font-size: 12px;
          font-weight: 500;
          letter-spacing: .1em;
          text-transform: uppercase;
          color: rgba(245,242,235,0.4);
          margin-top: 4px;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* ── HOW IT WORKS ── */
        .section {
          padding: 120px 48px;
          position: relative;
        }

        .section-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .18em;
          text-transform: uppercase;
          color: var(--orange);
          margin-bottom: 20px;
        }

        .section-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(48px, 7vw, 88px);
          line-height: .95;
          letter-spacing: .03em;
          margin-bottom: 64px;
        }

        .steps {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2px;
        }

        .step {
          background: var(--gray);
          padding: 48px 40px;
          position: relative;
          overflow: hidden;
          transition: background .2s;
        }

        .step:hover { background: #222; }

        .step:first-child { border-radius: 16px 0 0 16px; }
        .step:last-child { border-radius: 0 16px 16px 0; }

        .step-num {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 80px;
          color: rgba(255,224,51,0.12);
          line-height: 1;
          margin-bottom: 24px;
          letter-spacing: .04em;
        }

        .step-icon {
          font-size: 32px;
          margin-bottom: 20px;
        }

        .step-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 28px;
          letter-spacing: .04em;
          margin-bottom: 12px;
          color: var(--white);
        }

        .step-desc {
          font-size: 14px;
          font-weight: 300;
          color: rgba(245,242,235,0.5);
          line-height: 1.7;
        }

        /* ── FOR TEENS / FOR EMPLOYERS split ── */
        .split {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2px;
          margin: 0 0 2px;
        }

        .split-card {
          padding: 72px 56px;
          position: relative;
          overflow: hidden;
        }

        .split-card.teens {
          background: var(--yellow);
          color: var(--black);
        }

        .split-card.employers {
          background: var(--gray);
          color: var(--white);
        }

        .split-card-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .18em;
          text-transform: uppercase;
          opacity: 0.5;
          margin-bottom: 16px;
        }

        .split-card-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(40px, 5vw, 64px);
          letter-spacing: .03em;
          line-height: .95;
          margin-bottom: 32px;
        }

        .split-features {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-bottom: 40px;
        }

        .split-features li {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 14px;
          font-weight: 400;
        }

        .split-features li::before {
          content: '→';
          font-weight: 700;
          flex-shrink: 0;
        }

        .split-card.teens .split-features li::before { color: var(--orange); }
        .split-card.employers .split-features li::before { color: var(--yellow); }

        .btn-dark {
          background: var(--black);
          color: var(--yellow);
          padding: 14px 32px;
          border-radius: 8px;
          font-family: 'Epilogue', sans-serif;
          font-size: 14px;
          font-weight: 700;
          text-decoration: none;
          display: inline-block;
          transition: opacity .2s;
        }

        .btn-dark:hover { opacity: .85; }

        .btn-yellow {
          background: var(--yellow);
          color: var(--black);
          padding: 14px 32px;
          border-radius: 8px;
          font-family: 'Epilogue', sans-serif;
          font-size: 14px;
          font-weight: 700;
          text-decoration: none;
          display: inline-block;
          transition: opacity .2s;
        }

        .btn-yellow:hover { opacity: .85; }

        /* ── JOB CATEGORIES ── */
        .categories {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 48px;
        }

        .cat-chip {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 100px;
          padding: 10px 20px;
          font-size: 13px;
          font-weight: 500;
          color: rgba(245,242,235,0.7);
          display: flex;
          align-items: center;
          gap: 8px;
          transition: background .2s, border-color .2s, color .2s;
          cursor: default;
        }

        .cat-chip:hover {
          background: rgba(255,224,51,0.1);
          border-color: rgba(255,224,51,0.3);
          color: var(--yellow);
        }

        /* ── CTA BANNER ── */
        .cta-banner {
          background: var(--yellow);
          padding: 100px 48px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 48px;
          position: relative;
          overflow: hidden;
        }

        .cta-banner::before {
          content: 'CATALYST';
          position: absolute;
          right: -40px;
          top: 50%;
          transform: translateY(-50%);
          font-family: 'Bebas Neue', sans-serif;
          font-size: 200px;
          color: rgba(0,0,0,0.06);
          pointer-events: none;
          white-space: nowrap;
          letter-spacing: .05em;
        }

        .cta-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(48px, 7vw, 88px);
          color: var(--black);
          line-height: .95;
          letter-spacing: .03em;
        }

        .cta-right {
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 16px;
        }

        .cta-sub {
          font-size: 15px;
          color: rgba(0,0,0,0.55);
          max-width: 280px;
          line-height: 1.6;
        }

        /* ── FOOTER ── */
        .footer {
          background: var(--black);
          border-top: 1px solid rgba(255,255,255,0.06);
          padding: 48px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .footer-logo {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 24px;
          color: var(--yellow);
          letter-spacing: .08em;
        }

        .footer-copy {
          font-size: 12px;
          color: rgba(245,242,235,0.25);
          letter-spacing: .06em;
        }

        .footer-links {
          display: flex;
          gap: 32px;
          list-style: none;
        }

        .footer-links a {
          font-size: 12px;
          color: rgba(245,242,235,0.35);
          text-decoration: none;
          letter-spacing: .06em;
          text-transform: uppercase;
          transition: color .2s;
        }

        .footer-links a:hover { color: var(--white); }

        @media (max-width: 900px) {
          .nav { padding: 20px 24px; }
          .nav-links { display: none; }
          .hero { padding: 120px 24px 64px; }
          .hero-stats { gap: 28px; flex-wrap: wrap; }
          .section { padding: 80px 24px; }
          .steps { grid-template-columns: 1fr; gap: 2px; }
          .step:first-child { border-radius: 16px 16px 0 0; }
          .step:last-child { border-radius: 0 0 16px 16px; }
          .split { grid-template-columns: 1fr; }
          .cta-banner { flex-direction: column; padding: 64px 24px; }
          .footer { flex-direction: column; gap: 24px; text-align: center; padding: 32px 24px; }
          .footer-links { flex-wrap: wrap; justify-content: center; }
        }
      `}</style>

      {/* NAV */}
      <nav className="nav">
        <a href="/" className="nav-logo">Catalyst</a>
        <ul className="nav-links">
          <li><a href="#how-it-works">How It Works</a></li>
          <li><a href="#for-teens">For Teens</a></li>
          <li><a href="#for-employers">Employers</a></li>
          <li><a href="/auth/signup" className="nav-cta">Get Started</a></li>
        </ul>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg-text">WORK</div>

        <div className="hero-tag">Now live in Plymouth, Indiana</div>

        <h1 className="hero-headline">
          <span className="outline">Your</span><br />
          <span className="accent">First</span><br />
          Hustle.
        </h1>

        <div className="hero-sub-row">
          <p className="hero-sub">
            The job board built for <strong>teens in Plymouth</strong>. 
            Skip the fast food line — babysit for $20/hr, mow lawns on your schedule, 
            tutor from home. <strong>Be your own boss.</strong>
          </p>
        </div>

        <div className="hero-btns">
          <a href="/auth/signup" className="btn-primary">Find Jobs Now →</a>
          <a href="/jobs/post" className="btn-secondary">Post a Job</a>
        </div>

        <div className="hero-stats">
          <div>
            <div className="stat-num">530+</div>
            <div className="stat-label">Teens in Plymouth</div>
          </div>
          <div>
            <div className="stat-num">$20</div>
            <div className="stat-label">Avg. Hourly Rate</div>
          </div>
          <div>
            <div className="stat-num">100%</div>
            <div className="stat-label">Free to Join</div>
          </div>
          <div>
            <div className="stat-num">Local</div>
            <div className="stat-label">Plymouth Only</div>
          </div>
        </div>
      </section>

      {/* JOB CATEGORIES */}
      <section className="section" style={{paddingTop: '0', paddingBottom: '80px'}}>
        <p className="section-label">What's available</p>
        <div className="categories">
          {[
            ['🧒', 'Babysitting'],
            ['🌿', 'Lawn Care'],
            ['📚', 'Tutoring'],
            ['🐶', 'Dog Walking'],
            ['🧹', 'House Cleaning'],
            ['🛒', 'Grocery Help'],
            ['🚗', 'Car Washing'],
            ['🎨', 'Art & Crafts'],
            ['💻', 'Tech Help'],
            ['📦', 'Moving Help'],
          ].map(([icon, label]) => (
            <div key={label} className="cat-chip">
              <span>{icon}</span> {label}
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section" id="how-it-works">
        <p className="section-label">Simple as that</p>
        <h2 className="section-title">How It<br />Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-num">01</div>
            <div className="step-icon">✍️</div>
            <div className="step-title">Create Your Profile</div>
            <p className="step-desc">Sign up in 60 seconds. Add your skills, availability, and a short bio. No resume needed.</p>
          </div>
          <div className="step">
            <div className="step-num">02</div>
            <div className="step-icon">🔍</div>
            <div className="step-title">Browse Local Jobs</div>
            <p className="step-desc">See jobs posted by families and businesses right here in Plymouth. Filter by type, pay, and distance.</p>
          </div>
          <div className="step">
            <div className="step-num">03</div>
            <div className="step-icon">💸</div>
            <div className="step-title">Apply & Get Paid</div>
            <p className="step-desc">One-click apply. Connect directly with employers. Show up, do great work, get paid.</p>
          </div>
        </div>
      </section>

      {/* FOR TEENS / FOR EMPLOYERS */}
      <div className="split" id="for-teens">
        <div className="split-card teens">
          <p className="split-card-label">For Teens</p>
          <h3 className="split-card-title">Work On<br />Your Terms</h3>
          <ul className="split-features">
            <li>Set your own hours and availability</li>
            <li>Earn $15–$30/hr for local gigs</li>
            <li>Build a portfolio and get references</li>
            <li>No experience required for most jobs</li>
            <li>100% free — always</li>
          </ul>
          <a href="/auth/signup" className="btn-dark">Create Teen Profile</a>
        </div>

        <div className="split-card employers" id="for-employers">
          <p className="split-card-label">For Employers</p>
          <h3 className="split-card-title">Hire Local<br />Teen Talent</h3>
          <ul className="split-features">
            <li>Access 500+ verified local teens</li>
            <li>Post jobs in under 2 minutes</li>
            <li>Browse profiles and reviews</li>
            <li>Direct messaging with applicants</li>
            <li>Free to post — no hidden fees</li>
          </ul>
          <a href="/jobs/post" className="btn-yellow">Post a Job Free</a>
        </div>
      </div>

      {/* CTA BANNER */}
      <div className="cta-banner">
        <h2 className="cta-title">Ready to<br />Make Moves?</h2>
        <div className="cta-right">
          <p className="cta-sub">Join hundreds of Plymouth teens already finding flexible work in their neighborhood.</p>
          <a href="/auth/signup" className="btn-dark">Get Started Free →</a>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-logo">Catalyst</div>
        <p className="footer-copy">© 2026 Catalyst · Plymouth, Indiana</p>
        <ul className="footer-links">
          <li><a href="/auth/signup">Sign Up</a></li>
          <li><a href="/auth/login">Login</a></li>
          <li><a href="/jobs">Browse Jobs</a></li>
          <li><a href="/jobs/post">Post a Job</a></li>
        </ul>
      </footer>
    </>
  )
}