import { Component, type ErrorInfo, type ReactNode } from 'react'

/**
 * RED DE SEGURIDAD DE LA APP
 *
 * Sin esto, cualquier excepción durante el render desmonta el árbol entero de
 * React y deja la pantalla en NEGRO, sin una sola pista de qué pasó. Le ocurrió
 * a Sam el 2026-08-21: el inicio cargaba y la pestaña Entreno se quedaba negra,
 * y desde fuera era indistinguible de un fallo de red, de caché o de datos.
 *
 * Una app que se usa a diario desde el teléfono, lejos de una consola de
 * desarrollo, no puede permitirse fallar en silencio. Ahora un error muestra
 * qué pasó, dónde, y ofrece las dos salidas que de verdad arreglan algo:
 * volver atrás y reinstalar limpiando el service worker.
 */

interface Props {
  children: ReactNode
  /** Nombre de la zona que envuelve, para saber qué pantalla falló. */
  zona: string
}

interface State {
  error: Error | null
  info: string
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null, info: '' }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // La pila de componentes dice en qué tarjeta reventó, que es justo lo que
    // no se puede deducir mirando una pantalla negra.
    this.setState({ info: (info.componentStack ?? '').split('\n').slice(0, 6).join('\n') })
    console.error(`[RITMO] Error en ${this.props.zona}:`, error, info.componentStack)
  }

  private async reinstalar() {
    try {
      if ('serviceWorker' in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations()
        await Promise.all(regs.map((r) => r.unregister()))
      }
      if ('caches' in window) {
        const claves = await caches.keys()
        await Promise.all(claves.map((k) => caches.delete(k)))
      }
    } catch {
      // Da igual por qué falle la limpieza: recargar sigue siendo lo correcto.
    }
    window.location.reload()
  }

  render() {
    const { error, info } = this.state
    if (!error) return this.props.children

    return (
      <div className="p-5">
        <div className="rounded-2xl border border-red-500/40 bg-red-500/5 p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-red-400">
            Algo falló en {this.props.zona}
          </p>
          <p className="mt-2 text-[14px] leading-relaxed">
            Esta pantalla no pudo cargar, pero <strong>tus datos están intactos</strong>: viven en el
            teléfono y un error de pantalla no los toca.
          </p>

          <div className="mt-3 overflow-x-auto rounded-xl bg-[var(--color-surface-2)] p-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-ink-dim)]">
              Qué pasó exactamente
            </p>
            <p className="mt-1 font-mono text-[12px] leading-relaxed break-words text-[var(--color-ink)]">
              {error.name}: {error.message}
            </p>
            {info && (
              <pre className="mt-2 whitespace-pre-wrap font-mono text-[10px] leading-snug text-[var(--color-ink-dim)]">
                {info.trim()}
              </pre>
            )}
          </div>

          <p className="mt-3 text-[12px] leading-relaxed text-[var(--color-ink-dim)]">
            Manda ese texto por el chat y se arregla. Mientras tanto, las demás pestañas siguen
            funcionando.
          </p>

          <div className="mt-3 flex gap-2">
            <button
              onClick={() => this.setState({ error: null, info: '' })}
              className="flex-1 rounded-xl bg-[var(--color-accent)] py-2.5 text-[13px] font-semibold text-black"
            >
              Reintentar
            </button>
            <button
              onClick={() => this.reinstalar()}
              className="flex-1 rounded-xl border border-[var(--color-line)] py-2.5 text-[13px] font-semibold"
            >
              Reinstalar la app
            </button>
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-[var(--color-ink-dim)]">
            «Reinstalar» borra la versión guardada en el teléfono y la descarga de nuevo. No borra tus
            registros.
          </p>
        </div>
      </div>
    )
  }
}
