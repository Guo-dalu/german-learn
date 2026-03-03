import { useState } from 'react'

interface Progress {
  correct: number
  total: number
}

export function useProgress(topic: string) {
  const key = `progress:${topic}`
  const [progress, setProgress] = useState<Progress>(() => {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : { correct: 0, total: 0 }
  })

  function record(correct: boolean) {
    setProgress(prev => {
      const next = { correct: prev.correct + (correct ? 1 : 0), total: prev.total + 1 }
      localStorage.setItem(key, JSON.stringify(next))
      return next
    })
  }

  return { progress, record }
}
