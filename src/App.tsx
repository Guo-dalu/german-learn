import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ExercisePage from './pages/ExercisePage'
import GrammarPage from './pages/GrammarPage'
import Home from './pages/Home'
import VocabularyPage from './pages/VocabularyPage'

export default function App() {
  return (
    <BrowserRouter basename="/german-learn">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/vocabulary/:topic" element={<VocabularyPage />} />
        <Route path="/grammar/:topic" element={<GrammarPage />} />
        <Route path="/exercises" element={<ExercisePage />} />
      </Routes>
    </BrowserRouter>
  )
}
