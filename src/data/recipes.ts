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
  p1: {
    id: 'p1',
    slot: 'postEntreno',
    name: 'Batido de recuperación',
    time: 3,
    kcal: 420,
    protein: 34,
    carbs: 58,
    fat: 8,
    costRub: 110,
    ingredients: [
      { item: 'Leche sin lactosa', qty: '350 ml', ru: 'безлактозное молоко' },
      { item: 'Plátano', qty: '1 grande', ru: 'банан' },
      { item: 'Avena cruda', qty: '35 g', ru: 'овсяные хлопья' },
      { item: 'Tvorog sin lactosa', qty: '100 g', ru: 'безлактозный творог' },
      { item: 'Miel', qty: '1 cda', ru: 'мёд' },
      { item: 'Cacao', qty: '1 cdta', ru: 'какао' },
    ],
    steps: [
      'Todo a la licuadora.',
      '40 segundos a velocidad alta.',
      'Bébelo en los 45 minutos siguientes al entrenamiento.',
    ],
    tip: 'Si compras proteína whey, sustituye el tvorog por 1 scoop y baja la leche a 300 ml. Sale más rápido y más barato por gramo de proteína.',
    why: 'La "ventana anabólica" de 30 min es un mito (Aragon & Schoenfeld 2013): en realidad dura horas. Pero este batido cumple otra función real: te asegura una de tus 4 dosis de proteína del día en 3 minutos.',
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
}

/** Menú por día de la semana: qué receta toca en cada franja. */
export const MENU_SEMANAL: Record<number, Partial<Record<MealSlot, string>>> = {
  1: { desayuno: 'd1', comida: 'c1', postEntreno: 'p1', cena: 'n1', nocturno: 's1' },
  2: { desayuno: 'd2', comida: 'c2', cena: 'n2', nocturno: 's1' },
  3: { desayuno: 'd1', comida: 'c1', postEntreno: 'p1', cena: 'n2', nocturno: 's2' },
  4: { desayuno: 'd3', comida: 'c3', cena: 'n3', nocturno: 's1' },
  5: { desayuno: 'd1', comida: 'c2', postEntreno: 'p1', cena: 'n2', nocturno: 's1' },
  6: { preBaile: 'b1', comida: 'c1', cena: 'n1', nocturno: 's1' },
  0: { preBaile: 'b1', comida: 'c2', postEntreno: 'p1', cena: 'n3', nocturno: 's2' },
}

/** Lista de compra semanal, agrupada por pasillo. */
export const COMPRA_SEMANAL = [
  {
    seccion: 'Proteína',
    items: [
      { item: 'Pechuga de pollo', ru: 'куриная грудка', qty: '1.5 kg', rub: 480 },
      { item: 'Carne molida de res', ru: 'говяжий фарш', qty: '600 g', rub: 380 },
      { item: 'Hígado de res', ru: 'говяжья печень', qty: '250 g', rub: 90 },
      { item: 'Caballa', ru: 'скумбрия', qty: '500 g', rub: 260 },
      { item: 'Arenque', ru: 'сельдь', qty: '300 g', rub: 190 },
      { item: 'Huevos', ru: 'яйца', qty: '30 piezas', rub: 280 },
      { item: 'Tvorog SIN LACTOSA', ru: 'безлактозный творог', qty: '1.5 kg', rub: 900 },
    ],
  },
  {
    seccion: 'Lácteos',
    items: [
      { item: 'Leche sin lactosa', ru: 'безлактозное молоко', qty: '4 L', rub: 480 },
      { item: 'Kéfir sin lactosa', ru: 'безлактозный кефир', qty: '1 L', rub: 160 },
      { item: 'Smetana sin lactosa 15 %', ru: 'безлактозная сметана', qty: '400 g', rub: 190 },
      { item: 'Queso curado (lactosa casi nula)', ru: 'сыр Российский', qty: '250 g', rub: 290 },
    ],
  },
  {
    seccion: 'Carbohidratos',
    items: [
      { item: 'Trigo sarraceno', ru: 'гречка', qty: '1.5 kg', rub: 140 },
      { item: 'Avena Геркулес', ru: 'овсяные хлопья', qty: '1.5 kg', rub: 165 },
      { item: 'Arroz', ru: 'рис', qty: '1 kg', rub: 120 },
      { item: 'Papas', ru: 'картофель', qty: '3 kg', rub: 150 },
      { item: 'Pan de centeno', ru: 'хлеб ржаной', qty: '2 barras', rub: 120 },
    ],
  },
  {
    seccion: 'Verdura y fruta',
    items: [
      { item: 'Plátanos', ru: 'бананы', qty: '14 piezas', rub: 350 },
      { item: 'Manzanas', ru: 'яблоки', qty: '1 kg', rub: 120 },
      { item: 'Cebolla', ru: 'лук', qty: '1.5 kg', rub: 60 },
      { item: 'Zanahoria', ru: 'морковь', qty: '1 kg', rub: 60 },
      { item: 'Remolacha cocida', ru: 'свёкла варёная', qty: '500 g', rub: 90 },
      { item: 'Ajo', ru: 'чеснок', qty: '3 cabezas', rub: 60 },
      { item: 'Pepino', ru: 'огурец', qty: '5 piezas', rub: 150 },
      { item: 'Tomate', ru: 'помидор', qty: '5 piezas', rub: 220 },
      { item: 'Col', ru: 'капуста', qty: '1 pieza', rub: 60 },
      { item: 'Chucrut', ru: 'квашеная капуста', qty: '500 g', rub: 130 },
      { item: 'Brócoli congelado', ru: 'брокколи замороженная', qty: '700 g', rub: 240 },
      { item: 'Eneldo', ru: 'укроп', qty: '2 manojos', rub: 80 },
    ],
  },
  {
    seccion: 'Grasas y extras',
    items: [
      { item: 'Aceite de oliva', ru: 'оливковое масло', qty: '500 ml', rub: 600 },
      { item: 'Aceite de girasol', ru: 'подсолнечное масло', qty: '1 L', rub: 130 },
      { item: 'Mantequilla de cacahuate', ru: 'арахисовая паста', qty: '350 g', rub: 350 },
      { item: 'Nueces de castilla', ru: 'грецкий орех', qty: '300 g', rub: 370 },
      { item: 'Miel', ru: 'мёд', qty: '500 g', rub: 350 },
      { item: 'Cacao en polvo', ru: 'какао-порошок', qty: '200 g', rub: 150 },
      { item: 'Semillas de linaza', ru: 'семена льна', qty: '200 g', rub: 90 },
    ],
  },
]

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
