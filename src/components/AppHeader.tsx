import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'
import { STORAGE_KEYS } from '../constants'

export default function AppHeader() {
  const { t, i18n } = useTranslation()

  const toggleLang = () => {
    const next = i18n.language === 'en' ? 'zh' : 'en'
    i18n.changeLanguage(next)
    localStorage.setItem(STORAGE_KEYS.LANG, next)
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
