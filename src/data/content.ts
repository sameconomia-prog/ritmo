/**
 * CONTENIDO DE MENTE Y ALMA
 * Ruso (A1), meditación guiada, y protocolos de trabajo profundo para el doctorado.
 */

// ═══════════════════════════════════════════════════════════
// RUSO — Currículo A1 de 8 semanas
// ═══════════════════════════════════════════════════════════

/** Tu app de vocabulario ya existente, con 3 000 palabras y FSRS. */
export const ANKI_URL = 'https://russkiy-srs.vercel.app'

export interface LeccionRuso {
  semana: number
  dia: number // 1=Lun … 0=Dom
  tipo: 'gramatica' | 'vocabulario' | 'escucha' | 'produccion' | 'repaso' | 'inmersion'
  titulo: string
  objetivo: string
  pasos: string[]
  minutos: number
  /** Frases que debes poder decir al terminar el día. */
  frases?: { ru: string; es: string; tr: string }[]
}

export const CURRICULO_RUSO: LeccionRuso[] = [
  // ─── SEMANA 1 · Consolidar la base ───
  {
    semana: 1, dia: 1, tipo: 'gramatica', minutos: 30,
    titulo: 'El sistema de casos: por qué el ruso te confunde',
    objetivo: 'Entender QUÉ es un caso antes de memorizar terminaciones. Sin esto, todo lo demás es ruido.',
    pasos: [
      'En español el orden de la frase dice quién hace qué: "Iván ve a María" ≠ "María ve a Iván". En ruso el ORDEN casi no importa: la TERMINACIÓN de la palabra dice el papel de cada quien.',
      'Ejemplo: Иван видит Марию (Iván ve a María). Марию lleva la terminación -ю porque recibe la acción → caso ACUSATIVO.',
      'Puedes decir Марию видит Иван y significa exactamente lo mismo. La terminación manda, no la posición.',
      'Hay 6 casos. Los vas a aprender de uno en uno, por función, no memorizando tablas.',
      'Escribe en tu cuaderno los 6 nombres y su pregunta: Nominativo (¿quién?), Acusativo (¿a quién?), Genitivo (¿de quién?), Dativo (¿a quién le?), Instrumental (¿con qué?), Preposicional (¿dónde?).',
    ],
    frases: [
      { ru: 'Это мой дом', es: 'Esta es mi casa', tr: 'Eto moy dom' },
      { ru: 'Я вижу дом', es: 'Veo la casa', tr: 'Ya vizhu dom' },
    ],
  },
  {
    semana: 1, dia: 2, tipo: 'vocabulario', minutos: 30,
    titulo: 'Vocabulario de supermercado',
    objetivo: 'Comprar toda tu lista semanal sin señalar con el dedo.',
    pasos: [
      'Abre tu app de vocabulario y haz la sesión del día.',
      'Aprende estas palabras de tu lista real de compras: гречка, творог, молоко, яйца, курица, говядина, скумбрия, хлеб, картофель, лук, морковь.',
      'Aprende las cantidades: килограмм (kilo), грамм (gramo), литр (litro), штука (pieza), пачка (paquete).',
      'Practica en voz alta: "Мне нужен килограмм гречки" (necesito un kilo de trigo sarraceno).',
      'Mañana en la tienda, di al menos UNA frase completa en ruso en vez de señalar.',
    ],
    frases: [
      { ru: 'Сколько стоит?', es: '¿Cuánto cuesta?', tr: 'Skolko stoit?' },
      { ru: 'Мне нужен творог', es: 'Necesito tvorog', tr: 'Mne nuzhen tvorog' },
      { ru: 'Дайте, пожалуйста, два килограмма', es: 'Deme dos kilos, por favor', tr: 'Dayte, pozhaluysta, dva kilogramma' },
    ],
  },
  {
    semana: 1, dia: 3, tipo: 'escucha', minutos: 30,
    titulo: 'Shadowing: tu acento empieza hoy',
    objetivo: 'Entrenar el oído y la boca al mismo tiempo. Es la técnica que más acelera la pronunciación.',
    pasos: [
      'Busca en YouTube "Russian with Max — slow Russian" o el podcast "Russian Progress" (nivel A1).',
      'Elige 2 minutos de audio. Escúchalos una vez completos sin hacer nada.',
      'Segunda pasada: repite EN VOZ ALTA al mismo tiempo que el hablante, aunque no entiendas todo. Copia la melodía, no solo los sonidos.',
      'Tercera pasada: lee la transcripción mientras escuchas.',
      'Cuarta pasada: shadowing otra vez, ahora con el sentido entendido.',
      'Solo 2 minutos de audio. Repetidos 4 veces valen más que 20 minutos escuchados una vez.',
    ],
  },
  {
    semana: 1, dia: 4, tipo: 'produccion', minutos: 30,
    titulo: 'Tu primera bitácora en ruso',
    objetivo: 'Producir lenguaje propio, no solo reconocerlo. Aquí es donde se fija el aprendizaje.',
    pasos: [
      'Escribe 5 oraciones sobre tu día de HOY. Simples. Presente.',
      'Plantilla: Сегодня я + verbo. (Hoy yo + verbo)',
      'Ejemplos: Сегодня я ел гречку. Сегодня я тренировался дома. Сегодня я учил русский.',
      'No uses traductor para escribir. Escríbelas con lo que sabes, aunque queden simples.',
      'AL FINAL, pega tus 5 oraciones en ChatGPT o Yandex Translate y pide corrección. Anota los errores en una lista de "mis errores frecuentes".',
    ],
    frases: [
      { ru: 'Сегодня я тренировался', es: 'Hoy entrené', tr: 'Segodnya ya treniróvalsya' },
      { ru: 'Я живу в России', es: 'Vivo en Rusia', tr: 'Ya zhivú v Rossíi' },
      { ru: 'Я учусь в университете', es: 'Estudio en la universidad', tr: 'Ya uchús v universitéte' },
    ],
  },
  {
    semana: 1, dia: 5, tipo: 'gramatica', minutos: 30,
    titulo: 'Género: masculino, femenino, neutro',
    objetivo: 'Saber el género de cualquier sustantivo mirando su última letra. Es casi siempre automático.',
    pasos: [
      'Regla simple y con ~90 % de acierto:',
      'Termina en CONSONANTE → masculino: дом (casa), стол (mesa), хлеб (pan).',
      'Termina en -А / -Я → femenino: вода (agua), гречка, книга (libro).',
      'Termina en -О / -Е → neutro: молоко (leche), мясо (carne), окно (ventana).',
      'Termina en -Ь → puede ser cualquiera; hay que memorizarlo caso por caso.',
      'Toma 20 palabras que ya conoces y clasifícalas por género en tu cuaderno.',
      'Importa porque los adjetivos y los casos cambian según el género.',
    ],
  },
  {
    semana: 1, dia: 6, tipo: 'inmersion', minutos: 15,
    titulo: 'Inmersión ligera (día de baile)',
    objetivo: 'Mantener el contacto sin esfuerzo mental. Hoy tu energía es para la salsa.',
    pasos: [
      'Solo Anki: la sesión del día en tu app de vocabulario.',
      'Pon música rusa mientras te preparas o te transportas. Busca "Земфира", "Мумий Тролль" o "Скриптонит" en Spotify/Yandex Music.',
      'No estudies gramática hoy. El descanso cognitivo también consolida.',
    ],
  },
  {
    semana: 1, dia: 0, tipo: 'repaso', minutos: 25,
    titulo: 'Auto-test semanal',
    objetivo: 'Detectar qué se te olvidó. Lo que falles hoy es tu prioridad de la semana entrante.',
    pasos: [
      'Sin mirar nada: escribe los 6 casos y su pregunta.',
      'Escribe 10 palabras de comida en ruso, de memoria.',
      'Di en voz alta 5 oraciones sobre tu semana.',
      'Anki: sesión completa.',
      'Anota en tu cuaderno los 3 puntos que peor recordaste. Esos van al inicio de la semana 2.',
    ],
  },

  // ─── SEMANA 2 · Acusativo y presente ───
  {
    semana: 2, dia: 1, tipo: 'gramatica', minutos: 30,
    titulo: 'Caso acusativo: el objeto directo',
    objetivo: 'Poder decir "quiero X", "veo X", "como X" correctamente.',
    pasos: [
      'El acusativo responde: ¿QUÉ / A QUIÉN? Se usa con el objeto que recibe la acción.',
      'Masculino inanimado y neutro: NO CAMBIAN. Я вижу дом. Я ем молоко.',
      'Femenino en -А → -У. вода → Я пью воду. гречка → Я ем гречку.',
      'Femenino en -Я → -Ю. Мария → Я вижу Марию.',
      'Masculino ANIMADO (personas, animales) → toma la forma del genitivo. брат → Я вижу брата.',
      'Practica con 10 frases usando: хочу (quiero), ем (como), пью (bebo), вижу (veo).',
    ],
    frases: [
      { ru: 'Я ем гречку', es: 'Como trigo sarraceno', tr: 'Ya yem gréchku' },
      { ru: 'Я пью воду', es: 'Bebo agua', tr: 'Ya pyu vódu' },
      { ru: 'Я хочу курицу', es: 'Quiero pollo', tr: 'Ya jochú kurítsu' },
    ],
  },
  {
    semana: 2, dia: 2, tipo: 'vocabulario', minutos: 30,
    titulo: 'Vocabulario de gimnasio y cuerpo',
    objetivo: 'Entender a un entrenador ruso y hablar de tu entrenamiento.',
    pasos: [
      'Anki del día.',
      'Aprende: тренировка (entrenamiento), подход (serie), повторение (repetición), вес (peso), мышца (músculo), спина (espalda), ноги (piernas), грудь (pecho), плечи (hombros), руки (brazos).',
      'Aprende: тренажёрный зал / качалка (gimnasio), гантели (mancuernas), штанга (barra), турник (barra de dominadas).',
      'Frase útil para septiembre: "Можете показать, как это делать?" (¿Puede mostrarme cómo se hace esto?).',
    ],
    frases: [
      { ru: 'Сегодня я тренирую ноги', es: 'Hoy entreno piernas', tr: 'Segódnya ya treníruyu nógi' },
      { ru: 'Три подхода по десять повторений', es: 'Tres series de diez repeticiones', tr: 'Tri podjóda po désyat povtoréniy' },
    ],
  },
  {
    semana: 2, dia: 3, tipo: 'escucha', minutos: 30,
    titulo: 'Shadowing nivel 2',
    objetivo: 'Subir de 2 a 3 minutos de audio y empezar a captar palabras sueltas sin transcripción.',
    pasos: [
      'Mismo protocolo de 4 pasadas de la semana 1, con 3 minutos de audio.',
      'Antes de leer la transcripción, escribe las palabras que SÍ reconociste.',
      'Compara con la transcripción: ¿acertaste? Esto mide tu progreso real de comprensión.',
    ],
  },
  {
    semana: 2, dia: 4, tipo: 'produccion', minutos: 30,
    titulo: 'Describe tu comida en ruso',
    objetivo: 'Usar el acusativo en producción propia, que es cuando de verdad se aprende.',
    pasos: [
      'Escribe qué comiste hoy, comida por comida, usando el acusativo.',
      'Утром я ел… / Днём я ел… / Вечером я ел…',
      'Mínimo 6 oraciones. Usa el vocabulario de comida de la semana 1.',
      'Corrige con IA y añade los errores a tu lista.',
    ],
  },
  {
    semana: 2, dia: 5, tipo: 'gramatica', minutos: 30,
    titulo: 'Verbos en presente: las dos conjugaciones',
    objetivo: 'Conjugar cualquier verbo regular en presente.',
    pasos: [
      '1ª conjugación (-ать/-ять). Ejemplo делать (hacer): я делаю, ты делаешь, он делает, мы делаем, вы делаете, они делают.',
      '2ª conjugación (-ить). Ejemplo говорить (hablar): я говорю, ты говоришь, он говорит, мы говорим, вы говорите, они говорят.',
      'Fíjate en el patrón de vocales: la 1ª usa Е, la 2ª usa И.',
      'Conjuga por escrito 5 verbos: работать (trabajar), изучать (estudiar), жить (vivir), готовить (cocinar), тренироваться (entrenar).',
    ],
    frases: [
      { ru: 'Я работаю ночью', es: 'Trabajo de noche', tr: 'Ya rabótayu nóchyu' },
      { ru: 'Я готовлю ужин', es: 'Cocino la cena', tr: 'Ya gotóvlyu úzhin' },
    ],
  },
  { semana: 2, dia: 6, tipo: 'inmersion', minutos: 15, titulo: 'Inmersión ligera', objetivo: 'Mantener contacto en día de baile.', pasos: ['Anki del día.', 'Música o un video corto en ruso con subtítulos.', 'Sin gramática.'] },
  { semana: 2, dia: 0, tipo: 'repaso', minutos: 25, titulo: 'Auto-test semana 2', objetivo: 'Consolidar acusativo y presente.', pasos: ['Escribe 10 frases con acusativo, sin consultar.', 'Conjuga делать y говорить de memoria.', 'Anki completo.', 'Anota tus 3 puntos débiles.'] },

  // ─── SEMANA 3 · Preposicional ───
  {
    semana: 3, dia: 1, tipo: 'gramatica', minutos: 30,
    titulo: 'Caso preposicional: dónde estás',
    objetivo: 'Decir dónde estás, vives, trabajas o estudias.',
    pasos: [
      'Se usa SIEMPRE con las preposiciones в (en, dentro) y на (en, sobre). Nunca aparece solo.',
      'Regla casi universal: la palabra termina en -Е.',
      'Москва → в Москве. университет → в университете. работа → на работе. дом → дома (irregular, muy común).',
      'Palabras en -ИЯ / -ИЕ terminan en -ИИ: Россия → в России.',
      'Escribe 8 oraciones diciendo dónde haces cada actividad de tu día.',
    ],
    frases: [
      { ru: 'Я живу в России', es: 'Vivo en Rusia', tr: 'Ya zhivú v Rossíi' },
      { ru: 'Я учусь в университете', es: 'Estudio en la universidad', tr: 'Ya uchús v universitéte' },
      { ru: 'Я тренируюсь дома', es: 'Entreno en casa', tr: 'Ya treniryúys dóma' },
    ],
  },
  { semana: 3, dia: 2, tipo: 'vocabulario', minutos: 30, titulo: 'Vocabulario académico', objetivo: 'Hablar de tu doctorado.', pasos: ['Anki del día.', 'Aprende: университет, аспирантура (doctorado), исследование (investigación), статья (artículo), научный руководитель (director de tesis), диссертация, лекция, семинар, экзамен.', 'Prepara 3 frases para presentarte académicamente.'], frases: [{ ru: 'Я аспирант', es: 'Soy estudiante de doctorado', tr: 'Ya aspiránt' }, { ru: 'Я пишу диссертацию', es: 'Escribo mi tesis', tr: 'Ya pishú dissertátsiyu' }] },
  { semana: 3, dia: 3, tipo: 'escucha', minutos: 30, titulo: 'Shadowing + dictado', objetivo: 'Pasar de reconocer a transcribir.', pasos: ['3 minutos de audio, protocolo de 4 pasadas.', 'Añade un paso: escribe al dictado 3 oraciones que escuches.', 'Compara con la transcripción.'] },
  { semana: 3, dia: 4, tipo: 'produccion', minutos: 30, titulo: 'Tu rutina diaria completa', objetivo: 'Combinar preposicional + presente + acusativo.', pasos: ['Escribe tu día completo, de despertar a dormir, en 10 oraciones.', 'Usa marcadores de tiempo: утром, днём, вечером, ночью.', 'Corrige con IA.'] },
  { semana: 3, dia: 5, tipo: 'gramatica', minutos: 30, titulo: 'Números y horas', objetivo: 'Decir horas, precios y cantidades.', pasos: ['Aprende 1–20 y las decenas hasta 100.', 'Regla clave: después de 1 → nominativo singular; 2–4 → genitivo singular; 5+ → genitivo plural.', 'один час, два часа, пять часов.', 'Practica diciendo en voz alta todos los horarios de tu día.'], frases: [{ ru: 'Сейчас три часа', es: 'Son las tres', tr: 'Seychás tri chasá' }] },
  { semana: 3, dia: 6, tipo: 'inmersion', minutos: 15, titulo: 'Inmersión ligera', objetivo: 'Contacto sin esfuerzo.', pasos: ['Anki.', 'Música rusa.'] },
  { semana: 3, dia: 0, tipo: 'repaso', minutos: 25, titulo: 'Auto-test semana 3', objetivo: 'Consolidar preposicional y números.', pasos: ['Di dónde estás/vives/estudias sin consultar.', 'Cuenta del 1 al 20 en voz alta.', 'Anki completo.'] },

  // ─── SEMANA 4 · Genitivo ───
  {
    semana: 4, dia: 1, tipo: 'gramatica', minutos: 30,
    titulo: 'Caso genitivo: posesión, ausencia y cantidad',
    objetivo: 'El caso más usado del ruso. Con esto das un salto grande.',
    pasos: [
      'Tres usos principales: (1) posesión "de", (2) NEGACIÓN de existencia, (3) después de cantidades.',
      'Masculino: consonante → -А. дом → нет дома (no hay casa).',
      'Femenino: -А → -Ы. вода → нет воды. гречка → килограмм гречки.',
      'Uso clave: НЕТ + genitivo = "no hay". У меня нет времени (no tengo tiempo).',
      'Practica 10 frases con "у меня есть…" (tengo) y "у меня нет…" (no tengo).',
    ],
    frases: [
      { ru: 'У меня нет времени', es: 'No tengo tiempo', tr: 'U menyá net vrémeni' },
      { ru: 'Килограмм гречки, пожалуйста', es: 'Un kilo de trigo sarraceno, por favor', tr: 'Kilográm gréchki, pozháluysta' },
      { ru: 'Это книга брата', es: 'Es el libro del hermano', tr: 'Eto kníga bráta' },
    ],
  },
  { semana: 4, dia: 2, tipo: 'vocabulario', minutos: 30, titulo: 'Vocabulario de baile y música', objetivo: 'Hablar de salsa con tus compañeros.', pasos: ['Anki del día.', 'Aprende: танцевать (bailar), танец (baile), музыка, ритм, партнёр/партнёрша, шаг (paso), поворот (giro), урок (clase).', 'Frase clave: "Я танцую сальсу два раза в неделю".'], frases: [{ ru: 'Я танцую сальсу', es: 'Bailo salsa', tr: 'Ya tantsúyu sálsu' }, { ru: 'Мне нравится эта музыка', es: 'Me gusta esta música', tr: 'Mne nrávitsya eta múzyka' }] },
  { semana: 4, dia: 3, tipo: 'escucha', minutos: 30, titulo: 'Video real sin subtítulos', objetivo: 'Enfrentar ruso auténtico.', pasos: ['Busca un vlog corto ruso de cocina o gimnasio (temas que ya dominas en vocabulario).', 'Míralo SIN subtítulos primero. Anota lo que entendiste.', 'Vuelve a verlo con subtítulos en ruso.'] },
  { semana: 4, dia: 4, tipo: 'produccion', minutos: 30, titulo: 'Escribe tu lista de compras', objetivo: 'Genitivo aplicado a la vida real.', pasos: ['Escribe tu lista de compras semanal completa en ruso, con cantidades.', 'Dos kilos de X, medio litro de Y, un paquete de Z.', 'Llévala impresa o en el teléfono a la tienda.'] },
  { semana: 4, dia: 5, tipo: 'gramatica', minutos: 30, titulo: 'Repaso integrador de los 4 casos vistos', objetivo: 'Ver el sistema completo, no piezas sueltas.', pasos: ['Haz una tabla propia con: Nominativo, Acusativo, Genitivo, Preposicional.', 'Llénala para 3 palabras: дом (m), вода (f), молоко (n).', 'Escribe una frase con cada casilla.'] },
  { semana: 4, dia: 6, tipo: 'inmersion', minutos: 15, titulo: 'Inmersión ligera', objetivo: 'Contacto sin esfuerzo.', pasos: ['Anki.', 'Música rusa.'] },
  { semana: 4, dia: 0, tipo: 'repaso', minutos: 30, titulo: 'EVALUACIÓN DEL MES', objetivo: 'Medir un mes completo de progreso.', pasos: ['Graba un audio de 2 minutos hablando de ti en ruso.', 'Escúchalo. Guárdalo: dentro de 3 meses lo vas a comparar y te va a sorprender.', 'Escribe 15 oraciones usando los 4 casos.', 'Anki completo.', 'Decide si repites el ciclo con más profundidad o avanzas a dativo/instrumental.'] },
]

/** Devuelve la lección que corresponde a una semana y día. */
export function leccionDelDia(semana: number, dia: number): LeccionRuso | undefined {
  const s = ((semana - 1) % 4) + 1
  return CURRICULO_RUSO.find((l) => l.semana === s && l.dia === dia)
}

// ═══════════════════════════════════════════════════════════
// MEDITACIÓN Y REGULACIÓN
// ═══════════════════════════════════════════════════════════

export interface Meditacion {
  id: string
  nombre: string
  minutos: number
  cuando: string
  proposito: string
  /** Pasos guiados, uno por pantalla, con duración en segundos. */
  guion: { texto: string; segundos: number }[]
  ciencia?: string
}

export const MEDITACIONES: Record<string, Meditacion> = {
  columpio: {
    id: 'columpio',
    nombre: 'Meditación en el columpio',
    minutos: 25,
    cuando: 'Cada mañana, al aire libre, antes de desayunar. Es el ancla de todo el día.',
    proposito:
      'Alinear tu reloj biológico con luz real y usar el balanceo para bajar de revoluciones antes de que empiece el día.',
    ciencia:
      'Que se sienta "mágico" no es casualidad: estás activando tres mecanismos a la vez. (1) LUZ MATINAL — Crowley et al. 2014: 30 minutos de luz brillante al despertar producen el 75 % del ajuste circadiano que se logra con 2 horas. Trabajando de noche, tu reloj tiende a desfasarse, y esta es la herramienta más potente que tienes para volver a anclarlo. (2) BALANCEO RÍTMICO — Perrault et al. 2019 (Current Biology) demostró que un mecerse suave a ~0.25 Hz sincroniza las oscilaciones cerebrales, un fenómeno llamado arrastre neural; Kompotis et al. 2019 confirmó que el efecto depende del sistema vestibular del oído interno. El columpio funciona como un metrónomo externo al que tu cerebro se acopla. (3) EXTERIOR — el aire frío de Siberia y el espacio abierto amplifican el despertar sin cafeína. Lo descubriste por intuición; la fisiología te da la razón.',
    guion: [
      { texto: 'Siéntate en el columpio. No te impulses todavía. Solo llega y quédate.', segundos: 30 },
      { texto: 'Levanta la cara hacia el cielo, aunque esté nublado. Deja que la luz te dé en los ojos unos segundos. Esto es lo que le dice a tu cuerpo que el día empezó.', segundos: 45 },
      { texto: 'Tres respiraciones profundas. Nota la temperatura del aire al entrar por la nariz.', segundos: 45 },
      { texto: 'Empieza a balancearte MUY despacio. Un vaivén completo cada 4 segundos, aproximadamente. Lento, sin esfuerzo.', segundos: 60 },
      { texto: 'Sincroniza la respiración con el movimiento: inhalas cuando subes, exhalas cuando bajas. Deja que el columpio marque el ritmo por ti.', segundos: 120 },
      { texto: 'Suelta el control del conteo. Solo balanceo y respiración. Si la mente se va, el movimiento la trae de vuelta.', segundos: 180 },
      { texto: 'Amplía la atención: escucha lo más lejano que puedas oír. Después lo más cercano. Después los dos a la vez.', segundos: 150 },
      { texto: 'Nota el cuerpo en el aire. La ingravidez breve en cada extremo del arco. No hay nada que resolver en este momento.', segundos: 180 },
      { texto: 'Pregúntate: ¿cuál es LA cosa que si hago hoy, el día vale la pena? No la busques con esfuerzo. Deja que aparezca.', segundos: 90 },
      { texto: 'Visualiza tu entrenamiento de hoy. Verte haciéndolo aumenta la probabilidad real de que lo hagas.', segundos: 60 },
      { texto: 'Deja que el columpio se detenga solo. No frenes con los pies.', segundos: 60 },
      { texto: 'Quédate quieto unos segundos más antes de levantarte. Ya alineaste tu reloj, bajaste el pulso y decidiste tu día. Ahora sí: a desayunar.', segundos: 45 },
    ],
  },
  box: {
    id: 'box',
    nombre: 'Respiración cuadrada',
    minutos: 5,
    cuando: 'Antes de trabajar, o cuando la ansiedad del doctorado aprieta.',
    proposito: 'Bajar el pulso y entrar en foco en 5 minutos.',
    ciencia:
      'La respiración lenta y pautada activa el nervio vago y desplaza el sistema nervioso del modo simpático (alerta) al parasimpático (calma). Es la técnica que usan los operadores tácticos antes de una misión, por lo rápido que funciona.',
    guion: [
      { texto: 'Siéntate con la espalda recta. Pies en el piso. Manos sobre las piernas. Cierra los ojos.', segundos: 20 },
      { texto: 'Exhala todo el aire por la boca. Vacíate por completo.', segundos: 10 },
      { texto: 'Inhala por la nariz contando 4… 1, 2, 3, 4.', segundos: 4 },
      { texto: 'Retén el aire contando 4… 1, 2, 3, 4.', segundos: 4 },
      { texto: 'Exhala por la boca contando 4… 1, 2, 3, 4.', segundos: 4 },
      { texto: 'Mantén vacío contando 4… 1, 2, 3, 4.', segundos: 4 },
      { texto: 'Sigue este ciclo por tu cuenta. Cuando la mente se vaya, regresa al conteo sin juzgarte. Ese regreso ES la práctica.', segundos: 240 },
      { texto: 'Suelta el conteo. Respira normal. Abre los ojos despacio. Estás listo.', segundos: 20 },
    ],
  },
  escaneo: {
    id: 'escaneo',
    nombre: 'Escaneo corporal',
    minutos: 12,
    cuando: 'Días de descanso (martes y jueves), después de la caminata.',
    proposito: 'Recuperación del sistema nervioso y conciencia de dónde cargas tensión.',
    ciencia:
      'El escaneo corporal reduce cortisol y mejora la calidad del sueño posterior. Para alguien con horario nocturno y carga académica, es una herramienta de recuperación tan real como el descanso muscular.',
    guion: [
      { texto: 'Acuéstate boca arriba. Brazos a los lados, palmas arriba. Piernas ligeramente separadas.', segundos: 30 },
      { texto: 'Tres respiraciones profundas. Con cada exhalación siente que el cuerpo pesa más y se hunde en el piso.', segundos: 40 },
      { texto: 'Lleva la atención a los DEDOS DE LOS PIES. Sin cambiar nada, solo nota qué sensación hay. Calor, hormigueo, presión, o nada.', segundos: 50 },
      { texto: 'Sube a los pies y tobillos. Después de entrenar y bailar, aquí suele haber mucha información.', segundos: 50 },
      { texto: 'Pantorrillas y espinillas. Nota si hay tensión residual del baile.', segundos: 50 },
      { texto: 'Rodillas y muslos. Los cuádriceps y femorales que estás construyendo. Agradéceles el trabajo.', segundos: 60 },
      { texto: 'Cadera y glúteos. Suelta cualquier contracción que estés sosteniendo sin darte cuenta.', segundos: 50 },
      { texto: 'Abdomen. Deja que se expanda libre con cada inhalación. No lo metas.', segundos: 50 },
      { texto: 'Espalda baja. Aquí se acumula el estrés de estar sentado trabajando de noche. Respira hacia esa zona.', segundos: 60 },
      { texto: 'Pecho y espalda alta. Siente el corazón latiendo, sin apurarlo.', segundos: 50 },
      { texto: 'Hombros. Bájalos. Casi seguro los tenías subidos hacia las orejas.', segundos: 50 },
      { texto: 'Brazos, manos, dedos. Suéltalos por completo.', segundos: 50 },
      { texto: 'Cuello y mandíbula. Separa ligeramente los dientes. La mandíbula guarda tensión que ni notas.', segundos: 50 },
      { texto: 'Cara: frente, ojos, sienes. Deja que todo se afloje.', segundos: 50 },
      { texto: 'Ahora siente el cuerpo COMPLETO al mismo tiempo, como una sola pieza que respira.', segundos: 60 },
      { texto: 'Mueve los dedos de manos y pies. Estírate si quieres. Abre los ojos cuando estés listo.', segundos: 30 },
    ],
  },
  nsdr: {
    id: 'nsdr',
    nombre: 'NSDR — Descanso profundo sin dormir',
    minutos: 15,
    cuando: 'Cuando dormiste mal o tuviste junta hasta tarde. Sustituye una siesta.',
    proposito: 'Recuperar sin entrar en sueño profundo (y sin arruinar tu sueño nocturno).',
    ciencia:
      'El NSDR (Non-Sleep Deep Rest) restaura dopamina y capacidad cognitiva sin la inercia del sueño que deja una siesta larga. Para tu horario es superior a dormir de más por la tarde, porque no desplaza tu ritmo circadiano.',
    guion: [
      { texto: 'Acuéstate o reclínate. Si puedes, oscuridad total. Pon una alarma suave a los 15 minutos por si te duermes.', segundos: 30 },
      { texto: 'Respira: inhala por la nariz, y a mitad de la inhalación toma otra bocanada corta. Luego exhala LARGO por la boca. Repítelo 3 veces.', segundos: 60 },
      { texto: 'Deja de controlar la respiración. Que el cuerpo respire solo.', segundos: 60 },
      { texto: 'Imagina que tu cuerpo se vuelve pesado, empezando por los pies. Como si te hundieras lentamente.', segundos: 120 },
      { texto: 'La pesadez sube por las piernas. No hay nada que hacer, nada que resolver, ningún pendiente que atender ahora.', segundos: 150 },
      { texto: 'La pesadez llega al torso. Tu único trabajo en estos minutos es estar aquí.', segundos: 150 },
      { texto: 'Brazos y manos, pesados. Cabeza, pesada. Si aparecen pensamientos, déjalos pasar como coches en una avenida: no te subas.', segundos: 180 },
      { texto: 'Descansa aquí. Sin dormir, sin hacer. Solo presencia.', segundos: 180 },
      { texto: 'Empieza a volver. Mueve los dedos. Respira más profundo. Estírate.', segundos: 60 },
    ],
  },
  cierre: {
    id: 'cierre',
    nombre: 'Cierre de jornada',
    minutos: 6,
    cuando: 'Al terminar de trabajar, antes de dormir. Todos los días.',
    proposito: 'Apagar la mente de trabajo para que el sueño no se contamine de pendientes.',
    ciencia:
      'La transición abrupta de trabajo a cama es una de las causas más comunes de insomnio de conciliación. Un ritual de cierre le indica al cerebro que la jornada terminó y permite que la melatonina haga su trabajo.',
    guion: [
      { texto: 'Cierra la computadora. Físicamente. Bájale la tapa.', segundos: 15 },
      { texto: 'Escribe en papel las 3 cosas que tienes que retomar mañana. Sacarlas de la cabeza y ponerlas en papel es lo que apaga el rumiar.', segundos: 90 },
      { texto: 'Ahora escribe UNA cosa que salió bien hoy. Puede ser mínima. Entrenaste, comiste bien, avanzaste un párrafo de la tesis.', segundos: 60 },
      { texto: 'Respiración 4-7-8: inhala 4, retén 7, exhala 8. Tres ciclos. Esto baja el pulso rápido.', segundos: 60 },
      { texto: 'Luces cálidas. Pantallas fuera. Tu snack de tvorog si aún no lo comiste.', segundos: 60 },
      { texto: 'Repite mentalmente: la jornada terminó. Lo que falta, mañana. Ahora toca reconstruir el cuerpo.', segundos: 30 },
    ],
  },
  intencion: {
    id: 'intencion',
    nombre: 'Intención matutina (versión interior)',
    minutos: 4,
    cuando: 'Los días que no puedas salir al parque: ventisca, −30 °C, o se te hizo tarde.',
    proposito: 'Reemplazo de emergencia para la meditación en el columpio. Peor, pero infinitamente mejor que saltarse la mañana.',
    guion: [
      { texto: 'Siéntate en la orilla de la cama. Pies en el piso. No tomes el teléfono.', segundos: 20 },
      { texto: 'Tres respiraciones lentas y profundas.', segundos: 40 },
      { texto: 'Pregúntate: ¿cuál es LA cosa que si hago hoy, el día vale la pena?', segundos: 45 },
      { texto: 'Visualiza tu entrenamiento de hoy. Verte haciéndolo aumenta la probabilidad real de hacerlo.', segundos: 45 },
      { texto: 'Recuerda por qué haces esto: no es por vanidad. Es tener un cuerpo que te sostenga durante el doctorado, la noche de trabajo y el baile. Es energía, no espejo.', segundos: 45 },
      { texto: 'Abre las cortinas. Deja que la luz te dé en la cara 2 minutos. Eso arranca tu reloj circadiano.', segundos: 45 },
    ],
  },
}

// ═══════════════════════════════════════════════════════════
// TRABAJO PROFUNDO — Doctorado
// ═══════════════════════════════════════════════════════════

export const PROTOCOLOS_ESTUDIO = [
  {
    id: 'ultradiano',
    nombre: 'Bloque ultradiano 90/20',
    cuando: 'Escritura de tesis, análisis, lectura profunda.',
    pasos: [
      'Define ANTES de empezar qué entregarás al final del bloque. No "trabajar en la tesis", sino "terminar el borrador de la sección 3.2".',
      'Teléfono en otra habitación. No en silencio: en otra habitación.',
      '90 minutos sin interrupción. Si aparece una distracción, anótala en un papel y sigue.',
      '20 minutos de descanso REAL: caminar, mirar por la ventana, estirarte. No redes sociales, eso no descansa la atención.',
    ],
    porque:
      'Los ciclos ultradianos de ~90 minutos son la unidad natural de atención sostenida. Forzar más allá produce trabajo de baja calidad que después hay que rehacer.',
  },
  {
    id: 'pomodoro',
    nombre: 'Pomodoro 50/10',
    cuando: 'Tareas administrativas, revisión de literatura, correos.',
    pasos: [
      'Lista las tareas antes de empezar.',
      '50 minutos de trabajo, 10 de descanso.',
      'Después de 4 ciclos, descanso largo de 30 minutos.',
    ],
    porque: 'Para tareas fragmentadas, ciclos más cortos mantienen el impulso sin agotar.',
  },
  {
    id: 'recuperacion',
    nombre: 'Recuperación activa mental',
    cuando: 'Martes y jueves, tus días sin entrenamiento de fuerza.',
    pasos: [
      'Caminata de 35–45 minutos SIN audífonos.',
      'Deja que la mente divague. No escuches podcasts ni música.',
      'Lleva una libreta pequeña: las mejores ideas del doctorado aparecen aquí.',
    ],
    porque:
      'El modo de red neuronal por defecto (default mode network) se activa cuando dejas de enfocarte. Es el estado donde el cerebro conecta ideas distantes y resuelve problemas atascados. La caminata sin estímulo es la forma más confiable de provocarlo.',
  },
]
