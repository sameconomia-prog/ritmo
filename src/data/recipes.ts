/**
 * RECETARIO — Optimizado para Rusia, para alguien que apenas cocina.
 *
 * VENTAJA ESTRATÉGICA DE RUSIA
 * -----------------------------
 * Rusia es, sin exagerar, uno de los mejores países del mundo para construir
 * músculo con poco dinero. Tres productos lo explican:
 *
 *  • ТВОРОГ (tvorog) — 18 g de proteína por 100 g, casi toda CASEÍNA de
 *    digestión lenta, a ~120 ₽/kg. En México el equivalente cuesta el triple.
 *    Res et al. 2012: 30–40 g de caseína antes de dormir eleva la síntesis
 *    proteica nocturna un 22 %.
 *  • ГРЕЧКА (trigo sarraceno) — 13 g de proteína por 100 g en seco, con lisina
 *    (el aminoácido que le falta a casi todos los cereales), magnesio alto,
 *    índice glucémico bajo, ~90 ₽/kg. No existe barato en México.
 *  • СКУМБРИЯ / СЕЛЬДЬ (caballa / arenque) — de los pescados más ricos en
 *    omega-3 del planeta, y en Rusia cuestan menos que el pollo.
 *
 * A eso se suman huevos baratos, kéfir, hígado de res (el alimento más denso en
 * micronutrientes que existe) y remolacha (nitratos → rendimiento).
 *
 * INTOLERANCIA A LA LACTOSA
 * -------------------------
 * Sam es intolerante. Eso NO elimina la estrategia de caseína nocturna: la
 * caseína es la proteína, la lactosa es el azúcar, y se pueden separar.
 *   · Творог безлактозный — la opción directa (Prostokvashino, Село Зелёное).
 *   · Творог normal + Лактазар (enzima lactasa) — más barato y muy común en
 *     Rusia. El tvorog ya pierde la mayor parte de la lactosa con el suero:
 *     unos 3-6 g por ración de 200 g, y la mayoría de intolerantes tolera
 *     hasta ~12 g en una toma (Suarez et al., NEJM 1995).
 *   · Proteína de caseína micelar en polvo — prácticamente sin lactosa.
 *   · Quesos curados (Российский, пармезан) — lactosa casi nula, pero grasos.
 * Nunca estrenar un lácteo nuevo a la 01:30: una mala noche de digestión
 * arruina justo el sueño que la caseína pretende aprovechar.
 */

export type MealSlot = 'desayuno' | 'comida' | 'postEntreno' | 'cena' | 'nocturno' | 'preBaile'

export interface Ingredient {
  item: string
  qty: string
  /** Nombre en ruso para buscarlo en la tienda. */
  ru?: string
}

export interface Recipe {
  id: string
  slot: MealSlot
  name: string
  /** Minutos de preparación real. */
  time: number
  kcal: number
  protein: number
  carbs: number
  fat: number
  ingredients: Ingredient[]
  steps: string[]
  tip?: string
  /** Por qué esta receta existe en el plan. */
  why?: string
  costRub?: number
}

export const RECIPES: Record<string, Recipe> = {
  // ══════════════ DESAYUNO ══════════════
  d1: {
    id: 'd1',
    slot: 'desayuno',
    name: 'Avena rusa con huevos',
    time: 12,
    kcal: 780,
    protein: 42,
    carbs: 92,
    fat: 26,
    costRub: 95,
    ingredients: [
      { item: 'Avena en hojuelas', qty: '90 g (1 taza)', ru: 'овсяные хлопья / Геркулес' },
      { item: 'Leche sin lactosa', qty: '350 ml', ru: 'безлактозное молоко' },
      { item: 'Plátano maduro', qty: '1 grande', ru: 'банан' },
      { item: 'Huevos', qty: '3', ru: 'яйца' },
      { item: 'Miel', qty: '1 cda', ru: 'мёд' },
      { item: 'Cacao en polvo sin azúcar', qty: '1 cdta', ru: 'какао-порошок' },
      { item: 'Mantequilla de cacahuate', qty: '1 cda', ru: 'арахисовая паста' },
      { item: 'Sal', qty: '1 pizca', ru: 'соль' },
    ],
    steps: [
      'Pon una olla pequeña con agua a hervir y mete los 3 huevos. Cuenta 8 minutos desde que rompe el hervor.',
      'En otra olla, calienta los 350 ml de leche a fuego medio. Cuando salga vapor (NO la dejes hervir), agrega la avena, el cacao y la pizca de sal.',
      'Cocina 4–5 minutos revolviendo hasta que espese. Apaga.',
      'Sirve la avena en un bowl. Encima: el plátano en rodajas, la cucharada de miel y la de mantequilla de cacahuate.',
      'Saca los huevos, pásalos por agua fría 30 segundos (se pelan solos), pélalos y cómelos al lado con sal y pimienta.',
    ],
    tip: 'El agua fría después de hervir es el truco para que la cáscara salga limpia. Si la avena queda muy espesa, un chorrito de leche fría la afloja.',
    why: 'Abre la ventana anabólica del día tras 7.5 h de ayuno nocturno. 42 g de proteína en la primera comida son clave: Areta et al. 2013 mostró que repartir la proteína en 4 dosis de ~30 g supera a concentrarla.',
  },
  d2: {
    id: 'd2',
    slot: 'desayuno',
    name: 'Sirniki express (tortitas de tvorog)',
    time: 15,
    kcal: 760,
    protein: 52,
    carbs: 78,
    fat: 24,
    costRub: 120,
    ingredients: [
      { item: 'Tvorog SIN LACTOSA 5 %', qty: '300 g', ru: 'безлактозный творог' },
      { item: 'Huevos', qty: '2', ru: 'яйца' },
      { item: 'Harina o avena molida', qty: '4 cdas', ru: 'мука / овсяная мука' },
      { item: 'Miel', qty: '1 cda', ru: 'мёд' },
      { item: 'Aceite de girasol', qty: '1 cdta', ru: 'подсолнечное масло' },
      { item: 'Smetana o yogur natural', qty: '2 cdas', ru: 'сметана' },
      { item: 'Plátano o manzana', qty: '1', ru: 'банан / яблоко' },
    ],
    steps: [
      'En un bowl aplasta el tvorog con un tenedor hasta que no queden grumos grandes.',
      'Agrega los 2 huevos, la harina y la miel. Mezcla hasta formar una masa que se despegue de las manos. Si está muy pegajosa, añade 1 cda más de harina.',
      'Forma 6 tortitas del tamaño de la palma, de 1.5 cm de grosor.',
      'Calienta la sartén a fuego MEDIO (no alto) con la cucharadita de aceite. Cocina 3–4 minutos por lado hasta que estén doradas.',
      'Sirve con la smetana encima y la fruta picada al lado.',
    ],
    tip: 'Fuego medio o se queman por fuera y quedan crudas por dentro. Puedes hacer doble porción y recalentarlas al día siguiente.',
    why: 'El desayuno clásico ruso, y resulta que es una bomba de proteína: 52 g. Si te aburre la avena, este es tu recambio sin perder macros.',
  },
  d3: {
    id: 'd3',
    slot: 'desayuno',
    name: 'Revuelto de 4 huevos con pan negro',
    time: 8,
    kcal: 740,
    protein: 40,
    carbs: 68,
    fat: 32,
    costRub: 85,
    ingredients: [
      { item: 'Huevos', qty: '4', ru: 'яйца' },
      { item: 'Pan de centeno', qty: '3 rebanadas', ru: 'хлеб ржаной' },
      { item: 'Queso ruso rallado', qty: '40 g', ru: 'сыр Российский' },
      { item: 'Tomate', qty: '1', ru: 'помидор' },
      { item: 'Cebolla', qty: '1/2', ru: 'лук' },
      { item: 'Aceite', qty: '1 cdta', ru: 'масло' },
      { item: 'Kéfir sin lactosa', qty: '250 ml', ru: 'безлактозный кефир' },
    ],
    steps: [
      'Pica la cebolla y el tomate en cubos pequeños.',
      'Calienta la sartén con la cucharadita de aceite. Sofríe la cebolla 2 minutos hasta que se ponga translúcida.',
      'Bate los 4 huevos con sal y pimienta. Viértelos en la sartén con la cebolla.',
      'Con una espátula, mueve los huevos del borde hacia el centro cada 15 segundos. Cuando estén casi cuajados (aún brillosos), agrega el tomate y el queso. Apaga: el calor residual termina la cocción.',
      'Sirve con el pan negro tostado y el kéfir en un vaso.',
    ],
    tip: 'Apagar el fuego cuando aún se ven brillosos es la diferencia entre huevos cremosos y huevos de hule.',
    why: 'El desayuno de 8 minutos para los días que despiertas tarde. El kéfir aporta probióticos y 8 g extra de proteína.',
  },

  // ══════════════ COMIDA PRINCIPAL ══════════════
  c1: {
    id: 'c1',
    slot: 'comida',
    name: 'Гречка con pollo y verduras',
    time: 25,
    kcal: 850,
    protein: 62,
    carbs: 88,
    fat: 24,
    costRub: 180,
    ingredients: [
      { item: 'Trigo sarraceno seco', qty: '110 g', ru: 'гречка' },
      { item: 'Agua', qty: '240 ml', ru: 'вода' },
      { item: 'Pechuga de pollo', qty: '220 g', ru: 'куриная грудка' },
      { item: 'Cebolla', qty: '1 mediana', ru: 'лук репчатый' },
      { item: 'Zanahoria', qty: '1 grande', ru: 'морковь' },
      { item: 'Ajo', qty: '2 dientes', ru: 'чеснок' },
      { item: 'Aceite', qty: '1 cda', ru: 'масло' },
      { item: 'Sal, pimienta, pimentón', qty: 'al gusto', ru: 'соль, перец, паприка' },
    ],
    steps: [
      'GRECHKA: en una olla pon 110 g de гречка + 240 ml de agua + sal. Tapa, lleva a hervor, baja al fuego MÍNIMO y cocina 15 minutos SIN destapar ni revolver. Apaga y deja reposar 5 min tapada.',
      'Mientras hierve: corta el pollo en cubos de 2 cm. Pica la cebolla, ralla la zanahoria, machaca el ajo.',
      'Sartén grande a fuego medio-alto con la cucharada de aceite. Sofríe la cebolla 2 min, agrega la zanahoria 3 min, luego el ajo 30 segundos.',
      'Sube el fuego y agrega el pollo. Cocina 8–10 minutos revolviendo, hasta que esté dorado por fuera y sin rosa por dentro.',
      'Sazona con sal, pimienta y pimentón. Sirve la гречка en plato hondo y el pollo encima.',
    ],
    tip: 'REGLA DE ORO: cocina SIEMPRE el doble (220 g de гречка, 440 g de pollo). La mitad va a un tupper y te resuelve la comida del día siguiente en 4 minutos. Esto te ahorra ~5 horas al mes.',
    why: 'El plato central de todo el plan. La гречка aporta 14 g de proteína adicionales a los del pollo, más magnesio (que la mayoría de la gente que entrena tiene bajo).',
  },
  c2: {
    id: 'c2',
    slot: 'comida',
    name: 'Arroz con carne molida y remolacha',
    time: 25,
    kcal: 880,
    protein: 55,
    carbs: 98,
    fat: 28,
    costRub: 190,
    ingredients: [
      { item: 'Arroz', qty: '110 g en seco', ru: 'рис' },
      { item: 'Carne molida de res', qty: '180 g', ru: 'говяжий фарш' },
      { item: 'Remolacha cocida', qty: '150 g', ru: 'свёкла' },
      { item: 'Cebolla', qty: '1', ru: 'лук' },
      { item: 'Pasta de tomate', qty: '1 cda', ru: 'томатная паста' },
      { item: 'Aceite de oliva', qty: '1 cda', ru: 'оливковое масло' },
      { item: 'Eneldo fresco', qty: 'un puño', ru: 'укроп' },
    ],
    steps: [
      'Pon el arroz a hervir con el doble de agua y sal: 18 minutos a fuego bajo, tapado.',
      'Pica la cebolla. En una sartén con medio aceite, sofríela 3 minutos.',
      'Agrega la carne molida. Deshazla con la espátula y cocina 7–8 minutos hasta que no quede rojo.',
      'Añade la cucharada de pasta de tomate y 3 cdas de agua. Cocina 3 minutos más. Sazona.',
      'Corta la remolacha ya cocida en cubos, mézclala con el resto del aceite de oliva y el eneldo picado.',
      'Sirve: arroz, carne encima, remolacha al lado.',
    ],
    tip: 'La remolacha ya viene cocida y empacada al vacío en cualquier Пятёрочка (свёкла варёная). Ahorra 40 minutos de cocción.',
    why: 'Los nitratos de la remolacha mejoran la eficiencia del oxígeno y el rendimiento de resistencia. Ideal el sábado, antes del domingo largo de baile.',
  },
  c3: {
    id: 'c3',
    slot: 'comida',
    name: 'Hígado de res a la rusa con puré',
    time: 30,
    kcal: 820,
    protein: 60,
    carbs: 82,
    fat: 26,
    costRub: 130,
    ingredients: [
      { item: 'Hígado de res', qty: '200 g', ru: 'говяжья печень' },
      { item: 'Papas', qty: '350 g', ru: 'картофель' },
      { item: 'Leche', qty: '60 ml', ru: 'молоко' },
      { item: 'Cebolla', qty: '1 grande', ru: 'лук' },
      { item: 'Smetana', qty: '2 cdas', ru: 'сметана' },
      { item: 'Harina', qty: '2 cdas', ru: 'мука' },
      { item: 'Aceite', qty: '1 cda', ru: 'масло' },
    ],
    steps: [
      'Pon las papas peladas y en trozos a hervir con sal: 20 minutos hasta que se atraviesen fácil con un cuchillo.',
      'Corta el hígado en tiras de 1 cm. Pásalas por la harina hasta cubrirlas.',
      'Sartén a fuego alto con el aceite. Sella el hígado 2 minutos por lado. NO MÁS: si se pasa, queda duro como suela.',
      'Saca el hígado. En la misma sartén sofríe la cebolla en tiras 5 minutos hasta dorar.',
      'Regresa el hígado, agrega la smetana y 3 cdas de agua. Tapa y cocina 3 minutos a fuego bajo.',
      'Escurre las papas, machácalas con la leche caliente y sal hasta hacer puré.',
    ],
    tip: 'Si el hígado te sabe fuerte, remójalo 20 minutos en leche antes de cocinarlo. Le quita el amargor por completo.',
    why: 'El alimento más denso en micronutrientes que existe: hierro hemo, B12, vitamina A y colina en cantidades que ningún multivitamínico iguala. A ~130 ₽ el plato. Una vez por semana es suficiente.',
  },

  // ══════════════ POST-ENTRENO ══════════════
  // ══════════════ EL LICUADO — LA PIEZA QUE FALTABA ══════════════
  // Reescrito 2026-08-28. Sam reportó el problema real del plan: come 3 de las
  // 5 tomas y no termina las porciones porque se llena. Un plan de 3 200 kcal
  // que solo se cumple al 60 % son 1 900 kcal reales: déficit, no superávit.
  // La saciedad es SU cuello de botella, no la disciplina.
  //
  // La respuesta con más evidencia detrás es exactamente la que él propuso:
  // CALORÍAS LÍQUIDAS. Los líquidos vacían el estómago más rápido y producen
  // mucha menos saciedad por caloría que la misma comida sólida (DiMeglio &
  // Mattes 2000; Mattes 2006). Para quien quiere adelgazar eso es una trampa;
  // para un ectomorfo que no puede terminar el plato es la herramienta.
  //
  // Este batido pasa de 420 a 900 kcal sin ser más difícil de tomar. Se bebe
  // en cinco minutos y no compite con la comida siguiente.
  p1: {
    id: 'p1',
    slot: 'postEntreno',
    name: 'Licuado de 900 · el que sí cabe',
    time: 4,
    kcal: 900,
    protein: 55,
    carbs: 107,
    fat: 29,
    costRub: 112,
    ingredients: [
      { item: 'Leche', qty: '400 ml', ru: 'молоко' },
      { item: 'Avena cruda', qty: '60 g', ru: 'овсяные хлопья' },
      { item: 'Cacahuate crudo o tostado', qty: '40 g', ru: 'арахис' },
      { item: 'Tvorog 5 %', qty: '100 g', ru: 'творог 5%' },
      { item: 'Plátano', qty: '1 grande', ru: 'банан' },
      { item: 'Miel', qty: '1 cda', ru: 'мёд' },
    ],
    steps: [
      'Todo a la licuadora, los líquidos primero: se licúa mejor y no se atasca.',
      '45 segundos a velocidad alta. La avena cruda se muele sola: no hay que cocerla.',
      'Bébelo sin prisa, pero sin dejarlo para después: si se asienta 20 minutos, espesa y cuesta el doble.',
      'SI TODAVÍA NO LLEGA LA LICUADORA: bátelo a mano en un frasco con tapa, sustituyendo la avena por 1 tetrapak de Neo o YoMilk. Queda con grumos de tvorog pero las calorías son las mismas.',
    ],
    tip: 'NO LE PONGAS HUEVO CRUDO, aunque el licuado de hace años lo llevara. Del huevo crudo solo absorbes ~51 % de la proteína contra ~91 % del cocido (Evenepoel et al. 1998): de 5 huevos crudos aprovechabas la mitad. Además la clara cruda lleva avidina, que bloquea la absorción de biotina si lo tomas a diario, y está el riesgo de salmonela. El tvorog y el cacahuate dan la misma proteína, entera y sin riesgo. Si quieres los huevos, cuécelos y cómetelos al lado: no se licúan bien.',
    why: 'Tu licuado de hace años SÍ funcionó, pero no por los huevos: funcionó porque era líquido. Beber 900 kcal no te llena como comerlas — el estómago se vacía más rápido y la señal de saciedad es mucho menor (DiMeglio & Mattes 2000). Es la única toma del día que entra cuando ya te sientes lleno. Y con cacahuate en vez de la pasta de chocolate cuesta 112 ₽ en vez de 230: la misma grasa y la misma proteína, a menos de la mitad de precio, porque la licuadora hace el trabajo que pagabas hecho.',
  },

  // ══════════════ CENA ══════════════
  n1: {
    id: 'n1',
    slot: 'cena',
    name: 'Caballa al horno con papas',
    time: 30,
    kcal: 720,
    protein: 44,
    carbs: 62,
    fat: 30,
    costRub: 150,
    ingredients: [
      { item: 'Caballa fresca o congelada', qty: '250 g', ru: 'скумбрия' },
      { item: 'Papas', qty: '300 g', ru: 'картофель' },
      { item: 'Limón', qty: '1/2', ru: 'лимон' },
      { item: 'Eneldo', qty: 'un puño', ru: 'укроп' },
      { item: 'Aceite de oliva', qty: '1 cda', ru: 'оливковое масло' },
      { item: 'Col o brócoli', qty: '150 g', ru: 'капуста / брокколи' },
    ],
    steps: [
      'Precalienta el horno a 200 °C.',
      'Corta las papas en cubos de 2 cm. Mézclalas con media cucharada de aceite y sal. Extiéndelas en una bandeja y hornea 15 minutos.',
      'Mientras: seca la caballa con papel, sazona con sal, pimienta y el jugo de medio limón. Rellénala con eneldo.',
      'Saca la bandeja, haz espacio y coloca el pescado sobre las papas. Regresa al horno 12–15 minutos más.',
      'Cuece la col o brócoli al vapor 6 minutos y sírvela al lado con el resto del aceite.',
    ],
    tip: 'El pescado está listo cuando la carne se separa en láminas al presionarla con un tenedor. Si dudas, mejor sacarlo antes que después.',
    why: 'La caballa tiene ~2.5 g de EPA+DHA por porción — cubre tu omega-3 del día sin suplemento. En Rusia cuesta menos que el pollo; en casi ningún otro país pasa eso.',
  },
  n2: {
    id: 'n2',
    slot: 'cena',
    name: 'Tushonka casera (estofado de res)',
    time: 60,
    kcal: 750,
    protein: 48,
    carbs: 64,
    fat: 32,
    costRub: 160,
    ingredients: [
      { item: 'Carne de res en cubos', qty: '500 g (rinde 3 porciones)', ru: 'говядина' },
      { item: 'Papas', qty: '3', ru: 'картофель' },
      { item: 'Zanahorias', qty: '2', ru: 'морковь' },
      { item: 'Cebolla', qty: '1 grande', ru: 'лук' },
      { item: 'Ajo', qty: '3 dientes', ru: 'чеснок' },
      { item: 'Pasta de tomate', qty: '1 cda', ru: 'томатная паста' },
      { item: 'Hoja de laurel', qty: '2', ru: 'лавровый лист' },
      { item: 'Agua', qty: '500 ml', ru: 'вода' },
    ],
    steps: [
      'En una olla grande a fuego alto, sella la carne 5 minutos hasta que se dore por fuera. No la muevas mucho: deja que agarre color.',
      'Agrega cebolla y zanahoria en trozos. Sofríe 5 minutos.',
      'Añade el ajo, la pasta de tomate y las hojas de laurel. Revuelve 1 minuto.',
      'Vierte los 500 ml de agua, lleva a hervor, tapa y baja al fuego mínimo.',
      'Cocina 40 minutos. Agrega las papas en cubos y cocina 15 minutos más.',
      'Sirve con pan de centeno.',
    ],
    tip: 'Una sola sesión de 60 minutos el domingo te da 3 cenas. Y sabe mejor al segundo día. Es la mejor inversión de tiempo de la semana.',
    why: 'Cocinas una vez, comes tres veces. La colágeno de la carne guisada aporta glicina, que además mejora la calidad del sueño (Bannai & Kawai 2012).',
  },
  n3: {
    id: 'n3',
    slot: 'cena',
    name: 'Bowl rápido de arenque y гречка',
    time: 8,
    kcal: 700,
    protein: 42,
    carbs: 66,
    fat: 28,
    costRub: 120,
    ingredients: [
      { item: 'Гречка ya cocida', qty: '250 g', ru: 'гречка' },
      { item: 'Arenque en aceite', qty: '150 g', ru: 'сельдь' },
      { item: 'Huevo cocido', qty: '2', ru: 'яйца' },
      { item: 'Pepino', qty: '1', ru: 'огурец' },
      { item: 'Chucrut', qty: '80 g', ru: 'квашеная капуста' },
      { item: 'Cebolla morada', qty: '1/4', ru: 'красный лук' },
    ],
    steps: [
      'Calienta la гречка del tupper 90 segundos en microondas con 1 cucharada de agua.',
      'Escurre el arenque y córtalo en trozos.',
      'Pica el pepino y la cebolla morada finita.',
      'Arma el bowl: гречка abajo, encima el arenque, los huevos partidos a la mitad, el pepino, la cebolla y el chucrut a un lado.',
    ],
    tip: 'La cena de 8 minutos para los días que llegas cansado antes de trabajar. Cero cocción real.',
    why: 'El chucrut aporta probióticos y vitamina C que el invierno ruso te va a robar. El arenque, otra ronda de omega-3 casi regalado.',
  },

  // ══════════════ SNACK NOCTURNO (CASEÍNA) ══════════════
  s1: {
    id: 's1',
    slot: 'nocturno',
    name: 'Tvorog nocturno',
    time: 3,
    kcal: 390,
    protein: 38,
    carbs: 30,
    fat: 14,
    costRub: 90,
    ingredients: [
      { item: 'Tvorog SIN LACTOSA 5 %', qty: '220 g', ru: 'безлактозный творог' },
      { item: 'Miel', qty: '1 cda', ru: 'мёд' },
      { item: 'Nueces de castilla', qty: '20 g', ru: 'грецкий орех' },
      { item: 'Smetana o yogur', qty: '1 cda', ru: 'сметана' },
      { item: 'Canela', qty: 'al gusto', ru: 'корица' },
    ],
    steps: [
      'Pon el tvorog en un bowl.',
      'Agrega la miel, la smetana, las nueces troceadas y la canela.',
      'Mezcla y cómelo despacio, sin pantallas, unos 45 minutos antes de dormir.',
    ],
    tip: 'Búscalo como безлактозный творог. Si no lo encuentras, творог normal + una pastilla de Лактазар con la primera cucharada funciona igual y sale más barato. Pruébalo primero de día, nunca estrenándolo a la 01:30.',
    why: 'Res et al. 2012 y Snijders et al. 2015: 30–40 g de caseína antes de dormir aumentan la síntesis proteica nocturna un 22 % y, sostenido en el tiempo, producen más masa y fuerza. Como duermes ~7.5 h en ayuno, esta comida decide si esas horas son anabólicas o catabólicas.',
  },
  s2: {
    id: 's2',
    slot: 'nocturno',
    name: 'Kéfir proteico con avena remojada',
    time: 4,
    kcal: 400,
    protein: 34,
    carbs: 44,
    fat: 10,
    costRub: 80,
    ingredients: [
      { item: 'Kéfir sin lactosa', qty: '400 ml', ru: 'безлактозный кефир' },
      { item: 'Tvorog sin lactosa', qty: '120 g', ru: 'безлактозный творог' },
      { item: 'Avena', qty: '40 g', ru: 'овсяные хлопья' },
      { item: 'Miel', qty: '1 cda', ru: 'мёд' },
      { item: 'Semillas de linaza', qty: '1 cda', ru: 'семена льна' },
    ],
    steps: [
      'Mezcla todo en un frasco con tapa.',
      'Si tienes tiempo, prepáralo en la mañana y déjalo en el refri: la avena se ablanda y queda cremoso.',
      'Cómelo con cuchara antes de dormir.',
    ],
    tip: 'Prepara 4 frascos el domingo. Toda la semana resuelta en 15 minutos de trabajo total.',
    why: 'Alternativa al tvorog sólido cuando ya no lo toleras. El kéfir suma probióticos que ayudan con la digestión de tanta proteína.',
  },


  // ══════ DESPENSA REAL — recetas con lo que Sam ya tiene en casa ══════
  // Añadidas el 2026-08-14 tras su primera compra. Sin verduras todavía:
  // cuando las compre, entran a c1/c2 y estas pasan a ser el respaldo.
  p1b: {
    id: 'p1b',
    slot: 'comida',
    name: 'Гречка con pollo y tomate (despensa)',
    time: 25,
    kcal: 800,
    protein: 70,
    carbs: 62,
    fat: 22,
    costRub: 150,
    ingredients: [
      { item: 'Trigo sarraceno en bolsita', qty: '1 bolsita (80 g)', ru: 'гречка в пакетиках' },
      { item: 'Pechuga de pollo', qty: '250 g', ru: 'куриная грудка' },
      { item: 'Pasta de tomate', qty: '2 cdas', ru: 'томатная паста' },
      { item: 'Crema agria sin lactosa', qty: '1 cda', ru: 'безлактозная сметана' },
      { item: 'Mantequilla', qty: '1 cdta', ru: 'сливочное масло' },
      { item: 'Sal', qty: 'al gusto', ru: 'соль' },
    ],
    steps: [
      'EL CICLO: LUNES se cocina en 4 raciones — 4 bolsitas de гречка y 1 kg de pollo — para comida y cena de hoy Y de mañana. VIERNES solo 2 raciones (2 bolsitas, 500 g). Las cantidades de arriba son de UNA ración.',
      'El agua arranca en el HERVIDOR ELÉCTRICO (чайник), no en la parrilla: son 15 minutos menos. Ya hirviendo, a la olla con sal y las bolsitas de гречка: 15 minutos. Al venir en bolsita no se pegan ni se pasan de agua.',
      'Mientras hierven, corta el pollo en cubos de 2 cm.',
      'Sartén a fuego medio-alto con la mantequilla. Pollo EN TANDAS de 250-330 g (lunes son 3-4 tandas), 8-10 min cada una, hasta que no quede nada rosa.',
      'Baja el fuego, junta todo el pollo. Agrega la pasta de tomate + agua (2 cdas por ración). Revuelve 2 minutos.',
      'FUERA del fuego, añade la crema agria. Si la hierves se corta.',
      'Una ración al plato: esa es la comida. El resto a tuppers y al refri: cada recalentada son 3 minutos de microondas. Lava la sartén AHORA, mientras está caliente — después cuesta el doble.',
    ],
    tip: 'Las tandas de pollo no son manía: medio kilo de golpe suelta agua, la temperatura de la sartén cae y el pollo se cuece al vapor en vez de dorarse. Son minutos extra y es la diferencia entre comer bien cuatro veces o comer correoso cuatro veces. TRUCO DE DENSIDAD (2026-08-28): si el plato te llena antes de terminarlo, no comas más volumen — hazlo más denso. Un chorro de aceite de oliva al servir son 120 kcal que no ocupan espacio, y una cucharada de mantequilla en la гречка, otras 100. Y no bebas agua durante la comida: llena el estómago con cero calorías. Bébela entre comidas.',
    why: 'El plato central de la despensa actual, cocinado para DOS días: en la parrilla eléctrica lenta de la residencia se cocina tres veces por semana, no cinco. El pollo cocido aguanta 2-3 días refrigerado sin problema. La гречка en bolsita elimina el único paso donde un principiante falla: la proporción de agua.',
  },
  p2b: {
    id: 'p2b',
    slot: 'cena',
    name: 'Penne con atún y aguacate (despensa)',
    time: 15,
    kcal: 700,
    protein: 40,
    carbs: 74,
    fat: 26,
    costRub: 140,
    ingredients: [
      { item: 'Penne', qty: '100 g', ru: 'макароны пенне' },
      { item: 'Atún en aceite, escurrido', qty: '1 lata', ru: 'тунец в масле' },
      { item: 'Pasta de tomate', qty: '2 cdas', ru: 'томатная паста' },
      { item: 'Crema agria sin lactosa', qty: '1 cda', ru: 'безлактозная сметана' },
      { item: 'Aguacate', qty: '1/2', ru: 'авокадо' },
    ],
    steps: [
      'EL CICLO: MIÉRCOLES se cocina en 4 raciones — 400 g de penne y 4 latas — para comida y cena de hoy Y de mañana. SÁBADO en la noche va sencilla (1 ración). Las cantidades de arriba son de UNA ración.',
      'El agua arranca en el HERVIDOR ELÉCTRICO, no en la parrilla. Ya hirviendo: penne con sal, 12 minutos.',
      'Escurre bien el atún: el aceite de la lata son ~150 kcal que no aportan nada.',
      'Escurre la pasta, reserva una taza del agua de cocción.',
      'En la olla: pasta + pasta de tomate + el agua reservada de a poco. Revuelve.',
      'Fuera del fuego: la crema agria y el atún desmenuzado.',
      'Una ración al plato con el aguacate en rodajas encima. El resto a tuppers. El aguacate de las otras raciones se corta AL MOMENTO de cada comida — cortado desde antes se pone negro.',
    ],
    tip: 'El agua de cocción de la pasta lleva almidón: liga la salsa mucho mejor que agua limpia.',
    why: 'La cocinada más fácil de la semana: la proteína viene de lata y solo se hierve pasta — por eso cae en miércoles, entre las dos cocinadas de pollo. El aguacate aporta las grasas monoinsaturadas del día.',
  },
  n1b: {
    id: 'n1b',
    slot: 'nocturno',
    name: 'Caseína de emergencia (sin tvorog)',
    time: 3,
    kcal: 580,
    protein: 35,
    carbs: 28,
    fat: 34,
    costRub: 90,
    ingredients: [
      { item: 'Leche sin lactosa', qty: '400 ml', ru: 'безлактозное молоко' },
      { item: 'Huevos cocidos', qty: '2', ru: 'яйца' },
      { item: 'Pasta de cacahuate', qty: '1 cda', ru: 'арахисовая паста' },
      { item: 'Nueces', qty: 'un puño (20 g)', ru: 'грецкий орех' },
    ],
    steps: [
      'Los huevos ya cocidos del meal prep.',
      'La leche en un vaso, la pasta de cacahuate a cucharadas o sobre pan de centeno.',
      'Cómelo despacio unos 45 minutos antes de dormir.',
    ],
    tip: 'Esto es el SUSTITUTO mientras no hay творог. En cuanto consigas творог безлактозный, vuelve a la receta principal: 38 g de proteína contra estos 35, con la mitad de grasa.',
    why: 'El 80 % de la proteína de la leche es CASEÍNA, la misma que buscamos en el творог, solo que menos concentrada. La grasa de las nueces y el cacahuate enlentece el vaciado gástrico, que es justo lo que quieres antes de dormir.',
  },

  // ══════════════ PRE-BAILE (fines de semana) ══════════════
  b1: {
    id: 'b1',
    slot: 'preBaile',
    name: 'Desayuno de carga para salsa',
    time: 15,
    kcal: 900,
    protein: 45,
    carbs: 118,
    fat: 28,
    costRub: 110,
    ingredients: [
      { item: 'Avena', qty: '120 g', ru: 'овсяные хлопья' },
      { item: 'Leche sin lactosa', qty: '400 ml', ru: 'безлактозное молоко' },
      { item: 'Huevos', qty: '3', ru: 'яйца' },
      { item: 'Plátano', qty: '2', ru: 'бананы' },
      { item: 'Miel', qty: '2 cdas', ru: 'мёд' },
      { item: 'Nueces', qty: '25 g', ru: 'грецкий орех' },
      { item: 'Sal', qty: '1 pizca (electrolitos)', ru: 'соль' },
    ],
    steps: [
      'Prepara la avena con la leche igual que el desayuno normal, pero con 120 g.',
      'Cuece los 3 huevos, 8 minutos.',
      'Agrega a la avena: 1 plátano en rodajas, 2 cdas de miel y las nueces.',
      'Cómete el segundo plátano 30 minutos antes de empezar a bailar.',
      'Llena una botella de 700 ml con agua + 1 pizca de sal + jugo de limón. Es tu bebida durante el baile.',
    ],
    tip: 'Termina de desayunar al menos 90 minutos antes de bailar, o vas a sentirte pesado en los giros.',
    why: 'Una hora de clase quema ~350 kcal; el domingo, entre las dos academias y 3 h de traslados, el gasto pasa de 1 100 kcal. Sin esta carga previa entras en déficit y el baile te consume músculo en vez de construirlo.',
  },

  // ══════ FIN DE SEMANA REAL — se come en el camión, no en casa ══════
  // Corregido el 2026-08-15. El plan anterior te hacía cocinar avena a las
  // 08:05: nunca pasó. Te levantas 8:30, tomas el camión de las 9:00 y llegas
  // a las 10:00. La única ventana de desayuno que existe de verdad son esos
  // 60 minutos sentado en el camión — y son los 60 minutos PERFECTOS, porque
  // dejan una hora exacta de digestión antes de bailar.
  //
  // 2026-08-23: la «leche proteica» dejó de ser genérica. La receta la pedía
  // pero la lista de compra nunca la incluyó, así que el sábado 22 agarró a
  // Sam sin ella. Lo resolvió solo en la tienda: Neo High Protein de
  // chocolate — 30 г белка, sin azúcar añadido, tetrapak UHT que aguanta la
  // mochila sin refrigerar. Producto confirmado → entra a COMPRA_SEMANAL.
  b2: {
    id: 'b2',
    slot: 'preBaile',
    name: 'Desayuno de camión (portátil, sin cocinar)',
    time: 2,
    kcal: 720,
    protein: 38,
    carbs: 122,
    fat: 8,
    costRub: 190,
    ingredients: [
      { item: 'Leche proteica Neo High Protein (30 g)', qty: '1 tetrapak', ru: 'Neo High Protein, шоколад' },
      { item: 'Plátanos', qty: '2', ru: 'бананы' },
      { item: 'Pan de centeno', qty: '2 rebanadas', ru: 'хлеб ржаной' },
      { item: 'Miel', qty: '1 cda (en un frasquito)', ru: 'мёд' },
    ],
    steps: [
      'ANOCHE: mete la botella, los 2 plátanos y el pan con miel en la mochila. Si no está en la mochila la noche anterior, no ocurre.',
      'Al despertar 8:30: agua, creatina y vitamina D3. Nada más — no intentes desayunar en casa, no te da el tiempo.',
      'EN EL CAMIÓN (9:00–10:00): la leche proteica y un plátano mientras haces el Anki de ruso.',
      'Pan con miel a media hora de camino si tienes más hambre.',
      'El segundo plátano guárdalo: te lo comes a las 10:40, veinte minutos antes de entrar a la clase.',
    ],
    tip: 'GRASA CERO ANTES DE BAILAR. Nada de queso, pizza ni frituras en los 90 minutos previos: la grasa es lo que más retrasa el vaciado gástrico y es exactamente lo que te deja pesado en los giros. Toda esa comida cabe perfecta a las 12:00, cuando sales.',
    why: 'Casi 40 g de proteína y 120 g de carbohidrato con solo 8 g de grasa. Digiere rápido, llega al músculo a tiempo y no te pesa. Terminar de comer 60 minutos antes de bailar es margen suficiente cuando la comida es baja en grasa; con la pizza harían falta 90 o más.',
  },
  k1: {
    id: 'k1',
    slot: 'comida',
    name: 'Comida de tienda entre clases (qué elegir)',
    time: 10,
    kcal: 800,
    protein: 45,
    carbs: 90,
    fat: 26,
    costRub: 400,
    ingredients: [
      { item: 'Proteína real — pollo asado, pescado, huevos cocidos o otra leche proteica', qty: '35–45 g de proteína', ru: 'курица гриль / яйца / протеиновый коктейль' },
      { item: 'Carbohidrato de verdad — arroz, papa, гречка, pan', qty: 'una porción grande', ru: 'рис / картофель / гречка' },
      { item: 'Fruta o jugo natural', qty: '1', ru: 'банан / сок' },
      { item: 'Agua con una pizca de sal', qty: '700 ml', ru: 'вода + соль' },
    ],
    steps: [
      'AHORA SÍ cabe lo graso: si quieres la pizza, el shawarma o el queso, es en esta comida, no en la de la mañana.',
      'Busca primero la proteína. Es lo que la comida de tienda casi nunca trae y lo que no puedes recuperar después.',
      'Un carbohidrato sólido al lado: te quedan 2 h 20 de baile el domingo y no se sostienen con pan solo.',
      'Rellena la botella. Tres horas de baile deshidratan más de lo que sientes.',
    ],
    tip: 'La trampa de la tienda rusa es el пирожок: sabe a comida completa y son casi puros carbohidratos y grasa, con 5 g de proteína. Si es lo único que hay, acompáñalo de huevos cocidos o de otra leche proteica.',
    why: 'Comer fuera no es salirse del plan: es parte del plan dos días por semana. Lo que arruina un domingo de baile no es comprar comida hecha, es comprar solo almidón y grasa y llegar a la segunda academia sin proteína desde el día anterior.',
  },

  // ══════════════ MODO ECONÓMICO — TRES RECETAS Y YA ══════════════
  // 2026-08-31. Sam se quedó sin trabajo: el presupuesto baja a 2 500 ₽ por
  // semana y pidió pocas recetas, simples, con lo barato de Пятёрочка. El
  // recetario entero se reduce a TRES platos que rotan. No es un plan peor:
  // con muslo de pollo en vez de pechuga, творог normal con Лактазар en vez
  // del безлактозный y cacahuate en vez de crema, sale la misma proteína y
  // más calorías por menos de la mitad de dinero.
  e1: {
    id: 'e1',
    slot: 'comida',
    name: 'La olla · pollo con lo que haya',
    time: 35,
    kcal: 960,
    protein: 50,
    carbs: 92,
    fat: 40,
    costRub: 78,
    ingredients: [
      { item: 'Muslo de pollo', qty: '180 g (1 ración)', ru: 'бёдра куриные' },
      { item: 'EL CARBOHIDRATO DE HOY — гречка, arroz, pasta o papa', qty: '100 g en seco', ru: 'гречка / рис / макароны / картофель' },
      { item: 'Huevo', qty: '1', ru: 'яйцо' },
      { item: 'Cebolla', qty: '1/2', ru: 'лук' },
      { item: 'Zanahoria', qty: '1', ru: 'морковь' },
      { item: 'Aceite de girasol', qty: '2 cdas', ru: 'подсолнечное масло' },
      { item: 'Sal, pimienta, lo que tengas', qty: 'al gusto', ru: 'соль, перец' },
    ],
    steps: [
      'SE COCINA PARA DOS DÍAS: multiplica todo por 4 (720 g de pollo, 400 g de carbohidrato, 4 huevos). Comida y cena de hoy y de mañana en una sola cocinada.',
      'El agua arranca en el HERVIDOR ELÉCTRICO. Con ella pones el carbohidrato de hoy a cocer y, en la misma agua o en otra olla, los huevos 8 minutos.',
      'Pica cebolla y zanahoria. Sartén con 1 cda de aceite: cebolla 2 min, zanahoria 3 min.',
      'Sube el fuego y añade el pollo en tandas (nunca más de 300 g a la vez). 10-12 minutos hasta que no quede rosa. Sazona.',
      'Junta todo. AL SERVIR, el paso que no se salta: la segunda cucharada de aceite por encima. Son 120 kcal que no ocupan espacio en el estómago.',
      'Los huevos cocidos, pelados, al lado o partidos encima. El resto a tuppers.',
    ],
    tip: 'EL CARBOHIDRATO ROTA SEGÚN EL PRECIO, no según la receta: гречка si quieres proteína extra, arroz o pasta si están en oferta, papa si es lo más barato de la semana. El plato es el mismo y las calorías casi también — compra el que esté barato ese día y ya. Si te llena antes de terminarlo: más aceite, menos volumen.',
    why: 'Una sola receta que cubre comida y cena de dos días, con la proteína más barata de la tienda. El muslo de pollo cuesta la mitad que la pechuga y trae más grasa: para ti eso es una ventaja, no un defecto — son calorías por rublo, que es exactamente lo que necesitas ahora.',
  },
  e2: {
    id: 'e2',
    slot: 'desayuno',
    name: 'Avena grande con huevos',
    time: 12,
    kcal: 885,
    protein: 37,
    carbs: 108,
    fat: 34,
    costRub: 75,
    ingredients: [
      { item: 'Avena', qty: '80 g', ru: 'овсяные хлопья' },
      { item: 'Leche', qty: '250 ml', ru: 'молоко' },
      { item: 'Huevos', qty: '2', ru: 'яйца' },
      { item: 'Plátano', qty: '1', ru: 'банан' },
      { item: 'Cacahuate', qty: '25 g', ru: 'арахис' },
      { item: 'Miel', qty: '1 cda', ru: 'мёд' },
    ],
    steps: [
      'Huevos a hervir: 8 minutos desde que rompe el hervor.',
      'La avena con la leche a fuego medio, 4-5 minutos revolviendo. Si la quieres más calórica sin más volumen, una cucharadita de aceite dentro: ni se nota y son 40 kcal.',
      'Encima: el plátano en rodajas, la miel y el cacahuate machacado con el vaso.',
      'Los huevos al lado, con sal.',
    ],
    tip: 'Si a esta hora no te entra, no te fuerces: pásala a media mañana y arranca el día con el licuado. La regla nueva es que la caloría entre, no la hora a la que entra.',
    why: 'Mil calorías por 90 ₽ y sin ingrediente de marca. El cacahuate machacado hace aquí el mismo trabajo que la crema de cacahuate a un tercio del precio.',
  },
}

/**
 * Menú por día de la semana: qué receta toca en cada franja.
 *
 * REESCRITO 2026-08-15 — APUNTA A LA DESPENSA REAL, NO A LA IDEAL.
 * Hasta hoy el menú mandaba a c1 (гречка con zanahoria), n1 (caballa al horno)
 * y n2 (estofado de res): tres recetas que Sam NO puede cocinar porque le
 * faltan la zanahoria, el pescado y la carne. Un plan que te manda a cocinar
 * algo que no tienes en el refrigerador no es un plan, es una decepción diaria.
 *
 * REESCRITO OTRA VEZ 2026-08-24 — SE COCINA CADA DOS DÍAS, NO A DIARIO.
 * El menú pedía cocinar el pollo al mediodía Y la pasta en la noche: dos
 * cocinadas diarias en la parrilla eléctrica lenta de una residencia
 * estudiantil, sin espacio para guardar gran cosa. Sam contó lo que hace de
 * verdad: cocina en grande (~90 minutos), lo que prepara le aguanta dos
 * días, y lo demás es recalentar. Eso no es una desviación del plan — es
 * mejor plan, y desde hoy es el plan:
 *
 *   · EL CICLO ES DE DOS DÍAS. Lunes se cocina гречка con pollo en 4
 *     raciones: comida y cena de lunes Y de martes. Miércoles, penne con
 *     atún en 4 raciones: miércoles y jueves. Viernes, la cocinada corta:
 *     solo 2 raciones de hoy. TRES cocinadas por semana, no cinco — y el
 *     plan diario (plan.ts) ahora tiene el bloque de cocina con nombre,
 *     hora y duración, porque 90 minutos no se esconden en un hueco.
 *   · COMIDA Y CENA SON EL MISMO PLATO y nutricionalmente no se pierde
 *     nada: lo que importa es el total del día y la proteína repartida en
 *     tomas de ~30-40 g (Areta 2013 habla de dosis por toma, no de
 *     variedad). La variedad vive entre pares de días, y el atún queda en
 *     4-5 latas semanales, dentro de lo prudente.
 *   · Sábado: la cena es el penne sencillo (15 min y la proteína de lata) —
 *     única cocinada nocturna, con la noche libre. Domingo: la cena sale
 *     del MEAL PREP de las 18:10, también una sola cocinada.
 *
 * CUANDO COMPRE zanahoria, pescado y carne: c1, n1, n2 y n3 entran al relevo
 * de pares de días, siempre respetando la regla: 4 raciones por cocinada o
 * cero cocción (n3 es bowl de lata). La lista ideal sigue intacta esperando.
 */
export const MENU_SEMANAL: Record<number, Partial<Record<MealSlot, string>>> = {
  // MODO ECONÓMICO 2026-08-31: tres recetas y ya. Todos los días entre semana
  // son el mismo esqueleto —avena grande, licuado, la olla dos veces— y lo
  // único que cambia es el carbohidrato de la olla, elegido por precio. Se
  // cocina lunes, miércoles y viernes; martes y jueves es tupper.
  //
  // Son CUATRO tomas, no cinco: el snack nocturno de caseína sale del menú
  // entre semana porque existía para una jornada que terminaba a la 01:30, y
  // esa jornada ya no existe. Cuatro tomas de ~900 kcal se cumplen mejor que
  // cinco de 700, que es de lo que se trata todo esto.
  1: { desayuno: 'e2', comida: 'e1', postEntreno: 'p1', cena: 'e1' }, // cocina para 2 días
  2: { desayuno: 'e2', comida: 'e1', postEntreno: 'p1', cena: 'e1' }, // tupper de ayer
  3: { desayuno: 'e2', comida: 'e1', postEntreno: 'p1', cena: 'e1' }, // cocina para 2 días
  4: { desayuno: 'e2', comida: 'e1', postEntreno: 'p1', cena: 'e1' }, // tupper de ayer
  5: { desayuno: 'e2', comida: 'e1', postEntreno: 'p1', cena: 'e1' }, // cocina para hoy
  // Fin de semana: no cocina de día. Desayuna en el camión y come en la calle.
  6: { preBaile: 'b2', comida: 'k1', cena: 'e1' },
  0: { preBaile: 'b2', comida: 'k1', postEntreno: 'p1', cena: 'e1' },
}

/**
 * Lista de compra semanal, agrupada por pasillo.
 *
 * 2026-08-24: entran atún, penne, aguacate, pasta de tomate y mantequilla —
 * el menú real (p1b/p2b) los consumía cada semana y la lista nunca los tuvo:
 * el mismo hueco que tuvo la leche proteica del camión. Y el pollo sube a
 * 2 kg: con la doble porción de p1b son 7 raciones de 250 g por semana.
 */
export interface ItemCompra {
  item: string
  ru: string
  qty: string
  rub: number
  /** Cómo reconocerlo en la tienda, para los productos que Sam no conoce. */
  nota?: string
}

export const COMPRA_SEMANAL: { seccion: string; items: ItemCompra[] }[] = [
  {
    seccion: 'Proteína',
    items: [
      { item: 'Muslo de pollo con hueso', ru: 'бёдра куриные / окорочка', qty: '2 kg', rub: 480,
        nota: 'EL CAMBIO QUE MÁS AHORRA. La pechuga cuesta ~400 ₽/kg; el muslo, la mitad — y para ti es MEJOR, no peor: tiene más grasa, o sea más calorías por rublo, que es justo lo que te falta. Quítale la piel si quieres, pero no hace falta. En Пятёрочка están junto a la pechuga, en bandeja amarilla.' },
      { item: 'Huevos С1', ru: 'яйца С1', qty: '30 piezas', rub: 280,
        nota: 'La proteína más barata que existe: 1.5 ₽ por gramo. Compra siempre los С1 (medianos), no los О (grandes): salen más baratos por gramo de proteína.' },
      { item: 'Tvorog 5 %', ru: 'творог 5%', qty: '600 g', rub: 200,
        nota: 'El NORMAL, no el безлактозный — este cuesta menos de la mitad. Lo tomas con Лактазар, que ya sabes que te funciona (probado el 2026-08-15). Son los 100 g diarios del licuado.' },
    ],
  },
  {
    seccion: 'Lácteos',
    items: [
      { item: 'Leche 3.2 %', ru: 'молоко 3,2%', qty: '4 L', rub: 340,
        nota: 'La entera, no la descremada: 30 kcal más por vaso al mismo precio. La normal con Лактазар sale mucho más barata que la безлактозная.' },
    ],
  },
  {
    seccion: 'Carbohidratos',
    items: [
      { item: 'Trigo sarraceno', ru: 'гречка', qty: '1.8 kg', rub: 180,
        nota: 'La caloría con proteína más barata de Rusia: 13 g de proteína por 100 g en seco. Base de la olla.' },
      { item: 'Avena Геркулес', ru: 'овсяные хлопья', qty: '1.5 kg', rub: 165,
        nota: 'Desayuno y licuado. En el licuado va CRUDA: la licuadora la muele y no hay que cocerla.' },
      { item: 'Pasta', ru: 'макароны', qty: '900 g', rub: 110 },
      { item: 'Papa', ru: 'картофель', qty: '2 kg', rub: 90 },
    ],
  },
  {
    seccion: 'Grasas — donde están tus calorías baratas',
    items: [
      { item: 'Aceite de girasol', ru: 'подсолнечное масло', qty: '1 L', rub: 130,
        nota: 'LA CALORÍA MÁS BARATA QUE EXISTE: 0.015 ₽ por kcal, seis veces más barata que la гречка y cuarenta veces más que la carne. Un litro son 8 800 kcal por 130 ₽. Dos cucharadas al servir cada plato son 240 kcal que no ocupan espacio en el estómago — tu mejor arma contra la saciedad y contra el presupuesto a la vez.' },
      { item: 'Cacahuate', ru: 'арахис', qty: '500 g', rub: 230,
        nota: 'SUSTITUYE A LA CREMA DE CACAHUATE, que cuesta 1 285 ₽/kg contra 460 el cacahuate: casi tres veces más caro por lo mismo. Con la licuadora va entero al vaso. Y si quieres la crema, hazla: 300 g de cacahuate + 1 cda de aceite, licuadora 5 minutos, parando a bajar lo de las paredes. Sale medio kilo por 140 ₽.' },
      { item: 'Miel', ru: 'мёд', qty: 'ya tienes', rub: 0 },
    ],
  },
  {
    seccion: 'Verdura y fruta',
    items: [
      { item: 'Plátanos', ru: 'бананы', qty: '10-12 piezas', rub: 200 },
      { item: 'Cebolla', ru: 'лук', qty: '1 kg', rub: 40 },
      { item: 'Zanahoria', ru: 'морковь', qty: '1 kg', rub: 45 },
      { item: 'Col', ru: 'капуста', qty: '1 pieza', rub: 50,
        nota: 'La verdura más barata del invierno ruso. Va cruda rallada al lado de la olla: aporta vitamina C y potasio por casi nada.' },
    ],
  },
  {
    seccion: 'Solo si sobra dinero',
    items: [
      { item: 'Leche proteica Neo High Protein', ru: 'Neo High Protein шоколад', qty: '1-2 tetrapaks', rub: 300,
        nota: 'Para el desayuno del camión del fin de semana. Si no entra en el presupuesto, el relevo casero es gratis: un frasco con 400 ml de leche, 2 cdas de avena, 1 cda de miel y un puño de cacahuate, batido la noche anterior. Aguanta las tres horas de camión sin refrigerar en clima frío.' },
      { item: 'Atún en aceite', ru: 'тунец в масле', qty: '2-3 latas', rub: 360,
        nota: 'La cocinada de emergencia: pasta + atún + aceite en 12 minutos. Buena para el día que no hay tiempo, pero por 120 ₽ la lata es proteína cara — el pollo cuesta la mitad por gramo.' },
      { item: 'Pasta de cacahuate con chocolate', ru: 'паста арахисовая с шоколадом', qty: '1 frasco', rub: 450,
        nota: 'Excelente producto (610 kcal y 23 g de proteína por 100 g) pero es un lujo mientras el presupuesto apriete: el cacahuate solo hace lo mismo por un tercio. Si la compras, máximo 2-3 cucharadas al día — lleva maltitol e inulina, que en cantidad hinchan.' },
    ],
  },
]

/**
 * Total de la compra semanal, sumado de la lista real y redondeado a centenas.
 * Mismo principio que kcalPlaneadas en plan.ts: un número que vive dos veces
 * acaba divergiendo — el encabezado decía 6 400 ₽ mientras la lista sumaba
 * 8 000+. Derivarlo hace imposible que se vuelvan a separar.
 */
export function totalCompra(): number {
  const suma = COMPRA_SEMANAL.filter((sec) => !sec.seccion.startsWith('Solo si')).reduce(
    (acc, sec) => acc + sec.items.reduce((s, it) => s + it.rub, 0),
    0,
  )
  return Math.round(suma / 50) * 50
}

/** Lo que cuesta la sección opcional, para que el extra se vea aparte del mínimo. */
export function totalOpcional(): number {
  const suma = COMPRA_SEMANAL.filter((sec) => sec.seccion.startsWith('Solo si')).reduce(
    (acc, sec) => acc + sec.items.reduce((s, it) => s + it.rub, 0),
    0,
  )
  return Math.round(suma / 50) * 50
}

export const SUPLEMENTOS = [
  {
    nombre: 'Creatina monohidrato',
    ru: 'креатин моногидрат',
    dosis: '5 g al día, todos los días',
    cuando: 'Con cualquier comida. No necesita fase de carga.',
    porque:
      'El suplemento con más respaldo científico que existe (Kreider et al. 2017, posicionamiento ISSN). En ectomorfos hace dos cosas: aumenta el agua intramuscular (te ves más lleno) y añade 1–2 repeticiones por serie, lo que con el tiempo es más volumen y más músculo.',
    precio: '800 ₽ / 300 g (2 meses)',
    prioridad: 1,
  },
  {
    nombre: 'Vitamina D3',
    ru: 'витамин D3 / Аквадетрим',
    dosis: '2 000 UI al día',
    cuando: 'Con el desayuno (necesita grasa para absorberse).',
    porque:
      'En Rusia, de octubre a abril, la latitud hace prácticamente imposible sintetizarla por el sol. El déficit afecta testosterona, sistema inmune y recuperación. Es el suplemento más importante por tu ubicación geográfica.',
    precio: '300–600 ₽ (3 meses)',
    prioridad: 2,
  },
  {
    nombre: 'Magnesio bisglicinato',
    ru: 'магния бисглицинат',
    dosis: '400 mg',
    cuando: '30–45 min antes de dormir.',
    porque:
      'Mejora el sueño profundo NREM-3, que es exactamente la fase donde se libera la hormona del crecimiento. Compra BISGLICINATO, no óxido: el óxido casi no se absorbe.',
    precio: '1 000 ₽ (3 meses)',
    prioridad: 3,
  },
  {
    nombre: 'Proteína whey',
    ru: 'сывороточный протеин',
    dosis: '1 scoop (30 g) post-entreno',
    cuando: 'Después de entrenar, o en el desayuno si vas con prisa.',
    porque:
      'OPCIONAL. Con tvorog, huevos, pollo y kéfir ya llegas a tus 125 g de proteína. El whey solo compra conveniencia. Si el presupuesto aprieta, este es el primero que se recorta.',
    precio: '4 000–4 500 ₽ / 2 kg',
    prioridad: 4,
  },
  {
    nombre: 'Omega-3',
    ru: 'омега-3',
    dosis: '2 g de EPA+DHA',
    cuando: 'Con la cena.',
    porque:
      'OPCIONAL EN TU CASO. Si comes caballa o arenque 3 veces por semana como marca el menú, ya cubres el requerimiento sin gastar un rublo. Cómpralo solo si dejas de comer pescado.',
    precio: '1 200 ₽ (3 meses)',
    prioridad: 5,
  },
]
