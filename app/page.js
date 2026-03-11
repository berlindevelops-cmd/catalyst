"use client";
import { useState } from "react";

export default function Home() {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    { q: "Who can use Catalyst?", a: "Any teen aged 13–19 living in Plymouth, Indiana can sign up for free. Families and local businesses can post jobs for free too." },
    { q: "Is Catalyst really free?", a: "Yes — 100% free for teens and employers. No fees, no commissions, no hidden costs. You and the employer agree on rates directly." },
    { q: "What kinds of jobs are available?", a: "Babysitting, lawn care, tutoring, dog walking, house cleaning, grocery help, car washing, tech help, and more. New categories added based on what the community needs." },
    { q: "Do I need experience?", a: "Most jobs don't require any prior experience. Employers are often neighbors looking for reliable local teens — your attitude matters more than a resume." },
    { q: "How do I get paid?", a: "Payment is handled directly between you and the employer — cash, Venmo, PayPal, whatever you both agree on. Catalyst doesn't process or hold payments." },
  ];

  const categories = [
    ["🧒", "Babysitting", "#FFE033"],
    ["🌿", "Lawn Care", "#a8f0a0"],
    ["📚", "Tutoring", "#c0d8ff"],
    ["🐶", "Dog Walking", "#ffd6a5"],
    ["🧹", "House Cleaning", "#e0c8ff"],
    ["🛒", "Grocery Help", "#ffc8c8"],
    ["🚗", "Car Washing", "#c8f0e8"],
    ["💻", "Tech Help", "#d0e8ff"],
    ["📦", "Moving Help", "#ffe0b0"],
    ["❓", "And more...", "#f0f0f0"],
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@400;700;900&family=Nunito:wght@400;500;600;700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --orange: #FF5C1A;
          --yellow: #FFE033;
          --black: #111111;
          --white: #FEFCF7;
          --cream: #FFF6E8;
          --border: #111111;
          --shadow: 4px 4px 0px #111111;
          --shadow-lg: 6px 6px 0px #111111;
          --shadow-xl: 8px 8px 0px #111111;
        }

        html { scroll-behavior: smooth; }

        body {
          background: var(--white);
          color: var(--black);
          font-family: 'Nunito', sans-serif;
          overflow-x: hidden;
        }

        /* ── TEXTURE OVERLAY ── */
        body::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 0;
          opacity: 0.4;
        }

        /* ── NAV ── */
        .nav {
          position: sticky;
          top: 0;
          z-index: 100;
          background: var(--orange);
          border-bottom: 3px solid var(--black);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 40px;
          height: 60px;
        }

        .nav-logo {
          font-family: 'Unbounded', sans-serif;
          font-size: 20px;
          font-weight: 900;
          color: var(--black);
          text-decoration: none;
          letter-spacing: -.02em;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .nav-logo-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--black);
          display: inline-block;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 6px;
          list-style: none;
        }

        .nav-links a {
          color: var(--black);
          text-decoration: none;
          font-size: 13px;
          font-weight: 700;
          padding: 6px 14px;
          border-radius: 6px;
          transition: background .15s;
          letter-spacing: .01em;
        }

        .nav-links a:hover { background: rgba(0,0,0,0.1); }

        .nav-cta {
          background: var(--black) !important;
          color: var(--white) !important;
          border-radius: 8px !important;
          border: 2px solid var(--black) !important;
        }

        .nav-cta:hover {
          background: var(--yellow) !important;
          color: var(--black) !important;
        }

        /* ── HERO ── */
        .hero {
          background: var(--cream);
          border-bottom: 3px solid var(--black);
          padding: 72px 40px 80px;
          position: relative;
          overflow: hidden;
        }

        .hero-bg-text {
          position: absolute;
          bottom: -20px;
          right: -20px;
          font-family: 'Unbounded', sans-serif;
          font-size: 200px;
          font-weight: 900;
          color: rgba(255,92,26,0.06);
          white-space: nowrap;
          pointer-events: none;
          letter-spacing: -.05em;
          line-height: 1;
          user-select: none;
        }

        .hero-inner {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 64px;
          align-items: center;
          position: relative;
          z-index: 1;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: var(--yellow);
          border: 2px solid var(--black);
          border-radius: 100px;
          padding: 5px 14px 5px 8px;
          font-size: 12px;
          font-weight: 800;
          color: var(--black);
          margin-bottom: 28px;
          box-shadow: 2px 2px 0 var(--black);
          letter-spacing: .04em;
          text-transform: uppercase;
          animation: fadeUp .4s ease both;
        }

        .badge-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--orange);
          border: 1.5px solid var(--black);
          flex-shrink: 0;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.3); }
        }

        .hero-headline {
          font-family: 'Unbounded', sans-serif;
          font-size: clamp(42px, 6vw, 82px);
          font-weight: 900;
          line-height: 1.0;
          letter-spacing: -.04em;
          margin-bottom: 24px;
          animation: fadeUp .4s .07s ease both;
        }

        .highlight {
          background: var(--yellow);
          padding: 2px 8px;
          border-radius: 4px;
          display: inline;
          border: 2px solid var(--black);
          position: relative;
        }

        .highlight-orange {
          background: var(--orange);
          color: var(--white);
          padding: 2px 8px;
          border-radius: 4px;
          display: inline;
          border: 2px solid var(--black);
        }

        .hero-sub {
          font-size: 17px;
          font-weight: 600;
          color: #444;
          max-width: 480px;
          margin-bottom: 40px;
          line-height: 1.65;
          animation: fadeUp .4s .14s ease both;
        }

        .hero-btns {
          display: flex;
          gap: 14px;
          animation: fadeUp .4s .21s ease both;
          flex-wrap: wrap;
        }

        .btn-primary {
          background: var(--orange);
          color: var(--white);
          padding: 14px 28px;
          border-radius: 10px;
          font-family: 'Nunito', sans-serif;
          font-size: 15px;
          font-weight: 800;
          text-decoration: none;
          border: 2.5px solid var(--black);
          box-shadow: var(--shadow);
          transition: transform .12s, box-shadow .12s;
          display: inline-block;
          letter-spacing: .01em;
        }

        .btn-primary:hover {
          transform: translate(-2px, -2px);
          box-shadow: var(--shadow-lg);
        }

        .btn-primary:active {
          transform: translate(2px, 2px);
          box-shadow: none;
        }

        .btn-secondary {
          background: var(--white);
          color: var(--black);
          padding: 14px 28px;
          border-radius: 10px;
          font-family: 'Nunito', sans-serif;
          font-size: 15px;
          font-weight: 800;
          text-decoration: none;
          border: 2.5px solid var(--black);
          box-shadow: var(--shadow);
          transition: transform .12s, box-shadow .12s;
          display: inline-block;
        }

        .btn-secondary:hover {
          transform: translate(-2px, -2px);
          box-shadow: var(--shadow-lg);
          background: var(--yellow);
        }

        .btn-secondary:active {
          transform: translate(2px, 2px);
          box-shadow: none;
        }

        /* ── HERO CARD (right side) ── */
        .hero-card {
          background: var(--white);
          border: 3px solid var(--black);
          border-radius: 20px;
          box-shadow: var(--shadow-xl);
          padding: 28px;
          animation: fadeUp .4s .28s ease both;
          transform: rotate(1.5deg);
          transition: transform .2s;
        }

        .hero-card:hover { transform: rotate(0deg); }

        .hero-card-title {
          font-family: 'Unbounded', sans-serif;
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: .08em;
          color: #888;
          margin-bottom: 16px;
        }

        .job-preview {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .job-item {
          background: var(--cream);
          border: 2px solid var(--black);
          border-radius: 12px;
          padding: 14px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          transition: transform .12s, box-shadow .12s;
          cursor: default;
        }

        .job-item:hover {
          transform: translate(-2px, -2px);
          box-shadow: 3px 3px 0 var(--black);
        }

        .job-item-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .job-emoji {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          border: 2px solid var(--black);
          background: var(--yellow);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
        }

        .job-name {
          font-size: 14px;
          font-weight: 800;
          color: var(--black);
        }

        .job-location {
          font-size: 12px;
          color: #777;
          font-weight: 600;
        }

        .job-pay {
          font-family: 'Unbounded', sans-serif;
          font-size: 13px;
          font-weight: 700;
          color: var(--orange);
          white-space: nowrap;
          background: #fff0eb;
          border: 1.5px solid var(--orange);
          padding: 4px 10px;
          border-radius: 6px;
        }

        .hero-card-footer {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 2px dashed #ddd;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .hero-card-stat {
          text-align: center;
        }

        .hero-card-stat-num {
          font-family: 'Unbounded', sans-serif;
          font-size: 22px;
          font-weight: 900;
          color: var(--black);
        }

        .hero-card-stat-label {
          font-size: 11px;
          font-weight: 700;
          color: #999;
          text-transform: uppercase;
          letter-spacing: .06em;
        }

        /* ── TICKER STRIP ── */
        .ticker {
          background: var(--yellow);
          border-top: 3px solid var(--black);
          border-bottom: 3px solid var(--black);
          overflow: hidden;
          white-space: nowrap;
          padding: 12px 0;
        }

        .ticker-inner {
          display: inline-flex;
          animation: ticker 20s linear infinite;
          gap: 0;
        }

        .ticker-item {
          font-family: 'Unbounded', sans-serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: .04em;
          color: var(--black);
          padding: 0 32px;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .ticker-item::after {
          content: '★';
          color: var(--orange);
          font-size: 12px;
        }

        @keyframes ticker {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        /* ── CATEGORIES ── */
        .cats-section {
          padding: 80px 40px;
          max-width: 1100px;
          margin: 0 auto;
        }

        .section-label {
          font-family: 'Unbounded', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .18em;
          text-transform: uppercase;
          color: var(--orange);
          margin-bottom: 12px;
        }

        .section-title {
          font-family: 'Unbounded', sans-serif;
          font-size: clamp(28px, 4vw, 52px);
          font-weight: 900;
          letter-spacing: -.04em;
          line-height: 1.05;
          margin-bottom: 12px;
        }

        .section-sub {
          font-size: 16px;
          font-weight: 600;
          color: #666;
          margin-bottom: 48px;
          max-width: 500px;
          line-height: 1.6;
        }

        .cats-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .cat-chip {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 18px 10px 10px;
          border: 2.5px solid var(--black);
          border-radius: 12px;
          font-size: 14px;
          font-weight: 800;
          color: var(--black);
          cursor: default;
          box-shadow: 3px 3px 0 var(--black);
          transition: transform .12s, box-shadow .12s;
          background: var(--white);
        }

        .cat-chip:hover {
          transform: translate(-2px, -2px);
          box-shadow: 5px 5px 0 var(--black);
        }

        .cat-icon {
          width: 34px;
          height: 34px;
          border-radius: 8px;
          border: 2px solid var(--black);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          flex-shrink: 0;
        }

        /* ── SPLIT CARDS ── */
        .split-wrapper {
          padding: 0 40px 80px;
        }

        .split-section {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .split-card {
          border: 3px solid var(--black);
          border-radius: 24px;
          padding: 52px 48px;
          position: relative;
          overflow: hidden;
          box-shadow: var(--shadow-xl);
        }

        .split-card.teens {
          background: var(--orange);
          color: var(--black);
        }

        .split-card.employers {
          background: var(--cream);
          color: var(--black);
        }

        .split-eyebrow {
          font-family: 'Unbounded', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .16em;
          text-transform: uppercase;
          opacity: 0.6;
          margin-bottom: 14px;
        }

        .split-title {
          font-family: 'Unbounded', sans-serif;
          font-size: clamp(28px, 3vw, 44px);
          font-weight: 900;
          letter-spacing: -.04em;
          line-height: 1.05;
          margin-bottom: 32px;
        }

        .split-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-bottom: 40px;
        }

        .split-list li {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 15px;
          font-weight: 700;
        }

        .split-check {
          width: 26px;
          height: 26px;
          border-radius: 7px;
          border: 2px solid var(--black);
          background: var(--black);
          color: var(--white);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 800;
          flex-shrink: 0;
        }

        .split-card.employers .split-check {
          background: var(--orange);
          border-color: var(--black);
          color: var(--white);
        }

        .btn-dark {
          background: var(--black);
          color: var(--white);
          padding: 14px 28px;
          border-radius: 10px;
          font-family: 'Nunito', sans-serif;
          font-size: 15px;
          font-weight: 800;
          text-decoration: none;
          border: 2.5px solid var(--black);
          box-shadow: 4px 4px 0 rgba(0,0,0,0.25);
          transition: transform .12s, box-shadow .12s;
          display: inline-block;
        }

        .btn-dark:hover {
          transform: translate(-2px, -2px);
          box-shadow: 6px 6px 0 rgba(0,0,0,0.25);
          background: var(--yellow);
          color: var(--black);
        }

        .btn-orange-outline {
          background: var(--orange);
          color: var(--white);
          padding: 14px 28px;
          border-radius: 10px;
          font-family: 'Nunito', sans-serif;
          font-size: 15px;
          font-weight: 800;
          text-decoration: none;
          border: 2.5px solid var(--black);
          box-shadow: var(--shadow);
          transition: transform .12s, box-shadow .12s;
          display: inline-block;
        }

        .btn-orange-outline:hover {
          transform: translate(-2px, -2px);
          box-shadow: var(--shadow-lg);
        }

        /* ── HOW IT WORKS ── */
        .hiw-section {
          background: var(--black);
          border-top: 3px solid var(--black);
          border-bottom: 3px solid var(--black);
          padding: 80px 40px;
        }

        .hiw-inner {
          max-width: 1100px;
          margin: 0 auto;
        }

        .hiw-section .section-label { color: var(--yellow); }
        .hiw-section .section-title { color: var(--white); }
        .hiw-section .section-sub { color: rgba(255,255,255,0.45); }

        .steps-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .step-card {
          background: #1A1A1A;
          border: 2.5px solid #333;
          border-radius: 20px;
          padding: 36px 28px;
          position: relative;
          overflow: hidden;
          transition: border-color .2s, transform .12s;
        }

        .step-card:hover {
          border-color: var(--orange);
          transform: translateY(-4px);
        }

        .step-number {
          font-family: 'Unbounded', sans-serif;
          font-size: 80px;
          font-weight: 900;
          color: rgba(255,255,255,0.04);
          position: absolute;
          top: 8px;
          right: 16px;
          line-height: 1;
          pointer-events: none;
          letter-spacing: -.05em;
        }

        .step-icon {
          width: 54px;
          height: 54px;
          background: var(--yellow);
          border: 2.5px solid #555;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          margin-bottom: 24px;
        }

        .step-title {
          font-family: 'Unbounded', sans-serif;
          font-size: 18px;
          font-weight: 700;
          letter-spacing: -.02em;
          margin-bottom: 12px;
          color: var(--white);
        }

        .step-desc {
          font-size: 14px;
          color: rgba(255,255,255,0.45);
          line-height: 1.65;
          font-weight: 600;
        }

        /* ── FAQ ── */
        .faq-section {
          padding: 80px 40px;
          max-width: 760px;
          margin: 0 auto;
        }

        .faq-section .section-title { text-align: center; margin-bottom: 48px; }

        .faq-item {
          border: 2.5px solid var(--black);
          border-radius: 14px;
          margin-bottom: 10px;
          overflow: hidden;
          box-shadow: 3px 3px 0 var(--black);
          transition: box-shadow .12s, transform .12s;
        }

        .faq-item:hover {
          box-shadow: 5px 5px 0 var(--black);
          transform: translate(-1px, -1px);
        }

        .faq-question {
          width: 100%;
          background: var(--cream);
          border: none;
          padding: 20px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          color: var(--black);
          font-family: 'Nunito', sans-serif;
          font-size: 15px;
          font-weight: 800;
          text-align: left;
          gap: 16px;
          transition: background .15s;
        }

        .faq-question:hover { background: #fff0d8; }

        .faq-item.open .faq-question { background: var(--yellow); }

        .faq-arrow {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          background: var(--black);
          color: var(--white);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          flex-shrink: 0;
          transition: transform .2s;
        }

        .faq-item.open .faq-arrow { transform: rotate(180deg); background: var(--orange); }

        .faq-answer {
          max-height: 0;
          overflow: hidden;
          transition: max-height .3s ease;
          background: var(--white);
        }

        .faq-item.open .faq-answer { max-height: 180px; }

        .faq-answer-inner {
          padding: 20px 24px 24px;
          font-size: 15px;
          color: #555;
          line-height: 1.7;
          font-weight: 600;
          border-top: 2px solid #eee;
        }

        /* ── CTA BANNER ── */
        .cta-section {
          margin: 0 40px 60px;
          border-radius: 24px;
          background: var(--orange);
          border: 3px solid var(--black);
          box-shadow: var(--shadow-xl);
          padding: 72px 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 48px;
          position: relative;
          overflow: hidden;
        }

        .cta-bg {
          position: absolute;
          right: -40px;
          top: 50%;
          transform: translateY(-50%);
          font-family: 'Unbounded', sans-serif;
          font-size: 200px;
          font-weight: 900;
          color: rgba(0,0,0,0.07);
          white-space: nowrap;
          pointer-events: none;
          letter-spacing: -.05em;
          user-select: none;
        }

        .cta-title {
          font-family: 'Unbounded', sans-serif;
          font-size: clamp(36px, 5vw, 64px);
          font-weight: 900;
          color: var(--white);
          letter-spacing: -.04em;
          line-height: 1.0;
          position: relative;
          z-index: 1;
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
          color: rgba(255,255,255,0.75);
          max-width: 260px;
          line-height: 1.6;
          font-weight: 700;
        }

        .btn-white-solid {
          background: var(--white);
          color: var(--black);
          padding: 14px 28px;
          border-radius: 10px;
          font-family: 'Nunito', sans-serif;
          font-size: 15px;
          font-weight: 800;
          text-decoration: none;
          border: 2.5px solid var(--black);
          box-shadow: var(--shadow);
          transition: transform .12s, box-shadow .12s, background .12s;
          display: inline-block;
        }

        .btn-white-solid:hover {
          transform: translate(-2px, -2px);
          box-shadow: var(--shadow-lg);
          background: var(--yellow);
        }

        /* ── FOOTER ── */
        .footer {
          background: var(--black);
          border-top: 3px solid var(--black);
          padding: 48px 40px;
          display: grid;
          grid-template-columns: 220px 1fr auto;
          gap: 48px;
          align-items: start;
        }

        .footer-logo {
          font-family: 'Unbounded', sans-serif;
          font-size: 20px;
          font-weight: 900;
          color: var(--white);
          letter-spacing: -.02em;
          margin-bottom: 10px;
        }

        .footer-logo span { color: var(--orange); }

        .footer-tagline {
          font-size: 13px;
          color: rgba(255,255,255,0.3);
          line-height: 1.5;
          font-weight: 600;
        }

        .footer-links {
          display: flex;
          gap: 64px;
        }

        .footer-col-title {
          font-family: 'Unbounded', sans-serif;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: .12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
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
          color: rgba(255,255,255,0.5);
          text-decoration: none;
          font-weight: 700;
          transition: color .15s;
        }

        .footer-col ul a:hover { color: var(--yellow); }

        .footer-copy {
          font-size: 12px;
          color: rgba(255,255,255,0.2);
          white-space: nowrap;
          padding-top: 4px;
          font-weight: 600;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* ── MOBILE ── */
        @media (max-width: 960px) {
          .nav { padding: 0 20px; }
          .nav-links { display: none; }
          .hero { padding: 72px 20px 60px; }
          .hero-inner { grid-template-columns: 1fr; gap: 40px; }
          .hero-bg-text { display: none; }
          .hero-btns { flex-direction: column; align-items: stretch; }
          .cats-section { padding: 60px 20px; }
          .split-wrapper { padding: 0 20px 60px; }
          .split-section { grid-template-columns: 1fr; }
          .hiw-section { padding: 60px 20px; }
          .steps-grid { grid-template-columns: 1fr; }
          .faq-section { padding: 60px 20px; }
          .cta-section { flex-direction: column; margin: 0 20px 40px; padding: 48px 32px; }
          .cta-bg { display: none; }
          .footer { grid-template-columns: 1fr; gap: 32px; padding: 40px 20px; }
          .footer-links { flex-wrap: wrap; gap: 32px; }
        }
      `}</style>

      {/* NAV */}
      <nav className="nav">
        <a href="/" className="nav-logo">
          <span className="nav-logo-dot" />
          Catalyst
        </a>
        <ul className="nav-links">
          <li><a href="#how-it-works">How It Works</a></li>
          <li><a href="#for-teens">For Teens</a></li>
          <li><a href="#for-employers">For Employers</a></li>
          <li><a href="/jobs">Browse Jobs</a></li>
          <li><a href="/auth/signup" className="nav-cta">Get Started →</a></li>
        </ul>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg-text">CATALYST</div>
        <div className="hero-inner">
          <div>
            <div className="hero-badge">
              <div className="badge-dot" />
              Now Live · Plymouth, Indiana
            </div>
            <h1 className="hero-headline">
              Your first job,<br />
              <span className="highlight">your</span>{" "}
              <span className="highlight-orange">rules.</span>
            </h1>
            <p className="hero-sub">
              The job board built for teens in Plymouth. Babysit, mow lawns, tutor, walk dogs — on your schedule. No resume needed.
            </p>
            <div className="hero-btns">
              <a href="/auth/signup" className="btn-primary">Start earning today →</a>
              <a href="/jobs/post" className="btn-secondary">Post a job</a>
            </div>
          </div>

          {/* FLOATING CARD */}
          <div className="hero-card">
            <div className="hero-card-title">📍 Jobs near you</div>
            <div className="job-preview">
              {[
                { emoji: "🧒", name: "Babysitter Needed", loc: "0.4 mi away", pay: "$20/hr" },
                { emoji: "🌿", name: "Lawn Mowing", loc: "0.8 mi away", pay: "$45/job" },
                { emoji: "📚", name: "Math Tutor", loc: "1.2 mi away", pay: "$25/hr" },
              ].map(job => (
                <div key={job.name} className="job-item">
                  <div className="job-item-left">
                    <div className="job-emoji">{job.emoji}</div>
                    <div>
                      <div className="job-name">{job.name}</div>
                      <div className="job-location">{job.loc}</div>
                    </div>
                  </div>
                  <div className="job-pay">{job.pay}</div>
                </div>
              ))}
            </div>
            <div className="hero-card-footer">
              {[["530+", "Teens"], ["$20", "Avg/hr"], ["Free", "Always"]].map(([num, label]) => (
                <div key={label} className="hero-card-stat">
                  <div className="hero-card-stat-num">{num}</div>
                  <div className="hero-card-stat-label">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div className="ticker">
        <div className="ticker-inner">
          {["Babysitting", "Lawn Care", "Tutoring", "Dog Walking", "Car Washing", "House Cleaning", "Tech Help", "Moving Help", "Grocery Help", "Babysitting", "Lawn Care", "Tutoring", "Dog Walking", "Car Washing", "House Cleaning", "Tech Help", "Moving Help", "Grocery Help"].map((item, i) => (
            <span key={i} className="ticker-item">{item}</span>
          ))}
        </div>
      </div>

      {/* CATEGORIES */}
      <section className="cats-section">
        <p className="section-label">What's Available</p>
        <h2 className="section-title">Find work in<br />your neighborhood</h2>
        <p className="section-sub">Dozens of job types posted by families and businesses right here in Plymouth.</p>
        <div className="cats-grid">
          {categories.map(([icon, label, color]) => (
            <div key={label} className="cat-chip">
              <div className="cat-icon" style={{ background: color }}>{icon}</div>
              {label}
            </div>
          ))}
        </div>
      </section>

      {/* SPLIT CARDS */}
      <div className="split-wrapper">
        <div className="split-section">
          <div className="split-card teens" id="for-teens">
            <p className="split-eyebrow">For Teens</p>
            <h3 className="split-title">Work on your terms</h3>
            <ul className="split-list">
              {[
                "Set your own hours and availability",
                "Earn $15–$30/hr for local gigs",
                "Build a portfolio and get references",
                "No experience required for most jobs",
                "100% free — always",
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
                "Access 530+ verified local teens",
                "Post jobs in under 2 minutes",
                "Browse profiles and reviews",
                "Direct messaging with applicants",
                "Free to post — no hidden fees",
              ].map(item => (
                <li key={item}>
                  <span className="split-check">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <a href="/jobs/post" className="btn-orange-outline">Post a Job Free →</a>
          </div>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <section className="hiw-section" id="how-it-works">
        <div className="hiw-inner">
          <p className="section-label">Simple as that</p>
          <h2 className="section-title">How Catalyst works</h2>
          <p className="section-sub" style={{marginBottom: '48px'}}>Three steps from sign-up to getting paid. No applications, no experience required.</p>
          <div className="steps-grid">
            {[
              { n: "01", icon: "✍️", title: "Create Your Profile", desc: "Sign up in 60 seconds. Add your skills, availability, and a short bio. No resume needed." },
              { n: "02", icon: "🔍", title: "Browse Local Jobs", desc: "See jobs posted by families and businesses in Plymouth. Filter by type, pay, and distance." },
              { n: "03", icon: "💸", title: "Apply & Get Paid", desc: "One-click apply. Connect directly with employers. Show up, do great work, get paid." },
            ].map(step => (
              <div key={step.n} className="step-card">
                <div className="step-number">{step.n}</div>
                <div className="step-icon">{step.icon}</div>
                <div className="step-title">{step.title}</div>
                <p className="step-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <div className="faq-section">
        <h2 className="section-title">FAQs</h2>
        {faqs.map((item, i) => (
          <div
            key={i}
            className={`faq-item${openFaq === i ? " open" : ""}`}
            onClick={() => setOpenFaq(openFaq === i ? null : i)}
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

      {/* CTA BANNER */}
      <div className="cta-section">
        <div className="cta-bg">GO.</div>
        <h2 className="cta-title">Start earning<br />with Catalyst.</h2>
        <div className="cta-right">
          <p className="cta-sub">Join Plymouth teens already finding flexible work in their neighborhood.</p>
          <a href="/auth/signup" className="btn-white-solid">Get started free →</a>
        </div>
      </div>

      {/* FOOTER */}
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
  );
}