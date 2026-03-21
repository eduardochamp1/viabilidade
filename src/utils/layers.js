/* ─── Base layers (XYZ tiles — nenhuma configuração necessária) ────── */
export const BASE_LAYERS = [
  {
    id: 'esri-satellite',
    label: 'Esri Satélite (HD)',
    sublabel: 'Alta resolução · cobertura global · gratuito',
    type: 'xyz',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution:
      '&copy; <a href="https://www.esri.com">Esri</a>, Maxar, Earthstar, CNES/Airbus',
    maxZoom: 19,
    badge: '🛰 Recomendado',
  },
  {
    id: 'google-satellite',
    label: 'Google Satélite',
    sublabel: 'Alta resolução · atualizado frequentemente',
    type: 'xyz',
    url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
    attribution: '&copy; Google',
    maxZoom: 20,
  },
  {
    id: 'google-hybrid',
    label: 'Google Híbrido',
    sublabel: 'Satélite + ruas e rótulos',
    type: 'xyz',
    url: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
    attribution: '&copy; Google',
    maxZoom: 20,
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
  },
]

/* ─── Labels overlay (for satellite-only bases) ───────────────────── */
export const LABELS_URL =
  'https://services.arcgisonline.com/arcgis/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}'
