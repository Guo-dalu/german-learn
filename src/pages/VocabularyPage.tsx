import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ReactMarkdown from 'react-markdown'
import { useParams } from 'react-router-dom'
import remarkGfm from 'remark-gfm'
import FillInBlank from '../components/exercises/FillInBlank'
import MultipleChoice from '../components/exercises/MultipleChoice'
import type { ContentFile, FillInExercise, Lang, MultipleChoiceExercise, Word } from '../types/content'
import { GENDER_COLOR, GENDER_LABEL } from '../constants'
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
      mdLoader().then(raw => {
        const parsed = parseFrontmatter(raw as string)
        setTitle(parsed.title)
        setTags(parsed.tags)
        setBody(parsed.body)
      })
    }
    const jsonLoader = jsonModules[`/content/vocabulary/${topic}.json`]
    if (jsonLoader) jsonLoader().then(data => setContent(data))
  }, [topic, lang])

  const words: Word[] = content?.words ?? []
  const fillIns = (content?.exercises ?? []).filter((e): e is FillInExercise => e.type === 'fill-in')
  const multiChoices = (content?.exercises ?? []).filter((e): e is MultipleChoiceExercise => e.type === 'multiple-choice')

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      {/* Hero */}
      <div className="relative overflow-hidden" style={{ background: 'var(--bg2)', borderBottom: '2px solid var(--border)', padding: 'clamp(28px,5vw,48px) 16px' }}>
        <div className="blob" style={{ width: 260, height: 260, background: 'var(--accent1)', top: -80, left: -60 }} />
        <div className="blob" style={{ width: 200, height: 200, background: 'var(--accent5)', bottom: -50, right: 60 }} />
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <div className="float-delay inline-block mb-2 text-3xl">🍎</div>
          <h1 style={{ fontFamily: 'Fredoka One, cursive', fontSize: 'clamp(1.8rem,6vw,2.8rem)', color: 'var(--text)', lineHeight: 1.1 }}>
            {title || topic}
          </h1>
          <div className="flex gap-2 justify-center flex-wrap mt-3">
            {tags.map(tag => (
              <span key={tag} className="text-xs font-black px-3 py-0.5 rounded-full" style={{ background: 'var(--tag-bg)', color: 'var(--tag-text)' }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto" style={{ padding: 'clamp(20px,4vw,40px) clamp(16px,4vw,24px)' }}>

        {/* Word list */}
        {words.length > 0 && (
          <section className="mb-10">
            <h2 className="flex items-center gap-3 mb-5" style={{ fontFamily: 'Fredoka One, cursive', fontSize: '1.3rem', color: 'var(--text)' }}>
              📖 Vocabulary
              <span style={{ display: 'inline-block', width: 36, height: 4, borderRadius: 2, background: 'var(--accent3)' }} />
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Featured card */}
              <div className="rounded-2xl p-5" style={{ background: 'var(--card)', border: '2px solid var(--border)', boxShadow: '4px 4px 0 var(--border)' }}>
                <div className="flex items-start justify-between mb-3 gap-2">
                  <div>
                    <div style={{ fontFamily: 'Fredoka One, cursive', fontSize: 'clamp(1.4rem,4vw,1.8rem)', color: 'var(--accent1)', lineHeight: 1.2 }}>
                      {words[0].german}
                    </div>
                    <div className="text-sm font-semibold mt-0.5" style={{ color: 'var(--text2)' }}>
                      {words[0][lang]} · {words[0].gender}
                    </div>
                  </div>
                  <span className="text-xs font-black px-3 py-0.5 rounded-full mt-1 shrink-0" style={{ background: 'var(--tag-bg)', color: 'var(--tag-text)' }}>
                    {words[0].level}
                  </span>
                </div>
                <div className="rounded-xl p-3 text-sm font-semibold leading-loose" style={{ background: 'var(--bg2)', borderLeft: '4px solid var(--accent1)', color: 'var(--text)' }}>
                  <span className="word-highlight noun">{words[0].german.split(' ').slice(1).join(' ')}</span> — {words[0][lang]}
                </div>
                <div className="flex gap-2 mt-3 flex-wrap">
                  <span className="text-xs font-black px-2 py-0.5 rounded-full" style={{ background: '#FFE0E0', color: 'var(--accent1)' }}>🔴 noun</span>
                  <span className="text-xs font-black px-2 py-0.5 rounded-full" style={{ background: '#E0FBF8', color: '#0E9488' }}>🟢 verb</span>
                  <span className="text-xs font-black px-2 py-0.5 rounded-full" style={{ background: '#E0EEFF', color: '#2563EB' }}>🔵 adj</span>
                </div>
              </div>

              {/* Word list card */}
              <div className="rounded-2xl p-5" style={{ background: 'var(--card)', border: '2px solid var(--border)', boxShadow: '4px 4px 0 var(--border)' }}>
                <div className="font-black mb-3 text-sm" style={{ fontFamily: 'Fredoka One, cursive', color: 'var(--text2)' }}>More Words</div>
                {words.slice(1).map(word => (
                  <div key={word.german} className="flex items-center justify-between py-2 gap-2" style={{ borderBottom: '1.5px dashed var(--border)' }}>
                    <span className="font-black min-w-[90px]" style={{ color: GENDER_COLOR[word.gender] ?? 'var(--accent2)' }}>
                      {word.german}
                    </span>
                    <span className="flex-1 text-xs font-semibold" style={{ color: 'var(--text2)' }}>
                      {word[lang]} · {GENDER_LABEL[word.gender]}
                    </span>
                    <span className="text-xs font-black px-2 py-0.5 rounded-full shrink-0" style={{ background: 'var(--tag-bg)', color: 'var(--tag-text)' }}>
                      {word.level}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Reading / markdown */}
        {body && (
          <section className="mb-10">
            <h2 className="flex items-center gap-3 mb-5" style={{ fontFamily: 'Fredoka One, cursive', fontSize: '1.3rem', color: 'var(--text)' }}>
              📝 Reading
              <span style={{ display: 'inline-block', width: 36, height: 4, borderRadius: 2, background: 'var(--accent3)' }} />
            </h2>
            <div className="prose-content rounded-2xl p-6" style={{ background: 'var(--card)', border: '2px solid var(--border)', boxShadow: '4px 4px 0 var(--border)' }}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
            </div>
          </section>
        )}

        {/* Exercises */}
        {(fillIns.length > 0 || multiChoices.length > 0) && (
          <section>
            <h2 className="flex items-center gap-3 mb-5" style={{ fontFamily: 'Fredoka One, cursive', fontSize: '1.3rem', color: 'var(--text)' }}>
              ✏️ Exercises
              <span style={{ display: 'inline-block', width: 36, height: 4, borderRadius: 2, background: 'var(--accent3)' }} />
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fillIns.map((ex, i) => <FillInBlank key={i} exercise={ex} lang={lang} />)}
              {multiChoices.map((ex, i) => <MultipleChoice key={i} exercise={ex} lang={lang} />)}
            </div>
          </section>
        )}
      </div>

      <div className="mt-12 py-3 text-center" style={{ background: 'var(--accent4)' }}>
        <span style={{ fontFamily: 'Fredoka One, cursive', color: 'white', fontSize: 'clamp(0.85rem,2.5vw,1rem)', letterSpacing: '0.04em' }}>
          ✦ Keep going · Weitermachen · 你能做到 ✦
        </span>
      </div>
    </div>
  )
}
