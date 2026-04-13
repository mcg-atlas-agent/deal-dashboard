import React, { useState } from 'react'

export default function PassModal({ deal, onClose, onSubmit }) {
  const [reason, setReason] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!reason.trim()) return
    setSubmitting(true)
    await onSubmit(reason.trim())
    setSubmitting(false)
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-lg w-full max-w-md shadow-xl">
        <div className="p-5 border-b border-gray-700">
          <h2 className="text-white font-semibold text-lg">Pass on this deal?</h2>
          <p className="text-gray-400 text-sm mt-1 truncate">{deal.description}</p>
        </div>
        <div className="p-5">
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Why are you passing on this deal?
          </label>
          <textarea
            className="w-full bg-gray-900 border border-gray-600 rounded text-white text-sm p-3 resize-none focus:outline-none focus:border-gray-400"
            rows={4}
            placeholder="e.g. Margins too low, outside our vertical, valuation too high..."
            value={reason}
            onChange={e => setReason(e.target.value)}
            autoFocus
          />
        </div>
        <div className="p-5 pt-0 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!reason.trim() || submitting}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm rounded font-medium"
          >
            {submitting ? 'Saving...' : 'Confirm Pass'}
          </button>
        </div>
      </div>
    </div>
  )
}
