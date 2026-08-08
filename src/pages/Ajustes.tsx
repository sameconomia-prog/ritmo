import { useRef } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { Link } from 'react-router-dom'
import { db, exportarDatos, importarDatos, hoyISO } from '../db'
import { EQUIPO_RECOMENDADO } from '../data/workouts'
import { Btn, Card, Pill, Porque, Section } from '../ui'

export default function Ajustes() {
  const fileRef = useRef<HTMLInputElement>(null)
  const inicio = useLiveQuery(async () => (await db.meta.get('inicio'))?.value as string | undefined)
  const fase = useLiveQuery(async () => ((await db.meta.get('fase'))?.value as number) ?? 1) ?? 1

  async function descargar() {
    const data = await exportarDatos()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `ritmo-respaldo-${hoyISO()}.json`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  async function subir(file: File) {
    try {
      const data = JSON.parse(await file.text())
      await importarDatos(data)
      alert('Respaldo restaurado correctamente.')
    } catch (e) {
      alert(`No se pudo restaurar: ${(e as Error).message}`)
    }
  }

  return (
    <div className="rise">
      <div className="mb-5 flex items-center gap-3">
        <Link to="/hoy" className="text-lg text-[var(--color-ink-dim)]">←</Link>
        <h1 className="text-2xl font-bold">Ajustes</h1>
      </div>

      <Section title="Programa">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">Inicio del programa</p>
              <p className="text-[12px] text-[var(--color-ink-dim)]">
                {inicio ?? 'Sin definir — márcalo para activar el currículo de ruso y el conteo de semanas.'}
              </p>
            </div>
            {!inicio && (
              <Btn onClick={() => db.meta.put({ key: 'inicio', value: hoyISO() })}>Empezar hoy</Btn>
            )}
          </div>
        </Card>

        <Card className="mt-2 p-4">
          <p className="text-sm font-semibold">Fase de entrenamiento</p>
          <div className="mt-2.5 space-y-2">
            {[
              { n: 1, t: 'Fase 1 · Peso corporal', d: 'Agosto. Full body 3×/semana (Lun · Mié · Vie) en casa.' },
              { n: 2, t: 'Fase 2 · Gimnasio', d: 'Desde septiembre. Upper/Lower 4×/semana con mancuernas y máquinas.' },
            ].map((f) => (
              <button
                key={f.n}
                onClick={() => db.meta.put({ key: 'fase', value: f.n })}
                className={`w-full rounded-xl border p-3 text-left transition ${
                  fase === f.n
                    ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/8'
                    : 'border-[var(--color-line)]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-semibold">{f.t}</span>
                  {fase === f.n && <Pill tone="accent">Activa</Pill>}
                </div>
                <p className="mt-0.5 text-[12px] text-[var(--color-ink-dim)]">{f.d}</p>
              </button>
            ))}
          </div>
        </Card>
      </Section>

      <Section title="Notificaciones">
        <Card className="p-4">
          <p className="text-sm font-semibold">Suscribe el plan a tu Calendario</p>
          <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--color-ink-dim)]">
            Un PWA en iPhone no puede programar alarmas por su cuenta. Pero si suscribes este calendario,
            iOS dispara <strong className="text-[var(--color-ink)]">sus alarmas nativas</strong> con los
            bloques que se te pueden pasar: despertar, columpio, entreno, ruso, proyecto, el snack de
            caseína y la salida del dormitorio los fines de semana. Cinco o seis al día, no más.
          </p>

          <a href="webcal://sameconomia-prog.github.io/ritmo/ritmo.ics" className="mt-3 block">
            <Btn className="w-full">Suscribir en el Calendario de iOS</Btn>
          </a>

          <div className="mt-3 rounded-xl bg-[var(--color-surface-2)] p-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-accent)]">
              Al suscribirte
            </p>
            <p className="mt-1 text-[13px] leading-relaxed">
              iOS te va a preguntar si quieres <strong>eliminar las alertas</strong>. Di que{' '}
              <strong className="text-[var(--color-accent)]">NO</strong>: si las eliminas, el calendario
              aparece pero nunca te avisa, que es justo lo que buscamos.
            </p>
            <p className="mt-2 text-[12px] leading-relaxed text-[var(--color-ink-dim)]">
              Si el botón no abre nada, ve a Ajustes de iOS → Apps → Calendario → Cuentas → Añadir cuenta →
              Otra → Añadir calendario suscrito, y pega:
              <br />
              <code className="mt-1 inline-block break-all text-[11px] text-[var(--color-ink)]">
                https://sameconomia-prog.github.io/ritmo/ritmo.ics
              </code>
            </p>
          </div>

          <Porque>
            El calendario se regenera en cada despliegue a partir del mismo plan que ves en la app, así que
            no pueden desincronizarse. Y iOS lo refresca solo: cuando yo ajuste un horario, tus alarmas se
            actualizan sin que hagas nada.
          </Porque>
        </Card>
      </Section>

      <Section title="Equipo recomendado">
        <div className="space-y-2">
          {EQUIPO_RECOMENDADO.map((e) => (
            <Card key={e.item} className="p-4">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold">{e.item}</p>
                <Pill tone={e.prioridad === 1 ? 'accent' : 'neutral'}>{e.precio}</Pill>
              </div>
              <p className="mt-0.5 text-[11px] italic text-[var(--color-ink-dim)]">
                {e.ru} · {e.donde}
              </p>
              <p className="mt-2 text-[12px] leading-relaxed text-[var(--color-ink-dim)]">{e.porque}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Tus datos">
        <Card className="p-4">
          <p className="text-[13px] leading-relaxed text-[var(--color-ink-dim)]">
            Todo se guarda en tu teléfono (IndexedDB). No hay servidor, no hay cuenta, nadie más ve tus datos.
            La contra: si borras la app o el navegador limpia el almacenamiento, se pierde. Descarga un
            respaldo cada par de semanas.
          </p>
          <div className="mt-3 flex gap-2">
            <Btn variant="outline" className="flex-1" onClick={descargar}>
              Descargar respaldo
            </Btn>
            <Btn variant="outline" className="flex-1" onClick={() => fileRef.current?.click()}>
              Restaurar
            </Btn>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && subir(e.target.files[0])}
          />
        </Card>

        <Porque>
          En iPhone, Safari borra los datos de sitios web que no visitas en 7 días. Instalar la app en la
          pantalla de inicio (Compartir → Añadir a pantalla de inicio) la exime de esa limpieza. Hazlo el
          primer día: es la diferencia entre conservar meses de registros o perderlos.
        </Porque>
      </Section>

      <Section title="Zona de riesgo">
        <Card className="p-4">
          <Btn
            variant="ghost"
            className="w-full text-red-400"
            onClick={async () => {
              if (!confirm('Esto borra TODOS tus registros de forma permanente. ¿Seguro?')) return
              if (!confirm('Última confirmación. Se perderán pesos, series, medidas y avances. ¿Continuar?')) return
              await Promise.all(db.tables.map((t) => t.clear()))
              alert('Datos borrados.')
            }}
          >
            Borrar todos mis datos
          </Btn>
        </Card>
      </Section>

      <p className="mt-8 mb-4 text-center text-[11px] text-[var(--color-ink-dim)]">
        RITMO · Cuerpo, Mente y Alma
      </p>
    </div>
  )
}
