import { useState } from 'react'
import { BASE_LAYERS, QUICK_DATES, getMaxDate, daysAgo } from '../utils/layers'

export default function LayerPanel({
  baseLayerId,
  onBaseLayerChange,
  showLabels,
  onToggleLabels,
  nasaDate,
  onNasaDateChange,
  nasaOpacity,
  onNasaOpacityChange,
  showRadar,
  onToggleRadar,
  radarTime,
  radarFrames,
  radarFrameIdx,
  onRadarFrameChange,
  isGisConfigured,
  onOpenSettings,
}) {
  const [expanded, setExpanded] = useState(true)
  const maxDate = getMaxDate()
  const baseLayer = BASE_LAYERS.find(b => b.id === baseLayerId)
  const isWmsBase = baseLayer?.type === 'wms'
  const isXyzBase = baseLayer?.type === 'xyz'
  // Google Hybrid tem labels embutidas; OSM é mapa de ruas
  const needsLabels = isXyzBase
    && baseLayer?.id !== 'google-hybrid'
    && baseLayer?.id !== 'osm'

  return (
    <div className={`layer-panel ${expanded ? 'expanded' : 'collapsed'}`}>
      <button
        className="lp-toggle"
        onClick={() => setExpanded(v => !v)}
        title={expanded ? 'Recolher painel' : 'Expandir painel'}
      >
        <span className="lp-toggle-icon">🗂</span>
        <span className="lp-toggle-label">Camadas</span>
        <span className="lp-toggle-arrow">{expanded ? '▾' : '▸'}</span>
      </button>

      {expanded && (
        <div className="lp-body">

          {/* ─── Data (só para camadas WMS) ─────────── */}
          {isWmsBase && (
            <div className="lp-section lp-date-section">
              <div className="lp-title">Data da Imagem</div>
              <div className="lp-quick-dates">
                {QUICK_DATES.map(qd => {
                  const dateVal = daysAgo(qd.days)
                  return (
                    <button
                      key={qd.days}
                      className={`qd-btn ${nasaDate === dateVal ? 'active' : ''}`}
                      onClick={() => onNasaDateChange(dateVal)}
                    >
                      {qd.label}
                    </button>
                  )
                })}
              </div>
              <input
                type="date"
                className="lp-date-input"
                value={nasaDate}
                max={maxDate}
                onChange={e => onNasaDateChange(e.target.value)}
              />
              <div className="lp-date-display">
                📅 Buscando até: <strong>{nasaDate}</strong>
                <span className="lp-date-note">
                  {' '}(imagem mais recente disponível)
                </span>
              </div>
            </div>
          )}

          {/* ─── Base Layer ────────────────────────── */}
          <div className="lp-section">
            <div className="lp-title-row">
              <div className="lp-title">Imagem Base</div>
              <button
                className="lp-settings-btn"
                onClick={onOpenSettings}
                title="Configurar Sentinel / Landsat / SAR"
              >
                ⚙
              </button>
            </div>

            {BASE_LAYERS.map(bl => {
              const needsConfig = bl.type === 'wms' && !isGisConfigured
              return (
                <label
                  key={bl.id}
                  className={`lp-radio ${needsConfig ? 'lp-disabled' : ''}`}
                >
                  <input
                    type="radio"
                    name="base-layer"
                    checked={baseLayerId === bl.id}
                    onChange={() => onBaseLayerChange(bl.id)}
                  />
                  <div className="lp-radio-content">
                    <span className="lp-radio-label">
                      {bl.label}
                      {bl.badge && (
                        <span className="lp-badge">{bl.badge}</span>
                      )}
                    </span>
                    {bl.sublabel && (
                      <span className="lp-sublabel">{bl.sublabel}</span>
                    )}
                    {needsConfig && (
                      <span
                        className="lp-config-link"
                        onClick={e => {
                          e.preventDefault()
                          onOpenSettings()
                        }}
                      >
                        ⚙ Clique para configurar
                      </span>
                    )}
                  </div>
                </label>
              )
            })}

            {/* Labels toggle para camadas XYZ (exceto Hybrid e OSM) */}
            {needsLabels && (
              <label className="lp-check lp-indent">
                <input
                  type="checkbox"
                  checked={showLabels}
                  onChange={onToggleLabels}
                />
                <span>Rótulos (cidades, estradas)</span>
              </label>
            )}

            {/* Opacidade para camadas WMS */}
            {isWmsBase && isGisConfigured && (
              <div className="lp-ctrl-row" style={{ marginTop: 6 }}>
                <label>Opacidade</label>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.05"
                  value={nasaOpacity}
                  onChange={e => onNasaOpacityChange(Number(e.target.value))}
                />
                <span className="lp-val">
                  {Math.round(nasaOpacity * 100)}%
                </span>
              </div>
            )}
          </div>

          {/* ─── Radar ─────────────────────────────── */}
          <div className="lp-section">
            <div className="lp-title">Radar de Chuva</div>
            <label className="lp-check">
              <input
                type="checkbox"
                checked={showRadar}
                onChange={onToggleRadar}
              />
              <span>Precipitação (tempo real)</span>
            </label>
            {showRadar && radarFrames.length > 0 && (
              <div className="lp-radar-ctrl">
                <input
                  type="range"
                  min="0"
                  max={radarFrames.length - 1}
                  value={radarFrameIdx}
                  onChange={e => onRadarFrameChange(Number(e.target.value))}
                  className="radar-slider"
                />
                {radarTime && (
                  <div className="lp-radar-time">
                    {radarTime.toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                    })}{' '}
                    {radarTime.toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                    {radarFrameIdx >= radarFrames.length - 3 && (
                      <span className="lp-nowcast"> (previsão)</span>
                    )}
                  </div>
                )}
                <div className="lp-radar-legend">
                  <span className="rl-light">Fraca</span>
                  <div className="rl-bar" />
                  <span className="rl-heavy">Forte</span>
                </div>
              </div>
            )}
          </div>

          {/* ─── Tip ───────────────────────────────── */}
          <div className="lp-section lp-tip-section">
            <div className="lp-tip">
              💡 Use <strong>Esri</strong> ou <strong>Google Híbrido</strong> para ver
              estradas e obras. <strong>Sentinel-2</strong> (10m) é ideal para
              alagamentos e terreno — requer configuração ⚙.
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
