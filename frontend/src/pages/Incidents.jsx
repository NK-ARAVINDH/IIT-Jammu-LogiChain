import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, MapPin, Clock, Shield } from 'lucide-react';
import { fetchIncidents } from '../api/client';
import { INCIDENT_ICONS } from '../utils/constants';
import { timeAgo } from '../utils/formatters';

export default function Incidents() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('All');

  useEffect(() => {
    fetchIncidents()
      .then(setIncidents)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const types = ['All', ...new Set(incidents.map(i => i.type))];
  const filtered = filterType === 'All' ? incidents : incidents.filter(i => i.type === filterType);

  const getSeverityGradient = (severity) => {
    if (severity >= 8) return 'from-risk-critical/20 to-risk-critical/5 border-risk-critical/30';
    if (severity >= 6) return 'from-risk-high/20 to-risk-high/5 border-risk-high/30';
    if (severity >= 4) return 'from-risk-medium/20 to-risk-medium/5 border-risk-medium/30';
    return 'from-risk-low/20 to-risk-low/5 border-risk-low/30';
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold text-white">Global Incidents</h1>
        <p className="text-sm text-surface-400 mt-1">Active risk events affecting supply chain operations</p>
      </motion.div>

      {/* Port Summary */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        {['Singapore', 'Shanghai', 'Rotterdam', 'Los Angeles', 'Mumbai', 'Dubai'].map((port, i) => {
          const portIncidents = incidents.filter(inc => inc.affected_port === port);
          const maxSeverity = portIncidents.length > 0
            ? Math.max(...portIncidents.map(i => i.severity))
            : 0;

          return (
            <motion.div
              key={port}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08 }}
              className="glass p-3 text-center"
            >
              <MapPin className={`w-4 h-4 mx-auto mb-1 ${
                maxSeverity >= 8 ? 'text-risk-critical' :
                maxSeverity >= 5 ? 'text-risk-medium' :
                'text-risk-low'
              }`} />
              <p className="text-xs font-medium text-surface-200">{port}</p>
              <p className="text-[10px] text-surface-500 mt-0.5">{portIncidents.length} incident{portIncidents.length !== 1 ? 's' : ''}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Type Filter */}
      <div className="flex flex-wrap gap-2">
        {types.map(t => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              filterType === t
                ? 'bg-brand-500/20 text-brand-400 border border-brand-500/30'
                : 'text-surface-400 hover:text-surface-200 bg-surface-800/40 border border-transparent'
            }`}
          >
            {t !== 'All' && <span className="mr-1">{INCIDENT_ICONS[t] || '⚠️'}</span>}
            {t}
          </button>
        ))}
      </div>

      {/* Incident Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton h-32 rounded-xl" />
          ))
        ) : (
          filtered.map((inc, i) => (
            <motion.div
              key={inc.incident_id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`rounded-xl border bg-gradient-to-br p-5 ${getSeverityGradient(inc.severity)}`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{INCIDENT_ICONS[inc.type] || '⚠️'}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-white">{inc.type}</h3>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-900/60 text-surface-400">
                      {inc.incident_id}
                    </span>
                  </div>
                  <p className="text-xs text-surface-300 leading-relaxed mb-3">{inc.description}</p>

                  <div className="flex items-center gap-4 text-[11px] text-surface-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {inc.affected_port}
                    </span>
                    <span className="flex items-center gap-1">
                      <Shield className="w-3 h-3" /> Severity: {inc.severity}/10
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> +{inc.expected_delay_days}d delay
                    </span>
                  </div>

                  {/* Confidence bar */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-[10px] text-surface-500 mb-1">
                      <span>Confidence</span>
                      <span>{Math.round(inc.confidence * 100)}%</span>
                    </div>
                    <div className="w-full h-1 bg-surface-900/60 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${inc.confidence * 100}%` }}
                        transition={{ delay: 0.5 + i * 0.05, duration: 0.8 }}
                        className="h-full bg-brand-400 rounded-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
