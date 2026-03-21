import { useState } from 'react'

export default function SettingsModal({ settings, onSave, onClose }) {
  const [form, setForm] = useState({ ...settings })

  function set(key) {
    return e => setForm(f => ({ ...f, [key]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    onSave(form)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal settings-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Configurar Sentinel-2 / Landsat</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {/* Provider */}
          <div className="form-group">
            <label>Provedor</label>
            <select value={form.provider} onChange={set('provider')}>
              <option value="copernicus">
                Copernicus Data Space (ESA — gratuito ilimitado)
              </option>
              <option value="sentinelhub">
                Sentinel Hub (plano gratuito)
              </option>
            </select>
          </div>

          {/* Instance ID */}
          <div className="form-group">
            <label>Instance ID *</label>
            <input
              type="text"
              value={form.instanceId}
              onChange={set('instanceId')}
              placeholder="Cole aqui o Instance ID da sua configuração"
              required
            />
          </div>

          {/* Layer names */}
          <div className="form-row">
            <div className="form-group">
              <label>Camada Sentinel-2</label>
              <input
                type="text"
                value={form.sentinelLayer}
                onChange={set('sentinelLayer')}
                placeholder="TRUE_COLOR"
              />
            </div>
            <div className="form-group">
              <label>Camada Landsat</label>
              <input
                type="text"
                value={form.landsatLayer}
                onChange={set('landsatLayer')}
                placeholder="TRUE_COLOR"
              />
            </div>
          </div>

          {/* Max cloud cover */}
          <div className="form-group">
            <label>
              Cobertura máxima de nuvens: {form.maxCloudCover}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={form.maxCloudCover}
              onChange={e =>
                setForm(f => ({ ...f, maxCloudCover: Number(e.target.value) }))
              }
            />
          </div>

          {/* Instructions */}
          <div className="settings-instructions">
            <div className="si-title">Como obter o Instance ID:</div>

            {form.provider === 'copernicus' ? (
              <ol>
                <li>
                  Crie conta gratuita em{' '}
                  <strong>dataspace.copernicus.eu</strong>
                </li>
                <li>
                  Acesse o <strong>Dashboard</strong> → aba{' '}
                  <strong>Sentinel Hub</strong>
                </li>
                <li>
                  Clique em <strong>Configuration Utility</strong>
                </li>
                <li>
                  Crie uma <strong>nova configuração</strong> (ou use a
                  padrão)
                </li>
                <li>
                  Adicione as camadas: <em>Sentinel-2 L2A</em> (TRUE_COLOR)
                  e <em>Landsat 8-9 L2</em> (TRUE_COLOR)
                </li>
                <li>
                  Copie o <strong>Instance ID</strong> e cole acima
                </li>
              </ol>
            ) : (
              <ol>
                <li>
                  Crie conta em <strong>apps.sentinel-hub.com</strong>
                </li>
                <li>
                  Vá em <strong>Configuration Utility</strong>
                </li>
                <li>
                  Crie uma configuração com camadas Sentinel-2 e Landsat
                </li>
                <li>
                  Copie o <strong>Instance ID</strong> e cole acima
                </li>
              </ol>
            )}
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="modal-btn modal-btn-cancel"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button type="submit" className="modal-btn modal-btn-primary">
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
