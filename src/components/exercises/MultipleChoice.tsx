import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Card from '../Card'
import type { MultipleChoiceExercise, Lang } from '../../types/content'

interface Props {
  exercise: MultipleChoiceExercise
  lang: Lang
}

const LABELS = ['A', 'B', 'C', 'D']

export default function MultipleChoice({ exercise, lang }: Props) {
  const { t } = useTranslation()
  const [selected, setSelected] = useState<number | null>(null)

  const pick = (i: number) => {
    if (selected !== null) return
    setSelected(i)
  }

  const bgFor = (i: number) => {
    if (selected === null) return 'var(--option-bg)'
    if (i === exercise.answer) return 'var(--accent2-soft)'
    if (i === selected) return 'var(--accent1-soft)'
    return 'var(--option-bg)'
  }

  const borderFor = (i: number) => {
    if (selected === null) return 'var(--border)'
    if (i === exercise.answer) return 'var(--accent2)'
    if (i === selected) return 'var(--accent1)'
    return 'var(--border)'
  }

  return (
    <Card className="p-5">
      <div className="mb-3 font-black font-display text-text2 text-base">
        {t('exercise.multipleChoice')}
      </div>

      <div className="mb-4 font-bold text-base text-text">
        {exercise.question[lang]}
      </div>

      <div className="flex flex-col gap-2">
        {exercise.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => pick(i)}
            className="text-left rounded-xl px-4 py-3 font-bold transition-all cursor-pointer hover:-translate-y-0.5 text-text font-body"
            style={{
              background: bgFor(i),
              border: `2px solid ${borderFor(i)}`,
            }}
          >
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-accent4 text-white text-[10px] font-black mr-2 shrink-0">{LABELS[i]}</span>
            {opt[lang]}
          </button>
        ))}
      </div>

      {selected !== null && (
        <div className={`mt-3 font-black text-sm ${selected === exercise.answer ? 'text-accent2' : 'text-accent1'}`}>
          {selected === exercise.answer ? t('exercise.richtig') : t('exercise.wrong')}
        </div>
      )}
    </Card>
  )
}
