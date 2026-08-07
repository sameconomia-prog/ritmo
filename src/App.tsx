import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import Hoy from './pages/Hoy'
import Entreno from './pages/Entreno'
import Comida from './pages/Comida'
import Estudio from './pages/Estudio'
import Progreso from './pages/Progreso'
import Ajustes from './pages/Ajustes'

const TABS = [
  { to: '/hoy', icon: '◎', label: 'Hoy' },
  { to: '/entreno', icon: '⬛', label: 'Entreno' },
  { to: '/comida', icon: '◍', label: 'Comida' },
  { to: '/estudio', icon: '◆', label: 'Estudio' },
  { to: '/progreso', icon: '▲', label: 'Progreso' },
]

export default function App() {
  return (
    <div className="mx-auto flex min-h-full max-w-lg flex-col">
      <main className="safe-top flex-1 px-4 pb-28 pt-5">
        <Routes>
          <Route path="/" element={<Navigate to="/hoy" replace />} />
          <Route path="/hoy" element={<Hoy />} />
          <Route path="/entreno" element={<Entreno />} />
          <Route path="/comida" element={<Comida />} />
          <Route path="/estudio" element={<Estudio />} />
          <Route path="/progreso" element={<Progreso />} />
          <Route path="/ajustes" element={<Ajustes />} />
          <Route path="*" element={<Navigate to="/hoy" replace />} />
        </Routes>
      </main>

      <nav className="safe-bottom fixed inset-x-0 bottom-0 z-50 mx-auto max-w-lg border-t border-[var(--color-line)] bg-[var(--color-base)]/90 backdrop-blur-xl">
        <div className="flex items-stretch justify-around px-1 pt-1.5 pb-1">
          {TABS.map((t) => (
            <NavLink
              key={t.to}
              to={t.to}
              className={({ isActive }) =>
                `flex flex-1 flex-col items-center gap-0.5 rounded-xl py-2 text-[10px] font-medium transition ${
                  isActive
                    ? 'text-[var(--color-accent)]'
                    : 'text-[var(--color-ink-dim)] active:text-[var(--color-ink)]'
                }`
              }
            >
              <span className="text-[15px] leading-none">{t.icon}</span>
              {t.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
