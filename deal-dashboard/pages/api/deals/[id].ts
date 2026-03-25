import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseServer } from '../../../lib/supabase'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query

  if (req.method === 'GET') {
    const { data, error } = await supabaseServer
      .from('deals')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    if (!data) {
      return res.status(404).json({ message: 'Deal not found' })
    }

    return res.status(200).json(data)
  }

  if (req.method === 'PUT') {
    const { data, error } = await supabaseServer
      .from('deals')
      .update(req.body)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    return res.status(200).json(data)
  }

  return res.status(405).json({ message: 'Method not allowed' })
}
