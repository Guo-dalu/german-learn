import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import Card from '../components/Card'
import Tag from '../components/Tag'
import { getTopics } from '../utils/content'
import type { Lang } from '../types/content'

export default function VocabularyIndex() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language as Lang

  const topics = getTopics('vocabulary', lang)

  return (
    <div className='max-w-5xl mx-auto px-[clamp(10px,3vw,13px)] py-8'>
      <h1 className='font-display text-[clamp(1.4rem,5vw,2.2rem)] text-text mb-6'>{t('nav.vocabulary')}</h1>
      <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4'>
        {topics.map(({ slug, emoji, title, tags, wordCount }) => (
          <Link key={slug} to={`/vocabulary/${slug}`} className='group block'>
            <Card className='h-full flex flex-col gap-2 transition-transform group-hover:-translate-y-0.5 group-hover:shadow-[6px_6px_0_var(--border)]'>
              <div className='flex items-start gap-2'>
                <span className='text-xl leading-none mt-0.5 shrink-0'>{emoji}</span>
                <span className='font-display text-base text-text leading-snug'>{title}</span>
              </div>
              <div className='flex flex-wrap items-center gap-x-1.5 gap-y-1'>
                {tags.map((tag) => (
                  <Tag key={tag} label={tag} />
                ))}
                {wordCount > 0 && (
                  <span className='text-[11px] font-semibold text-text2'>
                    {wordCount} {t('vocab.words')}
                  </span>
                )}
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
