import { useState } from 'react'
import StatusBadge from './StatusBadge'

const STATUS_OPTIONS = ['Liberado', 'Atenção', 'Bloqueado']

export default function AreaCard({ area, selected, onSelect, onDelete, onUpdate }) {
  const [editingObs, setEditingObs] = useState(false)
  const [obs, setObs] = useState(area.observacao || '')

  function handleSaveObs() {
    onUpdate({ observacao: obs })
    setEditingObs(false)
  }

  function handleCancelObs() {
    setObs(area.observacao || '')
    setEditingObs(false)
  }

  function handleStatusChange(e) {
    e.stopPropagation()
    onUpdate({ status: e.target.value })
  }

  const tipoColors = {
    Viabilidade: '#2f81f7',
    Execução: '#a371f7',
    Manutenção: '#f0883e',
    Emergência: '#f85149',
  }

  return (
    <div
      className={`area-card ${selected ? 'selected' : ''}`}
      onClick={onSelect}
    >
      <div className="area-card-header">
        <div className="area-card-top">
          <span className="area-name">{area.name}</span>
          <button
            className="delete-btn"
            title="Excluir área"
            onClick={e => {
              e.stopPropagation()
              if (confirm(`Excluir "${area.name}"?`)) onDelete()
            }}
          >
            ✕
          </button>
        </div>
        <div className="area-meta">
          <span>{area.municipio || '—'}</span>
          <span className="meta-sep">·</span>
          <span
            className="area-tipo"
            style={{ color: tipoColors[area.tipo] ?? '#8b949e' }}
          >
            {area.tipo}
          </span>
        </div>
      </div>

      <div className="area-card-body" onClick={e => e.stopPropagation()}>
        <div className="area-status-row">
          <StatusBadge status={area.status} />
          <select
            className="status-select"
            value={area.status}
            onChange={handleStatusChange}
          >
            {STATUS_OPTIONS.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {editingObs ? (
          <div className="obs-edit">
            <textarea
              value={obs}
              onChange={e => setObs(e.target.value)}
              placeholder="Condições de acesso, alertas..."
              rows={2}
              autoFocus
            />
            <div className="obs-actions">
              <button className="btn-save" onClick={handleSaveObs}>Salvar</button>
              <button className="btn-cancel-sm" onClick={handleCancelObs}>Cancelar</button>
            </div>
          </div>
        ) : (
          <div className="obs-display" onClick={() => setEditingObs(true)}>
            {area.observacao
              ? <span className="obs-text">{area.observacao}</span>
              : <span className="obs-placeholder">+ Adicionar observação</span>
            }
          </div>
        )}

        <div className="area-coords">
          {area.lat.toFixed(5)}, {area.lng.toFixed(5)}
        </div>
      </div>
    </div>
  )
}
