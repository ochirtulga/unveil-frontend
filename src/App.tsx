import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './components/context/AuthContext'
import { Homepage } from './components/features/Homepage'
import { About } from './components/features/About'

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/search" element={<div>Search Results Page - Coming Soon</div>} />
          <Route path="/report" element={<div>Report Scammer Page - Coming Soon</div>} />
          <Route path="/about" element={<About />} />
          <Route path="/help" element={<div>Help Page - Coming Soon</div>} />
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App