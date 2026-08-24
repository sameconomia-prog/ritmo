/**
 * GENERADO POR scripts/fetch-images.mjs — no editar a mano.
 * Ejecuta `npm run imagenes` para regenerarlo.
 *
 * Fotos de free-exercise-db (yuhonas/free-exercise-db), publicado bajo
 * The Unlicense — dominio público, redistribuible sin restricción.
 */
export const EJERCICIOS_CON_FOTO = new Set<string>([
  'dominadaSupina',
  'dominadaProna',
  'fondoParalelas',
  'remoBarraBaja',
  'curlBarraBaja',
  'flexionInclinada',
  'flexionDiamante',
  'flexion',
  'filaInvertida',
  'bulgara',
  'zancada',
  'sentadillaUna',
  'nordico',
  'gemelo',
  'plancha',
  'planchaLateral',
  'hollow',
  'puenteGluteo',
  'flexionPica',
  'curlMochila',
  'gobletSquat',
  'prensa',
  'pmr',
  'hipThrust',
  'curlFemoral',
  'extCuadriceps',
  'pressMancuernas',
  'pressInclinado',
  'pressMilitar',
  'elevLaterales',
  'fondos',
  'extTriceps',
  'jalonPecho',
  'remoMancuerna',
  'remoPolea',
  'facePull',
  'curlBiceps',
  'curlMartillo',
  'gemeloMaquina',
])

/** Ruta de la foto respetando la base del sitio (GitHub Pages sirve en /ritmo/). */
export function fotoEjercicio(id: string, indice: 0 | 1): string {
  return `${import.meta.env.BASE_URL}ejercicios/${id}-${indice}.jpg`
}
