import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './components/context/AuthContext'
import { ToastProvider } from './components/context/ToastContext'
import { VerificationProvider } from './components/context/VerificationContext'
import { Homepage } from './components/features/Homepage'
import { About } from './components/features/About'
import { ReportPage } from './components/features/Reportpage'

function App() {
  return (
    <ToastProvider>
      <VerificationProvider>
        <AuthProvider>
          <div className="App">
            <Routes>
              <Route path="/" element={<Homepage />} />
              {/* <Route path="/search" element={<div>Search Results Page - Coming Soon</div>} /> */}
              <Route path="/report" element={<ReportPage />} />
              <Route path="/about" element={<About />} />
              {/* <Route path="/help" element={<div>Help Page - Coming Soon</div>} /> */}
            </Routes>
          </div>
        </AuthProvider>
      </VerificationProvider>
    </ToastProvider>
  )
}

export default App