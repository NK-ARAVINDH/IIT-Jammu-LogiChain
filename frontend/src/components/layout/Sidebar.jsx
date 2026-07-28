import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Ship, AlertTriangle, Bot, FileText,
  Settings, Zap, ChevronLeft, ChevronRight, Globe, Cpu
} from 'lucide-react';
import { useState } from 'react';

const iconMap = {
  LayoutDashboard, Ship, AlertTriangle, Bot, FileText, Settings, Globe, Cpu
};

const navItems = [
  { path: '/', label: 'Dashboard', icon: 'LayoutDashboard' },
  { path: '/shipments', label: 'Shipments', icon: 'Ship' },
  { path: '/world-map', label: 'World Risk Map', icon: 'Globe' },
  { path: '/ai-reasoning', label: 'AI Reasoning', icon: 'Cpu' },
  { path: '/incidents', label: 'Incidents', icon: 'AlertTriangle' },
  { path: '/agents', label: 'AI Agents', icon: 'Bot' },
  { path: '/reports', label: 'Reports', icon: 'FileText' },
  { path: '/settings', label: 'Settings', icon: 'Settings' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={`fixed left-0 top-0 h-screen z-40 flex flex-col
        bg-surface-950/90 backdrop-blur-xl border-r border-surface-800/60
        transition-all duration-300 ${collapsed ? 'w-[68px]' : 'w-[240px]'}`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-surface-800/60">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-accent-cyan flex items-center justify-center flex-shrink-0">
          <Zap className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col"
          >
            <span className="text-sm font-bold text-white tracking-tight">LogiChain</span>
            <span className="text-[10px] font-medium text-brand-400 uppercase tracking-widest">AI Platform</span>
          </motion.div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = iconMap[item.icon];
          const isActive = location.pathname === item.path;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                transition-all duration-200 group relative
                ${isActive
                  ? 'bg-brand-500/10 text-brand-400'
                  : 'text-surface-400 hover:bg-surface-800/60 hover:text-surface-200'
                }`}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-indicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full bg-brand-500"
                />
              )}
              <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-brand-400' : ''}`} />
              {!collapsed && (
                <span className="whitespace-nowrap">{item.label}</span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Collapse Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center py-3 border-t border-surface-800/60
          text-surface-500 hover:text-surface-300 transition-colors"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </motion.aside>
  );
}
