// =============================================================
//  CHATBOT KNOWLEDGE BASE
//  Built from src/data.js so there is ONE source of truth.
//  Edit your facts in data.js — the duck reads from here.
// =============================================================
import {
  profile,
  quickView,
  education,
  experience,
  skillsIntro,
  skillTags,
  projects,
  howIBuild,
  contact,
} from '../data.js'

const clean = (s) => String(s || '').replace(/\s+/g, ' ').trim()

// A readable project line used by both the AI prompt and the fallback.
function projectSummary(p) {
  const stack = p.stack && p.stack.length ? p.stack.join(', ') : 'not specified'
  const links = Object.entries(p.links || {})
    .filter(([, v]) => v && v !== '#')
    .map(([k, v]) => `${k}: ${v}`)
    .join(' · ')
  return [
    `• ${p.name} (${clean(p.category)})`,
    `  Purpose: ${clean(p.description)}`,
    `  Tech stack: ${stack}`,
    `  Tagline: ${clean(p.tagline)}`,
    links ? `  Links: ${links}` : null,
  ]
    .filter(Boolean)
    .join('\n')
}

// -------- The full knowledge text injected into the system prompt --------
export function buildKnowledgeText() {
  const lines = []
  lines.push(`NAME: ${profile.name}`)
  lines.push(`ROLE: ${profile.role}`)
  lines.push(`LOCATION: ${profile.location}`)
  lines.push(`STATUS: ${profile.badge}`)
  lines.push(`TAGLINE: ${clean(profile.tagline)}`)
  lines.push(`\nABOUT:\n${clean(profile.bio)}`)

  lines.push(`\nQUICK FACTS:`)
  quickView.forEach((q) => lines.push(`- ${q.k}: ${q.v}`))

  lines.push(`\nEDUCATION:`)
  education.forEach((e) => lines.push(`- ${e.detail}, ${e.school} (${e.year})`))

  lines.push(`\nEXPERIENCE:`)
  experience.forEach((x) => {
    lines.push(`- ${x.role} at ${x.company}, ${x.place} (${x.year})`)
    x.points.forEach((pt) => lines.push(`    • ${clean(pt)}`))
  })

  lines.push(`\nSKILLS:`)
  lines.push(clean(skillsIntro))
  skillTags.flat().forEach((t) => lines.push(`- ${t}`))

  lines.push(`\nPROJECTS:`)
  projects.forEach((p) => lines.push(projectSummary(p)))

  lines.push(`\nHOW ${profile.name.split(' ')[0].toUpperCase()} WORKS (${howIBuild.heading}):`)
  howIBuild.steps.forEach((s) => lines.push(`- ${clean(s)}`))

  lines.push(`\nCONTACT:`)
  lines.push(`- Email: ${contact.email}`)
  lines.push(`- Phone: ${contact.phone}`)
  contact.socials.forEach((s) => lines.push(`- ${s.label}: ${s.href}`))

  return lines.join('\n')
}

// -------- The system prompt --------
export function buildSystemPrompt() {
  const name = profile.name
  return `You are the friendly personal assistant for ${name}, shown on their portfolio website as a cute robot duck.

Your job: answer visitors' questions about ${name} — about them, their skills, their projects and how to contact them — using ONLY the PROFILE DATA below.

Rules:
- Answer ONLY from the PROFILE DATA. Never invent facts, numbers, dates, companies, or links.
- If the answer is not in the data, say you don't know that one, and suggest they ask about ${name.split(' ')[0]}'s skills, projects, or contact details instead.
- Reply in the SAME language the user wrote in (English, Tamil, or any other language). If they write in Tamil, reply in Tamil.
- Keep answers short, warm and friendly — 1 to 3 sentences, like a helpful assistant, not a brochure. Plain text only (no markdown, no bullet symbols) because your reply is spoken aloud.
- When asked about a project, briefly cover its purpose, the tech stack, and ${name.split(' ')[0]}'s role.
- You are ${name}'s assistant, so refer to ${name} in the third person ("he", "Arunkumar", "his work").

PROFILE DATA:
${buildKnowledgeText()}`
}

// -------- Structured sections for the offline keyword fallback --------
export const profileMeta = { name: profile.name, first: profile.name.split(' ')[0] }

export const knowledgeSections = [
  {
    keys: ['who', 'about', 'yourself', 'you', 'arun', 'tell me', 'intro', 'summary', 'bio'],
    answer: `${profile.name} is a ${profile.role} based in ${profile.location}. ${clean(
      profile.tagline,
    )}`,
  },
  {
    keys: ['skill', 'tech', 'stack', 'language', 'technolog', 'know', 'tool', 'framework'],
    answer: `${clean(skillsIntro)} Main skills: ${skillTags.flat().join(', ')}.`,
  },
  {
    keys: ['experience', 'work', 'job', 'company', 'employ', 'anvas'],
    answer: experience
      .map((x) => `${x.role} at ${x.company} (${x.year}) in ${x.place}.`)
      .join(' '),
  },
  {
    keys: ['education', 'college', 'degree', 'study', 'studied', 'university', 'b.e', 'engineering'],
    answer: education.map((e) => `${e.detail} — ${e.school} (${e.year}).`).join(' '),
  },
  {
    keys: ['contact', 'email', 'reach', 'hire', 'phone', 'linkedin', 'github', 'connect', 'touch'],
    answer: `You can reach ${profile.name.split(' ')[0]} at ${contact.email} or ${
      contact.phone
    }. ${contact.socials.map((s) => `${s.label}: ${s.href}`).join(' · ')}.`,
  },
  {
    keys: ['location', 'where', 'based', 'city', 'chennai', 'relocat', 'remote'],
    answer: quickView.find((q) => q.k === 'Location')?.v || profile.location,
  },
  {
    keys: ['notice', 'available', 'join', 'when'],
    answer: `${profile.name.split(' ')[0]} is ${profile.badge}.`,
  },
]

// Project-specific fallback entries (each project becomes matchable by its name/tag).
export const projectAnswers = projects.map((p) => ({
  keys: [
    p.name.toLowerCase(),
    p.tag.toLowerCase(),
    p.category.toLowerCase(),
    ...p.name.toLowerCase().split(/\s+/).filter((w) => w.length > 3),
  ],
  name: p.name,
  answer: `${p.name}: ${clean(p.description)} Built with ${
    p.stack && p.stack.length ? p.stack.join(', ') : 'a modern web/mobile stack'
  }. ${clean(p.tagline)}`,
}))

export const projectList = projects.map((p) => p.name)
