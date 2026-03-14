import Tag from './Tag'

const stickerPositions = [
  'absolute bottom-2 left-3 text-3xl rotate-8',
  'absolute bottom-3 left-15 text-3xl -rotate-10',
  'absolute bottom-2 right-15 text-3xl rotate-10',
  'absolute bottom-2 right-3 text-4xl -rotate-6',
]

interface TopicHeaderProps {
  emoji?: string
  title: string
  tags: string[]
  stickers?: string[]
}

export default function TopicHeader({ emoji, title, tags, stickers }: TopicHeaderProps) {
  return (
    <div className={`bg-bg2 border-2 border-border rounded-2xl p-4 mb-3${stickers ? ' relative overflow-hidden' : ''}`}>
      {stickers?.slice(0, 4).map((s, i) => (
        <span key={i} className={`${stickerPositions[i]} select-none pointer-events-none`}>
          {s}
        </span>
      ))}
      <div className='max-w-2xl mx-auto text-center relative z-10'>
        {emoji && <div className='float-delay inline-block mb-1 text-2xl'>{emoji}</div>}
        <h1 className='font-display text-text text-[clamp(1.1rem,4vw,2rem)] leading-none'>{title}</h1>
        <div className='flex gap-2 justify-center flex-wrap mt-2'>
          {tags.map((tag) => (
            <Tag key={tag} label={tag} />
          ))}
        </div>
      </div>
    </div>
  )
}
