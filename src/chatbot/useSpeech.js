// =============================================================
//  SPEECH  — Web Speech API (SpeechSynthesis + SpeechRecognition)
//  Detects the language, speaks replies in the matching voice,
//  and (optionally) listens to mic input.
// =============================================================
import { useCallback, useEffect, useRef, useState } from 'react'

// --- Language detection by Unicode script, with a few common languages ---
export function detectLang(text = '') {
  if (/[஀-௿]/.test(text)) return 'ta-IN' // Tamil
  if (/[ऀ-ॿ]/.test(text)) return 'hi-IN' // Devanagari / Hindi
  if (/[ఀ-౿]/.test(text)) return 'te-IN' // Telugu
  if (/[ಀ-೿]/.test(text)) return 'kn-IN' // Kannada
  if (/[ഀ-ൿ]/.test(text)) return 'ml-IN' // Malayalam
  if (/[؀-ۿ]/.test(text)) return 'ar-SA' // Arabic
  if (/[一-鿿]/.test(text)) return 'zh-CN' // Chinese
  if (/[぀-ヿ]/.test(text)) return 'ja-JP' // Japanese
  if (/[가-힯]/.test(text)) return 'ko-KR' // Korean
  if (/[Ѐ-ӿ]/.test(text)) return 'ru-RU' // Cyrillic
  return 'en-IN' // default
}

export const LANG_OPTIONS = [
  { code: 'auto', label: 'Auto' },
  { code: 'en-IN', label: 'English' },
  { code: 'ta-IN', label: 'தமிழ்' },
  { code: 'hi-IN', label: 'हिन्दी' },
]

function pickVoice(voices, lang) {
  if (!voices || !voices.length) return null
  const base = lang.split('-')[0]
  return (
    voices.find((v) => v.lang === lang) ||
    voices.find((v) => v.lang && v.lang.replace('_', '-') === lang) ||
    voices.find((v) => v.lang && v.lang.toLowerCase().startsWith(base)) ||
    voices.find((v) => v.default) ||
    voices[0]
  )
}

export function useSpeech() {
  const synth = typeof window !== 'undefined' ? window.speechSynthesis : null
  const supported = !!synth
  const [voices, setVoices] = useState([])
  const [muted, setMuted] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const mutedRef = useRef(false)
  useEffect(() => {
    mutedRef.current = muted
    if (muted && synth) synth.cancel()
  }, [muted, synth])

  useEffect(() => {
    if (!synth) return
    const load = () => setVoices(synth.getVoices())
    load()
    synth.addEventListener?.('voiceschanged', load)
    return () => synth.removeEventListener?.('voiceschanged', load)
  }, [synth])

  const speak = useCallback(
    (text, langPref = 'auto') => {
      if (!synth || mutedRef.current || !text) return
      try {
        synth.cancel()
        const lang = langPref === 'auto' ? detectLang(text) : langPref
        const u = new SpeechSynthesisUtterance(text)
        u.lang = lang
        const v = pickVoice(synth.getVoices(), lang)
        if (v) u.voice = v
        u.rate = 1
        u.pitch = 1.15 // a touch higher — it's a duck :)
        u.onstart = () => setSpeaking(true)
        u.onend = () => setSpeaking(false)
        u.onerror = () => setSpeaking(false)
        synth.speak(u)
      } catch {
        /* ignore speech failures */
      }
    },
    [synth],
  )

  const stop = useCallback(() => {
    if (synth) synth.cancel()
    setSpeaking(false)
  }, [synth])

  return { supported, muted, setMuted, speaking, speak, stop }
}

// --- Optional microphone input (SpeechRecognition) ---
export function getRecognition(lang = 'en-IN') {
  const SR =
    typeof window !== 'undefined' &&
    (window.SpeechRecognition || window.webkitSpeechRecognition)
  if (!SR) return null
  const rec = new SR()
  rec.lang = lang === 'auto' ? 'en-IN' : lang
  rec.interimResults = false
  rec.maxAlternatives = 1
  rec.continuous = false
  return rec
}

export const micSupported =
  typeof window !== 'undefined' &&
  !!(window.SpeechRecognition || window.webkitSpeechRecognition)
