import { useState, useEffect } from 'react'
import { getFromStorage, STORAGE_KEYS } from '../utils/storage'

function Services() {
  const [services, setServices] = useState([])
  const [equipments, setEquipments] = useState([])
  const [selectedService, setSelectedService] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    const servicesData = getFromStorage(STORAGE_KEYS.SERVICES) || []
    const equipData = getFromStorage(STORAGE_KEYS.EQUIPMENTS) || []
    setServices(servicesData)
    setEquipments(equipData)
  }

  const getServiceStats = (serviceName) => {
    const serviceEquipments = equipments.filter(eq => eq.service === serviceName)
    return {
      total: serviceEquipments.length,
      enService: serviceEquipments.filter(eq => eq.status === 'en_service').length,
      enMaintenance: serviceEquipments.filter(eq => eq.status === 'en_maintenance').length,
      horsService: serviceEquipments.filter(eq => eq.status === 'hors_service').length,
      enStock: serviceEquipments.filter(eq => eq.status === 'en_stock').length,
    }
  }

  const getStatusBadge = (status) => {
    const styles = {
      en_service: 'bg-green-100 text-green-700',
      en_maintenance: 'bg-yellow-100 text-yellow-700',
      hors_service: 'bg-red-100 text-red-700',
      en_stock: 'bg-gray-100 text-gray-700',
    }
    const labels = {
      en_service: 'En service',
      en_maintenance: 'En maintenance',
      hors_service: 'Hors service',
      en_stock: 'En stock',
    }
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${styles[status]}`}>
        {labels[status]}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Gestion des services</h1>

      {!selectedService ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const stats = getServiceStats(service.name)
            return (
              <div
                key={service.id}
                onClick={() => setSelectedService(service)}
                className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md cursor-pointer transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-electric-blue rounded-lg">
                    🏢
                  </div>
                  <span className="text-gray-400">→</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{service.description}</p>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>👥</span>
                  <span>{stats.total} équipement{stats.total !== 1 ? 's' : ''}</span>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div>
          <button
            onClick={() => setSelectedService(null)}
            className="flex items-center gap-2 text-electric-blue hover:text-dark-blue mb-6"
          >
            ← Retour aux services
          </button>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 bg-electric-blue rounded-lg">
                🏢
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedService.name}</h2>
                <p className="text-gray-500">{selectedService.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-2xl font-bold text-gray-900">{getServiceStats(selectedService.name).total}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm text-gray-500">En service</p>
                <p className="text-2xl font-bold text-green-600">{getServiceStats(selectedService.name).enService}</p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4">
                <p className="text-sm text-gray-500">En maintenance</p>
                <p className="text-2xl font-bold text-yellow-600">{getServiceStats(selectedService.name).enMaintenance}</p>
              </div>
              <div className="bg-red-50 rounded-lg p-4">
                <p className="text-sm text-gray-500">Hors service</p>
                <p className="text-2xl font-bold text-red-600">{getServiceStats(selectedService.name).horsService}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Équipements du service</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">ID</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Nom</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Catégorie</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Responsable</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">État</th>
                  </tr>
                </thead>
                <tbody>
                  {equipments.filter(eq => eq.service === selectedService.name).length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-8 text-gray-500">
                        Aucun équipement dans ce service
                      </td>
                    </tr>
                  ) : (
                    equipments
                      .filter(eq => eq.service === selectedService.name)
                      .map((eq) => (
                        <tr key={eq.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm font-medium text-gray-900">{eq.id}</td>
                          <td className="py-3 px-4 text-sm text-gray-700">{eq.name}</td>
                          <td className="py-3 px-4 text-sm text-gray-700">{eq.category}</td>
                          <td className="py-3 px-4 text-sm text-gray-700">{eq.responsible || '-'}</td>
                          <td className="py-3 px-4">{getStatusBadge(eq.status)}</td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Services
