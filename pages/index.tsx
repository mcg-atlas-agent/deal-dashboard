import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Layout, DealStats, formatCurrency } from '../components/DashboardComponents';

const Dashboard = () => {
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState('buy_box_score');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    async function fetchDeals() {
      const res = await fetch(`/api/deals?status=${filterStatus}&sort=${sortField}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setDeals(data);
      }
      setLoading(false);
    }
    fetchDeals();
  }, [filterStatus, sortField]);

  if (loading) return (
    <Layout>
      <div className="text-center py-20 text-gray-500">Loading Atlas Deal Pipeline...</div>
    </Layout>
  );

  return (
    <Layout>
      <div>
        <h1 className="text-2xl font-bold mb-6">Pipeline Overview</h1>
        <DealStats deals={deals} />
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex flex-wrap gap-4 justify-between items-center">
            <div className="flex gap-4">
              <select 
                className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="sourced">Sourced</option>
                <option value="under_review">Review</option>
                <option value="dead">Dead</option>
              </select>
              <select 
                className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm"
                value={sortField}
                onChange={(e) => setSortField(e.target.value)}
              >
                <option value="buy_box_score">Sort by Score</option>
                <option value="revenue">Sort by Revenue</option>
                <option value="gross_margin">Sort by Margin</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Business Name</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Revenue (Annual)</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Margin</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Score</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {deals.map(deal => (
                  <tr key={deal.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium">{deal.name || deal.business_name}</td>
                    <td className="px-6 py-4">{formatCurrency(deal.revenue || 0)}</td>
                    <td className="px-6 py-4">{deal.gross_margin}%</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        deal.status === 'dead' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                      }`}>
                        {deal.status?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-12 h-12 rounded-full border-2 border-blue-100 flex items-center justify-center font-bold text-blue-600">
                        {deal.buy_box_score || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/deal/${deal.id}`} className="text-blue-600 hover:underline font-medium">View Detail</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
