import { useState, useRef } from 'react'

const NOMINATIM = 'https://nominatim.openstreetmap.org/search'

export default function MapSearch({ mapRef }) {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState(null) // { type: 'ok'|'err', msg }
  const [loading, setLoading] = useState(false)
  const inputRef = useRef(null)

  async function handleSearch(e) {
    e.preventDefault()
    const q = query.trim()
    if (!q) return

    // Verifica se é coordenada: "-20.649, -40.488" ou "-20.649 -40.488"
    const coordMatch = q.match(/^(-?\d+\.?\d*)[,\s]+(-?\d+\.?\d*)$/)
    if (coordMatch) {
      const lat = parseFloat(coordMatch[1])
      const lng = parseFloat(coordMatch[2])
      if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        mapRef.current?.flyTo([lat, lng], 14)
        setStatus({ type: 'ok', msg: `📍 ${lat.toFixed(5)}, ${lng.toFixed(5)}` })
        return
      }
    }

    // Busca por texto via Nominatim
    setLoading(true)
    setStatus(null)
    try {
      // Tenta Brasil primeiro
      let res = await fetch(
        `${NOMINATIM}?q=${encodeURIComponent(q)}&format=json&limit=1&countrycodes=br`
      )
      let data = await res.json()

      // Fallback global
      if (!data.length) {
        res = await fetch(
          `${NOMINATIM}?q=${encodeURIComponent(q)}&format=json&limit=1`
        )
        data = await res.json()
      }

      if (data.length) {
        const { lat, lon, display_name } = data[0]
        mapRef.current?.flyTo([parseFloat(lat), parseFloat(lon)], 13)
        setStatus({ type: 'ok', msg: `📍 ${display_name.split(',').slice(0, 2).join(',')}` })
      } else {
        setStatus({ type: 'err', msg: 'Local não encontrado' })
      }
    } catch {
      setStatus({ type: 'err', msg: 'Erro na busca' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="map-search">
      <form className="map-search-form" onSubmit={handleSearch}>
        <input
          ref={inputRef}
          className="map-search-input"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Buscar endereço, cidade ou coordenadas..."
        />
        <button className="map-search-btn" type="submit" disabled={loading}>
          {loading ? '…' : '🔍'}
        </button>
      </form>
      {status && (
        <div className={status.type === 'ok' ? 'map-search-result' : 'map-search-error'}>
          {status.msg}
        </div>
      )}
    </div>
  )
}
