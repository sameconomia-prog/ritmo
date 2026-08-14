/**
 * Descarga las fotos de ejercicio desde free-exercise-db a public/ejercicios/.
 *
 * LICENCIA: el dataset yuhonas/free-exercise-db está publicado bajo The
 * Unlicense (dominio público), así que las imágenes pueden redistribuirse
 * dentro de la app sin restricción. Se descargan una vez y quedan versionadas
 * en el repo, de modo que la app funciona sin conexión y no depende de que el
 * repositorio de origen siga existiendo.
 *
 * Uso: npm run imagenes
 */
import { mkdir, writeFile, access } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..')
const DESTINO = join(RAIZ, 'public', 'ejercicios')
const BASE = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/'

/** ID interno del ejercicio → nombre en el dataset. */
export const MAPA = {
  dominadaSupina: 'Chin-Up',
  dominadaProna: 'Pullups',
  fondoParalelas: 'Dips - Triceps Version',
  remoBarraBaja: 'Inverted Row',
  flexionInclinada: 'Incline Push-Up',
  flexionDiamante: 'Push-Ups - Close Triceps Position',
  flexion: 'Pushups',
  filaInvertida: 'Inverted Row',
  bulgara: 'Split Squats',
  zancada: 'Bodyweight Walking Lunge',
  sentadillaUna: 'One Leg Barbell Squat',
  nordico: 'Natural Glute Ham Raise',
  gemelo: 'Standing Calf Raises',
  plancha: 'Plank',
  puenteGluteo: 'Single Leg Glute Bridge',
  flexionPica: 'Pike Press',
  curlMochila: 'Dumbbell Bicep Curl',
}

const existe = (p) => access(p).then(() => true, () => false)

async function main() {
  const solo = process.argv[2] // opcional: descargar un único ejercicio
  const ex = await (await fetch('https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json')).json()
  const porNombre = new Map(ex.map((e) => [e.name, e]))

  await mkdir(DESTINO, { recursive: true })
  let ok = 0
  const faltan = []

  for (const [id, nombre] of Object.entries(MAPA)) {
    if (solo && id !== solo) continue
    const e = porNombre.get(nombre)
    if (!e?.images?.length) {
      faltan.push(`${id} → "${nombre}" no está en el dataset`)
      continue
    }
    for (let i = 0; i < Math.min(2, e.images.length); i++) {
      const destino = join(DESTINO, `${id}-${i}.jpg`)
      if (await existe(destino)) { ok++; continue }
      const r = await fetch(BASE + e.images[i])
      if (!r.ok) { faltan.push(`${id} imagen ${i}: HTTP ${r.status}`); continue }
      await writeFile(destino, Buffer.from(await r.arrayBuffer()))
      ok++
    }
    console.log(`  ✓ ${id.padEnd(18)} ${nombre}`)
  }

  // Índice generado: la app sabe qué ejercicios tienen foto sin adivinar.
  const conFoto = []
  for (const id of Object.keys(MAPA)) {
    if (await existe(join(DESTINO, `${id}-0.jpg`))) conFoto.push(id)
  }
  const ts = `/**
 * GENERADO POR scripts/fetch-images.mjs — no editar a mano.
 * Ejecuta \`npm run imagenes\` para regenerarlo.
 *
 * Fotos de free-exercise-db (yuhonas/free-exercise-db), publicado bajo
 * The Unlicense — dominio público, redistribuible sin restricción.
 */
export const EJERCICIOS_CON_FOTO = new Set<string>([
${conFoto.map((id) => `  '${id}',`).join('\n')}
])

/** Ruta de la foto respetando la base del sitio (GitHub Pages sirve en /ritmo/). */
export function fotoEjercicio(id: string, indice: 0 | 1): string {
  return \`\${import.meta.env.BASE_URL}ejercicios/\${id}-\${indice}.jpg\`
}
`
  await writeFile(join(RAIZ, 'src', 'data', 'imagenes.ts'), ts)

  console.log(`\n  ${ok} imágenes en public/ejercicios/`)
  console.log(`  ${conFoto.length} ejercicios con foto → src/data/imagenes.ts`)
  if (faltan.length) {
    console.log('\n  Sin imagen (usarán solo el enlace a video):')
    faltan.forEach((f) => console.log('   · ' + f))
  }
}

main()
