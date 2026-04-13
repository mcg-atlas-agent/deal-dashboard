import React, { useState } from 'react'

export default function DealCard({ deal, index, currentFeedback, onFeedbackChange }) {
  const [notes, setNotes] = useState(currentFeedback?.notes || '')

  const handleRatingChange = (rating) => {
    onFeedbackChange(rating, notes)
  }

  const handleNotesChange = (e) => {
    const newNotes = e.target.value
    setNotes(newNotes)
    onFeedbackChange(currentFeedback?.rating || null, newNotes)
  }

  const formatCurrency = (num) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(num)
  }

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <p className="text-gray-400 text-sm mb-1">Deal #{index}</p>
          <h3 className="text-xl font-semibold text-white">{deal.business_name}</h3>
          <p className="text-gray-400 text-sm mt-1">{deal.category}</p>
        </div>
        <a
          href={deal.flippa_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 text-sm font-medium ml-4"
        >
          View on Flippa →
        </a>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-4 mb-6 pb-6 border-b border-gray-700">
        <div>
          <p className="text-gray-400 text-xs uppercase tracking-wide">Annual Revenue</p>
          <p className="text-white font-semibold mt-1">
            {formatCurrency(deal.revenue_annual)}
          </p>
        </div>
        <div>
          <p className="text-gray-400 text-xs uppercase tracking-wide">Monthly</p>
          <p className="text-white font-semibold mt-1">
            {formatCurrency(deal.revenue_monthly)}
          </p>
        </div>
        <div>
          <p className="text-gray-400 text-xs uppercase tracking-wide">Margin</p>
          <p className="text-white font-semibold mt-1">{deal.gross_margin}</p>
        </div>
      </div>

      {/* Details */}
      {deal.moat && (
        <div className="mb-4">
          <p className="text-gray-400 text-xs uppercase tracking-wide">Competitive Moat</p>
          <p className="text-gray-200 text-sm mt-1">{deal.moat}</p>
        </div>
      )}

      {deal.year_founded && (
        <p className="text-gray-400 text-sm mb-4">Founded: {deal.year_founded}</p>
      )}

      {/* Feedback Section */}
      <div className="mt-6 pt-6 border-t border-gray-700">
        <p className="text-gray-400 text-xs uppercase tracking-wide mb-3">Your Rating</p>

        {/* Radio Buttons */}
        <div className="flex gap-4 mb-4">
          {['Hot', 'Maybe', 'Pass'].map((rating) => (
            <label key={rating} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name={`rating-${deal.flippa_url}`}
                value={rating}
                checked={currentFeedback?.rating === rating}
                onChange={() => handleRatingChange(rating)}
                className="w-4 h-4 text-blue-500 cursor-pointer"
              />
              <span className={`text-sm font-medium ${
                currentFeedback?.rating === rating
                  ? 'text-white'
                  : 'text-gray-400'
              }`}>
                {rating}
              </span>
            </label>
          ))}
        </div>

        {/* Notes */}
        <textarea
          value={notes}
          onChange={handleNotesChange}
          placeholder="Add questions or notes (optional)"
          className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none h-20"
        />
      </div>
    </div>
  )
}
