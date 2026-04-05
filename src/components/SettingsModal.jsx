import { useState } from 'react'

const WMS_URLS = {
  copernicus: 'https://sh.dataspace.copernicus.eu/ogc/wms/',
  sentinelhub: 'https://services.sentinel-hub.com/ogc/wms/',
}

export default function SettingsModal({ settings, onSave, onClose }) {
  const [form, setForm] = useState({ ...settings })
  const [testStatus, setTestStatus] = useState(null) // null | 'loading' | 'ok' | 'err'
  const [testMsg, setTestMsg] = useState('')

  function set(key) {
    return e => setForm(f => ({ ...f, [key]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    onSave(form)
    onClose()
  }

  async function handleTest() {
    const id = form.instanceId?.trim()
    if (!id) {
      setTestStatus('err')
      setTestMsg('Cole o Instance ID antes de testar.')
      return
    }
    setTestStatus('loading')
    setTestMsg('')
    try {
      const url =
        `${WMS_URLS[form.provider]}${id}` +
        `?SERVICE=WMS&REQUEST=GetCapabilities`
      const res = await fetch(url)
      if (res.ok) {
        const text = await res.text()
        // Verifica se a resposta é um XML de capabilities válido
        if (text.includes('WMS_Capabilities') || text.includes('WMT_MS_Capabilities')) {
          // Tenta detectar as camadas configuradas
          const layerMatches = [...text.matchAll(/<Name>([^<]+)<\/Name>/g)]
          const names = layerMatches.map(m => m[1]).filter(n => !n.includes(':') && n.length < 40)
          if (names.length > 0) {
            setTestStatus('ok')
            setTestMsg(`Conexão OK! Camadas encontradas: ${names.slice(0, 6).join(', ')}`)
          } else {
            setTestStatus('ok')
            setTestMsg('Conexão OK! Instance ID válido.')
          }
        } else {
          setTestStatus('err')
          setTestMsg('Resposta inesperada do servidor. Verifique o Instance ID.')
        }
      } else if (res.status === 401 || res.status === 403) {
        setTestStatus('err')
        setTestMsg(`Acesso negado (${res.status}). Instance ID inválido ou sem permissão.`)
      } else {
        setTestStatus('err')
        setTestMsg(`Erro ${res.status} ao conectar. Verifique o Instance ID.`)
      }
    } catch {
      setTestStatus('err')
      setTestMsg('Não foi possível conectar. Verifique sua internet ou o Instance ID.')
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal settings-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Configurar Sentinel / Landsat / SAR</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">

          {/* Provedor */}
          <div className="form-group">
            <label>Provedor</label>
            <select value={form.provider} onChange={set('provider')}>
              <option value="copernicus">Copernicus Data Space (ESA — gratuito)</option>
              <option value="sentinelhub">Sentinel Hub (plano gratuito)</option>
            </select>
          </div>

          {/* Instance ID + botão testar */}
          <div className="form-group">
            <label>Instance ID *</label>
            <div className="instance-row">
              <input
                type="text"
                value={form.instanceId}
                onChange={set('instanceId')}
                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                className="instance-input"
              />
              <button
                type="button"
                className={`test-btn ${testStatus === 'loading' ? 'loading' : ''}`}
                onClick={handleTest}
                disabled={testStatus === 'loading'}
              >
                {testStatus === 'loading' ? '⏳' : '🔌 Testar'}
              </button>
            </div>
            {testStatus && testStatus !== 'loading' && (
              <div className={`test-result ${testStatus}`}>
                {testStatus === 'ok' ? '✅ ' : '❌ '}{testMsg}
              </div>
            )}
          </div>

          {/* Nomes das camadas */}
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
                placeholder="TRUE_COLOR2"
              />
            </div>
            <div className="form-group">
              <label>Camada SAR</label>
              <input
                type="text"
                value={form.sentinel1Layer}
                onChange={set('sentinel1Layer')}
                placeholder="SAR-RGB"
              />
            </div>
          </div>

          {/* Nuvens */}
          <div className="form-group">
            <label>Cobertura máxima de nuvens: <strong>{form.maxCloudCover}%</strong></label>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={form.maxCloudCover}
              onChange={e => setForm(f => ({ ...f, maxCloudCover: Number(e.target.value) }))}
            />
          </div>

          {/* Instruções */}
          <div className="settings-instructions">
            <div className="si-title">Como obter o Instance ID (5 min):</div>
            <ol>
              <li>
                Acesse{' '}
                <a href="https://dataspace.copernicus.eu" target="_blank" rel="noreferrer">
                  dataspace.copernicus.eu
                </a>{' '}
                e crie uma conta gratuita
              </li>
              <li>
                No Dashboard, clique em <strong>Sentinel Hub</strong> →{' '}
                <strong>Configuration Utility</strong>
              </li>
              <li>
                Crie uma <strong>nova configuração</strong> (ex.: "CCM Viabilidade")
              </li>
              <li>
                Adicione as camadas com os nomes exatos:
                <ul>
                  <li><code>TRUE_COLOR</code> — Sentinel-2 L2A, True Color</li>
                  <li><code>TRUE_COLOR2</code> — Landsat 8-9 L2, True Color</li>
                  <li><code>SAR-RGB</code> — Sentinel-1 GRD, RGB SAR</li>
                </ul>
              </li>
              <li>
                Copie o <strong>Instance ID</strong> (UUID) e cole no campo acima
              </li>
              <li>Clique em <strong>🔌 Testar</strong> para validar</li>
            </ol>
          </div>

          <div className="modal-footer">
            <button type="button" className="modal-btn modal-btn-cancel" onClick={onClose}>
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
