import { useState, useRef } from 'react'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import MapView from './components/MapView'
import AddAreaModal from './components/AddAreaModal'
import { useAreas } from './hooks/useAreas'
import { getYesterday, LAYERS } from './utils/layers'

export default function App() {
  const { areas, addArea, updateArea, deleteArea } = useAreas()
  const [selectedAreaId, setSelectedAreaId] = useState(null)
  const [selectedLayerIdx, setSelectedLayerIdx] = useState(0)
  const [selectedDate, setSelectedDate] = useState(getYesterday())
  const [opacity, setOpacity] = useState(0.75)
  const [isAddingArea, setIsAddingArea] = useState(false)
  const [pendingCoords, setPendingCoords] = useState(null)
  const [mouseCoords, setMouseCoords] = useState(null)
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
      mapRef.current.setView([area.lat, area.lng], 12, { animate: true })
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
      mapRef.current.setView([data.lat, data.lng], 12, { animate: true })
    }
  }

  function handleCancelAdd() {
    setPendingCoords(null)
    setIsAddingArea(false)
  }

  return (
    <div className="app">
      <Header
        layers={LAYERS}
        selectedLayerIdx={selectedLayerIdx}
        onLayerChange={setSelectedLayerIdx}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        opacity={opacity}
        onOpacityChange={setOpacity}
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
          currentLayer={LAYERS[selectedLayerIdx]}
          selectedDate={selectedDate}
          opacity={opacity}
          isAddingArea={isAddingArea}
          onMapClick={handleMapClick}
          onMouseMove={setMouseCoords}
          onSelectArea={handleSelectArea}
          mapRef={mapRef}
          mouseCoords={mouseCoords}
        />
      </div>

      {pendingCoords && (
        <AddAreaModal
          coords={pendingCoords}
          onConfirm={handleAddArea}
          onCancel={handleCancelAdd}
        />
      )}
    </div>
  )
}
