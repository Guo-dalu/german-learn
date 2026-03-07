import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Card from '../Card'
import type { Lang, MatchingExercise } from '../../types/content'

interface Props {
  exercise: MatchingExercise
  lang: Lang
}

export default function Matching({ exercise, lang }: Props) {
  const { t } = useTranslation()
  const { pairs } = exercise

  // Shuffle the right column once on mount (lazy initializer avoids re-shuffle on re-render)
  const [shuffled] = useState(() => [...pairs].sort(() => Math.random() - 0.5))

  const [selectedGerman, setSelectedGerman] = useState<string | null>(null)
  const [matched, setMatched] = useState<Set<string>>(new Set())
  const [wrongPair, setWrongPair] = useState<{ german: string; translation: string } | null>(null)

  const allDone = matched.size === pairs.length

  const pickGerman = (german: string) => {
    if (matched.has(german) || allDone) return
    setSelectedGerman((prev) => (prev === german ? null : german))
  }

  const pickTranslation = (translation: string) => {
    if (!selectedGerman || allDone) return
    const pair = pairs.find((p) => p.german === selectedGerman)
    const correct = pair?.[lang] === translation

    if (correct) {
      setMatched((prev) => new Set([...prev, selectedGerman]))
      setSelectedGerman(null)
    } else {
      setWrongPair({ german: selectedGerman, translation })
      setTimeout(() => {
        setWrongPair(null)
        setSelectedGerman(null)
      }, 600)
    }
  }

  const isMatchedGerman = (german: string) => matched.has(german)
  const isMatchedTranslation = (translation: string) =>
    [...matched].some((g) => pairs.find((p) => p.german === g)?.[lang] === translation)

  const germanBg = (german: string) => {
    if (isMatchedGerman(german)) return 'var(--accent2-soft)'
    if (wrongPair?.german === german) return 'var(--accent1-soft)'
    if (selectedGerman === german) return 'var(--accent3-soft)'
    return 'var(--option-bg)'
  }

  const germanBorder = (german: string) => {
    if (isMatchedGerman(german)) return 'var(--accent2)'
    if (wrongPair?.german === german) return 'var(--accent1)'
    if (selectedGerman === german) return 'var(--accent3)'
    return 'var(--border)'
  }

  const translationBg = (translation: string) => {
    if (isMatchedTranslation(translation)) return 'var(--accent2-soft)'
    if (wrongPair?.translation === translation) return 'var(--accent1-soft)'
    return 'var(--option-bg)'
  }

  const translationBorder = (translation: string) => {
    if (isMatchedTranslation(translation)) return 'var(--accent2)'
    if (wrongPair?.translation === translation) return 'var(--accent1)'
    return 'var(--border)'
  }

  return (
    <Card className='p-5 md:col-span-2'>
      <div className='mb-3 font-black font-display text-text2 text-base'>{t('exercise.matching')}</div>

      {allDone ? (
        <div className='text-center py-6 font-display text-accent2 text-xl'>{t('exercise.richtig')} ✓</div>
      ) : (
        <div className='grid grid-cols-2 gap-3'>
          <div className='flex flex-col gap-2'>
            {pairs.map((pair) => (
              <button
                key={pair.german}
                onClick={() => pickGerman(pair.german)}
                disabled={isMatchedGerman(pair.german)}
                className='text-left rounded-xl px-3 py-2 font-bold text-sm font-body text-text transition-all cursor-pointer hover:-translate-y-0.5 disabled:cursor-default disabled:opacity-60'
                style={{ background: germanBg(pair.german), border: `2px solid ${germanBorder(pair.german)}` }}
              >
                {pair.german}
              </button>
            ))}
          </div>
          <div className='flex flex-col gap-2'>
            {shuffled.map((pair) => {
              const translation = pair[lang]
              return (
                <button
                  key={pair.german}
                  onClick={() => pickTranslation(translation)}
                  disabled={isMatchedTranslation(translation)}
                  className='text-left rounded-xl px-3 py-2 font-bold text-sm font-body text-text transition-all cursor-pointer hover:-translate-y-0.5 disabled:cursor-default disabled:opacity-60'
                  style={{ background: translationBg(translation), border: `2px solid ${translationBorder(translation)}` }}
                >
                  {translation}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {!allDone && (
        <div className='mt-2 text-xs text-text2 font-semibold'>
          {matched.size}/{pairs.length} matched
        </div>
      )}
    </Card>
  )
}
