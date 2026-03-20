import { useState } from 'react'

const SERVICE_TYPES = ['Viabilidade', 'Execução', 'Manutenção', 'Emergência']
const STATUS_OPTIONS = ['Liberado', 'Atenção', 'Bloqueado']

export default function AddAreaModal({ coords, onConfirm, onCancel }) {
  const [form, setForm] = useState({
    name: '',
    municipio: '',
    tipo: 'Viabilidade',
    status: 'Liberado',
    observacao: '',
  })

  function set(field) {
    return e => setForm(f => ({ ...f, [field]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim()) return
    onConfirm({ ...form, lat: coords.lat, lng: coords.lng })
  }

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Nova Área Monitorada</h2>
          <button className="modal-close" onClick={onCancel}>✕</button>
        </div>

        <div className="modal-coords">
          📍 {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Nome da área *</label>
            <input
              type="text"
              value={form.name}
              onChange={set('name')}
              placeholder="Ex: Zona Rural Norte — Linhares"
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Município</label>
            <input
              type="text"
              value={form.municipio}
              onChange={set('municipio')}
              placeholder="Ex: Linhares"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Tipo de serviço</label>
              <select value={form.tipo} onChange={set('tipo')}>
                {SERVICE_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Status inicial</label>
              <select value={form.status} onChange={set('status')}>
                {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Observação</label>
            <textarea
              value={form.observacao}
              onChange={set('observacao')}
              placeholder="Condições de acesso, alertas, alagamentos..."
              rows={3}
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="modal-btn modal-btn-cancel" onClick={onCancel}>
              Cancelar
            </button>
            <button type="submit" className="modal-btn modal-btn-primary">
              Salvar Área
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
