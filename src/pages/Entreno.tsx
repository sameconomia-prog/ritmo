import { useEffect, useMemo, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { EXERCISES, WORKOUTS, EQUIPO_RECOMENDADO, type WorkoutItem } from '../data/workouts'
import { planDelDia } from '../data/plan'
import { db, hoyISO, setMeta, ultimaSesion } from '../db'
import {
  ajustarPorDeload,
  buscarEntrenosPerdidos,
  esSemanaDeload,
  NOMBRE_DIA_DE,
  semanaDelPrograma,
  sugerirProgresion,
} from '../lib'
import { Btn, Card, Pill, Porque, Section } from '../ui'
import { FotoEjercicio } from '../FotoEjercicio'

export default function Entreno() {
  const fase = useLiveQuery(async () => ((await db.meta.get('fase'))?.value as 1 | 2) ?? 1, []) ?? 1
  const dia = new Date().getDay()
  const bloqueEntreno = planDelDia(dia, fase).find((b) => b.ref?.type === 'entreno')
  const workoutId = bloqueEntreno?.ref?.type === 'entreno' ? bloqueEntreno.ref.workoutId : null
  const [manual, setManual] = useState<string | null>(null)
  const activo = manual ?? workoutId
  const workout = activo ? WORKOUTS[activo] : null

  const inicio = useLiveQuery(async () => (await db.meta.get('inicio'))?.value as string | undefined)
  const semana = inicio ? semanaDelPrograma(inicio) : 1
  const deload = esSemanaDeload(semana)

  /**
   * Detección de entrenos perdidos, a prueba de fallos.
   *
   * La versión anterior usaba `db.sets.orderBy('date').uniqueKeys()` y
   * `db.meta.where('key').startsWith(...)`. Eran las dos únicas consultas de su
   * tipo en toda la app y estaban las dos en esta pantalla — la única que a Sam
   * se le quedaba en negro mientras el resto funcionaba.
   *
   * useLiveQuery RELANZA durante el render cualquier error de la consulta, así
   * que un índice que el navegador no resuelva como se espera no da un aviso:
   * tumba la pantalla entera. Y `where()` sobre una clave primaria es
   * precisamente el terreno donde WebKit y Chromium no siempre coinciden.
   *
   * La tabla meta tiene un puñado de filas y las series son unas pocas por
   * sesión: leerlas enteras y filtrar en memoria cuesta lo mismo, hace lo
   * mismo y no depende de ningún índice. El try/catch es el último seguro:
   * esta tarjeta es una comodidad, y ninguna comodidad debería poder impedirte
   * abrir tu entrenamiento.
   */
  const datosPerdidos = useLiveQuery(async () => {
    try {
      const [sets, metas] = await Promise.all([db.sets.toArray(), db.meta.toArray()])
      return {
        fechasConSeries: new Set(sets.map((s) => s.date)),
        resueltos: new Set(
          metas
            .filter((m) => typeof m.key === 'string' && m.key.startsWith('recuperado:'))
            .map((m) => m.key.slice('recuperado:'.length)),
        ),
      }
    } catch (e) {
      console.error('[RITMO] No se pudieron leer los entrenos perdidos:', e)
      return null
    }
  }, [])

  let perdido: ReturnType<typeof buscarEntrenosPerdidos>[number] | undefined
  try {
    perdido = datosPerdidos
      ? buscarEntrenosPerdidos(fase, datosPerdidos.fechasConSeries, datosPerdidos.resueltos)[0]
      : undefined
  } catch (e) {
    console.error('[RITMO] Fallo al calcular entrenos perdidos:', e)
    perdido = undefined
  }

  if (!workout) {
    return (
      <div className="rise">
        <h1 className="mb-1 text-2xl font-bold">Entrenamiento</h1>
        <p className="mb-6 text-sm text-[var(--color-ink-dim)]">Hoy es día de recuperación.</p>

        {perdido && (
          <Card className="mb-4 border-[var(--color-accent)]/40 bg-[var(--color-accent)]/8 p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-accent)]">
              Se te quedó el entreno del {NOMBRE_DIA_DE(perdido.fecha)}
            </p>
            <p className="mt-1.5 text-[13px] leading-relaxed">
              {WORKOUTS[perdido.workoutId]?.name ?? 'Sesión pendiente'} —{' '}
              {perdido.diasAtras === 1 ? 'de ayer' : `hace ${perdido.diasAtras} días`}. Hoy es día de
              recuperación, así que cabe sin pisarle a nada.
            </p>
            <div className="mt-3 flex gap-2">
              <Btn
                className="flex-1"
                onClick={() => {
                  setMeta(`recuperado:${perdido.fecha}`, hoyISO())
                  setManual(perdido.workoutId)
                }}
              >
                Recuperarlo hoy
              </Btn>
              <Btn
                variant="ghost"
                className="flex-1"
                onClick={() => setMeta(`recuperado:${perdido.fecha}`, 'descartado')}
              >
                Dejarlo ir
              </Btn>
            </div>
            <Porque>
              Reponerlo hoy vale más que esperar al siguiente: dos semanas seguidas con dos sesiones en vez
              de tres es exactamente donde se estanca el progreso. Pero si ya pasaron tres días, la app deja
              de ofrecerlo — a esas alturas recuperarlo solo acumula fatiga sin ganar estímulo.
            </Porque>
          </Card>
        )}

        <Card className="p-5">
          <div className="mb-2 text-3xl">🚶</div>
          <h3 className="font-bold">Hoy no se entrena fuerza. Y eso es parte del programa.</h3>
          <p className="mt-2 text-[13px] leading-relaxed text-[var(--color-ink-dim)]">
            El músculo no crece durante el entrenamiento: crece mientras se repara. Tu tarea de hoy es
            caminata de 45 minutos sin audífonos, movilidad y meditación.
          </p>
          <Porque>
            Descansar no es perder el día: es cuando el músculo se repara. Tus 1 200 m de calentamiento antes
            de entrenar están bien —Panissa et al. 2021 sitúa el umbral de interferencia en 3 km, muy por
            encima—, pero correr como sesión propia todos los días sí era excesivo: Wilson et al. 2012
            encontró que la interferencia crónica escala con la FRECUENCIA del aeróbico. Hoy toca caminata,
            movilidad y meditación, y eso es tan parte del programa como las dominadas.
          </Porque>
        </Card>

        <Section title="Abrir otra sesión">
          <div className="grid grid-cols-2 gap-2">
            {Object.values(WORKOUTS)
              .filter((w) => w.phase === fase)
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

      {deload && (
        <Card className="mb-5 border-sky-500/40 bg-sky-500/8 p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-sky-400">
            Semana {semana} · SEMANA DE DESCARGA
          </p>
          <p className="mt-1.5 text-[13px] leading-relaxed">
            Llevas ocho semanas acumulando fatiga. Esta semana las series bajan un 40 % y te quedas a{' '}
            <strong>3–4 repeticiones del fallo</strong>: ya están ajustadas abajo, no tienes que calcular nada.
            Mismo peso, mismos ejercicios, menos volumen.
          </p>
          <Porque>
            Bajar el pie una semana de cada nueve no te hace perder músculo: la adaptación se conserva
            mientras mantengas la carga, y lo que se disipa es la fatiga que venía enmascarando tu fuerza
            real. La semana 10 vas a levantar más que hoy. Y en codos y hombros, con tanta dominada y fondo,
            esta semana es lo que separa progresar de una tendinitis.
          </Porque>
        </Card>
      )}

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
          <Ejercicio key={item.exerciseId + i} item={item} workoutId={workout.id} orden={i + 1} deload={deload} />
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

function Ejercicio({
  item,
  workoutId,
  orden,
  deload,
}: {
  item: WorkoutItem
  workoutId: string
  orden: number
  deload: boolean
}) {
  const ex = EXERCISES[item.exerciseId]
  const fecha = hoyISO()
  const [abierto, setAbierto] = useState(false)

  // En semana de descarga toda la pantalla trabaja con la prescripción reducida:
  // las pastillas, el conteo de series completas y el temporizador de descanso.
  const rx = ajustarPorDeload(item.rx, deload)

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
  /**
   * CORREGIDO 2026-08-24. El default era `Math.min(4, longitud - 1)`: sin dato
   * guardado, la app te plantaba en el nivel 5 de cada escalera — el MÁXIMO en
   * casi todas — con los escalones de banda asistida tachados como superados.
   * Sam lo dijo exacto: «me pones como si yo ya fuera experto». Un plan de
   * fuerza arranca en el primer escalón: subir desde abajo cuesta una sesión
   * de calibración; arrancar arriba cuesta frustración o una lesión. Tu nivel
   * real se marca con un toque y queda guardado.
   */
  const nivelActual = nivel?.level ?? 0

  const esPesoCorporal = !!ex.progression
  const sugerencia = useMemo(
    () => sugerirProgresion(previas, rx.reps, esPesoCorporal),
    [previas, rx.reps, esPesoCorporal],
  )

  const completo = seriesHoy.length >= rx.sets * (rx.unilateral ? 2 : 1)

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
              {rx.sets} × {rx.reps}
            </Pill>
            <Pill>RIR {rx.rir}</Pill>
            {rx.tempo && <Pill tone="good">{rx.tempo}s de bajada</Pill>}
            <Pill>{rx.rest}s descanso</Pill>
            {rx.unilateral && <Pill>por lado</Pill>}
            {deload && <Pill tone="good">descarga</Pill>}
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

          <FotoEjercicio exerciseId={item.exerciseId} />

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
              <p className="mt-1.5 text-[11px] leading-relaxed text-[var(--color-ink-dim)]">
                Se empieza desde abajo: toca el escalón donde estés HOY (con ayuda cuenta como el escalón de
                ayuda) y la app lo recuerda. Cuando completes el rango en todas las series, sube al siguiente.
              </p>
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

          <Registro item={{ ...item, rx }} workoutId={workoutId} seriesHoy={seriesHoy} />
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
  const [lado, setLado] = useState<'izq' | 'der'>('izq')
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
      ...(item.rx.unilateral ? { side: lado } : {}),
    })
    setReps('')
    if (item.rx.unilateral) {
      // Alterna solo: registras izquierda, queda lista la derecha.
      setLado((l) => (l === 'izq' ? 'der' : 'izq'))
      // El descanso va después de completar AMBOS lados.
      if (lado === 'der') setDescanso(item.rx.rest)
    } else {
      setDescanso(item.rx.rest)
    }
  }

  // Comparación entre lados: revela asimetrías que el trabajo unilateral existe para corregir.
  const porLado = item.rx.unilateral
    ? (['izq', 'der'] as const).map((l) => ({
        lado: l,
        total: seriesHoy.filter((s) => s.side === l).reduce((n, s) => n + s.reps, 0),
        series: seriesHoy.filter((s) => s.side === l).length,
      }))
    : null
  const asimetria =
    porLado && porLado[0].series > 0 && porLado[1].series > 0
      ? Math.abs(porLado[0].total - porLado[1].total)
      : 0

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
              <span className="text-[var(--color-ink-dim)]">
                {s.side ? (s.side === 'izq' ? 'I' : 'D') : `S${i + 1}`}
              </span>{' '}
              {s.reps}
              {s.weightKg ? ` × ${s.weightKg}kg` : ''}
            </button>
          ))}
        </div>
      )}

      {porLado && (
        <div className="mb-2.5 flex items-center gap-2 rounded-xl bg-[var(--color-surface-2)] px-3 py-2 text-[12px]">
          <span className="tabular-nums">
            Izq <strong>{porLado[0].total}</strong> · Der <strong>{porLado[1].total}</strong> reps
          </span>
          {asimetria > 0 && (
            <Pill tone={asimetria >= 3 ? 'warn' : 'neutral'}>
              {asimetria >= 3 ? `${asimetria} de diferencia` : 'equilibrado'}
            </Pill>
          )}
        </div>
      )}

      {item.rx.unilateral && (
        <div className="mb-2 flex gap-1.5">
          {(['izq', 'der'] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLado(l)}
              className={`flex-1 rounded-xl py-2 text-[13px] font-semibold transition ${
                lado === l
                  ? 'bg-[var(--color-accent)] text-black'
                  : 'bg-[var(--color-surface-2)] text-[var(--color-ink-dim)]'
              }`}
            >
              {l === 'izq' ? 'Izquierda' : 'Derecha'}
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
