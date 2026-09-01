export function AuthAside() {
  return (
    <aside className="relative hidden min-h-[540px] overflow-hidden bg-[oklch(0.19_0.035_264)] p-9 text-white md:flex md:flex-col md:justify-between">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-20 [background-image:linear-gradient(to_right,rgba(255,255,255,.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.12)_1px,transparent_1px)] [background-size:32px_32px]"
      />
      <div className="relative flex items-center gap-2 text-sm font-medium">
        <span className="flex size-7 items-center justify-center rounded-lg bg-white text-xs font-bold text-[oklch(0.19_0.035_264)]">
          P
        </span>
        Papertrail
      </div>
      <div className="relative">
        <div className="mb-7 h-16 w-px bg-gradient-to-b from-[oklch(0.72_0.16_264)] to-transparent" />
        <p className="max-w-xs font-display text-4xl font-semibold leading-[1.04] tracking-[-0.04em]">
          Give every unfinished thought somewhere to become useful.
        </p>
        <p className="mt-5 max-w-xs text-sm leading-6 text-white/60">
          Notes, plans, and projects—connected without getting in your way.
        </p>
      </div>
      <p className="relative font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">
        One workspace · Every idea
      </p>
    </aside>
  )
}
