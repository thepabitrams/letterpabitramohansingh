/* src/main.tsx */
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import { Home } from './pages/Home'
import { LetterView } from './pages/LetterView'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:sender/:slug" element={<LetterView />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)