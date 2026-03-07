import { ReactNode } from 'react'

export default function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`bg-card border-2 border-border shadow-[4px_4px_0_var(--border)] rounded-2xl ${className}`}>
      {children}
    </div>
  )
}
