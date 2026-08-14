import { useState } from 'react'
import { EJERCICIOS_CON_FOTO, fotoEjercicio } from './data/imagenes'

/**
 * Fotos de inicio y fin de un ejercicio.
 *
 * Vienen de free-exercise-db (dominio público, The Unlicense) y están dentro
 * de la app, no enlazadas: funcionan sin conexión y no dependen de que el
 * repositorio de origen siga en pie.
 *
 * Devuelve null si el ejercicio no tiene foto — en ese caso queda el enlace
 * al video, que ya está arriba en la tarjeta.
 */
export function FotoEjercicio({ exerciseId }: { exerciseId: string }) {
  const [ampliada, setAmpliada] = useState<0 | 1 | null>(null)
  if (!EJERCICIOS_CON_FOTO.has(exerciseId)) return null

  return (
    <>
      <div className="mt-3 rounded-xl bg-[var(--color-surface-2)] p-3">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[var(--color-accent)]">
          Cómo se hace
        </p>
        <div className="flex gap-2">
          {([0, 1] as const).map((i) => (
            <button key={i} onClick={() => setAmpliada(i)} className="flex-1 text-left">
              <img
                src={fotoEjercicio(exerciseId, i)}
                alt={i === 0 ? 'Posición de inicio' : 'Posición final'}
                loading="lazy"
                className="aspect-square w-full rounded-lg object-cover"
              />
              <p className="mt-1 text-center text-[10px] font-semibold uppercase tracking-wider text-[var(--color-ink-dim)]">
                {i === 0 ? 'Inicio' : 'Fin'}
              </p>
            </button>
          ))}
        </div>
        <p className="mt-1 text-center text-[10px] text-[var(--color-ink-dim)]">Toca para ampliar</p>
      </div>

      {ampliada !== null && (
        <div
          onClick={() => setAmpliada(null)}
          className="fixed inset-0 z-[70] flex flex-col items-center justify-center bg-black/92 p-4"
        >
          <img
            src={fotoEjercicio(exerciseId, ampliada)}
            alt={ampliada === 0 ? 'Posición de inicio' : 'Posición final'}
            className="max-h-[70vh] w-full max-w-md rounded-xl object-contain"
          />
          <p className="mt-4 text-sm font-semibold text-white">
            {ampliada === 0 ? 'Posición de inicio' : 'Posición final'}
          </p>
          <div className="mt-4 flex gap-2">
            {([0, 1] as const).map((i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation()
                  setAmpliada(i)
                }}
                className={`rounded-xl px-4 py-2 text-[13px] font-semibold ${
                  ampliada === i ? 'bg-[var(--color-accent)] text-black' : 'bg-white/15 text-white'
                }`}
              >
                {i === 0 ? 'Inicio' : 'Fin'}
              </button>
            ))}
          </div>
          <p className="mt-5 text-[12px] text-white/60">Toca fuera para cerrar</p>
        </div>
      )}
    </>
  )
}
