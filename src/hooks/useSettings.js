import { useState, useEffect } from 'react'

const STORAGE_KEY = 'ccm-settings-v1'

const DEFAULTS = {
  provider: 'copernicus', // 'copernicus' | 'sentinelhub'
  instanceId: '',
  sentinelLayer: 'TRUE_COLOR',
  landsatLayer: 'TRUE_COLOR',
  maxCloudCover: 30,
}

const WMS_URLS = {
  copernicus: 'https://sh.dataspace.copernicus.eu/ogc/wms/',
  sentinelhub: 'https://services.sentinel-hub.com/ogc/wms/',
}

export function useSettings() {
  const [settings, setSettings] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) return { ...DEFAULTS, ...JSON.parse(stored) }
    } catch {}
    return DEFAULTS
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    } catch {}
  }, [settings])

  function update(key, value) {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  function updateAll(obj) {
    setSettings(prev => ({ ...prev, ...obj }))
  }

  const isConfigured = Boolean(settings.instanceId?.trim())

  const wmsBaseUrl = isConfigured
    ? `${WMS_URLS[settings.provider]}${settings.instanceId}`
    : null

  return { settings, update, updateAll, isConfigured, wmsBaseUrl }
}
