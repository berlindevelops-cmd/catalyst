'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'
import Navbar from '../../components/NavBar'

export default function Inbox() {
  const [conversations, setConversations] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const router = useRouter()

  useEffect(() => { fetchConversations() }, [])

  const fetchConversations = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth/login'); return }
    setCurrentUser(user)

    const { data, error } = await supabase
      .from('messages')
      .select(`*, sender:users!sender_id(id, name), receiver:users!receiver_id(id, name)`)
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order('created_at', { ascending: false })

    if (error) setError(error.message)
    else setConversations(data)
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
          --gray2: #1A1A1A;
          --border: rgba(255,255,255,0.08);
          --muted: rgba(245,242,235,0.4);
        }

        body { background: var(--black); }

        .root {
          min-height: 100vh;
          background: var(--black);
          font-family: 'Instrument Sans', sans-serif;
          color: #F5F2EB;
        }

        /* ── HEADER ── */
        .header {
          padding: 56px 40px 40px;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 24px;
          position: relative;
          overflow: hidden;
        }

        .header-glow {
          position: absolute;
          top: -80px; right: -80px;
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(255,224,51,0.07) 0%, transparent 65%);
          pointer-events: none;
        }

        .header-eyebrow {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: .14em;
          text-transform: uppercase;
          color: var(--orange);
          margin-bottom: 12px;
        }

        .header-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(44px, 6vw, 72px);
          font-weight: 800;
          line-height: 1.0;
          letter-spacing: -.03em;
        }

        .header-title span { color: var(--yellow); }

        .header-count {
          font-size: 13px;
          font-weight: 500;
          color: var(--muted);
          padding-bottom: 8px;
          white-space: nowrap;
        }

        .header-count strong { color: var(--yellow); font-weight: 700; }

        /* ── LIST ── */
        .list {
          max-width: 760px;
          margin: 0 auto;
          padding: 16px 40px 80px;
        }

        .convo-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 18px 16px;
          border-radius: 14px;
          text-decoration: none;
          color: inherit;
          transition: background .15s;
          position: relative;
        }

        .convo-item:hover { background: var(--gray); }

        .convo-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--yellow), var(--orange));
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Syne', sans-serif;
          font-size: 18px;
          font-weight: 800;
          color: var(--black);
          flex-shrink: 0;
        }

        .convo-content { flex: 1; min-width: 0; }

        .convo-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 4px;
          gap: 8px;
        }

        .convo-name {
          font-family: 'Syne', sans-serif;
          font-size: 16px;
          font-weight: 800;
          letter-spacing: -.01em;
          color: #F5F2EB;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .convo-time {
          font-size: 11px;
          font-weight: 500;
          color: rgba(245,242,235,0.25);
          flex-shrink: 0;
        }

        .convo-preview {
          font-size: 13px;
          font-weight: 400;
          color: var(--muted);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .convo-arrow {
          width: 32px; height: 32px;
          border-radius: 8px;
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          color: rgba(245,242,235,0.2);
          flex-shrink: 0;
          transition: background .15s, color .15s, border-color .15s;
        }

        .convo-item:hover .convo-arrow {
          background: rgba(255,224,51,0.1);
          border-color: rgba(255,224,51,0.2);
          color: var(--yellow);
        }

        /* separator */
        .convo-sep {
          height: 1px;
          background: var(--border);
          margin: 0 16px;
        }

        /* ── EMPTY ── */
        .empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 100px 24px;
          text-align: center;
          gap: 14px;
        }

        .empty-icon { font-size: 48px; }

        .empty-title {
          font-family: 'Syne', sans-serif;
          font-size: 24px;
          font-weight: 800;
          letter-spacing: -.02em;
          color: rgba(245,242,235,0.25);
        }

        .empty-sub {
          font-size: 14px;
          color: rgba(245,242,235,0.18);
          max-width: 280px;
          line-height: 1.6;
        }

        .empty-sub a { color: var(--yellow); text-decoration: none; font-weight: 600; }

        /* ── SPINNER ── */
        .spinner-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 50vh;
        }

        .spinner {
          width: 36px; height: 36px;
          border: 3px solid rgba(255,255,255,0.07);
          border-top-color: var(--yellow);
          border-radius: 50%;
          animation: spin .7s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 768px) {
          .nav { padding: 0 20px; }
          .header { padding: 40px 20px 28px; flex-direction: column; align-items: flex-start; }
          .list { padding: 8px 12px 64px; }
        }
      `}</style>

      <div className="root">
        <Navbar />

        <div className="header">
          <div className="header-glow" />
          <div>
            <p className="header-eyebrow">💬 Messages</p>
            <h1 className="header-title">Your <span>Inbox</span></h1>
          </div>
          {!loading && (
            <p className="header-count">
              <strong>{conversations.length}</strong> {conversations.length === 1 ? 'conversation' : 'conversations'}
            </p>
          )}
        </div>

        {loading ? (
          <div className="spinner-wrap"><div className="spinner" /></div>
        ) : conversations.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">📭</div>
            <p className="empty-title">No Messages Yet</p>
            <p className="empty-sub">
              When you apply to a job or hear from an employer, your conversations appear here.{' '}
              <a href="/jobs">Browse jobs →</a>
            </p>
          </div>
        ) : (
          <div className="list">
            {conversations.map((convo, i) => {
              const isMe = convo.sender_id === currentUser?.id
              const other = isMe ? convo.receiver : convo.sender
              const initials = other?.name?.charAt(0).toUpperCase() || '?'
              const timeAgo = convo.created_at
                ? new Date(convo.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                : ''

              return (
                <div key={convo.id}>
                  <a href={`/messages/${convo.id}`} className="convo-item">
                    <div className="convo-avatar">{initials}</div>
                    <div className="convo-content">
                      <div className="convo-top">
                        <span className="convo-name">{other?.name || 'Unknown'}</span>
                        <span className="convo-time">{timeAgo}</span>
                      </div>
                      <p className="convo-preview">{convo.content || 'No messages yet'}</p>
                    </div>
                    <span className="convo-arrow">→</span>
                  </a>
                  {i < conversations.length - 1 && <div className="convo-sep" />}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}