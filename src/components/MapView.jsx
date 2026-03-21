import { useEffect } from 'react'
import {
  MapContainer,
  TileLayer,
  WMSTileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from 'react-leaflet'
import L from 'leaflet'
import LayerPanel from './LayerPanel'
import { BASE_LAYERS, LABELS_URL, NASA_OVERLAYS, WMS_URL } from '../utils/layers'

// Fix leaflet default icon paths
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
    ? `box-shadow:0 0 0 4px ${color}44, 0 2px 10px rgba(0,0,0,.6);`
    : `box-shadow:0 0 0 2px ${color}44, 0 2px 6px rgba(0,0,0,.5);`
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
function MapEvents({ isAddingArea, onMapClick, onMouseMove }) {
  useMapEvents({
    click(e) {
      if (isAddingArea) onMapClick(e.latlng)
    },
    mousemove(e) {
      onMouseMove(e.latlng)
    },
    mouseout() {
      onMouseMove(null)
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

/* ─── Main component ─────────────────────────────────────────────── */
export default function MapView({
  areas,
  selectedAreaId,
  onSelectArea,
  onMapClick,
  onMouseMove,
  mapRef,
  mouseCoords,
  isAddingArea,
  // Layer props
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
  rain,
}) {
  const baseLayer = BASE_LAYERS.find(b => b.id === baseLayerId) ?? BASE_LAYERS[0]
  const isNasaBase = baseLayer.type === 'nasa'

  return (
    <div className={`map-wrapper${isAddingArea ? ' adding-mode' : ''}`}>
      {/* Adding hint */}
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
          onMouseMove={onMouseMove}
        />

        {/* ── Base: regular tiles (OSM) ──────────── */}
        {baseLayer.type === 'tiles' && (
          <TileLayer
            key={baseLayer.id}
            url={baseLayer.url}
            attribution={baseLayer.attribution}
            maxZoom={baseLayer.maxZoom}
          />
        )}

        {/* ── Base: NASA GIBS daily satellite ────── */}
        {isNasaBase && (
          <WMSTileLayer
            key={`base-${baseLayer.id}-${nasaDate}`}
            url={WMS_URL}
            layers={baseLayer.wmsLayer}
            format={baseLayer.format}
            transparent={false}
            version="1.1.1"
            opacity={nasaOpacity}
            params={{ TIME: nasaDate }}
            attribution='Imagem diária: <a href="https://earthdata.nasa.gov" target="_blank">NASA GIBS</a>'
          />
        )}

        {/* ── Labels overlay ─────────────────────── */}
        {isNasaBase && showLabels && (
          <TileLayer
            url={LABELS_URL}
            maxZoom={19}
            pane="shadowPane"
            attribution="Esri"
          />
        )}

        {/* ── NASA GIBS overlays ─────────────────── */}
        {activeOverlays.map(olId => {
          const ol = NASA_OVERLAYS.find(o => o.id === olId)
          if (!ol) return null
          return (
            <WMSTileLayer
              key={`ol-${ol.id}-${nasaDate}`}
              url={WMS_URL}
              layers={ol.wmsLayer}
              format={ol.format}
              transparent={ol.transparent}
              version="1.1.1"
              opacity={0.7}
              params={{ TIME: nasaDate }}
            />
          )
        })}

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

      {/* ── Layer control panel ──────────────────── */}
      <LayerPanel
        baseLayerId={baseLayerId}
        onBaseLayerChange={onBaseLayerChange}
        showLabels={showLabels}
        onToggleLabels={onToggleLabels}
        activeOverlays={activeOverlays}
        onToggleOverlay={onToggleOverlay}
        nasaDate={nasaDate}
        onNasaDateChange={onNasaDateChange}
        nasaOpacity={nasaOpacity}
        onNasaOpacityChange={onNasaOpacityChange}
        showRadar={showRadar}
        onToggleRadar={onToggleRadar}
        radarTime={rain.radarTime}
        radarFrames={rain.frames}
        radarFrameIdx={rain.frameIdx}
        onRadarFrameChange={rain.setFrameIdx}
      />

      {/* ── Coordinate display ───────────────────── */}
      {mouseCoords && (
        <div className="coord-display">
          {mouseCoords.lat.toFixed(5)}, {mouseCoords.lng.toFixed(5)}
        </div>
      )}

      {/* ── Bottom info bar ──────────────────────── */}
      <div className="map-info-bar">
        {isNasaBase && (
          <span>
            📡 Imagem: <strong>{nasaDate}</strong> — {baseLayer.label}
          </span>
        )}
        {!isNasaBase && <span>Base: {baseLayer.label}</span>}
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
