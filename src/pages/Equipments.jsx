import { useState, useEffect } from 'react'
import { Plus, Search, Filter, ArrowUpDown, Download, Edit2, Trash2, Eye } from 'lucide-react'
import { getFromStorage, saveToStorage, STORAGE_KEYS } from '../utils/storage'
import { exportToCSV } from '../utils/csvExport'

function Equipments() {
  const [equipments, setEquipments] = useState([])
  const [filteredEquipments, setFilteredEquipments] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterService, setFilterService] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc')
  const [showModal, setShowModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [editingEquipment, setEditingEquipment] = useState(null)
  const [viewingEquipment, setViewingEquipment] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    category: 'ordinateur',
    brand: '',
    model: '',
    serialNumber: '',
    ipAddress: '',
    operatingSystem: '',
    service: '',
    responsible: '',
    acquisitionDate: '',
    status: 'en_service',
    description: '',
  })
  const [errors, setErrors] = useState({})

  const categories = ['ordinateur', 'ordinateur portable', 'serveur', 'imprimante', 'routeur', 'switch', 'autre']
  const statuses = ['en_service', 'en_maintenance', 'hors_service', 'en_stock']
  const services = ['Informatique', 'Comptabilité', 'Ressources humaines', 'Direction', 'Marketing', 'Ventes', 'Autre']

  useEffect(() => {
    loadEquipments()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [equipments, searchTerm, filterCategory, filterStatus, filterService, sortBy, sortOrder])

  const loadEquipments = () => {
    const data = getFromStorage(STORAGE_KEYS.EQUIPMENTS) || []
    setEquipments(data)
  }

  const applyFilters = () => {
    let filtered = [...equipments]

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(eq =>
        eq.name.toLowerCase().includes(term) ||
        eq.id.toLowerCase().includes(term) ||
        eq.serialNumber.toLowerCase().includes(term) ||
        eq.ipAddress.toLowerCase().includes(term)
      )
    }

    if (filterCategory) {
      filtered = filtered.filter(eq => eq.category === filterCategory)
    }

    if (filterStatus) {
      filtered = filtered.filter(eq => eq.status === filterStatus)
    }

    if (filterService) {
      filtered = filtered.filter(eq => eq.service === filterService)
    }

    filtered.sort((a, b) => {
      let comparison = 0
      if (a[sortBy] < b[sortBy]) comparison = -1
      if (a[sortBy] > b[sortBy]) comparison = 1
      return sortOrder === 'asc' ? comparison : -comparison
    })

    setFilteredEquipments(filtered)
  }

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  const handleAdd = () => {
    setEditingEquipment(null)
    setFormData({
      id: `EQ-${String(equipments.length + 1).padStart(3, '0')}`,
      name: '',
      category: 'ordinateur',
      brand: '',
      model: '',
      serialNumber: '',
      ipAddress: '',
      operatingSystem: '',
      service: '',
      responsible: '',
      acquisitionDate: '',
      status: 'en_service',
      description: '',
    })
    setErrors({})
    setShowModal(true)
  }

  const handleEdit = (equipment) => {
    setEditingEquipment(equipment)
    setFormData({ ...equipment })
    setErrors({})
    setShowModal(true)
  }

  const handleView = (equipment) => {
    setViewingEquipment(equipment)
    setShowDetailModal(true)
  }

  const handleDelete = (id) => {
    setDeletingId(id)
    setShowDeleteConfirm(true)
  }

  const confirmDelete = () => {
    const updated = equipments.filter(eq => eq.id !== deletingId)
    setEquipments(updated)
    saveToStorage(STORAGE_KEYS.EQUIPMENTS, updated)
    setShowDeleteConfirm(false)
    setDeletingId(null)
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Le nom est requis'
    if (!formData.brand.trim()) newErrors.brand = 'La marque est requise'
    if (!formData.serialNumber.trim()) newErrors.serialNumber = 'Le numéro de série est requis'
    if (!formData.acquisitionDate) newErrors.acquisitionDate = 'La date d\'acquisition est requise'
    if (!formData.service) newErrors.service = 'Le service est requis'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validateForm()) return

    let updated
    if (editingEquipment) {
      updated = equipments.map(eq => eq.id === editingEquipment.id ? formData : eq)
    } else {
      updated = [...equipments, formData]
    }

    setEquipments(updated)
    saveToStorage(STORAGE_KEYS.EQUIPMENTS, updated)
    setShowModal(false)
    setEditingEquipment(null)
  }

  const handleExport = () => {
    exportToCSV(filteredEquipments, 'equipements')
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des équipements</h1>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download size={18} />
            Export CSV
          </button>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-electric-blue text-white rounded-lg hover:bg-dark-blue transition-colors"
          >
            <Plus size={18} />
            Ajouter
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-electric-blue focus:border-transparent"
            />
          </div>
          
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-electric-blue focus:border-transparent"
          >
            <option value="">Toutes catégories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-electric-blue focus:border-transparent"
          >
            <option value="">Tous états</option>
            {statuses.map(status => (
              <option key={status} value={status}>{status.replace('_', ' ')}</option>
            ))}
          </select>

          <select
            value={filterService}
            onChange={(e) => setFilterService(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-electric-blue focus:border-transparent"
          >
            <option value="">Tous services</option>
            {services.map(srv => (
              <option key={srv} value={srv}>{srv}</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700 cursor-pointer hover:bg-gray-50" onClick={() => handleSort('id')}>
                  ID <ArrowUpDown size={14} className="inline ml-1" />
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 cursor-pointer hover:bg-gray-50" onClick={() => handleSort('name')}>
                  Nom <ArrowUpDown size={14} className="inline ml-1" />
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Catégorie</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Service</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">État</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEquipments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-500">
                    Aucun équipement trouvé
                  </td>
                </tr>
              ) : (
                filteredEquipments.map((eq) => (
                  <tr key={eq.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">{eq.id}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{eq.name}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{eq.category}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{eq.service}</td>
                    <td className="py-3 px-4">{getStatusBadge(eq.status)}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button onClick={() => handleView(eq)} className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                          <Eye size={16} />
                        </button>
                        <button onClick={() => handleEdit(eq)} className="p-1 text-green-600 hover:bg-green-50 rounded">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(eq.id)} className="p-1 text-red-600 hover:bg-red-50 rounded">
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
                {editingEquipment ? 'Modifier l\'équipement' : 'Ajouter un équipement'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ID</label>
                  <input
                    type="text"
                    value={formData.id}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-electric-blue focus:border-transparent ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-electric-blue focus:border-transparent"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Marque *</label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-electric-blue focus:border-transparent ${errors.brand ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.brand && <p className="text-red-500 text-xs mt-1">{errors.brand}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Modèle</label>
                  <input
                    type="text"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-electric-blue focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de série *</label>
                  <input
                    type="text"
                    value={formData.serialNumber}
                    onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-electric-blue focus:border-transparent ${errors.serialNumber ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.serialNumber && <p className="text-red-500 text-xs mt-1">{errors.serialNumber}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adresse IP</label>
                  <input
                    type="text"
                    value={formData.ipAddress}
                    onChange={(e) => setFormData({ ...formData, ipAddress: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-electric-blue focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Système d'exploitation</label>
                  <input
                    type="text"
                    value={formData.operatingSystem}
                    onChange={(e) => setFormData({ ...formData, operatingSystem: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-electric-blue focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Service *</label>
                  <select
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-electric-blue focus:border-transparent ${errors.service ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">Sélectionner</option>
                    {services.map(srv => (
                      <option key={srv} value={srv}>{srv}</option>
                    ))}
                  </select>
                  {errors.service && <p className="text-red-500 text-xs mt-1">{errors.service}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Responsable</label>
                  <input
                    type="text"
                    value={formData.responsible}
                    onChange={(e) => setFormData({ ...formData, responsible: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-electric-blue focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date d'acquisition *</label>
                  <input
                    type="date"
                    value={formData.acquisitionDate}
                    onChange={(e) => setFormData({ ...formData, acquisitionDate: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-electric-blue focus:border-transparent ${errors.acquisitionDate ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.acquisitionDate && <p className="text-red-500 text-xs mt-1">{errors.acquisitionDate}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">État</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-electric-blue focus:border-transparent"
                  >
                    {statuses.map(status => (
                      <option key={status} value={status}>{status.replace('_', ' ')}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-electric-blue focus:border-transparent"
                />
              </div>
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
                  {editingEquipment ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDetailModal && viewingEquipment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Détails de l'équipement</h2>
              <button onClick={() => setShowDetailModal(false)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">ID</p>
                  <p className="font-medium text-gray-900">{viewingEquipment.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Nom</p>
                  <p className="font-medium text-gray-900">{viewingEquipment.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Catégorie</p>
                  <p className="font-medium text-gray-900">{viewingEquipment.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Marque</p>
                  <p className="font-medium text-gray-900">{viewingEquipment.brand}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Modèle</p>
                  <p className="font-medium text-gray-900">{viewingEquipment.model}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Numéro de série</p>
                  <p className="font-medium text-gray-900">{viewingEquipment.serialNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Adresse IP</p>
                  <p className="font-medium text-gray-900">{viewingEquipment.ipAddress || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Système d'exploitation</p>
                  <p className="font-medium text-gray-900">{viewingEquipment.operatingSystem || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Service</p>
                  <p className="font-medium text-gray-900">{viewingEquipment.service}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Responsable</p>
                  <p className="font-medium text-gray-900">{viewingEquipment.responsible || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date d'acquisition</p>
                  <p className="font-medium text-gray-900">{new Date(viewingEquipment.acquisitionDate).toLocaleDateString('fr-FR')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">État</p>
                  {getStatusBadge(viewingEquipment.status)}
                </div>
              </div>
              {viewingEquipment.description && (
                <div>
                  <p className="text-sm text-gray-500">Description</p>
                  <p className="font-medium text-gray-900">{viewingEquipment.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Confirmer la suppression</h2>
            <p className="text-gray-600 mb-6">Êtes-vous sûr de vouloir supprimer cet équipement ? Cette action est irréversible.</p>
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

export default Equipments
