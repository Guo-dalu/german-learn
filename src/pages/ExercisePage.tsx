import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import FillInBlanks from '../components/exercises/FillInBlanks'
import Matching from '../components/exercises/Matching'
import MultipleChoice from '../components/exercises/MultipleChoice'
import { meta, getLocalizedTitle } from '../utils/content'
import type { ContentFile, FillInExercise, Lang, MatchingExercise, MultipleChoiceExercise } from '../types/content'

const vocabJsons = import.meta.glob<ContentFile>('/content/vocabulary/*/*.json', { eager: true, import: 'default' })
const grammarJsons = import.meta.glob<ContentFile>('/content/grammar/*/*.json', { eager: true, import: 'default' })

const LEVEL_ORDER = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']

function buildTopicData(jsons: Record<string, ContentFile>, section: 'vocabulary' | 'grammar', basePath: string, lang: Lang) {
  return Object.entries(jsons).map(([path, json]) => {
    const slug = path.replace(`${basePath}/`, '').split('/')[0]
    const m = meta[section][slug]
    return { slug, title: m ? getLocalizedTitle(m, lang) : slug, emoji: m?.emoji ?? '📖', tags: m?.tags ?? [], exercises: json.exercises ?? [] }
  })
}

export default function ExercisePage() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language as Lang
  const [activeTag, setActiveTag] = useState<string>('all')

  const allTopics = useMemo(() => {
    const vocab = buildTopicData(vocabJsons, 'vocabulary', '/content/vocabulary', lang)
    const grammar = buildTopicData(grammarJsons, 'grammar', '/content/grammar', lang)
    return [...vocab, ...grammar]
  }, [lang])

  const allTags = useMemo(() => {
    const tagSet = new Set<string>()
    for (const topic of allTopics) {
      for (const tag of topic.tags) tagSet.add(tag)
    }
    const levels = LEVEL_ORDER.filter((l) => tagSet.has(l))
    const rest = [...tagSet].filter((t) => !LEVEL_ORDER.includes(t)).sort()
    return [...levels, ...rest]
  }, [allTopics])

  const filteredTopics = useMemo(() => {
    if (activeTag === 'all') return allTopics.filter((t) => t.exercises.length > 0)
    return allTopics.filter((t) => t.tags.includes(activeTag) && t.exercises.length > 0)
  }, [allTopics, activeTag])

  return (
    <div className='max-w-5xl mx-auto px-[clamp(10px,3vw,13px)] py-8'>
      <h1 className='font-display text-[clamp(1.4rem,5vw,2.2rem)] text-text mb-4'>{t('exercises.title')}</h1>

      {/* Tag filter bar */}
      <div className='flex gap-2 overflow-x-auto pb-2 mb-6 no-scrollbar'>
        <button
          onClick={() => setActiveTag('all')}
          className={`shrink-0 text-xs font-black px-3 py-1 rounded-full border-2 transition-colors ${
            activeTag === 'all' ? 'bg-accent1 text-white border-accent1' : 'bg-tag-bg text-tag-text border-transparent hover:border-accent1/40'
          }`}
        >
          {t('exercises.all')}
        </button>
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            className={`shrink-0 text-xs font-black px-3 py-1 rounded-full border-2 transition-colors ${
              activeTag === tag ? 'bg-accent1 text-white border-accent1' : 'bg-tag-bg text-tag-text border-transparent hover:border-accent1/40'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Exercises grouped by topic */}
      <div className='flex flex-col gap-8'>
        {filteredTopics.map(({ slug, title, emoji, exercises }) => {
          const matchings = exercises.filter((e): e is MatchingExercise => e.type === 'matching')
          const fillIns = exercises.filter((e): e is FillInExercise => e.type === 'fill-in')
          const multiChoices = exercises.filter((e): e is MultipleChoiceExercise => e.type === 'multiple-choice')

          return (
            <section key={slug}>
              <h2 className='flex items-center gap-2 mb-3 font-display text-xl text-text'>
                <span>{emoji}</span>
                {title}
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
          )
        })}
      </div>
    </div>
  )
}
