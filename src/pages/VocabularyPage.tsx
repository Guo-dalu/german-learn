import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ReactMarkdown from 'react-markdown'
import { useParams } from 'react-router-dom'
import remarkGfm from 'remark-gfm'
import Card from '../components/Card'
import Tag from '../components/Tag'
import FillInBlank from '../components/exercises/FillInBlank'
import MultipleChoice from '../components/exercises/MultipleChoice'
import { GENDER_COLOR, GENDER_LABEL } from '../constants'
import type { ContentFile, FillInExercise, Lang, MultipleChoiceExercise, Word } from '../types/content'
import { parseFrontmatter } from '../utils/content'

const mdModules = import.meta.glob('/content/vocabulary/*.md', { query: '?raw', import: 'default' })
const jsonModules = import.meta.glob<ContentFile>('/content/vocabulary/*.json', { import: 'default' })

export default function VocabularyPage() {
  const { topic } = useParams<{ topic: string }>()
  const { i18n } = useTranslation()
  const lang = i18n.language as Lang

  const [title, setTitle] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [body, setBody] = useState('')
  const [content, setContent] = useState<ContentFile | null>(null)

  useEffect(() => {
    if (!topic) return
    const mdKey = `/content/vocabulary/${topic}.${lang}.md`
    const mdFallback = `/content/vocabulary/${topic}.md`
    const mdLoader = mdModules[mdKey] ?? mdModules[mdFallback]
    if (mdLoader) {
      mdLoader().then((raw) => {
        const parsed = parseFrontmatter(raw as string)
        setTitle(parsed.title)
        setTags(parsed.tags)
        setBody(parsed.body)
      })
    }
    const jsonLoader = jsonModules[`/content/vocabulary/${topic}.json`]
    if (jsonLoader) jsonLoader().then((data) => setContent(data))
  }, [topic, lang])

  const words: Word[] = content?.words ?? []
  const fillIns = (content?.exercises ?? []).filter((e): e is FillInExercise => e.type === 'fill-in')
  const multiChoices = (content?.exercises ?? []).filter((e): e is MultipleChoiceExercise => e.type === 'multiple-choice')

  return (
    <div className='bg-bg min-h-screen'>
      {/* Hero */}
      <div className='relative overflow-hidden bg-bg2 border-b-2 border-border px-4 py-[clamp(28px,5vw,48px)]'>
        <div className='blob bg-accent1 w-65 h-65 -top-20 -left-15' />
        <div className='blob bg-accent5 w-50 h-50 -bottom-12.5 right-15' />
        <div className='max-w-2xl mx-auto text-center relative z-10'>
          <div className='float-delay inline-block mb-2 text-3xl'>🍎</div>
          <h1 className='font-display text-text text-[clamp(1.8rem,6vw,2.8rem)] leading-none'>{title || topic}</h1>
          <div className='flex gap-2 justify-center flex-wrap mt-3'>
            {tags.map((tag) => (
              <Tag key={tag} label={tag} />
            ))}
          </div>
        </div>
      </div>

      <div className='max-w-5xl mx-auto px-[clamp(16px,4vw,24px)] py-[clamp(20px,4vw,40px)]'>
        {/* Word list */}
        {words.length > 0 && (
          <section className='mb-10'>
            <h2 className='flex items-center gap-3 mb-5 font-display text-xl text-text'>
              📖 Vocabulary
              <span className='inline-block w-9 h-1 rounded-sm bg-accent3' />
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {/* Featured card */}
              <Card className='p-5'>
                <div className='flex items-start justify-between mb-3 gap-2'>
                  <div>
                    <div className='font-display text-accent1 text-[clamp(1.4rem,4vw,1.8rem)] leading-tight'>{words[0].german}</div>
                    <div className='text-sm font-semibold mt-0.5 text-text2'>
                      {words[0][lang]} · {words[0].gender}
                    </div>
                  </div>
                  <Tag label={words[0].level} className='mt-1 shrink-0' />
                </div>
                <div className='rounded-xl p-3 text-sm font-semibold leading-loose bg-bg2 border-l-4 border-l-accent1 text-text'>
                  <span className='word-highlight noun'>{words[0].german.split(' ').slice(1).join(' ')}</span> — {words[0][lang]}
                </div>
                <div className='flex gap-2 mt-3 flex-wrap'>
                  <span className='text-xs font-black px-2 py-0.5 rounded-full bg-noun-badge-bg text-accent1'>🔴 noun</span>
                  <span className='text-xs font-black px-2 py-0.5 rounded-full bg-verb-badge-bg text-verb-badge-text'>🟢 verb</span>
                  <span className='text-xs font-black px-2 py-0.5 rounded-full bg-adj-badge-bg text-adj-badge-text'>🔵 adj</span>
                </div>
              </Card>

              {/* Word list card */}
              <Card className='p-5'>
                <div className='font-display font-black mb-3 text-sm text-text2'>More Words</div>
                {words.slice(1).map((word) => (
                  <div key={word.german} className='flex items-center justify-between py-2 gap-2 border-b border-dashed border-border'>
                    <span className='font-black min-w-24' style={{ color: GENDER_COLOR[word.gender] ?? 'var(--accent2)' }}>
                      {word.german}
                    </span>
                    <span className='flex-1 text-xs font-semibold text-text2'>
                      {word[lang]} · {GENDER_LABEL[word.gender]}
                    </span>
                    <Tag label={word.level} className='shrink-0' />
                  </div>
                ))}
              </Card>
            </div>
          </section>
        )}

        {/* Reading / markdown */}
        {body && (
          <section className='mb-10'>
            <h2 className='flex items-center gap-3 mb-5 font-display text-xl text-text'>
              📝 Reading
              <span className='inline-block w-9 h-1 rounded-sm bg-accent3' />
            </h2>
            <Card className='prose-content p-6'>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
            </Card>
          </section>
        )}

        {/* Exercises */}
        {(fillIns.length > 0 || multiChoices.length > 0) && (
          <section>
            <h2 className='flex items-center gap-3 mb-5 font-display text-xl text-text'>
              ✏️ Exercises
              <span className='inline-block w-9 h-1 rounded-sm bg-accent3' />
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {fillIns.map((ex, i) => (
                <FillInBlank key={i} exercise={ex} lang={lang} />
              ))}
              {multiChoices.map((ex, i) => (
                <MultipleChoice key={i} exercise={ex} lang={lang} />
              ))}
            </div>
          </section>
        )}
      </div>

      <div className='mt-12 py-3 text-center bg-accent4'>
        <span className='font-display text-white text-[clamp(0.85rem,2.5vw,1rem)] tracking-wider'>✦ Keep going · Weitermachen · 你能做到 ✦</span>
      </div>
    </div>
  )
}
