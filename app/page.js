"use client";

export default function Home() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=Syne:wght@700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --yellow: #FFE033;
          --orange: #FF5C1A;
          --black: #0D0D0D;
          --white: #F5F2EB;
          --gray: #161616;
          --gray2: #1E1E1E;
          --border: rgba(255,255,255,0.08);
        }

        html { scroll-behavior: smooth; }

        body {
          background: var(--black);
          color: var(--white);
          font-family: 'Instrument Sans', sans-serif;
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
          padding: 0 40px;
          height: 64px;
          background: rgba(13,13,13,0.8);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border);
        }

        .nav-logo {
          font-family: 'Syne', sans-serif;
          font-size: 22px;
          font-weight: 800;
          color: var(--white);
          text-decoration: none;
          letter-spacing: -.01em;
        }

        .nav-logo span { color: var(--yellow); }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 8px;
          list-style: none;
        }

        .nav-links a {
          color: rgba(245,242,235,0.55);
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          padding: 7px 14px;
          border-radius: 8px;
          transition: color .15s, background .15s;
        }

        .nav-links a:hover {
          color: var(--white);
          background: rgba(255,255,255,0.06);
        }

        .nav-cta {
          background: var(--white) !important;
          color: var(--black) !important;
          font-weight: 600 !important;
          padding: 8px 18px !important;
          border-radius: 10px !important;
        }

        .nav-cta:hover {
          background: var(--yellow) !important;
          color: var(--black) !important;
        }

        /* ── HERO ── */
        .hero {
          padding: 140px 40px 80px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .hero-glow {
          position: absolute;
          top: 0; left: 50%;
          transform: translateX(-50%);
          width: 800px;
          height: 400px;
          background: radial-gradient(ellipse at 50% 0%, rgba(255,92,26,0.18) 0%, transparent 70%);
          pointer-events: none;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 100px;
          padding: 6px 16px 6px 8px;
          font-size: 13px;
          font-weight: 500;
          color: rgba(245,242,235,0.7);
          margin-bottom: 36px;
          animation: fadeUp .5s ease both;
        }

        .hero-badge-dot {
          background: var(--orange);
          color: var(--black);
          font-size: 11px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 100px;
          letter-spacing: .04em;
        }

        .hero-headline {
          font-family: 'Syne', sans-serif;
          font-size: clamp(52px, 8vw, 112px);
          font-weight: 800;
          line-height: 1;
          letter-spacing: -.03em;
          margin-bottom: 28px;
          animation: fadeUp .5s .08s ease both;
        }

        .hero-headline .orange { color: var(--orange); }
        .hero-headline .yellow { color: var(--yellow); }

        .hero-sub {
          font-size: 18px;
          font-weight: 400;
          color: rgba(245,242,235,0.5);
          max-width: 520px;
          margin: 0 auto 44px;
          line-height: 1.65;
          animation: fadeUp .5s .16s ease both;
        }

        .hero-btns {
          display: flex;
          gap: 12px;
          justify-content: center;
          margin-bottom: 72px;
          animation: fadeUp .5s .24s ease both;
        }

        .btn-white {
          background: var(--white);
          color: var(--black);
          padding: 14px 28px;
          border-radius: 12px;
          font-family: 'Instrument Sans', sans-serif;
          font-size: 15px;
          font-weight: 600;
          text-decoration: none;
          transition: background .15s, transform .15s;
          display: inline-block;
        }

        .btn-white:hover { background: var(--yellow); transform: translateY(-1px); }

        .btn-ghost {
          background: rgba(255,255,255,0.06);
          color: var(--white);
          padding: 14px 28px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.1);
          font-family: 'Instrument Sans', sans-serif;
          font-size: 15px;
          font-weight: 500;
          text-decoration: none;
          transition: background .15s, border-color .15s;
          display: inline-block;
        }

        .btn-ghost:hover {
          background: rgba(255,255,255,0.1);
          border-color: rgba(255,255,255,0.2);
        }

        /* ── STATS ── */
        .stats {
          display: flex;
          justify-content: center;
          gap: 0;
          border: 1px solid var(--border);
          border-radius: 16px;
          overflow: hidden;
          max-width: 700px;
          margin: 0 auto;
          animation: fadeUp .5s .32s ease both;
        }

        .stat {
          flex: 1;
          padding: 28px 24px;
          text-align: center;
          border-right: 1px solid var(--border);
          background: var(--gray);
        }

        .stat:last-child { border-right: none; }

        .stat-num {
          font-family: 'Syne', sans-serif;
          font-size: 36px;
          font-weight: 800;
          color: var(--yellow);
          letter-spacing: -.02em;
          line-height: 1;
        }

        .stat-label {
          font-size: 12px;
          font-weight: 500;
          color: rgba(245,242,235,0.4);
          margin-top: 6px;
          letter-spacing: .04em;
          text-transform: uppercase;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* ── SECTION ── */
        .section {
          padding: 100px 40px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .section-eyebrow {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: .14em;
          text-transform: uppercase;
          color: var(--orange);
          margin-bottom: 16px;
        }

        .section-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(36px, 5vw, 60px);
          font-weight: 800;
          letter-spacing: -.03em;
          line-height: 1.05;
          margin-bottom: 16px;
        }

        .section-sub {
          font-size: 16px;
          color: rgba(245,242,235,0.5);
          max-width: 500px;
          line-height: 1.65;
          margin-bottom: 56px;
        }

        /* ── CATEGORIES ── */
        .cats-section {
          padding: 0 40px 80px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .cats-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .cat-chip {
          background: var(--gray);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 12px 20px;
          font-size: 14px;
          font-weight: 500;
          color: rgba(245,242,235,0.65);
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: default;
          transition: background .15s, border-color .15s, color .15s, transform .15s;
        }

        .cat-chip:hover {
          background: var(--gray2);
          border-color: rgba(255,224,51,0.25);
          color: var(--white);
          transform: translateY(-2px);
        }

        .cat-chip-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: rgba(255,255,255,0.06);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          flex-shrink: 0;
        }

        /* ── FEATURE CARDS (like Whop's "all tools you need") ── */
        .feature-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .feature-card {
          background: var(--gray);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 32px;
          transition: border-color .2s, transform .2s;
          position: relative;
          overflow: hidden;
        }

        .feature-card:hover {
          border-color: rgba(255,255,255,0.15);
          transform: translateY(-3px);
        }

        .feature-card-icon {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          background: rgba(255,92,26,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          margin-bottom: 20px;
        }

        .feature-card-title {
          font-family: 'Syne', sans-serif;
          font-size: 20px;
          font-weight: 700;
          letter-spacing: -.01em;
          margin-bottom: 10px;
        }

        .feature-card-desc {
          font-size: 14px;
          font-weight: 400;
          color: rgba(245,242,235,0.45);
          line-height: 1.6;
        }

        .feature-card-preview {
          margin-top: 28px;
          background: rgba(0,0,0,0.3);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 16px;
          font-size: 12px;
          color: rgba(245,242,235,0.35);
        }

        .preview-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .preview-row:last-child { margin-bottom: 0; }

        .preview-label { color: rgba(245,242,235,0.4); font-size: 12px; }
        .preview-val { color: var(--yellow); font-weight: 700; font-size: 14px; }

        /* ── SPLIT FOR TEENS / EMPLOYERS ── */
        .split-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          padding: 0 40px 12px;
        }

        .split-card {
          border-radius: 24px;
          padding: 56px 48px;
          position: relative;
          overflow: hidden;
        }

        .split-card.teens {
          background: var(--orange);
          color: var(--black);
        }

        .split-card.employers {
          background: var(--gray);
          border: 1px solid var(--border);
          color: var(--white);
        }

        .split-eyebrow {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .16em;
          text-transform: uppercase;
          opacity: 0.5;
          margin-bottom: 16px;
        }

        .split-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(32px, 3.5vw, 52px);
          font-weight: 800;
          letter-spacing: -.03em;
          line-height: 1.05;
          margin-bottom: 32px;
        }

        .split-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 40px;
        }

        .split-list li {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 15px;
          font-weight: 500;
        }

        .split-check {
          width: 22px;
          height: 22px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-size: 12px;
        }

        .split-card.teens .split-check { background: rgba(0,0,0,0.15); }
        .split-card.employers .split-check { background: rgba(255,92,26,0.2); color: var(--orange); }

        .btn-dark {
          background: var(--black);
          color: var(--white);
          padding: 14px 28px;
          border-radius: 12px;
          font-family: 'Instrument Sans', sans-serif;
          font-size: 15px;
          font-weight: 600;
          text-decoration: none;
          display: inline-block;
          transition: opacity .15s, transform .15s;
        }

        .btn-dark:hover { opacity: .85; transform: translateY(-1px); }

        .btn-orange {
          background: var(--orange);
          color: var(--white);
          padding: 14px 28px;
          border-radius: 12px;
          font-family: 'Instrument Sans', sans-serif;
          font-size: 15px;
          font-weight: 600;
          text-decoration: none;
          display: inline-block;
          transition: opacity .15s, transform .15s;
        }

        .btn-orange:hover { opacity: .85; transform: translateY(-1px); }

        /* ── HOW IT WORKS ── */
        .steps-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .step-card {
          background: var(--gray);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 40px 32px;
          position: relative;
          overflow: hidden;
          transition: border-color .2s;
        }

        .step-card:hover { border-color: rgba(255,255,255,0.15); }

        .step-number {
          font-family: 'Syne', sans-serif;
          font-size: 72px;
          font-weight: 800;
          color: rgba(255,255,255,0.04);
          position: absolute;
          top: 16px;
          right: 24px;
          line-height: 1;
          letter-spacing: -.04em;
          pointer-events: none;
        }

        .step-icon-wrap {
          width: 52px;
          height: 52px;
          background: rgba(255,224,51,0.1);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          margin-bottom: 24px;
        }

        .step-title {
          font-family: 'Syne', sans-serif;
          font-size: 22px;
          font-weight: 700;
          letter-spacing: -.01em;
          margin-bottom: 12px;
        }

        .step-desc {
          font-size: 14px;
          color: rgba(245,242,235,0.45);
          line-height: 1.65;
        }

        /* ── FAQ ── */
        .faq-section {
          padding: 100px 40px;
          max-width: 800px;
          margin: 0 auto;
        }

        .faq-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(36px, 5vw, 60px);
          font-weight: 800;
          letter-spacing: -.03em;
          text-align: center;
          margin-bottom: 56px;
        }

        .faq-item {
          border-bottom: 1px solid var(--border);
        }

        .faq-question {
          width: 100%;
          background: none;
          border: none;
          padding: 24px 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          color: var(--white);
          font-family: 'Instrument Sans', sans-serif;
          font-size: 16px;
          font-weight: 600;
          text-align: left;
          gap: 16px;
          transition: color .15s;
        }

        .faq-question:hover { color: rgba(245,242,235,0.7); }

        .faq-arrow {
          flex-shrink: 0;
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: var(--gray);
          border: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          transition: transform .2s, background .2s;
        }

        .faq-item.open .faq-arrow {
          transform: rotate(180deg);
          background: var(--orange);
          border-color: var(--orange);
        }

        .faq-answer {
          max-height: 0;
          overflow: hidden;
          transition: max-height .3s ease, padding .3s ease;
        }

        .faq-item.open .faq-answer { max-height: 200px; }

        .faq-answer-inner {
          padding-bottom: 24px;
          font-size: 15px;
          color: rgba(245,242,235,0.5);
          line-height: 1.7;
        }

        /* ── CTA BANNER ── */
        .cta-section {
          margin: 0 40px 40px;
          border-radius: 28px;
          overflow: hidden;
          position: relative;
          background: var(--orange);
          padding: 80px 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 48px;
        }

        .cta-section::before {
          content: 'CATALYST';
          position: absolute;
          right: -20px;
          top: 50%;
          transform: translateY(-50%);
          font-family: 'Syne', sans-serif;
          font-size: 180px;
          font-weight: 800;
          color: rgba(0,0,0,0.08);
          white-space: nowrap;
          pointer-events: none;
          letter-spacing: -.04em;
        }

        .cta-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(40px, 6vw, 80px);
          font-weight: 800;
          color: var(--black);
          letter-spacing: -.03em;
          line-height: 1;
        }

        .cta-right {
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 20px;
          position: relative;
          z-index: 1;
        }

        .cta-sub {
          font-size: 16px;
          color: rgba(0,0,0,0.6);
          max-width: 260px;
          line-height: 1.6;
          font-weight: 500;
        }

        /* ── FOOTER ── */
        .footer {
          padding: 48px 40px;
          border-top: 1px solid var(--border);
          display: grid;
          grid-template-columns: 200px 1fr auto;
          gap: 48px;
          align-items: start;
        }

        .footer-logo {
          font-family: 'Syne', sans-serif;
          font-size: 22px;
          font-weight: 800;
          color: var(--white);
          letter-spacing: -.01em;
          margin-bottom: 10px;
        }

        .footer-logo span { color: var(--yellow); }

        .footer-tagline {
          font-size: 13px;
          color: rgba(245,242,235,0.3);
          line-height: 1.5;
        }

        .footer-links {
          display: flex;
          gap: 64px;
        }

        .footer-col-title {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: .1em;
          text-transform: uppercase;
          color: rgba(245,242,235,0.35);
          margin-bottom: 16px;
        }

        .footer-col ul {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .footer-col ul a {
          font-size: 14px;
          color: rgba(245,242,235,0.5);
          text-decoration: none;
          transition: color .15s;
        }

        .footer-col ul a:hover { color: var(--white); }

        .footer-copy {
          font-size: 12px;
          color: rgba(245,242,235,0.2);
          white-space: nowrap;
          padding-top: 4px;
        }

        @media (max-width: 960px) {
          .nav { padding: 0 20px; }
          .nav-links { display: none; }
          .hero { padding: 100px 20px 60px; }
          .hero-btns { flex-direction: column; align-items: center; }
          .stats { max-width: 100%; flex-wrap: wrap; }
          .stat { border-right: none; border-bottom: 1px solid var(--border); min-width: 140px; }
          .stat:last-child { border-bottom: none; }
          .cats-section { padding: 0 20px 60px; }
          .section { padding: 64px 20px; }
          .feature-grid { grid-template-columns: 1fr; }
          .steps-grid { grid-template-columns: 1fr; }
          .split-section { grid-template-columns: 1fr; padding: 0 20px 12px; }
          .cta-section { flex-direction: column; margin: 0 20px 20px; padding: 48px 32px; }
          .cta-section::before { display: none; }
          .footer { grid-template-columns: 1fr; gap: 32px; padding: 40px 20px; }
          .footer-links { flex-wrap: wrap; gap: 32px; }
          .faq-section { padding: 64px 20px; }
        }
      `}</style>

      {/* ── NAV ── */}
      <nav className="nav">
        <a href="/" className="nav-logo">Catalyst<span>.</span></a>
        <ul className="nav-links">
          <li><a href="#how-it-works">How It Works</a></li>
          <li><a href="#for-teens">For Teens</a></li>
          <li><a href="#for-employers">For Employers</a></li>
          <li><a href="/jobs">Browse Jobs</a></li>
          <li><a href="/auth/signup" className="nav-cta">Get Started →</a></li>
        </ul>
      </nav>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-glow" />
        <div className="hero-badge">
          <span className="hero-badge-dot">LIVE</span>
          Now in Plymouth, Indiana
        </div>
        <h1 className="hero-headline">
          Your first job,<br />
          <span className="orange">your</span> <span className="yellow">rules.</span>
        </h1>
        <p className="hero-sub">
          The job board built for teens in Plymouth. Babysit, mow lawns, tutor, walk dogs — on your schedule. No resume needed.
        </p>
        <div className="hero-btns">
          <a href="/auth/signup" className="btn-white">Start earning today →</a>
          <a href="/jobs/post" className="btn-ghost">Post a job</a>
        </div>
        <div className="stats">
          <div className="stat">
            <div className="stat-num">530+</div>
            <div className="stat-label">Teens in Plymouth</div>
          </div>
          <div className="stat">
            <div className="stat-num">$20</div>
            <div className="stat-label">Avg. Hourly Rate</div>
          </div>
          <div className="stat">
            <div className="stat-num">100%</div>
            <div className="stat-label">Free to Join</div>
          </div>
          <div className="stat">
            <div className="stat-num">Local</div>
            <div className="stat-label">Plymouth Only</div>
          </div>
        </div>
      </section>

      {/* ── JOB CATEGORIES ── */}
      <div className="cats-section">
        <div style={{fontSize:'12px', fontWeight:'700', letterSpacing:'.14em', textTransform:'uppercase', color:'rgba(245,242,235,0.3)', marginBottom:'20px'}}>WHAT'S AVAILABLE</div>
        <div className="cats-grid">
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
            ['❓', 'And more...'],
          ].map(([icon, label]) => (
            <div key={label} className="cat-chip">
              <div className="cat-chip-icon">{icon}</div>
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* ── ALL THE TOOLS (Feature cards like Whop) ── */}
      <section className="section" id="features">
        <p className="section-eyebrow">Everything you need</p>
        <h2 className="section-title">All the tools to<br />land your first gig</h2>
        <p className="section-sub">Your profile, jobs, and connections — all in one place. Built for Plymouth teens.</p>
        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-card-icon">✍️</div>
            <div className="feature-card-title">Your Profile</div>
            <p className="feature-card-desc">Build a profile in 60 seconds. Add your skills, a photo, and availability. Employers can find you.</p>
            <div className="feature-card-preview">
              <div className="preview-row">
                <span className="preview-label">Profile Views</span>
                <span className="preview-val">124</span>
              </div>
              <div className="preview-row">
                <span className="preview-label">Applications Sent</span>
                <span className="preview-val">8</span>
              </div>
              <div className="preview-row">
                <span className="preview-label">Jobs Completed</span>
                <span className="preview-val">3 ⭐</span>
              </div>
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-card-icon">💸</div>
            <div className="feature-card-title">Direct Payments</div>
            <p className="feature-card-desc">Agree on a rate, do the work, get paid. Employers connect with you directly — no middleman taking a cut.</p>
            <div className="feature-card-preview">
              <div className="preview-row">
                <span className="preview-label">This Week</span>
                <span className="preview-val" style={{color:'#4ade80'}}>+$120.00</span>
              </div>
              <div className="preview-row">
                <span className="preview-label">Avg. Hourly</span>
                <span className="preview-val">$20/hr</span>
              </div>
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-card-icon">⭐</div>
            <div className="feature-card-title">Reviews & Trust</div>
            <p className="feature-card-desc">Every job builds your reputation. Reviews from employers help you stand out and land better gigs over time.</p>
            <div className="feature-card-preview">
              <div className="preview-row">
                <span className="preview-label">Your Rating</span>
                <span className="preview-val">4.9 / 5.0</span>
              </div>
              <div className="preview-row">
                <span className="preview-label">Total Reviews</span>
                <span className="preview-val">12</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="section" id="how-it-works" style={{paddingTop: '0'}}>
        <p className="section-eyebrow">Simple as that</p>
        <h2 className="section-title">How Catalyst works</h2>
        <p className="section-sub">Three steps from sign-up to getting paid. No applications, no experience required.</p>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">01</div>
            <div className="step-icon-wrap">✍️</div>
            <div className="step-title">Create Your Profile</div>
            <p className="step-desc">Sign up in 60 seconds. Add your skills, availability, and a short bio. No resume needed.</p>
          </div>
          <div className="step-card">
            <div className="step-number">02</div>
            <div className="step-icon-wrap">🔍</div>
            <div className="step-title">Browse Local Jobs</div>
            <p className="step-desc">See jobs posted by families and businesses right here in Plymouth. Filter by type, pay, and distance.</p>
          </div>
          <div className="step-card">
            <div className="step-number">03</div>
            <div className="step-icon-wrap">💸</div>
            <div className="step-title">Apply & Get Paid</div>
            <p className="step-desc">One-click apply. Connect directly with employers. Show up, do great work, get paid.</p>
          </div>
        </div>
      </section>

      {/* ── FOR TEENS / FOR EMPLOYERS ── */}
      <div className="split-section" id="for-teens">
        <div className="split-card teens">
          <p className="split-eyebrow">For Teens</p>
          <h3 className="split-title">Work on your terms</h3>
          <ul className="split-list">
            {[
              'Set your own hours and availability',
              'Earn $15–$30/hr for local gigs',
              'Build a portfolio and get references',
              'No experience required for most jobs',
              '100% free — always',
            ].map(item => (
              <li key={item}>
                <span className="split-check">✓</span>
                {item}
              </li>
            ))}
          </ul>
          <a href="/auth/signup" className="btn-dark">Create Teen Profile →</a>
        </div>
        <div className="split-card employers" id="for-employers">
          <p className="split-eyebrow">For Employers</p>
          <h3 className="split-title">Hire local teen talent</h3>
          <ul className="split-list">
            {[
              'Access 530+ verified local teens',
              'Post jobs in under 2 minutes',
              'Browse profiles and reviews',
              'Direct messaging with applicants',
              'Free to post — no hidden fees',
            ].map(item => (
              <li key={item}>
                <span className="split-check">✓</span>
                {item}
              </li>
            ))}
          </ul>
          <a href="/jobs/post" className="btn-orange">Post a Job Free →</a>
        </div>
      </div>

      {/* ── FAQ ── */}
      <div className="faq-section">
        <h2 className="faq-title">Frequently asked questions</h2>
        {[
          {
            q: 'Who can use Catalyst?',
            a: 'Any teen aged 13–19 living in Plymouth, Indiana can sign up for free. Employers (families, local businesses, neighbors) can also post jobs for free.'
          },
          {
            q: 'Is Catalyst really free?',
            a: 'Yes — 100% free for teens and employers. We never charge fees, commissions, or hidden costs. Teens and employers agree on rates directly.'
          },
          {
            q: 'What kinds of jobs are available?',
            a: 'Babysitting, lawn care, tutoring, dog walking, house cleaning, grocery help, car washing, tech help, and more. New categories are added based on community demand.'
          },
          {
            q: 'Do I need experience to apply?',
            a: 'Most jobs on Catalyst don\'t require prior experience. Employers are often neighbors looking for reliable, local teens — your attitude matters more than a resume.'
          },
          {
            q: 'How do I get paid?',
            a: 'Payment is handled directly between you and the employer — cash, Venmo, PayPal, or whatever you agree on. Catalyst doesn\'t process or hold payments.'
          },
        ].map((item, i) => (
          <div
            key={i}
            className="faq-item"
            onClick={e => {
              const el = e.currentTarget;
              el.classList.toggle('open');
            }}
          >
            <button className="faq-question">
              {item.q}
              <span className="faq-arrow">↓</span>
            </button>
            <div className="faq-answer">
              <div className="faq-answer-inner">{item.a}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── CTA BANNER ── */}
      <div className="cta-section">
        <h2 className="cta-title">Start earning<br />with Catalyst.</h2>
        <div className="cta-right">
          <p className="cta-sub">Join hundreds of Plymouth teens already finding flexible work in their neighborhood.</p>
          <a href="/auth/signup" className="btn-dark">Get started free →</a>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div>
          <div className="footer-logo">Catalyst<span>.</span></div>
          <p className="footer-tagline">The job board for<br />Plymouth teens.</p>
        </div>
        <div className="footer-links">
          <div className="footer-col">
            <div className="footer-col-title">Platform</div>
            <ul>
              <li><a href="/jobs">Browse Jobs</a></li>
              <li><a href="/jobs/post">Post a Job</a></li>
              <li><a href="#how-it-works">How It Works</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <div className="footer-col-title">Account</div>
            <ul>
              <li><a href="/auth/signup">Sign Up</a></li>
              <li><a href="/auth/login">Login</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <div className="footer-col-title">Info</div>
            <ul>
              <li><a href="#">About</a></li>
              <li><a href="#">Privacy</a></li>
              <li><a href="#">Terms</a></li>
            </ul>
          </div>
        </div>
        <p className="footer-copy">© 2026 Catalyst · Plymouth, Indiana</p>
      </footer>
    </>
  )
}