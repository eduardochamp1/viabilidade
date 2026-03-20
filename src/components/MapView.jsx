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
import { WMS_URL } from '../utils/layers'

// Fix leaflet default icon paths (broken by bundlers)
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const STATUS_COLORS = {
  Liberado: '#3fb950',
  Atenção: '#d29922',
  Bloqueado: '#f85149',
}

function createMarkerIcon(status, selected = false) {
  const color = STATUS_COLORS[status] ?? '#8b949e'
  const size = selected ? 20 : 14
  const pulse =
    status === 'Bloqueado'
      ? `<div class="marker-pulse" style="border-color:${color};width:${size + 14}px;height:${size + 14}px;top:${-(7)}px;left:${-(7)}px;"></div>`
      : ''

  return L.divIcon({
    className: '',
    html: `<div style="position:relative;width:${size}px;height:${size}px;">
      ${pulse}
      <div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};border:2.5px solid rgba(255,255,255,0.95);box-shadow:0 0 0 2px ${color}55,0 2px 8px rgba(0,0,0,0.55);"></div>
    </div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2 + 6)],
  })
}

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

export default function MapView({
  areas,
  selectedAreaId,
  currentLayer,
  selectedDate,
  opacity,
  isAddingArea,
  onMapClick,
  onMouseMove,
  onSelectArea,
  mapRef,
  mouseCoords,
}) {
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
          onMouseMove={onMouseMove}
        />

        {/* Base OSM */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          maxZoom={19}
        />

        {/* NASA GIBS satellite layer */}
        {currentLayer.id && (
          <WMSTileLayer
            key={`${currentLayer.id}-${selectedDate}`}
            url={WMS_URL}
            layers={currentLayer.id}
            format={currentLayer.format}
            transparent={currentLayer.transparent}
            version="1.1.1"
            opacity={opacity}
            params={{ TIME: selectedDate }}
            attribution='Imagens: <a href="https://earthdata.nasa.gov" target="_blank">NASA GIBS</a>'
          />
        )}

        {/* Area markers */}
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
                <div className="popup-meta">{area.municipio} · {area.tipo}</div>
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

      {/* Coordinate HUD */}
      {mouseCoords && (
        <div className="coord-display">
          {mouseCoords.lat.toFixed(5)}, {mouseCoords.lng.toFixed(5)}
        </div>
      )}

      {/* Bottom info bar */}
      <div className="map-info-bar">
        <span>Imagem: <strong>{selectedDate}</strong></span>
        <span className="cloud-warn">⚠ Cobertura de nuvens pode limitar a visualização</span>
      </div>
    </div>
  )
}
