export default function Tag({ label, className = '' }: { label: string; className?: string }) {
  return (
    <span className={`bg-tag-bg text-tag-text text-xs font-black px-3 py-0.5 rounded-full ${className}`}>
      {label}
    </span>
  )
}
