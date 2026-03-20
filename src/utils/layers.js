export const WMS_URL = 'https://gibs.earthdata.nasa.gov/wms/epsg3857/best/wms.cgi'

export const LAYERS = [
  {
    id: 'VIIRS_SNPP_CorrectedReflectance_TrueColor',
    label: 'True Color — VIIRS',
    format: 'image/jpeg',
    transparent: false,
    description: 'Imagem óptica colorida (VIIRS/SNPP). Principal.',
  },
  {
    id: 'MODIS_Terra_CorrectedReflectance_TrueColor',
    label: 'True Color — MODIS',
    format: 'image/jpeg',
    transparent: false,
    description: 'Imagem óptica colorida (MODIS/Terra). Fallback.',
  },
  {
    id: 'VIIRS_SNPP_Fires_375m',
    label: 'Focos de Calor',
    format: 'image/png',
    transparent: true,
    description: 'Focos de queimada detectados pelo VIIRS (375m).',
  },
  {
    id: 'MODIS_Terra_Land_Surface_Temp_Day',
    label: 'Temperatura Superficial',
    format: 'image/png',
    transparent: true,
    description: 'Temperatura da superfície terrestre diurna (MODIS/Terra).',
  },
  {
    id: null,
    label: 'Desligado',
    format: null,
    transparent: true,
    description: 'Apenas mapa base OpenStreetMap.',
  },
]

export function getYesterday() {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().split('T')[0]
}

export function getMaxDate() {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().split('T')[0]
}
