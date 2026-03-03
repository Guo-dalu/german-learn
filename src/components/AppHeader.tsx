import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function AppHeader() {
  const { t, i18n } = useTranslation()

  const toggleLang = () => {
    const next = i18n.language === 'en' ? 'zh' : 'en'
    i18n.changeLanguage(next)
    localStorage.setItem('lang', next)
  }

  return (
    <header>
      <nav>
        <NavLink to="/">Deutsch!</NavLink>
        <NavLink to="/vocabulary">{t('nav.vocabulary')}</NavLink>
        <NavLink to="/grammar">{t('nav.grammar')}</NavLink>
        <NavLink to="/exercises">{t('nav.exercises')}</NavLink>
        <button onClick={toggleLang}>
          {i18n.language === 'en' ? '中文' : 'EN'}
        </button>
      </nav>
    </header>
  )
}
