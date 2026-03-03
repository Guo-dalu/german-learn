import { useTranslation } from 'react-i18next'

export default function Home() {
  const { t } = useTranslation()
  return (
    <main>
      <h1>{t('home.tagline')}</h1>
      <p>{t('home.subtitle')}</p>
    </main>
  )
}
