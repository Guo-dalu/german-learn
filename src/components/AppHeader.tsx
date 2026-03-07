import { BookOpen, Dumbbell, Menu, Moon, NotebookPen, Sun, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'
import { STORAGE_KEYS } from '../constants'

type Theme = 'light' | 'dark'

const NAV_LINKS = [
  {
    to: '/vocabulary',
    icon: BookOpen,
    labelKey: 'nav.vocabulary',
    iconColor: 'text-accent2',
    badgeBg: 'bg-accent2-soft',
    badgeBorder: 'border-accent2/40',
    activeBg: 'bg-accent2-soft',
    activeText: 'text-accent2',
  },
  {
    to: '/grammar',
    icon: NotebookPen,
    labelKey: 'nav.grammar',
    iconColor: 'text-accent4',
    badgeBg: 'bg-accent4/15',
    badgeBorder: 'border-accent4/40',
    activeBg: 'bg-accent4/15',
    activeText: 'text-accent4',
  },
  {
    to: '/exercises',
    icon: Dumbbell,
    labelKey: 'nav.exercises',
    iconColor: 'text-accent1',
    badgeBg: 'bg-accent1-soft',
    badgeBorder: 'border-accent1/40',
    activeBg: 'bg-accent1-soft',
    activeText: 'text-accent1',
  },
] as const

export default function AppHeader() {
  const { t, i18n } = useTranslation()
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem(STORAGE_KEYS.THEME) as Theme) ?? 'light')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem(STORAGE_KEYS.THEME, theme)
  }, [theme])

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'))

  const toggleLang = (lang: string) => {
    i18n.changeLanguage(lang)
    localStorage.setItem(STORAGE_KEYS.LANG, lang)
  }

  const closeMenu = () => setMenuOpen(false)

  return (
    <header className='sticky top-0 z-50 bg-bg border-b-2 border-border' style={{ boxShadow: '0 3px 10px var(--shadow)' }}>
      {/* Main bar */}
      <div className='max-w-5xl mx-auto px-4 h-11 flex items-center justify-between gap-3'>
        {/* Logo */}
        <NavLink
          to='/'
          className='font-display text-lg text-accent3 shrink-0 cursor-pointer hover:opacity-80 transition-opacity active:scale-95'
          onClick={closeMenu}
        >
          Deutsch!
        </NavLink>

        {/* Desktop nav */}
        <nav className='hidden md:flex items-center gap-0.5'>
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `cursor-pointer flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold font-body transition-all active:scale-95 ${
                  isActive ? `${link.activeText} ${link.activeBg}` : 'text-text2 hover:text-text hover:bg-bg2'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`flex items-center justify-center w-4.5 h-4.5 rounded border ${link.iconColor} ${link.badgeBg} ${link.badgeBorder}`}
                  >
                    <link.icon size={11} strokeWidth={isActive ? 2.5 : 2} />
                  </span>
                  {t(link.labelKey)}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Controls (desktop) */}
        <div className='hidden md:flex items-center gap-1.5'>
          <ThemeButton theme={theme} onToggle={toggleTheme} />
          <LangToggle lang={i18n.language} onSelect={toggleLang} />
        </div>

        {/* Hamburger (mobile) */}
        <button
          className='md:hidden cursor-pointer flex items-center justify-center w-7 h-7 rounded-lg bg-bg2 border border-border text-text2 hover:text-accent3 hover:border-accent3 transition-all active:scale-90'
          onClick={() => setMenuOpen((o) => !o)}
          aria-label='Toggle menu'
        >
          {menuOpen ? <X size={16} /> : <Menu size={16} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className='md:hidden border-t-2 border-border bg-bg'>
          <nav className='flex flex-col'>
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={closeMenu}
                className={({ isActive }) =>
                  `cursor-pointer flex items-center gap-3 px-5 py-3 border-b border-border font-body font-semibold text-sm transition-all active:scale-[0.98] ${
                    isActive ? `${link.activeText} ${link.activeBg}` : 'text-text2 hover:bg-bg2'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`flex items-center justify-center w-6 h-6 rounded-md border ${link.iconColor} ${link.badgeBg} ${link.badgeBorder}`}
                    >
                      <link.icon size={13} strokeWidth={isActive ? 2.5 : 2} />
                    </span>
                    {t(link.labelKey)}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
          <div className='flex items-center gap-2 px-5 py-3'>
            <ThemeButton theme={theme} onToggle={toggleTheme} />
            <LangToggle lang={i18n.language} onSelect={toggleLang} />
          </div>
        </div>
      )}
    </header>
  )
}

function ThemeButton({ theme, onToggle }: { theme: Theme; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className='cursor-pointer w-7 h-7 flex items-center justify-center rounded-full bg-bg2 border border-border text-text2 hover:text-accent3 hover:border-accent3 hover:bg-accent3-soft transition-all active:scale-90'
      aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      {theme === 'light' ? <Moon size={13} /> : <Sun size={13} />}
    </button>
  )
}

function LangToggle({ lang, onSelect }: { lang: string; onSelect: (l: string) => void }) {
  const active = 'bg-accent3 text-white font-semibold'
  const inactive = 'text-text2 hover:text-accent3 hover:bg-accent3-soft'

  return (
    <div className='flex items-center h-7 rounded-full border border-border bg-bg2 overflow-hidden text-xs font-body'>
      <button
        onClick={() => onSelect('en')}
        className={`cursor-pointer h-full px-2.5 transition-all active:scale-90 ${lang === 'en' ? active : inactive}`}
      >
        EN
      </button>
      <button
        onClick={() => onSelect('zh')}
        className={`cursor-pointer h-full px-2.5 transition-all active:scale-90 ${lang === 'zh' ? active : inactive}`}
      >
        中文
      </button>
    </div>
  )
}
