import metaRaw from '../../content/meta.json'
import type { Lang, SiteMeta, TopicMeta } from '../types/content'

export const meta = metaRaw as SiteMeta

export function getLocalizedTitle(m: TopicMeta, lang: Lang): string {
  return m.title[lang] ?? m.title.en
}

export function getTopics(section: 'vocabulary' | 'grammar', lang: Lang) {
  return Object.entries(meta[section]).map(([slug, m]) => ({
    slug,
    emoji: m.emoji,
    title: getLocalizedTitle(m, lang),
    tags: m.tags,
    wordCount: m.wordCount ?? 0,
  }))
}

export function parseFrontmatter(raw: string): { title: string; tags: string[]; emoji: string; wordCount: number; body: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n/)
  if (!match) return { title: '', tags: [], emoji: '', wordCount: 0, body: raw }
  const fm = match[1]
  const title = (fm.match(/title:\s*"?([^"\n]+)"?/) ?? [])[1] ?? ''
  const tagStr = (fm.match(/tags:\s*\[([^\]]+)\]/) ?? [])[1] ?? ''
  const tags = tagStr.split(',').map(s => s.trim().replace(/"/g, ''))
  const emoji = (fm.match(/emoji:\s*"?([^"\n]+)"?/) ?? [])[1]?.trim() ?? ''
  const wordCount = parseInt((fm.match(/wordCount:\s*(\d+)/) ?? [])[1] ?? '0', 10)
  const body = raw.slice(match[0].length).trim()
  return { title, tags, emoji, wordCount, body }
}
