import { useAudio } from '../hooks/useAudio'

interface Props {
  topic: string
  word: string
  className?: string
}

export default function AudioButton({ topic, word, className = '' }: Props) {
  const { speak, speaking } = useAudio()
  const src = `${import.meta.env.BASE_URL}audio/words/${topic}/${word}.mp3`

  return (
    <button
      onClick={() => speak(src)}
      disabled={speaking}
      aria-label={`Play pronunciation: ${word}`}
      className={`inline-flex items-center justify-center p-0.5 rounded hover:bg-accent3/15 transition-colors cursor-pointer disabled:cursor-default ${speaking ? 'text-accent3 animate-pulse' : 'text-text2/50 hover:text-accent3'} ${className}`}
    >
      <svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='currentColor'>
        <path d='M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z' />
      </svg>
    </button>
  )
}
