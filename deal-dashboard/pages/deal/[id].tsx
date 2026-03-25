import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Layout, BuyBoxScore, formatCurrency } from '../../components/DashboardComponents';

const DealDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [deal, setDeal] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    async function fetchDeal() {
      const res = await fetch(`/api/deals/${id}`);
      const data = await res.json();
      if (data && !data.error) {
        setDeal(data);
      }
      setLoading(false);
    }
    fetchDeal();
  }, [id]);

  if (loading) return (
    <Layout>
      <div className="text-center py-20 text-gray-500">Loading deal details...</div>
    </Layout>
  );
  
  if (!deal) return (
    <Layout>
      <div className="text-center py-20 text-red-500">Deal not found.</div>
    </Layout>
  );

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold">{deal.name || deal.business_name}</h1>
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
              href={deal.source_url || deal.url} 
              target="_blank" 
              rel="noreferrer" 
              className="block w-full bg-gray-900 text-white text-center py-3 rounded-lg font-bold hover:bg-black"
            >
              View Original Listing
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DealDetail;
