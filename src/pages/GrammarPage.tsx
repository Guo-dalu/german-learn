import { useParams } from 'react-router-dom'
import SectionLayout from '../components/SectionLayout'

export default function GrammarPage() {
  const { topic } = useParams<{ topic: string }>()
  return (
    <SectionLayout section='grammar' currentSlug={topic ?? ''}>
      <main className='max-w-5xl mx-auto px-[clamp(10px,3vw,13px)] py-8'>{/* TODO: load content/grammar/{topic}.md + exercises */}</main>
    </SectionLayout>
  )
}
