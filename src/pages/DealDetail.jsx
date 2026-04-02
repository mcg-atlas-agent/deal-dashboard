import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import CIMModal from '../components/CIMModal'
import { supabase } from '../lib/supabase'

function decodeId(id) {
  try {
    return atob(id.replace(/-/g, '+').replace(/_/g, '/'))
  } catch {
    return null
  }
}

function fmt(num) {
  if (num == null) return 'N/A'
  return '$' + Math.round(num).toLocaleString('en-US')
}

function Row({ label, value }) {
  return (
    <tr className="border-b border-gray-700/50">
      <td className="py-2 pr-6 text-gray-400 text-sm whitespace-nowrap">{label}</td>
      <td className="py-2 text-gray-200 text-sm">{value ?? 'N/A'}</td>
    </tr>
  )
}

export default function DealDetail({ deals, feedback, onFeedbackChange }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [showCIM, setShowCIM] = useState(false)
  const [cimStatus, setCimStatus] = useState(null) // null | { requested: bool, requested_at: string }
  const [loadingCIM, setLoadingCIM] = useState(true)

  const flippaUrl = decodeId(id)
  const deal = deals.find(d => d.flippa_url === flippaUrl)

  useEffect(() => {
    if (!flippaUrl) return
    const fetchCIMStatus = async () => {
      try {
        const { data } = await supabase
          .from('deals')
          .select('cim_requested, cim_requested_at')
          .eq('flippa_url', flippaUrl)
          .single()
        if (data) setCimStatus(data)
      } catch {
        // table may not exist yet — treat as no CIM
      }
      setLoadingCIM(false)
    }
    fetchCIMStatus()
  }, [flippaUrl])

  if (!deal) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Deal not found.</p>
          <button onClick={() => navigate('/')} className="text-blue-400 hover:underline text-sm">
            ← Back to table
          </button>
        </div>
      </div>
    )
  }

  const handleCIMMarkSent = async () => {
    const now = new Date().toISOString()
    try {
      await supabase.from('deals').upsert({
        flippa_url: flippaUrl,
        business_name: deal.business_name,
        cim_requested: true,
        cim_requested_at: now
      }, { onConflict: 'flippa_url' })
    } catch (e) {
      console.error('Supabase error:', e)
    }
    setCimStatus({ cim_requested: true, cim_requested_at: now })
    setShowCIM(false)
  }

  const marginNum = deal.gross_margin
    ? parseFloat(deal.gross_margin)
    : null

  const currentFeedback = feedback[deal.flippa_url]

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Back */}
        <button
          onClick={() => navigate('/')}
          className="text-gray-400 hover:text-white text-sm mb-6 flex items-center gap-1"
        >
          ← Back to deal table
        </button>

        {/* Header */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{deal.category}</p>
              <h1 className="text-xl font-bold text-white leading-snug">{deal.description}</h1>
              <div className="flex flex-wrap gap-4 mt-3 text-sm">
                <span className="text-gray-400">
                  Revenue: <span className="text-white font-mono">{fmt(deal.revenue_annual)}</span>
                </span>
                {deal.asking_price && (
                  <span className="text-gray-400">
                    Ask: <span className="text-white font-mono">{fmt(deal.asking_price)}</span>
                  </span>
                )}
                <span className="text-gray-400">
                  Margin: <span className="text-white">{deal.gross_margin}</span>
                </span>
              </div>
            </div>
            <a
              href={deal.flippa_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-700 hover:bg-blue-600 text-white text-sm rounded"
            >
              View on Flippa ↗
            </a>
          </div>

          {currentFeedback?.rating === 'Hot' && (
            <div className="mt-4 px-3 py-2 bg-green-900/40 border border-green-700/50 rounded text-green-400 text-sm">
              ✓ Marked as Interested
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Section 1: Snapshot */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-5">
            <h2 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Snapshot</h2>
            <table className="w-full">
              <tbody>
                <Row label="TTM Revenue" value={fmt(deal.revenue_annual)} />
                <Row label="TTM SDE" value={deal.profit != null ? fmt(deal.profit) : 'N/A'} />
                <Row label="Gross Margin" value={deal.gross_margin || 'N/A'} />
                <Row label="Year Founded" value={deal.year_founded} />
                <Row label="US Based" value={deal.us_based ? 'Yes' : 'No'} />
                <Row label="Moat" value={deal.moat} />
              </tbody>
            </table>
          </div>

          {/* Section 4: Marketing & Operations */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-5">
            <h2 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Marketing & Operations</h2>
            <table className="w-full">
              <tbody>
                <Row label="Marketing Strategy" value={deal.marketing_strategy} />
                <Row label="Main Sales Source" value={deal.main_sales_source} />
                <Row label="Holds Inventory" value={deal.has_inventory ? 'Yes' : 'No'} />
                <Row label="Avg Order Value" value={deal.aov ? `$${deal.aov.toFixed(2)}` : 'N/A'} />
                <Row label="Monthly Revenue" value={fmt(deal.revenue_monthly)} />
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 2: Financial Summary */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-5 mb-6">
          <h2 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Financial Summary</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-2 pr-6 text-gray-400 font-medium">Metric</th>
                  <th className="text-right py-2 px-4 text-gray-500 font-medium">Y-2</th>
                  <th className="text-right py-2 px-4 text-gray-500 font-medium">Y-1</th>
                  <th className="text-right py-2 px-4 text-gray-200 font-medium">Y0 (TTM)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                <tr>
                  <td className="py-2 pr-6 text-gray-400">Revenue</td>
                  <td className="py-2 px-4 text-right text-gray-600 italic text-xs">Pending CIM</td>
                  <td className="py-2 px-4 text-right text-gray-600 italic text-xs">Pending CIM</td>
                  <td className="py-2 px-4 text-right text-gray-200 font-mono">{fmt(deal.revenue_annual)}</td>
                </tr>
                <tr>
                  <td className="py-2 pr-6 text-gray-400">Gross Profit</td>
                  <td className="py-2 px-4 text-right text-gray-600 italic text-xs">Pending CIM</td>
                  <td className="py-2 px-4 text-right text-gray-600 italic text-xs">Pending CIM</td>
                  <td className="py-2 px-4 text-right text-gray-200 font-mono">
                    {marginNum != null && deal.revenue_annual
                      ? fmt(deal.revenue_annual * marginNum / 100)
                      : 'N/A'}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-6 text-gray-400">SDE</td>
                  <td className="py-2 px-4 text-right text-gray-600 italic text-xs">Pending CIM</td>
                  <td className="py-2 px-4 text-right text-gray-600 italic text-xs">Pending CIM</td>
                  <td className="py-2 px-4 text-right text-gray-200 font-mono">
                    {deal.profit != null ? fmt(deal.profit) : 'N/A'}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-6 text-gray-400">Margin %</td>
                  <td className="py-2 px-4 text-right text-gray-600 italic text-xs">Pending CIM</td>
                  <td className="py-2 px-4 text-right text-gray-600 italic text-xs">Pending CIM</td>
                  <td className="py-2 px-4 text-right text-gray-200">{deal.gross_margin || 'N/A'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: CIM Status */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-5">
          <h2 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">CIM Status</h2>
          {loadingCIM ? (
            <p className="text-gray-500 text-sm">Loading...</p>
          ) : cimStatus?.cim_requested ? (
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-900/40 border border-blue-700/50 rounded text-blue-300 text-sm">
                ✓ CIM Requested
                {cimStatus.cim_requested_at && (
                  <span className="text-blue-500 text-xs">
                    {new Date(cimStatus.cim_requested_at).toLocaleDateString()}
                  </span>
                )}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <span className="text-gray-400 text-sm">CIM Not Requested</span>
              <button
                onClick={() => setShowCIM(true)}
                className="px-3 py-1.5 bg-blue-700 hover:bg-blue-600 text-white text-sm rounded"
              >
                Request CIM from Seller
              </button>
            </div>
          )}
        </div>

      </div>

      {showCIM && (
        <CIMModal
          deal={deal}
          onClose={() => setShowCIM(false)}
          onMarkSent={handleCIMMarkSent}
        />
      )}
    </div>
  )
}
