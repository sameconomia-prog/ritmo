/**
 * GESTIÓN DE ACTUALIZACIONES
 *
 * El service worker generado por vite-plugin-pwa usa skipWaiting + clientsClaim:
 * al detectar una versión nueva la descarga y toma el control de inmediato. Pero
 * la página YA renderizada sigue ejecutando el bundle viejo, así que los cambios
 * no se ven hasta la siguiente carga. Sin esto, la app va siempre una visita
 * atrás — y en un PWA instalado en iOS, hasta que la cierras por completo.
 *
 * Estrategia:
 *  · Se busca versión nueva al abrir, al volver a primer plano y cada hora.
 *  · Si aparece mientras la app está en segundo plano o sin usar → recarga sola.
 *  · Si aparece mientras estás usándola → avisa y espera, para no interrumpirte
 *    a media serie del gimnasio ni borrar un campo a medio escribir.
 *
 * Los datos NUNCA se pierden: viven en IndexedDB, que las actualizaciones de
 * código no tocan. Solo se reemplaza la app, no tu historial.
 */

let versionNueva = false
let recargando = false

function recargar() {
  if (recargando) return
  recargando = true
  window.location.reload()
}

/** ¿El usuario está interactuando ahora mismo con algo que perdería? */
function estaOcupado(): boolean {
  const el = document.activeElement
  if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
    return el.value.trim().length > 0
  }
  return false
}

/**
 * @param alHaberVersion Se llama cuando hay versión nueva y NO se puede recargar
 *                       en el momento. La UI muestra el aviso.
 */
export function iniciarActualizaciones(alHaberVersion: () => void) {
  if (!('serviceWorker' in navigator)) return

  // Si ya había un controlador, cualquier cambio posterior es una ACTUALIZACIÓN.
  // Si no lo había, es la primera instalación y no hay que recargar nada.
  const eraInstalacionPrevia = !!navigator.serviceWorker.controller

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!eraInstalacionPrevia) return
    versionNueva = true

    // En segundo plano o sin nada a medio escribir: recarga silenciosa.
    if (document.visibilityState === 'hidden' || !estaOcupado()) {
      recargar()
      return
    }
    alHaberVersion()
  })

  navigator.serviceWorker.ready.then((registro) => {
    const buscar = () => registro.update().catch(() => {})

    buscar()
    setInterval(buscar, 60 * 60 * 1000)

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState !== 'visible') return
      // Al volver a la app: si ya había versión lista, este es el mejor momento.
      if (versionNueva) recargar()
      else buscar()
    })
  })
}

/** Fuerza la recarga desde el botón del aviso. */
export function aplicarActualizacion() {
  recargar()
}
