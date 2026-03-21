/* ─── NASA GIBS WMS ────────────────────────────────────────────────── */
export const WMS_URL =
  'https://gibs.earthdata.nasa.gov/wms/epsg3857/best/wms.cgi'

/* ─── Base layers ──────────────────────────────────────────────────── */
export const BASE_LAYERS = [
  {
    id: 'sentinel2',
    label: 'Sentinel-2 (10m)',
    sublabel: 'Atualizado a cada 5 dias · resolução 10m',
    type: 'sentinel',
    source: 'sentinel2',
    badge: '🔭 Alta Resolução',
  },
  {
    id: 'landsat',
    label: 'Landsat 8/9 (30m)',
    sublabel: 'Atualizado a cada 8 dias · resolução 30m',
    type: 'sentinel',
    source: 'landsat',
    badge: '🛰 Cobertura ampla',
  },
  {
    id: 'viirs',
    label: 'NASA VIIRS (250m)',
    sublabel: 'Atualizado todo dia · visão geral',
    type: 'nasa',
    wmsLayer: 'VIIRS_SNPP_CorrectedReflectance_TrueColor',
    format: 'image/jpeg',
    transparent: false,
  },
  {
    id: 'modis',
    label: 'NASA MODIS (250m–1km)',
    sublabel: 'Fallback diário',
    type: 'nasa',
    wmsLayer: 'MODIS_Terra_CorrectedReflectance_TrueColor',
    format: 'image/jpeg',
    transparent: false,
  },
  {
    id: 'osm',
    label: 'Mapa de Ruas',
    sublabel: 'OpenStreetMap',
    type: 'tiles',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
  },
]

export const LABELS_URL =
  'https://services.arcgisonline.com/arcgis/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}'

/* ─── NASA GIBS overlays ──────────────────────────────────────────── */
export const NASA_OVERLAYS = [
  {
    id: 'fires',
    label: 'Focos de Calor',
    wmsLayer: 'VIIRS_SNPP_Fires_375m',
    format: 'image/png',
    transparent: true,
  },
  {
    id: 'temperature',
    label: 'Temperatura Superficial',
    wmsLayer: 'MODIS_Terra_Land_Surface_Temp_Day',
    format: 'image/png',
    transparent: true,
  },
]

/* ─── Date helpers ─────────────────────────────────────────────────── */
export function getYesterday() {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().split('T')[0]
}

export function getMaxDate() {
  return getYesterday()
}

export function daysAgo(n) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().split('T')[0]
}

/**
 * For Sentinel Hub WMS, TIME should be a range so the service
 * finds the most recent image within the window.
 * Sentinel-2 revisits every 5 days, Landsat every 8 days.
 */
export function sentinelTimeRange(date, windowDays = 10) {
  const end = new Date(date + 'T00:00:00')
  const start = new Date(end)
  start.setDate(start.getDate() - windowDays)
  return `${start.toISOString().split('T')[0]}/${end.toISOString().split('T')[0]}`
}

export const QUICK_DATES = [
  { label: 'Ontem', days: 1 },
  { label: '2d', days: 2 },
  { label: '3d', days: 3 },
  { label: '5d', days: 5 },
  { label: '7d', days: 7 },
  { label: '14d', days: 14 },
  { label: '30d', days: 30 },
]
