import Link from 'next/link'

export const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
    <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
      <Link href="/" className="text-xl font-bold text-blue-600 flex items-center gap-2">
        <span className="text-2xl">💼</span> Atlas Deal Dashboard
      </Link>
      <div className="flex gap-4">
        <Link href="/" className="hover:text-blue-600 font-medium">Deals</Link>
      </div>
    </nav>
    <main className="p-6 max-w-7xl mx-auto">{children}</main>
  </div>
);

export const DealStats = ({ deals }: { deals: any[] }) => {
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

export const BuyBoxScore = ({ deal }: { deal: any }) => {
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

export const formatCurrency = (val: number) => 
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
