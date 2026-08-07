import { useEffect, useMemo, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { EXERCISES, WORKOUTS, EQUIPO_RECOMENDADO, type WorkoutItem } from '../data/workouts'
import { SEMANA } from '../data/plan'
import { db, hoyISO, ultimaSesion } from '../db'
import { sugerirProgresion } from '../lib'
import { Btn, Card, Pill, Porque, Section } from '../ui'

export default function Entreno() {
  const dia = new Date().getDay()
  const bloqueEntreno = SEMANA[dia].find((b) => b.ref?.type === 'entreno')
  const workoutId = bloqueEntreno?.ref?.type === 'entreno' ? bloqueEntreno.ref.workoutId : null
  const [manual, setManual] = useState<string | null>(null)
  const activo = manual ?? workoutId
  const workout = activo ? WORKOUTS[activo] : null

  if (!workout) {
    return (
      <div className="rise">
        <h1 className="mb-1 text-2xl font-bold">Entrenamiento</h1>
        <p className="mb-6 text-sm text-[var(--color-ink-dim)]">Hoy es día de recuperación.</p>

        <Card className="p-5">
          <div className="mb-2 text-3xl">🚶</div>
          <h3 className="font-bold">Hoy no se entrena fuerza. Y eso es parte del programa.</h3>
          <p className="mt-2 text-[13px] leading-relaxed text-[var(--color-ink-dim)]">
            El músculo no crece durante el entrenamiento: crece mientras se repara. Tu tarea de hoy es
            caminata de 45 minutos sin audífonos, movilidad y meditación.
          </p>
          <Porque>
            Estabas corriendo 1.2 km todos los días. El meta-análisis de Wilson (2012, 21 estudios) encontró
            que combinar fuerza con CARRERA —no con bicicleta— reduce de forma significativa tanto la
            hipertrofia como la fuerza, y que el daño escala con la FRECUENCIA del aeróbico. Sumado a tus
            3 h 20 min de baile, estabas en interferencia máxima. Ese cansancio que sentiste no era falta de
            carácter: era exceso de volumen aeróbico sin recuperación.
          </Porque>
        </Card>

        <Section title="Abrir otra sesión">
          <div className="grid grid-cols-2 gap-2">
            {Object.values(WORKOUTS)
              .filter((w) => w.phase === 1)
              .map((w) => (
                <Card key={w.id} className="p-3" onClick={() => setManual(w.id)}>
                  <p className="text-sm font-semibold">{w.name.replace('Fase 1 · ', '')}</p>
                  <p className="mt-0.5 text-[11px] text-[var(--color-ink-dim)]">{w.focus}</p>
                </Card>
              ))}
          </div>
        </Section>

        <Section title="Equipo que multiplica la Fase 1">
          <div className="space-y-2">
            {EQUIPO_RECOMENDADO.slice(0, 3).map((e) => (
              <Card key={e.item} className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold">{e.item}</p>
                  <Pill tone={e.prioridad === 1 ? 'accent' : 'neutral'}>{e.precio}</Pill>
                </div>
                <p className="mt-0.5 text-[11px] italic text-[var(--color-ink-dim)]">{e.ru} · {e.donde}</p>
                <p className="mt-2 text-[12px] leading-relaxed text-[var(--color-ink-dim)]">{e.porque}</p>
              </Card>
            ))}
          </div>
        </Section>
      </div>
    )
  }

  return (
    <div className="rise">
      <header className="mb-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-accent)]">
              {workout.focus}
            </p>
            <h1 className="text-2xl font-bold">{workout.name}</h1>
          </div>
          {manual && (
            <Btn variant="ghost" onClick={() => setManual(null)}>
              Hoy
            </Btn>
          )}
        </div>
        <p className="mt-1 text-sm text-[var(--color-ink-dim)]">
          {workout.items.length} ejercicios · ~{workout.durationMin} min
        </p>
      </header>

      <Card className="mb-5 p-4">
        <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-accent)]">
          Calentamiento · 5 min
        </p>
        <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--color-ink-dim)]">
          20 sentadillas · 10 zancadas alternadas · 10 bisagras de cadera · 10 círculos de hombro ·
          10 jalones imaginarios. No lo saltes: reduce riesgo de lesión y mejora el rendimiento de la primera serie.
        </p>
      </Card>

      <div className="space-y-4">
        {workout.items.map((item, i) => (
          <Ejercicio key={item.exerciseId + i} item={item} workoutId={workout.id} orden={i + 1} />
        ))}
      </div>

      <Card className="mt-6 p-4">
        <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-accent)]">
          Regla de progresión
        </p>
        <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--color-ink-dim)]">
          Doble progresión: primero subes repeticiones dentro del rango. Cuando llegas al tope del rango en
          TODAS las series, subes carga o de nivel. Con peso corporal las series van a RIR 0–1 (casi al
          fallo): Robinson et al. 2024 mostró que la hipertrofia mejora cuanto más cerca del fallo terminas,
          y con carga baja esa cercanía es el estímulo principal.
        </p>
      </Card>
    </div>
  )
}

function Ejercicio({ item, workoutId, orden }: { item: WorkoutItem; workoutId: string; orden: number }) {
  const ex = EXERCISES[item.exerciseId]
  const fecha = hoyISO()
  const [abierto, setAbierto] = useState(false)

  const seriesHoy =
    useLiveQuery(
      () => db.sets.where('[date+exerciseId]').equals([fecha, item.exerciseId]).toArray(),
      [fecha, item.exerciseId],
    ) ?? []

  const [previas, setPrevias] = useState<Awaited<ReturnType<typeof ultimaSesion>>>([])
  useEffect(() => {
    ultimaSesion(item.exerciseId).then((s) => setPrevias(s.filter((x) => x.date !== fecha)))
  }, [item.exerciseId, fecha, seriesHoy.length])

  const nivel = useLiveQuery(() => db.progressions.get(item.exerciseId), [item.exerciseId])
  const nivelActual = nivel?.level ?? (ex.progression ? Math.min(4, ex.progression.length - 1) : 0)

  const esPesoCorporal = !!ex.progression
  const sugerencia = useMemo(
    () => sugerirProgresion(previas, item.rx.reps, esPesoCorporal),
    [previas, item.rx.reps, esPesoCorporal],
  )

  const completo = seriesHoy.length >= item.rx.sets * (item.rx.unilateral ? 2 : 1)

  return (
    <Card className="overflow-hidden p-0">
      <button
        onClick={() => setAbierto((v) => !v)}
        className="flex w-full items-start gap-3 p-4 text-left"
      >
        <span
          className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold ${
            completo ? 'bg-[var(--color-accent)] text-black' : 'bg-[var(--color-surface-2)] text-[var(--color-ink-dim)]'
          }`}
        >
          {completo ? '✓' : orden}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold leading-tight">{ex.name}</p>
          <p className="mt-0.5 text-[11px] text-[var(--color-ink-dim)]">{ex.muscle}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <Pill tone="accent">
              {item.rx.sets} × {item.rx.reps}
            </Pill>
            <Pill>RIR {item.rx.rir}</Pill>
            <Pill>{item.rx.rest}s descanso</Pill>
            {item.rx.unilateral && <Pill>por lado</Pill>}
          </div>
        </div>
        <span className="mt-1 text-[var(--color-ink-dim)]">{abierto ? '−' : '+'}</span>
      </button>

      {abierto && (
        <div className="border-t border-[var(--color-line)] p-4 pt-3.5">
          <div className="rounded-xl bg-[var(--color-surface-2)] p-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-accent)]">Técnica</p>
            <p className="mt-1 text-[13px] leading-relaxed">{ex.cue}</p>
            {ex.error && (
              <>
                <p className="mt-2.5 text-[10px] font-bold uppercase tracking-wider text-red-400">Error común</p>
                <p className="mt-1 text-[13px] leading-relaxed text-[var(--color-ink-dim)]">{ex.error}</p>
              </>
            )}
            <a
              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(ex.video)}`}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block text-[12px] font-semibold text-[var(--color-accent)]"
            >
              Ver técnica en video →
            </a>
          </div>

          {ex.progression && (
            <div className="mt-3">
              <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--color-ink-dim)]">
                Escalera de progresión · nivel {nivelActual + 1} de {ex.progression.length}
              </p>
              <div className="space-y-1">
                {ex.progression.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => db.progressions.put({ exerciseId: item.exerciseId, level: i })}
                    className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-[12px] transition ${
                      i === nivelActual
                        ? 'bg-[var(--color-accent)]/15 font-semibold text-[var(--color-accent-soft)]'
                        : i < nivelActual
                          ? 'text-[var(--color-ink-dim)] line-through opacity-50'
                          : 'text-[var(--color-ink-dim)]'
                    }`}
                  >
                    <span className="w-4 shrink-0 text-center">{i === nivelActual ? '▶' : i < nivelActual ? '✓' : '○'}</span>
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div
            className={`mt-3 rounded-xl border-l-2 p-3 ${
              sugerencia.tono === 'subir'
                ? 'border-emerald-500 bg-emerald-500/5'
                : sugerencia.tono === 'nuevo'
                  ? 'border-sky-500 bg-sky-500/5'
                  : 'border-[var(--color-accent)] bg-[var(--color-accent)]/5'
            }`}
          >
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-ink-dim)]">
              Objetivo de hoy
            </p>
            <p className="mt-1 text-[13px] leading-relaxed">{sugerencia.texto}</p>
          </div>

          {item.note && (
            <p className="mt-3 text-[12px] italic leading-relaxed text-[var(--color-ink-dim)]">{item.note}</p>
          )}

          <Registro item={item} workoutId={workoutId} seriesHoy={seriesHoy} />
        </div>
      )}
    </Card>
  )
}

function Registro({
  item,
  workoutId,
  seriesHoy,
}: {
  item: WorkoutItem
  workoutId: string
  seriesHoy: { id?: number; setIndex: number; reps: number; weightKg: number; rir: number; side?: string }[]
}) {
  const fecha = hoyISO()
  const [reps, setReps] = useState('')
  const [peso, setPeso] = useState('')
  const [descanso, setDescanso] = useState<number | null>(null)

  useEffect(() => {
    if (descanso === null) return
    if (descanso <= 0) {
      setDescanso(null)
      if ('vibrate' in navigator) navigator.vibrate?.([200, 100, 200])
      return
    }
    const t = setTimeout(() => setDescanso((d) => (d ?? 1) - 1), 1000)
    return () => clearTimeout(t)
  }, [descanso])

  async function guardar() {
    const r = Number(reps)
    if (!r) return
    await db.sets.add({
      date: fecha,
      workoutId,
      exerciseId: item.exerciseId,
      setIndex: seriesHoy.length,
      reps: r,
      weightKg: Number(peso) || 0,
      rir: item.rx.rir,
    })
    setReps('')
    setDescanso(item.rx.rest)
  }

  return (
    <div className="mt-4">
      <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[var(--color-ink-dim)]">
        Registro de hoy
      </p>

      {seriesHoy.length > 0 && (
        <div className="mb-2.5 flex flex-wrap gap-1.5">
          {seriesHoy.map((s, i) => (
            <button
              key={s.id}
              onClick={() => s.id && db.sets.delete(s.id)}
              className="rounded-lg bg-[var(--color-surface-2)] px-2.5 py-1.5 text-[12px] font-semibold tabular-nums"
            >
              <span className="text-[var(--color-ink-dim)]">S{i + 1}</span>{' '}
              {s.reps}
              {s.weightKg ? ` × ${s.weightKg}kg` : ''}
            </button>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="number"
          inputMode="numeric"
          value={reps}
          onChange={(e) => setReps(e.target.value)}
          placeholder="Reps"
          className="w-0 flex-1 rounded-xl border border-[var(--color-line)] bg-[var(--color-base)] px-3 py-2.5 text-center text-base font-semibold outline-none focus:border-[var(--color-accent)]"
        />
        <input
          type="number"
          inputMode="decimal"
          value={peso}
          onChange={(e) => setPeso(e.target.value)}
          placeholder="kg"
          className="w-20 rounded-xl border border-[var(--color-line)] bg-[var(--color-base)] px-3 py-2.5 text-center text-base font-semibold outline-none focus:border-[var(--color-accent)]"
        />
        <Btn onClick={guardar} disabled={!reps}>
          Añadir
        </Btn>
      </div>

      {descanso !== null && (
        <div className="mt-2.5 flex items-center gap-3 rounded-xl bg-[var(--color-accent)]/10 px-3.5 py-2.5">
          <span className="text-lg">⏱</span>
          <div className="flex-1">
            <p className="text-[11px] text-[var(--color-ink-dim)]">Descanso</p>
            <p className="text-xl font-bold tabular-nums text-[var(--color-accent)]">
              {Math.floor(descanso / 60)}:{String(descanso % 60).padStart(2, '0')}
            </p>
          </div>
          <Btn variant="ghost" onClick={() => setDescanso(null)}>
            Saltar
          </Btn>
        </div>
      )}

      <p className="mt-2 text-[11px] text-[var(--color-ink-dim)]">
        Deja el campo de kg vacío si es peso corporal. Toca una serie guardada para borrarla.
      </p>
    </div>
  )
}
