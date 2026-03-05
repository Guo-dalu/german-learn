export const DEFAULT_LANG = 'en'

export const STORAGE_KEYS = {
  THEME: 'theme',
  LANG: 'lang',
  PROGRESS: (topic: string) => `progress:${topic}`,
} as const

export const GENDER_COLOR: Record<string, string> = {
  masculine: 'var(--accent5)',
  feminine: 'var(--accent1)',
  neuter: 'var(--accent2)',
}

export const GENDER_LABEL: Record<string, string> = {
  masculine: 'masc',
  feminine: 'fem',
  neuter: 'neut',
}
