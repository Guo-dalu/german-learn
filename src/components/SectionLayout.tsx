import { type ReactNode, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { parseFrontmatter } from '../utils/content'
import type { ContentFile, Lang } from '../types/content'

const vocabJsons = import.meta.glob<ContentFile>('/content/vocabulary/*.json', { eager: true, import: 'default' })
const vocabMds = import.meta.glob<string>('/content/vocabulary/*.md', { eager: true, query: '?raw', import: 'default' })
const grammarJsons = import.meta.glob<ContentFile>('/content/grammar/*.json', { eager: true, import: 'default' })
const grammarMds = import.meta.glob<string>('/content/grammar/*.md', { eager: true, query: '?raw', import: 'default' })

function buildTopics(
  jsons: Record<string, ContentFile>,
  mds: Record<string, string>,
  basePath: string,
  lang: Lang,
) {
  return Object.entries(jsons).map(([path, json]) => {
    const slug = path.replace(`${basePath}/`, '').replace('.json', '')
    const raw = mds[`${basePath}/${slug}.${lang}.md`] ?? mds[`${basePath}/${slug}.md`] ?? ''
    const { title } = parseFrontmatter(raw)
    return { slug, emoji: json.emoji ?? '📖', title: title || slug }
  })
}

interface Props {
  section: 'vocabulary' | 'grammar'
  currentSlug: string
  children: ReactNode
}

export default function SectionLayout({ section, currentSlug, children }: Props) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language as Lang

  const topics = useMemo(() => {
    if (section === 'vocabulary') return buildTopics(vocabJsons, vocabMds, '/content/vocabulary', lang)
    return buildTopics(grammarJsons, grammarMds, '/content/grammar', lang)
  }, [section, lang])

  const indexPath = section === 'vocabulary' ? '/vocabulary' : '/grammar'
  const topicPath = (slug: string) => `/${section}/${slug}`
  const allTopicsKey = section === 'vocabulary' ? 'vocab.allTopics' : 'grammar.allTopics'

  return (
    <div className='flex gap-0 md:gap-6 max-w-6xl mx-auto'>
      {/* Sidebar — desktop only */}
      <aside className='hidden md:flex flex-col w-48 shrink-0 pt-6 px-3'>
        <Link
          to={indexPath}
          className='text-xs font-black text-text2 uppercase tracking-wider mb-3 hover:text-accent1 transition-colors'
        >
          ← {t(allTopicsKey)}
        </Link>
        <nav className='flex flex-col gap-0.5'>
          {topics.map(({ slug, emoji, title }) => {
            const isActive = slug === currentSlug
            return (
              <Link
                key={slug}
                to={topicPath(slug)}
                className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-accent1/10 text-accent1 font-bold'
                    : 'text-text2 hover:text-text hover:bg-card'
                }`}
              >
                <span className='text-base leading-none'>{emoji}</span>
                <span className='truncate'>{title}</span>
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Main content */}
      <div className='flex-1 min-w-0'>{children}</div>
    </div>
  )
}
