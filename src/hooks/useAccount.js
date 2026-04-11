import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export function useAccount(userId) {
  const [account,   setAccount]   = useState(null)
  const [positions, setPositions] = useState([])
  const [loading,   setLoading]   = useState(true)

  useEffect(() => {
    if (!userId) return
    fetchAccount()

    // Realtime: subscribe to account updates
    const channel = supabase
      .channel(`account:${userId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'tp_accounts',
        filter: `user_id=eq.${userId}`,
      }, payload => setAccount(payload.new))
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'tp_open_positions',
        filter: `user_id=eq.${userId}`,
      }, () => fetchPositions())
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [userId])

  async function fetchAccount() {
    setLoading(true)
    const { data: acc } = await supabase
      .from('tp_accounts')
      .select('*')
      .eq('user_id', userId)
      .single()

    const { data: pos } = await supabase
      .from('tp_open_positions')
      .select('*')
      .eq('user_id', userId)

    setAccount(acc)
    setPositions(pos || [])
    setLoading(false)
  }

  async function fetchPositions() {
    const { data } = await supabase
      .from('tp_open_positions')
      .select('*')
      .eq('user_id', userId)
    setPositions(data || [])
  }

  return { account, positions, loading, refetch: fetchAccount }
}
