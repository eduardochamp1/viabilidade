import { useState, useEffect } from 'react'

const STORAGE_KEY = 'ccm-areas-v1'

const DEMO_AREAS = [
  {
    id: 'demo-1',
    name: 'Área Centro Vitória',
    municipio: 'Vitória',
    tipo: 'Viabilidade',
    lat: -20.3155,
    lng: -40.3128,
    status: 'Liberado',
    observacao: 'Acesso normal. Sem restrições viárias.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'demo-2',
    name: 'Região Linhares Norte',
    municipio: 'Linhares',
    tipo: 'Execução',
    lat: -19.3952,
    lng: -40.0648,
    status: 'Atenção',
    observacao: 'Previsão de chuva. Verificar condições antes do despacho.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'demo-3',
    name: 'Zona Rural Colatina',
    municipio: 'Colatina',
    tipo: 'Manutenção',
    lat: -19.5387,
    lng: -40.6285,
    status: 'Bloqueado',
    observacao: 'Estrada vicinal alagada. Equipe aguarda liberação.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'demo-4',
    name: 'Subestação Cachoeiro',
    municipio: 'Cachoeiro de Itapemirim',
    tipo: 'Emergência',
    lat: -20.8493,
    lng: -41.1128,
    status: 'Atenção',
    observacao: 'Falha reportada. Equipe emergencial despachada.',
    createdAt: new Date().toISOString(),
  },
]

export function useAreas() {
  const [areas, setAreas] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch {}
    return DEMO_AREAS
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(areas))
    } catch {}
  }, [areas])

  function addArea(area) {
    const newArea = {
      ...area,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }
    setAreas(prev => [newArea, ...prev])
    return newArea
  }

  function updateArea(id, updates) {
    setAreas(prev => prev.map(a => (a.id === id ? { ...a, ...updates } : a)))
  }

  function deleteArea(id) {
    setAreas(prev => prev.filter(a => a.id !== id))
  }

  return { areas, addArea, updateArea, deleteArea }
}
