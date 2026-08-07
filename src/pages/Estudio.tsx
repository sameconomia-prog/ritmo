import { useEffect, useRef, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { useSearchParams } from 'react-router-dom'
import {
  ANKI_URL,
  MEDITACIONES,
  PROTOCOLOS_ESTUDIO,
  leccionDelDia,
  type Meditacion,
} from '../data/content'
import { db, hoyISO } from '../db'
import { semanaDelPrograma } from '../lib'
import { Btn, Card, Pill, Porque } from '../ui'

export default function Estudio() {
  const [params] = useSearchParams()
  // Al llegar desde el plan del día, abre la pestaña y la práctica que tocaba.
  const tabPedida = params.get('tab') as 'ruso' | 'mente' | 'doctorado' | null
  const medPedida = params.get('med')
  const [tab, setTab] = useState<'ruso' | 'mente' | 'doctorado'>(
    tabPedida && ['ruso', 'mente', 'doctorado'].includes(tabPedida) ? tabPedida : 'ruso',
  )
  const dia = new Date().getDay()
  const inicio = useLiveQuery(async () => (await db.meta.get('inicio'))?.value as string | undefined)
  const semana = inicio ? semanaDelPrograma(inicio) : 1
  const leccion = leccionDelDia(semana, dia)

  return (
    <div className="rise">
      <h1 className="mb-1 text-2xl font-bold">Estudio</h1>
      <p className="mb-4 text-sm text-[var(--color-ink-dim)]">Mente y alma · Semana {semana}</p>

      <div className="mb-5 flex gap-1.5">
        {(
          [
            ['ruso', '🇷🇺 Ruso'],
            ['mente', '🧘 Mente'],
            ['doctorado', '📖 Doctorado'],
          ] as const
        ).map(([k, l]) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={`rounded-xl px-3 py-2 text-[13px] font-semibold transition ${
              tab === k ? 'bg-[var(--color-accent)] text-black' : 'bg-[var(--color-surface-2)] text-[var(--color-ink-dim)]'
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      {tab === 'ruso' && (
        <>
          <Card className="mb-4 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">Vocabulario · 3 000 palabras</p>
                <p className="mt-0.5 text-[12px] text-[var(--color-ink-dim)]">
                  Tu app con repetición espaciada FSRS. 15 minutos diarios, sin excepción.
                </p>
              </div>
            </div>
            <a href={ANKI_URL} target="_blank" rel="noreferrer" className="mt-3 block">
              <Btn className="w-full">Abrir Russkiy SRS →</Btn>
            </a>
          </Card>

          {leccion ? (
            <Card className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-accent)]">
                    Lección del día · {leccion.tipo}
                  </p>
                  <h3 className="mt-0.5 text-lg font-bold leading-tight">{leccion.titulo}</h3>
                </div>
                <Pill>{leccion.minutos} min</Pill>
              </div>
              <p className="mt-2 text-[13px] leading-relaxed text-[var(--color-ink-dim)]">{leccion.objetivo}</p>

              <ol className="mt-4 space-y-2.5">
                {leccion.pasos.map((p, i) => (
                  <li key={i} className="flex gap-2.5 text-[13px] leading-relaxed">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[var(--color-surface-2)] text-[11px] font-bold text-[var(--color-accent)]">
                      {i + 1}
                    </span>
                    {p}
                  </li>
                ))}
              </ol>

              {leccion.frases && (
                <div className="mt-4">
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[var(--color-ink-dim)]">
                    Frases que debes poder decir hoy
                  </p>
                  <div className="space-y-2">
                    {leccion.frases.map((f, i) => (
                      <div key={i} className="rounded-xl bg-[var(--color-surface-2)] p-3">
                        <p className="text-base font-semibold">{f.ru}</p>
                        <p className="text-[12px] italic text-[var(--color-accent-soft)]">{f.tr}</p>
                        <p className="mt-0.5 text-[12px] text-[var(--color-ink-dim)]">{f.es}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <RegistroEstudio tipo="ruso" minutos={leccion.minutos} />
            </Card>
          ) : (
            <Card className="p-5 text-center text-sm text-[var(--color-ink-dim)]">
              Hoy solo toca la sesión de vocabulario.
            </Card>
          )}

          <Porque>
            El currículo va por FUNCIÓN, no por tablas de memorización. Aprendes cada caso cuando lo
            necesitas para decir algo real: acusativo para pedir comida, preposicional para decir dónde vives,
            genitivo para negar y comprar por cantidades. Es la ruta más rápida de A0 a A2 cuando ya vives en
            el país y tienes contexto diario.
          </Porque>
        </>
      )}

      {tab === 'mente' && (
        <div className="space-y-3">
          {Object.values(MEDITACIONES).map((m) => (
            <MeditacionCard key={m.id} med={m} destacada={m.id === medPedida} />
          ))}
        </div>
      )}

      {tab === 'doctorado' && (
        <div className="space-y-3">
          {PROTOCOLOS_ESTUDIO.map((p) => (
            <Card key={p.id} className="p-4">
              <p className="font-semibold">{p.nombre}</p>
              <p className="mt-0.5 text-[12px] text-[var(--color-ink-dim)]">{p.cuando}</p>
              <ol className="mt-3 space-y-2">
                {p.pasos.map((s, i) => (
                  <li key={i} className="flex gap-2.5 text-[13px] leading-relaxed">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[var(--color-surface-2)] text-[11px] font-bold text-[var(--color-accent)]">
                      {i + 1}
                    </span>
                    {s}
                  </li>
                ))}
              </ol>
              <Porque>{p.porque}</Porque>
            </Card>
          ))}
          <RegistroEstudio tipo="doctorado" minutos={90} />
        </div>
      )}
    </div>
  )
}

function RegistroEstudio({ tipo, minutos }: { tipo: 'ruso' | 'doctorado'; minutos: number }) {
  const fecha = hoyISO()
  const hoy =
    useLiveQuery(async () => {
      const rows = await db.study.where('date').equals(fecha).toArray()
      return rows.filter((r) => r.type === tipo).reduce((s, r) => s + r.minutes, 0)
    }, [fecha, tipo]) ?? 0

  return (
    <div className="mt-4 flex items-center gap-3 rounded-xl bg-[var(--color-surface-2)] p-3">
      <div className="flex-1">
        <p className="text-[11px] text-[var(--color-ink-dim)]">Registrado hoy</p>
        <p className="text-lg font-bold tabular-nums text-[var(--color-accent)]">{hoy} min</p>
      </div>
      <Btn variant="outline" onClick={() => db.study.add({ date: fecha, type: tipo, minutes: minutos })}>
        +{minutos} min
      </Btn>
    </div>
  )
}

function MeditacionCard({ med, destacada }: { med: Meditacion; destacada?: boolean }) {
  const [activo, setActivo] = useState(false)
  const [paso, setPaso] = useState(0)
  const [seg, setSeg] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!destacada) return
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [destacada])

  useEffect(() => {
    if (!activo) return
    const guion = med.guion[paso]
    if (!guion) {
      setActivo(false)
      if ('vibrate' in navigator) navigator.vibrate?.([300, 150, 300])
      return
    }
    if (seg >= guion.segundos) {
      setPaso((p) => p + 1)
      setSeg(0)
      return
    }
    const t = setTimeout(() => setSeg((s) => s + 1), 1000)
    return () => clearTimeout(t)
  }, [activo, paso, seg, med.guion])

  const guion = med.guion[paso]
  const totalSeg = med.guion.reduce((s, g) => s + g.segundos, 0)
  const transcurrido = med.guion.slice(0, paso).reduce((s, g) => s + g.segundos, 0) + seg

  if (activo && guion) {
    return (
      <Card className="p-6 text-center">
        <div className="mb-4 h-1 overflow-hidden rounded-full bg-[var(--color-surface-2)]">
          <div
            className="h-full bg-[var(--color-accent)] transition-all duration-1000"
            style={{ width: `${(transcurrido / totalSeg) * 100}%` }}
          />
        </div>
        <p className="mb-1 text-[11px] uppercase tracking-wider text-[var(--color-ink-dim)]">
          {med.nombre} · paso {paso + 1} de {med.guion.length}
        </p>
        <p className="my-6 text-lg leading-relaxed">{guion.texto}</p>
        <p className="mb-5 text-3xl font-bold tabular-nums text-[var(--color-accent)]">
          {Math.max(0, guion.segundos - seg)}
        </p>
        <div className="flex gap-2">
          <Btn variant="ghost" className="flex-1" onClick={() => { setPaso((p) => p + 1); setSeg(0) }}>
            Siguiente
          </Btn>
          <Btn variant="outline" className="flex-1" onClick={() => { setActivo(false); setPaso(0); setSeg(0) }}>
            Terminar
          </Btn>
        </div>
      </Card>
    )
  }

  return (
    <Card ref={ref} className={`p-4 ${destacada ? 'border-[var(--color-accent)]/50' : ''}`}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold">{med.nombre}</p>
          <p className="mt-0.5 text-[12px] text-[var(--color-ink-dim)]">{med.cuando}</p>
        </div>
        <Pill tone="accent">{med.minutos} min</Pill>
      </div>
      <p className="mt-2 text-[13px] leading-relaxed">{med.proposito}</p>
      {med.ciencia && <Porque>{med.ciencia}</Porque>}
      <Btn className="mt-3 w-full" onClick={() => { setActivo(true); setPaso(0); setSeg(0) }}>
        Iniciar sesión guiada
      </Btn>
    </Card>
  )
}
