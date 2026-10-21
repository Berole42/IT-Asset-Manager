import { saveToStorage, STORAGE_KEYS } from './storage'

const demoEquipments = [
  {
    id: 'EQ-001',
    name: 'PC-DIRECTION-01',
    category: 'ordinateur',
    brand: 'Dell',
    model: 'OptiPlex 7090',
    serialNumber: 'DEL123456789',
    ipAddress: '192.168.1.10',
    operatingSystem: 'Windows 11 Pro',
    service: 'Direction',
    responsible: 'Jean Dupont',
    acquisitionDate: '2023-01-15',
    status: 'en_service',
    description: 'Ordinateur de bureau pour le directeur'
  },
  {
    id: 'EQ-002',
    name: 'PC-COMPTA-01',
    category: 'ordinateur',
    brand: 'HP',
    model: 'EliteDesk 800',
    serialNumber: 'HP987654321',
    ipAddress: '192.168.1.11',
    operatingSystem: 'Windows 10 Pro',
    service: 'Comptabilité',
    responsible: 'Marie Martin',
    acquisitionDate: '2023-02-20',
    status: 'en_service',
    description: 'Ordinateur de bureau pour le service comptabilité'
  },
  {
    id: 'EQ-003',
    name: 'SRV-PRINCIPAL-01',
    category: 'serveur',
    brand: 'Dell',
    model: 'PowerEdge R740',
    serialNumber: 'SRV456789123',
    ipAddress: '192.168.1.100',
    operatingSystem: 'Ubuntu Server 22.04',
    service: 'Informatique',
    responsible: 'Pierre Durand',
    acquisitionDate: '2022-11-01',
    status: 'en_service',
    description: 'Serveur principal hébergeant les applications métier'
  },
  {
    id: 'EQ-004',
    name: 'IMP-RECEPTION-01',
    category: 'imprimante',
    brand: 'Canon',
    model: 'imageRUNNER 2545',
    serialNumber: 'CAN789123456',
    ipAddress: '192.168.1.50',
    operatingSystem: '',
    service: 'Direction',
    responsible: 'Sophie Bernard',
    acquisitionDate: '2023-03-10',
    status: 'en_maintenance',
    description: 'Imprimante multifonction pour la réception'
  },
  {
    id: 'EQ-005',
    name: 'RTR-CORE-01',
    category: 'routeur',
    brand: 'Cisco',
    model: 'Catalyst 2960',
    serialNumber: 'CIS321654987',
    ipAddress: '192.168.1.1',
    operatingSystem: 'IOS 15.2',
    service: 'Informatique',
    responsible: 'Pierre Durand',
    acquisitionDate: '2022-08-15',
    status: 'en_service',
    description: 'Routeur principal du réseau'
  },
  {
    id: 'EQ-006',
    name: 'SWI-FLOOR2-01',
    category: 'switch',
    brand: 'Cisco',
    model: 'Catalyst 2960-X',
    serialNumber: 'CIS654987321',
    ipAddress: '192.168.1.2',
    operatingSystem: 'IOS 15.2',
    service: 'Informatique',
    responsible: 'Pierre Durand',
    acquisitionDate: '2022-09-01',
    status: 'en_service',
    description: 'Switch pour le 2ème étage'
  }
]

const demoMaintenance = [
  {
    id: 'MAINT-001',
    equipmentId: 'EQ-004',
    equipmentName: 'IMP-RECEPTION-01',
    problem: 'Bourrage papier fréquent et qualité d\'impression dégradée',
    declarationDate: '2024-01-15',
    technician: 'Pierre Durand',
    priority: 'moyenne',
    status: 'en_cours',
    comments: 'En attente de pièces de rechange'
  },
  {
    id: 'MAINT-002',
    equipmentId: 'EQ-001',
    equipmentName: 'PC-DIRECTION-01',
    problem: 'Lenteur excessive au démarrage',
    declarationDate: '2024-01-10',
    technician: 'Pierre Durand',
    priority: 'basse',
    status: 'terminee',
    comments: 'Nettoyage du disque et optimisation effectués'
  }
]

const demoServices = [
  { id: 'SRV-001', name: 'Informatique', description: 'Service informatique' },
  { id: 'SRV-002', name: 'Comptabilité', description: 'Service comptabilité' },
  { id: 'SRV-003', name: 'Ressources humaines', description: 'Service RH' },
  { id: 'SRV-004', name: 'Direction', description: 'Direction générale' },
  { id: 'SRV-005', name: 'Marketing', description: 'Service marketing' },
  { id: 'SRV-006', name: 'Ventes', description: 'Service ventes' }
]

export const loadDemoData = () => {
  saveToStorage(STORAGE_KEYS.EQUIPMENTS, demoEquipments)
  saveToStorage(STORAGE_KEYS.MAINTENANCE, demoMaintenance)
  saveToStorage(STORAGE_KEYS.SERVICES, demoServices)
  saveToStorage(STORAGE_KEYS.DEMO_DATA_LOADED, true)
}

export const isDemoDataLoaded = () => {
  return localStorage.getItem(STORAGE_KEYS.DEMO_DATA_LOADED) === 'true'
}
