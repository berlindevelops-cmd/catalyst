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
        title,
        description, 
        pay,
        location,
        employer_id: user?.id
        })
    if (error) {
        setError(error.message);
    } else {
        router.push('/jobs')
    }
    setLoading(false);
  }

  return (
    <>
        <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Epilogue:wght@300;400;500;700;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .post-root {
            min-height: 100vh;
            background: #0A0A0A;
            font-family: 'Epilogue', sans-serif;
            color: #F5F2EB;
            display: flex;
            flex-direction: column;
        }

        /* NAV */
        .post-nav {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 24px 48px;
            border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .post-nav-logo {
            font-family: 'Bebas Neue', sans-serif;
            font-size: 26px;
            letter-spacing: .08em;
            color: #FFE033;
            text-decoration: none;
        }
        .post-nav-back {
            font-size: 13px;
            color: rgba(245,242,235,0.4);
            text-decoration: none;
            display: flex;
            align-items: center;
            gap: 6px;
            transition: color .2s;
        }
        .post-nav-back:hover { color: #F5F2EB; }

        /* BODY */
        .post-body {
            flex: 1;
            display: grid;
            grid-template-columns: 1fr 480px;
            min-height: calc(100vh - 73px);
        }

        /* LEFT PANEL */
        .post-left {
            padding: 80px 72px;
            border-right: 1px solid rgba(255,255,255,0.06);
            display: flex;
            flex-direction: column;
            justify-content: center;
            position: relative;
            overflow: hidden;
        }
        .post-left::before {
            content: '';
            position: absolute;
            top: -200px; left: -200px;
            width: 600px; height: 600px;
            background: radial-gradient(circle, rgba(255,224,51,0.07) 0%, transparent 70%);
            pointer-events: none;
        }
        .post-left-tag {
            font-size: 11px;
            font-weight: 700;
            letter-spacing: .18em;
            text-transform: uppercase;
            color: #FF5C1A;
            margin-bottom: 20px;
        }
        .post-left-title {
            font-family: 'Bebas Neue', sans-serif;
            font-size: clamp(56px, 7vw, 96px);
            line-height: .92;
            letter-spacing: .03em;
            margin-bottom: 24px;
        }
        .post-left-title span { color: #FFE033; }
        .post-left-sub {
            font-size: 15px;
            font-weight: 300;
            color: rgba(245,242,235,0.45);
            max-width: 360px;
            line-height: 1.7;
            margin-bottom: 56px;
        }

        /* tip cards */
        .tips {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        .tip {
            display: flex;
            align-items: flex-start;
            gap: 14px;
            background: #1A1A1A;
            border-radius: 12px;
            padding: 16px 20px;
            border: 1px solid rgba(255,255,255,0.05);
        }
        .tip-icon { font-size: 20px; flex-shrink: 0; margin-top: 2px; }
        .tip-text { font-size: 13px; font-weight: 400; color: rgba(245,242,235,0.5); line-height: 1.6; }
        .tip-text strong { color: #F5F2EB; font-weight: 600; }

        /* RIGHT PANEL / FORM */
        .post-right {
            background: #111;
            padding: 64px 56px;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        .form-heading {
            font-family: 'Bebas Neue', sans-serif;
            font-size: 28px;
            letter-spacing: .06em;
            margin-bottom: 36px;
            color: #F5F2EB;
        }

        .field {
            margin-bottom: 22px;
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        .field label {
            font-size: 11px;
            font-weight: 700;
            letter-spacing: .12em;
            text-transform: uppercase;
            color: rgba(245,242,235,0.35);
        }
        .field input, .field textarea {
            background: #0A0A0A;
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 10px;
            padding: 14px 16px;
            color: #F5F2EB;
            font-family: 'Epilogue', sans-serif;
            font-size: 14px;
            font-weight: 400;
            outline: none;
            transition: border-color .2s, box-shadow .2s;
            resize: none;
        }
        .field input::placeholder, .field textarea::placeholder {
            color: rgba(245,242,235,0.2);
        }
        .field input:focus, .field textarea:focus {
            border-color: #FFE033;
            box-shadow: 0 0 0 3px rgba(255,224,51,0.08);
        }

        /* pay + location row */
        .field-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            margin-bottom: 22px;
        }

        .error-box {
            background: rgba(255,80,60,0.1);
            border: 1px solid rgba(255,80,60,0.3);
            border-radius: 10px;
            padding: 12px 16px;
            font-size: 13px;
            color: #ff6b5b;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .submit-btn {
            width: 100%;
            padding: 17px;
            background: #FFE033;
            color: #0A0A0A;
            border: none;
            border-radius: 10px;
            font-family: 'Bebas Neue', sans-serif;
            font-size: 20px;
            letter-spacing: .08em;
            cursor: pointer;
            transition: opacity .2s, transform .15s;
            margin-top: 8px;
        }
        .submit-btn:hover:not(:disabled) { opacity: .88; transform: translateY(-1px); }
        .submit-btn:active:not(:disabled) { transform: translateY(0); }
        .submit-btn:disabled { opacity: .45; cursor: not-allowed; }

        .spinner {
            display: inline-block;
            width: 16px; height: 16px;
            border: 2px solid rgba(0,0,0,0.3);
            border-top-color: #0A0A0A;
            border-radius: 50%;
            animation: spin .6s linear infinite;
            vertical-align: middle;
            margin-right: 8px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 860px) {
            .post-nav { padding: 20px 24px; }
            .post-body { grid-template-columns: 1fr; }
            .post-left { padding: 56px 24px 40px; border-right: none; border-bottom: 1px solid rgba(255,255,255,0.06); }
            .post-right { padding: 48px 24px; }
            .field-row { grid-template-columns: 1fr; }
        }
        `}</style>

        <div className="post-root">
        {/* Nav */}
        <nav className="post-nav">
            <a href="/" className="post-nav-logo">Catalyst</a>
            <a href="/jobs" className="post-nav-back">← Back to Jobs</a>
        </nav>

        <div className="post-body">
            {/* Left */}
            <div className="post-left">
            <p className="post-left-tag">🏢 For Employers</p>
            <h1 className="post-left-title">
                Find Your<br />
                <span>Perfect</span><br />
                Teen Hire.
            </h1>
            <p className="post-left-sub">
                Post a job in under 2 minutes. Reach 500+ local Plymouth teens actively looking for flexible work.
            </p>
            <div className="tips">
                <div className="tip">
                <span className="tip-icon">💡</span>
                <p className="tip-text"><strong>Be specific about pay.</strong> Teens apply 3x more when hourly rate is listed up front.</p>
                </div>
                <div className="tip">
                <span className="tip-icon">📍</span>
                <p className="tip-text"><strong>Include a neighborhood or address.</strong> Local teens filter by distance.</p>
                </div>
                <div className="tip">
                <span className="tip-icon">⚡</span>
                <p className="tip-text"><strong>List the hours you need.</strong> Flexibility is the #1 reason teens choose a gig.</p>
                </div>
            </div>
            </div>

            {/* Right / Form */}
            <div className="post-right">
            <p className="form-heading">Job Details</p>

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
                <div className="field" style={{margin: 0}}>
                    <label>Pay</label>
                    <input
                    type="text"
                    placeholder="e.g. $15/hr or $50 flat"
                    value={pay}
                    onChange={e => setPay(e.target.value)}
                    required
                    />
                </div>
                <div className="field" style={{margin: 0}}>
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
                {loading ? 'Posting...' : 'Post Job →'}
                </button>
            </form>
            </div>
        </div>
        </div>
    </>
    )
}