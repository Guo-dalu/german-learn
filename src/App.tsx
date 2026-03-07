import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'

const VocabularyIndex = lazy(() => import('./pages/VocabularyIndex'))
const VocabularyPage = lazy(() => import('./pages/VocabularyPage'))
const GrammarIndex = lazy(() => import('./pages/GrammarIndex'))
const GrammarPage = lazy(() => import('./pages/GrammarPage'))
const ExercisePage = lazy(() => import('./pages/ExercisePage'))

export default function App() {
  return (
    <BrowserRouter basename="/german-learn">
      <Suspense>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/vocabulary" element={<VocabularyIndex />} />
            <Route path="/vocabulary/:topic" element={<VocabularyPage />} />
            <Route path="/grammar" element={<GrammarIndex />} />
            <Route path="/grammar/:topic" element={<GrammarPage />} />
            <Route path="/exercises" element={<ExercisePage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
