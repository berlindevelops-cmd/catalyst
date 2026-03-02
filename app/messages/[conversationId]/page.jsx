'use client'
import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

export default function Conversation() {
  const { conversationId } = useParams()
  const [messages, setMessages] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [receiverId, setReceiverId] = useState(null)
  const router = useRouter()
  const bottomRef = useRef(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    // 1. get current user, redirect if none
    // 2. fetch the original message by conversationId to get the other person's id
    //    supabase.from('messages').select('*, sender:users!sender_id(id,name), receiver:users!receiver_id(id,name)').eq('id', conversationId).single()
    // 3. figure out who the other person is (sender or receiver)
    // 4. setReceiverId to the other person's id
    // 5. fetch ALL messages between these two users
    // 6. setMessages(data)
    // 7. setLoading(false)
    // 8. scroll to bottom: bottomRef.current?.scrollIntoView()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        router.push('/auth/login')
        return
    }
    setCurrentUser(user)

    const { data, error } = await supabase.from('messages').select('*, sender:users!sender_id(id,name), receiver:users!receiver_id(id,name)').eq('id', conversationId).single()

    const otherPerson = data.sender_id === user.id ? data.receiver : data.sender
    setReceiverId(otherPerson.id)

    const { data: allMessages, error: msgError } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${otherPerson.id}),and(sender_id.eq.${otherPerson.id},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true })

    setMessages(allMessages)
    setLoading(false)
    bottomRef.current?.scrollIntoView()
  }

  const sendMessage = async () => {
    if (!newMessage) { return }

    const { error } = await supabase.from('messages').insert({ sender_id: currentUser.id, receiver_id: receiverId, content: newMessage })

    if (error) {
        setError(error.message);
    }
    setNewMessage('')
    bottomRef.current?.scrollIntoView()
  }

  useEffect(() => {
    const subscription = supabase
      .channel('messages')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          setMessages(prev => [...prev, payload.new])
          bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
        }
      )
      .subscribe()

    return () => supabase.removeChannel(subscription)
  }, [])

  return (
    <>
        <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Epilogue:wght@300;400;500;700;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .chat-root {
            height: 100vh;
            display: flex;
            flex-direction: column;
            background: #0A0A0A;
            font-family: 'Epilogue', sans-serif;
            color: #F5F2EB;
            overflow: hidden;
        }

        /* NAV */
        .chat-nav {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 18px 32px;
            border-bottom: 1px solid rgba(255,255,255,0.06);
            background: rgba(10,10,10,0.95);
            backdrop-filter: blur(12px);
            flex-shrink: 0;
            z-index: 10;
        }
        .chat-nav-left {
            display: flex;
            align-items: center;
            gap: 16px;
        }
        .chat-back {
            font-size: 13px;
            color: rgba(245,242,235,0.4);
            text-decoration: none;
            transition: color .2s;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .chat-back:hover { color: #F5F2EB; }
        .chat-nav-divider {
            width: 1px;
            height: 20px;
            background: rgba(255,255,255,0.1);
        }
        .chat-nav-avatar {
            width: 36px; height: 36px;
            border-radius: 50%;
            background: linear-gradient(135deg, #FFE033, #FF5C1A);
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Bebas Neue', sans-serif;
            font-size: 15px;
            color: #0A0A0A;
            flex-shrink: 0;
        }
        .chat-nav-name {
            font-family: 'Bebas Neue', sans-serif;
            font-size: 20px;
            letter-spacing: .04em;
        }
        .chat-nav-status {
            font-size: 11px;
            color: rgba(245,242,235,0.3);
            margin-top: 1px;
        }
        .chat-nav-logo {
            font-family: 'Bebas Neue', sans-serif;
            font-size: 22px;
            letter-spacing: .08em;
            color: #FFE033;
            text-decoration: none;
        }

        /* MESSAGES AREA */
        .chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 32px 0;
            display: flex;
            flex-direction: column;
            gap: 4px;
            scrollbar-width: thin;
            scrollbar-color: rgba(255,255,255,0.08) transparent;
        }
        .chat-messages::-webkit-scrollbar { width: 4px; }
        .chat-messages::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 2px; }

        /* DATE DIVIDER */
        .date-divider {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 32px;
            margin: 8px 0;
        }
        .date-divider::before, .date-divider::after {
            content: '';
            flex: 1;
            height: 1px;
            background: rgba(255,255,255,0.06);
        }
        .date-divider span {
            font-size: 11px;
            font-weight: 600;
            letter-spacing: .1em;
            text-transform: uppercase;
            color: rgba(245,242,235,0.2);
            white-space: nowrap;
        }

        /* MESSAGE ROW */
        .msg-row {
            display: flex;
            padding: 4px 32px;
            gap: 10px;
            align-items: flex-end;
        }
        .msg-row.mine { flex-direction: row-reverse; }

        .msg-avatar {
            width: 28px; height: 28px;
            border-radius: 50%;
            background: #1A1A1A;
            border: 1px solid rgba(255,255,255,0.08);
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Bebas Neue', sans-serif;
            font-size: 12px;
            color: rgba(245,242,235,0.5);
            flex-shrink: 0;
            margin-bottom: 2px;
        }
        .msg-row.mine .msg-avatar {
            background: linear-gradient(135deg, #FFE033, #FF5C1A);
            color: #0A0A0A;
            border: none;
        }

        .msg-bubble-wrap {
            display: flex;
            flex-direction: column;
            gap: 3px;
            max-width: 65%;
        }
        .msg-row.mine .msg-bubble-wrap { align-items: flex-end; }

        .msg-bubble {
            padding: 12px 16px;
            border-radius: 18px;
            font-size: 14px;
            font-weight: 400;
            line-height: 1.55;
            word-break: break-word;
        }

        .msg-row.mine .msg-bubble {
            background: #FFE033;
            color: #0A0A0A;
            border-bottom-right-radius: 4px;
        }

        .msg-row.theirs .msg-bubble {
            background: #1A1A1A;
            color: #F5F2EB;
            border-bottom-left-radius: 4px;
            border: 1px solid rgba(255,255,255,0.06);
        }

        .msg-time {
            font-size: 10px;
            color: rgba(245,242,235,0.2);
            padding: 0 4px;
        }

        /* LOADING */
        .chat-loading {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .loading-spinner {
            width: 36px; height: 36px;
            border: 3px solid rgba(255,255,255,0.08);
            border-top-color: #FFE033;
            border-radius: 50%;
            animation: spin .7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* EMPTY */
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
        .chat-empty-text {
            font-size: 14px;
            font-weight: 300;
        }

        /* ERROR */
        .chat-error {
            margin: 0 32px 8px;
            background: rgba(255,80,60,0.1);
            border: 1px solid rgba(255,80,60,0.25);
            border-radius: 10px;
            padding: 10px 16px;
            font-size: 12px;
            color: #ff6b5b;
            flex-shrink: 0;
        }

        /* INPUT BAR */
        .chat-input-bar {
            padding: 16px 32px 24px;
            background: #0A0A0A;
            border-top: 1px solid rgba(255,255,255,0.06);
            flex-shrink: 0;
        }
        .chat-input-wrap {
            display: flex;
            align-items: flex-end;
            gap: 12px;
            background: #111;
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 16px;
            padding: 12px 16px;
            transition: border-color .2s, box-shadow .2s;
        }
        .chat-input-wrap:focus-within {
            border-color: rgba(255,224,51,0.35);
            box-shadow: 0 0 0 3px rgba(255,224,51,0.06);
        }
        .chat-input {
            flex: 1;
            background: transparent;
            border: none;
            outline: none;
            color: #F5F2EB;
            font-family: 'Epilogue', sans-serif;
            font-size: 14px;
            font-weight: 400;
            resize: none;
            line-height: 1.5;
            max-height: 120px;
            scrollbar-width: none;
        }
        .chat-input::placeholder { color: rgba(245,242,235,0.2); }
        .chat-input::-webkit-scrollbar { display: none; }

        .send-btn {
            width: 38px; height: 38px;
            background: #FFE033;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            flex-shrink: 0;
            transition: opacity .2s, transform .15s;
        }
        .send-btn:hover:not(:disabled) { opacity: .85; transform: scale(1.05); }
        .send-btn:active:not(:disabled) { transform: scale(.97); }
        .send-btn:disabled { opacity: .35; cursor: not-allowed; }

        @media (max-width: 768px) {
            .chat-nav { padding: 16px 20px; }
            .chat-messages { padding: 20px 0; }
            .msg-row { padding: 4px 16px; }
            .chat-input-bar { padding: 12px 16px 20px; }
            .date-divider { padding: 12px 16px; }
        }
        `}</style>

        <div className="chat-root">
        {/* Nav */}
        <nav className="chat-nav">
            <div className="chat-nav-left">
            <a href="/inbox" className="chat-back">← Back</a>
            <div className="chat-nav-divider" />
            <div className="chat-nav-avatar">
                {receiverId?.slice(0,2).toUpperCase() || '??'}
            </div>
            <div>
                <p className="chat-nav-name">Conversation</p>
                <p className="chat-nav-status">Plymouth, IN</p>
            </div>
            </div>
            <a href="/" className="chat-nav-logo">Catalyst</a>
        </nav>

        {/* Messages */}
        {loading ? (
            <div className="chat-loading">
            <div className="loading-spinner" />
            </div>
        ) : messages.length === 0 ? (
            <div className="chat-empty">
            <div className="chat-empty-icon">💬</div>
            <p className="chat-empty-text">No messages yet — say hello!</p>
            </div>
        ) : (
            <div className="chat-messages">
            <div className="date-divider">
                <span>Conversation Start</span>
            </div>

            {messages.map((msg, i) => {
                const isMe = msg.sender_id === currentUser?.id
                const time = msg.created_at
                ? new Date(msg.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
                : ''

                return (
                <div key={msg.id || i} className={`msg-row ${isMe ? 'mine' : 'theirs'}`}>
                    <div className="msg-avatar">
                    {isMe ? 'ME' : (receiverId?.slice(0,2).toUpperCase() || '??')}
                    </div>
                    <div className="msg-bubble-wrap">
                    <div className="msg-bubble">{msg.content}</div>
                    <span className="msg-time">{time}</span>
                    </div>
                </div>
                )
            })}
            </div>
        )}

        {/* Error */}
        {error && (
            <div className="chat-error">⚠️ {error}</div>
        )}

        {/* Input */}
        <div className="chat-input-bar">
            <div className="chat-input-wrap">
            <textarea
                className="chat-input"
                rows={1}
                placeholder="Type a message..."
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    sendMessage()
                }
                }}
                onInput={e => {
                e.target.style.height = 'auto'
                e.target.style.height = e.target.scrollHeight + 'px'
                }}
            />
            <button
                className="send-btn"
                onClick={sendMessage}
                disabled={!newMessage.trim()}
            >
                ↑
            </button>
            </div>
        </div>

        <div ref={bottomRef} />
        </div>
    </>
    )
}