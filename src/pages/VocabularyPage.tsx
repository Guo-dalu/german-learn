import { useParams } from 'react-router-dom'

export default function VocabularyPage() {
  const { topic } = useParams()
  return <main>{/* TODO: load content/{topic}.md + exercises */}</main>
}
