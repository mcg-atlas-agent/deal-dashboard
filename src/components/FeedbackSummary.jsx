import React from 'react'

export default function FeedbackSummary({ feedback, deals }) {
  const ratings = Object.values(feedback).reduce(
    (acc, item) => {
      if (item.rating) acc[item.rating] = (acc[item.rating] || 0) + 1
      return acc
    },
    { Hot: 0, Maybe: 0, Pass: 0 }
  )

  const total = Object.keys(feedback).length

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6">
      <h2 className="text-lg font-semibold text-white mb-4">Feedback Summary</h2>
      <div className="grid grid-cols-4 gap-4">
        <div>
          <p className="text-gray-400 text-xs uppercase tracking-wide">Reviewed</p>
          <p className="text-white font-bold text-2xl mt-1">{total}</p>
        </div>
        <div>
          <p className="text-gray-400 text-xs uppercase tracking-wide">🔥 Hot</p>
          <p className="text-green-400 font-bold text-2xl mt-1">{ratings.Hot}</p>
        </div>
        <div>
          <p className="text-gray-400 text-xs uppercase tracking-wide">🤔 Maybe</p>
          <p className="text-yellow-400 font-bold text-2xl mt-1">{ratings.Maybe}</p>
        </div>
        <div>
          <p className="text-gray-400 text-xs uppercase tracking-wide">❌ Pass</p>
          <p className="text-red-400 font-bold text-2xl mt-1">{ratings.Pass}</p>
        </div>
      </div>
    </div>
  )
}
