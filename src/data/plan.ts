/**
 * PLAN DIARIO — hora por hora, los 7 días.
 * Zona horaria: NOVOSIBIRSK (UTC+7). Todas las horas son locales de Novosibirsk.
 *
 * SE ACABÓ EL HORARIO NOCTURNO (2026-08-31)
 * -----------------------------------------
 * Durante meses este plan giró alrededor de una jornada 20:30–01:30 que cubría
 * las 07:30–12:30 de Ciudad de México: por eso Sam dormía de 02:00 a 09:30. Ese
 * trabajo se terminó, y con él la única razón para vivir de noche. Mantener el
 * horario habría sido lo peor de los dos mundos — todo el coste circadiano sin
 * el ingreso que lo justificaba.
 *
 * El día es ahora diurno: sueño 23:30–07:30 (8 h, media hora más que antes),
 * columpio a las 08:00 con luz de mañana temprana —la señal más potente para
 * fijar el ritmo circadiano, justo lo que hace falta durante el reajuste— y
 * entreno a las 10:15. Las cinco horas que ocupaba el trabajo se reparten en
 * lo que él pidió: más tesis, más ruso y tres horas de noche que son suyas.
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
 * 3) SUEÑO CONSOLIDADO 8 h (23:30–07:30), NO BIFÁSICO.
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

/**
 * La cola de la noche: se duerme a las 23:30, así que el día empieza dormido.
 *
 * REESCRITO 2026-08-31 — SE ACABÓ EL HORARIO NOCTURNO.
 * Todo este archivo estaba construido alrededor de la jornada 20:30–01:30
 * para México: por eso Sam se acostaba a las 02:00, despertaba a las 09:30 y
 * la meditación del columpio caía a las 10:00. Ese trabajo ya no existe, y
 * mantener el horario habría sido lo peor de los dos mundos — el coste
 * circadiano de vivir de noche sin la razón que lo justificaba.
 *
 * El día pasa a horario diurno con OCHO horas de sueño (23:30–07:30) en vez
 * de 7.5. Todo se adelanta unas dos horas y el hueco de las cinco horas de
 * trabajo se reparte como él pidió: tesis, ruso y tiempo libre de verdad.
 */
const colaDeLaNoche = (): Block[] => [
  { start: '00:00', end: '07:30', kind: 'sueño', title: 'Sueño profundo · 8 h',
    detail: 'Aquí es donde crece el músculo, no en el entrenamiento. Media hora más que antes, y a una hora en que el cuerpo sí la aprovecha: dormir alineado con la oscuridad mejora la fase profunda, que es cuando se libera la hormona del crecimiento.' },
]

/** El ritual matinal: despertar → parque → columpio → volver. */
const ritualMatinal = (): Block[] => [
  { start: '07:30', end: '07:45', kind: 'despertar', title: 'Despertar sin teléfono', avisar: 0,
    detail: 'Siéntate en la cama. 600 ml de agua. Creatina 5 g + vitamina D3. Nada de pantallas: lo primero que ven tus ojos hoy debe ser luz real, no una notificación.' },
  { start: '07:45', end: '08:00', kind: 'caminata', title: 'Caminata al parque',
    detail: 'Sin audífonos. El trayecto es parte de la práctica.' },
  { start: '08:00', end: '08:30', kind: 'meditacion', title: 'Meditación en el columpio', avisar: 5,
    detail: 'Luz matinal + balanceo rítmico. Ahora cae dos horas antes, y eso lo mejora: la luz de la mañana temprana es la señal más potente para fijar el ritmo circadiano, y es justo lo que necesitas mientras el cuerpo se reacomoda al horario nuevo.',
    ref: { type: 'meditacion', id: 'columpio' } },
  { start: '08:30', end: '08:45', kind: 'caminata', title: 'Regreso caminando' },
  { start: '08:45', end: '09:15', kind: 'comida', title: 'Desayuno', ref: { type: 'receta', slot: 'desayuno' } },
  { start: '09:15', end: '10:00', kind: 'ruso', title: 'Ruso · Anki + lección', avisar: 0,
    detail: 'Aprovecha la digestión del desayuno. Cuando termines llevarás dos horas despierto y comido: momento ideal para entrenar.',
    ref: { type: 'ruso' } },
]

/** El cierre del día. Antes empezaba la jornada de trabajo; ahora empieza la noche. */
const nocheLibre = (): Block[] => [
  { start: '19:15', end: '20:00', kind: 'ruso', title: 'Ruso · escucha o repaso', flexible: true,
    detail: 'Segunda pasada del día, sin exigencia: podcast, música o repaso de las tarjetas falladas. Con el ruso lo que manda es la frecuencia, no la intensidad.',
    ref: { type: 'ruso' } },
  { start: '20:00', end: '22:45', kind: 'libre', title: 'Tiempo personal', flexible: true,
    detail: 'Tres horas tuyas, sin plan. Esto no es relleno: es la parte del día que el trabajo nocturno te quitaba, y descansar de verdad también construye músculo.' },
  { start: '22:45', end: '23:30', kind: 'cierre', title: 'Ritual de cierre', avisar: 10,
    detail: 'Magnesio 400 mg. Pantallas fuera desde ahora. Ducha tibia CORTA si te gusta dormir bañado — tibia, no fría: la fría activa el sistema nervioso. Cuarto a 18–20 °C y oscuridad total. Las primeras noches te vas a acostar sin sueño: no pasa nada, quédate en la cama a oscuras y en tres o cuatro días el cuerpo se acomoda.',
    ref: { type: 'meditacion', id: 'cierre' } },
  { start: '23:30', end: '00:00', kind: 'sueño', title: 'Sueño profundo · 8 h' },
]

// ── DÍA DE ENTRENO (Lunes · Miércoles · Viernes) ─────────────
//
// AÑADIDO 2026-08-24: EL BLOQUE DE COCINA. Sam tarda ~90 minutos cocinando y
// el plan fingía que la comida aparecía sola: el bloque de 45 min de "Comida
// principal" tenía que absorber cocinar Y comer, así que el doctorado de la
// tarde ya se estaba perdiendo en la realidad — solo que sin nombre. Además
// lo que cocina aguanta 2 días en el refri, así que no hace falta cocinar a
// diario: lunes y miércoles se cocina PARA DOS DÍAS (4 raciones), martes y
// jueves la comida es recalentar el tupper (3 minutos), y el viernes se
// cocina solo lo de hoy. Tres cocinadas por semana en vez de cinco.
//
// 2026-08-31: con el horario diurno, el día de cocina YA NO pierde el segundo
// bloque de tesis. Las cinco horas que ocupaba el trabajo nocturno alcanzan
// para las dos cosas — cocinar y dos bloques profundos — y aun así sobran
// tres horas de tiempo personal por la noche.

const diaEntreno = (
  workoutId: string,
  nombre: string,
  madrugada: Block[],
  /** Fin del entreno. Fase 1 son 65 min en casa; Fase 2, 75 con el gimnasio. */
  fin = '11:20',
  /** 'dosDias': hoy se cocina para hoy y mañana. 'recalentado': la comida es el tupper de ayer. */
  cocina: 'dosDias' | 'recalentado' = 'dosDias',
): Block[] => [
  ...madrugada,
  ...ritualMatinal(),
  { start: '10:00', end: '10:15', kind: 'prep', title: 'Traslado al parque + calentamiento',
    detail: 'Tus 1 200 m trotando SÍ sirven como calentamiento: están por debajo del umbral donde el aeróbico empieza a restar. Trota suave, sin sprints. Después: 10 bisagras de cadera, 10 círculos de hombro, y 2 series ligeras del primer ejercicio.' },
  { start: '10:15', end: fin, kind: 'entreno', title: nombre, avisar: 10, ref: { type: 'entreno', workoutId } },
  { start: fin, end: sumar(fin, 30), kind: 'comida', title: 'Licuado de 900 + ducha', ref: { type: 'receta', slot: 'postEntreno' },
    detail: 'La ducha del día va aquí: acabas de sudar. Si te gusta el agua fría, este es su momento — despierta y no estorba al sueño de nadie.' },
  ...(cocina === 'dosDias'
    ? [
        { start: sumar(fin, 30), end: sumar(fin, 105), kind: 'prep' as const, title: 'Cocina para hoy y MAÑANA · 4 raciones', avisar: 5,
          detail: 'El bloque que no existía y siempre existió. Hoy sales de aquí con 4 raciones: comida y cena de hoy, comida y cena de mañana. Trucos que recortan tu hora y media: el agua SIEMPRE arranca en el hervidor eléctrico (чайник), no en la parrilla lenta — son 15 minutos gratis; las bolsitas de гречка se cuecen solas mientras haces el pollo por tandas; y se lava sobre la marcha, no al final.' },
        { start: sumar(fin, 105), end: sumar(fin, 145), kind: 'comida' as const, title: 'Comida · recién hecha', ref: { type: 'receta' as const, slot: 'comida' } },
        { start: sumar(fin, 145), end: sumar(fin, 235), kind: 'doctorado' as const, title: 'Proyecto doctoral · bloque profundo', avisar: 5,
          detail: 'Define el entregable ANTES de empezar. Sin clases que te estructuren, este bloque es lo único que hace avanzar la tesis.',
          ref: { type: 'protocolo' as const, id: 'ultradiano' } },
        { start: sumar(fin, 235), end: sumar(fin, 255), kind: 'libre' as const, title: 'Descanso real', detail: 'Sin pantallas. Caminar, mirar por la ventana, estirarte.' },
        { start: sumar(fin, 255), end: sumar(fin, 345), kind: 'doctorado' as const, title: 'Proyecto doctoral · bloque 2',
          detail: 'El bloque que antes se perdía los días de cocina. Con el horario nuevo cabe entero.',
          ref: { type: 'protocolo' as const, id: 'pomodoro' } },
        { start: sumar(fin, 345), end: '18:30', kind: 'libre' as const, title: 'Recados / compras / personal', flexible: true },
      ]
    : [
        { start: sumar(fin, 30), end: sumar(fin, 50), kind: 'comida' as const, title: 'Comida · recalentar el tupper de ayer',
          detail: 'Ayer cocinaste esto en doble tanda. Hoy: 3 minutos de microondas y a comer. Por esto existe el bloque de cocina de ayer.',
          ref: { type: 'receta' as const, slot: 'comida' } },
        { start: sumar(fin, 50), end: sumar(fin, 140), kind: 'doctorado' as const, title: 'Proyecto doctoral · bloque profundo', avisar: 5,
          detail: 'Define el entregable ANTES de empezar. Hoy no se cocina: día de dos bloques completos de tesis.',
          ref: { type: 'protocolo' as const, id: 'ultradiano' } },
        { start: sumar(fin, 140), end: sumar(fin, 160), kind: 'libre' as const, title: 'Descanso real', detail: 'Sin pantallas. Caminar, mirar por la ventana, estirarte.' },
        { start: sumar(fin, 160), end: sumar(fin, 220), kind: 'doctorado' as const, title: 'Proyecto doctoral · bloque 2', ref: { type: 'protocolo' as const, id: 'pomodoro' } },
        { start: sumar(fin, 220), end: '18:30', kind: 'libre' as const, title: 'Recados / compras / personal', flexible: true },
      ]),
  { start: '18:30', end: '19:15', kind: 'comida', title: 'Cena · recalentar la segunda ración', ref: { type: 'receta', slot: 'cena' } },
  ...nocheLibre(),
]

// ── DÍA DE RECUPERACIÓN (Martes · Jueves) ────────────────────

const diaRecuperacion = (
  medId: string,
  /** En Fase 2 el miércoles es recuperación Y día de cocina a la vez. */
  cocina: 'dosDias' | 'recalentado' = 'recalentado',
): Block[] => [
  ...colaDeLaNoche(),
  ...ritualMatinal(),
  { start: '10:00', end: '10:45', kind: 'caminata', title: 'Caminata larga · 45 min sin audífonos', avisar: 5,
    detail: 'Esto REEMPLAZA a correr. Recupera sin interferir con la hipertrofia. Sin podcasts ni música: deja que la mente divague, ahí aparecen las ideas del proyecto. Lleva una libreta.',
    ref: { type: 'protocolo', id: 'recuperacion' } },
  { start: '10:45', end: '11:05', kind: 'movilidad', title: 'Movilidad',
    detail: 'Cadera, tobillo, columna torácica y hombro. 3 minutos por zona. Es lo que te mantendrá sin lesiones bailando.' },
  ...(cocina === 'recalentado'
    ? [
        { start: '11:05', end: '11:25', kind: 'comida' as const, title: 'Comida · recalentar el tupper de ayer',
          detail: 'Ayer cocinaste doble. Hoy: 3 minutos de microondas. El tiempo que no cocinas se lo queda la tesis.',
          ref: { type: 'receta' as const, slot: 'comida' } },
        { start: '11:25', end: '12:55', kind: 'doctorado' as const, title: 'Proyecto doctoral · bloque profundo', avisar: 5,
          detail: 'Sin entreno hoy, este es tu día de mayor capacidad cognitiva. Úsalo en lo más difícil de la tesis.',
          ref: { type: 'protocolo' as const, id: 'ultradiano' } },
        { start: '12:55', end: '13:15', kind: 'comida' as const, title: 'Licuado de 900 + descanso', avisar: 0,
          detail: 'Los días sin entreno el licuado va aquí, entre bloques: lejos de la comida y lejos de la cena, que es donde SÍ te cabe. Sin pantallas mientras te lo tomas.',
          ref: { type: 'receta' as const, slot: 'postEntreno' } },
        { start: '13:15', end: '14:45', kind: 'doctorado' as const, title: 'Proyecto doctoral · bloque 2', ref: { type: 'protocolo' as const, id: 'ultradiano' } },
        { start: '14:45', end: '15:05', kind: 'libre' as const, title: 'Descanso real', detail: 'Sin pantallas. Caminar, mirar por la ventana, estirarte.' },
        { start: '15:05', end: '16:35', kind: 'doctorado' as const, title: 'Proyecto doctoral · bloque 3', flexible: true,
          detail: 'El tercero es OPCIONAL y flexible: existe porque hoy no entrenas ni cocinas. Si a esta hora ya no rinde, cámbialo por ruso o déjalo ir — tres bloques profundos es un día excelente, no un mínimo.',
          ref: { type: 'protocolo' as const, id: 'pomodoro' } },
        { start: '16:35', end: '16:55', kind: 'meditacion' as const, title: 'Práctica de recuperación', ref: { type: 'meditacion' as const, id: medId } },
        { start: '16:55', end: '18:30', kind: 'libre' as const, title: 'Recados / compras / personal', flexible: true },
      ]
    : [
        { start: '11:05', end: '12:20', kind: 'prep' as const, title: 'Cocina para hoy y MAÑANA · 4 raciones', avisar: 5,
          detail: 'Día sin entreno pero con cocina: 4 raciones que resuelven hoy y mañana. El agua arranca en el hervidor eléctrico, no en la parrilla; se lava sobre la marcha.' },
        { start: '12:20', end: '13:00', kind: 'comida' as const, title: 'Comida · recién hecha', ref: { type: 'receta' as const, slot: 'comida' } },
        { start: '13:00', end: '14:30', kind: 'doctorado' as const, title: 'Proyecto doctoral · bloque profundo', avisar: 5,
          ref: { type: 'protocolo' as const, id: 'ultradiano' } },
        { start: '14:30', end: '14:50', kind: 'comida' as const, title: 'Licuado de 900 + descanso', avisar: 0,
          detail: 'A media tarde, lejos de la comida y de la cena: es donde SÍ te cabe.',
          ref: { type: 'receta' as const, slot: 'postEntreno' } },
        { start: '14:50', end: '16:20', kind: 'doctorado' as const, title: 'Proyecto doctoral · bloque 2', ref: { type: 'protocolo' as const, id: 'pomodoro' } },
        { start: '16:20', end: '16:40', kind: 'meditacion' as const, title: 'Práctica de recuperación', ref: { type: 'meditacion' as const, id: medId } },
        { start: '16:40', end: '18:30', kind: 'libre' as const, title: 'Recados / compras / personal', flexible: true },
      ]),
  { start: '18:30', end: '19:15', kind: 'comida', title: 'Cena · recalentar la segunda ración', ref: { type: 'receta', slot: 'cena' } },
  ...nocheLibre(),
]

// ── VIERNES · Entreno C · La noche que sí se estira ──────────

const VIERNES: Block[] = [
  ...colaDeLaNoche(),
  ...ritualMatinal(),
  { start: '10:00', end: '10:15', kind: 'prep', title: 'Calentamiento dinámico' },
  { start: '10:15', end: '11:20', kind: 'entreno', title: 'Entreno C · Full body volumen', avisar: 10, ref: { type: 'entreno', workoutId: 'f1c' } },
  { start: '11:20', end: '11:50', kind: 'comida', title: 'Licuado post-entreno + ducha', ref: { type: 'receta', slot: 'postEntreno' },
    detail: 'La ducha del día va aquí: acabas de sudar. Fría al final si quieres — hoy no estorba a nadie.' },
  { start: '11:50', end: '12:50', kind: 'prep', title: 'Cocina solo para HOY · 2 raciones', avisar: 5,
    detail: 'La cocinada corta de la semana: mañana y el domingo comes en la calle, así que hoy solo sale comida y cena de hoy. El agua arranca en el hervidor eléctrico; se lava sobre la marcha.' },
  { start: '12:50', end: '13:30', kind: 'comida', title: 'Comida · recién hecha', ref: { type: 'receta', slot: 'comida' } },
  { start: '13:30', end: '15:00', kind: 'doctorado', title: 'Proyecto doctoral · bloque profundo', avisar: 5, ref: { type: 'protocolo', id: 'ultradiano' } },
  { start: '15:00', end: '15:20', kind: 'libre', title: 'Descanso real' },
  { start: '15:20', end: '16:50', kind: 'doctorado', title: 'Proyecto doctoral · bloque 2', flexible: true, ref: { type: 'protocolo', id: 'pomodoro' } },
  { start: '16:50', end: '18:45', kind: 'libre', title: 'Tiempo libre', flexible: true },
  { start: '18:45', end: '19:30', kind: 'comida', title: 'Cena · recalentar la segunda ración', ref: { type: 'receta', slot: 'cena' } },
  { start: '19:30', end: '23:00', kind: 'libre', title: 'Noche de viernes',
    detail: 'La noche en que sí puedes estirarte sin costo: mañana no entrenas y el camión sale a las 9:00, no antes. Social, cine, lo que quieras. Recuperar la vida también es parte del plan.' },
  { start: '23:00', end: '23:45', kind: 'cierre', title: 'Ritual de cierre · DEJA LA MOCHILA LISTA', avisar: 0,
    detail: 'Mañana sales 8:50 al camión de las 9:00 y bailas dos horas seguidas. Mochila AHORA: la bebida de proteína (o el frasco casero de leche con avena, miel y cacahuate), 2 plátanos, pan con miel, botella de 700 ml con agua y una pizca de sal, ropa de cambio. Es el único paso del sábado que se hace la noche anterior, y sin él desayunas grasa a 45 minutos de bailar.',
    ref: { type: 'meditacion', id: 'cierre' } },
  { start: '23:45', end: '00:00', kind: 'sueño', title: 'Sueño · 8 h' },
]

// ── SÁBADO · Salsa 11–12 · Desayuno en el camión ─────────────
//
// CORREGIDO 2026-08-15 con el horario real de Sam. La versión anterior lo
// levantaba a las 07:50 a cocinar avena y meditar en el columpio antes de
// salir a las 10:00. Nada de eso ocurría: se levanta 8:30, toma el camión de
// las 9:00, llega a las 10:00 y compraba el desayuno en una tienda a 45
// minutos de bailar — con pizza, que es lo peor que se puede digerir antes de
// girar. El desayuno se muda al camión y la meditación sale del fin de semana.

const SABADO: Block[] = [
  { start: '00:00', end: '08:00', kind: 'sueño', title: 'Sueño · 8 h' },
  { start: '08:00', end: '08:50', kind: 'despertar', title: 'Despertar · sales en 50 min', avisar: 0,
    detail: 'Agua, creatina, vitamina D3. Con el horario nuevo despiertas media hora antes que antes, así que hoy SÍ te da tiempo de un plato de avena en casa si te apetece — sin dejar de llevar lo del camión. Antes salías en ayunas porque no cabía; ahora cabe.' },
  { start: '08:50', end: '09:00', kind: 'prep', title: 'Salida al camión', avisar: 5,
    detail: 'La mochila ya debería estar hecha de anoche: leche proteica, 2 plátanos, pan con miel, botella de 700 ml con agua y una pizca de sal, ropa de cambio.' },
  { start: '09:00', end: '10:00', kind: 'comida', title: 'Camión · desayuno + Anki de ruso', avisar: 0,
    detail: 'Los 60 minutos más rentables de tu fin de semana: comes y estudias sentado. Terminar de desayunar ahora te deja una hora exacta de digestión antes de bailar.',
    ref: { type: 'receta', slot: 'preBaile' } },
  { start: '10:00', end: '10:40', kind: 'ruso', title: 'Llegada · espera cerca de la academia',
    detail: 'Ya desayunaste en el camión, así que esta hora es tuya. Anki o escucha en ruso. Si compras algo en la tienda, que sea fruta o jugo — nada graso todavía.',
    ref: { type: 'ruso' } },
  { start: '10:40', end: '11:00', kind: 'movilidad', title: 'Segundo plátano y calentamiento', avisar: 5,
    detail: 'El plátano que guardaste, ahora. Movilidad de cadera y tobillo 10 min: es lo que separa una clase buena de un tirón.' },
  { start: '11:00', end: '12:00', kind: 'baile', title: 'Salsa · academia 1',
    detail: 'Primera hora. ~350 kcal.' },
  { start: '12:00', end: '13:00', kind: 'baile', title: 'Bachata · segunda hora seguida', avisar: 0,
    detail: 'Son DOS horas seguidas de baile, no una: ~700 kcal en total y casi cuatro horas desde el desayuno del camión. Si entre clase y clase te queda un minuto, el resto del pan con miel o unos dátiles — no llegues a la bachata vacío.' },
  { start: '13:00', end: '13:20', kind: 'comida', title: 'Al salir · come algo YA', avisar: 0,
    detail: 'Acabas de bailar dos horas y te espera una hora de camión. No aguantes hasta casa: lo que compres aquí sirve, y aquí SÍ cabe lo graso — la pizza, el shawarma, lo que se te antoje.',
    ref: { type: 'receta', slot: 'comida' } },
  { start: '13:20', end: '14:20', kind: 'ruso', title: 'Traslado de regreso · escucha en ruso',
    detail: 'Podcast o música rusa. Escucha pasiva, sin exigirte entender todo.', ref: { type: 'ruso' } },
  { start: '14:20', end: '14:50', kind: 'comida', title: 'Licuado de 900 + ducha', avisar: 0,
    detail: 'En cuanto llegues. Bailaste dos horas y comiste de tienda: esta es la toma que endereza el sábado, y entra sin esfuerzo porque se bebe.',
    ref: { type: 'receta', slot: 'postEntreno' } },
  { start: '14:50', end: '15:15', kind: 'libre', title: 'Descanso', flexible: true },
  { start: '15:15', end: '16:45', kind: 'doctorado', title: 'Proyecto doctoral · bloque ligero', flexible: true, ref: { type: 'protocolo', id: 'pomodoro' } },
  { start: '16:45', end: '18:30', kind: 'libre', title: 'Tiempo personal / social', flexible: true },
  { start: '18:30', end: '19:30', kind: 'comida', title: 'Cena', ref: { type: 'receta', slot: 'cena' } },
  { start: '19:30', end: '22:45', kind: 'libre', title: 'Noche libre', flexible: true },
  { start: '22:45', end: '23:30', kind: 'cierre', title: 'Ritual de cierre · DEJA LA MOCHILA LISTA', avisar: 0,
    detail: 'Mañana es tu día más largo: sales 8:50 y no vuelves hasta las 17:10, con 3 h 30 de baile en medio. Mochila AHORA: la bebida de proteína (o el frasco casero), 2 plátanos, pan con miel, botella de 700 ml con agua y sal, ropa de cambio y dinero para la comida del mediodía. Si no la dejas hecha esta noche, mañana sales en ayunas.',
    ref: { type: 'meditacion', id: 'cierre' } },
  { start: '23:30', end: '00:00', kind: 'sueño', title: 'Sueño · 8 h' },
]

// ── DOMINGO · Salsa 11–13 y 14:30–17 · Día más exigente ──────

const DOMINGO: Block[] = [
  { start: '00:00', end: '08:00', kind: 'sueño', title: 'Sueño · 8 h' },
  { start: '08:00', end: '08:50', kind: 'despertar', title: 'Despertar · el día más largo de tu semana', avisar: 0,
    detail: 'Agua, creatina, vitamina D3. Hoy bailas 3 h 20 min en dos academias y pasas 9 horas fuera. Todo lo que comas hoy tiene que caber en la mochila o comprarse en el camino.' },
  { start: '08:50', end: '09:00', kind: 'prep', title: 'Salida al camión', avisar: 5,
    detail: 'Mochila de anoche: leche proteica, 2 plátanos, pan con miel, botella de 700 ml con agua y sal, ropa de cambio y dinero para la comida del mediodía.' },
  { start: '09:00', end: '10:00', kind: 'comida', title: 'Camión · desayuno + Anki de ruso', avisar: 0,
    detail: 'Comes sentado y estudias al mismo tiempo. Hoy importa el doble: si sales en ayunas, a las 16:00 en la segunda academia se te acaba y el baile te consume músculo.',
    ref: { type: 'receta', slot: 'preBaile' } },
  { start: '10:00', end: '10:40', kind: 'ruso', title: 'Llegada · espera cerca de la academia',
    detail: 'Anki o escucha en ruso. Nada graso todavía: fruta o jugo si acaso.', ref: { type: 'ruso' } },
  { start: '10:40', end: '11:00', kind: 'movilidad', title: 'Segundo plátano y calentamiento', avisar: 5,
    detail: 'Movilidad de cadera y tobillo 10 min. Hoy son más de tres horas de baile: el calentamiento no es opcional.' },
  { start: '11:00', end: '12:00', kind: 'baile', title: 'Salsa · academia 1', detail: 'Primera hora. ~350 kcal.' },
  { start: '12:00', end: '13:00', kind: 'baile', title: 'Bachata · segunda hora seguida', avisar: 0,
    detail: 'Dos horas seguidas y todavía te falta la clase larga de la tarde. Hoy el total son 3 h 30 de baile.' },
  { start: '13:00', end: '14:20', kind: 'comida', title: 'Comida en el camino · la que decide tu domingo', avisar: 0,
    detail: 'La comida más importante de tu semana. Acabas de bailar dos horas y te faltan hora y media. Aquí SÍ cabe lo graso, pero busca proteína de verdad: pollo, pescado, huevos u otra leche proteica. Si sales de aquí solo con almidón, a las 15:30 se te acaba.',
    ref: { type: 'receta', slot: 'comida' } },
  { start: '14:20', end: '14:40', kind: 'movilidad', title: 'Llegada a la academia 2 · plátano y movilidad', avisar: 5,
    detail: 'Un plátano ahora te deja con glucógeno fresco para la clase larga, y diez minutos de cadera y tobillo evitan que la segunda sesión del día sea la que te lesione.' },
  { start: '14:40', end: '16:10', kind: 'baile', title: 'Salsa · academia 2 · 1 h 30 min',
    detail: 'El bloque más exigente de tu semana: llegas con dos horas de baile encima. Si a las 15:30 te baja la energía, medio plátano o 4 dátiles.' },
  { start: '16:10', end: '17:10', kind: 'ruso', title: 'Traslado de regreso · escucha en ruso', ref: { type: 'ruso' } },
  { start: '17:10', end: '17:40', kind: 'comida', title: 'Licuado de 900 · recuperación', avisar: 0,
    detail: 'En cuanto llegues al dormitorio. Tras 3 h 30 min de baile, esta es la reposición más urgente del día.',
    ref: { type: 'receta', slot: 'postEntreno' } },
  { start: '17:40', end: '18:10', kind: 'libre', title: 'Ducha y descanso' },
  { start: '18:10', end: '19:10', kind: 'prep', title: 'MEAL PREP de la semana', avisar: 5,
    detail: 'La hora más rentable de tu semana. Con la despensa de ahora: 500 g de pollo en dos tandas de 250 g (nunca de golpe, se cuece al vapor), 4 bolsitas de гречка y 8 huevos cocidos. Te ahorra ~5 horas de lunes a viernes.' },
  { start: '19:10', end: '20:00', kind: 'comida', title: 'Cena', ref: { type: 'receta', slot: 'cena' } },
  { start: '20:00', end: '20:40', kind: 'ruso', title: 'Ruso · auto-test semanal', ref: { type: 'ruso' } },
  { start: '20:40', end: '21:20', kind: 'metricas', title: 'Revisión semanal', avisar: 5,
    detail: 'Peso promedio de la semana, fotos si toca, adherencia. Planea la semana que entra. Aquí se ajusta el plan con datos, no con sensaciones.' },
  { start: '21:20', end: '22:45', kind: 'libre', title: 'Tiempo personal', flexible: true },
  { start: '22:45', end: '23:30', kind: 'cierre', title: 'Ritual de cierre', avisar: 10,
    detail: 'Mañana arranca la semana con entreno a las 10:15. Magnesio, pantallas fuera, cuarto oscuro y fresco.',
    ref: { type: 'meditacion', id: 'cierre' } },
  { start: '23:30', end: '00:00', kind: 'sueño', title: 'Sueño · 8 h' },
]

// ─────────────────────────────────────────────────────────────
// FASE 1 · Peso corporal · Lun · Mié · Vie (full body 3×/semana)
// ─────────────────────────────────────────────────────────────

const FASE_1: Record<number, Block[]> = {
  0: DOMINGO,
  1: diaEntreno('f1a', 'Entreno A · Empuje + Cuádriceps', colaDeLaNoche()),
  2: diaRecuperacion('escaneo'),
  3: diaEntreno('f1b', 'Entreno B · Tracción + Cadena posterior', colaDeLaNoche()),
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
  1: diaEntreno('f2ua', 'Empuje · Pecho · Hombros · Tríceps', colaDeLaNoche(), '11:30'),
  2: diaEntreno('f2la', 'Pierna A · Cuádriceps dominante', colaDeLaNoche(), '11:30', 'recalentado'),
  3: diaRecuperacion('escaneo', 'dosDias'),
  4: diaEntreno('f2lb', 'Pierna B · Cadena posterior', colaDeLaNoche(), '11:30', 'recalentado'),
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
  6: { titulo: 'Salsa y bachata · 2 h', foco: 'Baile · Traslados · Recuperación', kcal: kcalPlaneadas(6) },
  0: { titulo: 'Baile 3 h 30', foco: 'Dos academias · Meal prep · Revisión', kcal: kcalPlaneadas(0) },
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
