export const RISK_COLORS = {
  Low: '#22c55e',
  Medium: '#f59e0b',
  High: '#f97316',
  Critical: '#ef4444',
};

export const RISK_BG = {
  Low: 'badge-low',
  Medium: 'badge-medium',
  High: 'badge-high',
  Critical: 'badge-critical',
};

export const INCIDENT_ICONS = {
  'Port Strike': '✊',
  'Cyclone': '🌀',
  'Customs Delay': '🛃',
  'Port Congestion': '⚓',
  'Heavy Rain': '🌧️',
  'Political Conflict': '⚠️',
  'Fuel Price Spike': '⛽',
  'Flood': '🌊',
  'Equipment Failure': '🔧',
  'Dock Congestion': '📦',
  'Typhoon Warning': '🌪️',
  'Labor Shortage': '👷',
  'Sanctions Alert': '🚫',
  'Cyber Attack': '💻',
};

export const PORTS = [
  'Singapore', 'Shanghai', 'Rotterdam', 'Los Angeles', 'Mumbai', 'Dubai',
];

export const WHAT_IF_SCENARIOS = [
  { id: 'port_closure', label: 'Port Closure', description: 'Complete port shutdown' },
  { id: 'severe_weather', label: 'Severe Weather', description: 'Cyclone/typhoon/storm' },
  { id: 'labor_strike', label: 'Labor Strike', description: 'Worker strike/slowdown' },
  { id: 'customs_crackdown', label: 'Customs Crackdown', description: 'Enhanced inspections' },
  { id: 'political_crisis', label: 'Political Crisis', description: 'Geopolitical tensions' },
  { id: 'cyber_attack', label: 'Cyber Attack', description: 'IT infrastructure compromise' },
];

export const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: 'LayoutDashboard' },
  { path: '/shipments', label: 'Shipments', icon: 'Ship' },
  { path: '/incidents', label: 'Incidents', icon: 'AlertTriangle' },
  { path: '/agents', label: 'AI Agents', icon: 'Bot' },
  { path: '/reports', label: 'Reports', icon: 'FileText' },
  { path: '/settings', label: 'Settings', icon: 'Settings' },
];
