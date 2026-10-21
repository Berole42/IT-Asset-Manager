import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, CheckCircle } from 'lucide-react'
import { getFromStorage, saveToStorage, STORAGE_KEYS } from '../utils/storage'

function Maintenance() {
  const [maintenance, setMaintenance] = useState([])
  const [equipments, setEquipments] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingMaintenance, setEditingMaintenance] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [formData, setFormData] = useState({
    id: '',
    equipmentId: '',
    equipmentName: '',
    problem: '',
    declarationDate: '',
    technician: '',
    priority: 'moyenne',
    status: 'en_attente',
    comments: '',
  })
  const [errors, setErrors] = useState({})

  const priorities = ['basse', 'moyenne', 'elevee']
  const statuses = ['en_attente', 'en_cours', 'terminee']

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    const maintData = getFromStorage(STORAGE_KEYS.MAINTENANCE) || []
    const equipData = getFromStorage(STORAGE_KEYS.EQUIPMENTS) || []
    setMaintenance(maintData)
    setEquipments(equipData)
  }

  const handleAdd = () => {
    setEditingMaintenance(null)
    setFormData({
      id: `MAINT-${String(maintenance.length + 1).padStart(3, '0')}`,
      equipmentId: '',
      equipmentName: '',
      problem: '',
      declarationDate: new Date().toISOString().split('T')[0],
      technician: '',
      priority: 'moyenne',
      status: 'en_attente',
      comments: '',
    })
    setErrors({})
    setShowModal(true)
  }

  const handleEdit = (maint) => {
    setEditingMaintenance(maint)
    setFormData({ ...maint })
    setErrors({})
    setShowModal(true)
  }

  const handleDelete = (id) => {
    setDeletingId(id)
    setShowDeleteConfirm(true)
  }

  const confirmDelete = () => {
    const updated = maintenance.filter(m => m.id !== deletingId)
    setMaintenance(updated)
    saveToStorage(STORAGE_KEYS.MAINTENANCE, updated)
    setShowDeleteConfirm(false)
    setDeletingId(null)
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.equipmentId) newErrors.equipmentId = 'L\'équipement est requis'
    if (!formData.problem.trim()) newErrors.problem = 'Le problème est requis'
    if (!formData.technician.trim()) newErrors.technician = 'Le technicien est requis'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validateForm()) return

    const equipment = equipments.find(eq => eq.id === formData.equipmentId)
    const updatedFormData = {
      ...formData,
      equipmentName: equipment ? equipment.name : formData.equipmentName
    }

    let updated
    if (editingMaintenance) {
      updated = maintenance.map(m => m.id === editingMaintenance.id ? updatedFormData : m)
      
      if (updatedFormData.status === 'terminee' && editingMaintenance.status !== 'terminee') {
        const updatedEquipments = equipments.map(eq => {
          if (eq.id === updatedFormData.equipmentId) {
            return { ...eq, status: 'en_service' }
          }
          return eq
        })
        setEquipments(updatedEquipments)
        saveToStorage(STORAGE_KEYS.EQUIPMENTS, updatedEquipments)
      }
    } else {
      updated = [...maintenance, updatedFormData]
    }

    setMaintenance(updated)
    saveToStorage(STORAGE_KEYS.MAINTENANCE, updated)
    setShowModal(false)
    setEditingMaintenance(null)
  }

  const getPriorityBadge = (priority) => {
    const styles = {
      basse: 'bg-green-100 text-green-700',
      moyenne: 'bg-yellow-100 text-yellow-700',
      elevee: 'bg-red-100 text-red-700',
    }
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${styles[priority]}`}>
        {priority}
      </span>
    )
  }

  const getStatusBadge = (status) => {
    const styles = {
      en_attente: 'bg-gray-100 text-gray-700',
      en_cours: 'bg-blue-100 text-blue-700',
      terminee: 'bg-green-100 text-green-700',
    }
    const labels = {
      en_attente: 'En attente',
      en_cours: 'En cours',
      terminee: 'Terminée',
    }
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${styles[status]}`}>
        {labels[status]}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Gestion de la maintenance</h1>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-electric-blue text-white rounded-lg hover:bg-dark-blue transition-colors"
        >
          <Plus size={18} />
          Nouvelle intervention
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">ID</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Équipement</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Problème</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Technicien</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Priorité</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Statut</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {maintenance.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-8 text-gray-500">
                    Aucune intervention enregistrée
                  </td>
                </tr>
              ) : (
                maintenance.map((m) => (
                  <tr key={m.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">{m.id}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{m.equipmentName}</td>
                    <td className="py-3 px-4 text-sm text-gray-700 max-w-xs truncate">{m.problem}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{new Date(m.declarationDate).toLocaleDateString('fr-FR')}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{m.technician}</td>
                    <td className="py-3 px-4">{getPriorityBadge(m.priority)}</td>
                    <td className="py-3 px-4">{getStatusBadge(m.status)}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(m)} className="p-1 text-green-600 hover:bg-green-50 rounded">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(m.id)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingMaintenance ? 'Modifier l\'intervention' : 'Nouvelle intervention'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Équipement *</label>
                  <select
                    value={formData.equipmentId}
                    onChange={(e) => {
                      const equipment = equipments.find(eq => eq.id === e.target.value)
                      setFormData({
                        ...formData,
                        equipmentId: e.target.value,
                        equipmentName: equipment ? equipment.name : ''
                      })
                    }}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-electric-blue focus:border-transparent ${errors.equipmentId ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">Sélectionner un équipement</option>
                    {equipments.map(eq => (
                      <option key={eq.id} value={eq.id}>{eq.name} ({eq.id})</option>
                    ))}
                  </select>
                  {errors.equipmentId && <p className="text-red-500 text-xs mt-1">{errors.equipmentId}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Problème signalé *</label>
                  <textarea
                    value={formData.problem}
                    onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                    rows="3"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-electric-blue focus:border-transparent ${errors.problem ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.problem && <p className="text-red-500 text-xs mt-1">{errors.problem}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date de déclaration</label>
                  <input
                    type="date"
                    value={formData.declarationDate}
                    onChange={(e) => setFormData({ ...formData, declarationDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-electric-blue focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Technicien responsable *</label>
                  <input
                    type="text"
                    value={formData.technician}
                    onChange={(e) => setFormData({ ...formData, technician: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-electric-blue focus:border-transparent ${errors.technician ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.technician && <p className="text-red-500 text-xs mt-1">{errors.technician}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priorité</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-electric-blue focus:border-transparent"
                  >
                    {priorities.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-electric-blue focus:border-transparent"
                  >
                    {statuses.map(s => (
                      <option key={s} value={s}>{s.replace('_', ' ')}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Commentaires de suivi</label>
                <textarea
                  value={formData.comments}
                  onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-electric-blue focus:border-transparent"
                />
              </div>
              {editingMaintenance && editingMaintenance.status !== 'terminee' && formData.status === 'terminee' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-sm text-green-700">
                    <CheckCircle size={16} className="inline mr-1" />
                    L'état de l'équipement sera automatiquement mis à jour en "En service"
                  </p>
                </div>
              )}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-electric-blue text-white rounded-lg hover:bg-dark-blue transition-colors"
                >
                  {editingMaintenance ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Confirmer la suppression</h2>
            <p className="text-gray-600 mb-6">Êtes-vous sûr de vouloir supprimer cette intervention ? Cette action est irréversible.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Maintenance
