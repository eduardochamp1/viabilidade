import { useState } from 'react'
import { BASE_LAYERS } from '../utils/layers'

export default function LayerPanel({
  baseLayerId,
  onBaseLayerChange,
  showLabels,
  onToggleLabels,
  showRadar,
  onToggleRadar,
  radarTime,
  radarFrames,
  radarFrameIdx,
  onRadarFrameChange,
}) {
  const [expanded, setExpanded] = useState(true)
  const baseLayer = BASE_LAYERS.find(b => b.id === baseLayerId)
  // Labels make sense for satellite-only bases (not hybrid or OSM)
  const needsLabels = baseLayer?.id !== 'google-hybrid' && baseLayer?.id !== 'osm'

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
          {/* ─── Base Layer ────────────────────────── */}
          <div className="lp-section">
            <div className="lp-title">Imagem Base</div>
            {BASE_LAYERS.map(bl => (
              <label key={bl.id} className="lp-radio">
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
                </div>
              </label>
            ))}

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
              💡 Use <strong>Esri Satélite</strong> ou <strong>Google Satélite</strong> para
              ver terreno, estradas e alagamentos com alta resolução. Ative o
              <strong> Radar de Chuva</strong> para ver precipitação em tempo real.
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
