import { getMaxDate } from '../utils/layers'

export default function Header({
  layers,
  selectedLayerIdx,
  onLayerChange,
  selectedDate,
  onDateChange,
  opacity,
  onOpacityChange,
  stats,
  onToggleSidebar,
  sidebarOpen,
}) {
  const maxDate = getMaxDate()

  return (
    <header className="header">
      <div className="header-left">
        <button
          className={`sidebar-toggle ${sidebarOpen ? 'active' : ''}`}
          onClick={onToggleSidebar}
          title="Abrir/fechar painel"
        >
          ☰
        </button>
        <div className="brand">
          <span className="brand-icon">🛰</span>
          <div>
            <div className="brand-name">CCM Viabilidade</div>
            <div className="brand-sub">Monitoramento · Energisa ES</div>
          </div>
        </div>
      </div>

      <div className="header-controls">
        <div className="ctrl-group">
          <label>Camada</label>
          <select
            value={selectedLayerIdx}
            onChange={e => onLayerChange(Number(e.target.value))}
          >
            {layers.map((l, i) => (
              <option key={l.label} value={i}>{l.label}</option>
            ))}
          </select>
        </div>

        <div className="ctrl-group">
          <label>Data</label>
          <input
            type="date"
            value={selectedDate}
            max={maxDate}
            onChange={e => onDateChange(e.target.value)}
          />
        </div>

        <div className="ctrl-group ctrl-opacity">
          <label>Opacidade</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={opacity}
            onChange={e => onOpacityChange(Number(e.target.value))}
          />
          <span className="opacity-val">{Math.round(opacity * 100)}%</span>
        </div>
      </div>

      <div className="header-stats">
        <div className="hstat hstat-total">{stats.total} área{stats.total !== 1 ? 's' : ''}</div>
        <div className="hstat hstat-green">✓ {stats.liberado}</div>
        <div className="hstat hstat-yellow">⚠ {stats.atencao}</div>
        <div className="hstat hstat-red">✕ {stats.bloqueado}</div>
      </div>
    </header>
  )
}
