/**
 * PLAN DIARIO — hora por hora, los 7 días.
 * Zona horaria: NOVOSIBIRSK (UTC+7). Todas las horas son locales de Novosibirsk.
 *
 * EL ENCAJE CON MÉXICO
 * --------------------
 * Novosibirsk va 13 horas adelante de Ciudad de México. Por eso la jornada de
 * trabajo 20:30–01:30 local cubre las 07:30–12:30 mexicanas, y las juntas de la
 * 01:00 caen justo al mediodía de México. El horario nocturno no es un capricho:
 * es la única franja donde el trabajo mexicano y tu vida en Siberia se tocan.
 *
 * DECISIONES DE DISEÑO
 * --------------------
 * 1) ENTRENAMIENTO POR LA MAÑANA.
 *    Grgic et al. 2019 (meta-análisis, 11 estudios): los aumentos de masa
 *    muscular son SIMILARES sin importar la hora del día, y entrenar de mañana
 *    de forma consistente elimina el déficit matinal de fuerza. Sedliak et al.
 *    2018 (11 semanas): hipertrofia 8.8 % mañana vs 11.9 % tarde —diferencia no
 *    significativa— y fuerza +16.9 % mañana vs +15.2 % tarde. La hora que
 *    sostienes durante meses gana a la hora teóricamente óptima.
 *
 * 2) MEDITACIÓN MATINAL EN EL COLUMPIO, AL AIRE LIBRE.
 *    Es el bloque más valioso del día y hace tres cosas a la vez. Ver la
 *    meditación 'columpio' en content.ts para la explicación completa.
 *
 * 3) SUEÑO CONSOLIDADO 7.5 h (02:00–09:30), NO BIFÁSICO.
 *    La hormona del crecimiento se libera sobre todo en los primeros ciclos de
 *    sueño profundo; fragmentar el sueño recorta esa ventana.
 *
 * 4) SIN CLASES TODAVÍA → EL PROYECTO DOCTORAL NECESITA MÁS ESTRUCTURA, NO MENOS.
 *    Cuando no hay horario impuesto, el avance depende por completo de bloques
 *    protegidos. Por eso el proyecto ocupa franjas fijas con entregable definido,
 *    igual que si fueran clases obligatorias.
 *
 * 5) SE ELIMINA LA CARRERA DIARIA.
 *    Wilson et al. 2012: correr —no pedalear— junto con fuerza reduce hipertrofia,
 *    y el daño escala con la FRECUENCIA del aeróbico. Tus 3 h 20 min de baile del fin
 *    de semana ya cubren el trabajo cardiovascular. Martes y jueves: caminata.
 */

import { MENU_SEMANAL, RECIPES } from './recipes'

export type BlockKind =
  | 'sueño' | 'despertar' | 'comida' | 'entreno' | 'movilidad' | 'caminata'
  | 'universidad' | 'trabajo' | 'ruso' | 'doctorado' | 'baile'
  | 'meditacion' | 'libre' | 'prep' | 'cierre' | 'metricas'

export interface Block {
  /** "HH:MM" hora local de Novosibirsk (UTC+7). */
  start: string
  end: string
  kind: BlockKind
  title: string
  detail?: string
  ref?:
    | { type: 'receta'; slot: string }
    | { type: 'entreno'; workoutId: string }
    | { type: 'meditacion'; id: string }
    | { type: 'ruso' }
    | { type: 'protocolo'; id: string }
  flexible?: boolean
  /**
   * Minutos de antelación de la alarma en el calendario suscrito.
   * Solo lo llevan los bloques que de verdad se te pueden pasar: si todo
   * avisara, silenciarías el calendario y no serviría de nada.
   */
  avisar?: number
}

export const KIND_META: Record<BlockKind, { label: string; icon: string; color: string }> = {
  sueño:        { label: 'Sueño',        icon: '🌙', color: 'indigo' },
  despertar:    { label: 'Despertar',    icon: '☀️', color: 'amber' },
  comida:       { label: 'Comida',       icon: '🍽️', color: 'emerald' },
  entreno:      { label: 'Entreno',      icon: '🏋️', color: 'orange' },
  movilidad:    { label: 'Movilidad',    icon: '🤸', color: 'teal' },
  caminata:     { label: 'Caminata',     icon: '🚶', color: 'lime' },
  universidad:  { label: 'Clases',       icon: '🎓', color: 'sky' },
  trabajo:      { label: 'Trabajo',      icon: '💻', color: 'slate' },
  ruso:         { label: 'Ruso',         icon: '🇷🇺', color: 'red' },
  doctorado:    { label: 'Proyecto',     icon: '📖', color: 'violet' },
  baile:        { label: 'Salsa',        icon: '💃', color: 'pink' },
  meditacion:   { label: 'Meditación',   icon: '🧘', color: 'cyan' },
  libre:        { label: 'Libre',        icon: '✨', color: 'zinc' },
  prep:         { label: 'Preparación',  icon: '🧺', color: 'stone' },
  cierre:       { label: 'Cierre',       icon: '🕯️', color: 'purple' },
  metricas:     { label: 'Métricas',     icon: '📊', color: 'blue' },
}

/** Suma minutos a una hora "HH:MM". Mantiene los días cuadrados al cambiar de fase. */
function sumar(hhmm: string, min: number): string {
  const [h, m] = hhmm.split(':').map(Number)
  const t = h * 60 + m + min
  return `${String(Math.floor(t / 60) % 24).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`
}

// ─────────────────────────────────────────────────────────────
// ESTRUCTURA DE UN DÍA
//
// Cada día va de 00:00 a 24:00 en orden cronológico estricto:
//
//   [ cola de la noche anterior ] + [ día ] + [ arranque de la noche ]
//
// Antes, cada día empezaba con un comodín "Sueño (viene de anoche)" de
// 00:00 a la hora de despertar, y además arrastraba al final los bloques de
// madrugada del día siguiente. Los dos se solapaban: a la 01:35 el comodín
// decía "estás durmiendo" justo cuando tocaba el snack de caseína, y ese
// snack es de los pocos hábitos del plan que no se pueden saltar.
// ─────────────────────────────────────────────────────────────

/** Madrugada tras una noche de trabajo (lunes a jueves por la noche). */
const trasNocheTrabajo = (): Block[] => [
  { start: '00:00', end: '01:00', kind: 'trabajo', title: 'Trabajo · bloque 2 (continúa)',
    detail: 'Son las 10:20–12:00 en México.' },
  { start: '01:00', end: '01:30', kind: 'trabajo', title: 'Junta con México',
    detail: 'Mediodía en México: tu franja habitual de juntas. Si hoy no hay, cierra antes y gana sueño.', flexible: true },
  { start: '01:30', end: '01:50', kind: 'comida', title: 'Snack nocturno de caseína', avisar: 0,
    detail: 'El hábito que no se salta: trabaja mientras duermes.', ref: { type: 'receta', slot: 'nocturno' } },
  { start: '01:50', end: '02:00', kind: 'cierre', title: 'Ritual de cierre',
    detail: 'Magnesio 400 mg. Pantallas fuera. Ducha tibia terminando en fría. Cuarto a 18–20 °C, oscuridad total.',
    ref: { type: 'meditacion', id: 'cierre' } },
  { start: '02:00', end: '09:30', kind: 'sueño', title: 'Sueño profundo · 7.5 h',
    detail: 'Aquí es donde crece el músculo, no en el entrenamiento. Dormir menos de 6 h reduce la síntesis proteica ~18 % y la testosterona 10–15 %.' },
]

/** Madrugada del lunes, que viene de la noche del domingo. */
const trasNocheDomingo = (): Block[] => [
  { start: '00:00', end: '01:00', kind: 'libre', title: 'Tiempo personal', flexible: true },
  { start: '01:00', end: '01:20', kind: 'comida', title: 'Snack nocturno de caseína', avisar: 0,
    ref: { type: 'receta', slot: 'nocturno' } },
  { start: '01:20', end: '02:00', kind: 'cierre', title: 'Ritual de cierre',
    detail: 'Hoy vuelve el horario de trabajo. Te acuestas a las 02:00 para retomar el ritmo sin choque.',
    ref: { type: 'meditacion', id: 'cierre' } },
  { start: '02:00', end: '09:30', kind: 'sueño', title: 'Sueño profundo · 7.5 h' },
]

/** El ritual matinal: despertar → parque → columpio → volver. */
const ritualMatinal = (): Block[] => [
  { start: '09:30', end: '09:45', kind: 'despertar', title: 'Despertar sin teléfono', avisar: 0,
    detail: 'Siéntate en la cama. 600 ml de agua. Creatina 5 g + vitamina D3. Nada de pantallas: lo primero que ven tus ojos hoy debe ser luz real, no una notificación.' },
  { start: '09:45', end: '10:00', kind: 'caminata', title: 'Caminata al parque',
    detail: 'Sin audífonos. El trayecto es parte de la práctica.' },
  { start: '10:00', end: '10:30', kind: 'meditacion', title: 'Meditación en el columpio', avisar: 5,
    detail: 'Luz matinal + balanceo rítmico. El bloque más valioso del día para alguien con horario nocturno.',
    ref: { type: 'meditacion', id: 'columpio' } },
  { start: '10:30', end: '10:45', kind: 'caminata', title: 'Regreso caminando' },
  { start: '10:45', end: '11:15', kind: 'comida', title: 'Desayuno', ref: { type: 'receta', slot: 'desayuno' } },
]

const trabajoNoche = (): Block[] => [
  { start: '20:15', end: '20:30', kind: 'prep', title: 'Preparar la jornada de trabajo',
    detail: 'Lista de lo que vas a resolver hoy. Luz BRILLANTE y fría en el escritorio: mantiene la alerta durante la noche y refuerza la separación entre tu día y tu jornada.' },
  { start: '20:30', end: '23:00', kind: 'trabajo', title: 'Trabajo · bloque 1',
    detail: 'Son las 07:30–10:00 en México.' },
  { start: '23:00', end: '23:20', kind: 'libre', title: 'Pausa activa',
    detail: 'Levántate. Camina 5 minutos. Estira cuello y cadera. Un puño de nueces si tienes hambre.' },
  { start: '23:20', end: '00:00', kind: 'trabajo', title: 'Trabajo · bloque 2' },
]

// ── DÍA DE ENTRENO (Lunes · Miércoles · Viernes) ─────────────

const diaEntreno = (
  workoutId: string,
  nombre: string,
  madrugada: Block[],
  /** Fin del entreno. Fase 1 son 65 min en casa; Fase 2, 75 con el gimnasio. */
  fin = '13:20',
): Block[] => [
  ...madrugada,
  ...ritualMatinal(),
  { start: '11:15', end: '12:00', kind: 'ruso', title: 'Ruso · Anki + lección', avisar: 0,
    detail: 'Aprovecha la digestión del desayuno. Cuando termines llevarás una hora despierto y comido: momento ideal para entrenar.',
    ref: { type: 'ruso' } },
  { start: '12:00', end: '12:15', kind: 'prep', title: 'Calentamiento dinámico',
    detail: 'Entrenar de mañana exige un calentamiento un poco más largo: la temperatura corporal aún está subiendo. 5 minutos bien hechos igualan tu rendimiento al de la tarde.' },
  { start: '12:15', end: fin, kind: 'entreno', title: nombre, avisar: 10, ref: { type: 'entreno', workoutId } },
  { start: fin, end: sumar(fin, 30), kind: 'comida', title: 'Batido post-entreno + ducha', ref: { type: 'receta', slot: 'postEntreno' } },
  { start: sumar(fin, 30), end: sumar(fin, 75), kind: 'comida', title: 'Comida principal', ref: { type: 'receta', slot: 'comida' } },
  { start: sumar(fin, 75), end: sumar(fin, 165), kind: 'doctorado', title: 'Proyecto doctoral · bloque profundo', avisar: 5,
    detail: 'Define el entregable ANTES de empezar. Sin clases que te estructuren, este bloque es lo único que hace avanzar la tesis.',
    ref: { type: 'protocolo', id: 'ultradiano' } },
  { start: sumar(fin, 165), end: sumar(fin, 185), kind: 'libre', title: 'Descanso real', detail: 'Sin pantallas. Caminar, mirar por la ventana, estirarte.' },
  { start: sumar(fin, 185), end: sumar(fin, 245), kind: 'doctorado', title: 'Proyecto doctoral · bloque 2', ref: { type: 'protocolo', id: 'pomodoro' } },
  { start: sumar(fin, 245), end: '18:30', kind: 'libre', title: 'Recados / compras / personal', flexible: true },
  { start: '18:30', end: '19:15', kind: 'comida', title: 'Cena', ref: { type: 'receta', slot: 'cena' } },
  { start: '19:15', end: '20:15', kind: 'libre', title: 'Tiempo personal', flexible: true },
  ...trabajoNoche(),
]

// ── DÍA DE RECUPERACIÓN (Martes · Jueves) ────────────────────

const diaRecuperacion = (medId: string): Block[] => [
  ...trasNocheTrabajo(),
  ...ritualMatinal(),
  { start: '11:15', end: '12:00', kind: 'ruso', title: 'Ruso · Anki + lección', avisar: 0, ref: { type: 'ruso' } },
  { start: '12:00', end: '12:45', kind: 'caminata', title: 'Caminata larga · 45 min sin audífonos', avisar: 5,
    detail: 'Esto REEMPLAZA a correr. Recupera sin interferir con la hipertrofia. Sin podcasts ni música: deja que la mente divague, ahí aparecen las ideas del proyecto. Lleva una libreta.',
    ref: { type: 'protocolo', id: 'recuperacion' } },
  { start: '12:45', end: '13:05', kind: 'movilidad', title: 'Movilidad',
    detail: 'Cadera, tobillo, columna torácica y hombro. 3 minutos por zona. Es lo que te mantendrá sin lesiones bailando.' },
  { start: '13:05', end: '13:50', kind: 'comida', title: 'Comida principal', ref: { type: 'receta', slot: 'comida' } },
  { start: '13:50', end: '15:20', kind: 'doctorado', title: 'Proyecto doctoral · bloque profundo', avisar: 5,
    detail: 'Sin entreno hoy, este es tu día de mayor capacidad cognitiva. Úsalo en lo más difícil de la tesis.',
    ref: { type: 'protocolo', id: 'ultradiano' } },
  { start: '15:20', end: '15:40', kind: 'libre', title: 'Descanso real' },
  { start: '15:40', end: '17:10', kind: 'doctorado', title: 'Proyecto doctoral · bloque 2', ref: { type: 'protocolo', id: 'ultradiano' } },
  { start: '17:10', end: '17:30', kind: 'meditacion', title: 'Práctica de recuperación', ref: { type: 'meditacion', id: medId } },
  { start: '17:30', end: '18:30', kind: 'libre', title: 'Recados / compras / personal', flexible: true },
  { start: '18:30', end: '19:15', kind: 'comida', title: 'Cena', ref: { type: 'receta', slot: 'cena' } },
  { start: '19:15', end: '20:15', kind: 'libre', title: 'Tiempo personal', flexible: true },
  ...trabajoNoche(),
]

// ── VIERNES · Entreno C · SIN TRABAJO ────────────────────────

const VIERNES: Block[] = [
  ...trasNocheTrabajo(),
  ...ritualMatinal(),
  { start: '11:15', end: '12:00', kind: 'ruso', title: 'Ruso · Anki + lección', avisar: 0, ref: { type: 'ruso' } },
  { start: '12:00', end: '12:15', kind: 'prep', title: 'Calentamiento dinámico' },
  { start: '12:15', end: '13:20', kind: 'entreno', title: 'Entreno C · Full body volumen', ref: { type: 'entreno', workoutId: 'f1c' } },
  { start: '13:20', end: '13:50', kind: 'comida', title: 'Batido post-entreno + ducha', ref: { type: 'receta', slot: 'postEntreno' } },
  { start: '13:50', end: '14:35', kind: 'comida', title: 'Comida principal', ref: { type: 'receta', slot: 'comida' } },
  { start: '14:35', end: '16:05', kind: 'doctorado', title: 'Proyecto doctoral · bloque profundo', avisar: 5, ref: { type: 'protocolo', id: 'ultradiano' } },
  { start: '16:05', end: '16:25', kind: 'libre', title: 'Descanso real' },
  { start: '16:25', end: '17:25', kind: 'doctorado', title: 'Proyecto doctoral · bloque 2', ref: { type: 'protocolo', id: 'pomodoro' } },
  { start: '17:25', end: '18:45', kind: 'libre', title: 'Tiempo libre', flexible: true },
  { start: '18:45', end: '19:30', kind: 'comida', title: 'Cena', ref: { type: 'receta', slot: 'cena' } },
  { start: '19:30', end: '23:30', kind: 'libre', title: 'Noche libre · sin trabajo',
    detail: 'Tu única noche sin jornada laboral. Úsala: social, cine, descanso. Recuperar la vida también es parte del plan.' },
  { start: '23:30', end: '23:50', kind: 'comida', title: 'Snack nocturno de caseína', avisar: 0, ref: { type: 'receta', slot: 'nocturno' } },
  { start: '23:50', end: '00:00', kind: 'cierre', title: 'Ritual de cierre',
    detail: 'Te acuestas antes porque mañana hay clase a las 11:00 y el traslado es de una hora.',
    ref: { type: 'meditacion', id: 'cierre' } },
]

// ── SÁBADO · Salsa 11–13 ─────────────────────────────────────

const SABADO: Block[] = [
  { start: '00:00', end: '00:30', kind: 'cierre', title: 'Ritual de cierre', ref: { type: 'meditacion', id: 'cierre' } },
  { start: '00:30', end: '07:50', kind: 'sueño', title: 'Sueño · 7.3 h' },
  { start: '07:50', end: '08:05', kind: 'despertar', title: 'Despertar', detail: 'Agua, creatina, vitamina D3. Hoy sales temprano: el traslado a la academia es de una hora.' },
  { start: '08:05', end: '08:50', kind: 'comida', title: 'Desayuno de carga pre-baile',
    detail: 'Terminas 2 h antes de bailar: digestión completa y energía disponible.', ref: { type: 'receta', slot: 'preBaile' } },
  { start: '08:50', end: '09:20', kind: 'meditacion', title: 'Meditación en el columpio', avisar: 5,
    detail: 'La luz matinal del fin de semana es la que impide que tu reloj se desfase. No la saltes por ir con prisa.',
    ref: { type: 'meditacion', id: 'columpio' } },
  { start: '09:20', end: '10:00', kind: 'prep', title: 'Preparación y salida del dormitorio', avisar: 10,
    detail: 'Botella de 700 ml: agua + pizca de sal + jugo de limón. Ropa de cambio. Movilidad de cadera y tobillo 5 min.' },
  { start: '10:00', end: '11:00', kind: 'ruso', title: 'Traslado · 1 h de ruso',
    detail: 'Una hora de camino cada sentido son 2 h semanales de tiempo muerto. Conviértelas en tu mejor bloque de Anki y escucha: no requiere escritorio ni silencio.',
    ref: { type: 'ruso' } },
  { start: '11:00', end: '12:00', kind: 'baile', title: 'Salsa y bachata · academia 1',
    detail: '1 hora de clase. ~350 kcal. Llega 10 min antes para calentar cadera y tobillo.' },
  { start: '12:00', end: '13:00', kind: 'ruso', title: 'Traslado de regreso · escucha en ruso',
    detail: 'Podcast o música rusa. Escucha pasiva, sin exigirte entender todo.', ref: { type: 'ruso' } },
  { start: '13:00', end: '13:45', kind: 'comida', title: 'Comida de recuperación', ref: { type: 'receta', slot: 'comida' } },
  { start: '13:45', end: '15:15', kind: 'libre', title: 'Descanso', flexible: true },
  { start: '15:15', end: '16:45', kind: 'doctorado', title: 'Proyecto doctoral · bloque ligero', flexible: true, ref: { type: 'protocolo', id: 'pomodoro' } },
  { start: '16:45', end: '18:30', kind: 'libre', title: 'Tiempo personal / social', flexible: true },
  { start: '18:30', end: '19:30', kind: 'comida', title: 'Cena', ref: { type: 'receta', slot: 'cena' } },
  { start: '19:30', end: '23:15', kind: 'libre', title: 'Noche libre', flexible: true },
  { start: '23:15', end: '23:35', kind: 'comida', title: 'Snack nocturno de caseína', avisar: 0, ref: { type: 'receta', slot: 'nocturno' } },
  { start: '23:35', end: '00:00', kind: 'cierre', title: 'Ritual de cierre',
    detail: 'Mañana es tu día más largo: sales a las 10:00 y regresas después de las 18:00.',
    ref: { type: 'meditacion', id: 'cierre' } },
]

// ── DOMINGO · Salsa 11–13 y 14:30–17 · Día más exigente ──────

const DOMINGO: Block[] = [
  { start: '00:00', end: '00:10', kind: 'cierre', title: 'Ritual de cierre', ref: { type: 'meditacion', id: 'cierre' } },
  { start: '00:10', end: '07:50', kind: 'sueño', title: 'Sueño · 7.7 h' },
  { start: '07:50', end: '08:05', kind: 'despertar', title: 'Despertar', detail: 'Agua, creatina, vitamina D3.', avisar: 0 },
  { start: '08:05', end: '08:50', kind: 'comida', title: 'Desayuno de carga · día largo de baile',
    detail: 'Hoy bailas 3 h 20 min repartidas en dos academias y pasas 8 horas fuera. Sin esta carga entras en déficit y el baile te consume músculo.',
    ref: { type: 'receta', slot: 'preBaile' } },
  { start: '08:50', end: '09:20', kind: 'meditacion', title: 'Meditación en el columpio', avisar: 5,
    ref: { type: 'meditacion', id: 'columpio' } },
  { start: '09:20', end: '10:00', kind: 'prep', title: 'Preparación y salida del dormitorio', avisar: 10,
    detail: 'Hoy sales por 8 horas: botella de 700 ml con electrolitos, ropa de cambio, y algo de dinero para la comida del mediodía.' },
  { start: '10:00', end: '11:00', kind: 'ruso', title: 'Traslado · 1 h de ruso', ref: { type: 'ruso' } },
  { start: '11:00', end: '12:00', kind: 'baile', title: 'Salsa y bachata · academia 1', detail: '1 hora de clase. ~350 kcal.' },
  { start: '12:00', end: '13:15', kind: 'comida', title: 'Comida en el camino',
    detail: 'Compra algo con proteína y carbohidrato, no solo pan: pollo o pescado con arroz, papa o гречка. Te faltan 2 h 20 min de baile y no puedes entrar en déficit ahora.',
    ref: { type: 'receta', slot: 'comida' } },
  { start: '13:15', end: '14:40', kind: 'ruso', title: 'Traslado a la academia 2 · escucha en ruso',
    detail: 'Si te sobra tiempo, un plátano a las 14:00 te deja con glucógeno fresco para la clase larga.',
    ref: { type: 'ruso' } },
  { start: '14:40', end: '17:00', kind: 'baile', title: 'Salsa · academia 2 · 2 h 20 min',
    detail: 'El bloque más exigente de tu semana. Si a las 16:00 te baja la energía: medio plátano o 4 dátiles.' },
  { start: '17:00', end: '18:00', kind: 'ruso', title: 'Traslado de regreso · escucha en ruso', ref: { type: 'ruso' } },
  { start: '18:00', end: '18:30', kind: 'comida', title: 'Batido de recuperación',
    detail: 'En cuanto llegues al dormitorio. Tras 3 h 20 min de baile, esta es la reposición más urgente del día.',
    ref: { type: 'receta', slot: 'postEntreno' } },
  { start: '18:30', end: '19:00', kind: 'libre', title: 'Ducha y descanso' },
  { start: '19:00', end: '20:00', kind: 'prep', title: 'MEAL PREP de la semana', avisar: 5,
    detail: 'La hora más rentable de tu semana. Estofado de res (3 cenas) + 300 g de гречка + 8 huevos cocidos + verduras cortadas. Te ahorra ~5 horas de lunes a viernes.' },
  { start: '20:00', end: '20:45', kind: 'comida', title: 'Cena', ref: { type: 'receta', slot: 'cena' } },
  { start: '20:45', end: '21:25', kind: 'ruso', title: 'Ruso · auto-test semanal', ref: { type: 'ruso' } },
  { start: '21:25', end: '22:05', kind: 'metricas', title: 'Revisión semanal', avisar: 5,
    detail: 'Peso promedio de la semana, fotos si toca, adherencia. Planea la semana que entra. Aquí se ajusta el plan con datos, no con sensaciones.' },
  { start: '22:05', end: '00:00', kind: 'libre', title: 'Tiempo personal', flexible: true },
]

// ─────────────────────────────────────────────────────────────
// FASE 1 · Peso corporal · Lun · Mié · Vie (full body 3×/semana)
// ─────────────────────────────────────────────────────────────

const FASE_1: Record<number, Block[]> = {
  0: DOMINGO,
  1: diaEntreno('f1a', 'Entreno A · Empuje + Cuádriceps', trasNocheDomingo()),
  2: diaRecuperacion('escaneo'),
  3: diaEntreno('f1b', 'Entreno B · Tracción + Cadena posterior', trasNocheTrabajo()),
  4: diaRecuperacion('nsdr'),
  5: VIERNES,
  6: SABADO,
}

// ─────────────────────────────────────────────────────────────
// FASE 2 · Gimnasio · Lun · Mar · Jue · Vie (Upper/Lower)
//
// Currier et al. 2023: 2 sesiones semanales por grupo muscular es la
// prescripción mejor rankeada para hipertrofia. El orden respeta tu semana:
//  · Lunes EMPUJE, no piernas — el domingo bailas 3 h 20 y llegas con las
//    piernas fatigadas.
//  · Jueves la última sesión de pierna, para llegar al sábado con 48 h de
//    recuperación antes de bailar.
//  · Miércoles queda como día de recuperación activa.
// ─────────────────────────────────────────────────────────────

const FASE_2: Record<number, Block[]> = {
  0: DOMINGO,
  1: diaEntreno('f2ua', 'Empuje · Pecho · Hombros · Tríceps', trasNocheDomingo(), '13:30'),
  2: diaEntreno('f2la', 'Pierna A · Cuádriceps dominante', trasNocheTrabajo(), '13:30'),
  3: diaRecuperacion('escaneo'),
  4: diaEntreno('f2lb', 'Pierna B · Cadena posterior', trasNocheTrabajo(), '13:30'),
  5: VIERNES.map((b) =>
    b.kind === 'entreno'
      ? { ...b, title: 'Tracción · Espalda · Bíceps', ref: { type: 'entreno' as const, workoutId: 'f2ub' } }
      : b,
  ),
  6: SABADO,
}

/**
 * Plan del día según la fase activa.
 *
 * Antes SEMANA era una constante con los entrenos de peso corporal escritos a
 * fuego, así que el selector de fase en Ajustes guardaba el valor pero no
 * cambiaba nada: en septiembre habrías entrado al gimnasio y la app te habría
 * seguido dando flexiones.
 *
 * @param dia 0 = domingo … 6 = sábado (igual que Date.getDay())
 */
export function planDelDia(dia: number, fase: 1 | 2 = 1): Block[] {
  return (fase === 2 ? FASE_2 : FASE_1)[dia]
}

/** Compatibilidad: la Fase 1 sigue siendo el plan por defecto. */
export const SEMANA = FASE_1

export const NOMBRE_DIA = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

/**
 * Calorías del día calculadas a partir del menú real, no escritas a mano.
 * Antes eran dos números independientes y acabaron divergiendo ~300 kcal:
 * el encabezado prometía 2 900 mientras el menú sumaba 3 160. Derivarlo de
 * MENU_SEMANAL hace imposible que se vuelvan a separar.
 */
export function kcalPlaneadas(dia: number): number {
  const menu = MENU_SEMANAL[dia] ?? {}
  return Object.values(menu).reduce((suma, id) => suma + (RECIPES[id]?.kcal ?? 0), 0)
}

export const RESUMEN_DIA: Record<number, { titulo: string; foco: string; kcal: number }> = {
  1: { titulo: 'Entreno A', foco: 'Empuje + Cuádriceps', kcal: kcalPlaneadas(1) },
  2: { titulo: 'Recuperación', foco: 'Caminata · Movilidad · Proyecto', kcal: kcalPlaneadas(2) },
  3: { titulo: 'Entreno B', foco: 'Tracción + Cadena posterior', kcal: kcalPlaneadas(3) },
  4: { titulo: 'Recuperación', foco: 'Caminata · NSDR · Proyecto', kcal: kcalPlaneadas(4) },
  5: { titulo: 'Entreno C', foco: 'Full body · Noche libre', kcal: kcalPlaneadas(5) },
  6: { titulo: 'Salsa 1 h', foco: 'Baile · Traslados · Recuperación', kcal: kcalPlaneadas(6) },
  0: { titulo: 'Salsa 3 h 20', foco: 'Dos academias · Meal prep · Revisión', kcal: kcalPlaneadas(0) },
}

/** Novosibirsk (UTC+7) vs Ciudad de México (UTC−6): 13 horas de diferencia. */
export const HUSO = {
  ciudad: 'Novosibirsk',
  offset: '+07:00',
  difMexico: 13,
  convertirAMexico(hhmm: string): string {
    const [h, m] = hhmm.split(':').map(Number)
    const total = ((h * 60 + m - 13 * 60) % 1440 + 1440) % 1440
    return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`
  },
}
