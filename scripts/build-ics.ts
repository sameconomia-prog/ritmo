/**
 * Genera public/ritmo.ics — tu plan como calendario suscribible.
 *
 * POR QUÉ EXISTE
 * Un PWA en iOS no puede programar notificaciones locales, y las notificaciones
 * push exigen un servidor con VAPID más un cron que decida cuándo mandarlas.
 * Un calendario suscrito resuelve lo mismo sin backend: iOS descarga el archivo
 * cada cierto tiempo, crea los eventos recurrentes y dispara SUS alarmas
 * nativas. Cuando yo cambio el plan y hago push, tu calendario se actualiza solo.
 *
 * Se ejecuta en cada build (`npm run build`), así que el .ics nunca se
 * desincroniza del plan que ves en la app.
 */
import { writeFileSync } from 'node:fs'
import { planDelDia, type Block } from '../src/data/plan'

const DIAS_ICS = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA']

const esc = (s: string) =>
  s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n')

/** Las líneas de un .ics no pueden pasar de 75 octetos; se pliegan con espacio. */
function plegar(linea: string): string {
  const out: string[] = []
  let resto = linea
  while (Buffer.byteLength(resto, 'utf8') > 73) {
    let corte = 73
    while (Buffer.byteLength(resto.slice(0, corte), 'utf8') > 73) corte--
    out.push(resto.slice(0, corte))
    resto = ' ' + resto.slice(corte)
  }
  out.push(resto)
  return out.join('\r\n')
}

// Ancla: un lunes cualquiera. Las recurrencias semanales parten de aquí.
const LUNES_ANCLA = new Date(Date.UTC(2026, 7, 3))

function fechaLocal(diaSemana: number, hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number)
  const d = new Date(LUNES_ANCLA)
  d.setUTCDate(d.getUTCDate() + ((diaSemana + 6) % 7))
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getUTCFullYear()}${p(d.getUTCMonth() + 1)}${p(d.getUTCDate())}T${p(h)}${p(m)}00`
}

function evento(b: Block, dia: number, i: number): string[] {
  // Solo los bloques marcados con `avisar` en plan.ts entran al calendario.
  const aviso = b.avisar
  if (aviso === undefined) return []

  const l: string[] = [
    'BEGIN:VEVENT',
    `UID:ritmo-${dia}-${i}-${b.start.replace(':', '')}@sameconomia-prog.github.io`,
    'DTSTAMP:20260807T000000Z',
    `DTSTART;TZID=Asia/Novosibirsk:${fechaLocal(dia, b.start)}`,
    `DTEND;TZID=Asia/Novosibirsk:${fechaLocal(dia, b.end === '00:00' ? '23:59' : b.end)}`,
    `RRULE:FREQ=WEEKLY;BYDAY=${DIAS_ICS[dia]}`,
    `SUMMARY:${esc(b.title)}`,
  ]
  if (b.detail) l.push(`DESCRIPTION:${esc(b.detail)}`)
  l.push(
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    `TRIGGER:-PT${aviso}M`,
    `DESCRIPTION:${esc(b.title)}`,
    'END:VALARM',
    'END:VEVENT',
  )
  return l
}

const lineas: string[] = [
  'BEGIN:VCALENDAR',
  'VERSION:2.0',
  'PRODID:-//RITMO//Plan diario//ES',
  'CALSCALE:GREGORIAN',
  'METHOD:PUBLISH',
  'X-WR-CALNAME:RITMO',
  'X-WR-TIMEZONE:Asia/Novosibirsk',
  'X-PUBLISHED-TTL:PT1H',
  'REFRESH-INTERVAL;VALUE=DURATION:PT1H',
  // Novosibirsk no aplica horario de verano desde 2011: offset fijo +07:00.
  'BEGIN:VTIMEZONE',
  'TZID:Asia/Novosibirsk',
  'BEGIN:STANDARD',
  'DTSTART:19700101T000000',
  'TZOFFSETFROM:+0700',
  'TZOFFSETTO:+0700',
  'TZNAME:+07',
  'END:STANDARD',
  'END:VTIMEZONE',
]

let total = 0
for (let dia = 0; dia < 7; dia++) {
  planDelDia(dia, 1).forEach((b, i) => {
    const ev = evento(b, dia, i)
    if (ev.length) {
      lineas.push(...ev)
      total++
    }
  })
}
lineas.push('END:VCALENDAR')

const ics = lineas.map(plegar).join('\r\n') + '\r\n'
writeFileSync(new URL('../public/ritmo.ics', import.meta.url), ics, 'utf8')
console.log(`  ✓ public/ritmo.ics — ${total} eventos recurrentes con alarma`)
