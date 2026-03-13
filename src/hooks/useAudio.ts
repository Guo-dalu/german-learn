import { useState } from 'react'

// Cache voices at module level — shared across all hook instances
let voiceCache: SpeechSynthesisVoice[] = []

function initVoices() {
  const v = window.speechSynthesis.getVoices()
  if (v.length) voiceCache = v
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  initVoices()
  window.speechSynthesis.onvoiceschanged = initVoices
}

function getDeVoice() {
  return voiceCache.find((v) => v.lang === 'de-DE') ?? voiceCache.find((v) => v.lang.startsWith('de'))
}

export function useAudio() {
  const [speaking, setSpeaking] = useState(false)

  function speak(text: string) {
    if (!('speechSynthesis' in window)) return

    const doSpeak = () => {
      const u = new SpeechSynthesisUtterance(text)
      u.lang = 'de-DE'
      const voice = getDeVoice()
      if (voice) u.voice = voice
      u.onstart = () => setSpeaking(true)
      u.onend = () => setSpeaking(false)
      u.onerror = () => setSpeaking(false)
      window.speechSynthesis.resume() // Chrome sometimes suspends the engine silently
      window.speechSynthesis.speak(u)
    }

    if (window.speechSynthesis.speaking) {
      // Cancel then wait — calling speak() immediately after cancel() silently fails in Chrome
      window.speechSynthesis.cancel()
      setTimeout(doSpeak, 100)
    } else {
      doSpeak()
    }
  }

  return { speak, speaking }
}
