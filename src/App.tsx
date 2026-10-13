// src/App.tsx

import { BrowserRouter, Routes, Route } from 'react-router'
import { Home } from './pages/Home'
import { About } from './pages/About'
import { HowItWorks } from './pages/HowItWorks'
import { Contact } from './pages/Contact'
import { Privacy } from './pages/Privacy'
import { Terms } from './pages/Terms'
import { LetterView } from './pages/LetterView'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/:sender/:slug" element={<LetterView />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App