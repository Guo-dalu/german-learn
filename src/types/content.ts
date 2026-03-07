export type Lang = 'en' | 'zh'

export interface Word {
  german: string
  article: string
  gender: 'masculine' | 'feminine' | 'neuter'
  plural: string
  en: string
  zh: string
  level: string
  tags: string[]
}

export interface LocalizedString {
  en: string
  zh: string
}

export interface DialogueLine {
  speaker: string
  text: string
}

export interface Dialogue {
  id: string
  scene: LocalizedString
  audio?: string
  highlighted_words: string[]
  lines: DialogueLine[]
}

export interface FillInExercise {
  type: 'fill-in'
  sentence: string
  answer: string
}

export interface MultipleChoiceExercise {
  type: 'multiple-choice'
  question: LocalizedString
  options: LocalizedString[]
  answer: number
}

export interface MatchingExercise {
  type: 'matching'
  pairs: { german: string; en: string; zh: string }[]
}

export type Exercise = FillInExercise | MultipleChoiceExercise | MatchingExercise

export interface Phrase {
  german: string
  en: string
  zh: string
}

export interface ContentFile {
  topic: string
  tags: string[]
  featured_word?: string
  emoji?: string
  words?: Word[]
  dialogues?: Dialogue[]
  phrasebook?: Phrase[]
  exercises: Exercise[]
}
