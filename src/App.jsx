import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import DealTable from './components/DealTable'
import DealDetail from './pages/DealDetail'
import deals from './data/deals'

export default function App() {
  const [feedback, setFeedback] = useState({})

  const updateFeedback = (flippaUrl, rating, notes) => {
    setFeedback(prev => ({
      ...prev,
      [flippaUrl]: { rating, notes: notes || '' }
    }))
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <DealTable
            deals={deals}
            feedback={feedback}
            onFeedbackChange={updateFeedback}
          />
        }
      />
      <Route
        path="/deal/:id"
        element={
          <DealDetail
            deals={deals}
            feedback={feedback}
            onFeedbackChange={updateFeedback}
          />
        }
      />
    </Routes>
  )
}
