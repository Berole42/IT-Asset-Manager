import { useState, useEffect } from 'react'
import { Monitor, AlertCircle, Wrench, Package, TrendingUp } from 'lucide-react'
import { getFromStorage, STORAGE_KEYS } from '../utils/storage'

function Dashboard() {
  const [equipments, setEquipments] = useState([])
  const [maintenance, setMaintenance] = useState([])
  const [stats, setStats] = useState({
    total: 0,
    enService: 0,
    enMaintenance: 0,
    horsService: 0,
    enStock: 0,
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    const equipData = getFromStorage(STORAGE_KEYS.EQUIPMENTS) || []
    const maintData = getFromStorage(STORAGE_KEYS.MAINTENANCE) || []
    setEquipments(equipData)
    setMaintenance(maintData)

    const newStats = {
      total: equipData.length,
      enService: equipData.filter(e => e.status === 'en_service').length,
      enMaintenance: equipData.filter(e => e.status === 'en_maintenance').length,
      horsService: equipData.filter(e => e.status === 'hors_service').length,
      enStock: equipData.filter(e => e.status === 'en_stock').length,
    }
    setStats(newStats)
  }

  const categoryData = {
    labels: ['Ordinateur', 'Portable', 'Serveur', 'Imprimante', 'Routeur', 'Switch', 'Autre'],
    datasets: [
      {
        data: [
          equipments.filter(e => e.category === 'ordinateur').length,
          equipments.filter(e => e.category === 'ordinateur portable').length,
          equipments.filter(e => e.category === 'serveur').length,
          equipments.filter(e => e.category === 'imprimante').length,
          equipments.filter(e => e.category === 'routeur').length,
          equipments.filter(e => e.category === 'switch').length,
          equipments.filter(e => e.category === 'autre').length,
        ],
        backgroundColor: [
          '#2563eb',
          '#3b82f6',
          '#1e3a5f',
          '#60a5fa',
          '#93c5fd',
          '#bfdbfe',
          '#dbeafe',
        ],
        borderWidth: 0,
      },
    ],
  }

  const statusData = {
    labels: ['En service', 'En maintenance', 'Hors service', 'En stock'],
    datasets: [
      {
        data: [stats.enService, stats.enMaintenance, stats.horsService, stats.enStock],
        backgroundColor: ['#22c55e', '#f59e0b', '#ef4444', '#6b7280'],
        borderWidth: 0,
      },
    ],
  }

  const recentEquipments = [...equipments].sort((a, b) => 
    new Date(b.acquisitionDate) - new Date(a.acquisitionDate)
  ).slice(0, 5)

  const needsIntervention = maintenance.filter(m => m.status !== 'terminee').slice(0, 5)

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
        <button
          onClick={loadData}
          className="px-4 py-2 bg-electric-blue text-white rounded-lg hover:bg-dark-blue transition-colors"
        >
          Actualiser
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard
          title="Total équipements"
          value={stats.total}
          icon={Monitor}
          color="bg-night-blue"
        />
        <StatCard
          title="En service"
          value={stats.enService}
          icon={TrendingUp}
          color="bg-green-500"
        />
        <StatCard
          title="En maintenance"
          value={stats.enMaintenance}
          icon={Wrench}
          color="bg-yellow-500"
        />
        <StatCard
          title="Hors service"
          value={stats.horsService}
          icon={AlertCircle}
          color="bg-red-500"
        />
        <StatCard
          title="En stock"
          value={stats.enStock}
          icon={Package}
          color="bg-gray-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Répartition par catégorie</h2>
          <div className="space-y-3">
            {categoryData.labels.map((label, index) => (
              <div key={label} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: categoryData.datasets[0].backgroundColor[index] }}
                  ></div>
                  <span className="text-sm text-gray-700">{label}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{categoryData.datasets[0].data[index]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Répartition par état</h2>
          <div className="space-y-3">
            {statusData.labels.map((label, index) => (
              <div key={label} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: statusData.datasets[0].backgroundColor[index] }}
                  ></div>
                  <span className="text-sm text-gray-700">{label}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{statusData.datasets[0].data[index]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Derniers équipements ajoutés</h2>
          <div className="space-y-3">
            {recentEquipments.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Aucun équipement</p>
            ) : (
              recentEquipments.map((eq) => (
                <div key={eq.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{eq.name}</p>
                    <p className="text-sm text-gray-500">{eq.category} - {eq.service}</p>
                  </div>
                  <span className="text-xs text-gray-400">{new Date(eq.acquisitionDate).toLocaleDateString('fr-FR')}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Équipements nécessitant une intervention</h2>
          <div className="space-y-3">
            {needsIntervention.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Aucune intervention en cours</p>
            ) : (
              needsIntervention.map((m) => (
                <div key={m.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{m.equipmentName}</p>
                    <p className="text-sm text-gray-500">{m.problem}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    m.priority === 'elevee' ? 'bg-red-100 text-red-700' :
                    m.priority === 'moyenne' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {m.priority}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
