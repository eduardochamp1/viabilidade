import { useState, useEffect, useCallback } from 'react'

/**
 * Integrates with the free RainViewer API to provide real-time
 * precipitation radar tiles. Auto-refreshes every 5 minutes.
 *
 * https://www.rainviewer.com/api.html
 */
export function useRainRadar() {
  const [frames, setFrames] = useState([])      // all available radar frames
  const [frameIdx, setFrameIdx] = useState(-1)  // currently selected frame
  const [loading, setLoading] = useState(false)

  const fetchFrames = useCallback(() => {
    setLoading(true)
    fetch('https://api.rainviewer.com/public/weather-maps.json')
      .then(r => r.json())
      .then(data => {
        const past = data.radar?.past ?? []
        const nowcast = data.radar?.nowcast ?? []
        const all = [...past, ...nowcast]
        setFrames(all)
        // Default to latest past frame
        if (past.length > 0) {
          setFrameIdx(past.length - 1)
        }
      })
      .catch(() => setFrames([]))
      .finally(() => setLoading(false))
  }, [])

  // Fetch on mount + refresh every 5 min
  useEffect(() => {
    fetchFrames()
    const id = setInterval(fetchFrames, 5 * 60 * 1000)
    return () => clearInterval(id)
  }, [fetchFrames])

  const currentFrame = frames[frameIdx] ?? null

  // Build tile URL for current frame
  // color=2 (universal scheme), smooth=1, snow=1
  const radarTileUrl = currentFrame
    ? `https://tilecache.rainviewer.com${currentFrame.path}/256/{z}/{x}/{y}/2/1_1.png`
    : null

  const radarTime = currentFrame
    ? new Date(currentFrame.time * 1000)
    : null

  const isNowcast = frameIdx >= (frames.length - (frames.length - frames.filter(f => f).length))

  return {
    radarTileUrl,
    radarTime,
    frames,
    frameIdx,
    setFrameIdx,
    loading,
    totalFrames: frames.length,
    isNowcast: currentFrame ? frames.indexOf(currentFrame) >= frames.length - 3 : false,
  }
}
