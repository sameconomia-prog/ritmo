import { planDelDia, type Block } from './data/plan'
import type { WeightLog, SetLog } from './db'

// ── Tiempo ────────────────────────────────────────────────────

export const aMin = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

export const aHora = (min: number) => {
  const m = ((min % 1440) + 1440) % 1440
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`
}

export const minutosAhora = () => {
  const d = new Date()
  return d.getHours() * 60 + d.getMinutes()
}

/**
 * Un bloque puede cruzar la medianoche (ej. 02:15 → 09:45 se escribe con
 * end < start solo si de verdad cruza). Aquí normalizamos.
 */
function rango(b: Block): [number, number] {
  const s = aMin(b.start)
  let e = aMin(b.end)
  if (e <= s) e += 1440
  return [s, e]
}

/**
 * Bloque en curso.
 *
 * Cada día arranca con un bloque comodín "Sueño (viene de anoche)" que cubre
 * desde las 00:00, y termina con los bloques de madrugada reales (snack de
 * caseína, cierre, sueño). A la 01:35 ambos coinciden, así que devolver el
 * primero que encaje mostraba "estás durmiendo" justo cuando tocaba el tvorog
 * —cuatro noches por semana—. Se elige el de INICIO MÁS TARDÍO, que siempre es
 * el más específico; el comodín queda como respaldo cuando no hay nada mejor.
 */
export function bloqueActual(blocks: Block[], ahora = minutosAhora()): number {
  let mejor = -1
  let mejorInicio = -Infinity
  blocks.forEach((b, i) => {
    const [s, e] = rango(b)
    // Ventana dentro del día en curso.
    if (ahora >= s && ahora < e && s > mejorInicio) {
      mejor = i
      mejorInicio = s
    }
    // Ventana abierta ayer que cruzó la medianoche: su inicio real es anterior
    // a cualquier bloque de hoy, así que compite con s − 1440.
    if (e > 1440 && ahora + 1440 >= s && ahora + 1440 < e && s - 1440 > mejorInicio) {
      mejor = i
      mejorInicio = s - 1440
    }
  })
  return mejor
}

/** ¿Este bloque ya terminó? Tiene en cuenta los que cruzan la medianoche. */
export function yaTermino(b: Block, ahora = minutosAhora()): boolean {
  const [s, e] = rango(b)
  if (e > 1440) return false // sigue abierto o pertenece a la madrugada
  return ahora >= e && ahora >= s
}

export function proximoBloque(blocks: Block[], ahora = minutosAhora()): number {
  let mejor = -1
  let menorDelta = Infinity
  blocks.forEach((b, i) => {
    const s = aMin(b.start)
    const delta = s >= ahora ? s - ahora : s + 1440 - ahora
    if (delta > 0 && delta < menorDelta) {
      menorDelta = delta
      mejor = i
    }
  })
  return mejor
}

/** Porcentaje transcurrido del bloque actual, 0–100. */
export function progresoBloque(b: Block, ahora = minutosAhora()): number {
  const [s, e] = rango(b)
  const now = ahora >= s ? ahora : ahora + 1440
  return Math.max(0, Math.min(100, ((now - s) / (e - s)) * 100))
}

export function duracionMin(b: Block): number {
  const [s, e] = rango(b)
  return e - s
}

// ── Motor de nutrición con auto-ajuste ────────────────────────

export interface PerfilNutricional {
  tmb: number
  tdee: number
  objetivo: number
  proteina: number
  carbos: number
  grasas: number
  /** Explicación legible del último ajuste. */
  nota: string
}

/**
 * Mifflin-St Jeor + factor de actividad, y luego AJUSTE POR DATOS REALES.
 *
 * El punto clave: ninguna fórmula acierta el gasto real de una persona. Lo que
 * sí acierta es la tendencia del peso. Por eso el objetivo calórico se corrige
 * solo, cada semana, según lo que marque la báscula.
 *
 * Ritmo objetivo en ectomorfo: +0.25 a +0.5 % del peso corporal por semana.
 * Para 62 kg eso son ~155–310 g/semana. Más rápido que eso es grasa.
 */
export function calcularNutricion(
  pesoKg: number,
  alturaCm: number,
  edad: number,
  factorActividad: number,
  tendenciaSemanalKg: number | null,
  ajusteAcumulado: number,
): PerfilNutricional {
  const tmb = 10 * pesoKg + 6.25 * alturaCm - 5 * edad + 5
  const tdee = tmb * factorActividad
  const base = tdee + 300

  let nota = 'Sin datos de tendencia todavía. Pésate al menos 3 veces esta semana para activar el ajuste automático.'
  if (tendenciaSemanalKg !== null) {
    const objetivoMin = pesoKg * 0.0025
    const objetivoMax = pesoKg * 0.005
    if (tendenciaSemanalKg < objetivoMin) {
      nota = `Subiste ${(tendenciaSemanalKg * 1000).toFixed(0)} g esta semana, por debajo del objetivo (${(objetivoMin * 1000).toFixed(0)}–${(objetivoMax * 1000).toFixed(0)} g). Sube 200 kcal.`
    } else if (tendenciaSemanalKg > objetivoMax) {
      nota = `Subiste ${(tendenciaSemanalKg * 1000).toFixed(0)} g esta semana, por encima del objetivo. Baja 150 kcal para que la ganancia sea magra.`
    } else {
      nota = `Subiste ${(tendenciaSemanalKg * 1000).toFixed(0)} g esta semana. Estás justo en el rango óptimo. No cambies nada.`
    }
  }

  const objetivo = Math.round((base + ajusteAcumulado) / 10) * 10
  const proteina = Math.round(pesoKg * 1.8)
  const grasas = Math.round(pesoKg * 1.1)
  const carbos = Math.round((objetivo - proteina * 4 - grasas * 9) / 4)

  return { tmb: Math.round(tmb), tdee: Math.round(tdee), objetivo, proteina, carbos, grasas, nota }
}

/** Ajuste que la app aplicaría sola, en kcal. */
export function sugerirAjuste(tendenciaSemanalKg: number | null, pesoKg: number): number {
  if (tendenciaSemanalKg === null) return 0
  if (tendenciaSemanalKg < pesoKg * 0.0025) return 200
  if (tendenciaSemanalKg > pesoKg * 0.005) return -150
  return 0
}

/**
 * Tendencia de peso con media móvil, que filtra el ruido diario de agua,
 * glucógeno y contenido intestinal. Compara la media de los últimos 7 días
 * contra la de los 7 anteriores.
 */
export function tendenciaSemanal(pesos: WeightLog[]): number | null {
  if (pesos.length < 4) return null
  const orden = [...pesos].sort((a, b) => a.date.localeCompare(b.date))
  const ultimos = orden.slice(-7)
  const previos = orden.slice(-14, -7)
  if (!previos.length) {
    if (ultimos.length < 4) return null
    const medioA = ultimos.slice(0, Math.floor(ultimos.length / 2))
    const medioB = ultimos.slice(Math.floor(ultimos.length / 2))
    const promA = medioA.reduce((s, w) => s + w.kg, 0) / medioA.length
    const promB = medioB.reduce((s, w) => s + w.kg, 0) / medioB.length
    return promB - promA
  }
  const promU = ultimos.reduce((s, w) => s + w.kg, 0) / ultimos.length
  const promP = previos.reduce((s, w) => s + w.kg, 0) / previos.length
  return promU - promP
}

// ── Motor de progresión de fuerza ─────────────────────────────

export interface Sugerencia {
  texto: string
  tono: 'subir' | 'mantener' | 'nuevo'
}

/**
 * Regla de doble progresión: primero subes repeticiones dentro del rango
 * objetivo; cuando llegas al tope del rango en TODAS las series, subes carga
 * (o de nivel de progresión, si entrenas con peso corporal).
 */
export function sugerirProgresion(
  previas: SetLog[],
  repsObjetivo: string,
  esPesoCorporal: boolean,
): Sugerencia {
  if (!previas.length) {
    return {
      texto: 'Primera vez con este ejercicio. Enfócate solo en la técnica y anota lo que hagas: eso será tu referencia.',
      tono: 'nuevo',
    }
  }

  const mejorSerie = previas.reduce((a, b) => (b.reps > a.reps ? b : a))
  const totalReps = previas.reduce((s, x) => s + x.reps, 0)
  const peso = mejorSerie.weightKg

  const tope = repsObjetivo === 'AMRAP' ? null : Number(repsObjetivo.split('-').at(-1))
  const todasAlTope = tope !== null && previas.every((s) => s.reps >= tope)

  if (repsObjetivo === 'AMRAP') {
    return {
      texto: `La última vez hiciste ${previas.map((s) => s.reps).join(' · ')} (${totalReps} reps totales). Hoy supera ese total, aunque sea por una repetición.`,
      tono: 'subir',
    }
  }

  if (todasAlTope) {
    return esPesoCorporal
      ? {
          texto: `Completaste ${tope} reps en todas las series. Hoy SUBE DE NIVEL en la escalera de progresión, o agrega peso a la mochila.`,
          tono: 'subir',
        }
      : {
          texto: `Completaste ${tope} reps en todas las series con ${peso} kg. Hoy sube a ${peso + 2.5} kg.`,
          tono: 'subir',
        }
  }

  return {
    texto: `Última vez: ${previas.map((s) => `${s.reps}${peso ? `×${peso}kg` : ''}`).join(' · ')}. Hoy busca una repetición más en cada serie${peso ? ` con el mismo peso` : ''}.`,
    tono: 'mantener',
  }
}

// ── Racha de adherencia ───────────────────────────────────────

export function calcularRacha(fechasConActividad: string[]): number {
  if (!fechasConActividad.length) return 0
  const set = new Set(fechasConActividad)
  let racha = 0
  const d = new Date()
  for (;;) {
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    if (set.has(iso)) {
      racha++
      d.setDate(d.getDate() - 1)
    } else if (racha === 0) {
      // Permite que hoy aún no tenga actividad sin romper la racha de ayer.
      d.setDate(d.getDate() - 1)
      const iso2 = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
      if (!set.has(iso2)) return 0
    } else {
      return racha
    }
  }
}

/** Semana del programa desde el arranque, 1-indexada. */
export function semanaDelPrograma(inicioISO: string): number {
  const inicio = new Date(inicioISO + 'T00:00:00')
  const dias = Math.floor((Date.now() - inicio.getTime()) / 86_400_000)
  return Math.max(1, Math.floor(dias / 7) + 1)
}

// ── Descarga (deload) ─────────────────────────────────────────

/**
 * Cada novena semana es de descarga: ocho de acumulación, una de bajar el pie.
 *
 * El programa siempre lo contempló, pero la app no avisaba, así que dependía de
 * que Sam llevara la cuenta él mismo — y nadie lleva esa cuenta ocho semanas
 * seguidas. Una descarga que hay que recordar es una descarga que no ocurre.
 *
 * No es descanso opcional: la fatiga acumulada enmascara la fuerza real y es lo
 * que precede a las lesiones por sobreuso, sobre todo en codos y hombros con
 * tanta dominada y fondo.
 */
export function esSemanaDeload(semana: number): boolean {
  return semana > 0 && semana % 9 === 0
}

/**
 * Prescripción ajustada a la semana de descarga: ~40 % menos series y tres
 * repeticiones más lejos del fallo. Se mantiene la carga y el movimiento —
 * lo que se recorta es el volumen, no la intensidad, para no perder adaptación.
 */
export function ajustarPorDeload<T extends { sets: number; rir: number }>(rx: T, deload: boolean): T {
  if (!deload) return rx
  return { ...rx, sets: Math.max(1, Math.round(rx.sets * 0.6)), rir: rx.rir + 3 }
}

// ── Entrenos perdidos ─────────────────────────────────────────

export interface EntrenoPerdido {
  fecha: string
  workoutId: string
  diasAtras: number
}

/** Ventana de recuperación: pasados 3 días, el entreno ya no se repone, se sigue. */
const DIAS_RECUPERABLES = 3

const isoDe = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

/**
 * Entrenos que tocaban y no ocurrieron, del más reciente al más antiguo.
 *
 * Un plan fijo asume que la vida coopera. Cuando se caía un lunes no había
 * forma de moverlo: el martes la app decía "hoy es día de recuperación" como si
 * nada, y esa sesión se perdía entera. Ahora los días de descanso ofrecen
 * reponerla.
 *
 * Solo se mira hacia atrás 3 días a propósito. Recuperar el entreno de hace una
 * semana no es recuperarlo: es entrenar dos veces seguidas arrastrando fatiga,
 * que es peor que haberlo saltado. Pasada la ventana, se sigue adelante.
 *
 * @param fechasConSeries días que ya tienen series registradas
 * @param resueltos días ya recuperados o descartados a mano
 */
export function buscarEntrenosPerdidos(
  fase: 1 | 2,
  fechasConSeries: Set<string>,
  resueltos: Set<string>,
  hoy = new Date(),
): EntrenoPerdido[] {
  const out: EntrenoPerdido[] = []
  for (let d = 1; d <= DIAS_RECUPERABLES; d++) {
    const f = new Date(hoy)
    f.setDate(f.getDate() - d)
    const iso = isoDe(f)
    if (fechasConSeries.has(iso) || resueltos.has(iso)) continue
    const bloque = planDelDia(f.getDay(), fase).find((b) => b.ref?.type === 'entreno')
    if (bloque?.ref?.type === 'entreno') {
      out.push({ fecha: iso, workoutId: bloque.ref.workoutId, diasAtras: d })
    }
  }
  return out
}

export const NOMBRE_DIA_DE = (iso: string) =>
  ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'][
    new Date(iso + 'T00:00:00').getDay()
  ]
