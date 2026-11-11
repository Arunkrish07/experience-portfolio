// =============================================================
//  /api/chat  — Vercel serverless function
//  Streams answers from Claude. The API key lives ONLY here, in
//  the ANTHROPIC_API_KEY environment variable — never in the
//  frontend bundle. If this endpoint is absent or the key is
//  unset, the frontend automatically uses offline keyword matching.
//
//  Set in Vercel → Project → Settings → Environment Variables:
//    ANTHROPIC_API_KEY = sk-ant-...           (required for AI mode)
//    ANTHROPIC_MODEL   = claude-opus-5-5       (optional override,
//                        e.g. claude-haiku-5-5 for a cheaper model)
// =============================================================
import Anthropic from '@anthropic-ai/sdk'
import { buildSystemPrompt } from '../src/chatbot/knowledge.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    // No key configured → tell the client to use its offline fallback.
    res.status(503).json({ error: 'AI backend not configured' })
    return
  }

  // Parse + sanitise the conversation (defence against oversized/odd input).
  let body = req.body
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body)
    } catch {
      body = {}
    }
  }
  const incoming = Array.isArray(body?.messages) ? body.messages : []
  const messages = incoming
    .filter(
      (m) =>
        m &&
        (m.role === 'user' || m.role === 'assistant') &&
        typeof m.content === 'string' &&
        m.content.trim(),
    )
    .slice(-12) // keep recent history only
    .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }))

  // The Messages API requires the first message to be from the user.
  while (messages.length && messages[0].role !== 'user') messages.shift()
  if (!messages.length) {
    res.status(400).json({ error: 'No user message provided' })
    return
  }

  const client = new Anthropic({ apiKey })
  const model = process.env.ANTHROPIC_MODEL || 'claude-opus-5-5'

  // Stream back as Server-Sent Events.
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8')
  res.setHeader('Cache-Control', 'no-cache, no-transform')
  res.setHeader('Connection', 'keep-alive')
  res.flushHeaders?.()

  try {
    const stream = client.messages.stream({
      model,
      max_tokens: 1024,
      output_config: { effort: 'low' }, // simple Q&A → low effort = fast + cheap
      system: [
        {
          type: 'text',
          text: buildSystemPrompt(),
          cache_control: { type: 'ephemeral' }, // cache the stable profile prompt
        },
      ],
      messages,
    })

    stream.on('text', (delta) => {
      res.write(`data: ${JSON.stringify({ delta })}\n\n`)
    })

    await stream.finalMessage()
    res.write('data: [DONE]\n\n')
    res.end()
  } catch (err) {
    // Surface a short error; the client falls back to keyword answers.
    try {
      res.write(`data: ${JSON.stringify({ error: String(err?.message || 'api_error') })}\n\n`)
      res.end()
    } catch {
      res.end()
    }
  }
}
