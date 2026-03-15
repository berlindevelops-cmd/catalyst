'use client'
import { useState } from 'react'
import { supabase } from '../../../lib/supabase'
import { useRouter } from 'next/navigation'
import Navbar from '../../../components/NavBar'
import { Lightbulb, MapPin, Zap, AlertCircle, ArrowRight, Loader } from 'lucide-react'

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
    const { error } = await supabase.from('jobs').insert({ title, description, pay, location, employer_id: user?.id })
    if (error) setError(error.message)
    else router.push('/jobs')
    setLoading(false)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@400;700;900&family=Nunito:wght@400;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --orange: #FF5C1A; --yellow: #FFE033; --black: #111111;
          --white: #FEFCF7; --cream: #FFF6E8;
          --shadow: 4px 4px 0px #111111; --shadow-lg: 6px 6px 0px #111111;
        }
        body { background: var(--white); font-family: 'Nunito', sans-serif; color: var(--black); }
        .page { min-height: 100vh; background: var(--white); display: flex; flex-direction: column; }

        .body {
          flex: 1; display: grid; grid-template-columns: 1fr 500px;
          min-height: calc(100vh - 60px);
        }

        /* LEFT */
        .left {
          background: var(--yellow); border-right: 3px solid var(--black);
          padding: 72px 56px; display: flex; flex-direction: column;
          justify-content: center; position: relative; overflow: hidden;
        }
        .left-bg {
          position: absolute; bottom: -40px; right: -40px;
          font-family: 'Unbounded', sans-serif; font-size: 200px; font-weight: 900;
          color: rgba(0,0,0,0.06); pointer-events: none; letter-spacing: -.05em;
          line-height: 1; user-select: none;
        }
        .left-eyebrow {
          font-family: 'Unbounded', sans-serif; font-size: 10px; font-weight: 700;
          letter-spacing: .16em; text-transform: uppercase; color: rgba(0,0,0,0.4);
          margin-bottom: 16px; position: relative; z-index: 1;
          display: flex; align-items: center; gap: 6px;
        }
        .left-title {
          font-family: 'Unbounded', sans-serif;
          font-size: clamp(40px, 5vw, 64px); font-weight: 900;
          line-height: 1.0; letter-spacing: -.04em; color: var(--black);
          margin-bottom: 20px; position: relative; z-index: 1;
        }
        .left-title .box { background: var(--orange); color: var(--white); padding: 0 8px; border-radius: 6px; border: 2px solid var(--black); }
        .left-sub {
          font-size: 15px; font-weight: 700; color: rgba(0,0,0,0.5);
          max-width: 360px; line-height: 1.7; margin-bottom: 48px;
          position: relative; z-index: 1;
        }

        .tips { display: flex; flex-direction: column; gap: 10px; position: relative; z-index: 1; max-width: 420px; }
        .tip {
          display: flex; align-items: flex-start; gap: 14px;
          background: var(--white); border: 2.5px solid var(--black);
          border-radius: 14px; padding: 16px 18px;
          box-shadow: 3px 3px 0 var(--black);
          transition: transform .12s, box-shadow .12s;
        }
        .tip:hover { transform: translate(-2px,-2px); box-shadow: var(--shadow); }
        .tip-icon {
          width: 36px; height: 36px; border-radius: 10px;
          border: 2px solid var(--black); background: var(--yellow);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; color: var(--black);
        }
        .tip-text { font-size: 13px; font-weight: 600; color: #666; line-height: 1.6; padding-top: 2px; }
        .tip-text strong { color: var(--black); font-weight: 800; }

        /* RIGHT */
        .right {
          background: var(--cream); padding: 56px 48px;
          display: flex; flex-direction: column; justify-content: center;
          border-left: 3px solid var(--black);
        }
        .form-eyebrow {
          font-family: 'Unbounded', sans-serif; font-size: 10px; font-weight: 700;
          letter-spacing: .16em; text-transform: uppercase; color: var(--orange); margin-bottom: 10px;
        }
        .form-title {
          font-family: 'Unbounded', sans-serif; font-size: 28px; font-weight: 900;
          letter-spacing: -.03em; margin-bottom: 36px; color: var(--black);
        }

        .field { margin-bottom: 18px; display: flex; flex-direction: column; gap: 7px; }
        .field label {
          font-family: 'Unbounded', sans-serif; font-size: 10px; font-weight: 700;
          letter-spacing: .12em; text-transform: uppercase; color: #888;
        }
        .field input, .field textarea {
          background: var(--white); border: 2.5px solid var(--black);
          border-radius: 10px; padding: 14px 16px; color: var(--black);
          font-family: 'Nunito', sans-serif; font-size: 15px; font-weight: 600;
          outline: none; resize: none; box-shadow: 3px 3px 0 var(--black);
          transition: box-shadow .12s, transform .12s;
        }
        .field input::placeholder, .field textarea::placeholder { color: #bbb; font-weight: 600; }
        .field input:focus, .field textarea:focus { box-shadow: 5px 5px 0 var(--black); transform: translate(-1px,-1px); }

        .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 18px; }
        .field-row .field { margin-bottom: 0; }

        .error-box {
          background: #fff0ee; border: 2px solid #ff5c5c; border-radius: 10px;
          padding: 12px 16px; font-size: 13px; font-weight: 700; color: #cc2200;
          margin-bottom: 16px; display: flex; align-items: center; gap: 8px;
          box-shadow: 3px 3px 0 #ff5c5c;
        }

        .submit-btn {
          width: 100%; padding: 16px; background: var(--black); color: var(--white);
          border: 2.5px solid var(--black); border-radius: 12px;
          font-family: 'Nunito', sans-serif; font-size: 15px; font-weight: 800;
          cursor: pointer; box-shadow: var(--shadow); margin-top: 8px;
          transition: transform .12s, box-shadow .12s, background .12s;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .submit-btn:hover:not(:disabled) { transform: translate(-2px,-2px); box-shadow: var(--shadow-lg); background: var(--orange); }
        .submit-btn:active:not(:disabled) { transform: translate(2px,2px); box-shadow: none; }
        .submit-btn:disabled { opacity: .5; cursor: not-allowed; }

        .spinning { animation: spin .6s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 900px) {
          .body { grid-template-columns: 1fr; }
          .left { padding: 56px 24px 40px; border-right: none; border-bottom: 3px solid var(--black); }
          .right { padding: 48px 24px; border-left: none; }
          .field-row { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="page">
        <Navbar />
        <div className="body">
          <div className="left">
            <div className="left-bg">HIRE.</div>
            <p className="left-eyebrow"><Briefcase size={12} strokeWidth={2.5} /> For Employers</p>
            <h1 className="left-title">
              Find your<br /><span className="box">perfect</span><br />teen hire.
            </h1>
            <p className="left-sub">
              Post a listing in under 2 minutes. Reach 530+ local Plymouth teens actively looking for flexible work.
            </p>
            <div className="tips">
              {[
                { icon: <Lightbulb size={16} strokeWidth={2.5} />, title: 'Be specific about pay.', body: 'Teens apply 3× more when the hourly rate is listed up front.' },
                { icon: <MapPin size={16} strokeWidth={2.5} />, title: 'Include a neighborhood.', body: 'Local teens filter by distance first.' },
                { icon: <Zap size={16} strokeWidth={2.5} />, title: 'Mention flexibility.', body: "It's the #1 reason teens choose one gig over another." },
              ].map(tip => (
                <div key={tip.title} className="tip">
                  <div className="tip-icon">{tip.icon}</div>
                  <p className="tip-text"><strong>{tip.title}</strong> {tip.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="right">
            <p className="form-eyebrow">New listing</p>
            <h2 className="form-title">Job Details</h2>
            <form onSubmit={handlePostJob}>
              <div className="field">
                <label>Job Title</label>
                <input type="text" placeholder="e.g. Weekend Babysitter, Lawn Mowing" value={title} onChange={e => setTitle(e.target.value)} required />
              </div>
              <div className="field">
                <label>Description</label>
                <textarea rows={5} placeholder="Describe the job — what needs to be done, when, any requirements..." value={description} onChange={e => setDescription(e.target.value)} required />
              </div>
              <div className="field-row">
                <div className="field">
                  <label>Pay</label>
                  <input type="text" placeholder="e.g. $15/hr or $50 flat" value={pay} onChange={e => setPay(e.target.value)} required />
                </div>
                <div className="field">
                  <label>Location</label>
                  <input type="text" placeholder="e.g. Plymouth, IN" value={location} onChange={e => setLocation(e.target.value)} required />
                </div>
              </div>
              {error && <div className="error-box"><AlertCircle size={16} strokeWidth={2.5} />{error}</div>}
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? <><Loader size={16} className="spinning" /> Posting…</> : <>Post Job <ArrowRight size={16} strokeWidth={2.5} /></>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}