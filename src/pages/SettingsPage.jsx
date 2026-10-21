import { useState } from 'react'
import { clearAllStorage } from '../utils/storage'
import { loadDemoData } from '../utils/demoData'

function SettingsPage() {
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  const handleResetDemoData = () => {
    clearAllStorage()
    loadDemoData()
    setShowResetConfirm(false)
    window.location.reload()
  }

  const handleClearAllData = () => {
    clearAllStorage()
    setShowClearConfirm(false)
    window.location.reload()
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Gestion des données</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                🔄
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Réinitialiser les données de démonstration</h3>
                <p className="text-sm text-gray-500">Restaurer les données d'exemple initiales</p>
              </div>
            </div>
            <button
              onClick={() => setShowResetConfirm(true)}
              className="px-4 py-2 bg-electric-blue text-white rounded-lg hover:bg-dark-blue transition-colors"
            >
              Réinitialiser
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                🗑️
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Supprimer toutes les données</h3>
                <p className="text-sm text-gray-500">Effacer toutes les données de l'application</p>
              </div>
            </div>
            <button
              onClick={() => setShowClearConfirm(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Supprimer
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations</h2>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <div className="p-2 bg-green-100 rounded-lg">
              💾
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Stockage local</h3>
              <p className="text-sm text-gray-500">
                Les données sont stockées dans le LocalStorage de votre navigateur
              </p>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Version de l'application</h3>
            <p className="text-sm text-gray-500">IT Asset Manager v1.0.0</p>
          </div>
        </div>
      </div>

      {showResetConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Confirmer la réinitialisation</h2>
            <p className="text-gray-600 mb-6">
              Cette action va réinitialiser toutes les données avec les données de démonstration. 
              Vos modifications actuelles seront perdues.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleResetDemoData}
                className="px-4 py-2 bg-electric-blue text-white rounded-lg hover:bg-dark-blue transition-colors"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      {showClearConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Confirmer la suppression</h2>
            <p className="text-gray-600 mb-6">
              Cette action va supprimer toutes les données de l'application. 
              Cette action est irréversible.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleClearAllData}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Supprimer tout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SettingsPage
