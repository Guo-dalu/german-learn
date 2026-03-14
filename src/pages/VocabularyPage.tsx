import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ReactMarkdown from 'react-markdown'
import { Link, useParams } from 'react-router-dom'
import remarkGfm from 'remark-gfm'
import AudioButton from '../components/AudioButton'
import Card from '../components/Card'
import ExercisesSection from '../components/ExercisesSection'
import SectionHeading from '../components/SectionHeading'
import SectionLayout from '../components/SectionLayout'
import TopicHeader from '../components/TopicHeader'
import { GENDER_CLASS } from '../constants'
import { parseFrontmatter } from '../utils/content'
import type { ContentFile, Dialogue, Lang, Phrase, Word } from '../types/content'

const mdModules = import.meta.glob('/content/vocabulary/*/*.md', { query: '?raw', import: 'default' })
const jsonModules = import.meta.glob<ContentFile>('/content/vocabulary/*/*.json', { import: 'default' })

function highlightLine(text: string, highlightedWords: string[], words: Word[]) {
  const wordMap: Record<string, string> = {}
  for (const w of words) {
    wordMap[w.german.toLowerCase()] = w.gender
  }

  const pattern = new RegExp(`\\b(${highlightedWords.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`, 'gi')
  const parts = text.split(pattern)

  return parts.map((part, i) => {
    const gender = wordMap[part.toLowerCase()]
    if (gender) {
      return (
        <span key={i} className={`font-black ${GENDER_CLASS[gender] ?? 'text-text'}`}>
          {part}
        </span>
      )
    }
    return part
  })
}

function DialogueSection({ dialogue, words, lang }: { dialogue: Dialogue; words: Word[]; lang: Lang }) {
  return (
    <Card className='p-4 mb-3'>
      <p className='italic text-sm text-text2 mb-3'>{dialogue.scene[lang]}</p>
      <div className='space-y-2'>
        {dialogue.lines.map((line, i) => (
          <div key={i} className='flex gap-3'>
            <span className='font-display text-accent4 text-sm w-20 shrink-0'>{line.speaker}</span>
            <span className='text-base font-semibold text-text leading-relaxed'>{highlightLine(line.text, dialogue.highlighted_words, words)}</span>
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
  const { t, i18n } = useTranslation()
  const lang = i18n.language as Lang

  const [notesBody, setNotesBody] = useState('')
  const [content, setContent] = useState<ContentFile | null>(null)

  useEffect(() => {
    if (!topic) return
    const mdKey = `/content/vocabulary/${topic}/${topic}.${lang}.md`
    const mdFallback = `/content/vocabulary/${topic}/${topic}.md`
    const mdLoader = mdModules[mdKey] ?? mdModules[mdFallback]
    if (mdLoader) {
      mdLoader().then((raw) => {
        setNotesBody(parseFrontmatter(raw as string).body)
      })
    }
    const jsonLoader = jsonModules[`/content/vocabulary/${topic}/${topic}.json`]
    if (jsonLoader) jsonLoader().then((data) => setContent(data))
  }, [topic, lang])

  const title = content?.topic ?? topic ?? ''
  const tags = content?.tags ?? []
  const words: Word[] = content?.words ?? []
  const dialogues: Dialogue[] = content?.dialogues ?? []
  const phrasebook: Phrase[] = content?.phrasebook ?? []
  const exercises = content?.exercises ?? []
  const emoji = content?.emoji ?? '📖'
  const stickers = content?.stickers ?? ['🇩🇪', '⭐', '✏️', '📖']

  return (
    <SectionLayout section='vocabulary' currentSlug={topic ?? ''}>
      {/* Mobile breadcrumb */}
      <div className='md:hidden px-4 my-2'>
        <Link to='/vocabulary' className='text-xs font-black text-text2 uppercase tracking-wider hover:text-accent1 transition-colors'>
          ← {t('vocab.allTopics')}
        </Link>
      </div>

      <div className='max-w-5xl mx-auto px-[clamp(10px,3vw,13px)] py-[clamp(8px,2vw,20px)]'>
        <TopicHeader emoji={emoji} title={title} tags={tags} stickers={stickers} />

        {/* Word List */}
        {words.length > 0 && (
          <section className='mb-6'>
            <SectionHeading emoji='📖' label='Word List' />
            <Card className='p-4'>
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
                {words.map((word) => (
                  <div key={word.german} className='flex flex-col py-1.5 px-2 border-b border-dashed border-border'>
                    <div className='flex items-center gap-2'>
                      <span className={`font-display text-base leading-none ${GENDER_CLASS[word.gender] ?? 'text-text'}`}>
                        {word.article} {word.german}
                      </span>
                      <AudioButton topic={topic ?? ''} word={word.german} />
                      {word.level && (
                        <span className='text-[10px] bg-tag-bg text-tag-text rounded-full px-1.5 py-0.5 leading-none shrink-0'>{word.level}</span>
                      )}
                    </div>
                    <div className='text-sm font-semibold text-text2 mt-0.5'>
                      {word.plural} · {word[lang]}
                    </div>
                    {word.example && (
                      <div className='mt-1 text-sm text-text2 italic leading-snug'>
                        {word.example.de}
                        <span className='not-italic text-text2/70'> — {word.example[lang]}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </section>
        )}

        {/* Dialogue */}
        {dialogues.length > 0 && (
          <section className='mb-6'>
            <SectionHeading emoji='💬' label='Dialogue' />
            {dialogues.map((dialogue) => (
              <DialogueSection key={dialogue.id} dialogue={dialogue} words={words} lang={lang} />
            ))}
          </section>
        )}

        {/* Phrasebook */}
        {phrasebook.length > 0 && (
          <section className='mb-6'>
            <SectionHeading emoji='📝' label='Phrasebook' />
            <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
              {phrasebook.map((phrase, i) => (
                <Card key={i} className='p-3 flex flex-col gap-1.5'>
                  <div className='font-display text-base text-accent4 leading-snug'>{phrase.german}</div>
                  <div className='text-sm text-text2'>{phrase[lang]}</div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Language Notes */}
        {notesBody && (
          <section className='mb-6'>
            <Card className='prose-content px-6'>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{notesBody}</ReactMarkdown>
            </Card>
          </section>
        )}

        <ExercisesSection exercises={exercises} lang={lang} />
      </div>

    </SectionLayout>
  )
}
