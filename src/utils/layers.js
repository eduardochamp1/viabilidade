/* ─── Base layers ───────────────────────────────────────────────────── */
export const BASE_LAYERS = [
  {
    id: 'satellite',
    label: 'Satélite (alta resolução)',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution:
      'Tiles &copy; Esri &mdash; Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, GIS User Community',
    maxZoom: 19,
  },
  {
    id: 'osm',
    label: 'Ruas (OpenStreetMap)',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
  },
  {
    id: 'topo',
    label: 'Topográfico',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri',
    maxZoom: 19,
  },
]

export const LABELS_URL =
  'https://services.arcgisonline.com/arcgis/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}'

/* ─── NASA GIBS overlays (date-aware) ──────────────────────────────── */
export const WMS_URL =
  'https://gibs.earthdata.nasa.gov/wms/epsg3857/best/wms.cgi'

export const NASA_OVERLAYS = [
  {
    id: 'viirs-truecolor',
    label: 'True Color (VIIRS)',
    wmsLayer: 'VIIRS_SNPP_CorrectedReflectance_TrueColor',
    format: 'image/jpeg',
    transparent: false,
    desc: 'Composição diária em cores reais — principal para avaliar terreno e nuvens.',
  },
  {
    id: 'modis-truecolor',
    label: 'True Color (MODIS)',
    wmsLayer: 'MODIS_Terra_CorrectedReflectance_TrueColor',
    format: 'image/jpeg',
    transparent: false,
    desc: 'Composição MODIS/Terra — fallback quando VIIRS não tem cobertura.',
  },
  {
    id: 'fires',
    label: 'Focos de Calor',
    wmsLayer: 'VIIRS_SNPP_Fires_375m',
    format: 'image/png',
    transparent: true,
    desc: 'Focos de queimada detectados (375m). Útil para áreas rurais.',
  },
  {
    id: 'temperature',
    label: 'Temperatura Superficial',
    wmsLayer: 'MODIS_Terra_Land_Surface_Temp_Day',
    format: 'image/png',
    transparent: true,
    desc: 'Temperatura da superfície — identifica solo saturado/encharcado.',
  },
]

/* ─── Helpers ──────────────────────────────────────────────────────── */
export function getYesterday() {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().split('T')[0]
}

export function getMaxDate() {
  return getYesterday()
}
