import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { COMPRA_SEMANAL, MENU_SEMANAL, RECIPES, SUPLEMENTOS, type Recipe } from '../data/recipes'
import { RESUMEN_DIA } from '../data/plan'
import { db, hoyISO, toggleMeal } from '../db'
import { Btn, Card, Pill, Porque, Section } from '../ui'

const ORDEN: { slot: string; label: string; hora: string }[] = [
  { slot: 'preBaile', label: 'Desayuno de carga', hora: '08:30' },
  { slot: 'desayuno', label: 'Desayuno', hora: '10:00' },
  { slot: 'comida', label: 'Comida principal', hora: '13:30' },
  { slot: 'postEntreno', label: 'Post-entreno', hora: '16:00' },
  { slot: 'cena', label: 'Cena', hora: '18:15' },
  { slot: 'nocturno', label: 'Snack nocturno', hora: '01:30' },
]

export default function Comida() {
  const [tab, setTab] = useState<'hoy' | 'compra' | 'supl'>('hoy')
  const dia = new Date().getDay()
  const fecha = hoyISO()
  const menu = MENU_SEMANAL[dia] ?? {}

  const checks = useLiveQuery(() => db.mealChecks.where('date').equals(fecha).toArray(), [fecha]) ?? []
  const hechas = new Set(checks.filter((c) => c.done).map((c) => c.slot))

  const comidasHoy = ORDEN.filter((o) => menu[o.slot as keyof typeof menu]).map((o) => ({
    ...o,
    receta: RECIPES[menu[o.slot as keyof typeof menu]!],
  }))

  const total = comidasHoy.reduce(
    (acc, c) => ({
      kcal: acc.kcal + c.receta.kcal,
      p: acc.p + c.receta.protein,
      c: acc.c + c.receta.carbs,
      g: acc.g + c.receta.fat,
    }),
    { kcal: 0, p: 0, c: 0, g: 0 },
  )
  const consumido = comidasHoy
    .filter((c) => hechas.has(c.slot))
    .reduce((acc, c) => acc + c.receta.kcal, 0)

  return (
    <div className="rise">
      <h1 className="mb-1 text-2xl font-bold">Comida</h1>
      <p className="mb-4 text-sm text-[var(--color-ink-dim)]">
        Objetivo de hoy: {RESUMEN_DIA[dia].kcal} kcal
      </p>

      <div className="mb-5 flex gap-1.5">
        {(
          [
            ['hoy', 'Hoy'],
            ['compra', 'Compra'],
            ['supl', 'Suplementos'],
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

      {tab === 'hoy' && (
        <>
          <Card className="mb-5 p-4">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-ink-dim)]">
                  Consumido hoy
                </p>
                <p className="text-3xl font-bold tabular-nums text-[var(--color-accent)]">
                  {consumido}
                  <span className="text-base text-[var(--color-ink-dim)]"> / {total.kcal} kcal</span>
                </p>
              </div>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--color-surface-2)]">
              <div
                className="h-full rounded-full bg-[var(--color-accent)] transition-all duration-500"
                style={{ width: `${total.kcal ? (consumido / total.kcal) * 100 : 0}%` }}
              />
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              {[
                ['Proteína', `${total.p} g`],
                ['Carbos', `${total.c} g`],
                ['Grasas', `${total.g} g`],
              ].map(([l, v]) => (
                <div key={l} className="rounded-lg bg-[var(--color-surface-2)] py-2">
                  <p className="text-[10px] uppercase tracking-wider text-[var(--color-ink-dim)]">{l}</p>
                  <p className="text-sm font-bold tabular-nums">{v}</p>
                </div>
              ))}
            </div>
          </Card>

          <div className="space-y-3">
            {comidasHoy.map((c) => (
              <RecetaCard
                key={c.slot}
                receta={c.receta}
                label={c.label}
                hora={c.hora}
                hecha={hechas.has(c.slot)}
                onToggle={() => toggleMeal(fecha, c.slot)}
              />
            ))}
          </div>

          <Porque>
            La proteína está repartida en 4–5 tomas de ~30–40 g y no concentrada en dos comidas grandes.
            Areta et al. (2013) mostró que esa distribución produce mayor síntesis proteica muscular a lo
            largo del día con la misma cantidad total.
          </Porque>
        </>
      )}

      {tab === 'compra' && (
        <>
          <Card className="mb-4 p-4">
            <p className="text-sm font-semibold">Compra semanal</p>
            <p className="mt-1 text-[13px] leading-relaxed text-[var(--color-ink-dim)]">
              Total aproximado: <strong className="text-[var(--color-accent)]">≈ 6 400 ₽</strong> por semana
              (~70 USD). Los nombres en ruso están para que los busques directamente en la tienda o en la app
              de Пятёрочка.
            </p>
          </Card>
          {COMPRA_SEMANAL.map((sec) => (
            <Section key={sec.seccion} title={sec.seccion}>
              <div className="space-y-1.5">
                {sec.items.map((it) => (
                  <Card key={it.item} className="flex items-center gap-3 p-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-medium">{it.item}</p>
                      <p className="text-[11px] italic text-[var(--color-ink-dim)]">{it.ru}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[12px] font-semibold tabular-nums">{it.qty}</p>
                      <p className="text-[11px] tabular-nums text-[var(--color-ink-dim)]">{it.rub} ₽</p>
                    </div>
                  </Card>
                ))}
              </div>
            </Section>
          ))}
        </>
      )}

      {tab === 'supl' && (
        <div className="space-y-3">
          {SUPLEMENTOS.map((s) => (
            <Card key={s.nombre} className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold">{s.nombre}</p>
                  <p className="text-[11px] italic text-[var(--color-ink-dim)]">{s.ru}</p>
                </div>
                <Pill tone={s.prioridad <= 3 ? 'accent' : 'neutral'}>
                  {s.prioridad <= 3 ? 'Esencial' : 'Opcional'}
                </Pill>
              </div>
              <div className="mt-3 space-y-1.5 text-[13px]">
                <p>
                  <span className="text-[var(--color-ink-dim)]">Dosis:</span> {s.dosis}
                </p>
                <p>
                  <span className="text-[var(--color-ink-dim)]">Cuándo:</span> {s.cuando}
                </p>
                <p className="text-[var(--color-ink-dim)]">{s.precio}</p>
              </div>
              <Porque>{s.porque}</Porque>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

function RecetaCard({
  receta,
  label,
  hora,
  hecha,
  onToggle,
}: {
  receta: Recipe
  label: string
  hora: string
  hecha: boolean
  onToggle: () => void
}) {
  const [abierto, setAbierto] = useState(false)
  return (
    <Card className="overflow-hidden p-0">
      <div className="flex items-start gap-3 p-4">
        <button
          onClick={onToggle}
          className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[12px] transition ${
            hecha ? 'border-[var(--color-accent)] bg-[var(--color-accent)] text-black' : 'border-[var(--color-line)]'
          }`}
        >
          {hecha ? '✓' : ''}
        </button>
        <button onClick={() => setAbierto((v) => !v)} className="min-w-0 flex-1 text-left">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-ink-dim)]">
            {hora} · {label}
          </p>
          <p className={`mt-0.5 font-semibold leading-tight ${hecha ? 'line-through opacity-50' : ''}`}>
            {receta.name}
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <Pill tone="accent">{receta.kcal} kcal</Pill>
            <Pill>{receta.protein} g prot</Pill>
            <Pill>{receta.time} min</Pill>
            {receta.costRub && <Pill>{receta.costRub} ₽</Pill>}
          </div>
        </button>
        <button onClick={() => setAbierto((v) => !v)} className="mt-1 text-[var(--color-ink-dim)]">
          {abierto ? '−' : '+'}
        </button>
      </div>

      {abierto && (
        <div className="border-t border-[var(--color-line)] p-4 pt-3.5">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[var(--color-accent)]">
            Ingredientes
          </p>
          <div className="space-y-1">
            {receta.ingredients.map((ing, i) => (
              <div key={i} className="flex items-baseline justify-between gap-3 text-[13px]">
                <span>
                  {ing.item}
                  {ing.ru && <span className="ml-1.5 text-[11px] italic text-[var(--color-ink-dim)]">{ing.ru}</span>}
                </span>
                <span className="shrink-0 font-semibold tabular-nums text-[var(--color-ink-dim)]">{ing.qty}</span>
              </div>
            ))}
          </div>

          <p className="mb-2 mt-4 text-[10px] font-bold uppercase tracking-wider text-[var(--color-accent)]">
            Preparación
          </p>
          <ol className="space-y-2">
            {receta.steps.map((s, i) => (
              <li key={i} className="flex gap-2.5 text-[13px] leading-relaxed">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[var(--color-surface-2)] text-[11px] font-bold text-[var(--color-accent)]">
                  {i + 1}
                </span>
                {s}
              </li>
            ))}
          </ol>

          {receta.tip && (
            <div className="mt-3.5 rounded-xl bg-[var(--color-surface-2)] p-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-ink-dim)]">Truco</p>
              <p className="mt-1 text-[13px] leading-relaxed">{receta.tip}</p>
            </div>
          )}

          {receta.why && <Porque>{receta.why}</Porque>}

          <Btn variant="ghost" className="mt-3 w-full" onClick={() => setAbierto(false)}>
            Cerrar
          </Btn>
        </div>
      )}
    </Card>
  )
}
