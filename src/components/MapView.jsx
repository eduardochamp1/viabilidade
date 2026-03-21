import { useEffect, useRef } from 'react'
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from 'react-leaflet'
import L from 'leaflet'
import LayerPanel from './LayerPanel'
import { BASE_LAYERS, LABELS_URL } from '../utils/layers'

// Fix leaflet icon paths
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

/* ─── Status marker ──────────────────────────────────────────────── */
const STATUS_COLORS = {
  Liberado: '#3fb950',
  'Atenção': '#d29922',
  Bloqueado: '#f85149',
}

function createMarkerIcon(status, selected = false) {
  const color = STATUS_COLORS[status] ?? '#8b949e'
  const size = selected ? 22 : 14
  const ring = selected
    ? `box-shadow:0 0 0 4px ${color}44,0 2px 10px rgba(0,0,0,.6);`
    : `box-shadow:0 0 0 2px ${color}44,0 2px 6px rgba(0,0,0,.5);`
  const pulse =
    status === 'Bloqueado'
      ? `<div class="marker-pulse" style="border-color:${color};width:${size + 16}px;height:${size + 16}px;top:-8px;left:-8px;"></div>`
      : ''
  return L.divIcon({
    className: '',
    html: `<div style="position:relative;width:${size}px;height:${size}px;">
      ${pulse}
      <div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};border:2.5px solid rgba(255,255,255,.95);${ring}"></div>
    </div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2 + 6)],
  })
}

/* ─── Map sub-components ─────────────────────────────────────────── */
function MapEvents({ isAddingArea, onMapClick, coordRef }) {
  useMapEvents({
    click(e) {
      if (isAddingArea) onMapClick(e.latlng)
    },
    mousemove(e) {
      const el = coordRef?.current
      if (el) {
        el.textContent = `${e.latlng.lat.toFixed(5)}, ${e.latlng.lng.toFixed(5)}`
        el.style.display = 'block'
      }
    },
    mouseout() {
      const el = coordRef?.current
      if (el) el.style.display = 'none'
    },
  })
  return null
}

function MapRefBridge({ mapRef }) {
  const map = useMap()
  useEffect(() => {
    if (mapRef) mapRef.current = map
  }, [map, mapRef])
  return null
}

/* ─── Main ───────────────────────────────────────────────────────── */
export default function MapView({
  areas,
  selectedAreaId,
  onSelectArea,
  onMapClick,
  mapRef,
  isAddingArea,
  // Layer state
  baseLayerId,
  onBaseLayerChange,
  showLabels,
  onToggleLabels,
  showRadar,
  onToggleRadar,
  rain,
}) {
  const coordRef = useRef(null)
  const baseLayer =
    BASE_LAYERS.find(b => b.id === baseLayerId) ?? BASE_LAYERS[0]

  // Google Hybrid already has labels built-in
  const needsLabels = baseLayer.id !== 'google-hybrid' && baseLayer.id !== 'osm'

  return (
    <div className={`map-wrapper${isAddingArea ? ' adding-mode' : ''}`}>
      {isAddingArea && (
        <div className="map-hint">
          Clique no mapa para posicionar a nova área
        </div>
      )}

      <MapContainer
        center={[-19.5, -40.5]}
        zoom={8}
        style={{ width: '100%', height: '100%' }}
        zoomControl={true}
      >
        <MapRefBridge mapRef={mapRef} />
        <MapEvents
          isAddingArea={isAddingArea}
          onMapClick={onMapClick}
          coordRef={coordRef}
        />

        {/* ── Base layer (XYZ tiles) ─── */}
        <TileLayer
          key={baseLayer.id}
          url={baseLayer.url}
          attribution={baseLayer.attribution}
          maxZoom={baseLayer.maxZoom}
        />

        {/* ── Labels overlay (cidades, estradas) ── */}
        {needsLabels && showLabels && (
          <TileLayer url={LABELS_URL} maxZoom={19} pane="shadowPane" />
        )}

        {/* ── Rain radar ─────────────────────────── */}
        {showRadar && rain.radarTileUrl && (
          <TileLayer
            key={`radar-${rain.frameIdx}`}
            url={rain.radarTileUrl}
            opacity={0.65}
            maxZoom={18}
            attribution='<a href="https://www.rainviewer.com" target="_blank">RainViewer</a>'
          />
        )}

        {/* ── Area markers ───────────────────────── */}
        {areas.map(area => (
          <Marker
            key={area.id}
            position={[area.lat, area.lng]}
            icon={createMarkerIcon(area.status, area.id === selectedAreaId)}
            eventHandlers={{ click: () => onSelectArea(area) }}
          >
            <Popup>
              <div className="map-popup">
                <div className="popup-name">{area.name}</div>
                <div className="popup-meta">
                  {area.municipio} · {area.tipo}
                </div>
                <div
                  className="popup-status"
                  style={{ color: STATUS_COLORS[area.status] }}
                >
                  ● {area.status}
                </div>
                {area.observacao && (
                  <div className="popup-obs">{area.observacao}</div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* ── Layer panel ──────────────────────────── */}
      <LayerPanel
        baseLayerId={baseLayerId}
        onBaseLayerChange={onBaseLayerChange}
        showLabels={showLabels}
        onToggleLabels={onToggleLabels}
        showRadar={showRadar}
        onToggleRadar={onToggleRadar}
        radarTime={rain.radarTime}
        radarFrames={rain.frames}
        radarFrameIdx={rain.frameIdx}
        onRadarFrameChange={rain.setFrameIdx}
      />

      {/* ── Coordinates (updated via ref, no re-renders) ── */}
      <div className="coord-display" ref={coordRef} style={{ display: 'none' }} />

      {/* ── Info bar ─────────────────────────────── */}
      <div className="map-info-bar">
        <span>
          📡 <strong>{baseLayer.label}</strong>
        </span>
        {showRadar && rain.radarTime && (
          <span className="radar-badge">
            🌧{' '}
            {rain.radarTime.toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        )}
      </div>
    </div>
  )
}
