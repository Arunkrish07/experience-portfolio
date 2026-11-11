// =============================================================
//  OFFLINE FALLBACK
//  Simple keyword matching over the profile data. Used when the
//  /api/chat backend is unreachable (plain `vite` dev, no API key,
//  or an API error) so the duck still gives useful answers.
// =============================================================
import {
  knowledgeSections,
  projectAnswers,
  projectList,
  profileMeta,
} from './knowledge'

function score(text, keys) {
  const t = text.toLowerCase()
  let s = 0
  for (const k of keys) {
    if (t.includes(k)) s += k.length // longer, more specific matches win
  }
  return s
}

export function keywordAnswer(rawText) {
  const text = (rawText || '').toLowerCase().trim()
  if (!text) return `Hi! Ask me about ${profileMeta.first}, his skills, his projects or how to contact him.`

  // Greetings
  if (/^(hi|hello|hey|hai|vanakkam|வணக்கம்|namaste)\b/.test(text)) {
    return `Hello! I'm ${profileMeta.first}'s assistant duck. Ask me about his skills, his projects or how to reach him.`
  }

  // Best project match
  let best = { s: 0, answer: null }
  for (const p of projectAnswers) {
    const s = score(text, p.keys)
    if (s > best.s) best = { s, answer: p.answer }
  }
  // Best general-section match
  for (const sec of knowledgeSections) {
    const s = score(text, sec.keys)
    if (s > best.s) best = { s, answer: sec.answer }
  }

  // "What projects / list" style questions
  if (!best.answer && /(project|portfolio|built|made|app)/.test(text)) {
    return `${profileMeta.first} has built: ${projectList.join(
      ', ',
    )}. Ask me about any one of them!`
  }

  if (best.answer) return best.answer

  // Don't-know fallback (matches the AI behaviour)
  return `I'm not sure about that one — I only know about ${profileMeta.first}. Try asking about his skills, a project like "${projectList[1] || projectList[0]}", or how to contact him.`
}
