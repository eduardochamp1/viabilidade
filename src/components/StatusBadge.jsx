const STATUS_CONFIG = {
  Liberado: {
    color: '#3fb950',
    bg: 'rgba(63, 185, 80, 0.15)',
    border: 'rgba(63, 185, 80, 0.35)',
  },
  Atenção: {
    color: '#d29922',
    bg: 'rgba(210, 153, 34, 0.15)',
    border: 'rgba(210, 153, 34, 0.35)',
  },
  Bloqueado: {
    color: '#f85149',
    bg: 'rgba(248, 81, 73, 0.15)',
    border: 'rgba(248, 81, 73, 0.35)',
  },
}

export default function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] ?? {
    color: '#8b949e',
    bg: 'rgba(139,148,158,0.15)',
    border: 'rgba(139,148,158,0.35)',
  }

  return (
    <span
      className="status-badge"
      style={{ color: cfg.color, background: cfg.bg, borderColor: cfg.border }}
    >
      <span className="status-dot" style={{ background: cfg.color }} />
      {status}
    </span>
  )
}
