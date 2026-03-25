import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseServer } from '../../../lib/supabase'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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
    return res.status(500).json({ error: error.message })
  }

  return res.status(200).json(data)
}
