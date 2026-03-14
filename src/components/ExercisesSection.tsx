import { useTranslation } from 'react-i18next'
import type { Exercise, FillInExercise, Lang, MatchingExercise, MultipleChoiceExercise } from '../types/content'
import FillInBlanks from './exercises/FillInBlanks'
import Matching from './exercises/Matching'
import MultipleChoice from './exercises/MultipleChoice'
import SectionHeading from './SectionHeading'

export default function ExercisesSection({ exercises, lang }: { exercises: Exercise[]; lang: Lang }) {
  const { t } = useTranslation()
  if (exercises.length === 0) return null

  const matchings = exercises.filter((e): e is MatchingExercise => e.type === 'matching')
  const fillIns = exercises.filter((e): e is FillInExercise => e.type === 'fill-in')
  const multiChoices = exercises.filter((e): e is MultipleChoiceExercise => e.type === 'multiple-choice')

  return (
    <section>
      <SectionHeading emoji='✏️' label={t('exercises.title')} />
      <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
        {matchings.map((ex, i) => (
          <Matching key={i} exercise={ex} lang={lang} />
        ))}
        {fillIns.length > 0 && <FillInBlanks exercises={fillIns} lang={lang} />}
        {multiChoices.map((ex, i) => (
          <MultipleChoice key={i} exercise={ex} lang={lang} />
        ))}
      </div>
    </section>
  )
}
