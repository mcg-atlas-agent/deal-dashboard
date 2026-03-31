import React, { useState, useEffect } from 'react'
import DealCard from './components/DealCard'
import FeedbackSummary from './components/FeedbackSummary'
import dealsData from '../deals.json'

export default function App() {
  const [deals, setDeals] = useState([])
  const [feedback, setFeedback] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load deals
    setDeals(dealsData)

    // Load feedback from localStorage
    const savedFeedback = localStorage.getItem('flippa_feedback')
    if (savedFeedback) {
      setFeedback(JSON.parse(savedFeedback))
    }

    setLoading(false)
  }, [])

  const updateFeedback = (dealId, rating, notes) => {
    const updated = {
      ...feedback,
      [dealId]: { rating, notes }
    }
    setFeedback(updated)
    localStorage.setItem('flippa_feedback', JSON.stringify(updated))
  }

  const exportFeedback = async () => {
    const feedbackData = {
      timestamp: new Date().toISOString(),
      deals: deals.map(deal => ({
        id: deal.flippa_url,
        business_name: deal.business_name,
        revenue_annual: deal.revenue_annual,
        ...feedback[deal.flippa_url]
      }))
    }

    // For local demo, log to console
    console.log('Feedback to export:', feedbackData)

    // In production, this would POST to your server
    alert('Feedback prepared. In production, this would be saved to flippa_feedback.json')
  }

  const resetAllFeedback = () => {
    setFeedback({})
    localStorage.removeItem('flippa_feedback')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-gray-400">Loading deals...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Flippa Deal Review</h1>
          <p className="text-gray-400">Rate and gather feedback on {deals.length} Shopify deals</p>
        </div>

        {/* Summary */}
        {Object.keys(feedback).length > 0 && (
          <FeedbackSummary feedback={feedback} deals={deals} />
        )}

        {/* Action Buttons */}
        <div className="mb-6 flex gap-3">
          <button
            onClick={exportFeedback}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-medium"
          >
            Export Feedback
          </button>
          {Object.keys(feedback).length > 0 && (
            <button
              onClick={resetAllFeedback}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-medium"
            >
              Reset All Feedback
            </button>
          )}
        </div>

        {/* Deal Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
          {deals.map((deal, idx) => (
            <DealCard
              key={deal.flippa_url}
              deal={deal}
              index={idx + 1}
              currentFeedback={feedback[deal.flippa_url]}
              onFeedbackChange={(rating, notes) => updateFeedback(deal.flippa_url, rating, notes)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
