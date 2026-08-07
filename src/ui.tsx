import type { ReactNode, Ref } from 'react'

export function Card({
  children,
  className = '',
  onClick,
  ref,
}: {
  children: ReactNode
  className?: string
  onClick?: () => void
  /** React 19 acepta ref como prop normal en componentes de función. */
  ref?: Ref<HTMLDivElement>
}) {
  return (
    <div
      ref={ref}
      onClick={onClick}
      className={`rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] ${
        onClick ? 'cursor-pointer active:scale-[0.99] transition-transform' : ''
      } ${className}`}
    >
      {children}
    </div>
  )
}

export function Section({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="mb-7">
      <div className="mb-3 flex items-center justify-between px-1">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-dim)]">
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  )
}

export function Pill({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'accent' | 'good' | 'warn' }) {
  const tones = {
    neutral: 'bg-[var(--color-surface-2)] text-[var(--color-ink-dim)]',
    accent: 'bg-[var(--color-accent)]/15 text-[var(--color-accent-soft)]',
    good: 'bg-emerald-500/15 text-emerald-400',
    warn: 'bg-red-500/15 text-red-400',
  }
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${tones[tone]}`}>
      {children}
    </span>
  )
}

export function Btn({
  children,
  onClick,
  variant = 'solid',
  className = '',
  type = 'button',
  disabled,
}: {
  children: ReactNode
  onClick?: () => void
  variant?: 'solid' | 'ghost' | 'outline'
  className?: string
  type?: 'button' | 'submit'
  disabled?: boolean
}) {
  const variants = {
    solid: 'bg-[var(--color-accent)] text-black font-semibold active:bg-[var(--color-accent-soft)]',
    ghost: 'bg-[var(--color-surface-2)] text-[var(--color-ink)]',
    outline: 'border border-[var(--color-line)] text-[var(--color-ink)]',
  }
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-xl px-4 py-2.5 text-sm transition active:scale-[0.97] disabled:opacity-40 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  )
}

export function Stat({ label, value, sub }: { label: string; value: ReactNode; sub?: string }) {
  return (
    <Card className="p-4">
      <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-dim)]">
        {label}
      </div>
      <div className="mt-1 text-2xl font-bold text-[var(--color-accent)] tabular-nums">{value}</div>
      {sub && <div className="mt-0.5 text-[11px] text-[var(--color-ink-dim)]">{sub}</div>}
    </Card>
  )
}

export function Empty({ icon, text }: { icon: string; text: string }) {
  return (
    <Card className="p-8 text-center">
      <div className="mb-2 text-3xl">{icon}</div>
      <p className="text-sm text-[var(--color-ink-dim)]">{text}</p>
    </Card>
  )
}

/** Bloque explicativo con la razón científica detrás de una decisión. */
export function Porque({ children }: { children: ReactNode }) {
  return (
    <div className="mt-3 rounded-xl border-l-2 border-[var(--color-accent)] bg-[var(--color-accent)]/5 p-3">
      <div className="mb-1 text-[10px] font-bold uppercase tracking-wider text-[var(--color-accent-soft)]">
        Por qué
      </div>
      <p className="text-[13px] leading-relaxed text-[var(--color-ink-dim)]">{children}</p>
    </div>
  )
}
