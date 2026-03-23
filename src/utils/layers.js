/* ─── Base layers ──────────────────────────────────────────────────── */
export const BASE_LAYERS = [
  {
    id: 'esri-satellite',
    label: 'Esri Satélite (HD)',
    sublabel: 'Alta resolução · cobertura global · gratuito',
    type: 'xyz',
    url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution:
      '&copy; <a href="https://www.esri.com">Esri</a>, Maxar, Earthstar, CNES/Airbus',
    maxZoom: 19,
    mapMaxZoom: 19,
    badge: '🛰 Recomendado',
    updateLabel: 'Imagem mais recente (varia por região)',
  },
  {
    id: 'google-hybrid',
    label: 'Google Híbrido',
    sublabel: 'Satélite + ruas e rótulos · zoom até 20',
    type: 'xyz',
    url: 'https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
    subdomains: ['0', '1', '2', '3'],
    attribution: '&copy; Google',
    maxZoom: 20,
    mapMaxZoom: 20,
    badge: '🛣 Satélite + Vias',
    updateLabel: 'Imagem mais recente disponível',
  },
  {
    id: 'google-satellite',
    label: 'Google Satélite',
    sublabel: 'Alta resolução · atualizado frequentemente',
    type: 'xyz',
    url: 'https://mt{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
    subdomains: ['0', '1', '2', '3'],
    attribution: '&copy; Google',
    maxZoom: 20,
    mapMaxZoom: 20,
    updateLabel: 'Imagem mais recente disponível',
  },
  {
    id: 'sentinel2',
    label: 'Sentinel-2 (10m)',
    sublabel: 'Atualizado a cada 5 dias · resolução 10m · requer configuração',
    type: 'wms',
    source: 'sentinel2',
    badge: '🔭 Alta Resolução',
    mapMaxZoom: 17,
  },
  {
    id: 'landsat',
    label: 'Landsat 8/9 (30m)',
    sublabel: 'Atualizado a cada 8 dias · resolução 30m · requer configuração',
    type: 'wms',
    source: 'landsat',
    badge: '🛰 Cobertura ampla',
    mapMaxZoom: 14,
  },
  {
    id: 'sentinel1',
    label: 'Sentinel-1 SAR',
    sublabel: 'Detecta alagamentos através de nuvens · requer configuração',
    type: 'wms',
    source: 'sentinel1',
    badge: '🌊 Detecta Alagamentos',
    mapMaxZoom: 15,
  },
  {
    id: 'osm',
    label: 'Mapa de Ruas (OSM)',
    sublabel: 'OpenStreetMap',
    type: 'xyz',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
    mapMaxZoom: 19,
  },
]

export const LABELS_URL =
  'https://services.arcgisonline.com/arcgis/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}'

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

export function sentinelTimeRange(date, windowDays = 10) {
  const end = new Date(date + 'T00:00:00')
  const start = new Date(end)
  start.setDate(start.getDate() - windowDays)
  return `${start.toISOString().split('T')[0]}/${end.toISOString().split('T')[0]}`
}

export const QUICK_DATES = [
  { label: 'Ontem', days: 1 },
  { label: '3d', days: 3 },
  { label: '7d', days: 7 },
  { label: '14d', days: 14 },
  { label: '30d', days: 30 },
  { label: '60d', days: 60 },
]
