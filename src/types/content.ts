export type Lang = 'en' | 'zh'

export interface LocalizedString {
  en: string
  zh: string
}

export interface FillInExercise {
  type: 'fill-in'
  sentence: string
  answer: string
  hint: LocalizedString
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

export interface ContentFile {
  topic: string
  tags: string[]
  exercises: Exercise[]
}
