import { useState } from 'react'
import { BASE_LAYERS, NASA_OVERLAYS, getMaxDate } from '../utils/layers'

export default function LayerPanel({
  baseLayerId,
  onBaseLayerChange,
  showLabels,
  onToggleLabels,
  activeOverlays,
  onToggleOverlay,
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
}) {
  const [expanded, setExpanded] = useState(true)
  const maxDate = getMaxDate()

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
          {/* ─── Base Layer ─────────────────────────────── */}
          <div className="lp-section">
            <div className="lp-title">Mapa Base</div>
            {BASE_LAYERS.map(bl => (
              <label key={bl.id} className="lp-radio">
                <input
                  type="radio"
                  name="base-layer"
                  checked={baseLayerId === bl.id}
                  onChange={() => onBaseLayerChange(bl.id)}
                />
                <span>{bl.label}</span>
              </label>
            ))}
            {baseLayerId === 'satellite' && (
              <label className="lp-check lp-indent">
                <input
                  type="checkbox"
                  checked={showLabels}
                  onChange={onToggleLabels}
                />
                <span>Rótulos e nomes</span>
              </label>
            )}
          </div>

          {/* ─── NASA GIBS Overlays ────────────────────── */}
          <div className="lp-section">
            <div className="lp-title">Sobreposição NASA GIBS</div>

            <div className="lp-ctrl-row">
              <label>Data</label>
              <input
                type="date"
                value={nasaDate}
                max={maxDate}
                onChange={e => onNasaDateChange(e.target.value)}
              />
            </div>

            <div className="lp-ctrl-row">
              <label>Opacidade</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={nasaOpacity}
                onChange={e => onNasaOpacityChange(Number(e.target.value))}
              />
              <span className="lp-val">{Math.round(nasaOpacity * 100)}%</span>
            </div>

            {NASA_OVERLAYS.map(ol => (
              <label key={ol.id} className="lp-check" title={ol.desc}>
                <input
                  type="checkbox"
                  checked={activeOverlays.includes(ol.id)}
                  onChange={() => onToggleOverlay(ol.id)}
                />
                <span>{ol.label}</span>
              </label>
            ))}

            {activeOverlays.length > 0 && (
              <div className="lp-hint">
                ⚠ Nuvens podem ocultar o terreno na imagem do dia.
              </div>
            )}
          </div>

          {/* ─── Weather Radar ─────────────────────────── */}
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
        </div>
      )}
    </div>
  )
}
