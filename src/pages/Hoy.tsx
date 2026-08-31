import { useEffect, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { Link, useNavigate } from 'react-router-dom'
import { KIND_META, NOMBRE_DIA, RESUMEN_DIA, planDelDia, type Block } from '../data/plan'
import { RECIPES, MENU_SEMANAL } from '../data/recipes'
import { WORKOUTS } from '../data/workouts'
import { MEDITACIONES, PROTOCOLOS_ESTUDIO, leccionDelDia, ANKI_URL } from '../data/content'
import { asegurarInicio, db, hoyISO, setMeta, toggleBlock, toggleSupplement } from '../db'
import { aMin, bloqueActual, duracionMin, esSemanaDeload, progresoBloque, proximoBloque, semanaDelPrograma, yaTermino } from '../lib'
import { Btn, Card, Pill, Porque, Section } from '../ui'
import { IconAjustes } from '../icons'

export default function Hoy() {
  const navegar = useNavigate()
  const [tick, setTick] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 30_000)
    return () => clearInterval(t)
  }, [])

  // Arranca el contador de semanas solo, sin depender de un botón en Ajustes.
  useEffect(() => {
    asegurarInicio()
  }, [])

  // La fase decide el calendario: Fase 1 entrena Lun/Mié/Vie en casa,
  // Fase 2 pasa a Upper/Lower de gimnasio Lun/Mar/Jue/Vie.
  const fase = useLiveQuery(async () => ((await db.meta.get('fase'))?.value as 1 | 2) ?? 1, []) ?? 1

  const ahora = new Date()
  const dia = ahora.getDay()
  const blocks = planDelDia(dia, fase)
  const fecha = hoyISO()
  const resumen = RESUMEN_DIA[dia]

  const idxActual = bloqueActual(blocks)
  const idxProximo = proximoBloque(blocks)
  const actual = idxActual >= 0 ? blocks[idxActual] : null

  const checks = useLiveQuery(() => db.blockChecks.where('date').equals(fecha).toArray(), [fecha, tick]) ?? []
  const hechos = new Set(checks.filter((c) => c.done).map((c) => c.blockIndex))

  const inicio = useLiveQuery(async () => (await db.meta.get('inicio'))?.value as string | undefined) ?? undefined
  const semana = inicio ? semanaDelPrograma(inicio) : 1

  // Solo cuentan los bloques "accionables" para la barra de avance del día.
  const accionables = blocks
    .map((b, i) => ({ b, i }))
    .filter(({ b }) => !['sueño', 'libre', 'trabajo', 'universidad'].includes(b.kind))
  const completados = accionables.filter(({ i }) => hechos.has(i)).length
  const pct = accionables.length ? Math.round((completados / accionables.length) * 100) : 0

  return (
    <div className="rise">
      {/* Encabezado */}
      <header className="mb-6">
        <div className="flex items-baseline justify-between">
          <div>
            <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-dim)]">
              {NOMBRE_DIA[dia]} · Semana {semana}
              {esSemanaDeload(semana) && <Pill tone="good">descarga</Pill>}
            </p>
            <h1 className="mt-0.5 text-[28px] font-bold leading-tight">{resumen.titulo}</h1>
            <p className="text-sm text-[var(--color-ink-dim)]">{resumen.foco}</p>
          </div>
          <Link
            to="/ajustes"
            aria-label="Ajustes"
            className="rounded-lg p-1.5 text-[var(--color-ink-dim)] active:text-[var(--color-ink)]"
          >
            <IconAjustes />
          </Link>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--color-surface-2)]">
            <div
              className="h-full rounded-full bg-[var(--color-accent)] transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-xs font-semibold tabular-nums text-[var(--color-ink-dim)]">
            {completados}/{accionables.length}
          </span>
        </div>
      </header>

      <AvisoCalendario />

      <RegistroRapido fecha={fecha} />

      {/* AHORA */}
      {actual ? (
        <Section title="Ahora mismo">
          <BloqueAhora block={actual} index={idxActual} fecha={fecha} hecho={hechos.has(idxActual)} semana={semana} dia={dia} />
        </Section>
      ) : null}

      {/* SIGUIENTE */}
      {idxProximo >= 0 && idxProximo !== idxActual && (
        <Section title="A continuación">
          <Card className="flex items-center gap-3 p-4">
            <span className="text-xl">{KIND_META[blocks[idxProximo].kind].icon}</span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{blocks[idxProximo].title}</p>
              <p className="text-xs text-[var(--color-ink-dim)]">
                {blocks[idxProximo].start} — {blocks[idxProximo].end}
              </p>
            </div>
            <Pill>en {minutosHasta(blocks[idxProximo])} min</Pill>
          </Card>
        </Section>
      )}

      {/* LÍNEA DE TIEMPO */}
      <Section title={`Plan del día · ${resumen.kcal} kcal`}>
        <div className="space-y-1.5">
          {blocks.map((b, i) => {
            const esActual = i === idxActual
            const pasado = !esActual && yaTermino(b)
            const hecho = hechos.has(i)
            const meta = KIND_META[b.kind]
            const destino = destinoDeBloque(b)
            return (
              <div
                key={i}
                className={`flex items-start gap-3 rounded-xl border p-3 transition ${
                  esActual
                    ? 'border-[var(--color-accent)]/50 bg-[var(--color-accent)]/8'
                    : 'border-[var(--color-line)] bg-[var(--color-surface)]'
                } ${pasado && !hecho ? 'opacity-45' : ''}`}
              >
                <button
                  onClick={() => toggleBlock(fecha, i)}
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-[11px] transition ${
                    hecho
                      ? 'border-[var(--color-accent)] bg-[var(--color-accent)] text-black'
                      : 'border-[var(--color-line)]'
                  }`}
                  aria-label="Marcar completado"
                >
                  {hecho ? '✓' : ''}
                </button>
                <div className="w-[42px] shrink-0 pt-0.5 text-[11px] font-semibold tabular-nums text-[var(--color-ink-dim)]">
                  {b.start}
                </div>
                <button
                  type="button"
                  disabled={!destino}
                  onClick={() => destino && navegar(destino)}
                  className={`min-w-0 flex-1 text-left ${destino ? 'active:opacity-60' : 'cursor-default'}`}
                >
                  <p className={`flex items-start gap-1.5 text-sm leading-snug ${hecho ? 'text-[var(--color-ink-dim)] line-through' : 'font-medium'}`}>
                    <span>{meta.icon}</span>
                    <span className="flex-1">{b.title}</span>
                    {destino && !hecho && (
                      <span className="mt-px shrink-0 text-[13px] leading-none text-[var(--color-ink-dim)]">›</span>
                    )}
                  </p>
                  {b.detail && !hecho && (
                    <p className="mt-1 text-[12px] leading-relaxed text-[var(--color-ink-dim)]">{b.detail}</p>
                  )}
                </button>
              </div>
            )
          })}
        </div>
      </Section>
    </div>
  )
}

/**
 * El calendario suscrito es lo único que convierte esta app en un asistente que
 * te busca, en vez de una que espera a que te acuerdes de abrirla. Llevaba
 * semanas sin suscribirse porque el botón vivía enterrado en Ajustes: nadie
 * entra a Ajustes por gusto. Ahora el aviso vive en la primera pantalla y no se
 * va hasta que lo resuelvas o lo descartes explícitamente.
 */
function AvisoCalendario() {
  // El valor por defecto tiene que resolverse DENTRO de la consulta: useLiveQuery
  // devuelve undefined mientras carga, así que sin el `?? false` no hay forma de
  // distinguir "todavía no sé" de "no lo ha suscrito" y el aviso no salía nunca.
  const listo = useLiveQuery(async () => ((await db.meta.get('icsListo'))?.value as boolean) ?? false)
  if (listo !== false) return null

  return (
    <Card className="mb-4 border-[var(--color-accent)]/40 bg-[var(--color-accent)]/8 p-4">
      <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-accent)]">
        Tu plan todavía no te avisa
      </p>
      <p className="mt-1.5 text-[13px] leading-relaxed">
        Sin el calendario suscrito, esta app solo funciona cuando te acuerdas de abrirla. Con él, iOS te
        avisa del columpio, del entreno y del licuado aunque no la abras.
      </p>
      <a href="webcal://sameconomia-prog.github.io/ritmo/ritmo.ics" className="mt-3 block">
        <Btn className="w-full">Suscribir ahora · 10 segundos</Btn>
      </a>
      <div className="mt-2 flex gap-2">
        <Link to="/ajustes" className="flex-1">
          <Btn variant="outline" className="w-full">No me abre el botón</Btn>
        </Link>
        <Btn variant="ghost" className="flex-1" onClick={() => setMeta('icsListo', true)}>
          Ya lo suscribí
        </Btn>
      </div>
      <p className="mt-2 text-[11px] leading-relaxed text-[var(--color-ink-dim)]">
        Cuando iOS pregunte si quieres <strong>eliminar las alertas</strong>, di que NO. Si las eliminas, el
        calendario aparece pero nunca te avisa.
      </p>
    </Card>
  )
}

/**
 * Los dos datos que el plan necesita a diario y que antes costaban navegar:
 * el peso, que alimenta el motor de calorías, y la creatina, que solo funciona
 * si se toma TODOS los días (Kreider et al. 2017 — su efecto viene de la
 * saturación muscular sostenida, no de la dosis puntual).
 *
 * El contador de pesajes existe porque el motor de calorías necesita un mínimo
 * de 3 registros para calcular tendencia, y hasta llegar ahí no pasa nada
 * visible: se registra un peso, la app dice gracias, y el objetivo calórico
 * sigue siendo el mismo número estimado de siempre. Sin ver cuánto falta para
 * que algo ocurra, pesarse parece inútil — y deja de hacerse.
 */
function RegistroRapido({ fecha }: { fecha: string }) {
  const [valor, setValor] = useState('')
  const [abierto, setAbierto] = useState(false)
  const peso = useLiveQuery(() => db.weights.get(fecha), [fecha])
  const totalPesajes = useLiveQuery(() => db.weights.count(), []) ?? 0
  const supl = useLiveQuery(() => db.supplements.where('date').equals(fecha).toArray(), [fecha]) ?? []
  const tomados = new Set(supl.filter((s) => s.done).map((s) => s.supp))

  const DIARIOS = [
    { id: 'creatina', label: 'Creatina' },
    { id: 'vitD', label: 'Vit. D3' },
    { id: 'magnesio', label: 'Magnesio' },
  ]

  const faltan = Math.max(0, 3 - totalPesajes)
  const pendiente = !peso

  return (
    <Card
      className={`mb-6 p-3.5 ${
        pendiente ? 'border-[var(--color-accent)]/40 bg-[var(--color-accent)]/5' : ''
      }`}
    >
      <button
        onClick={() => setAbierto((v) => !v)}
        className="flex w-full items-baseline gap-2 text-left"
      >
        <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-ink-dim)]">
          Peso de hoy
        </span>
        {peso ? (
          <span className="text-lg font-bold tabular-nums text-[var(--color-accent)]">{peso.kg} kg</span>
        ) : (
          <span className="text-[13px] font-semibold text-[var(--color-accent)]">registrar →</span>
        )}
      </button>

      {faltan > 0 && (
        <div className="mt-2 flex items-center gap-2">
          <div className="flex shrink-0 gap-1">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={`h-1.5 w-5 rounded-full ${
                  i < totalPesajes ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-surface-2)]'
                }`}
              />
            ))}
          </div>
          <span className="text-[11px] leading-tight text-[var(--color-ink-dim)]">
            {faltan === 3
              ? 'Faltan 3 pesajes para el ajuste automático'
              : `Faltan ${faltan} para el ajuste automático`}
          </span>
        </div>
      )}

      {/*
        Durante dos semanas esta tarjeta insistió en que se pesara sin ofrecer
        salida, y resultó que el problema no era el olvido: no tenía báscula.
        Un recordatorio sin salida solo genera culpa.
      */}
      {totalPesajes === 0 && (
        <Link
          to="/ajustes"
          className="mt-1.5 inline-block text-[11px] font-semibold text-[var(--color-accent)]"
        >
          ¿No tienes báscula? Mira cuál comprar →
        </Link>
      )}

      <div className="mt-2.5 flex gap-1.5">
        {DIARIOS.map((s) => (
          <button
            key={s.id}
            onClick={() => toggleSupplement(fecha, s.id)}
            className={`flex-1 rounded-lg py-2 text-[11px] font-semibold transition ${
              tomados.has(s.id)
                ? 'bg-[var(--color-accent)] text-black'
                : 'bg-[var(--color-surface-2)] text-[var(--color-ink-dim)]'
            }`}
          >
            {tomados.has(s.id) ? '✓ ' : ''}
            {s.label}
          </button>
        ))}
      </div>

      {abierto && (
        <div className="mt-3 flex gap-2">
          <input
            type="number"
            inputMode="decimal"
            step="0.1"
            autoFocus
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            placeholder={peso ? String(peso.kg) : '62.0'}
            className="w-0 flex-1 rounded-xl border border-[var(--color-line)] bg-[var(--color-base)] px-3 py-2.5 text-center text-lg font-bold outline-none focus:border-[var(--color-accent)]"
          />
          <Btn
            disabled={!valor}
            onClick={() => {
              db.weights.put({ date: fecha, kg: Number(valor) })
              setValor('')
              setAbierto(false)
            }}
          >
            Guardar
          </Btn>
        </div>
      )}
    </Card>
  )
}

function minutosHasta(b: Block) {
  const d = new Date()
  const ahora = d.getHours() * 60 + d.getMinutes()
  const s = aMin(b.start)
  return s >= ahora ? s - ahora : s + 1440 - ahora
}

/**
 * A dónde lleva tocar un bloque del plan.
 * Devuelve null si el bloque no tiene una pantalla con más detalle
 * (trabajo, tiempo libre, traslados sin contenido, sueño).
 */
export function destinoDeBloque(b: Block): string | null {
  if (b.kind === 'metricas') return '/progreso'
  const r = b.ref
  if (!r) return null
  switch (r.type) {
    case 'receta':
      return `/comida?slot=${r.slot}`
    case 'entreno':
      return '/entreno'
    case 'meditacion':
      return `/estudio?tab=mente&med=${r.id}`
    case 'ruso':
      return '/estudio?tab=ruso'
    case 'protocolo':
      return '/estudio?tab=doctorado'
  }
}

/** Tarjeta grande y accionable del bloque en curso. */
function BloqueAhora({
  block,
  index,
  fecha,
  hecho,
  semana,
  dia,
}: {
  block: Block
  index: number
  fecha: string
  hecho: boolean
  semana: number
  dia: number
}) {
  const meta = KIND_META[block.kind]
  const pct = progresoBloque(block)
  const restante = Math.max(0, Math.round(duracionMin(block) * (1 - pct / 100)))

  return (
    <Card className={`overflow-hidden p-0 ${!hecho ? 'ring-live' : ''}`}>
      <div className="border-b border-[var(--color-line)] bg-[var(--color-surface-2)] px-4 py-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--color-accent)]">
            {meta.label}
          </span>
          <span className="text-[11px] tabular-nums text-[var(--color-ink-dim)]">
            {block.start} — {block.end} · quedan {restante} min
          </span>
        </div>
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-[var(--color-base)]">
          <div className="h-full bg-[var(--color-accent)] transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start gap-3">
          <span className="text-3xl">{meta.icon}</span>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-bold leading-tight">{block.title}</h3>
            {block.detail && (
              <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--color-ink-dim)]">{block.detail}</p>
            )}
          </div>
        </div>

        <Detalle block={block} semana={semana} dia={dia} />

        <div className="mt-4 flex gap-2">
          <Btn onClick={() => toggleBlock(fecha, index)} variant={hecho ? 'ghost' : 'solid'} className="flex-1">
            {hecho ? '✓ Completado' : 'Marcar como hecho'}
          </Btn>
        </div>
      </div>
    </Card>
  )
}

/** Contenido concreto según el tipo de bloque: aquí el plan deja de ser abstracto. */
function Detalle({ block, semana, dia }: { block: Block; semana: number; dia: number }) {
  const ref = block.ref
  if (!ref) return null

  if (ref.type === 'receta') {
    const id = MENU_SEMANAL[dia]?.[ref.slot as keyof (typeof MENU_SEMANAL)[number]]
    const r = id ? RECIPES[id] : undefined
    if (!r) return null
    return (
      <div className="mt-4 rounded-xl bg-[var(--color-surface-2)] p-3.5">
        <div className="flex items-center justify-between">
          <p className="font-semibold">{r.name}</p>
          <Pill tone="accent">{r.kcal} kcal</Pill>
        </div>
        <p className="mt-1 text-[11px] text-[var(--color-ink-dim)]">
          {r.protein} g proteína · {r.carbs} g carbos · {r.fat} g grasa · {r.time} min
        </p>
        <Link to="/comida" className="mt-3 block">
          <Btn variant="outline" className="w-full">Ver receta completa →</Btn>
        </Link>
      </div>
    )
  }

  if (ref.type === 'entreno') {
    const w = WORKOUTS[ref.workoutId]
    if (!w) return null
    return (
      <div className="mt-4 rounded-xl bg-[var(--color-surface-2)] p-3.5">
        <p className="font-semibold">{w.name}</p>
        <p className="mt-1 text-[11px] text-[var(--color-ink-dim)]">
          {w.focus} · {w.items.length} ejercicios · ~{w.durationMin} min
        </p>
        <Link to="/entreno" className="mt-3 block">
          <Btn className="w-full">Abrir entrenamiento →</Btn>
        </Link>
      </div>
    )
  }

  if (ref.type === 'meditacion') {
    const m = MEDITACIONES[ref.id]
    if (!m) return null
    return (
      <div className="mt-4 rounded-xl bg-[var(--color-surface-2)] p-3.5">
        <p className="font-semibold">{m.nombre} · {m.minutos} min</p>
        <p className="mt-1 text-[12px] text-[var(--color-ink-dim)]">{m.proposito}</p>
        <Link to="/estudio" className="mt-3 block">
          <Btn variant="outline" className="w-full">Iniciar sesión guiada →</Btn>
        </Link>
      </div>
    )
  }

  if (ref.type === 'ruso') {
    const l = leccionDelDia(semana, dia)
    return (
      <div className="mt-4 rounded-xl bg-[var(--color-surface-2)] p-3.5">
        <p className="font-semibold">{l ? l.titulo : 'Sesión de vocabulario'}</p>
        {l && <p className="mt-1 text-[12px] text-[var(--color-ink-dim)]">{l.objetivo}</p>}
        <div className="mt-3 flex gap-2">
          <a href={ANKI_URL} target="_blank" rel="noreferrer" className="flex-1">
            <Btn variant="outline" className="w-full">Anki 3 000 →</Btn>
          </a>
          <Link to="/estudio" className="flex-1">
            <Btn className="w-full">Lección →</Btn>
          </Link>
        </div>
      </div>
    )
  }

  if (ref.type === 'protocolo') {
    const p = PROTOCOLOS_ESTUDIO.find((x) => x.id === ref.id)
    if (!p) return null
    return (
      <div className="mt-4">
        <div className="rounded-xl bg-[var(--color-surface-2)] p-3.5">
          <p className="font-semibold">{p.nombre}</p>
          <ol className="mt-2 space-y-1.5">
            {p.pasos.map((s, i) => (
              <li key={i} className="flex gap-2 text-[12px] leading-relaxed text-[var(--color-ink-dim)]">
                <span className="font-bold text-[var(--color-accent)]">{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
        </div>
        <Porque>{p.porque}</Porque>
      </div>
    )
  }

  return null
}
