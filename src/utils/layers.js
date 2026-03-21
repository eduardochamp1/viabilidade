/* ─── NASA GIBS WMS (imagens atualizadas diariamente) ──────────────── */
export const WMS_URL =
  'https://gibs.earthdata.nasa.gov/wms/epsg3857/best/wms.cgi'

/**
 * Base layers — o usuário escolhe um por vez.
 * Os do tipo "nasa" são WMS com data selecionável (imagem do dia).
 * Os do tipo "tiles" são mapas estáticos de referência.
 */
export const BASE_LAYERS = [
  {
    id: 'viirs',
    label: 'Satélite Diário — VIIRS',
    sublabel: 'Atualizado todo dia · 250m',
    type: 'nasa',
    wmsLayer: 'VIIRS_SNPP_CorrectedReflectance_TrueColor',
    format: 'image/jpeg',
    transparent: false,
  },
  {
    id: 'modis',
    label: 'Satélite Diário — MODIS',
    sublabel: 'Fallback · 250m–1km',
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

/**
 * Overlays — o usuário pode ligar vários simultaneamente.
 */
export const LABELS_URL =
  'https://services.arcgisonline.com/arcgis/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}'

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

export const QUICK_DATES = [
  { label: 'Ontem', days: 1 },
  { label: '2d', days: 2 },
  { label: '3d', days: 3 },
  { label: '5d', days: 5 },
  { label: '7d', days: 7 },
  { label: '14d', days: 14 },
]
