/**
 * PROGRAMA DE ENTRENAMIENTO — Sam (33a, 176cm, 62kg, ectomorfo)
 *
 * FUNDAMENTO CIENTÍFICO DEL DISEÑO
 * ---------------------------------
 * 1) LA EXCÉNTRICA ES EL MAYOR PALANCA PARA TUS BRAZOS
 *    Sato et al. 2022 (EJAP) entrenó FLEXORES DEL CODO —tu músculo objetivo—
 *    2x/semana durante 5 semanas comparando tres protocolos. Grosor muscular:
 *      · Excéntrico + concéntrico ... +10.6 %
 *      · Solo EXCÉNTRICO .......... +9.7 %  (¡con la MITAD del volumen!)
 *      · Solo concéntrico ..........  +2.5 %  (no significativo)
 *    Conclusión textual: "las contracciones concéntricas contribuyeron poco".
 *    → Hacer dominadas rápidas tira a la basura casi todo el estímulo. Bajar en
 *      3 segundos contados no es un refinamiento: para el bíceps ES el ejercicio.
 *    Yagiz et al. 2022 (revisión sistemática) confirma además que el trabajo
 *    directo de flexión de codo tiene efecto grande (g = 0.93): los curls no
 *    sobran, complementan a las dominadas.
 *
 * 2) EL TROTE DE 1 200 m COMO CALENTAMIENTO: ESTÁ BIEN
 *    Panissa et al. 2021 (revisión de interferencia aguda): un volumen aeróbico
 *    BAJO —3 km, ~18 min— NO reduce el rendimiento de fuerza posterior; el
 *    perjuicio aparece a partir de 5 y 7 km (~30 y ~42 min). Con 1 200 m estás
 *    muy por debajo del umbral.
 *    OJO — esto NO contradice el problema original: correr 1.2 km TODOS LOS DÍAS
 *    como sesión propia, sin superávit calórico ni descanso, sí era excesivo
 *    (Wilson et al. 2012: la interferencia crónica escala con la FRECUENCIA del
 *    aeróbico, r = -0.26 a -0.35, y con su duración, r = -0.29 a -0.75).
 *    Trotar suave 3 veces por semana antes de levantar es otra cosa: es
 *    calentamiento. Mantenlo, pero suave y sin sprints — Panissa señala que el
 *    trabajo interválico de alta intensidad sí penaliza las series siguientes.
 *
 * 3) PESO CORPORAL SÍ CONSTRUYE MÚSCULO (agosto, antes del gym)
 *    Schoenfeld et al. 2017 y Lopez et al. 2020: la hipertrofia es
 *    LOAD-INDEPENDENT — cargas bajas igualan a cargas altas — CON UNA CONDICIÓN:
 *    las series deben llevarse al fallo o muy cerca. La fuerza máxima sí
 *    requiere carga alta, pero el tamaño muscular no.
 *
 * 4) CERCANÍA AL FALLO (RIR)
 *    Robinson et al. 2024 (meta-regresión): la hipertrofia mejora conforme las
 *    series terminan MÁS CERCA del fallo; la fuerza es indiferente al RIR.
 *    → Con peso corporal (carga baja) hay que ir a RIR 0-1. Con barra pesada
 *      (Fase 2) basta RIR 1-2 en compuestos por seguridad.
 *
 * 5) FRECUENCIA Y SERIES
 *    Currier et al. 2023 (network meta-análisis bayesiano, 119 estudios):
 *    la prescripción mejor rankeada para HIPERTROFIA es multi-serie, 2x/semana
 *    por grupo muscular. Como principiante, full-body 3x/semana da 3 estímulos
 *    semanales por grupo y maximiza la curva de novato.
 */

export interface Exercise {
  id: string
  name: string
  muscle: string
  /** La señal técnica que más importa. Una sola frase. */
  cue: string
  /** Errores que arruinan el ejercicio. */
  error?: string
  /** Escalera de progresión: cuando domines un nivel, subes al siguiente. */
  progression?: string[]
  /** Término de búsqueda en YouTube para ver la técnica. */
  video: string
}

export interface Prescription {
  sets: number
  /** Rango objetivo, o 'AMRAP' = todas las que puedas hasta el RIR indicado. */
  reps: string
  rir: number
  /** Descanso en segundos. */
  rest: number
  /** Si es unilateral, el logger pide izquierda y derecha. */
  unilateral?: boolean
  /**
   * Segundos de BAJADA (fase excéntrica). Sato et al. 2022: en flexores del
   * codo, el trabajo excéntrico produjo +9.7 % de grosor muscular frente a
   * +2.5 % del concéntrico. Es el ajuste con mayor retorno para tus brazos.
   */
  tempo?: number
}

export interface WorkoutItem {
  exerciseId: string
  rx: Prescription
  note?: string
}

export interface Workout {
  id: string
  name: string
  phase: 1 | 2
  focus: string
  durationMin: number
  items: WorkoutItem[]
}

// ─────────────────────────────────────────────────────────────
// CATÁLOGO DE EJERCICIOS
// ─────────────────────────────────────────────────────────────

export const EXERCISES: Record<string, Exercise> = {
  // ── FASE 1: PARQUE CON BARRAS ──
  dominadaSupina: {
    id: 'dominadaSupina',
    name: 'Dominada supina (agarre cerrado)',
    muscle: 'Bíceps · Dorsales',
    cue: 'Palmas hacia ti, manos a la anchura de los hombros. Sube hasta que la barbilla pase la barra y BAJA EN 3 SEGUNDOS contando.',
    error: 'Subir y bajar rápido, que es lo que estabas haciendo. La bajada rápida te roba la mitad del estímulo: es en la fase excéntrica donde el músculo genera más tensión y más daño mecánico.',
    progression: [
      'Con banda elástica o pies apoyados (asistida)',
      'Solo la bajada: saltas arriba y bajas en 5 s',
      'Completa, 3 s de bajada ← tu objetivo ahora',
      'Completa con pausa de 1 s con la barbilla arriba',
      'Con lastre (mochila cargada)',
    ],
    video: 'chin up close grip slow eccentric',
  },
  dominadaProna: {
    id: 'dominadaProna',
    name: 'Dominada prona',
    muscle: 'Dorsales · Espalda alta',
    cue: 'Palmas al frente, manos algo más anchas que los hombros. Piensa en llevar los CODOS al suelo, no en subir la barbilla.',
    error: 'Encoger los hombros hacia las orejas al colgar. Antes de tirar, hunde los omóplatos.',
    progression: [
      'Con banda elástica (asistida)',
      'Negativas de 5 s',
      'Completa',
      'Completa con pausa arriba',
      'Con lastre',
    ],
    video: 'pull up form scapular depression',
  },
  fondoParalelas: {
    id: 'fondoParalelas',
    name: 'Fondos en paralelas',
    muscle: 'Tríceps · Pecho inferior · Hombro',
    cue: 'Torso casi vertical para cargar tríceps. Baja hasta que el hombro quede a la altura del codo, sin pasarte. Bajada de 3 s.',
    error: 'Bajar demasiado. Por debajo del paralelo el hombro entra en una posición vulnerable y no ganas nada extra.',
    progression: [
      'Fondos con pies apoyados en el suelo (asistidos)',
      'Negativas de 5 s',
      'Completos, 8–10 reps ← donde estás',
      'Completos con pausa abajo',
      'Con lastre',
    ],
    video: 'parallel bar dips triceps form',
  },
  remoBarraBaja: {
    id: 'remoBarraBaja',
    name: 'Remo en barra baja',
    muscle: 'Espalda media · Bíceps',
    cue: 'Cuerpo recto bajo la barra. Jala llevando el ESTERNÓN a la barra y aprieta los omóplatos 1 s arriba.',
    error: 'Doblar la cadera para acortar el recorrido. De talones a hombros, una sola línea.',
    progression: [
      'Rodillas flexionadas, torso muy inclinado',
      'Piernas extendidas, cuerpo a 45°',
      'Piernas extendidas, cuerpo casi horizontal',
      'Pies elevados en banco',
      'A un brazo',
    ],
    video: 'inverted row bar horizontal pull',
  },
  curlBarraBaja: {
    id: 'curlBarraBaja',
    name: 'Curl en barra baja',
    muscle: 'Bíceps',
    cue: 'Colgado bajo la barra con agarre supino y cerrado, cuerpo recto. Solo se doblan los codos: el cuerpo sube en arco hacia la barra.',
    error: 'Convertirlo en remo empujando con la espalda. Los codos se quedan fijos apuntando al frente.',
    progression: [
      'Cuerpo muy inclinado (fácil)',
      'Cuerpo a 45°',
      'Cuerpo casi horizontal',
      'Pies elevados',
    ],
    video: 'bodyweight bicep curl low bar',
  },
  flexionInclinada: {
    id: 'flexionInclinada',
    name: 'Flexión en plancha inclinada',
    muscle: 'Pecho · Tríceps',
    cue: 'Manos en la plancha, cuerpo recto. Cuanto más BAJA la plancha, más difícil. Baja en 3 s, sube con intención.',
    error: 'Media repetición. El pecho debe rozar la superficie en cada una.',
    progression: [
      'Plancha alta (casi de pie)',
      'Plancha media',
      'Plancha baja',
      'En el suelo',
      'Pies elevados (declinada)',
    ],
    video: 'incline push up progression',
  },

  // ── FASE 1: EN CASA (respaldo para días de mal clima) ──
  bulgara: {
    id: 'bulgara',
    name: 'Sentadilla búlgara',
    muscle: 'Cuádriceps · Glúteo',
    cue: 'Pie trasero sobre silla. Baja recto hasta que la rodilla trasera casi toque el piso. Empuja con el TALÓN delantero.',
    error: 'Dar un paso demasiado corto: convierte el ejercicio en cuádriceps puro y castiga la rodilla.',
    progression: [
      'Peso corporal, mano en pared para equilibrio',
      'Peso corporal sin apoyo',
      'Con mochila cargada (libros/botellas de agua)',
      'Mochila + pausa de 2 s abajo',
      'Mochila pesada (10–15 kg) + tempo 3-1-1',
    ],
    video: 'sentadilla bulgara tecnica correcta',
  },
  flexion: {
    id: 'flexion',
    name: 'Flexiones',
    muscle: 'Pecho · Tríceps · Hombro anterior',
    cue: 'Cuerpo en línea recta de talones a cabeza. Codos a 45° del torso, no abiertos a 90°. Pecho toca el piso.',
    error: 'Cadera hundida o elevada, y bajar solo media repetición. Rango completo o no cuenta.',
    progression: [
      'Contra la pared',
      'Manos en mesa (inclinada)',
      'Manos en silla',
      'De rodillas',
      'Estándar en el piso ← tu nivel actual',
      'Diamante (manos juntas)',
      'Declinada (pies en silla)',
      'Arquera (peso a un lado)',
      'Pseudo-planche (manos a la cintura)',
    ],
    video: 'push up perfect form',
  },
  filaInvertida: {
    id: 'filaInvertida',
    name: 'Fila invertida',
    muscle: 'Espalda · Bíceps',
    cue: 'Bajo una mesa firme (o con toalla en manija de puerta). Cuerpo recto, jala llevando el ESTERNÓN a la mesa. Aprieta omóplatos.',
    error: 'Jalar con los brazos en vez de los codos. Piensa "meto los codos al bolsillo trasero".',
    progression: [
      'Rodillas flexionadas, torso muy vertical',
      'Rodillas flexionadas, torso a 45°',
      'Piernas extendidas',
      'Piernas extendidas + pies elevados en silla',
      'Pies elevados + pausa 2 s arriba',
      'A un brazo (avanzado)',
    ],
    video: 'inverted row bodyweight back',
  },
  flexionPica: {
    id: 'flexionPica',
    name: 'Flexión pica (hombros)',
    muscle: 'Deltoides · Tríceps',
    cue: 'Cadera arriba en "V" invertida. Baja la CORONILLA hacia el piso entre las manos, no el pecho.',
    error: 'Convertirla en flexión normal por no elevar suficiente la cadera.',
    progression: [
      'Pica en el piso',
      'Pies elevados en silla',
      'Pies en pared (casi vertical)',
      'Flexión en pino asistida',
    ],
    video: 'pike push up shoulders progression',
  },
  puenteGluteo: {
    id: 'puenteGluteo',
    name: 'Puente de glúteo a una pierna',
    muscle: 'Glúteo · Femoral',
    cue: 'Hombros en el piso (o en sofá), una pierna extendida. Empuja con el talón y APRIETA el glúteo 1 s arriba.',
    error: 'Arquear la espalda baja para llegar más alto. El movimiento es de cadera, no de columna.',
    progression: [
      'Dos piernas en el piso',
      'Una pierna en el piso',
      'Hombros elevados en sofá, una pierna',
      'Con mochila sobre la cadera',
    ],
    video: 'single leg glute bridge form',
  },
  nordico: {
    id: 'nordico',
    name: 'Curl nórdico asistido',
    muscle: 'Femoral (isquiotibiales)',
    cue: 'De rodillas, pies trabados bajo un mueble. Baja MUY lento resistiendo con los femorales. Empuja con las manos para volver.',
    error: 'Doblar la cadera. Mantén una línea recta de rodillas a cabeza todo el recorrido.',
    progression: [
      'Excéntrica de 3 s con mucha ayuda de manos',
      'Excéntrica de 5 s',
      'Excéntrica de 5 s sin rebote',
      'Nórdico completo asistido mínimo',
    ],
    video: 'nordic hamstring curl beginner',
  },
  sentadillaUna: {
    id: 'sentadillaUna',
    name: 'Sentadilla a una pierna asistida',
    muscle: 'Cuádriceps · Glúteo · Estabilidad',
    cue: 'Sentado al borde de una silla, levántate con UNA pierna. Baja controlado hasta rozar la silla.',
    error: 'Impulsarte con la otra pierna. Mantenla al frente sin tocar el piso.',
    progression: [
      'Silla alta, apoyo de manos',
      'Silla alta, sin manos',
      'Silla normal, sin manos',
      'Silla baja / cojín',
      'Pistol squat completo',
    ],
    video: 'assisted pistol squat box progression',
  },
  flexionDiamante: {
    id: 'flexionDiamante',
    name: 'Flexión diamante',
    muscle: 'Tríceps · Pecho interno',
    cue: 'Índices y pulgares formando un diamante bajo el esternón. Codos pegados al cuerpo.',
    error: 'Abrir los codos: pierdes el énfasis en tríceps.',
    video: 'diamond push up triceps',
  },
  curlMochila: {
    id: 'curlMochila',
    name: 'Curl con mochila / garrafón',
    muscle: 'Bíceps · Antebrazo',
    cue: 'Codos pegados al costado, inmóviles. Solo el antebrazo se mueve. Baja en 3 s.',
    error: 'Balancear el torso para subir el peso. Si necesitas impulso, el peso es excesivo.',
    video: 'backpack bicep curl home workout',
  },
  zancada: {
    id: 'zancada',
    name: 'Zancada caminando',
    muscle: 'Cuádriceps · Glúteo',
    cue: 'Paso largo. Rodilla trasera casi al piso. Empuja con el talón delantero para avanzar.',
    error: 'Pasos cortos que llevan la rodilla muy por delante del pie.',
    video: 'walking lunge form',
  },
  gemelo: {
    id: 'gemelo',
    name: 'Elevación de talón a una pierna',
    muscle: 'Gemelo · Sóleo',
    cue: 'En un escalón, con el talón colgando. Baja hasta estirar del todo, pausa 1 s, sube al máximo.',
    error: 'Rebotar. El gemelo responde al rango completo y la pausa en estiramiento.',
    video: 'single leg calf raise step',
  },
  plancha: {
    id: 'plancha',
    name: 'Plancha frontal',
    muscle: 'Core',
    cue: 'Antebrazos en el piso. APRIETA glúteos y abdomen como si fueras a recibir un golpe. Costillas hacia abajo.',
    error: 'Aguantar tiempo con la cadera caída. Mejor 30 s perfectos que 90 s hundido.',
    video: 'plank correct form core',
  },
  hollow: {
    id: 'hollow',
    name: 'Hollow hold',
    muscle: 'Core profundo',
    cue: 'Boca arriba, espalda baja PEGADA al piso. Brazos y piernas extendidos apenas separados del suelo.',
    error: 'Que se despegue la lumbar. Si pasa, sube más las piernas.',
    video: 'hollow body hold progression',
  },
  planchaLateral: {
    id: 'planchaLateral',
    name: 'Plancha lateral',
    muscle: 'Oblicuos · Core lateral',
    cue: 'Antebrazo bajo el hombro. Cadera alta, cuerpo en línea recta vista de frente.',
    video: 'side plank form',
  },

  // ── FASE 2: GIMNASIO (mancuernas + máquinas) ──
  gobletSquat: {
    id: 'gobletSquat',
    name: 'Sentadilla goblet',
    muscle: 'Cuádriceps · Glúteo · Core',
    cue: 'Mancuerna vertical contra el pecho. Codos por dentro de las rodillas abajo. Baja hasta romper paralelo.',
    error: 'Inclinar el torso al frente. La mancuerna al pecho es un contrapeso: úsalo para mantenerte erguido.',
    video: 'goblet squat form',
  },
  prensa: {
    id: 'prensa',
    name: 'Prensa de piernas 45°',
    muscle: 'Cuádriceps · Glúteo',
    cue: 'Pies a la anchura de cadera, media altura de la plataforma. Baja hasta que el muslo toque el torso.',
    error: 'BLOQUEAR las rodillas arriba. Nunca extiendas del todo bajo carga.',
    video: 'leg press form knees',
  },
  pmr: {
    id: 'pmr',
    name: 'Peso muerto rumano con mancuernas',
    muscle: 'Femoral · Glúteo · Lumbar',
    cue: 'Bisagra de CADERA, no de espalda. Empuja el trasero hacia atrás. Mancuernas rozando las piernas. Baja hasta sentir estirón en femoral.',
    error: 'Redondear la espalda baja. Si no puedes mantenerla neutra, no bajes más.',
    video: 'romanian deadlift dumbbell form',
  },
  hipThrust: {
    id: 'hipThrust',
    name: 'Hip thrust',
    muscle: 'Glúteo',
    cue: 'Espalda alta apoyada en banco. Empuja con talones hasta que el torso quede paralelo al piso. Aprieta 1 s.',
    error: 'Hiperextender la lumbar arriba. Termina el movimiento con el glúteo, no con la espalda.',
    video: 'hip thrust form glutes',
  },
  curlFemoral: {
    id: 'curlFemoral',
    name: 'Curl femoral en máquina',
    muscle: 'Femoral',
    cue: 'Cadera pegada a la almohadilla. Pausa 1 s arriba, baja en 3 s.',
    video: 'lying leg curl form',
  },
  extCuadriceps: {
    id: 'extCuadriceps',
    name: 'Extensión de cuádriceps',
    muscle: 'Cuádriceps',
    cue: 'Pausa de 1 s con la pierna extendida y el cuádriceps contraído al máximo.',
    video: 'leg extension form',
  },
  pressMancuernas: {
    id: 'pressMancuernas',
    name: 'Press de banca con mancuernas',
    muscle: 'Pecho · Tríceps · Hombro',
    cue: 'Omóplatos retraídos y hundidos. Codos a 45–70°, nunca a 90°. Baja hasta sentir estirón en el pecho.',
    error: 'Chocar las mancuernas arriba: pierdes tensión en el pecho.',
    video: 'dumbbell bench press form',
  },
  pressInclinado: {
    id: 'pressInclinado',
    name: 'Press inclinado con mancuernas',
    muscle: 'Pecho superior',
    cue: 'Banco a 30°, NO más. Es el ejercicio que más cambia cómo te queda la playera.',
    error: 'Inclinar a 45°+ convierte el ejercicio en press de hombro.',
    video: 'incline dumbbell press 30 degrees',
  },
  pressMilitar: {
    id: 'pressMilitar',
    name: 'Press militar con mancuernas',
    muscle: 'Deltoides · Tríceps',
    cue: 'Sentado, respaldo vertical. Empieza a la altura de las orejas. No bloquees los codos arriba.',
    video: 'seated dumbbell shoulder press',
  },
  elevLaterales: {
    id: 'elevLaterales',
    name: 'Elevaciones laterales',
    muscle: 'Deltoides medio',
    cue: 'Codos ligeramente flexionados. Sube SOLO hasta la altura del hombro. Imagina que viertes agua de una jarra.',
    error: 'Peso excesivo: acabas usando trapecio. Es el ejercicio nº1 para hombros anchos, hazlo ligero y perfecto.',
    video: 'lateral raise perfect form',
  },
  fondos: {
    id: 'fondos',
    name: 'Fondos en paralelas',
    muscle: 'Pecho inferior · Tríceps',
    cue: 'Torso ligeramente inclinado al frente para pecho, vertical para tríceps. Baja hasta hombros a la altura de codos.',
    video: 'dips form chest triceps',
  },
  extTriceps: {
    id: 'extTriceps',
    name: 'Extensión de tríceps en polea',
    muscle: 'Tríceps',
    cue: 'Codos pegados al torso e inmóviles. Solo se mueve el antebrazo.',
    video: 'triceps pushdown form',
  },
  jalonPecho: {
    id: 'jalonPecho',
    name: 'Jalón al pecho',
    muscle: 'Dorsales · Espalda',
    cue: 'Agarre amplio. Saca el pecho y jala llevando los CODOS abajo y atrás. Barra al pecho superior, nunca a la nuca.',
    error: 'Jalar detrás de la nuca: riesgo de hombro sin beneficio extra.',
    video: 'lat pulldown form',
  },
  remoMancuerna: {
    id: 'remoMancuerna',
    name: 'Remo con mancuerna a una mano',
    muscle: 'Dorsales · Romboides',
    cue: 'Rodilla y mano contraria en el banco. Jala la mancuerna hacia la CADERA, no al pecho. Rango completo.',
    video: 'one arm dumbbell row form',
  },
  remoPolea: {
    id: 'remoPolea',
    name: 'Remo sentado en polea',
    muscle: 'Espalda media · Trapecio',
    cue: 'Pecho arriba, espalda neutra. Jala al ombligo y aprieta omóplatos 1 s.',
    error: 'Balancear el torso hacia atrás para mover más peso.',
    video: 'seated cable row form',
  },
  facePull: {
    id: 'facePull',
    name: 'Face pull',
    muscle: 'Deltoides posterior · Manguito rotador',
    cue: 'Polea a la altura de la cara. Jala la cuerda hacia la frente separando las manos. Salud de hombro pura.',
    video: 'face pull form rear delt',
  },
  curlBiceps: {
    id: 'curlBiceps',
    name: 'Curl con mancuernas',
    muscle: 'Bíceps',
    cue: 'Codos pegados y fijos. Sube con el bíceps, baja en 3 s controlados.',
    video: 'dumbbell curl form',
  },
  curlMartillo: {
    id: 'curlMartillo',
    name: 'Curl martillo',
    muscle: 'Braquial · Antebrazo',
    cue: 'Agarre neutro (palmas enfrentadas). El braquial empuja al bíceps hacia arriba y lo hace ver más grande.',
    video: 'hammer curl form',
  },
  gemeloMaquina: {
    id: 'gemeloMaquina',
    name: 'Elevación de talón de pie',
    muscle: 'Gemelo',
    cue: 'Rango completo con pausa de 1 s abajo en estiramiento máximo.',
    video: 'standing calf raise form',
  },
}

// ─────────────────────────────────────────────────────────────
// FASE 1 — AGOSTO · PESO CORPORAL · 3 días (Lun/Mié/Vie)
// ─────────────────────────────────────────────────────────────

export const WORKOUTS: Record<string, Workout> = {
  f1a: {
    id: 'f1a',
    name: 'Parque · Tracción y Bíceps',
    phase: 1,
    focus: 'Espalda · Bíceps · Cuádriceps',
    durationMin: 55,
    items: [
      { exerciseId: 'dominadaSupina', rx: { sets: 4, reps: 'AMRAP', rir: 0, rest: 150, tempo: 3 },
        note: 'BAJA EN 3 SEGUNDOS CONTANDO. Venías haciéndolas rápido: la bajada lenta es la mitad del estímulo que te estabas perdiendo. Con 3 s harás menos repeticiones que antes — es normal y es mejor.' },
      { exerciseId: 'remoBarraBaja', rx: { sets: 3, reps: '8-12', rir: 1, rest: 105, tempo: 2 } },
      { exerciseId: 'bulgara', rx: { sets: 3, reps: '8-12', rir: 1, rest: 90, unilateral: true },
        note: 'Si haces 12 limpias en las 3 series, carga la mochila la próxima vez.' },
      { exerciseId: 'curlBarraBaja', rx: { sets: 3, reps: '8-12', rir: 0, rest: 75, tempo: 3 } },
      { exerciseId: 'plancha', rx: { sets: 3, reps: '45-60 s', rir: 1, rest: 45 } },
    ],
  },
  f1b: {
    id: 'f1b',
    name: 'Parque · Empuje y Tríceps',
    phase: 1,
    focus: 'Pecho · Hombros · Tríceps',
    durationMin: 55,
    items: [
      { exerciseId: 'fondoParalelas', rx: { sets: 4, reps: '6-10', rir: 1, rest: 150, tempo: 3 },
        note: 'Torso casi vertical para cargar tríceps. Bajada de 3 s. No bajes por debajo del paralelo.' },
      { exerciseId: 'flexionInclinada', rx: { sets: 3, reps: 'AMRAP', rir: 0, rest: 105, tempo: 2 },
        note: 'Baja la plancha un nivel cuando pases de 15 repeticiones.' },
      { exerciseId: 'flexionPica', rx: { sets: 3, reps: '6-12', rir: 1, rest: 90 } },
      { exerciseId: 'zancada', rx: { sets: 3, reps: '10-12', rir: 1, rest: 90, unilateral: true } },
      { exerciseId: 'flexionDiamante', rx: { sets: 3, reps: 'AMRAP', rir: 0, rest: 60 } },
      { exerciseId: 'hollow', rx: { sets: 3, reps: '20-40 s', rir: 1, rest: 45 } },
    ],
  },
  f1c: {
    id: 'f1c',
    name: 'Parque · Piernas y Espalda',
    phase: 1,
    focus: 'Full body · Cadena posterior',
    durationMin: 60,
    items: [
      { exerciseId: 'dominadaProna', rx: { sets: 4, reps: 'AMRAP', rir: 0, rest: 150, tempo: 3 },
        note: 'Agarre prono, más ancho. Piensa en llevar los codos al suelo. Bajada de 3 s.' },
      { exerciseId: 'sentadillaUna', rx: { sets: 3, reps: '6-10', rir: 1, rest: 105, unilateral: true },
        note: 'Sustituye a la sentadilla con peso corporal: a 12–15 reps ya no te supone estímulo suficiente.' },
      { exerciseId: 'remoBarraBaja', rx: { sets: 3, reps: 'AMRAP', rir: 0, rest: 90 } },
      { exerciseId: 'nordico', rx: { sets: 3, reps: '5-8', rir: 1, rest: 105, tempo: 5 },
        note: 'Femoral: el músculo que te falta por completo en lo que venías haciendo. Excéntricas muy lentas.' },
      { exerciseId: 'curlBarraBaja', rx: { sets: 3, reps: '10-15', rir: 0, rest: 60, tempo: 3 } },
      { exerciseId: 'gemelo', rx: { sets: 3, reps: '15-20', rir: 0, rest: 45, unilateral: true } },
    ],
  },

  // ── FASE 2 — SEPTIEMBRE EN ADELANTE · GIMNASIO · 4 días ──
  f2la: {
    id: 'f2la',
    name: 'Fase 2 · Pierna A',
    phase: 2,
    focus: 'Cuádriceps dominante',
    durationMin: 70,
    items: [
      { exerciseId: 'gobletSquat', rx: { sets: 4, reps: '6-10', rir: 2, rest: 150 } },
      { exerciseId: 'prensa', rx: { sets: 3, reps: '8-12', rir: 1, rest: 120 } },
      { exerciseId: 'bulgara', rx: { sets: 3, reps: '8-12', rir: 1, rest: 90, unilateral: true } },
      { exerciseId: 'extCuadriceps', rx: { sets: 3, reps: '10-15', rir: 0, rest: 60 } },
      { exerciseId: 'gemeloMaquina', rx: { sets: 4, reps: '10-15', rir: 0, rest: 60 } },
      { exerciseId: 'plancha', rx: { sets: 3, reps: '45-60 s', rir: 1, rest: 45 } },
    ],
  },
  f2ua: {
    id: 'f2ua',
    name: 'Fase 2 · Empuje',
    phase: 2,
    focus: 'Pecho · Hombros · Tríceps',
    durationMin: 70,
    items: [
      { exerciseId: 'pressMancuernas', rx: { sets: 4, reps: '6-10', rir: 2, rest: 150 } },
      { exerciseId: 'pressInclinado', rx: { sets: 3, reps: '8-12', rir: 1, rest: 120 }, note: 'El que más define cómo te queda la camisa.' },
      { exerciseId: 'pressMilitar', rx: { sets: 3, reps: '8-12', rir: 1, rest: 120 } },
      { exerciseId: 'elevLaterales', rx: { sets: 4, reps: '12-18', rir: 0, rest: 60 }, note: 'Hombros anchos = silueta en V. Ligero y perfecto.' },
      { exerciseId: 'fondos', rx: { sets: 3, reps: '8-12', rir: 1, rest: 90 } },
      { exerciseId: 'extTriceps', rx: { sets: 3, reps: '10-15', rir: 0, rest: 60 } },
    ],
  },
  f2lb: {
    id: 'f2lb',
    name: 'Fase 2 · Pierna B',
    phase: 2,
    focus: 'Cadena posterior',
    durationMin: 70,
    items: [
      { exerciseId: 'pmr', rx: { sets: 4, reps: '6-10', rir: 2, rest: 150 } },
      { exerciseId: 'hipThrust', rx: { sets: 3, reps: '8-12', rir: 1, rest: 120 } },
      { exerciseId: 'curlFemoral', rx: { sets: 3, reps: '10-15', rir: 0, rest: 75 } },
      { exerciseId: 'zancada', rx: { sets: 3, reps: '10-12', rir: 1, rest: 90, unilateral: true } },
      { exerciseId: 'gemeloMaquina', rx: { sets: 3, reps: '12-15', rir: 0, rest: 60 } },
      { exerciseId: 'hollow', rx: { sets: 3, reps: '30-45 s', rir: 1, rest: 45 } },
    ],
  },
  f2ub: {
    id: 'f2ub',
    name: 'Fase 2 · Tracción',
    phase: 2,
    focus: 'Espalda · Bíceps',
    durationMin: 70,
    items: [
      { exerciseId: 'jalonPecho', rx: { sets: 4, reps: '8-12', rir: 1, rest: 120 }, note: 'Cuando hagas 12 limpias, cambia a dominadas lastradas.' },
      { exerciseId: 'remoMancuerna', rx: { sets: 4, reps: '8-12', rir: 1, rest: 120, unilateral: true } },
      { exerciseId: 'remoPolea', rx: { sets: 3, reps: '10-12', rir: 1, rest: 90 } },
      { exerciseId: 'facePull', rx: { sets: 3, reps: '15-20', rir: 1, rest: 60 }, note: 'Compensa la postura de estar sentado trabajando de noche.' },
      { exerciseId: 'curlBiceps', rx: { sets: 3, reps: '8-12', rir: 0, rest: 60 } },
      { exerciseId: 'curlMartillo', rx: { sets: 3, reps: '10-15', rir: 0, rest: 60 } },
    ],
  },
}

/** Qué comprar para multiplicar el rendimiento de la Fase 1. */
export const EQUIPO_RECOMENDADO = [
  {
    item: 'Barra de dominadas de marco de puerta',
    ru: 'турник в дверной проём',
    precio: '1 200–2 500 ₽',
    donde: 'Ozon / Wildberries / Sportmaster',
    porque:
      'La compra de mayor impacto de todo el plan. Sin ella no tienes tracción vertical y la espalda —tu prioridad para la silueta en V— se queda a medias. Convierte la Fase 1 en un programa casi completo.',
    prioridad: 1,
  },
  {
    item: 'Mochila resistente + 4 botellas de 1.5 L',
    ru: 'рюкзак',
    precio: '0 ₽ (ya la tienes)',
    donde: 'Casa',
    porque:
      'Tu sistema de carga progresiva. 6 kg de agua transforman la sentadilla búlgara de resistencia a hipertrofia real.',
    prioridad: 2,
  },
  {
    item: 'Bandas elásticas de resistencia',
    ru: 'резинки для фитнеса / эспандер',
    precio: '600–1 500 ₽',
    donde: 'Ozon',
    porque:
      'Asisten las dominadas mientras ganas fuerza y permiten face pulls para la salud del hombro.',
    prioridad: 3,
  },
  {
    item: 'Báscula corporal digital',
    ru: 'напольные весы',
    precio: '1 000–1 800 ₽',
    donde: 'Ozon / Лента',
    porque:
      'Sin medir el peso semanal, el motor de calorías de esta app no puede ajustarse. Es el sensor del sistema.',
    prioridad: 4,
  },
  {
    item: 'Báscula de cocina digital',
    ru: 'кухонные весы',
    precio: '500–900 ₽',
    donde: 'Ozon',
    porque:
      'Solo las primeras 2 semanas, para calibrar el ojo. Después estimas sin pesar.',
    prioridad: 5,
  },
]
