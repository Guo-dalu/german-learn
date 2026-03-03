import { useParams } from 'react-router-dom'

export default function GrammarPage() {
  const { topic } = useParams()
  return <main>{/* TODO: load content/grammar/{topic}.md + exercises */}</main>
}
