import AreaCard from './AreaCard'

export default function Sidebar({
  areas,
  selectedAreaId,
  onSelectArea,
  onDeleteArea,
  onUpdateArea,
  isAddingArea,
  onStartAddArea,
  onCancelAddArea,
  isOpen,
}) {
  const counts = {
    liberado: areas.filter(a => a.status === 'Liberado').length,
    atencao: areas.filter(a => a.status === 'Atenção').length,
    bloqueado: areas.filter(a => a.status === 'Bloqueado').length,
  }

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <span>Áreas Monitoradas</span>
        <span className="sidebar-count">{areas.length}</span>
      </div>

      <div className="sidebar-mini-stats">
        <span className="mini-stat mini-green">✓ {counts.liberado}</span>
        <span className="mini-stat mini-yellow">⚠ {counts.atencao}</span>
        <span className="mini-stat mini-red">✕ {counts.bloqueado}</span>
      </div>

      <div className="sidebar-action">
        {isAddingArea ? (
          <button className="sidebar-btn sidebar-btn-cancel" onClick={onCancelAddArea}>
            ✕ Cancelar adição
          </button>
        ) : (
          <button className="sidebar-btn sidebar-btn-add" onClick={onStartAddArea}>
            + Adicionar área
          </button>
        )}
      </div>

      <div className="area-list">
        {areas.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">🗺</span>
            <p>Nenhuma área cadastrada.</p>
            <p>Clique em "Adicionar área" e<br />marque um ponto no mapa.</p>
          </div>
        ) : (
          areas.map(area => (
            <AreaCard
              key={area.id}
              area={area}
              selected={area.id === selectedAreaId}
              onSelect={() => onSelectArea(area)}
              onDelete={() => onDeleteArea(area.id)}
              onUpdate={updates => onUpdateArea(area.id, updates)}
            />
          ))
        )}
      </div>
    </aside>
  )
}
