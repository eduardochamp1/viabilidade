export default function Header({ stats, onToggleSidebar, sidebarOpen }) {
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
            <div className="brand-sub">Monitoramento de Campo · Energisa ES</div>
          </div>
        </div>
      </div>

      <div className="header-center">
        <span className="header-tip">
          Use o painel <strong>Camadas</strong> no mapa para alternar imagens de satélite, radar de chuva e sobreposições NASA
        </span>
      </div>

      <div className="header-stats">
        <div className="hstat hstat-total">
          {stats.total} área{stats.total !== 1 ? 's' : ''}
        </div>
        <div className="hstat hstat-green">✓ {stats.liberado}</div>
        <div className="hstat hstat-yellow">⚠ {stats.atencao}</div>
        <div className="hstat hstat-red">✕ {stats.bloqueado}</div>
      </div>
    </header>
  )
}
