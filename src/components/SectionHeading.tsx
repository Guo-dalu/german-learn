export default function SectionHeading({ emoji, label }: { emoji: string; label: string }) {
  return (
    <h2 className='flex items-center gap-3 mb-3 font-display text-xl text-text'>
      {emoji} {label}
      <span className='inline-block w-9 h-1 rounded-sm bg-accent3' />
    </h2>
  )
}
