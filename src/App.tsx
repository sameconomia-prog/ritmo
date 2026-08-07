import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import Hoy from './pages/Hoy'
import Entreno from './pages/Entreno'
import Comida from './pages/Comida'
import Estudio from './pages/Estudio'
import Progreso from './pages/Progreso'
import Ajustes from './pages/Ajustes'
import { IconComida, IconEntreno, IconEstudio, IconHoy, IconProgreso } from './icons'

const TABS = [
  { to: '/hoy', Icon: IconHoy, label: 'Hoy' },
  { to: '/entreno', Icon: IconEntreno, label: 'Entreno' },
  { to: '/comida', Icon: IconComida, label: 'Comida' },
  { to: '/estudio', Icon: IconEstudio, label: 'Estudio' },
  { to: '/progreso', Icon: IconProgreso, label: 'Progreso' },
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

      <nav className="safe-bottom fixed inset-x-0 bottom-0 z-50 mx-auto max-w-lg border-t border-[var(--color-line)] bg-[var(--color-base)]/92 backdrop-blur-xl">
        <div className="flex items-stretch justify-around px-1 pt-2 pb-1.5">
          {TABS.map(({ to, Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `relative flex flex-1 flex-col items-center gap-1 rounded-xl py-1 transition-colors duration-200 ${
                  isActive
                    ? 'text-[var(--color-accent)]'
                    : 'text-[var(--color-ink-dim)] active:text-[var(--color-ink)]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon active={isActive} />
                  <span className={`text-[10px] leading-none ${isActive ? 'font-semibold' : 'font-medium'}`}>
                    {label}
                  </span>
                  <span
                    className={`absolute -top-[9px] h-[2.5px] rounded-full bg-[var(--color-accent)] transition-all duration-300 ${
                      isActive ? 'w-7 opacity-100' : 'w-0 opacity-0'
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
