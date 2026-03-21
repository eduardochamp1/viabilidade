import { useState } from 'react'
import {
  BASE_LAYERS,
  NASA_OVERLAYS,
  QUICK_DATES,
  getMaxDate,
  daysAgo,
} from '../utils/layers'

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
  const baseLayer = BASE_LAYERS.find(b => b.id === baseLayerId)
  const isNasaBase = baseLayer?.type === 'nasa'

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
          {/* ─── Date (prominent, at top) ──────────── */}
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
            <div className="lp-ctrl-row">
              <input
                type="date"
                value={nasaDate}
                max={maxDate}
                onChange={e => onNasaDateChange(e.target.value)}
                className="lp-date-input"
              />
            </div>
            <div className="lp-date-display">
              📅 Exibindo: <strong>{nasaDate}</strong>
            </div>
          </div>

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
                  <span>{bl.label}</span>
                  {bl.sublabel && (
                    <span className="lp-sublabel">{bl.sublabel}</span>
                  )}
                </div>
              </label>
            ))}
            {isNasaBase && (
              <>
                <label className="lp-check lp-indent">
                  <input
                    type="checkbox"
                    checked={showLabels}
                    onChange={onToggleLabels}
                  />
                  <span>Rótulos (cidades, estradas)</span>
                </label>
                <div className="lp-ctrl-row" style={{ marginTop: 6 }}>
                  <label>Opacidade</label>
                  <input
                    type="range"
                    min="0.3"
                    max="1"
                    step="0.05"
                    value={nasaOpacity}
                    onChange={e => onNasaOpacityChange(Number(e.target.value))}
                  />
                  <span className="lp-val">
                    {Math.round(nasaOpacity * 100)}%
                  </span>
                </div>
              </>
            )}
          </div>

          {/* ─── Overlays ──────────────────────────── */}
          <div className="lp-section">
            <div className="lp-title">Sobreposições</div>
            {NASA_OVERLAYS.map(ol => (
              <label key={ol.id} className="lp-check">
                <input
                  type="checkbox"
                  checked={activeOverlays.includes(ol.id)}
                  onChange={() => onToggleOverlay(ol.id)}
                />
                <span>{ol.label}</span>
              </label>
            ))}
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

          {/* ─── Hint ──────────────────────────────── */}
          <div className="lp-section lp-tip-section">
            <div className="lp-tip">
              💡 Compare datas recentes para avaliar o terreno antes e depois de
              chuvas. Nuvens podem ocultar o solo — tente dias adjacentes.
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
