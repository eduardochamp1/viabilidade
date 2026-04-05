import { useEffect, useRef, useState } from 'react'
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
import MapSearch from './MapSearch'
import {
  BASE_LAYERS,
  LABELS_URL,
  sentinelTimeRange,
} from '../utils/layers'

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

function ZoomLimiter({ maxZoom }) {
  const map = useMap()
  useEffect(() => {
    map.setMaxZoom(maxZoom)
    if (map.getZoom() > maxZoom) map.setZoom(maxZoom)
  }, [map, maxZoom])
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
  nasaDate,
  onNasaDateChange,
  nasaOpacity,
  onNasaOpacityChange,
  showRadar,
  onToggleRadar,
  rain,
  // WMS settings
  gisSettings,
  isGisConfigured,
  wmsBaseUrl,
  onOpenSettings,
}) {
  const coordRef = useRef(null)
  const [wmsError, setWmsError] = useState(false)
  const baseLayer = BASE_LAYERS.find(b => b.id === baseLayerId) ?? BASE_LAYERS[0]

  // Google Hybrid tem labels embutidas; OSM já é mapa de ruas
  const needsLabels = baseLayer.type === 'xyz'
    && baseLayer.id !== 'google-hybrid'
    && baseLayer.id !== 'osm'

  // Reseta erro ao trocar de camada ou data
  useEffect(() => { setWmsError(false) }, [baseLayerId, nasaDate])

  const sentinelTime = sentinelTimeRange(nasaDate, 60)

  const shLayerName =
    baseLayer.source === 'landsat'
      ? (gisSettings?.landsatLayer ?? 'TRUE_COLOR2')
      : (gisSettings?.sentinelLayer ?? 'TRUE_COLOR')

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
        <ZoomLimiter maxZoom={baseLayer.mapMaxZoom ?? 19} />
        <MapEvents
          isAddingArea={isAddingArea}
          onMapClick={onMapClick}
          coordRef={coordRef}
        />

        {/* ── Base XYZ tile layer (Esri, Google, OSM) ─── */}
        {baseLayer.type === 'xyz' && (
          <TileLayer
            key={baseLayer.id}
            url={baseLayer.url}
            attribution={baseLayer.attribution}
            maxZoom={baseLayer.maxZoom ?? 19}
            subdomains={baseLayer.subdomains ?? 'abc'}
          />
        )}

        {/* ── OSM fallback embaixo das camadas WMS ── */}
        {baseLayer.type === 'wms' && (
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            maxZoom={19}
          />
        )}

        {/* ── Sentinel-2 / Landsat via Sentinel Hub WMS ── */}
        {baseLayer.type === 'wms' && baseLayer.source !== 'sentinel1' && isGisConfigured && wmsBaseUrl && (
          <WMSTileLayer
            key={`sh-${baseLayer.id}-${nasaDate}`}
            url={wmsBaseUrl}
            layers={shLayerName}
            format="image/jpeg"
            transparent={false}
            version="1.1.1"
            opacity={nasaOpacity}
            tileSize={512}
            zoomOffset={-1}
            maxNativeZoom={19}
            maxZoom={19}
            params={{
              TIME: sentinelTime,
              MAXCC: gisSettings?.maxCloudCover ?? 80,
              SHOWLOGO: false,
            }}
            attribution={`${baseLayer.label} — <a href="https://dataspace.copernicus.eu" target="_blank">Copernicus</a>`}
            eventHandlers={{
              tileerror: () => setWmsError(true),
              tileload: () => setWmsError(false),
            }}
          />
        )}

        {/* ── Sentinel-1 SAR via Sentinel Hub WMS ── */}
        {baseLayer.type === 'wms' && baseLayer.source === 'sentinel1' && isGisConfigured && wmsBaseUrl && (
          <WMSTileLayer
            key={`s1-${baseLayer.id}-${nasaDate}`}
            url={wmsBaseUrl}
            layers={gisSettings?.sentinel1Layer ?? 'SAR-RGB'}
            format="image/jpeg"
            transparent={false}
            version="1.1.1"
            opacity={nasaOpacity}
            tileSize={512}
            zoomOffset={-1}
            maxNativeZoom={15}
            maxZoom={19}
            params={{
              TIME: sentinelTimeRange(nasaDate, 90),
              SHOWLOGO: false,
            }}
            attribution='Sentinel-1 SAR — <a href="https://dataspace.copernicus.eu" target="_blank">Copernicus</a>'
            eventHandlers={{
              tileerror: () => setWmsError(true),
              tileload: () => setWmsError(false),
            }}
          />
        )}

        {/* ── Labels overlay ─────────────────────── */}
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

      {/* ── WMS sem configuração ─────────────────── */}
      {baseLayer.type === 'wms' && !isGisConfigured && (
        <div className="wms-error-banner wms-warn-banner">
          ⚙️ Configure o Instance ID do Copernicus para ver imagens {baseLayer.label}.{' '}
          <button onClick={onOpenSettings}>Configurar agora</button>
        </div>
      )}

      {/* ── WMS erro de carregamento ─────────────── */}
      {wmsError && baseLayer.type === 'wms' && isGisConfigured && (
        <div className="wms-error-banner">
          ⚠️ Imagem não carregou. Verifique o <strong>Instance ID</strong> e o
          nome da camada (<code>{baseLayer.source === 'sentinel1' ? gisSettings?.sentinel1Layer : shLayerName}</code>)
          no Copernicus Dashboard.{' '}
          <button onClick={onOpenSettings}>Abrir Configurações ⚙</button>
        </div>
      )}

      {/* ── Busca de local ───────────────────────── */}
      <MapSearch mapRef={mapRef} />

      {/* ── Layer panel ──────────────────────────── */}
      <LayerPanel
        baseLayerId={baseLayerId}
        onBaseLayerChange={onBaseLayerChange}
        showLabels={showLabels}
        onToggleLabels={onToggleLabels}
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
        isGisConfigured={isGisConfigured}
        onOpenSettings={onOpenSettings}
      />

      {/* ── Coordinates ──────────────────────────── */}
      <div className="coord-display" ref={coordRef} style={{ display: 'none' }} />

      {/* ── Info bar ─────────────────────────────── */}
      <div className="map-info-bar">
        <span>
          📡 <strong>{baseLayer.label}</strong>
        </span>
        {baseLayer.updateLabel && (
          <span>🕒 {baseLayer.updateLabel}</span>
        )}
        {baseLayer.type === 'wms' && isGisConfigured && (
          <span>📅 Buscando até: {nasaDate}</span>
        )}
        <span>🔍 Zoom máx: {baseLayer.mapMaxZoom ?? 19}</span>
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
