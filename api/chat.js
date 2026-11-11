// =============================================================
//  /api/chat  — Vercel serverless function (Groq, OpenAI-compatible)
//  Streams answers from Groq's chat-completions API. The API key
//  lives ONLY here, in the GROQ_API_KEY environment variable —
//  never in the frontend bundle. If this endpoint is absent or the
//  key is unset, the frontend automatically uses offline keyword
//  matching.
//
//  Set in Vercel → Project → Settings → Environment Variables:
//    GROQ_API_KEY = gsk_...                       (required for AI mode)
//    GROQ_MODEL   = llama-3.3-70b-versatile       (optional override)
//
//  Get a free key at https://console.groq.com → API Keys.
// =============================================================
import { buildSystemPrompt } from '../src/chatbot/knowledge.js'

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    // No key configured → tell the client to use its offline fallback.
    res.status(503).json({ error: 'AI backend not configured' })
    return
  }

  // Parse + sanitise the conversation.
  let body = req.body
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body)
    } catch {
      body = {}
    }
  }
  const incoming = Array.isArray(body?.messages) ? body.messages : []
  const history = incoming
    .filter(
      (m) =>
        m &&
        (m.role === 'user' || m.role === 'assistant') &&
        typeof m.content === 'string' &&
        m.content.trim(),
    )
    .slice(-12)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }))

  while (history.length && history[0].role !== 'user') history.shift()
  if (!history.length) {
    res.status(400).json({ error: 'No user message provided' })
    return
  }

  const model = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile'
  const messages = [{ role: 'system', content: buildSystemPrompt() }, ...history]

  // Stream back as Server-Sent Events (same contract the frontend expects).
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8')
  res.setHeader('Cache-Control', 'no-cache, no-transform')
  res.setHeader('Connection', 'keep-alive')
  res.flushHeaders?.()

  try {
    const upstream = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages,
        stream: true,
        temperature: 0.5,
        max_tokens: 512,
      }),
    })

    if (!upstream.ok || !upstream.body) {
      const errText = await upstream.text().catch(() => '')
      res.write(`data: ${JSON.stringify({ error: `${upstream.status} ${errText.slice(0, 300)}` })}\n\n`)
      res.end()
      return
    }

    // Parse Groq's OpenAI-style SSE and re-emit our {delta} events.
    const reader = upstream.body.getReader()
    const decoder = new TextDecoder()
    let buf = ''
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
          const delta = obj?.choices?.[0]?.delta?.content
          if (delta) res.write(`data: ${JSON.stringify({ delta })}\n\n`)
        } catch {
          /* ignore malformed chunk */
        }
      }
    }

    res.write('data: [DONE]\n\n')
    res.end()
  } catch (err) {
    try {
      res.write(`data: ${JSON.stringify({ error: String(err?.message || 'api_error') })}\n\n`)
      res.end()
    } catch {
      res.end()
    }
  }
}
