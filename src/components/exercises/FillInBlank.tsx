import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { FillInExercise, Lang } from '../../types/content'

interface Props {
  exercise: FillInExercise
  lang: Lang
}

export default function FillInBlank({ exercise, lang }: Props) {
  const { t } = useTranslation()
  const [value, setValue] = useState('')
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle')
  const [revealed, setRevealed] = useState(false)

  const [before, after] = exercise.sentence.split('___')

  const check = (input: string) => {
    setValue(input)
    if (input.trim().toLowerCase() === exercise.answer.toLowerCase()) {
      setStatus('correct')
    } else if (input.length > 2) {
      setStatus('wrong')
    } else {
      setStatus('idle')
    }
  }

  const reveal = () => {
    setValue(exercise.answer)
    setStatus('correct')
    setRevealed(true)
  }

  const borderColor =
    status === 'correct' ? 'var(--accent2)' :
    status === 'wrong'   ? 'var(--accent1)' :
    'var(--border)'

  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: 'var(--card)', border: '2px solid var(--border)', boxShadow: '4px 4px 0 var(--border)' }}
    >
      <div className="mb-3 font-black" style={{ fontFamily: 'Fredoka One, cursive', color: 'var(--text2)', fontSize: '1.05rem' }}>
        {t('exercise.fillIn')}
      </div>

      <div className="mb-4 font-bold text-base leading-loose" style={{ color: 'var(--text)' }}>
        {before}
        <input
          className="inline-block mx-1 rounded-xl px-3 py-1 font-bold text-center outline-none"
          style={{
            width: '7rem',
            background: 'var(--bg2)',
            color: 'var(--text)',
            border: `2px solid ${borderColor}`,
            fontFamily: 'Nunito, sans-serif',
            fontSize: '1rem',
          }}
          value={value}
          onChange={e => check(e.target.value)}
          placeholder="..."
          disabled={revealed}
        />
        {after}
        <span className="block text-xs mt-1" style={{ color: 'var(--text2)' }}>
          hint: <em>{exercise.hint[lang]}</em>
        </span>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={reveal}
          className="rounded-full px-5 py-2 text-sm font-black text-white cursor-pointer hover:-translate-y-0.5 transition-transform"
          style={{ background: 'var(--accent4)', fontFamily: 'Fredoka One, cursive' }}
        >
          {t('exercise.reveal')}
        </button>
        {status === 'correct' && (
          <span className="font-black text-sm" style={{ color: 'var(--accent2)' }}>{t('exercise.richtig')}</span>
        )}
        {status === 'wrong' && (
          <span className="font-black text-sm" style={{ color: 'var(--accent1)' }}>{t('exercise.wrong')}</span>
        )}
      </div>
    </div>
  )
}
