import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseServer } from '../../../lib/supabase'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
    console.log('SUPABASE_SECRET_KEY:', process.env.SUPABASE_SECRET_KEY);
    if (req.method !== 'GET') {
      return res.status(405).json({ message: 'Method not allowed' })
    }

    const { status, sort = 'buy_box_score' } = req.query

    let query = supabaseServer
      .from('deals')
      .select('*')
   
    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    const { data, error } = await query.order(sort as string, { ascending: false })
    
    if (error) {
        console.error('Supabase error:', error);
        return res.status(500).json({ error: error.message });
      }

    return res.status(200).json(data)
  } catch (error: any) {
    console.error('API error:', error)
    return res.status(500).json({ error: error?.message || 'Internal server error' })
  }
}
// Redeploy with env vars
