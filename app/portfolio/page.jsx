'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'
import Navbar from '../../components/NavBar'

export default function Portfolio() {
  const [items, setItems] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [url, setUrl] = useState('')
  const [error, setError] = useState(null)
  const router = useRouter()

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/auth/login')
      return
    }
    setCurrentUser(user)

    const { data, error } = await supabase.from('portfolio_items').select('*').eq('user_id', user.id);
    if (error) {
        setError(error.message);
    } else {
        setItems(data);
    }
    setLoading(false);
  }

  const addItem = async (e) => {
    e.preventDefault()
    const { error } = await supabase.from('portfolio_items').insert({ user_id: currentUser.id, title, description, url })
    if (error) setError(error.message)
    fetchItems()
    setTitle('')
    setDescription('')
    setUrl('')
  }

  const deleteItem = async (itemId) => {
    await supabase.from('portfolio_items').delete().eq('id', itemId)
    const { data } = await supabase.from('portfolio_items').select('*').eq('user_id', currentUser.id)
    setItems(data)
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

        /* ── BODY ── */
        .body {
          max-width: 1040px;
          margin: 0 auto;
          padding: 64px 40px 100px;
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 24px;
          align-items: start;
        }

        /* ── LEFT ── */
        .left { display: flex; flex-direction: column; gap: 16px; }

        /* banner */
        .banner {
          background: var(--gray);
          border: 1px solid var(--border);
          border-radius: 24px;
          padding: 40px 36px;
          position: relative;
          overflow: hidden;
          margin-bottom: 4px;
        }

        .banner::before {
          content: 'WORK';
          position: absolute;
          right: -10px;
          top: 50%;
          transform: translateY(-50%);
          font-family: 'Syne', sans-serif;
          font-size: 130px;
          font-weight: 800;
          color: rgba(255,255,255,0.025);
          pointer-events: none;
          letter-spacing: -.04em;
        }

        .banner-glow {
          position: absolute;
          top: -60px; left: -60px;
          width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(255,224,51,0.08) 0%, transparent 65%);
          pointer-events: none;
        }

        .banner-eyebrow {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: .14em;
          text-transform: uppercase;
          color: var(--orange);
          margin-bottom: 12px;
          position: relative;
          z-index: 1;
        }

        .banner-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(32px, 4vw, 52px);
          font-weight: 800;
          letter-spacing: -.03em;
          line-height: 1.0;
          position: relative;
          z-index: 1;
        }

        .banner-title span { color: var(--yellow); }

        .banner-sub {
          font-size: 14px;
          color: var(--muted);
          margin-top: 12px;
          position: relative;
          z-index: 1;
          max-width: 400px;
          line-height: 1.6;
        }

        /* ── PORTFOLIO ITEMS ── */
        .items-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .item-card {
          background: var(--gray);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 28px 24px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          position: relative;
          overflow: hidden;
          transition: border-color .18s, transform .18s;
          group: true;
        }

        .item-card:hover {
          border-color: rgba(255,255,255,0.15);
          transform: translateY(-2px);
        }

        .item-num {
          font-family: 'Syne', sans-serif;
          font-size: 56px;
          font-weight: 800;
          color: rgba(255,255,255,0.03);
          position: absolute;
          top: 12px;
          right: 18px;
          line-height: 1;
          letter-spacing: -.04em;
          pointer-events: none;
        }

        .item-icon {
          width: 40px; height: 40px;
          border-radius: 10px;
          background: rgba(255,224,51,0.1);
          border: 1px solid rgba(255,224,51,0.18);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
        }

        .item-title {
          font-family: 'Syne', sans-serif;
          font-size: 17px;
          font-weight: 800;
          letter-spacing: -.01em;
          color: #F5F2EB;
          line-height: 1.2;
          position: relative;
          z-index: 1;
        }

        .item-desc {
          font-size: 13px;
          font-weight: 400;
          color: var(--muted);
          line-height: 1.6;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .item-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-top: auto;
          padding-top: 14px;
          border-top: 1px solid var(--border);
        }

        .item-link {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 600;
          color: var(--yellow);
          text-decoration: none;
          letter-spacing: .02em;
          transition: opacity .15s;
          overflow: hidden;
        }

        .item-link:hover { opacity: .75; }

        .item-link-text {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 140px;
        }

        .item-delete {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 30px; height: 30px;
          border-radius: 8px;
          background: rgba(255,68,68,0.06);
          border: 1px solid rgba(255,68,68,0.14);
          color: rgba(255,100,100,0.6);
          font-size: 14px;
          cursor: pointer;
          transition: background .15s, border-color .15s, color .15s;
          flex-shrink: 0;
        }

        .item-delete:hover {
          background: rgba(255,68,68,0.14);
          border-color: rgba(255,68,68,0.3);
          color: #ff6060;
        }

        .item-delete:disabled { opacity: .35; cursor: not-allowed; }

        /* empty state */
        .items-empty {
          grid-column: 1 / -1;
          background: var(--gray);
          border: 1px dashed rgba(255,255,255,0.1);
          border-radius: 20px;
          padding: 64px 24px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .items-empty-icon { font-size: 40px; }

        .items-empty-title {
          font-family: 'Syne', sans-serif;
          font-size: 20px;
          font-weight: 800;
          letter-spacing: -.02em;
          color: rgba(245,242,235,0.2);
        }

        .items-empty-sub {
          font-size: 13px;
          color: rgba(245,242,235,0.15);
          max-width: 240px;
          line-height: 1.6;
        }

        /* ── RIGHT / FORM ── */
        .right {
          position: sticky;
          top: 84px;
        }

        .form-card {
          background: var(--gray);
          border: 1px solid var(--border);
          border-radius: 24px;
          padding: 32px 28px;
        }

        .form-eyebrow {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .14em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.25);
          margin-bottom: 8px;
        }

        .form-title {
          font-family: 'Syne', sans-serif;
          font-size: 20px;
          font-weight: 800;
          letter-spacing: -.02em;
          margin-bottom: 28px;
        }

        .field {
          margin-bottom: 16px;
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .field label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
        }

        .field input, .field textarea {
          background: var(--black);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 10px;
          padding: 13px 14px;
          color: #F5F2EB;
          font-family: 'Instrument Sans', sans-serif;
          font-size: 14px;
          font-weight: 400;
          outline: none;
          transition: border-color .18s, box-shadow .18s;
          resize: none;
          width: 100%;
        }

        .field input::placeholder, .field textarea::placeholder {
          color: rgba(245,242,235,0.18);
        }

        .field input:focus, .field textarea:focus {
          border-color: var(--yellow);
          box-shadow: 0 0 0 3px rgba(255,224,51,0.08);
        }

        .error-box {
          background: rgba(255,80,60,0.08);
          border: 1px solid rgba(255,80,60,0.2);
          border-radius: 10px;
          padding: 11px 14px;
          font-size: 13px;
          color: #ff7060;
          margin-bottom: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .submit-btn {
          width: 100%;
          padding: 15px;
          background: var(--yellow);
          color: var(--black);
          border: none;
          border-radius: 12px;
          font-family: 'Syne', sans-serif;
          font-size: 15px;
          font-weight: 800;
          letter-spacing: -.01em;
          cursor: pointer;
          transition: opacity .18s, transform .15s;
          margin-top: 4px;
        }

        .submit-btn:hover:not(:disabled) { opacity: .88; transform: translateY(-1px); }
        .submit-btn:disabled { opacity: .45; cursor: not-allowed; }

        .spinner {
          display: inline-block;
          width: 14px; height: 14px;
          border: 2px solid rgba(0,0,0,0.25);
          border-top-color: var(--black);
          border-radius: 50%;
          animation: spin .6s linear infinite;
          vertical-align: middle;
          margin-right: 8px;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        /* count badge */
        .items-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .items-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .14em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.25);
        }

        .items-count {
          font-size: 12px;
          font-weight: 700;
          color: var(--yellow);
          background: rgba(255,224,51,0.1);
          border: 1px solid rgba(255,224,51,0.18);
          padding: 3px 10px;
          border-radius: 100px;
        }

        /* ── SPINNER ── */
        .spinner-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
        }

        .page-spinner {
          width: 36px; height: 36px;
          border: 3px solid rgba(255,255,255,0.07);
          border-top-color: var(--yellow);
          border-radius: 50%;
          animation: spin .7s linear infinite;
        }

        @media (max-width: 860px) {
          .nav { padding: 0 20px; }
          .body { grid-template-columns: 1fr; padding: 40px 20px 80px; }
          .right { position: static; }
          .items-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="root">
        {/* ── NAV ── */}
        <Navbar />

        {loading ? (
          <div className="spinner-wrap"><div className="page-spinner" /></div>
        ) : (
          <div className="body">

            {/* ── LEFT ── */}
            <div className="left">

              {/* Banner */}
              <div className="banner">
                <div className="banner-glow" />
                <p className="banner-eyebrow">✨ Showcase</p>
                <h1 className="banner-title">Your <span>Portfolio</span></h1>
                <p className="banner-sub">Add your best work — projects, gigs, or anything that shows employers what you can do.</p>
              </div>

              {/* Items */}
              <div className="items-header">
                <span className="items-label">Your Work</span>
                {items.length > 0 && <span className="items-count">{items.length} item{items.length !== 1 ? 's' : ''}</span>}
              </div>

              <div className="items-grid">
                {items.length === 0 ? (
                  <div className="items-empty">
                    <div className="items-empty-icon">🗂️</div>
                    <p className="items-empty-title">Nothing here yet</p>
                    <p className="items-empty-sub">Add your first portfolio item using the form →</p>
                  </div>
                ) : (
                  items.map((item, i) => (
                    <div key={item.id} className="item-card">
                      <div className="item-num">{String(i + 1).padStart(2, '0')}</div>
                      <div className="item-icon">🔗</div>
                      <p className="item-title">{item.title}</p>
                      {item.description && (
                        <p className="item-desc">{item.description}</p>
                      )}
                      <div className="item-footer">
                        {item.url ? (
                          <a href={item.url} target="_blank" rel="noopener noreferrer" className="item-link">
                            <span>↗</span>
                            <span className="item-link-text">{getDomain(item.url)}</span>
                          </a>
                        ) : (
                          <span style={{fontSize:'12px', color:'rgba(245,242,235,0.15)'}}>No link</span>
                        )}
                        <button
                          className="item-delete"
                          onClick={() => deleteItem(item.id)}
                          disabled={deletingId === item.id}
                          title="Delete item"
                        >
                          {deletingId === item.id ? '…' : '🗑'}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* ── RIGHT / FORM ── */}
            <div className="right">
              <div className="form-card">
                <p className="form-eyebrow">New item</p>
                <p className="form-title">Add to Portfolio</p>

                <form onSubmit={addItem}>
                  <div className="field">
                    <label>Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Lawn Care for the Johnsons"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="field">
                    <label>Description</label>
                    <textarea
                      rows={4}
                      placeholder="What did you do? What was the result?"
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                    />
                  </div>

                  <div className="field">
                    <label>Link <span style={{opacity:.4, fontWeight:400, textTransform:'none', letterSpacing:0}}>(optional)</span></label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={url}
                      onChange={e => setUrl(e.target.value)}
                    />
                  </div>

                  {error && (
                    <div className="error-box"><span>⚠️</span> {error}</div>
                  )}

                  <button type="submit" className="submit-btn" disabled={adding}>
                    {adding && <span className="spinner" />}
                    {adding ? 'Adding…' : 'Add Item →'}
                  </button>
                </form>
              </div>
            </div>

          </div>
        )}
      </div>
    </>
  )
}