const STORAGE_KEYS = {
  EQUIPMENTS: 'it_asset_manager_equipments',
  MAINTENANCE: 'it_asset_manager_maintenance',
  SERVICES: 'it_asset_manager_services',
  DEMO_DATA_LOADED: 'it_asset_manager_demo_loaded'
}

export const getFromStorage = (key) => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : null
  } catch (error) {
    console.error(`Error reading from localStorage: ${error}`)
    return null
  }
}

export const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data))
    return true
  } catch (error) {
    console.error(`Error saving to localStorage: ${error}`)
    return false
  }
}

export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key)
    return true
  } catch (error) {
    console.error(`Error removing from localStorage: ${error}`)
    return false
  }
}

export const clearAllStorage = () => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key)
    })
    return true
  } catch (error) {
    console.error(`Error clearing localStorage: ${error}`)
    return false
  }
}

export { STORAGE_KEYS }
