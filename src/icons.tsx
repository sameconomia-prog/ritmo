/**
 * Íconos de la barra de navegación.
 * Trazo minimalista sobre grilla de 24×24, sin relleno, heredando currentColor.
 * El grosor del trazo sube cuando la pestaña está activa: da feedback sin añadir ruido.
 */

interface IconProps {
  active?: boolean
}

const base = (active?: boolean) => ({
  width: 23,
  height: 23,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: active ? 1.9 : 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
})

/** Reloj: el momento presente. */
export function IconHoy({ active }: IconProps) {
  return (
    <svg {...base(active)}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.2v5l3.2 1.9" />
    </svg>
  )
}

/** Mancuerna. */
export function IconEntreno({ active }: IconProps) {
  return (
    <svg {...base(active)}>
      <path d="M3.5 9.5v5" />
      <path d="M6.8 6.8v10.4" />
      <path d="M17.2 6.8v10.4" />
      <path d="M20.5 9.5v5" />
      <path d="M6.8 12h10.4" />
    </svg>
  )
}

/** Bowl caliente. */
export function IconComida({ active }: IconProps) {
  return (
    <svg {...base(active)}>
      <path d="M3.2 11.6h17.6a8.8 8.8 0 0 1-17.6 0Z" />
      <path d="M9.2 3.4c0 1.1-1.1 1.5-1.1 2.6s1.1 1.5 1.1 2.6" />
      <path d="M14.4 3.4c0 1.1-1.1 1.5-1.1 2.6s1.1 1.5 1.1 2.6" />
    </svg>
  )
}

/** Libro abierto. */
export function IconEstudio({ active }: IconProps) {
  return (
    <svg {...base(active)}>
      <path d="M12 7.1v12.5" />
      <path d="M12 7.1C10.6 5.7 8.2 5 4.2 5v12.4c4 0 6.4.7 7.8 2.1 1.4-1.4 3.8-2.1 7.8-2.1V5c-4 0-6.4.7-7.8 2.1Z" />
    </svg>
  )
}

/** Línea ascendente. */
export function IconProgreso({ active }: IconProps) {
  return (
    <svg {...base(active)}>
      <path d="M3.5 20h17" />
      <path d="M6.5 15.6l4.2-5.1 3.4 2.9 5.4-6.9" />
      <circle cx="19.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  )
}

/** Engrane, para el acceso a Ajustes. */
export function IconAjustes({ active }: IconProps) {
  return (
    <svg {...base(active)}>
      <circle cx="12" cy="12" r="3.1" />
      <path d="M19.2 14.5a1.6 1.6 0 0 0 .32 1.77l.06.06a1.94 1.94 0 1 1-2.75 2.75l-.06-.06a1.6 1.6 0 0 0-1.77-.32 1.6 1.6 0 0 0-.97 1.47v.16a1.94 1.94 0 0 1-3.88 0v-.09a1.6 1.6 0 0 0-1.05-1.47 1.6 1.6 0 0 0-1.77.32l-.06.06a1.94 1.94 0 1 1-2.75-2.75l.06-.06a1.6 1.6 0 0 0 .32-1.77 1.6 1.6 0 0 0-1.47-.97h-.16a1.94 1.94 0 0 1 0-3.88h.09a1.6 1.6 0 0 0 1.47-1.05 1.6 1.6 0 0 0-.32-1.77l-.06-.06a1.94 1.94 0 1 1 2.75-2.75l.06.06a1.6 1.6 0 0 0 1.77.32h.08a1.6 1.6 0 0 0 .97-1.47v-.16a1.94 1.94 0 0 1 3.88 0v.09a1.6 1.6 0 0 0 .97 1.47 1.6 1.6 0 0 0 1.77-.32l.06-.06a1.94 1.94 0 1 1 2.75 2.75l-.06.06a1.6 1.6 0 0 0-.32 1.77v.08a1.6 1.6 0 0 0 1.47.97h.16a1.94 1.94 0 0 1 0 3.88h-.09a1.6 1.6 0 0 0-1.47.97Z" />
    </svg>
  )
}
