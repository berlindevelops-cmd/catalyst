'use client'
import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'
import Navbar from '../../../components/NavBar'

export default function Conversation() {
  const { conversationId } = useParams()
  const [messages, setMessages] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [otherUser, setOtherUser] = useState(null)
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [receiverId, setReceiverId] = useState(null)
  const [error, setError] = useState(null)
  const router = useRouter()
  const bottomRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => { fetchMessages() }, [])

  const fetchMessages = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth/login'); return }
    setCurrentUser(user)

    const { data } = await supabase
      .from('messages')
      .select('*, sender:users!sender_id(id,name), receiver:users!receiver_id(id,name)')
      .eq('id', conversationId)
      .single()

    const other = data.sender_id === user.id ? data.receiver : data.sender
    setOtherUser(other)
    setReceiverId(other.id)

    const { data: allMessages } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${user.id},receiver_id.eq.${other.id}),and(sender_id.eq.${other.id},receiver_id.eq.${user.id})`)
      .order('created_at', { ascending: true })

    setMessages(allMessages)
    setLoading(false)
    setTimeout(() => bottomRef.current?.scrollIntoView(), 50)
  }

  const sendMessage = async () => {
    if (!newMessage.trim()) return
    const content = newMessage.trim()
    setNewMessage('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'

    const { error } = await supabase.from('messages').insert({
      sender_id: currentUser.id,
      receiver_id: receiverId,
      content,
    })
    if (error) setError(error.message)
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    const sub = supabase
      .channel('messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        setMessages(prev => [...prev, payload.new])
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
      })
      .subscribe()
    return () => supabase.removeChannel(sub)
  }, [])

  const initials = otherUser?.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?'

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
          height: 100vh;
          display: flex;
          flex-direction: column;
          background: var(--black);
          font-family: 'Instrument Sans', sans-serif;
          color: #F5F2EB;
          overflow: hidden;
        }

        /* ── MESSAGES ── */
        .messages {
          flex: 1;
          overflow-y: auto;
          padding: 28px 0;
          display: flex;
          flex-direction: column;
          gap: 2px;
          scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,0.06) transparent;
        }

        .messages::-webkit-scrollbar { width: 4px; }
        .messages::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.06); border-radius: 2px; }

        .date-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 32px;
        }

        .date-divider::before, .date-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--border);
        }

        .date-divider span {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .1em;
          text-transform: uppercase;
          color: rgba(245,242,235,0.2);
          white-space: nowrap;
        }

        .msg-row {
          display: flex;
          padding: 3px 32px;
          gap: 10px;
          align-items: flex-end;
        }

        .msg-row.mine { flex-direction: row-reverse; }

        .msg-avatar {
          width: 28px; height: 28px;
          border-radius: 50%;
          background: var(--gray2);
          border: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Syne', sans-serif;
          font-size: 10px;
          font-weight: 800;
          color: var(--muted);
          flex-shrink: 0;
          margin-bottom: 2px;
        }

        .msg-row.mine .msg-avatar {
          background: linear-gradient(135deg, var(--yellow), var(--orange));
          color: var(--black);
          border: none;
        }

        .msg-bubble-wrap {
          display: flex;
          flex-direction: column;
          gap: 3px;
          max-width: 62%;
        }

        .msg-row.mine .msg-bubble-wrap { align-items: flex-end; }

        .msg-bubble {
          padding: 11px 15px;
          border-radius: 18px;
          font-size: 14px;
          font-weight: 400;
          line-height: 1.55;
          word-break: break-word;
        }

        .msg-row.mine .msg-bubble {
          background: var(--yellow);
          color: var(--black);
          border-bottom-right-radius: 5px;
          font-weight: 500;
        }

        .msg-row.theirs .msg-bubble {
          background: var(--gray);
          color: #F5F2EB;
          border-bottom-left-radius: 5px;
          border: 1px solid var(--border);
        }

        .msg-time {
          font-size: 10px;
          font-weight: 500;
          color: rgba(245,242,235,0.18);
          padding: 0 4px;
        }

        /* ── STATES ── */
        .loading-wrap {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .spinner {
          width: 36px; height: 36px;
          border: 3px solid rgba(255,255,255,0.07);
          border-top-color: var(--yellow);
          border-radius: 50%;
          animation: spin .7s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .chat-empty {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          color: rgba(245,242,235,0.2);
        }

        .chat-empty-icon { font-size: 40px; }
        .chat-empty-text { font-size: 14px; font-weight: 400; }

        /* ── ERROR ── */
        .error-bar {
          margin: 0 32px 8px;
          background: rgba(255,80,60,0.08);
          border: 1px solid rgba(255,80,60,0.2);
          border-radius: 10px;
          padding: 10px 16px;
          font-size: 12px;
          color: #ff7060;
          flex-shrink: 0;
        }

        /* ── INPUT ── */
        .input-bar {
          padding: 14px 32px 22px;
          background: var(--black);
          border-top: 1px solid var(--border);
          flex-shrink: 0;
        }

        .input-wrap {
          display: flex;
          align-items: flex-end;
          gap: 10px;
          background: var(--gray);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 12px 14px;
          transition: border-color .18s, box-shadow .18s;
        }

        .input-wrap:focus-within {
          border-color: rgba(255,224,51,0.3);
          box-shadow: 0 0 0 3px rgba(255,224,51,0.05);
        }

        .input-textarea {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: #F5F2EB;
          font-family: 'Instrument Sans', sans-serif;
          font-size: 14px;
          font-weight: 400;
          resize: none;
          line-height: 1.5;
          max-height: 120px;
          scrollbar-width: none;
        }

        .input-textarea::placeholder { color: rgba(245,242,235,0.2); }
        .input-textarea::-webkit-scrollbar { display: none; }

        .send-btn {
          width: 36px; height: 36px;
          background: var(--yellow);
          border: none;
          border-radius: 10px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          font-weight: 700;
          color: var(--black);
          flex-shrink: 0;
          transition: opacity .18s, transform .15s;
        }

        .send-btn:hover:not(:disabled) { opacity: .85; transform: scale(1.05); }
        .send-btn:active:not(:disabled) { transform: scale(.97); }
        .send-btn:disabled { opacity: .3; cursor: not-allowed; }

        @media (max-width: 768px) {
          .nav { padding: 0 16px; }
          .messages { padding: 16px 0; }
          .msg-row { padding: 3px 16px; }
          .input-bar { padding: 10px 16px 18px; }
          .date-divider { padding: 12px 16px; }
        }
      `}</style>

      <div className="root">
        {/* ── NAV ── */}
        <Navbar />

        {/* ── MESSAGES ── */}
        {loading ? (
          <div className="loading-wrap"><div className="spinner" /></div>
        ) : messages.length === 0 ? (
          <div className="chat-empty">
            <div className="chat-empty-icon">💬</div>
            <p className="chat-empty-text">No messages yet — say hello!</p>
          </div>
        ) : (
          <div className="messages">
            <div className="date-divider"><span>Conversation Start</span></div>
            {messages.map((msg, i) => {
              const isMe = msg.sender_id === currentUser?.id
              const time = msg.created_at
                ? new Date(msg.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
                : ''
              return (
                <div key={msg.id || i} className={`msg-row ${isMe ? 'mine' : 'theirs'}`}>
                  <div className="msg-avatar">{isMe ? 'ME' : initials}</div>
                  <div className="msg-bubble-wrap">
                    <div className="msg-bubble">{msg.content}</div>
                    <span className="msg-time">{time}</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {error && <div className="error-bar">⚠️ {error}</div>}

        {/* ── INPUT ── */}
        <div className="input-bar">
          <div className="input-wrap">
            <textarea
              ref={textareaRef}
              className="input-textarea"
              rows={1}
              placeholder="Type a message..."
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
              }}
              onInput={e => {
                const el = e.target
                el.style.height = 'auto'
                el.style.height = el.scrollHeight + 'px'
              }}
            />
            <button className="send-btn" onClick={sendMessage} disabled={!newMessage.trim()}>
              ↑
            </button>
          </div>
        </div>

        <div ref={bottomRef} />
      </div>
    </>
  )
}