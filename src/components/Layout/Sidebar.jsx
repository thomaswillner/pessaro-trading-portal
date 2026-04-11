import { NavLink } from 'react-router-dom'
import { C, UI, MONO } from '@/lib/helpers'

const NAV = [
  { to: '/',            label: 'Resumen',        icon: '◈' },
  { to: '/rendimiento', label: 'Rendimiento',    icon: '▲' },
  { to: '/operaciones', label: 'Operaciones',    icon: '⊞' },
  { to: '/grafico',     label: 'Gráfico',        icon: '◫' },
  { to: '/calendario',  label: 'Calendario P&L', icon: '▦' },
  { to: '/riesgo',      label: 'Riesgo',         icon: '◉' },
]

export default function Sidebar({ account }) {
  return (
    <aside style={{
      width: 224, background: '#030e1c',
      borderRight: `1px solid ${C.border}`,
      display: 'flex', flexDirection: 'column', flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: '22px 20px 18px', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 9, flexShrink: 0,
            background: 'linear-gradient(135deg, #00e5a0 0%, #4d90ff 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, fontWeight: 800, color: '#010a15',
          }}>P</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', letterSpacing: '-0.3px' }}>
              Pessaro Capital
            </div>
            <div style={{ fontSize: 9, color: C.faint, letterSpacing: '2px', textTransform: 'uppercase', marginTop: 2 }}>
              Portal Cliente
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '14px 0', overflowY: 'auto' }}>
        <div style={{ fontSize: 9, color: C.faint, letterSpacing: '2px', textTransform: 'uppercase', padding: '0 20px 10px', fontFamily: UI }}>
          Navegación
        </div>
        {NAV.map(n => (
          <NavLink key={n.to} to={n.to} end={n.to === '/'} style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '11px 20px', fontSize: 13, fontFamily: UI,
            fontWeight: isActive ? 600 : 400,
            color: isActive ? C.green : C.muted,
            background: isActive ? 'rgba(0,229,160,0.08)' : 'transparent',
            borderLeft: `2px solid ${isActive ? C.green : 'transparent'}`,
            textDecoration: 'none', transition: 'all 0.15s',
          })}>
            <span style={{ fontSize: 14 }}>{n.icon}</span>
            {n.label}
          </NavLink>
        ))}
      </nav>

      {/* Account badge */}
      <div style={{ padding: '14px 16px', borderTop: `1px solid ${C.border}` }}>
        <div style={{
          background: 'rgba(80,140,220,0.06)', border: `1px solid ${C.border}`,
          borderRadius: 10, padding: '11px 14px',
        }}>
          <div style={{ fontSize: 9, color: C.faint, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 6 }}>
            Cuenta activa
          </div>
          <div style={{ fontSize: 12, color: C.green, fontFamily: MONO, fontWeight: 600 }}>
            {account?.account_number || 'MT4-284751'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.green, boxShadow: `0 0 7px ${C.green}` }} />
            <div style={{ fontSize: 11, color: C.muted }}>En vivo</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
