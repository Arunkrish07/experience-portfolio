// =============================================================
//  DUCK CHATBOT  — floating AI assistant widget
//  - Duck is shown with the micro-duck video clips; idle loops,
//    hover/tap plays a random reaction clip (walk, sit-stand,
//    kick, grab, drive, stand-up) with a speech bubble.
//  - Streams answers from /api/chat (Claude); falls back to
//    offline keyword matching when the backend is unavailable.
//  - Speaks replies (Web Speech API).
// =============================================================
import { useEffect, useRef, useState } from 'react'
import './chatbot.css'
import DuckVideo, { VIDEO_REACTIONS, VIDEO_REACTION_KEYS } from './DuckVideo'
import { keywordAnswer } from './keywordFallback'
import { profileMeta } from './knowledge'
import { useSpeech, getRecognition, micSupported, LANG_OPTIONS } from './useSpeech'

const QUICK = [
  'Tell me about yourself',
  'Skills',
  'Tender Management project',
  'Contact',
]

const pick = (a) => a[Math.floor(Math.random() * a.length)]
const REACTION_SAFETY_MS = 6000 // force-end if a clip never fires 'ended'

let idSeq = 0
const nextId = () => `m${++idSeq}`

export default function DuckChatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [langPref, setLangPref] = useState('auto')
  const [theme, setTheme] = useState('auto') // auto | light | dark
  const [listening, setListening] = useState(false)

  const [reaction, setReaction] = useState(null) // { name, text }
  const [scrolling, setScrolling] = useState(false) // duck walks while page scrolls
  const cooldownRef = useRef(false)
  const scrollTimer = useRef(null)
  const safetyTimer = useRef(null)
  const bubbleTimer = useRef(null)
  const releaseTimer = useRef(null)
  const recRef = useRef(null)

  const speech = useSpeech()
  const messagesRef = useRef(null)

  // seed greeting on first open
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          id: nextId(),
          role: 'bot',
          text: `Hi! 👋 I'm ${profileMeta.first}'s assistant. Ask me about him, his skills, his projects, or how to get in touch!`,
        },
      ])
    }
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  // autoscroll
  useEffect(() => {
    const el = messagesRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, loading])

  // cleanup of all reaction timers
  useEffect(
    () => () => {
      clearTimeout(safetyTimer.current)
      clearTimeout(bubbleTimer.current)
      clearTimeout(releaseTimer.current)
      clearTimeout(scrollTimer.current)
    },
    [],
  )

  // while the page is scrolling, the duck walks; it returns to sit-stand idle
  // a moment after scrolling stops
  useEffect(() => {
    const onScroll = () => {
      setScrolling(true)
      clearTimeout(scrollTimer.current)
      scrollTimer.current = setTimeout(() => setScrolling(false), 600)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // --- reactions (driven by the video clips) ---
  function triggerReaction() {
    if (cooldownRef.current) return
    cooldownRef.current = true
    const name = pick(VIDEO_REACTION_KEYS)
    const text = pick(VIDEO_REACTIONS[name].lines)
    setReaction({ name, text })
    clearTimeout(safetyTimer.current)
    // safety net in case the video never reports 'ended'
    safetyTimer.current = setTimeout(endReaction, REACTION_SAFETY_MS)
  }

  // called when a reaction clip finishes (or errors)
  function endReaction() {
    clearTimeout(safetyTimer.current)
    setReaction((r) => (r ? { name: null, text: r.text } : null)) // back to idle, keep bubble a moment
    clearTimeout(bubbleTimer.current)
    bubbleTimer.current = setTimeout(() => setReaction(null), 1200)
    clearTimeout(releaseTimer.current)
    releaseTimer.current = setTimeout(() => {
      cooldownRef.current = false
    }, 500)
  }

  // ---- streaming from the Claude backend ----
  async function streamFromApi(history, lang, onDelta) {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: history, lang }),
    })
    const ct = res.headers.get('content-type') || ''
    if (!res.ok || !ct.includes('text/event-stream') || !res.body) {
      throw new Error('backend-unavailable')
    }
    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let buf = ''
    let full = ''
    for (;;) {
      const { value, done } = await reader.read()
      if (done) break
      buf += decoder.decode(value, { stream: true })
      const parts = buf.split('\n\n')
      buf = parts.pop() || ''
      for (const part of parts) {
        const line = part.trim()
        if (!line.startsWith('data:')) continue
        const data = line.slice(5).trim()
        if (data === '[DONE]') continue
        try {
          const obj = JSON.parse(data)
          if (obj.delta) {
            full += obj.delta
            onDelta(full)
          } else if (obj.error) {
            throw new Error(obj.error)
          }
        } catch {
          /* ignore malformed chunk */
        }
      }
    }
    if (!full.trim()) throw new Error('empty-response')
    return full
  }

  async function send(raw) {
    const text = (raw ?? input).trim()
    if (!text || loading) return
    const userMsg = { id: nextId(), role: 'user', text }
    const history = [...messages, userMsg]
      .filter((m) => m.text)
      .map((m) => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.text }))

    setMessages((m) => [...m, userMsg])
    setInput('')
    setLoading(true)

    const botId = nextId()
    setMessages((m) => [...m, { id: botId, role: 'bot', text: '' }])
    const setBot = (t) => setMessages((m) => m.map((x) => (x.id === botId ? { ...x, text: t } : x)))

    try {
      const full = await streamFromApi(history, langPref, setBot)
      speech.speak(full, langPref)
    } catch {
      const ans = keywordAnswer(text)
      await new Promise((r) => setTimeout(r, 350))
      setBot(ans)
      speech.speak(ans, langPref)
    } finally {
      setLoading(false)
    }
  }

  function toggleMic() {
    if (listening) {
      recRef.current?.stop()
      return
    }
    const rec = getRecognition(langPref)
    if (!rec) return
    recRef.current = rec
    rec.onstart = () => setListening(true)
    rec.onend = () => setListening(false)
    rec.onerror = () => setListening(false)
    rec.onresult = (e) => {
      const said = e.results?.[0]?.[0]?.transcript
      if (said) {
        setInput(said)
        send(said)
      }
    }
    try {
      rec.start()
    } catch {
      setListening(false)
    }
  }

  function cycleTheme() {
    setTheme((t) => (t === 'auto' ? 'light' : t === 'light' ? 'dark' : 'auto'))
  }
  const themeIcon = theme === 'dark' ? '🌙' : theme === 'light' ? '☀️' : '🌗'
  const reactionName = reaction?.name || null

  return (
    <div className="duck-root" data-duck-theme={theme}>
      {!open && (
        <div className="duck-launcher">
          {reaction?.text && <div className="duck-reaction-bubble">{reaction.text}</div>}
          <button
            className="duck-launcher-btn"
            onPointerEnter={triggerReaction}
            onClick={() => setOpen(true)}
            aria-label={`Open chat with ${profileMeta.first}'s assistant`}
          >
            <span className="duck-3d-holder">
              <DuckVideo reaction={reactionName} scrolling={scrolling} onReactionEnd={endReaction} />
            </span>
          </button>
        </div>
      )}

      {open && (
        <div className="duck-window" role="dialog" aria-label="Assistant chat">
          <div className="duck-header">
            <button
              className="duck-header-duck"
              onClick={triggerReaction}
              onPointerEnter={triggerReaction}
              aria-label="Poke the duck"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              <span className="duck-3d-holder">
                <DuckVideo reaction={reactionName} scrolling={scrolling} onReactionEnd={endReaction} />
              </span>
            </button>
            <div className="duck-header-text">
              <b>{profileMeta.name.split(' ')[0]}'s Duck</b>
              <span>Ask me anything about {profileMeta.first}</span>
            </div>
            <div className="duck-header-actions">
              <select
                className="duck-lang-select"
                value={langPref}
                onChange={(e) => setLangPref(e.target.value)}
                aria-label="Reply language"
                title="Language"
              >
                {LANG_OPTIONS.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.label}
                  </option>
                ))}
              </select>
              {speech.supported && (
                <button
                  className="duck-icon-btn"
                  onClick={() => speech.setMuted((v) => !v)}
                  aria-label={speech.muted ? 'Unmute voice' : 'Mute voice'}
                  title={speech.muted ? 'Unmute' : 'Mute'}
                >
                  {speech.muted ? '🔇' : '🔊'}
                </button>
              )}
              <button className="duck-icon-btn" onClick={cycleTheme} aria-label="Toggle theme" title={`Theme: ${theme}`}>
                {themeIcon}
              </button>
              <button className="duck-icon-btn" onClick={() => setOpen(false)} aria-label="Close chat" title="Close">
                ✕
              </button>
            </div>
          </div>

          <div className="duck-messages" ref={messagesRef}>
            {messages.map((m) => (
              <div key={m.id} className={`duck-msg ${m.role}`}>
                <div className="duck-bubble">
                  {m.text ? (
                    m.text
                  ) : (
                    <span className="duck-typing" aria-label="typing">
                      <i />
                      <i />
                      <i />
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {messages.length <= 1 && (
            <div className="duck-chips">
              {QUICK.map((q) => (
                <button key={q} className="duck-chip" onClick={() => send(q)}>
                  {q}
                </button>
              ))}
            </div>
          )}

          <form
            className="duck-input"
            onSubmit={(e) => {
              e.preventDefault()
              send()
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask about ${profileMeta.first}…`}
              aria-label="Type your question"
            />
            {micSupported && (
              <button
                type="button"
                className={`duck-mic${listening ? ' is-listening' : ''}`}
                onClick={toggleMic}
                aria-label={listening ? 'Stop listening' : 'Speak your question'}
                title="Voice input"
              >
                🎤
              </button>
            )}
            <button className="duck-send" type="submit" disabled={loading || !input.trim()} aria-label="Send">
              ➤
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
