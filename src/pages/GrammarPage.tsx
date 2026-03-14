import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ReactMarkdown from 'react-markdown'
import { Link, useParams } from 'react-router-dom'
import remarkGfm from 'remark-gfm'
import Card from '../components/Card'
import ExercisesSection from '../components/ExercisesSection'
import SectionLayout from '../components/SectionLayout'
import TopicHeader from '../components/TopicHeader'
import { parseFrontmatter } from '../utils/content'
import type { ContentFile, Lang } from '../types/content'

const mdModules = import.meta.glob('/content/grammar/*/*.md', { query: '?raw', import: 'default' })
const jsonModules = import.meta.glob<ContentFile>('/content/grammar/*/*.json', { import: 'default' })

export default function GrammarPage() {
  const { topic } = useParams<{ topic: string }>()
  const { t, i18n } = useTranslation()
  const lang = i18n.language as Lang

  const [title, setTitle] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [body, setBody] = useState('')
  const [content, setContent] = useState<ContentFile | null>(null)

  useEffect(() => {
    if (!topic) return
    const mdKey = `/content/grammar/${topic}/${topic}.${lang}.md`
    const mdFallback = `/content/grammar/${topic}/${topic}.md`
    const mdLoader = mdModules[mdKey] ?? mdModules[mdFallback]
    if (mdLoader) {
      mdLoader().then((raw) => {
        const parsed = parseFrontmatter(raw as string)
        setTitle(parsed.title ?? topic)
        setTags(parsed.tags ?? [])
        setBody(parsed.body)
      })
    }
    const jsonLoader = jsonModules[`/content/grammar/${topic}/${topic}.json`]
    if (jsonLoader) jsonLoader().then((data) => setContent(data))
  }, [topic, lang])

  const emoji = content?.emoji
  const exercises = content?.exercises ?? []

  return (
    <SectionLayout section='grammar' currentSlug={topic ?? ''}>
      {/* Mobile breadcrumb */}
      <div className='md:hidden px-4 my-2'>
        <Link to='/grammar' className='text-xs font-black text-text2 uppercase tracking-wider hover:text-accent1 transition-colors'>
          ← {t('grammar.allTopics')}
        </Link>
      </div>

      <div className='max-w-5xl mx-auto px-[clamp(10px,3vw,13px)] py-[clamp(8px,2vw,20px)]'>
        <TopicHeader emoji={emoji} title={title || (topic ?? '')} tags={tags} />

        {body && (
          <section className='mb-6'>
            <Card className='prose-content px-6'>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
            </Card>
          </section>
        )}

        <ExercisesSection exercises={exercises} lang={lang} />
      </div>

    </SectionLayout>
  )
}
