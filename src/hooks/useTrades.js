import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export function useTrades(accountId, filters = {}) {
  const [trades,  setTrades]  = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    if (!accountId) return
    fetchTrades()
  }, [accountId, filters.symbol, filters.type, filters.from, filters.to])

  async function fetchTrades() {
    setLoading(true)
    setError(null)
    try {
      let q = supabase
        .from('tp_trades')
        .select('*')
        .eq('account_id', accountId)
        .order('close_time', { ascending: false })

      if (filters.symbol) q = q.eq('symbol', filters.symbol)
      if (filters.type)   q = q.eq('position_type', filters.type)
      if (filters.from)   q = q.gte('close_time', filters.from)
      if (filters.to)     q = q.lte('close_time', filters.to)

      const { data, error: err } = await q
      if (err) throw err
      setTrades(data || [])
    } catch (err) {
      setError(err.message)
      console.error('useTrades error:', err)
    } finally {
      setLoading(false)
    }
  }

  return { trades, loading, error, refetch: fetchTrades }
}
