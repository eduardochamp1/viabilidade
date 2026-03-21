import { useState, useRef } from 'react'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import MapView from './components/MapView'
import AddAreaModal from './components/AddAreaModal'
import { useAreas } from './hooks/useAreas'
import { useRainRadar } from './hooks/useRainRadar'

export default function App() {
  const { areas, addArea, updateArea, deleteArea } = useAreas()
  const rain = useRainRadar()

  // Area selection
  const [selectedAreaId, setSelectedAreaId] = useState(null)
  const [isAddingArea, setIsAddingArea] = useState(false)
  const [pendingCoords, setPendingCoords] = useState(null)

  // Layers — default to Esri Satellite (best quality, no config needed)
  const [baseLayerId, setBaseLayerId] = useState('esri-satellite')
  const [showLabels, setShowLabels] = useState(true)
  const [showRadar, setShowRadar] = useState(false)

  // UI
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const mapRef = useRef(null)

  const stats = {
    total: areas.length,
    liberado: areas.filter(a => a.status === 'Liberado').length,
    atencao: areas.filter(a => a.status === 'Atenção').length,
    bloqueado: areas.filter(a => a.status === 'Bloqueado').length,
  }

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
          mapRef={mapRef}
          isAddingArea={isAddingArea}
          // Layers
          baseLayerId={baseLayerId}
          onBaseLayerChange={setBaseLayerId}
          showLabels={showLabels}
          onToggleLabels={() => setShowLabels(v => !v)}
          showRadar={showRadar}
          onToggleRadar={() => setShowRadar(v => !v)}
          rain={rain}
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
    </div>
  )
}
