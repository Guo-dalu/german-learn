import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import Card from '../components/Card'
import Tag from '../components/Tag'
import { parseFrontmatter } from '../utils/content'
import type { Lang } from '../types/content'

const mdModules = import.meta.glob<string>('/content/vocabulary/*/index*.md', { eager: true, query: '?raw', import: 'default' })

const HERO_LETTERS = [
  { char: 'W', cls: 'text-accent3' },
  { char: 'i', cls: 'text-accent1' },
  { char: 'l', cls: 'text-accent5' },
  { char: 'l', cls: 'text-accent2' },
  { char: 'k', cls: 'text-accent3' },
  { char: 'o', cls: 'text-accent4' },
  { char: 'm', cls: 'text-accent1' },
  { char: 'm', cls: 'text-accent5' },
  { char: 'e', cls: 'text-accent2' },
  { char: 'n', cls: 'text-accent3' },
  { char: '!', cls: 'text-accent4' },
]

const NAV_CARDS = [
  { key: 'vocabulary', emoji: '📚', to: '/vocabulary', accentVar: '--accent3' },
  { key: 'grammar', emoji: '✏️', to: '/grammar', accentVar: '--accent4' },
  { key: 'exercises', emoji: '🎯', to: '/exercises', accentVar: '--accent2' },
] as const

export default function Home() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language as Lang

  const topics = useMemo(() => {
    const slugs = Object.keys(mdModules)
      .filter(p => !p.includes('.zh.'))
      .map(p => p.replace('/content/vocabulary/', '').replace('/index.md', ''))
    return slugs.map(slug => {
      const raw = mdModules[`/content/vocabulary/${slug}/index.${lang}.md`] ?? mdModules[`/content/vocabulary/${slug}/index.md`] ?? ''
      const { title, tags, emoji, wordCount } = parseFrontmatter(raw)
      return { slug, emoji: emoji || '📖', title: title || slug, tags: tags.slice(0, 2), wordCount }
    })
  }, [lang])

  const topicCount = topics.length
  const totalWords = topics.reduce((sum, t) => sum + t.wordCount, 0)

  return (
    <main className='max-w-5xl mx-auto px-[clamp(10px,3vw,13px)] py-8 space-y-14'>

      {/* Hero */}
      <section className='relative flex flex-col items-center text-center gap-5 pt-6 pb-4 overflow-hidden'>
        <span className='absolute top-0 left-2 text-3xl opacity-70 rotate-[-15deg] select-none pointer-events-none'>🇩🇪</span>
        <span className='absolute top-6 right-4 text-2xl opacity-60 rotate-[12deg] select-none pointer-events-none'>⭐</span>
        <span className='absolute bottom-0 left-10 text-2xl opacity-50 rotate-[8deg] select-none pointer-events-none hidden sm:block'>📝</span>
        <span className='absolute bottom-2 right-8 text-3xl opacity-60 rotate-[-10deg] select-none pointer-events-none hidden sm:block'>🎓</span>

        <h1 className='font-display text-[clamp(2.8rem,10vw,5rem)] leading-none tracking-tight'>
          {HERO_LETTERS.map(({ char, cls }, i) => (
            <span key={i} className={cls}>{char}</span>
          ))}
        </h1>

        <p className='font-display text-[clamp(1.1rem,4vw,1.5rem)] text-text2 max-w-sm'>
          {t('home.tagline')}
        </p>
        <p className='text-sm text-text2 font-body'>{t('home.subtitle')}</p>

        <div className='flex flex-wrap justify-center gap-3 mt-2'>
          <Link
            to='/vocabulary'
            className='font-display text-base px-6 py-2.5 rounded-xl border-2 border-border bg-card text-text shadow-[3px_3px_0_var(--border)] hover:-translate-y-0.5 hover:shadow-[5px_5px_0_var(--border)] transition-all'
          >
            {t('home.cta')} →
          </Link>
          <Link
            to='/exercises'
            className='font-display text-base px-6 py-2.5 rounded-xl border-2 hover:-translate-y-0.5 transition-all'
            style={{ borderColor: 'var(--accent3)', backgroundColor: 'var(--accent3)', color: 'var(--bg)', boxShadow: '3px 3px 0 var(--border)' }}
          >
            {t('home.ctaExercises')}
          </Link>
        </div>
      </section>

      {/* Quick Navigation */}
      <section>
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
          {NAV_CARDS.map(({ key, emoji, to, accentVar }) => (
            <Link key={key} to={to} className='group block'>
              <div
                className='bg-card border-2 rounded-2xl p-4 h-full flex flex-col gap-2 transition-all group-hover:-translate-y-1'
                style={{ borderColor: `var(${accentVar})`, boxShadow: `4px 4px 0 var(${accentVar})` }}
              >
                <span className='text-3xl'>{emoji}</span>
                <h2 className='font-display text-lg text-text'>{t(`home.sections.${key}`)}</h2>
                <p className='text-sm text-text2 font-body leading-snug flex-1'>{t(`home.sectionDesc.${key}`)}</p>
                <span className='font-display text-sm mt-1' style={{ color: `var(${accentVar})` }}>
                  {t('home.explore')} →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Topics */}
      <section>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='font-display text-[clamp(1.1rem,3vw,1.4rem)] text-text'>{t('home.featuredTopics')}</h2>
          <Link to='/vocabulary' className='text-sm font-semibold text-accent3 hover:underline'>
            {t('home.exploreAll')} →
          </Link>
        </div>
        <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3'>
          {topics.map(({ slug, emoji, title, tags, wordCount }) => (
            <Link key={slug} to={`/vocabulary/${slug}`} className='group block'>
              <Card className='h-full flex flex-col gap-2 transition-transform group-hover:-translate-y-0.5 group-hover:shadow-[6px_6px_0_var(--border)]'>
                <span className='text-2xl leading-none'>{emoji}</span>
                <span className='font-display text-sm text-text leading-snug'>{title}</span>
                <div className='flex flex-wrap gap-1 mt-auto'>
                  {tags.map((tag) => (
                    <Tag key={tag} label={tag} />
                  ))}
                  {wordCount > 0 && (
                    <span className='text-[10px] font-semibold text-text2 self-center'>
                      {wordCount} {t('vocab.words')}
                    </span>
                  )}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>


      {/* Stats */}
      <section className='border-t border-border pt-8'>
        <div className='flex flex-wrap justify-center gap-10 text-center'>
          <div>
            <p className='font-display text-[clamp(1.6rem,5vw,2.4rem)] text-accent3'>{topicCount}</p>
            <p className='text-xs font-semibold text-text2 uppercase tracking-wider'>{t('home.statsTopics')}</p>
          </div>
          <div>
            <p className='font-display text-[clamp(1.6rem,5vw,2.4rem)] text-accent5'>{totalWords}+</p>
            <p className='text-xs font-semibold text-text2 uppercase tracking-wider'>{t('home.statsWords')}</p>
          </div>
          <div>
            <p className='font-display text-[clamp(1.6rem,5vw,2.4rem)] text-accent2'>3</p>
            <p className='text-xs font-semibold text-text2 uppercase tracking-wider'>{t('home.statsExercises')}</p>
          </div>
        </div>
      </section>

    </main>
  )
}
