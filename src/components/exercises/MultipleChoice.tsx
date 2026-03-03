import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { MultipleChoiceExercise, Lang } from '../../types/content'

interface Props {
  exercise: MultipleChoiceExercise
  lang: Lang
}

const EMOJIS = ['🅐', '🅑', '🅒', '🅓']

export default function MultipleChoice({ exercise, lang }: Props) {
  const { t } = useTranslation()
  const [selected, setSelected] = useState<number | null>(null)

  const pick = (i: number) => {
    if (selected !== null) return
    setSelected(i)
  }

  const bgFor = (i: number) => {
    if (selected === null) return 'var(--bg2)'
    if (i === exercise.answer) return 'rgba(78,205,196,0.18)'
    if (i === selected) return 'rgba(255,107,107,0.18)'
    return 'var(--bg2)'
  }

  const borderFor = (i: number) => {
    if (selected === null) return 'var(--border)'
    if (i === exercise.answer) return 'var(--accent2)'
    if (i === selected) return 'var(--accent1)'
    return 'var(--border)'
  }

  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: 'var(--card)', border: '2px solid var(--border)', boxShadow: '4px 4px 0 var(--border)' }}
    >
      <div className="mb-3 font-black" style={{ fontFamily: 'Fredoka One, cursive', color: 'var(--text2)', fontSize: '1.05rem' }}>
        {t('exercise.multipleChoice')}
      </div>

      <div className="mb-4 font-bold text-base" style={{ color: 'var(--text)' }}>
        {exercise.question[lang]}
      </div>

      <div className="flex flex-col gap-2">
        {exercise.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => pick(i)}
            className="text-left rounded-xl px-4 py-3 font-bold transition-all cursor-pointer hover:-translate-y-0.5"
            style={{
              background: bgFor(i),
              border: `2px solid ${borderFor(i)}`,
              color: 'var(--text)',
              fontFamily: 'Nunito, sans-serif',
            }}
          >
            <span className="mr-2 opacity-60">{EMOJIS[i]}</span>
            {opt[lang]}
          </button>
        ))}
      </div>

      {selected !== null && (
        <div className="mt-3 font-black text-sm" style={{ color: selected === exercise.answer ? 'var(--accent2)' : 'var(--accent1)' }}>
          {selected === exercise.answer ? t('exercise.richtig') : t('exercise.wrong')}
        </div>
      )}
    </div>
  )
}
