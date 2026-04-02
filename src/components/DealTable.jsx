import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PassModal from './PassModal'
import { supabase } from '../lib/supabase'

function fmt(num) {
  if (num == null) return 'N/A'
  return '$' + Math.round(num).toLocaleString('en-US')
}

function encodeId(url) {
  return btoa(url).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function truncate(str, len) {
  if (!str) return ''
  return str.length > len ? str.slice(0, len) + '…' : str
}

export default function DealTable({ deals, feedback, onFeedbackChange }) {
  const navigate = useNavigate()
  const [passTarget, setPassTarget] = useState(null)
  const [showPassed, setShowPassed] = useState(false)

  const passedUrls = new Set(
    Object.entries(feedback)
      .filter(([, v]) => v.rating === 'Pass')
      .map(([k]) => k)
  )

  const visibleDeals = showPassed
    ? deals
    : deals.filter(d => !passedUrls.has(d.flippa_url))

  const handleThumbsUp = async (deal) => {
    onFeedbackChange(deal.flippa_url, 'Hot', '')
    try {
      await supabase.from('deal_feedback').upsert({
        deal_id: deal.flippa_url,
        business_name: deal.business_name,
        rating: 'Hot',
        notes: ''
      }, { onConflict: 'deal_id' })
    } catch (e) {
      console.error('Supabase error:', e)
    }
    navigate(`/deal/${encodeId(deal.flippa_url)}`)
  }

  const handlePassSubmit = async (reason) => {
    const deal = passTarget
    onFeedbackChange(deal.flippa_url, 'Pass', reason)
    try {
      await supabase.from('deal_feedback').upsert({
        deal_id: deal.flippa_url,
        business_name: deal.business_name,
        rating: 'Pass',
        notes: reason
      }, { onConflict: 'deal_id' })
    } catch (e) {
      console.error('Supabase error:', e)
    }
    setPassTarget(null)
  }

  const passedCount = passedUrls.size
  const hotCount = Object.values(feedback).filter(v => v.rating === 'Hot').length

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-screen-xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Flippa Deal Review</h1>
            <p className="text-gray-400 text-sm mt-1">
              Mattoo Capital Group — {deals.length} deals
              {hotCount > 0 && <span className="ml-3 text-green-400">✓ {hotCount} interested</span>}
              {passedCount > 0 && <span className="ml-3 text-red-400">✗ {passedCount} passed</span>}
            </p>
          </div>
          {passedCount > 0 && (
            <button
              onClick={() => setShowPassed(p => !p)}
              className="text-sm px-3 py-1.5 rounded bg-gray-700 hover:bg-gray-600 text-gray-300"
            >
              {showPassed ? 'Hide passed deals' : `Show ${passedCount} passed deal${passedCount > 1 ? 's' : ''}`}
            </button>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-700">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-800 text-gray-400 uppercase text-xs tracking-wide">
              <tr>
                <th className="px-3 py-3 w-8">#</th>
                <th className="px-3 py-3 min-w-[200px]">Description</th>
                <th className="px-3 py-3 min-w-[140px]">Vertical</th>
                <th className="px-3 py-3 text-right min-w-[110px]">Buy Price</th>
                <th className="px-3 py-3 text-right min-w-[110px]">TTM Revenue</th>
                <th className="px-3 py-3 text-right min-w-[100px]">SDE</th>
                <th className="px-3 py-3 text-right min-w-[80px]">Margin</th>
                <th className="px-3 py-3 text-center min-w-[80px]">Founded</th>
                <th className="px-3 py-3 min-w-[160px]">Moat</th>
                <th className="px-3 py-3 text-center w-10">Link</th>
                <th className="px-3 py-3 text-center w-24">Vote</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {visibleDeals.map((deal, idx) => {
                const f = feedback[deal.flippa_url]
                const isPassed = f?.rating === 'Pass'
                const isHot = f?.rating === 'Hot'
                const rowNum = deals.indexOf(deal) + 1

                return (
                  <tr
                    key={deal.flippa_url}
                    className={[
                      'transition-colors',
                      isPassed
                        ? 'opacity-40 line-through bg-gray-900'
                        : isHot
                        ? 'bg-green-950/40 border-l-2 border-l-green-500 hover:bg-green-950/60'
                        : 'bg-gray-900 hover:bg-gray-800'
                    ].join(' ')}
                  >
                    <td className="px-3 py-3 text-gray-500 font-mono">{rowNum}</td>
                    <td className="px-3 py-3">
                      <span
                        className="text-gray-200 cursor-default"
                        title={deal.description}
                      >
                        {truncate(deal.description, 60)}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-gray-300">{deal.category}</td>
                    <td className="px-3 py-3 text-right text-gray-300 font-mono">
                      {deal.asking_price ? fmt(deal.asking_price) : <span className="text-gray-600">N/A</span>}
                    </td>
                    <td className="px-3 py-3 text-right text-gray-200 font-mono">{fmt(deal.revenue_annual)}</td>
                    <td className="px-3 py-3 text-right font-mono">
                      {deal.profit != null
                        ? <span className="text-green-400">{fmt(deal.profit)}</span>
                        : <span className="text-gray-600">N/A</span>}
                    </td>
                    <td className="px-3 py-3 text-right text-gray-300">{deal.gross_margin}</td>
                    <td className="px-3 py-3 text-center text-gray-400">{deal.year_founded}</td>
                    <td className="px-3 py-3">
                      <span
                        className="text-gray-400 cursor-default text-xs"
                        title={deal.moat}
                      >
                        {truncate(deal.moat, 50)}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <a
                        href={deal.flippa_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300"
                        title="View on Flippa"
                        onClick={e => e.stopPropagation()}
                      >
                        ↗
                      </a>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleThumbsUp(deal)}
                          disabled={isHot}
                          title="Interested"
                          className={[
                            'px-2 py-1 rounded text-base transition-colors',
                            isHot
                              ? 'bg-green-700 cursor-default'
                              : 'bg-green-800/60 hover:bg-green-700 text-white'
                          ].join(' ')}
                        >
                          👍
                        </button>
                        <button
                          onClick={() => !isPassed && setPassTarget(deal)}
                          disabled={isPassed}
                          title="Pass"
                          className={[
                            'px-2 py-1 rounded text-base transition-colors',
                            isPassed
                              ? 'bg-red-900/40 cursor-default'
                              : 'bg-red-900/60 hover:bg-red-800 text-white'
                          ].join(' ')}
                        >
                          👎
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {passTarget && (
        <PassModal
          deal={passTarget}
          onClose={() => setPassTarget(null)}
          onSubmit={handlePassSubmit}
        />
      )}
    </div>
  )
}
