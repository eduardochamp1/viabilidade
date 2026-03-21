import { useState, useRef, useCallback } from 'react'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import MapView from './components/MapView'
import AddAreaModal from './components/AddAreaModal'
import SettingsModal from './components/SettingsModal'
import { useAreas } from './hooks/useAreas'
import { useRainRadar } from './hooks/useRainRadar'
import { useSettings } from './hooks/useSettings'
import { getYesterday } from './utils/layers'

export default function App() {
  const { areas, addArea, updateArea, deleteArea } = useAreas()
  const rain = useRainRadar()
  const { settings, updateAll, isConfigured, wmsBaseUrl } = useSettings()

  // Area selection
  const [selectedAreaId, setSelectedAreaId] = useState(null)
  const [isAddingArea, setIsAddingArea] = useState(false)
  const [pendingCoords, setPendingCoords] = useState(null)

  // Layers — default to Sentinel-2 if configured, else NASA VIIRS
  const [baseLayerId, setBaseLayerId] = useState(
    isConfigured ? 'sentinel2' : 'viirs',
  )
  const [showLabels, setShowLabels] = useState(true)
  const [activeOverlays, setActiveOverlays] = useState([])
  const [nasaDate, setNasaDate] = useState(getYesterday())
  const [nasaOpacity, setNasaOpacity] = useState(1.0)
  const [showRadar, setShowRadar] = useState(false)

  // UI
  const [mouseCoords, setMouseCoords] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const mapRef = useRef(null)

  const stats = {
    total: areas.length,
    liberado: areas.filter(a => a.status === 'Liberado').length,
    atencao: areas.filter(a => a.status === 'Atenção').length,
    bloqueado: areas.filter(a => a.status === 'Bloqueado').length,
  }

  const toggleOverlay = useCallback(id => {
    setActiveOverlays(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id],
    )
  }, [])

  function handleSelectArea(area) {
    setSelectedAreaId(area.id)
    if (mapRef.current) {
      mapRef.current.setView([area.lat, area.lng], 14, { animate: true })
    }
  }

  function handleMapClick(latlng) {
    if (isAddingArea) {
      setPendingCoords(latlng)
      setIsAddingArea(false)
    }
  }

  function handleAddArea(data) {
    const newArea = addArea(data)
    setPendingCoords(null)
    setSelectedAreaId(newArea.id)
    if (mapRef.current) {
      mapRef.current.setView([data.lat, data.lng], 14, { animate: true })
    }
  }

  function handleSaveSettings(newSettings) {
    updateAll(newSettings)
    // Auto-switch to Sentinel-2 when first configured
    if (newSettings.instanceId?.trim() && !isConfigured) {
      setBaseLayerId('sentinel2')
    }
  }

  return (
    <div className="app">
      <Header
        stats={stats}
        onToggleSidebar={() => setSidebarOpen(v => !v)}
        sidebarOpen={sidebarOpen}
      />

      <div className="main-layout">
        <Sidebar
          areas={areas}
          selectedAreaId={selectedAreaId}
          onSelectArea={handleSelectArea}
          onDeleteArea={deleteArea}
          onUpdateArea={updateArea}
          isAddingArea={isAddingArea}
          onStartAddArea={() => setIsAddingArea(true)}
          onCancelAddArea={() => setIsAddingArea(false)}
          isOpen={sidebarOpen}
        />

        <MapView
          areas={areas}
          selectedAreaId={selectedAreaId}
          onSelectArea={handleSelectArea}
          onMapClick={handleMapClick}
          onMouseMove={setMouseCoords}
          mapRef={mapRef}
          mouseCoords={mouseCoords}
          isAddingArea={isAddingArea}
          // Layers
          baseLayerId={baseLayerId}
          onBaseLayerChange={setBaseLayerId}
          showLabels={showLabels}
          onToggleLabels={() => setShowLabels(v => !v)}
          activeOverlays={activeOverlays}
          onToggleOverlay={toggleOverlay}
          nasaDate={nasaDate}
          onNasaDateChange={setNasaDate}
          nasaOpacity={nasaOpacity}
          onNasaOpacityChange={setNasaOpacity}
          showRadar={showRadar}
          onToggleRadar={() => setShowRadar(v => !v)}
          rain={rain}
          // Sentinel/GIS
          gisSettings={settings}
          isGisConfigured={isConfigured}
          wmsBaseUrl={wmsBaseUrl}
          onOpenSettings={() => setSettingsOpen(true)}
        />
      </div>

      {/* Add area modal */}
      {pendingCoords && (
        <AddAreaModal
          coords={pendingCoords}
          onConfirm={handleAddArea}
          onCancel={() => {
            setPendingCoords(null)
            setIsAddingArea(false)
          }}
        />
      )}

      {/* Settings modal */}
      {settingsOpen && (
        <SettingsModal
          settings={settings}
          onSave={handleSaveSettings}
          onClose={() => setSettingsOpen(false)}
        />
      )}
    </div>
  )
}
