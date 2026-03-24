import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useParams
} from 'react-router-dom';

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL || '',
  process.env.REACT_APP_SUPABASE_ANON_KEY || ''
);

// --- Components ---

const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
    <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
      <Link to="/" className="text-xl font-bold text-blue-600 flex items-center gap-2">
        <span className="text-2xl">💼</span> Atlas Deal Dashboard
      </Link>
      <div className="flex gap-4">
        <Link to="/" className="hover:text-blue-600 font-medium">Deals</Link>
      </div>
    </nav>
    <main className="p-6 max-w-7xl mx-auto">{children}</main>
  </div>
);

const DealStats = ({ deals }: { deals: any[] }) => {
  const total = deals.length;
  const avgScore = total > 0 ? (deals.reduce((acc, d) => acc + (d.buy_box_score || 0), 0) / total).toFixed(1) : 0;
  const statusCounts = deals.reduce((acc: any, d) => {
    acc[d.status] = (acc[d.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Total Deals</h3>
        <p className="text-3xl font-bold mt-2">{total}</p>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Avg Buy-Box Score</h3>
        <p className="text-3xl font-bold mt-2 text-blue-600">{avgScore}</p>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">New/Sourced</h3>
        <p className="text-3xl font-bold mt-2 text-green-600">{statusCounts['sourced'] || 0}</p>
      </div>
    </div>
  );
};

const formatCurrency = (val: number) => 
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

const Dashboard = () => {
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState('buy_box_score');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    async function fetchDeals() {
      const { data, error } = await supabase
        .from('deals')
        .select('*')
        .order('created_at', { ascending: false });
      if (data) setDeals(data);
      setLoading(false);
    }
    fetchDeals();
  }, []);

  const sortedDeals = [...deals]
    .filter(d => filterStatus === 'all' || d.status === filterStatus)
    .sort((a, b) => (b[sortField] || 0) - (a[sortField] || 0));

  if (loading) return <div className="text-center py-20 text-gray-500">Loading Atlas Deal Pipeline...</div>;

  return (
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
              {sortedDeals.map(deal => (
                <tr key={deal.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium">{deal.name}</td>
                  <td className="px-6 py-4">{formatCurrency(deal.revenue || 0)}</td>
                  <td className="px-6 py-4">{deal.gross_margin}%</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      deal.status === 'dead' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                    }`}>
                      {deal.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-12 h-12 rounded-full border-2 border-blue-100 flex items-center justify-center font-bold text-blue-600">
                      {deal.buy_box_score || 0}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link to={`/deal/${deal.id}`} className="text-blue-600 hover:underline font-medium">View Detail</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const BuyBoxScore = ({ deal }: { deal: any }) => {
  const revenue = deal.revenue || 0;
  const margin = deal.gross_margin || 0;

  const checks = [
    { label: "Revenue $1M+", pass: revenue >= 1000000 },
    { label: "Revenue $1M–$5M", pass: revenue >= 1000000 && revenue <= 5000000 },
    { label: "Margins >15%", pass: margin > 15 },
    { label: "Pacific NW Geography", pass: !!deal.is_pacific_nw },
    { label: "Recurring Revenue", pass: !!deal.has_recurring_revenue },
    { label: "Seller Financing", pass: !!deal.seller_financing }
  ];

  return (
    <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
      <h3 className="font-bold text-blue-800 mb-4 flex items-center gap-2">
        <span>🎯</span> MCG Buy-Box Criteria
      </h3>
      <div className="space-y-3">
        {checks.map((c, i) => (
          <div key={i} className="flex items-center justify-between text-sm">
            <span className={c.pass ? "text-blue-900" : "text-gray-400 line-through"}>{c.label}</span>
            <span className={c.pass ? "text-green-600 font-bold" : "text-gray-400"}>{c.pass ? "✓" : "✗"}</span>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-blue-200">
        <p className="text-xs text-blue-600 uppercase font-bold tracking-widest mb-1">Atlas Recommendation</p>
        <p className="text-lg font-bold text-blue-900 border-none p-0 bg-transparent">
          {deal.buy_box_score >= 70 ? "Strong Fit - Pursue Deep Vet" : "Secondary Priority"}
        </p>
      </div>
    </div>
  );
};

const DealDetail = () => {
  const { id } = useParams();
  const [deal, setDeal] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDeal() {
      const { data } = await supabase.from('deals').select('*').eq('id', id).single();
      if (data) setDeal(data);
      setLoading(false);
    }
    fetchDeal();
  }, [id]);

  if (loading) return <div className="text-center py-20 text-gray-500">Loading deal details...</div>;
  if (!deal) return <div className="text-center py-20 text-red-500">Deal not found.</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold">{deal.name}</h1>
              <p className="text-blue-600 font-medium mt-1">{deal.industry} • {deal.source}</p>
            </div>
            <span className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-bold">
              Score: {deal.buy_box_score}
            </span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-y border-gray-100">
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold">Asking Price</p>
              <p className="text-lg font-bold">{formatCurrency(deal.asking_price || 0)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold">Revenue</p>
              <p className="text-lg font-bold">{formatCurrency(deal.revenue || 0)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold">EBITDA</p>
              <p className="text-lg font-bold">{formatCurrency(deal.ebitda || 0)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold">Margin</p>
              <p className="text-lg font-bold">{deal.gross_margin}%</p>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="font-bold text-lg mb-4">Business Description</h3>
            <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {deal.business_description || deal.description || "No description provided."}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <BuyBoxScore deal={deal} />
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold mb-4">Quick Links</h3>
          <a 
            href={deal.source_url} 
            target="_blank" 
            rel="noreferrer" 
            className="block w-full bg-gray-900 text-white text-center py-3 rounded-lg font-bold hover:bg-black"
          >
            View Original Listing
          </a>
        </div>
      </div>
    </div>
  );
};

// --- App ---

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/deal/:id" element={<DealDetail />} />
        </Routes>
      </Layout>
    </Router>
  );
}
