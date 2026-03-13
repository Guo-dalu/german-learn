import { useState } from 'react'

export function useAudio() {
  const [speaking, setSpeaking] = useState(false)

  function speak(src: string) {
    const audio = new Audio(src)
    setSpeaking(true)
    audio.onended = () => setSpeaking(false)
    audio.onerror = () => setSpeaking(false)
    audio.play()
  }

  return { speak, speaking }
}
