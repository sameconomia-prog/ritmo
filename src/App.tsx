import { useEffect, useState } from 'react'
import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import { aplicarActualizacion, iniciarActualizaciones } from './pwa'
import { ErrorBoundary } from './ErrorBoundary'
import Hoy from './pages/Hoy'
import Entreno from './pages/Entreno'
import Comida from './pages/Comida'
import Estudio from './pages/Estudio'
import Progreso from './pages/Progreso'
import Fotos from './pages/Fotos'
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
  const [hayVersion, setHayVersion] = useState(false)

  useEffect(() => {
    iniciarActualizaciones(() => setHayVersion(true))
  }, [])

  return (
    <div className="mx-auto flex min-h-full max-w-lg flex-col">
      {hayVersion && (
        <button
          onClick={aplicarActualizacion}
          className="rise fixed inset-x-4 top-3 z-[60] mx-auto flex max-w-md items-center gap-3 rounded-2xl border border-[var(--color-accent)]/40 bg-[var(--color-surface-2)] px-4 py-3 text-left shadow-lg"
        >
          <span className="flex h-2 w-2 shrink-0 rounded-full bg-[var(--color-accent)] ring-live" />
          <span className="flex-1 text-[13px] leading-snug">
            Hay una versión nueva de RITMO lista.
          </span>
          <span className="shrink-0 text-[13px] font-semibold text-[var(--color-accent)]">
            Actualizar
          </span>
        </button>
      )}

      <main className="safe-top flex-1 px-4 pb-28 pt-5">
        {/*
          Cada pantalla va envuelta por separado, con su nombre. Así un fallo en
          Entreno no tumba la app entera: las demás pestañas siguen navegables y
          el error aparece escrito en la pantalla que lo provocó, en vez de
          dejarla en negro sin ninguna pista.
        */}
        <Routes>
          <Route path="/" element={<Navigate to="/hoy" replace />} />
          <Route path="/hoy" element={<ErrorBoundary zona="Hoy"><Hoy /></ErrorBoundary>} />
          <Route path="/entreno" element={<ErrorBoundary zona="Entreno"><Entreno /></ErrorBoundary>} />
          <Route path="/comida" element={<ErrorBoundary zona="Comida"><Comida /></ErrorBoundary>} />
          <Route path="/estudio" element={<ErrorBoundary zona="Estudio"><Estudio /></ErrorBoundary>} />
          <Route path="/progreso" element={<ErrorBoundary zona="Progreso"><Progreso /></ErrorBoundary>} />
          <Route path="/fotos" element={<ErrorBoundary zona="Fotos"><Fotos /></ErrorBoundary>} />
          <Route path="/ajustes" element={<ErrorBoundary zona="Ajustes"><Ajustes /></ErrorBoundary>} />
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
