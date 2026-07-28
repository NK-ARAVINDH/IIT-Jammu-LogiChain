import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { INCIDENT_ICONS } from '../../utils/constants';
import { timeAgo } from '../../utils/formatters';

export default function IncidentFeed({ incidents = [] }) {
  const [visibleIncidents, setVisibleIncidents] = useState([]);

  useEffect(() => {
    // Stagger the incidents appearing one by one
    if (incidents.length > 0) {
      setVisibleIncidents([]);
      incidents.slice(0, 8).forEach((inc, i) => {
        setTimeout(() => {
          setVisibleIncidents(prev => [...prev, inc]);
        }, i * 200);
      });
    }
  }, [incidents]);

  const getSeverityColor = (severity) => {
    if (severity >= 8) return 'border-l-risk-critical';
    if (severity >= 6) return 'border-l-risk-high';
    if (severity >= 4) return 'border-l-risk-medium';
    return 'border-l-risk-low';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="glass overflow-hidden"
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-surface-800/60">
        <h3 className="text-sm font-semibold text-white">Live Incident Feed</h3>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 bg-risk-low rounded-full animate-pulse" />
          <span className="text-xs text-surface-400">Live</span>
        </div>
      </div>

      <div className="max-h-[380px] overflow-y-auto space-y-0">
        <AnimatePresence>
          {visibleIncidents.map((inc, i) => (
            <motion.div
              key={inc.incident_id || i}
              initial={{ opacity: 0, x: -20, height: 0 }}
              animate={{ opacity: 1, x: 0, height: 'auto' }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className={`flex items-start gap-3 px-5 py-3.5 border-l-[3px] ${getSeverityColor(inc.severity)}
                border-b border-surface-800/20 hover:bg-surface-800/20 transition-colors`}
            >
              <span className="text-lg flex-shrink-0 mt-0.5">
                {INCIDENT_ICONS[inc.type] || '⚠️'}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-medium text-surface-200">{inc.type}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-800/80 text-surface-400 font-mono">
                    {inc.severity}/10
                  </span>
                </div>
                <p className="text-xs text-surface-400 line-clamp-2">{inc.description}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[10px] text-surface-500">📍 {inc.affected_port}</span>
                  <span className="text-[10px] text-surface-600">•</span>
                  <span className="text-[10px] text-surface-500">{timeAgo(inc.timestamp)}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {incidents.length === 0 && (
          <div className="px-5 py-10 text-center text-surface-500 text-sm">
            No active incidents
          </div>
        )}
      </div>
    </motion.div>
  );
}
