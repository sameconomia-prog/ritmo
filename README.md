# RITMO — Cuerpo, Mente y Alma

Asistente diario personal. No te dice *cómo* mejorar: te dice **qué hacer ahora mismo**,
hora por hora — qué comer (con la receta exacta), qué entrenar (con series, repeticiones
y progresión), qué estudiar (ruso y doctorado), cuándo meditar y cuándo dormir.

PWA offline-first. Se instala en el iPhone como una app nativa y guarda todo tu progreso
en el teléfono, sin cuentas ni servidores.

---

## Instalar en el iPhone

1. Abre la URL en **Safari** (no Chrome — solo Safari puede instalar PWAs en iOS).
2. Toca el botón **Compartir** (cuadrado con flecha).
3. **Añadir a pantalla de inicio**.
4. Ábrela desde el ícono. Ya funciona sin internet.

> **Importante:** instálala en la pantalla de inicio el primer día. Safari borra los datos
> de sitios web que no visitas en 7 días; las apps instaladas quedan exentas de esa limpieza.

---

## Qué hace

| Pantalla | Qué resuelve |
|---|---|
| **Hoy** | El bloque en curso con cuenta regresiva, el siguiente, y la línea de tiempo completa del día con checkboxes. |
| **Entreno** | La sesión del día con técnica, error común, escalera de progresión, registro de series y temporizador de descanso. Compara con tu última sesión y te dice qué superar. |
| **Comida** | El menú del día con recetas paso a paso, macros, costo en rublos y nombres en ruso. Más lista de compra semanal y suplementos. |
| **Estudio** | Currículo de ruso A1 de 4 semanas, enlace a tu Anki de 3 000 palabras, 5 meditaciones guiadas con temporizador y protocolos de trabajo profundo. |
| **Progreso** | Peso con gráfica de tendencia, **motor de calorías que se auto-ajusta**, progresión de fuerza por ejercicio y circunferencias corporales. |
| **Fotos** | Comparador lado a lado por pose y fecha. Las imágenes se quedan en IndexedDB, nunca salen del teléfono. |

---

## Notificaciones sin backend

Un PWA en iOS no puede programar alarmas locales, y el push real exigiría un servidor con
VAPID más un cron. La salida: **un calendario suscribible**.

`scripts/build-ics.ts` genera `public/ritmo.ics` en cada build a partir del mismo plan que
ves en la app, así que no pueden desincronizarse. Se suscribe una vez desde **Ajustes →
Notificaciones** y iOS dispara sus alarmas nativas; cuando cambia el plan y se hace push,
el calendario se actualiza solo.

Solo llevan alarma los bloques marcados con `avisar` en `plan.ts` — 38 eventos semanales,
unos 5 al día. Si todo avisara, el calendario acabaría silenciado y no serviría de nada.

> Al suscribir, iOS pregunta si eliminar las alertas. Hay que decir que **no**: sin ellas el
> calendario aparece pero nunca avisa.

---

## Horarios

Todo el plan está en **hora local de Novosibirsk (UTC+7)**, que va **13 horas adelante de
Ciudad de México**. Por eso la jornada de trabajo 20:30–01:30 local cubre las 07:30–12:30
mexicanas y las juntas de la 01:00 caen al mediodía de México.

Estructura del día entre semana:

| Franja | Bloque |
|---|---|
| 09:30–10:45 | Despertar → parque → **meditación en el columpio** → regreso |
| 10:45–11:15 | Desayuno |
| 11:15–12:00 | Ruso (Anki + lección, mientras digieres) |
| 12:15–13:20 | **Entrenamiento** (Lun · Mié · Vie) o caminata larga (Mar · Jue) |
| 13:50–17:25 | Comida + dos bloques de proyecto doctoral |
| 20:30–01:30 | Trabajo para México + junta |
| 02:00–09:30 | Sueño consolidado 7.5 h |

---

## Las decisiones que cambian el resultado

### 1. Se elimina la carrera diaria

Correr 1.2 km todos los días era el problema, no la solución.

- **Wilson et al. 2012** (meta-análisis, 21 estudios, 422 tamaños de efecto): combinar
  fuerza con **carrera** —pero no con bicicleta— produce descensos significativos en
  hipertrofia y fuerza. Las correlaciones son negativas con la **frecuencia** del aeróbico
  (−0.26 a −0.35) y con su **duración** (−0.29 a −0.75).
- **Lundberg et al. 2022** lo confirma a nivel de fibra muscular: efecto negativo en fibras
  tipo I cuando el aeróbico es corriendo (SMD −0.81).

Sumado a 3 h 20 min de baile el fin de semana, era interferencia máxima. Se sustituye por
caminata en los días de recuperación: aporta gasto y circulación sin bloquear la hipertrofia.

### 2. Peso corporal sí construye músculo — si se lleva cerca del fallo

- **Schoenfeld et al. 2017** y **Lopez et al. 2020**: la hipertrofia es *load-independent*.
  Cargas bajas igualan a cargas altas, con la condición de que las series terminen al fallo
  o muy cerca. (La fuerza máxima sí exige carga alta; el tamaño muscular no.)
- **Robinson et al. 2024** (meta-regresión): la hipertrofia mejora conforme las series
  terminan más cerca del fallo. Por eso la Fase 1 prescribe RIR 0–1.

### 3. Entrenar por la mañana no cuesta resultados

- **Grgic et al. 2019** (meta-análisis, 11 estudios): *"los aumentos de masa muscular son
  similares sin importar la hora del día"*. Además, entrenar de mañana de forma consistente
  eleva la fuerza matinal hasta igualar la vespertina — el déficit desaparece con la costumbre.
- **Sedliak et al. 2018** (11 semanas, no entrenados): hipertrofia 8.8 % mañana vs 11.9 %
  tarde (diferencia no significativa) y fuerza **+16.9 % mañana** vs +15.2 % tarde.

La hora que sostienes durante meses gana a la hora teóricamente óptima. Único ajuste: el
calentamiento de la mañana debe ser un poco más largo, porque la temperatura corporal aún
está subiendo.

### 4. La meditación en el columpio es el bloque más valioso del día

No es un capricho — activa tres mecanismos simultáneos:

- **Luz matinal.** Crowley et al. 2014: 30 min de luz brillante al despertar producen el
  75 % del ajuste circadiano que se logra con 2 horas. Trabajando de noche, el reloj tiende
  a desfasarse; esta es la herramienta más potente para reanclarlo.
- **Balanceo rítmico.** Perrault et al. 2019 (*Current Biology*): mecerse a ~0.25 Hz
  sincroniza las oscilaciones cerebrales — *arrastre neural*. Kompotis et al. 2019 confirmó
  que el efecto depende del sistema vestibular del oído interno. El columpio es un metrónomo
  externo al que el cerebro se acopla.
- **Exterior.** El aire frío de Siberia y el espacio abierto despiertan sin cafeína.

### 5. Sueño consolidado, no bifásico

El trabajo nocturno (Lun–Jue, ~5 h para México, juntas cerca de la 01:00) fija el cierre del
día. En vez de partir el sueño en dos bloques, se consolida en 7.5 h continuas. La hormona
del crecimiento se libera sobre todo en los primeros ciclos de sueño profundo; fragmentarlo
recorta esa ventana.

---

## El motor de calorías

Ninguna fórmula acierta el gasto real de una persona: pueden errar 300 kcal en cualquier
dirección. Lo que sí es un dato duro es la tendencia del peso.

La app calcula un punto de partida con Mifflin-St Jeor y después **se corrige sola** con una
media móvil de 7 días que filtra el ruido de agua y glucógeno:

- Ganancia por debajo de **+0.25 %** del peso corporal por semana → sugiere **+200 kcal**
- Ganancia por encima de **+0.5 %** → sugiere **−150 kcal**
- Dentro del rango → no toca nada

Para 62 kg, el rango objetivo es 155–310 g por semana. Más rápido que eso es grasa.

---

## Fases

| Fase | Cuándo | Estructura |
|---|---|---|
| **1 · Peso corporal** | Agosto (sin gimnasio) | Full body 3×/semana — Lun, Mié, Vie. Progresión por dificultad de leverage, mochila cargada y cercanía al fallo. |
| **2 · Gimnasio** | Desde septiembre | Upper/Lower 4×/semana. Frecuencia 2× por grupo muscular, la prescripción mejor rankeada para hipertrofia en Currier et al. 2023. |

---

## Desarrollo

```bash
npm install
npm run icons   # regenera los íconos PWA (requiere Python + Pillow)
npm run dev     # http://localhost:5180
npm run build
```

**Stack:** React 19 · TypeScript · Vite 7 · Tailwind 4 · Dexie (IndexedDB) · vite-plugin-pwa

Los datos del dominio viven en `src/data/`:

- `plan.ts` — el horario de los 7 días, bloque por bloque
- `workouts.ts` — catálogo de ejercicios y programas de ambas fases
- `recipes.ts` — recetario, menú semanal, lista de compra y suplementos
- `content.ts` — currículo de ruso, meditaciones guiadas y protocolos de estudio

Ajustar el plan es editar esos archivos: no hay lógica escondida en los componentes.

---

## Despliegue

`git push` a `main` dispara el workflow de GitHub Actions que construye y publica en
GitHub Pages. La ruta base se resuelve sola a partir del nombre del repositorio.

### Cómo llega la actualización al teléfono

El service worker usa `skipWaiting` + `clientsClaim`, así que descarga la versión nueva en
segundo plano. Pero eso por sí solo no basta: la página ya renderizada sigue ejecutando el
bundle viejo y los cambios aparecerían hasta la *siguiente* apertura — la app iría siempre
una visita atrás. `src/pwa.ts` cierra ese hueco:

- Busca versión nueva al abrir, al volver a primer plano y cada hora.
- Si aparece con la app en segundo plano o sin nada a medio escribir → **recarga sola**.
- Si aparece mientras estás usándola → muestra un aviso y espera, para no interrumpirte a
  media serie ni borrar un campo a medio llenar.

Las actualizaciones **nunca tocan tus datos**: viven en IndexedDB y solo se reemplaza el
código de la app.

---

## Privacidad

Todo vive en tu teléfono (IndexedDB). No hay servidor, no hay cuenta, nadie más ve tus datos.
Descarga un respaldo JSON desde **Ajustes** cada par de semanas.

---

## Referencias

- Wilson JM et al. *Concurrent Training: A Meta-Analysis Examining Interference of Aerobic and Resistance Exercises.* J Strength Cond Res. 2012.
- Lundberg TR et al. *The Effects of Concurrent Aerobic and Strength Training on Muscle Fiber Hypertrophy.* Sports Med. 2022.
- Schoenfeld BJ et al. *Strength and Hypertrophy Adaptations Between Low- vs. High-Load Resistance Training.* J Strength Cond Res. 2017.
- Lopez P et al. *Resistance Training Load Effects on Muscle Hypertrophy and Strength Gain.* Med Sci Sports Exerc. 2020.
- Robinson ZP et al. *Exploring the Dose–Response Relationship Between Estimated Resistance Training Proximity to Failure, Strength Gain, and Muscle Hypertrophy.* Sports Med. 2024.
- Currier BS et al. *Resistance training prescription for muscle strength and hypertrophy in healthy adults.* Br J Sports Med. 2023.
- Morton RW et al. *Protein supplementation and resistance training-induced gains in muscle mass and strength.* Br J Sports Med. 2018.
- Res PT et al. *Protein ingestion before sleep improves postexercise overnight recovery.* Med Sci Sports Exerc. 2012.
- Areta JL et al. *Timing and distribution of protein ingestion during prolonged recovery from resistance exercise.* J Physiol. 2013.
- Kreider RB et al. *ISSN position stand: safety and efficacy of creatine supplementation.* JISSN. 2017.
- Grgic J et al. *The effects of time of day-specific resistance training on adaptations in skeletal muscle hypertrophy and muscle strength.* Chronobiol Int. 2019.
- Sedliak M et al. *Morphological, molecular and hormonal adaptations to early morning versus afternoon resistance training.* Chronobiol Int. 2018.
- Perrault AA et al. *Whole-Night Continuous Rocking Entrains Spontaneous Neural Oscillations with Benefits for Sleep and Memory.* Curr Biol. 2019.
- Kompotis K et al. *Rocking Promotes Sleep in Mice through Rhythmic Stimulation of the Vestibular System.* Curr Biol. 2019.
- Crowley SJ et al. *Phase advancing human circadian rhythms with morning bright light, afternoon melatonin, and gradually shifted sleep.* Sleep Med. 2014.
