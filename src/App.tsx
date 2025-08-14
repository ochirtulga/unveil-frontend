import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Homepage } from './components/features/Homepage'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/search" element={<div>Search Results Page - Coming Soon</div>} />
        <Route path="/report" element={<div>Report Scammer Page - Coming Soon</div>} />
        <Route path="/about" element={<div>About Page - Coming Soon</div>} />
        <Route path="/help" element={<div>Help Page - Coming Soon</div>} />
      </Routes>
    </div>
  )
}

export default App