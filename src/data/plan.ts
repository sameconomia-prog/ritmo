/**
 * PLAN DIARIO — hora por hora, los 7 días.
 *
 * DECISIONES DE DISEÑO
 * --------------------
 * 1) SUEÑO CONSOLIDADO, NO BIFÁSICO.
 *    Tu trabajo (Lun–Jue, ~5 h para México, con juntas cerca de la 01:00) fija
 *    el final del día alrededor de las 01:30. En vez de partir el sueño en dos
 *    bloques, lo consolidamos en 7.5 h continuas (02:15–09:45). Motivo: la
 *    hormona del crecimiento se libera sobre todo en los primeros ciclos de
 *    sueño profundo; fragmentarlo recorta esa ventana. Un bloque continuo de
 *    7.5 h supera a 5.5 + 2 h partidas.
 *
 * 2) ENTRENAMIENTO 3×/SEMANA (Lun · Mié · Vie), NO DIARIO.
 *    Currier et al. 2023: multi-serie 2×/semana por grupo muscular es la
 *    prescripción mejor rankeada para hipertrofia. Full-body 3× te da 3
 *    estímulos semanales por grupo, ideal como principiante.
 *
 * 3) SE ELIMINA LA CARRERA DIARIA.
 *    Wilson et al. 2012: correr (no pedalear) junto con fuerza reduce
 *    hipertrofia y fuerza, y el daño escala con la FRECUENCIA del aeróbico.
 *    Tus 6.5 h de salsa del fin de semana ya cubren de sobra el trabajo
 *    cardiovascular. Martes y jueves se sustituye la carrera por CAMINATA:
 *    aporta recuperación y gasto sin interferir con la construcción muscular.
 *
 * 4) MARTES Y JUEVES SON DÍAS DE RECUPERACIÓN, NO DÍAS PERDIDOS.
 *    El músculo no crece entrenando: crece reparándose. Esos días llevan
 *    caminata, movilidad, meditación y estudio profundo.
 */

export type BlockKind =
  | 'sueño' | 'despertar' | 'comida' | 'entreno' | 'movilidad' | 'caminata'
  | 'universidad' | 'trabajo' | 'ruso' | 'doctorado' | 'baile'
  | 'meditacion' | 'libre' | 'prep' | 'cierre' | 'metricas'

export interface Block {
  /** "HH:MM" en formato 24 h. */
  start: string
  end: string
  kind: BlockKind
  title: string
  detail?: string
  /** Enlace al contenido concreto que toca en este bloque. */
  ref?:
    | { type: 'receta'; slot: string }
    | { type: 'entreno'; workoutId: string }
    | { type: 'meditacion'; id: string }
    | { type: 'ruso' }
    | { type: 'protocolo'; id: string }
  /** Se puede mover o saltar sin romper el plan. */
  flexible?: boolean
}

export const KIND_META: Record<BlockKind, { label: string; icon: string; color: string }> = {
  sueño:        { label: 'Sueño',        icon: '🌙', color: 'indigo' },
  despertar:    { label: 'Despertar',    icon: '☀️', color: 'amber' },
  comida:       { label: 'Comida',       icon: '🍽️', color: 'emerald' },
  entreno:      { label: 'Entreno',      icon: '🏋️', color: 'orange' },
  movilidad:    { label: 'Movilidad',    icon: '🤸', color: 'teal' },
  caminata:     { label: 'Caminata',     icon: '🚶', color: 'lime' },
  universidad:  { label: 'Universidad',  icon: '🎓', color: 'sky' },
  trabajo:      { label: 'Trabajo',      icon: '💻', color: 'slate' },
  ruso:         { label: 'Ruso',         icon: '🇷🇺', color: 'red' },
  doctorado:    { label: 'Doctorado',    icon: '📖', color: 'violet' },
  baile:        { label: 'Salsa',        icon: '💃', color: 'pink' },
  meditacion:   { label: 'Meditación',   icon: '🧘', color: 'cyan' },
  libre:        { label: 'Libre',        icon: '✨', color: 'zinc' },
  prep:         { label: 'Preparación',  icon: '🧺', color: 'stone' },
  cierre:       { label: 'Cierre',       icon: '🕯️', color: 'purple' },
  metricas:     { label: 'Métricas',     icon: '📊', color: 'blue' },
}

// ── Bloques compartidos ──────────────────────────────────────

const despertar = (): Block[] => [
  { start: '09:45', end: '10:00', kind: 'despertar', title: 'Despertar sin teléfono',
    detail: 'Siéntate en la cama. 600 ml de agua. Creatina 5 g + vitamina D3. Abre las cortinas y recibe luz natural 2 minutos: eso arranca tu reloj circadiano.',
    ref: { type: 'meditacion', id: 'intencion' } },
]

const universidad = (): Block[] => [
  { start: '10:30', end: '10:45', kind: 'prep', title: 'Traslado a la universidad', flexible: true },
  { start: '10:45', end: '13:30', kind: 'universidad', title: 'Universidad / doctorado' },
]

const trabajoNoche = (): Block[] => [
  { start: '19:00', end: '19:30', kind: 'prep', title: 'Preparar la jornada de trabajo',
    detail: 'Lista de lo que vas a resolver hoy. Luz brillante en el escritorio: mantiene la alerta y refuerza la separación día/noche.' },
  { start: '19:30', end: '22:00', kind: 'trabajo', title: 'Trabajo · bloque 1' },
  { start: '22:00', end: '22:20', kind: 'libre', title: 'Pausa activa',
    detail: 'Levántate. Camina 5 minutos. Estira cuello y cadera. Un puño de nueces si tienes hambre.' },
  { start: '22:20', end: '00:45', kind: 'trabajo', title: 'Trabajo · bloque 2' },
  { start: '00:45', end: '01:30', kind: 'trabajo', title: 'Junta / cierre de pendientes',
    detail: 'Tu franja habitual de juntas con México. Si hoy no hay, cierra antes y gana sueño.', flexible: true },
]

const cierreNoche = (bed: string, sleepEnd: string): Block[] => [
  { start: '01:30', end: '01:50', kind: 'comida', title: 'Snack nocturno de caseína',
    detail: 'El hábito que no se salta: trabaja mientras duermes.', ref: { type: 'receta', slot: 'nocturno' } },
  { start: '01:50', end: bed, kind: 'cierre', title: 'Ritual de cierre',
    detail: 'Magnesio 400 mg. Pantallas fuera. Ducha tibia terminando en fría. Cuarto a 18–20 °C, oscuridad total.',
    ref: { type: 'meditacion', id: 'cierre' } },
  { start: bed, end: sleepEnd, kind: 'sueño', title: 'Sueño profundo · 7.5 h',
    detail: 'Aquí es donde crece el músculo, no en el entrenamiento. Dormir menos de 6 h reduce la síntesis proteica ~18 % y la testosterona 10–15 %.' },
]

// ── LUNES · Entreno A ────────────────────────────────────────

const LUNES: Block[] = [
  { start: '00:00', end: '09:45', kind: 'sueño', title: 'Sueño (viene de anoche)' },
  ...despertar(),
  { start: '10:00', end: '10:30', kind: 'comida', title: 'Desayuno', ref: { type: 'receta', slot: 'desayuno' } },
  ...universidad(),
  { start: '13:30', end: '14:15', kind: 'comida', title: 'Comida principal', ref: { type: 'receta', slot: 'comida' } },
  { start: '14:15', end: '14:45', kind: 'ruso', title: 'Ruso · vocabulario', detail: 'Sesión de Anki del día en tu app de 3 000 palabras.', ref: { type: 'ruso' } },
  { start: '14:45', end: '15:00', kind: 'prep', title: 'Preparar entrenamiento', detail: 'Ropa, agua, espacio despejado. Calentamiento dinámico de 5 minutos.' },
  { start: '15:00', end: '16:00', kind: 'entreno', title: 'Entreno A · Empuje + Cuádriceps', ref: { type: 'entreno', workoutId: 'f1a' } },
  { start: '16:00', end: '16:30', kind: 'comida', title: 'Batido post-entreno + ducha', ref: { type: 'receta', slot: 'postEntreno' } },
  { start: '16:30', end: '17:30', kind: 'doctorado', title: 'Doctorado · bloque profundo', detail: 'Define el entregable antes de empezar. Teléfono en otra habitación.', ref: { type: 'protocolo', id: 'ultradiano' } },
  { start: '17:30', end: '18:15', kind: 'ruso', title: 'Ruso · lección del día', ref: { type: 'ruso' } },
  { start: '18:15', end: '19:00', kind: 'comida', title: 'Cena', ref: { type: 'receta', slot: 'cena' } },
  ...trabajoNoche(),
  ...cierreNoche('02:15', '09:45'),
]

// ── MARTES · Recuperación ────────────────────────────────────

const MARTES: Block[] = [
  { start: '00:00', end: '09:45', kind: 'sueño', title: 'Sueño (viene de anoche)' },
  ...despertar(),
  { start: '10:00', end: '10:30', kind: 'comida', title: 'Desayuno', ref: { type: 'receta', slot: 'desayuno' } },
  ...universidad(),
  { start: '13:30', end: '14:15', kind: 'comida', title: 'Comida principal', ref: { type: 'receta', slot: 'comida' } },
  { start: '14:15', end: '15:00', kind: 'ruso', title: 'Ruso · Anki + lección', ref: { type: 'ruso' } },
  { start: '15:00', end: '15:45', kind: 'caminata', title: 'Caminata sin audífonos · 45 min',
    detail: 'Esto REEMPLAZA a correr. Recupera sin interferir con la hipertrofia. Sin podcasts ni música: deja que la mente divague, ahí aparecen las ideas de la tesis. Lleva una libreta.',
    ref: { type: 'protocolo', id: 'recuperacion' } },
  { start: '15:45', end: '16:00', kind: 'movilidad', title: 'Movilidad', detail: 'Cadera, tobillo, columna torácica y hombro. 2 minutos por zona. Es lo que te va a mantener sin lesiones bailando.' },
  { start: '16:00', end: '16:15', kind: 'meditacion', title: 'Escaneo corporal', ref: { type: 'meditacion', id: 'escaneo' } },
  { start: '16:15', end: '17:45', kind: 'doctorado', title: 'Doctorado · bloque ultradiano 90 min', ref: { type: 'protocolo', id: 'ultradiano' } },
  { start: '17:45', end: '18:15', kind: 'libre', title: 'Descanso real', detail: 'Sin pantallas. Caminar, mirar por la ventana, estirarte.' },
  { start: '18:15', end: '19:00', kind: 'comida', title: 'Cena', ref: { type: 'receta', slot: 'cena' } },
  ...trabajoNoche(),
  ...cierreNoche('02:15', '09:45'),
]

// ── MIÉRCOLES · Entreno B ────────────────────────────────────

const MIERCOLES: Block[] = LUNES.map((b) =>
  b.kind === 'entreno'
    ? { ...b, title: 'Entreno B · Tracción + Cadena posterior', ref: { type: 'entreno' as const, workoutId: 'f1b' } }
    : b,
)

// ── JUEVES · Recuperación ────────────────────────────────────

const JUEVES: Block[] = MARTES.map((b) =>
  b.kind === 'meditacion' ? { ...b, title: 'NSDR · descanso profundo', ref: { type: 'meditacion' as const, id: 'nsdr' } } : b,
)

// ── VIERNES · Entreno C · SIN TRABAJO ────────────────────────

const VIERNES: Block[] = [
  { start: '00:00', end: '09:45', kind: 'sueño', title: 'Sueño (viene de anoche)' },
  ...despertar(),
  { start: '10:00', end: '10:30', kind: 'comida', title: 'Desayuno', ref: { type: 'receta', slot: 'desayuno' } },
  ...universidad(),
  { start: '13:30', end: '14:15', kind: 'comida', title: 'Comida principal', ref: { type: 'receta', slot: 'comida' } },
  { start: '14:15', end: '14:45', kind: 'ruso', title: 'Ruso · Anki', ref: { type: 'ruso' } },
  { start: '14:45', end: '15:00', kind: 'prep', title: 'Preparar entrenamiento' },
  { start: '15:00', end: '16:05', kind: 'entreno', title: 'Entreno C · Full body volumen', ref: { type: 'entreno', workoutId: 'f1c' } },
  { start: '16:05', end: '16:35', kind: 'comida', title: 'Batido post-entreno + ducha', ref: { type: 'receta', slot: 'postEntreno' } },
  { start: '16:35', end: '17:35', kind: 'doctorado', title: 'Doctorado · bloque profundo', ref: { type: 'protocolo', id: 'ultradiano' } },
  { start: '17:35', end: '18:20', kind: 'ruso', title: 'Ruso · lección del día', ref: { type: 'ruso' } },
  { start: '18:20', end: '19:15', kind: 'comida', title: 'Cena', ref: { type: 'receta', slot: 'cena' } },
  { start: '19:15', end: '23:30', kind: 'libre', title: 'Noche libre · sin trabajo',
    detail: 'Es tu única noche sin jornada laboral. Úsala: social, cine, descanso. Recuperar la vida también es parte del plan.' },
  { start: '23:30', end: '23:50', kind: 'comida', title: 'Snack nocturno de caseína', ref: { type: 'receta', slot: 'nocturno' } },
  { start: '23:50', end: '00:30', kind: 'cierre', title: 'Ritual de cierre', ref: { type: 'meditacion', id: 'cierre' } },
  { start: '00:30', end: '08:30', kind: 'sueño', title: 'Sueño largo · 8 h',
    detail: 'Sin trabajo mañana temprano: aprovecha para pagar deuda de sueño antes del fin de semana de salsa.' },
]

// ── SÁBADO · Salsa 11–13 ─────────────────────────────────────

const SABADO: Block[] = [
  { start: '00:00', end: '08:30', kind: 'sueño', title: 'Sueño (viene de anoche)' },
  { start: '08:30', end: '09:15', kind: 'comida', title: 'Desayuno de carga pre-salsa',
    detail: 'Termina de comer al menos 90 min antes de bailar.', ref: { type: 'receta', slot: 'preBaile' } },
  { start: '09:15', end: '10:30', kind: 'prep', title: 'Preparación y traslado',
    detail: 'Botella de 700 ml: agua + pizca de sal + jugo de limón. Movilidad de cadera y tobillo 5 min.' },
  { start: '11:00', end: '13:00', kind: 'baile', title: 'Salsa · 2 horas',
    detail: 'Esto ES tu trabajo cardiovascular de la semana. 600–800 kcal. No necesitas nada de cardio adicional.' },
  { start: '13:00', end: '13:45', kind: 'comida', title: 'Comida de recuperación', ref: { type: 'receta', slot: 'comida' } },
  { start: '13:45', end: '15:30', kind: 'libre', title: 'Descanso', flexible: true },
  { start: '15:30', end: '16:30', kind: 'doctorado', title: 'Doctorado · bloque ligero', flexible: true, ref: { type: 'protocolo', id: 'pomodoro' } },
  { start: '16:30', end: '16:45', kind: 'ruso', title: 'Ruso · solo Anki', detail: 'Día de baile: mantén el contacto sin carga cognitiva.', ref: { type: 'ruso' } },
  { start: '16:45', end: '19:00', kind: 'libre', title: 'Tiempo personal / social', flexible: true },
  { start: '19:00', end: '20:00', kind: 'comida', title: 'Cena', ref: { type: 'receta', slot: 'cena' } },
  { start: '20:00', end: '23:30', kind: 'libre', title: 'Noche libre', flexible: true },
  { start: '23:30', end: '23:50', kind: 'comida', title: 'Snack nocturno de caseína', ref: { type: 'receta', slot: 'nocturno' } },
  { start: '23:50', end: '00:20', kind: 'cierre', title: 'Ritual de cierre', ref: { type: 'meditacion', id: 'cierre' } },
  { start: '00:20', end: '08:30', kind: 'sueño', title: 'Sueño · 8 h' },
]

// ── DOMINGO · Salsa 11–13 y 14:30–17 · Día más exigente ──────

const DOMINGO: Block[] = [
  { start: '00:00', end: '08:30', kind: 'sueño', title: 'Sueño (viene de anoche)' },
  { start: '08:30', end: '09:15', kind: 'comida', title: 'Desayuno de carga · día de 4.5 h de baile',
    detail: 'Hoy quemas 1 200–1 600 kcal bailando. Sin esta carga entras en déficit y el baile te consume músculo.',
    ref: { type: 'receta', slot: 'preBaile' } },
  { start: '09:15', end: '10:30', kind: 'prep', title: 'Preparación y traslado' },
  { start: '11:00', end: '13:00', kind: 'baile', title: 'Salsa · bloque 1' },
  { start: '13:00', end: '14:15', kind: 'comida', title: 'Comida entre bloques',
    detail: 'Alta en carbohidratos y proteína magra. Ligera: te falta bailar 2.5 h más.', ref: { type: 'receta', slot: 'comida' } },
  { start: '14:30', end: '17:00', kind: 'baile', title: 'Salsa · bloque 2',
    detail: 'Si a las 15:30 te baja la energía: medio plátano o 4 dátiles.' },
  { start: '17:00', end: '17:30', kind: 'comida', title: 'Batido de recuperación', ref: { type: 'receta', slot: 'postEntreno' } },
  { start: '17:30', end: '18:30', kind: 'libre', title: 'Descanso' },
  { start: '18:30', end: '19:30', kind: 'prep', title: 'MEAL PREP de la semana',
    detail: 'La hora más rentable de tu semana. Estofado de res (3 cenas) + 300 g de гречка + 8 huevos cocidos + verduras cortadas. Te ahorra ~5 horas de lunes a viernes.' },
  { start: '19:30', end: '20:15', kind: 'comida', title: 'Cena', ref: { type: 'receta', slot: 'cena' } },
  { start: '20:15', end: '21:00', kind: 'ruso', title: 'Ruso · auto-test semanal', ref: { type: 'ruso' } },
  { start: '21:00', end: '21:45', kind: 'metricas', title: 'Revisión semanal',
    detail: 'Peso promedio de la semana, fotos si toca, adherencia. Planea la semana que entra. Aquí se ajusta el plan con datos, no con sensaciones.' },
  { start: '21:45', end: '00:30', kind: 'libre', title: 'Tiempo personal', flexible: true },
  { start: '00:30', end: '00:50', kind: 'comida', title: 'Snack nocturno de caseína', ref: { type: 'receta', slot: 'nocturno' } },
  { start: '00:50', end: '01:30', kind: 'cierre', title: 'Ritual de cierre',
    detail: 'Mañana vuelve el horario de trabajo. Acuéstate un poco más tarde para retomar el ritmo sin choque.',
    ref: { type: 'meditacion', id: 'cierre' } },
  { start: '01:30', end: '09:45', kind: 'sueño', title: 'Sueño · 8.25 h' },
]

/** 0 = domingo … 6 = sábado (igual que Date.getDay()). */
export const SEMANA: Record<number, Block[]> = {
  0: DOMINGO,
  1: LUNES,
  2: MARTES,
  3: MIERCOLES,
  4: JUEVES,
  5: VIERNES,
  6: SABADO,
}

export const NOMBRE_DIA = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

export const RESUMEN_DIA: Record<number, { titulo: string; foco: string; kcal: number }> = {
  1: { titulo: 'Entreno A', foco: 'Empuje + Cuádriceps', kcal: 2900 },
  2: { titulo: 'Recuperación', foco: 'Caminata · Movilidad · Estudio', kcal: 2650 },
  3: { titulo: 'Entreno B', foco: 'Tracción + Cadena posterior', kcal: 2900 },
  4: { titulo: 'Recuperación', foco: 'Caminata · NSDR · Estudio', kcal: 2650 },
  5: { titulo: 'Entreno C', foco: 'Full body · Noche libre', kcal: 2900 },
  6: { titulo: 'Salsa 2 h', foco: 'Baile · Recuperación', kcal: 2950 },
  0: { titulo: 'Salsa 4.5 h', foco: 'Baile · Meal prep · Revisión', kcal: 3300 },
}
