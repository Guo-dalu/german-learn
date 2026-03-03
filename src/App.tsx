import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import VocabularyPage from './pages/VocabularyPage'
import GrammarPage from './pages/GrammarPage'
import ExercisePage from './pages/ExercisePage'

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
