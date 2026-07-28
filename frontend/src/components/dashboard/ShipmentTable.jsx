import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { getRiskBadgeClass, formatDate } from '../../utils/formatters';

export default function ShipmentTable({ shipments = [], onSelect, selectedId }) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass overflow-hidden"
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-surface-800/60">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-white">Active Shipments</h3>
          <span className="text-[10px] text-surface-450 bg-surface-900 border border-surface-800 px-1.5 py-0.2 rounded">
            Click row to brief Copilot
          </span>
        </div>
        <button
          onClick={() => navigate('/shipments')}
          className="flex items-center gap-1 text-xs text-brand-400 hover:text-brand-300 transition-colors"
        >
          View All <ExternalLink className="w-3 h-3" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-surface-800/40">
              <th className="text-left px-5 py-3 text-xs font-medium text-surface-400 uppercase tracking-wider">Shipment</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-surface-400 uppercase tracking-wider">Status</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-surface-400 uppercase tracking-wider">Supplier</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-surface-400 uppercase tracking-wider">Destination</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-surface-400 uppercase tracking-wider">ETA</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-surface-400 uppercase tracking-wider">Risk</th>
            </tr>
          </thead>
          <tbody>
            {shipments.slice(0, 8).map((ship, i) => {
              const isSelected = selectedId === ship.shipment_id;
              return (
                <motion.tr
                  key={ship.shipment_id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 + i * 0.05 }}
                  className={`border-b border-surface-800/20 hover:bg-surface-800/30 cursor-pointer transition-colors ${
                    isSelected ? 'bg-brand-500/10 border-brand-500/35 hover:bg-brand-500/15' : ''
                  }`}
                  onClick={() => onSelect ? onSelect(ship) : navigate(`/shipments/${ship.shipment_id}`)}
                >
                  <td className="px-5 py-3">
                    <span className="text-sm font-mono font-medium text-brand-400">{ship.shipment_id}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-xs px-2 py-1 rounded-md bg-surface-800/60 text-surface-300">
                      {ship.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm text-surface-300 max-w-[180px] truncate">{ship.supplier}</td>
                  <td className="px-5 py-3 text-sm text-surface-300">{ship.destination}</td>
                  <td className="px-5 py-3 text-sm text-surface-400">{formatDate(ship.eta)}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getRiskBadgeClass(ship.risk_level)}`}>
                      {ship.risk_level}
                    </span>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {shipments.length === 0 && (
        <div className="px-5 py-10 text-center text-surface-500 text-sm">
          No shipments yet. Upload a document or run analysis.
        </div>
      )}
    </motion.div>
  );
}
