import Dexie, { type Table } from 'dexie'

/** Registro de peso corporal. Clave = fecha ISO "2026-08-07". */
export interface WeightLog {
  date: string
  kg: number
}

/** Una serie registrada en el gimnasio. */
export interface SetLog {
  id?: number
  date: string
  workoutId: string
  exerciseId: string
  setIndex: number
  reps: number
  /** Peso externo en kg (mochila, mancuerna). 0 = peso corporal puro. */
  weightKg: number
  rir: number
  /** Para ejercicios unilaterales. */
  side?: 'izq' | 'der'
}

/** Marca de bloque completado del día. Clave = "2026-08-07|12". */
export interface BlockCheck {
  id: string
  date: string
  blockIndex: number
  done: boolean
}

/** Comida marcada como hecha. Clave = "2026-08-07|desayuno". */
export interface MealCheck {
  id: string
  date: string
  slot: string
  done: boolean
}

export interface SleepLog {
  date: string
  hours: number
  /** 1 = pésimo, 5 = excelente. */
  quality: number
}

export interface StudyLog {
  id?: number
  date: string
  type: 'ruso' | 'doctorado'
  minutes: number
}

export interface Measurement {
  date: string
  biceps?: number
  muslo?: number
  pecho?: number
  cintura?: number
  pantorrilla?: number
}

/** Nivel actual en cada escalera de progresión de peso corporal. */
export interface ProgressionLevel {
  exerciseId: string
  level: number
}

export interface Meta {
  key: string
  value: unknown
}

class RitmoDB extends Dexie {
  weights!: Table<WeightLog, string>
  sets!: Table<SetLog, number>
  blockChecks!: Table<BlockCheck, string>
  mealChecks!: Table<MealCheck, string>
  sleep!: Table<SleepLog, string>
  study!: Table<StudyLog, number>
  measurements!: Table<Measurement, string>
  progressions!: Table<ProgressionLevel, string>
  meta!: Table<Meta, string>

  constructor() {
    super('ritmo')
    this.version(1).stores({
      weights: 'date',
      sets: '++id, date, exerciseId, [date+exerciseId]',
      blockChecks: 'id, date',
      mealChecks: 'id, date',
      sleep: 'date',
      study: '++id, date, type',
      measurements: 'date',
      progressions: 'exerciseId',
      meta: 'key',
    })
  }
}

export const db = new RitmoDB()

// ── Helpers de lectura/escritura ──────────────────────────────

export const hoyISO = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export async function getMeta<T>(key: string, fallback: T): Promise<T> {
  const row = await db.meta.get(key)
  return row ? (row.value as T) : fallback
}

export async function setMeta(key: string, value: unknown) {
  await db.meta.put({ key, value })
}

export async function toggleBlock(date: string, blockIndex: number) {
  const id = `${date}|${blockIndex}`
  const existing = await db.blockChecks.get(id)
  await db.blockChecks.put({ id, date, blockIndex, done: !existing?.done })
}

export async function toggleMeal(date: string, slot: string) {
  const id = `${date}|${slot}`
  const existing = await db.mealChecks.get(id)
  await db.mealChecks.put({ id, date, slot, done: !existing?.done })
}

/** La última vez que hiciste este ejercicio, para saber qué superar hoy. */
export async function ultimaSesion(exerciseId: string): Promise<SetLog[]> {
  const todas = await db.sets.where('exerciseId').equals(exerciseId).toArray()
  if (!todas.length) return []
  const ultimaFecha = todas.map((s) => s.date).sort().at(-1)!
  return todas.filter((s) => s.date === ultimaFecha).sort((a, b) => a.setIndex - b.setIndex)
}

/** Exporta todo a JSON para respaldo manual. */
export async function exportarDatos() {
  const [weights, sets, blockChecks, mealChecks, sleep, study, measurements, progressions, meta] =
    await Promise.all([
      db.weights.toArray(), db.sets.toArray(), db.blockChecks.toArray(),
      db.mealChecks.toArray(), db.sleep.toArray(), db.study.toArray(),
      db.measurements.toArray(), db.progressions.toArray(), db.meta.toArray(),
    ])
  return {
    app: 'ritmo', version: 1, exportedAt: new Date().toISOString(),
    weights, sets, blockChecks, mealChecks, sleep, study, measurements, progressions, meta,
  }
}

export async function importarDatos(data: Awaited<ReturnType<typeof exportarDatos>>) {
  if (data.app !== 'ritmo') throw new Error('Este archivo no es un respaldo de RITMO.')
  await db.transaction('rw', db.tables, async () => {
    await Promise.all([
      db.weights.bulkPut(data.weights), db.sets.bulkPut(data.sets),
      db.blockChecks.bulkPut(data.blockChecks), db.mealChecks.bulkPut(data.mealChecks),
      db.sleep.bulkPut(data.sleep), db.study.bulkPut(data.study),
      db.measurements.bulkPut(data.measurements), db.progressions.bulkPut(data.progressions),
      db.meta.bulkPut(data.meta),
    ])
  })
}
