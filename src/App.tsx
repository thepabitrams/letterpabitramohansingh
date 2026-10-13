// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router'
import { Home } from './pages/Home'
import { LetterView } from './pages/LetterView'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:sender/:slug" element={<LetterView />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App