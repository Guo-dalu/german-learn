import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ReactMarkdown from 'react-markdown'
import { Link, useParams } from 'react-router-dom'
import remarkGfm from 'remark-gfm'
import Card from '../components/Card'
import FillInBlanks from '../components/exercises/FillInBlanks'
import Matching from '../components/exercises/Matching'
import MultipleChoice from '../components/exercises/MultipleChoice'
import SectionLayout from '../components/SectionLayout'
import Tag from '../components/Tag'
import { parseFrontmatter } from '../utils/content'
import type { ContentFile, FillInExercise, Lang, MatchingExercise, MultipleChoiceExercise } from '../types/content'

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

  const emoji = content?.emoji ?? '📖'
  const exercises = content?.exercises ?? []
  const matchings = exercises.filter((e): e is MatchingExercise => e.type === 'matching')
  const fillIns = exercises.filter((e): e is FillInExercise => e.type === 'fill-in')
  const multiChoices = exercises.filter((e): e is MultipleChoiceExercise => e.type === 'multiple-choice')

  return (
    <SectionLayout section='grammar' currentSlug={topic ?? ''}>
      {/* Mobile breadcrumb */}
      <div className='md:hidden px-4 my-2'>
        <Link to='/grammar' className='text-xs font-black text-text2 uppercase tracking-wider hover:text-accent1 transition-colors'>
          ← {t('grammar.allTopics')}
        </Link>
      </div>

      {/* Header */}
      <div className='bg-bg2 border-b-2 border-border p-4'>
        <div className='max-w-2xl mx-auto text-center'>
          <div className='float-delay inline-block mb-1 text-2xl'>{emoji}</div>
          <h1 className='font-display text-text text-[clamp(1.1rem,4vw,2rem)] leading-none'>{title || topic}</h1>
          <div className='flex gap-2 justify-center flex-wrap mt-2'>
            {tags.map((tag) => (
              <Tag key={tag} label={tag} />
            ))}
          </div>
        </div>
      </div>

      <div className='max-w-5xl mx-auto px-[clamp(10px,3vw,13px)] py-[clamp(8px,2vw,20px)]'>
        {/* Grammar content */}
        {body && (
          <section className='mb-6'>
            <Card className='prose-content px-6'>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
            </Card>
          </section>
        )}

        {/* Exercises */}
        {exercises.length > 0 && (
          <section>
            <h2 className='flex items-center gap-3 mb-3 font-display text-xl text-text'>
              ✏️ Exercises
              <span className='inline-block w-9 h-1 rounded-sm bg-accent3' />
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
              {matchings.map((ex, i) => (
                <Matching key={i} exercise={ex} lang={lang} />
              ))}
              {fillIns.length > 0 && <FillInBlanks exercises={fillIns} lang={lang} />}
              {multiChoices.map((ex, i) => (
                <MultipleChoice key={i} exercise={ex} lang={lang} />
              ))}
            </div>
          </section>
        )}
      </div>

      <div className='mt-6 py-2.5 text-center bg-accent4'>
        <span className='font-display text-white text-[clamp(0.85rem,2.5vw,1rem)] tracking-wider'>✦ Keep going · Weitermachen · 你能做到 ✦</span>
      </div>
    </SectionLayout>
  )
}
