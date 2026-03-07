import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Card from '../Card'
import type { FillInExercise, Lang } from '../../types/content'

interface Props {
  exercises: FillInExercise[]
  lang: Lang
}

function FillInItem({ exercise, index }: { exercise: FillInExercise; index: number; lang: Lang }) {
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
    <div className="py-4 border-b border-dashed border-border last:border-0">
      <div className="flex gap-3 items-baseline mb-3">
        <span className="font-display text-accent4 text-sm shrink-0">{index + 1}.</span>
        <div className="font-bold text-base leading-loose text-text">
          {before}
          <input
            className="inline-block mx-1 w-28 rounded-xl px-3 py-1 font-bold text-base text-center outline-none bg-option-bg text-text font-body"
            style={{ border: `2px solid ${borderColor}` }}
            value={value}
            onChange={e => check(e.target.value)}
            placeholder="..."
            disabled={revealed}
          />
          {after}
        </div>
      </div>
      <div className="flex items-center gap-3 pl-6">
        <button
          onClick={reveal}
          className="rounded-full px-4 py-1.5 text-xs font-black text-white cursor-pointer hover:-translate-y-0.5 transition-transform bg-accent4 font-display"
        >
          {t('exercise.reveal')}
        </button>
        {status === 'correct' && (
          <span className="font-black text-sm text-accent2">{t('exercise.richtig')}</span>
        )}
        {status === 'wrong' && (
          <span className="font-black text-sm text-accent1">{t('exercise.wrong')}</span>
        )}
      </div>
    </div>
  )
}

export default function FillInBlanks({ exercises, lang }: Props) {
  const { t } = useTranslation()

  return (
    <Card className="p-5">
      <div className="mb-4 font-black font-display text-text2 text-[1.05rem]">
        {t('exercise.fillIn')}
      </div>
      <div>
        {exercises.map((ex, i) => (
          <FillInItem key={i} exercise={ex} index={i} lang={lang} />
        ))}
      </div>
    </Card>
  )
}
