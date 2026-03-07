import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ReactMarkdown from 'react-markdown'
import { useParams } from 'react-router-dom'
import remarkGfm from 'remark-gfm'
import Card from '../components/Card'
import Tag from '../components/Tag'
import FillInBlanks from '../components/exercises/FillInBlanks'
import Matching from '../components/exercises/Matching'
import MultipleChoice from '../components/exercises/MultipleChoice'
import { GENDER_COLOR } from '../constants'
import type { ContentFile, Dialogue, FillInExercise, Lang, MatchingExercise, MultipleChoiceExercise, Phrase, Word } from '../types/content'
import { parseFrontmatter } from '../utils/content'

const mdModules = import.meta.glob('/content/vocabulary/*.md', { query: '?raw', import: 'default' })
const jsonModules = import.meta.glob<ContentFile>('/content/vocabulary/*.json', { import: 'default' })

function highlightLine(text: string, highlightedWords: string[], words: Word[]) {
  // Build a map from bare word -> gender for color lookup
  const wordMap: Record<string, string> = {}
  for (const w of words) {
    wordMap[w.german.toLowerCase()] = w.gender
  }

  // Split text on highlighted words (case-insensitive), wrap in colored spans
  const pattern = new RegExp(`\\b(${highlightedWords.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`, 'gi')
  const parts = text.split(pattern)

  return parts.map((part, i) => {
    const gender = wordMap[part.toLowerCase()]
    if (gender) {
      return (
        <span key={i} style={{ color: GENDER_COLOR[gender] }} className='font-black'>
          {part}
        </span>
      )
    }
    return part
  })
}

function DialogueSection({ dialogue, words, lang }: { dialogue: Dialogue; words: Word[]; lang: Lang }) {
  return (
    <Card className='p-5 mb-4'>
      <p className='italic text-sm text-text2 mb-4'>{dialogue.scene[lang]}</p>
      <div className='space-y-2'>
        {dialogue.lines.map((line, i) => (
          <div key={i} className='flex gap-3'>
            <span className='font-display text-accent3 text-sm w-20 shrink-0'>{line.speaker}</span>
            <span className='text-sm font-semibold text-text leading-relaxed'>{highlightLine(line.text, dialogue.highlighted_words, words)}</span>
          </div>
        ))}
      </div>
      {dialogue.audio && (
        <div className='mt-4 pt-3 border-t border-dashed border-border'>
          <span className='text-xs font-semibold text-text2'>🔊 {dialogue.audio}</span>
        </div>
      )}
    </Card>
  )
}

export default function VocabularyPage() {
  const { topic } = useParams<{ topic: string }>()
  const { i18n } = useTranslation()
  const lang = i18n.language as Lang

  const [title, setTitle] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [notesBody, setNotesBody] = useState('')
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
        setNotesBody(parsed.body)
      })
    }
    const jsonLoader = jsonModules[`/content/vocabulary/${topic}.json`]
    if (jsonLoader) jsonLoader().then((data) => setContent(data))
  }, [topic, lang])

  const words: Word[] = content?.words ?? []
  const dialogues: Dialogue[] = content?.dialogues ?? []
  const phrasebook: Phrase[] = content?.phrasebook ?? []
  const exercises = content?.exercises ?? []
  const matchings = exercises.filter((e): e is MatchingExercise => e.type === 'matching')
  const fillIns = exercises.filter((e): e is FillInExercise => e.type === 'fill-in')
  const multiChoices = exercises.filter((e): e is MultipleChoiceExercise => e.type === 'multiple-choice')

  const emoji = content?.emoji ?? '📖'

  return (
    <div className='bg-bg min-h-screen'>
      {/* 1. Header */}
      <div className='relative overflow-hidden bg-bg2 border-b-2 border-border px-4 py-[clamp(28px,5vw,48px)]'>
        <div className='blob bg-accent1 w-65 h-65 -top-20 -left-15' />
        <div className='blob bg-accent5 w-50 h-50 -bottom-12.5 right-15' />
        <div className='max-w-2xl mx-auto text-center relative z-10'>
          <div className='float-delay inline-block mb-2 text-3xl'>{emoji}</div>
          <h1 className='font-display text-text text-[clamp(1.8rem,6vw,2.8rem)] leading-none'>{title || topic}</h1>
          <div className='flex gap-2 justify-center flex-wrap mt-3'>
            {tags.map((tag) => (
              <Tag key={tag} label={tag} />
            ))}
          </div>
        </div>
      </div>

      <div className='max-w-5xl mx-auto px-[clamp(16px,4vw,24px)] py-[clamp(20px,4vw,40px)]'>
        {/* 2. Word List */}
        {words.length > 0 && (
          <section className='mb-10'>
            <h2 className='flex items-center gap-3 mb-5 font-display text-xl text-text'>
              📖 Word List
              <span className='inline-block w-9 h-1 rounded-sm bg-accent3' />
            </h2>
            <Card className='p-5'>
              <div className='space-y-0'>
                {words.map((word) => (
                  <div key={word.german} className='flex items-baseline gap-2 py-1.5 border-b border-dashed border-border'>
                    <span className='font-black text-sm min-w-32' style={{ color: GENDER_COLOR[word.gender] ?? 'var(--text)' }}>
                      {word.article} {word.german}
                    </span>
                    <span className='text-xs text-text2 shrink-0'>· {word.plural}</span>
                    <span className='text-xs font-semibold text-text2 ml-auto'>{word[lang]}</span>
                  </div>
                ))}
              </div>
            </Card>
          </section>
        )}

        {/* 3. Dialogue */}
        {dialogues.length > 0 && (
          <section className='mb-10'>
            <h2 className='flex items-center gap-3 mb-5 font-display text-xl text-text'>
              💬 Dialogue
              <span className='inline-block w-9 h-1 rounded-sm bg-accent3' />
            </h2>
            {dialogues.map((dialogue) => (
              <DialogueSection key={dialogue.id} dialogue={dialogue} words={words} lang={lang} />
            ))}
          </section>
        )}

        {/* 4. Phrasebook */}
        {phrasebook.length > 0 && (
          <section className='mb-10'>
            <h2 className='flex items-center gap-3 mb-5 font-display text-xl text-text'>
              📝 Phrasebook
              <span className='inline-block w-9 h-1 rounded-sm bg-accent3' />
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {phrasebook.map((phrase, i) => (
                <Card key={i} className='p-4 flex flex-col gap-2'>
                  <div className='font-display text-lg text-accent2 leading-snug'>{phrase.german}</div>
                  <div className='text-sm font-semibold text-text2'>{phrase[lang]}</div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* 5. Language Notes */}
        {notesBody && (
          <section className='mb-10'>
            <Card className='prose-content px-6'>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{notesBody}</ReactMarkdown>
            </Card>
          </section>
        )}

        {/* 5. Exercises */}
        {exercises.length > 0 && (
          <section>
            <h2 className='flex items-center gap-3 mb-5 font-display text-xl text-text'>
              ✏️ Exercises
              <span className='inline-block w-9 h-1 rounded-sm bg-accent3' />
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
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

      <div className='mt-12 py-3 text-center bg-accent4'>
        <span className='font-display text-white text-[clamp(0.85rem,2.5vw,1rem)] tracking-wider'>✦ Keep going · Weitermachen · 你能做到 ✦</span>
      </div>
    </div>
  )
}
