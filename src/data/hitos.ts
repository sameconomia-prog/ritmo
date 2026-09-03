/**
 * HITOS — las fechas con nombre del plan de carrera (Carril México 2029).
 *
 * POR QUÉ EXISTE (2026-09-03)
 * plan.ts dice qué hacer a esta hora, todas las semanas igual. Esto dice qué
 * se acerca y no se repite: compuertas, fechas de sometimiento de artículos,
 * ventanas de convocatorias, exámenes, reuniones. Sam pidió que la app le
 * dijera qué hacer hoy, mañana y en el futuro, y que le avisara con tiempo.
 *
 * ES LA ÚNICA FUENTE. De aquí salen la sección «Lo que se acerca» de la
 * pantalla Hoy y el calendario public/carril-2029.ics (alarmas N días antes y
 * el mismo día a las 9:00). No hay formulario para editar: un imprevisto se le
 * dice a Claude o a Hermes («imprevisto: qué pasó → hito → nueva fecha») y
 * ellos mueven la fecha aquí, anotan el porqué en `historial`, regeneran el
 * calendario y commitean. El historial nunca se borra: es la memoria de por
 * qué el plan quedó como quedó.
 *
 * Las fechas externas (SECIHTI, ТРКИ, congresos, resultados) no se reagendan:
 * son del mundo. Las compuertas solo se mueven si Sam lo dice explícitamente.
 * El plan completo, con criterios de calidad, vive en Obsidian:
 * 01 - Proyectos/Nueva Puerta/Plan-Carril-Mexico-2029.md
 */

export type TipoHito = 'compuerta' | 'entrega' | 'convocatoria' | 'tramite' | 'reunion' | 'examen' | 'revision'

export interface Hito {
  id: string
  /** YYYY-MM-DD. */
  fecha: string
  /** YYYY-MM-DD inclusive; solo para hitos de varios días. */
  fin?: string
  titulo: string
  detalle?: string
  tipo: TipoHito
  /** Cuántos días antes empieza a avisar (app y calendario). Por defecto, según el tipo. */
  avisarDias?: number
  /** Cambios de fecha: cuándo se movió y por qué. Se añade, nunca se borra. */
  historial?: { fecha: string; nota: string }[]
}

export const TIPO_META: Record<TipoHito, { label: string; icon: string; aviso: number }> = {
  compuerta:    { label: 'Compuerta',    icon: '🚧', aviso: 14 },
  entrega:      { label: 'Entrega',      icon: '📨', aviso: 7 },
  convocatoria: { label: 'Convocatoria', icon: '📅', aviso: 7 },
  tramite:      { label: 'Trámite',      icon: '🗂️', aviso: 3 },
  reunion:      { label: 'Reunión',      icon: '🤝', aviso: 3 },
  examen:       { label: 'Examen',       icon: '🎓', aviso: 14 },
  revision:     { label: 'Revisión',     icon: '🔎', aviso: 2 },
}

const HITOS_BASE: Hito[] = [
  // ── Fase 0 · Cimientos · septiembre a diciembre de 2026 ──────────────
  { id: 'trki-inscripcion', fecha: '2026-09-11', tipo: 'tramite', titulo: 'Inscribirse al ТРКИ-1 (НГТУ)',
    detalle: 'Centro de pruebas de la НГТУ, пр. К. Маркса 20, edificio 1, oficinas 502-503. 6 000 ₽. rustest@corp.nstu.ru · +7 (383) 319-61-04.' },
  { id: 'reunion-bekareva', fecha: '2026-09-18', tipo: 'reunion', titulo: 'Reunión con Bekareva', avisarDias: 5,
    detalle: 'Plaza en el laboratorio · coautoría del artículo · reglas del consejo para publicaciones · exámenes de candidatura · práctica pedagógica. Llevar la hoja de una página, no el CV.' },
  { id: 'correo-humanitas', fecha: '2026-09-20', tipo: 'entrega', titulo: 'Correo a Humanitas: autorización de datos',
    detalle: 'Pedir autorización escrita para publicar resultados anonimizados. Sin ella, el artículo A se sustituye por C (IPEDS).' },
  { id: 'sitio-propio', fecha: '2026-10-10', fin: '2026-10-11', tipo: 'entrega', titulo: 'Sitio propio · un fin de semana',
    detalle: 'Español e inglés, nombre en cirílico, CV, líneas, publicaciones, notas. Se termina el domingo y no se vuelve a tocar salvo para publicar.' },
  { id: 'compuerta-humanitas', fecha: '2026-10-15', tipo: 'compuerta', titulo: 'Compuerta: autorización Humanitas', avisarDias: 7,
    detalle: '¿Artículo A con datos de Humanitas o C con IPEDS? Se decide hoy, con o sin respuesta.' },
  { id: 'borrador-articulo', fecha: '2026-10-31', tipo: 'entrega', titulo: 'Borrador completo del artículo · spec v2 de la tesis',
    detalle: 'Borrador de A (o C). Especificación v2 de la tesis y documento maestro al pivote IPEDS. IPEDS descargado y tabla de cierres construida.' },
  { id: 'correos-investigadores', fecha: '2026-11-15', tipo: 'entrega', titulo: 'Cinco correos a investigadores mexicanos',
    detalle: 'IISUE-UNAM, CIDE, DIE-Cinvestav, UAM-X, ANUIES/RESU. Ofrecer datos o coautoría, no pedir favores.' },
  { id: 'articulo-a-sometido', fecha: '2026-11-30', tipo: 'entrega', titulo: 'Artículo sometido', avisarDias: 10,
    detalle: 'Fecha del correo de sometimiento. «En dictamen» ya cuenta para SECIHTI.' },
  { id: 'preprint-dataset', fecha: '2026-12-15', tipo: 'entrega', titulo: 'Preprint + dataset con DOI · carta de motivos v1',
    detalle: 'MPRA (RePEc) y Zenodo. Carta SECIHTI con un párrafo por criterio.' },
  { id: 'compuerta-0', fecha: '2026-12-31', tipo: 'compuerta', titulo: 'COMPUERTA 0',
    detalle: 'Siete criterios; aprobado 4 de 7 con artículo sometido obligatorio. Ver Nueva Puerta/TABLERO.md.' },

  // ── Fase 1 · Expediente · enero a agosto de 2027 ─────────────────────
  { id: 'verificar-congresos', fecha: '2027-01-15', tipo: 'convocatoria', titulo: 'Verificar convocatorias COMIE XIX y AMECIDER 32°',
    detalle: 'Elegir una. comie.org.mx · amecider.org.' },
  { id: 'trki-examen', fecha: '2027-01-31', tipo: 'examen', titulo: 'Examen ТРКИ-1 (ventana enero-febrero)',
    detalle: 'Convierte 804 horas de aula en credencial. Fecha exacta según la sesión de la НГТУ.' },
  { id: 'resena-resu', fecha: '2027-02-28', tipo: 'entrega', titulo: 'Reseña sometida a RESU',
    detalle: 'Hasta 4 500 palabras, arbitrada, dictamen en máximo cuatro meses.' },
  { id: 'carta-interes', fecha: '2027-03-15', tipo: 'entrega', titulo: 'Carta de interés de una institución mexicana',
    detalle: 'Para el plan de reincorporación de SECIHTI. Pedida en los correos de noviembre.' },
  { id: 'secihti-apertura', fecha: '2027-03-23', tipo: 'convocatoria', titulo: 'Apertura esperada · SECIHTI Becas al Extranjero 2027', avisarDias: 14,
    detalle: 'Referencia: la convocatoria 2026 abrió el 23 de marzo. Verificar en secihti.mx.' },
  { id: 'articulo-b-sometido', fecha: '2027-04-15', tipo: 'entrega', titulo: 'Artículo B sometido · resumen de ponencia',
    detalle: 'RIES sección Contornos (o RESU).' },
  { id: 'secihti-solicitud', fecha: '2027-04-30', tipo: 'entrega', titulo: 'Solicitud SECIHTI Tipo 2 enviada', avisarDias: 14,
    detalle: 'Tres semanas antes del cierre. Tipo 2 no se puede cambiar después de firmar.' },
  { id: 'secihti-cierre', fecha: '2027-05-22', tipo: 'convocatoria', titulo: 'Cierre esperado · SECIHTI 2027',
    detalle: 'Referencia: la convocatoria 2026 cerró el 22 de mayo.' },
  { id: 'seminario-laboratorio', fecha: '2027-05-31', tipo: 'entrega', titulo: 'Seminario en el laboratorio · capítulos 1-2 entregados',
    detalle: 'Primera ponencia del expediente.' },
  { id: 'policy-brief-1', fecha: '2027-06-30', tipo: 'entrega', titulo: 'Policy brief 1 publicado y enviado',
    detalle: 'ANUIES, SEP, UNESCO-IESALC. Ponencia en extenso lista en julio.' },
  { id: 'secihti-resultados', fecha: '2027-08-03', tipo: 'convocatoria', titulo: 'Resultados esperados · SECIHTI',
    detalle: 'Referencia: 2026 publicó el 3 de agosto.' },
  { id: 'compuerta-1', fecha: '2027-08-31', tipo: 'compuerta', titulo: 'COMPUERTA 1',
    detalle: 'Seis criterios; aprobado 5 de 6 con capítulos 1-2 aprobados obligatorio.' },

  // ── Fase 2 · Producción · septiembre de 2027 a agosto de 2028 ────────
  { id: 'ponencia', fecha: '2027-11-15', tipo: 'entrega', titulo: 'Ponencia COMIE XIX o AMECIDER (fecha por confirmar)', avisarDias: 14,
    detalle: 'Virtual si el viaje no se financia. Tres contactos con seguimiento en 72 horas.' },
  { id: 'articulo-c-sometido', fecha: '2027-12-31', tipo: 'entrega', titulo: 'Artículo C sometido · capítulos 3-4', avisarDias: 14,
    detalle: 'Inglés, IPEDS. Revisiones de A y B respondidas en menos de 30 días.' },
  { id: 'compuerta-2', fecha: '2028-06-30', tipo: 'compuerta', titulo: 'COMPUERTA 2 · artículo D · brief 2 · borrador de tesis',
    detalle: 'Seis criterios; aprobado 5 de 6 con borrador completo obligatorio.' },

  // ── Fase 3 · Defensa y aterrizaje · septiembre de 2028 a julio de 2029 ─
  { id: 'predefensa', fecha: '2028-12-15', tipo: 'entrega', titulo: 'Predefensa · solicitud de posdoc por México', avisarDias: 30,
    detalle: 'Institución receptora IISUE o CIDE. Tres conversaciones con organismos.' },
  { id: 'defensa', fecha: '2029-06-30', tipo: 'examen', titulo: 'Defensa', avisarDias: 30,
    detalle: 'Кандидат экономических наук.' },
  { id: 'compuerta-3', fecha: '2029-07-31', tipo: 'compuerta', titulo: 'COMPUERTA 3 · aterrizaje en México',
    detalle: 'Grado o defensa fijada · dos o más ofertas o contratos · expediente SNII listo.' },
]

/** Revisión bimestral del plan: el día 1 de noviembre, enero, marzo, mayo, julio y septiembre. */
const REVISIONES: Hito[] = (() => {
  const out: Hito[] = []
  let y = 2026
  let m = 11
  while (y < 2029 || (y === 2029 && m <= 7)) {
    const iso = `${y}-${String(m).padStart(2, '0')}-01`
    out.push({
      id: `revision-${iso}`, fecha: iso, tipo: 'revision', titulo: 'Revisión bimestral del carril',
      detalle: 'Compuerta, patrón (construir contra exponerse), convocatorias con fecha, tres decisiones. Protocolo: Nueva Puerta/.claude/skills/revision-carril.',
    })
    m += 2
    if (m > 12) { m -= 12; y++ }
  }
  return out
})()

export const HITOS: Hito[] = [...HITOS_BASE, ...REVISIONES]

export const avisoDe = (h: Hito) => Math.max(1, h.avisarDias ?? TIPO_META[h.tipo].aviso)

export const hitosOrdenados = () => [...HITOS].sort((a, b) => a.fecha.localeCompare(b.fecha))

const aFecha = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

/** Días enteros desde `hoyISO` hasta `objetivoISO` (negativo si ya pasó). */
export function diasHasta(objetivoISO: string, hoyISO: string): number {
  return Math.round((aFecha(objetivoISO).getTime() - aFecha(hoyISO).getTime()) / 86_400_000)
}

const MES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']

export function fechaCorta(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  return `${d} ${MES[m - 1]} ${y}`
}
