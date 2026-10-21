import { useState } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import Dashboard from '../pages/Dashboard'
import Equipments from '../pages/Equipments'
import Maintenance from '../pages/Maintenance'
import Services from '../pages/Services'
import Alerts from '../pages/Alerts'
import SettingsPage from '../pages/SettingsPage'

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const location = useLocation()

  const navigation = [
    { name: 'Tableau de bord', href: '/' },
    { name: 'Équipements', href: '/equipments' },
    { name: 'Maintenance', href: '/maintenance' },
    { name: 'Services', href: '/services' },
    { name: 'Alertes', href: '/alerts' },
    { name: 'Paramètres', href: '/settings' },
  ]

  const isActive = (href) => {
    if (href === '/') return location.pathname === '/'
    return location.pathname.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} min-h-screen bg-night-blue text-white transition-all duration-300 fixed left-0 top-0 z-50`}>
          <div className="p-4 border-b border-dark-blue">
            <div className="flex items-center justify-between">
              {sidebarOpen && (
                <h1 className="text-xl font-bold text-electric-blue-light">
                  IT Asset Manager
                </h1>
              )}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-dark-blue transition-colors"
              >
                {sidebarOpen ? '✕' : '☰'}
              </button>
            </div>
          </div>
          
          <nav className="p-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive(item.href)
                    ? 'bg-electric-blue text-white'
                    : 'text-gray-300 hover:bg-dark-blue hover:text-white'
                }`}
              >
                {sidebarOpen && <span>{item.name}</span>}
              </Link>
            ))}
          </nav>
        </aside>

        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
          <div className="p-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/equipments" element={<Equipments />} />
              <Route path="/maintenance" element={<Maintenance />} />
              <Route path="/services" element={<Services />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  )
}

export default AppLayout
