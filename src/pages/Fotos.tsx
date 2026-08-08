import { useEffect, useMemo, useRef, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, hoyISO, type ProgressPhoto } from '../db'
import { Btn, Card, Empty, Porque } from '../ui'

const POSES = [
  { id: 'frente', label: 'Frente', guia: 'De pie, relajado, brazos a los lados.' },
  { id: 'lado', label: 'Perfil', guia: 'De lado, brazos colgando naturalmente.' },
  { id: 'espalda', label: 'Espalda', guia: 'De espaldas, brazos a los lados.' },
  { id: 'biceps', label: 'Bíceps', guia: 'De frente, ambos brazos flexionados.' },
] as const

type PoseId = (typeof POSES)[number]['id']

/**
 * Comparador de fotos de progreso.
 *
 * Tu meta es visual —que la camisa marque— y la báscula miente a corto plazo:
 * el agua y el glucógeno la mueven un kilo en un día. Las fotos comparadas son
 * el único registro que muestra lo que realmente está pasando, y son lo que
 * sostiene la adherencia cuando llevas tres semanas sin que la báscula se mueva.
 *
 * Todo se queda en IndexedDB: las imágenes nunca salen del teléfono.
 */
export default function Fotos() {
  const [pose, setPose] = useState<PoseId>('frente')
  const fileRef = useRef<HTMLInputElement>(null)
  const fecha = hoyISO()

  const fotos = useLiveQuery(() => db.photos.toArray(), []) ?? []
  const deEstaPose = useMemo(
    () => fotos.filter((f) => f.pose === pose).sort((a, b) => a.date.localeCompare(b.date)),
    [fotos, pose],
  )

  const [izq, setIzq] = useState<number | null>(null)
  const [der, setDer] = useState<number | null>(null)

  // Por defecto compara la primera con la más reciente: el contraste más grande.
  useEffect(() => {
    if (!deEstaPose.length) {
      setIzq(null)
      setDer(null)
      return
    }
    setIzq(deEstaPose[0].id ?? null)
    setDer(deEstaPose.at(-1)?.id ?? null)
  }, [pose, deEstaPose.length])

  async function guardar(file: File) {
    await db.photos.add({ date: fecha, pose, blob: file })
  }

  return (
    <div className="rise">
      <h1 className="mb-1 text-2xl font-bold">Fotos</h1>
      <p className="mb-5 text-sm text-[var(--color-ink-dim)]">
        Cada 2 semanas · misma luz, misma hora, misma pose
      </p>

      <div className="mb-4 flex gap-1.5">
        {POSES.map((p) => (
          <button
            key={p.id}
            onClick={() => setPose(p.id)}
            className={`flex-1 rounded-xl py-2 text-[12px] font-semibold transition ${
              pose === p.id
                ? 'bg-[var(--color-accent)] text-black'
                : 'bg-[var(--color-surface-2)] text-[var(--color-ink-dim)]'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <Card className="mb-5 p-4">
        <p className="text-[13px] leading-relaxed text-[var(--color-ink-dim)]">
          {POSES.find((p) => p.id === pose)!.guia} Junto a una ventana por la mañana, en shorts, con el
          mismo fondo. La consistencia importa más que la calidad de la foto.
        </p>
        <Btn className="mt-3 w-full" onClick={() => fileRef.current?.click()}>
          Tomar foto de hoy
        </Btn>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) guardar(f)
            e.target.value = ''
          }}
        />
      </Card>

      {deEstaPose.length === 0 ? (
        <Empty icon="📷" text="Aún no hay fotos de esta pose. La de hoy es tu punto de partida." />
      ) : (
        <>
          <div className="mb-3 grid grid-cols-2 gap-2">
            <Lado
              titulo="Antes"
              foto={deEstaPose.find((f) => f.id === izq)}
              opciones={deEstaPose}
              onCambiar={setIzq}
            />
            <Lado
              titulo="Después"
              foto={deEstaPose.find((f) => f.id === der)}
              opciones={deEstaPose}
              onCambiar={setDer}
            />
          </div>

          {izq !== null && der !== null && izq !== der && (
            <Card className="mb-5 p-3 text-center">
              <p className="text-[13px] text-[var(--color-ink-dim)]">
                {diasEntre(
                  deEstaPose.find((f) => f.id === izq)!.date,
                  deEstaPose.find((f) => f.id === der)!.date,
                )}{' '}
                días de diferencia
              </p>
            </Card>
          )}

          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-dim)]">
            Todas · {deEstaPose.length}
          </p>
          <div className="grid grid-cols-3 gap-2">
            {deEstaPose.map((f) => (
              <Miniatura key={f.id} foto={f} />
            ))}
          </div>
        </>
      )}

      <Porque>
        La báscula sube y baja un kilo por agua y glucógeno; a tres semanas no te dice nada útil. Las fotos
        sí. Cuando dudes de si el plan funciona, esta pantalla es la respuesta honesta — y en tu caso, donde
        la meta es cómo te queda la camisa, es la métrica que de verdad importa.
      </Porque>
    </div>
  )
}

function diasEntre(a: string, b: string) {
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86_400_000)
}

function useObjectURL(blob?: Blob) {
  const [url, setUrl] = useState<string>()
  useEffect(() => {
    if (!blob) return setUrl(undefined)
    const u = URL.createObjectURL(blob)
    setUrl(u)
    return () => URL.revokeObjectURL(u)
  }, [blob])
  return url
}

function Lado({
  titulo,
  foto,
  opciones,
  onCambiar,
}: {
  titulo: string
  foto?: ProgressPhoto
  opciones: ProgressPhoto[]
  onCambiar: (id: number) => void
}) {
  const url = useObjectURL(foto?.blob)
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-ink-dim)]">
          {titulo}
        </span>
        <span className="text-[10px] tabular-nums text-[var(--color-ink-dim)]">{foto?.date}</span>
      </div>
      <div className="aspect-[3/4] overflow-hidden rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)]">
        {url && <img src={url} alt={titulo} className="h-full w-full object-cover" />}
      </div>
      {opciones.length > 1 && (
        <select
          value={foto?.id ?? ''}
          onChange={(e) => onCambiar(Number(e.target.value))}
          className="mt-1.5 w-full rounded-lg border border-[var(--color-line)] bg-[var(--color-base)] px-2 py-1.5 text-[11px] text-[var(--color-ink)] outline-none"
        >
          {opciones.map((o) => (
            <option key={o.id} value={o.id}>
              {o.date}
            </option>
          ))}
        </select>
      )}
    </div>
  )
}

function Miniatura({ foto }: { foto: ProgressPhoto }) {
  const url = useObjectURL(foto.blob)
  const [confirmar, setConfirmar] = useState(false)
  return (
    <button
      onClick={() => {
        if (confirmar && foto.id) db.photos.delete(foto.id)
        else setConfirmar(true)
      }}
      onBlur={() => setConfirmar(false)}
      className="relative aspect-[3/4] overflow-hidden rounded-lg border border-[var(--color-line)]"
    >
      {url && <img src={url} alt={foto.date} className="h-full w-full object-cover" />}
      <span className="absolute inset-x-0 bottom-0 bg-black/60 py-0.5 text-[9px] tabular-nums text-white">
        {foto.date.slice(5)}
      </span>
      {confirmar && (
        <span className="absolute inset-0 flex items-center justify-center bg-red-500/80 text-[11px] font-bold text-white">
          Tocar para borrar
        </span>
      )}
    </button>
  )
}
