'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function Inbox() {
  const [conversations, setConversations] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchConversations()
  }, [])

  const fetchConversations = async () => {
    // 1. get current user, if none redirect to /auth/login
    // 2. fetch all messages where sender_id = user.id OR receiver_id = user.id
    //    supabase.from('messages').select('*').or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
    // 3. setConversations(data)
    // 4. setLoading(false)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        router.push('/auth/login')
        return
    }
    setCurrentUser(user)

    const { data, error } = await supabase
        .from('messages')
        .select(`
            *,
            sender:users!sender_id(id, name),
            receiver:users!receiver_id(id, name)
        `)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false })
    if (error) {
        setError(error.message)
    } else {
        setConversations(data)
    }
    setLoading(false)
  }

  return (
    <>
        <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Epilogue:wght@300;400;500;700;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .inbox-root {
            min-height: 100vh;
            background: #0A0A0A;
            font-family: 'Epilogue', sans-serif;
            color: #F5F2EB;
        }

        /* NAV */
        .inbox-nav {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 24px 48px;
            border-bottom: 1px solid rgba(255,255,255,0.06);
            position: sticky;
            top: 0;
            background: rgba(10,10,10,0.9);
            backdrop-filter: blur(12px);
            z-index: 10;
        }
        .inbox-nav-logo {
            font-family: 'Bebas Neue', sans-serif;
            font-size: 26px;
            letter-spacing: .08em;
            color: #FFE033;
            text-decoration: none;
        }
        .inbox-nav-back {
            font-size: 13px;
            color: rgba(245,242,235,0.4);
            text-decoration: none;
            transition: color .2s;
        }
        .inbox-nav-back:hover { color: #F5F2EB; }

        /* HEADER */
        .inbox-header {
            padding: 56px 48px 40px;
            border-bottom: 1px solid rgba(255,255,255,0.06);
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            gap: 24px;
        }
        .inbox-header-tag {
            font-size: 11px;
            font-weight: 700;
            letter-spacing: .18em;
            text-transform: uppercase;
            color: #FF5C1A;
            margin-bottom: 12px;
        }
        .inbox-header-title {
            font-family: 'Bebas Neue', sans-serif;
            font-size: clamp(48px, 7vw, 80px);
            line-height: .92;
            letter-spacing: .03em;
        }
        .inbox-header-title span { color: #FFE033; }
        .inbox-count {
            font-size: 13px;
            color: rgba(245,242,235,0.3);
            padding-bottom: 8px;
            white-space: nowrap;
        }
        .inbox-count strong { color: #FFE033; }

        /* LIST */
        .inbox-list {
            max-width: 720px;
            margin: 0 auto;
            padding: 32px 48px 80px;
        }

        .convo-item {
            display: flex;
            align-items: center;
            gap: 18px;
            padding: 20px 0;
            border-bottom: 1px solid rgba(255,255,255,0.06);
            text-decoration: none;
            color: inherit;
            cursor: pointer;
            transition: padding-left .2s;
        }
        .convo-item:hover { padding-left: 8px; }
        .convo-item:last-child { border-bottom: none; }

        .convo-avatar {
            width: 52px;
            height: 52px;
            border-radius: 50%;
            background: linear-gradient(135deg, #FFE033, #FF5C1A);
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Bebas Neue', sans-serif;
            font-size: 22px;
            color: #0A0A0A;
            flex-shrink: 0;
        }

        .convo-content { flex: 1; min-width: 0; }

        .convo-top {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 5px;
        }

        .convo-name {
            font-family: 'Bebas Neue', sans-serif;
            font-size: 20px;
            letter-spacing: .04em;
            color: #F5F2EB;
        }

        .convo-time {
            font-size: 11px;
            color: rgba(245,242,235,0.25);
            flex-shrink: 0;
        }

        .convo-preview {
            font-size: 13px;
            font-weight: 300;
            color: rgba(245,242,235,0.4);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .convo-preview.unread {
            color: rgba(245,242,235,0.75);
            font-weight: 500;
        }

        .convo-arrow {
            font-size: 18px;
            color: rgba(245,242,235,0.15);
            flex-shrink: 0;
            transition: color .2s, transform .2s;
        }
        .convo-item:hover .convo-arrow {
            color: #FFE033;
            transform: translateX(4px);
        }

        /* EMPTY STATE */
        .empty-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 100px 24px;
            text-align: center;
            gap: 16px;
        }
        .empty-icon { font-size: 52px; }
        .empty-title {
            font-family: 'Bebas Neue', sans-serif;
            font-size: 36px;
            letter-spacing: .04em;
            color: rgba(245,242,235,0.3);
        }
        .empty-sub {
            font-size: 14px;
            color: rgba(245,242,235,0.2);
            max-width: 280px;
            line-height: 1.6;
        }
        .empty-sub a { color: #FFE033; text-decoration: none; }

        /* LOADING */
        .loading-wrap {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 50vh;
        }
        .loading-spinner {
            width: 40px; height: 40px;
            border: 3px solid rgba(255,255,255,0.08);
            border-top-color: #FFE033;
            border-radius: 50%;
            animation: spin .7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 768px) {
            .inbox-nav { padding: 20px 24px; }
            .inbox-header { padding: 40px 24px 28px; flex-direction: column; align-items: flex-start; }
            .inbox-list { padding: 24px 24px 64px; }
        }
        `}</style>

        <div className="inbox-root">
        <nav className="inbox-nav">
            <a href="/" className="inbox-nav-logo">Catalyst</a>
            <a href="/jobs" className="inbox-nav-back">← Browse Jobs</a>
        </nav>

        <div className="inbox-header">
            <div>
            <p className="inbox-header-tag">💬 Messages</p>
            <h1 className="inbox-header-title">Your<br /><span>Inbox</span></h1>
            </div>
            {!loading && (
            <p className="inbox-count">
                <strong>{conversations.length}</strong> {conversations.length === 1 ? 'conversation' : 'conversations'}
            </p>
            )}
        </div>

        {loading ? (
            <div className="loading-wrap">
            <div className="loading-spinner" />
            </div>
        ) : conversations.length === 0 ? (
            <div className="empty-state">
            <div className="empty-icon">📭</div>
            <p className="empty-title">No Messages Yet</p>
            <p className="empty-sub">
                When you apply to a job or hear back from an employer, your conversations will show up here.{' '}
                <a href="/jobs">Browse jobs →</a>
            </p>
            </div>
        ) : (
            <div className="inbox-list">
            {conversations.map((convo) => {
                const isMe = convo.sender_id === currentUser?.id
                const otherPerson = isMe ? convo.receiver : convo.sender
                const initials = otherPerson?.name?.charAt(0).toUpperCase() || '??'
                const timeAgo = convo.created_at
                ? new Date(convo.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                : ''

                return (
                <a key={convo.id} href={`/messages/${convo.id}`} className="convo-item">
                    <div className="convo-avatar">{initials}</div>
                    <div className="convo-content">
                    <div className="convo-top">
                        <span className="convo-name">
                        {otherPerson?.name || 'Unknown'}
                        </span>
                        <span className="convo-time">{timeAgo}</span>
                    </div>
                    <p className="convo-preview">{convo.content || 'No messages yet'}</p>
                    </div>
                    <span className="convo-arrow">→</span>
                </a>
                )
            })}
            </div>
        )}
        </div>
    </>
    )
}