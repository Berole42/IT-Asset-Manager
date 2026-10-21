import { useState, useEffect } from 'react'
import { getFromStorage, STORAGE_KEYS } from '../utils/storage'

function Alerts() {
  const [alerts, setAlerts] = useState([])
  const [equipments, setEquipments] = useState([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    const equipData = getFromStorage(STORAGE_KEYS.EQUIPMENTS) || []
    setEquipments(equipData)
    generateAlerts(equipData)
  }

  const generateAlerts = (equipData) => {
    const generatedAlerts = []

    equipData.forEach(eq => {
      if (eq.status === 'en_maintenance') {
        generatedAlerts.push({
          id: `ALT-${eq.id}-MAINT`,
          type: 'warning',
          icon: '⚠️',
          title: 'Équipement en maintenance',
          message: `${eq.name} (${eq.id}) est actuellement en maintenance`,
          equipmentId: eq.id,
          equipmentName: eq.name
        })
      }

      if (eq.status === 'hors_service') {
        generatedAlerts.push({
          id: `ALT-${eq.id}-HS`,
          type: 'error',
          icon: '❌',
          title: 'Équipement hors service',
          message: `${eq.name} (${eq.id}) est hors service`,
          equipmentId: eq.id,
          equipmentName: eq.name
        })
      }

      const needsIP = ['ordinateur', 'ordinateur portable', 'serveur', 'routeur', 'switch']
      if (needsIP.includes(eq.category) && !eq.ipAddress) {
        generatedAlerts.push({
          id: `ALT-${eq.id}-IP`,
          type: 'warning',
          icon: 'ℹ️',
          title: 'Adresse IP manquante',
          message: `${eq.name} (${eq.id}) devrait avoir une adresse IP`,
          equipmentId: eq.id,
          equipmentName: eq.name
        })
      }

      if (!eq.name || !eq.brand || !eq.serialNumber || !eq.acquisitionDate || !eq.service) {
        generatedAlerts.push({
          id: `ALT-${eq.id}-INFO`,
          type: 'info',
          icon: 'ℹ️',
          title: 'Informations incomplètes',
          message: `${eq.name || eq.id} a des informations manquantes`,
          equipmentId: eq.id,
          equipmentName: eq.name || eq.id
        })
      }
    })

    setAlerts(generatedAlerts)
  }

  const getAlertStyle = (type) => {
    const styles = {
      warning: 'border-yellow-400 bg-yellow-50',
      error: 'border-red-400 bg-red-50',
      info: 'border-blue-400 bg-blue-50',
    }
    return styles[type] || styles.info
  }

  const getIconColor = (type) => {
    const colors = {
      warning: 'text-yellow-600',
      error: 'text-red-600',
      info: 'text-blue-600',
    }
    return colors[type] || colors.info
  }

  const alertCounts = {
    total: alerts.length,
    warning: alerts.filter(a => a.type === 'warning').length,
    error: alerts.filter(a => a.type === 'error').length,
    info: alerts.filter(a => a.type === 'info').length,
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Alertes</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total alertes</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{alertCounts.total}</p>
            </div>
            <div className="p-3 bg-gray-100 rounded-lg">
              ⚠️
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Avertissements</p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">{alertCounts.warning}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              ⚠️
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Erreurs</p>
              <p className="text-3xl font-bold text-red-600 mt-2">{alertCounts.error}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              ❌
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Informations</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">{alertCounts.info}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              ℹ️
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Liste des alertes</h2>
          <button
            onClick={loadData}
            className="px-4 py-2 bg-electric-blue text-white rounded-lg hover:bg-dark-blue transition-colors"
          >
            Actualiser
          </button>
        </div>

        {alerts.length === 0 ? (
          <div className="text-center py-12">
            <div className="p-4 bg-green-100 rounded-full inline-flex mb-4">
              ✅
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune alerte</h3>
            <p className="text-gray-500">Tous les équipements sont dans un état normal</p>
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`border-l-4 ${getAlertStyle(alert.type)} rounded-r-lg p-4`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{alert.icon}</span>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{alert.title}</h4>
                    <p className="text-gray-600 mt-1">{alert.message}</p>
                    <p className="text-sm text-gray-500 mt-2">Équipement: {alert.equipmentName} ({alert.equipmentId})</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Alerts
