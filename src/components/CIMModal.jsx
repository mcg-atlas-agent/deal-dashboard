import React, { useState } from 'react'

const CIM_DRAFT = `Hi,

I came across your listing on Flippa and I am interested in learning more. Could you please share the Confidential Information Memorandum (CIM) or Offering Memorandum?

I am a serious buyer actively acquiring businesses in the $1M–$5M range. Thank you.

Best regards,
Mattoo Capital Group`

export default function CIMModal({ deal, onClose, onMarkSent }) {
  const [copied, setCopied] = useState(false)
  const [marking, setMarking] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(CIM_DRAFT)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleMarkSent = async () => {
    setMarking(true)
    await onMarkSent()
    setMarking(false)
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-lg w-full max-w-lg shadow-xl">
        <div className="p-5 border-b border-gray-700">
          <h2 className="text-white font-semibold text-lg">CIM Request Draft</h2>
          <p className="text-gray-400 text-sm mt-1 truncate">{deal.description}</p>
        </div>
        <div className="p-5">
          <div className="bg-gray-900 border border-gray-700 rounded p-4 text-gray-300 text-sm whitespace-pre-wrap font-mono leading-relaxed">
            {CIM_DRAFT}
          </div>
        </div>
        <div className="p-5 pt-0 flex gap-3 justify-between items-center">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded"
          >
            Close
          </button>
          <div className="flex gap-3">
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white text-sm rounded"
            >
              {copied ? '✓ Copied!' : 'Copy to Clipboard'}
            </button>
            <button
              onClick={handleMarkSent}
              disabled={marking}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm rounded font-medium"
            >
              {marking ? 'Saving...' : 'Mark as Sent'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
