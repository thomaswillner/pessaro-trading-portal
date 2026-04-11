import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { C } from '@/lib/helpers'
import Sidebar from '@/components/Layout/Sidebar'
import Overview    from '@/pages/Overview'
import Performance from '@/pages/Performance'
import Trades      from '@/pages/Trades'
import ChartPage   from '@/pages/ChartPage'
import Calendar    from '@/pages/Calendar'
import Risk        from '@/pages/Risk'

export default function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => subscription.unsubscribe()
  }, [])

  if (loading) return <Loader />

  // In dev mode with no auth, use demo data
  const userId = session?.user?.id || 'demo'

  return (
    <BrowserRouter>
      <div style={{ display: 'flex', height: '100vh', background: C.bg, overflow: 'hidden' }}>
        <Sidebar />
        <main style={{ flex: 1, overflow: 'auto', padding: '28px 32px' }}>
          <Routes>
            <Route path="/"            element={<Overview    userId={userId} />} />
            <Route path="/rendimiento" element={<Performance userId={userId} />} />
            <Route path="/operaciones" element={<Trades      userId={userId} />} />
            <Route path="/grafico"     element={<ChartPage   userId={userId} />} />
            <Route path="/calendario"  element={<Calendar    userId={userId} />} />
            <Route path="/riesgo"      element={<Risk        userId={userId} />} />
            <Route path="*"            element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

function Loader() {
  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: C.bg }}>
      <div style={{ fontSize: 13, color: 'rgba(150,200,255,0.4)', fontFamily: "'JetBrains Mono', monospace" }}>
        Cargando Pessaro Portal…
      </div>
    </div>
  )
}
