import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Palette, Database, Bot, Bell, Globe, Moon, Sun } from 'lucide-react';
import { useState } from 'react';

export default function Settings() {
  const [darkMode, setDarkMode] = useState(true);

  const sections = [
    {
      title: 'Appearance',
      icon: Palette,
      settings: [
        {
          label: 'Dark Mode',
          description: 'Use dark theme for the dashboard',
          type: 'toggle',
          value: darkMode,
          onChange: () => setDarkMode(!darkMode),
        },
      ],
    },
    {
      title: 'AI Configuration',
      icon: Bot,
      settings: [
        {
          label: 'AI Provider',
          description: 'Currently using simulated AI reasoning (no API key required)',
          type: 'info',
          value: 'Simulated (Demo Mode)',
        },
        {
          label: 'Agent Execution Delay',
          description: 'Artificial delay between agent steps for visual demo effect',
          type: 'info',
          value: '500ms per step',
        },
      ],
    },
    {
      title: 'Data Source',
      icon: Database,
      settings: [
        {
          label: 'Database',
          description: 'SQLite for hackathon MVP — portable to PostgreSQL',
          type: 'info',
          value: 'SQLite (logichain.db)',
        },
        {
          label: 'Seed Data',
          description: '20 shipments, 10 suppliers, 6 ports, 15 incidents',
          type: 'info',
          value: 'Pre-loaded',
        },
      ],
    },
    {
      title: 'Notifications',
      icon: Bell,
      settings: [
        {
          label: 'WebSocket',
          description: 'Real-time updates via WebSocket connection',
          type: 'info',
          value: 'ws://localhost:8000/ws',
        },
      ],
    },
  ];

  return (
    <div className="space-y-6 max-w-3xl">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-sm text-surface-400 mt-1">Configure platform preferences</p>
      </motion.div>

      {sections.map((section, si) => {
        const Icon = section.icon;
        return (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: si * 0.1 }}
            className="glass p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <Icon className="w-4 h-4 text-brand-400" />
              <h2 className="text-sm font-semibold text-white">{section.title}</h2>
            </div>

            <div className="space-y-4">
              {section.settings.map((setting, i) => (
                <div key={i} className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm text-surface-200">{setting.label}</p>
                    <p className="text-xs text-surface-500 mt-0.5">{setting.description}</p>
                  </div>
                  {setting.type === 'toggle' ? (
                    <button
                      onClick={setting.onChange}
                      className={`relative w-11 h-6 rounded-full transition-colors ${
                        setting.value ? 'bg-brand-500' : 'bg-surface-700'
                      }`}
                    >
                      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow ${
                        setting.value ? 'translate-x-[22px]' : 'translate-x-0.5'
                      }`} />
                    </button>
                  ) : (
                    <span className="text-xs text-surface-400 font-mono bg-surface-900/60 px-2.5 py-1 rounded">
                      {setting.value}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        );
      })}

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass p-5"
      >
        <p className="text-xs text-surface-500 text-center">
          LogiChain AI v1.0.0 — Hackathon MVP<br />
          Built with FastAPI • React • TailwindCSS • Recharts • React Flow
        </p>
      </motion.div>
    </div>
  );
}
