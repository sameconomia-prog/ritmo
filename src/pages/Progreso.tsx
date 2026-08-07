import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, hoyISO, type Measurement } from '../db'
import { EXERCISES } from '../data/workouts'
import { calcularNutricion, sugerirAjuste, tendenciaSemanal, calcularRacha } from '../lib'
import { Btn, Card, Empty, Pill, Porque, Section, Stat } from '../ui'

const PERFIL = { altura: 176, edad: 33, factor: 1.55 }

export default function Progreso() {
  const [tab, setTab] = useState<'peso' | 'fuerza' | 'medidas'>('peso')
  const fecha = hoyISO()

  const pesos = useLiveQuery(() => db.weights.toArray(), []) ?? []
  const sets = useLiveQuery(() => db.sets.toArray(), []) ?? []
  const medidas = useLiveQuery(() => db.measurements.toArray(), []) ?? []
  const ajuste = useLiveQuery(async () => ((await db.meta.get('ajuste'))?.value as number) ?? 0) ?? 0

  const ordenados = [...pesos].sort((a, b) => a.date.localeCompare(b.date))
  const actual = ordenados.at(-1)?.kg ?? 62
  const inicial = ordenados[0]?.kg ?? 62
  const tendencia = tendenciaSemanal(pesos)
  const nutricion = calcularNutricion(actual, PERFIL.altura, PERFIL.edad, PERFIL.factor, tendencia, ajuste)
  const sugerido = sugerirAjuste(tendencia, actual)

  const diasEntrenados = [...new Set(sets.map((s) => s.date))]
  const racha = calcularRacha(diasEntrenados)

  return (
    <div className="rise">
      <h1 className="mb-1 text-2xl font-bold">Progreso</h1>
      <p className="mb-5 text-sm text-[var(--color-ink-dim)]">Lo que se mide, se mejora.</p>

      <div className="mb-5 grid grid-cols-3 gap-2">
        <Stat label="Peso" value={`${actual.toFixed(1)}`} sub={`${(actual - inicial >= 0 ? '+' : '')}${(actual - inicial).toFixed(1)} kg total`} />
        <Stat label="Sesiones" value={diasEntrenados.length} sub={`racha ${racha} d`} />
        <Stat label="Series" value={sets.length} sub="registradas" />
      </div>

      <div className="mb-5 flex gap-1.5">
        {(
          [
            ['peso', 'Peso'],
            ['fuerza', 'Fuerza'],
            ['medidas', 'Medidas'],
          ] as const
        ).map(([k, l]) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={`rounded-xl px-3.5 py-2 text-[13px] font-semibold transition ${
              tab === k ? 'bg-[var(--color-accent)] text-black' : 'bg-[var(--color-surface-2)] text-[var(--color-ink-dim)]'
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      {tab === 'peso' && (
        <>
          <RegistroPeso fecha={fecha} />

          {ordenados.length > 1 && <Grafica datos={ordenados.map((w) => ({ x: w.date, y: w.kg }))} />}

          <Section title="Calorías objetivo (se ajustan solas)">
            <Card className="p-4">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-ink-dim)]">
                    Objetivo diario
                  </p>
                  <p className="text-3xl font-bold tabular-nums text-[var(--color-accent)]">
                    {nutricion.objetivo}
                    <span className="text-base text-[var(--color-ink-dim)]"> kcal</span>
                  </p>
                </div>
                {sugerido !== 0 && (
                  <Btn onClick={() => db.meta.put({ key: 'ajuste', value: ajuste + sugerido })}>
                    {sugerido > 0 ? `+${sugerido}` : sugerido} kcal
                  </Btn>
                )}
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                {[
                  ['Proteína', `${nutricion.proteina} g`],
                  ['Carbos', `${nutricion.carbos} g`],
                  ['Grasas', `${nutricion.grasas} g`],
                ].map(([l, v]) => (
                  <div key={l} className="rounded-lg bg-[var(--color-surface-2)] py-2">
                    <p className="text-[10px] uppercase tracking-wider text-[var(--color-ink-dim)]">{l}</p>
                    <p className="text-sm font-bold tabular-nums">{v}</p>
                  </div>
                ))}
              </div>

              <div
                className={`mt-3 rounded-xl border-l-2 p-3 ${
                  sugerido === 0 ? 'border-emerald-500 bg-emerald-500/5' : 'border-[var(--color-accent)] bg-[var(--color-accent)]/5'
                }`}
              >
                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-ink-dim)]">
                  Lectura de la semana
                </p>
                <p className="mt-1 text-[13px] leading-relaxed">{nutricion.nota}</p>
              </div>

              <p className="mt-3 text-[11px] text-[var(--color-ink-dim)]">
                TMB {nutricion.tmb} · TDEE estimado {nutricion.tdee} · ajuste acumulado{' '}
                {ajuste >= 0 ? '+' : ''}
                {ajuste} kcal
              </p>
            </Card>

            <Porque>
              Ninguna fórmula acierta el gasto real de una persona: pueden errar 300 kcal en cualquier
              dirección. Lo que sí es un dato duro es la tendencia de tu peso. Por eso el objetivo calórico se
              corrige solo con la báscula, usando una media móvil de 7 días que filtra el ruido de agua y
              glucógeno. El ritmo buscado es +0.25 a +0.5 % del peso corporal por semana: para ti, 155–310 g.
              Más rápido que eso es grasa, no músculo.
            </Porque>
          </Section>
        </>
      )}

      {tab === 'fuerza' && <Fuerza sets={sets} />}

      {tab === 'medidas' && <Medidas fecha={fecha} medidas={medidas} />}
    </div>
  )
}

function RegistroPeso({ fecha }: { fecha: string }) {
  const [valor, setValor] = useState('')
  const hoy = useLiveQuery(() => db.weights.get(fecha), [fecha])

  return (
    <Card className="mb-5 p-4">
      <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[var(--color-ink-dim)]">
        Peso de hoy · en ayunas, después del baño
      </p>
      <div className="flex gap-2">
        <input
          type="number"
          inputMode="decimal"
          step="0.1"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          placeholder={hoy ? String(hoy.kg) : '62.0'}
          className="w-0 flex-1 rounded-xl border border-[var(--color-line)] bg-[var(--color-base)] px-3 py-2.5 text-center text-lg font-bold outline-none focus:border-[var(--color-accent)]"
        />
        <Btn
          disabled={!valor}
          onClick={() => {
            db.weights.put({ date: fecha, kg: Number(valor) })
            setValor('')
          }}
        >
          Guardar
        </Btn>
      </div>
      {hoy && <p className="mt-2 text-[12px] text-emerald-400">✓ Registrado hoy: {hoy.kg} kg</p>}
    </Card>
  )
}

/** Gráfica SVG mínima, sin dependencias externas. */
function Grafica({ datos }: { datos: { x: string; y: number }[] }) {
  const w = 320
  const h = 130
  const pad = 8
  const ys = datos.map((d) => d.y)
  const min = Math.min(...ys) - 0.4
  const max = Math.max(...ys) + 0.4
  const rango = max - min || 1

  const puntos = datos.map((d, i) => {
    const x = pad + (i / Math.max(1, datos.length - 1)) * (w - pad * 2)
    const y = h - pad - ((d.y - min) / rango) * (h - pad * 2)
    return `${x},${y}`
  })

  return (
    <Card className="mb-5 p-4">
      <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-[var(--color-ink-dim)]">
        Tendencia · {datos.length} registros
      </p>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" preserveAspectRatio="none">
        <polyline
          points={puntos.join(' ')}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {puntos.map((p, i) => {
          const [cx, cy] = p.split(',').map(Number)
          return <circle key={i} cx={cx} cy={cy} r="2.5" fill="var(--color-accent)" />
        })}
      </svg>
      <div className="mt-1 flex justify-between text-[10px] tabular-nums text-[var(--color-ink-dim)]">
        <span>{datos[0].y.toFixed(1)} kg</span>
        <span>{datos.at(-1)!.y.toFixed(1)} kg</span>
      </div>
    </Card>
  )
}

function Fuerza({ sets }: { sets: { exerciseId: string; date: string; reps: number; weightKg: number }[] }) {
  const porEjercicio = sets.reduce<Record<string, typeof sets>>((acc, s) => {
    ;(acc[s.exerciseId] ??= []).push(s)
    return acc
  }, {})

  const entradas = Object.entries(porEjercicio)
  if (!entradas.length) {
    return <Empty icon="⬛" text="Aún no has registrado series. Ve a Entreno y anota tu primera sesión." />
  }

  return (
    <div className="space-y-2.5">
      {entradas.map(([id, lista]) => {
        const ex = EXERCISES[id]
        if (!ex) return null
        const fechas = [...new Set(lista.map((s) => s.date))].sort()
        const primera = lista.filter((s) => s.date === fechas[0])
        const ultima = lista.filter((s) => s.date === fechas.at(-1))
        const volPrimera = primera.reduce((s, x) => s + x.reps * Math.max(1, x.weightKg), 0)
        const volUltima = ultima.reduce((s, x) => s + x.reps * Math.max(1, x.weightKg), 0)
        const delta = volPrimera ? Math.round(((volUltima - volPrimera) / volPrimera) * 100) : 0

        return (
          <Card key={id} className="p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-semibold leading-tight">{ex.name}</p>
                <p className="mt-0.5 text-[11px] text-[var(--color-ink-dim)]">
                  {fechas.length} sesiones · {lista.length} series
                </p>
              </div>
              {fechas.length > 1 && (
                <Pill tone={delta > 0 ? 'good' : delta < 0 ? 'warn' : 'neutral'}>
                  {delta > 0 ? '+' : ''}
                  {delta}%
                </Pill>
              )}
            </div>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {ultima.map((s, i) => (
                <span
                  key={i}
                  className="rounded-lg bg-[var(--color-surface-2)] px-2 py-1 text-[11px] font-semibold tabular-nums"
                >
                  {s.reps}
                  {s.weightKg ? `×${s.weightKg}` : ''}
                </span>
              ))}
            </div>
          </Card>
        )
      })}
    </div>
  )
}

function Medidas({ fecha, medidas }: { fecha: string; medidas: Measurement[] }) {
  const [form, setForm] = useState<Record<string, string>>({})
  const campos: [keyof Omit<Measurement, 'date'>, string][] = [
    ['biceps', 'Bíceps flexionado'],
    ['pecho', 'Pecho'],
    ['cintura', 'Cintura'],
    ['muslo', 'Muslo'],
    ['pantorrilla', 'Pantorrilla'],
  ]
  const ultima = [...medidas].sort((a, b) => a.date.localeCompare(b.date)).at(-1)
  const primera = [...medidas].sort((a, b) => a.date.localeCompare(b.date))[0]

  return (
    <>
      <Card className="mb-4 p-4">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-[var(--color-ink-dim)]">
          Nuevas medidas · cada 2 semanas
        </p>
        <div className="space-y-2">
          {campos.map(([k, label]) => (
            <div key={k} className="flex items-center gap-3">
              <span className="flex-1 text-[13px]">{label}</span>
              <input
                type="number"
                inputMode="decimal"
                step="0.1"
                value={form[k] ?? ''}
                onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                placeholder={ultima?.[k] ? String(ultima[k]) : '—'}
                className="w-20 rounded-lg border border-[var(--color-line)] bg-[var(--color-base)] px-2 py-2 text-center text-sm font-semibold outline-none focus:border-[var(--color-accent)]"
              />
              <span className="w-6 text-[11px] text-[var(--color-ink-dim)]">cm</span>
            </div>
          ))}
        </div>
        <Btn
          className="mt-3 w-full"
          disabled={!Object.values(form).some(Boolean)}
          onClick={() => {
            const row: Record<string, unknown> = { date: fecha }
            for (const [k, v] of Object.entries(form)) if (v) row[k] = Number(v)
            db.measurements.put(row as never)
            setForm({})
          }}
        >
          Guardar medidas
        </Btn>
      </Card>

      {ultima && primera && ultima.date !== primera.date && (
        <Section title="Cambio desde el inicio">
          <div className="space-y-1.5">
            {campos.map(([k, label]) => {
              const a = primera[k] as number | undefined
              const b = ultima[k] as number | undefined
              if (a == null || b == null) return null
              const d = b - a
              return (
                <Card key={k} className="flex items-center justify-between p-3">
                  <span className="text-[13px]">{label}</span>
                  <span className="text-[13px] tabular-nums">
                    {a} → <strong>{b}</strong> cm{' '}
                    <Pill tone={d > 0 ? 'good' : 'neutral'}>
                      {d > 0 ? '+' : ''}
                      {d.toFixed(1)}
                    </Pill>
                  </span>
                </Card>
              )
            })}
          </div>
        </Section>
      )}

      <Porque>
        La báscula miente a corto plazo: el agua y el glucógeno la mueven un kilo en un día. La cinta métrica
        no. Si el muslo y el bíceps suben mientras la cintura casi no se mueve, estás ganando músculo, no
        grasa — sin importar lo que diga la báscula esa mañana.
      </Porque>
    </>
  )
}
