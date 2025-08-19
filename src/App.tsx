import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { ToastProvider } from './components/context/ToastContext'
import { VerificationProvider } from './components/context/VerificationContext'
import { Homepage } from './components/features/Homepage'
import { About } from './components/features/About'
import { ReportPage } from './components/features/Reportpage'

function App() {
  return (
    <ToastProvider>
      <VerificationProvider>
          <div className="App">
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/report" element={<ReportPage />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </div>
      </VerificationProvider>
    </ToastProvider>
  )
}

export default App