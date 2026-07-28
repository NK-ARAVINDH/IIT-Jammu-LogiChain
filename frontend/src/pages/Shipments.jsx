import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Ship, Search, Filter, ChevronDown, ChevronUp, MapPin, Package, Clock } from 'lucide-react';
import { fetchShipments } from '../api/client';
import { getRiskBadgeClass, formatDate, formatWeight } from '../utils/formatters';

export default function Shipments() {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterRisk, setFilterRisk] = useState('All');
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchShipments()
      .then(setShipments)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = shipments.filter(s => {
    const matchesSearch = !search ||
      s.shipment_id.toLowerCase().includes(search.toLowerCase()) ||
      s.supplier.toLowerCase().includes(search.toLowerCase()) ||
      s.destination.toLowerCase().includes(search.toLowerCase());
    const matchesRisk = filterRisk === 'All' || s.risk_level === filterRisk;
    return matchesSearch && matchesRisk;
  });

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold text-white">Shipments</h1>
        <p className="text-sm text-surface-400 mt-1">Track and manage all active shipments</p>
      </motion.div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
          <input
            type="text"
            placeholder="Search shipments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-surface-900/60 border border-surface-700/50
              rounded-lg text-sm text-surface-200 placeholder-surface-500
              focus:outline-none focus:border-brand-500/50 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          {['All', 'Critical', 'High', 'Medium', 'Low'].map(level => (
            <button
              key={level}
              onClick={() => setFilterRisk(level)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                filterRisk === level
                  ? 'bg-brand-500/20 text-brand-400 border border-brand-500/30'
                  : 'text-surface-400 hover:text-surface-200 bg-surface-800/40 border border-transparent'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Shipment List */}
      <div className="space-y-2">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton h-16 rounded-xl" />
          ))
        ) : (
          filtered.map((ship, i) => (
            <motion.div
              key={ship.shipment_id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="glass-hover"
            >
              <div
                className="flex items-center gap-4 px-5 py-4 cursor-pointer"
                onClick={() => setExpandedId(expandedId === ship.shipment_id ? null : ship.shipment_id)}
              >
                <div className="w-10 h-10 rounded-lg bg-brand-500/10 flex items-center justify-center">
                  <Ship className="w-5 h-5 text-brand-400" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-mono font-semibold text-white">{ship.shipment_id}</span>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${getRiskBadgeClass(ship.risk_level)}`}>
                      {ship.risk_level} ({ship.risk_score})
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-surface-800/80 text-surface-400">
                      {ship.status}
                    </span>
                  </div>
                  <p className="text-xs text-surface-400 mt-1 truncate">
                    {ship.supplier} • {ship.origin} → {ship.destination}
                  </p>
                </div>

                <div className="hidden md:flex items-center gap-6 text-xs text-surface-400">
                  <div className="text-center">
                    <p className="text-surface-500">Port</p>
                    <p className="text-surface-200 font-medium">{ship.port}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-surface-500">ETA</p>
                    <p className="text-surface-200 font-medium">{formatDate(ship.eta)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-surface-500">Weight</p>
                    <p className="text-surface-200 font-medium">{formatWeight(ship.weight)}</p>
                  </div>
                </div>

                {expandedId === ship.shipment_id
                  ? <ChevronUp className="w-4 h-4 text-surface-500" />
                  : <ChevronDown className="w-4 h-4 text-surface-500" />
                }
              </div>

              {/* Expanded Details */}
              {expandedId === ship.shipment_id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="px-5 pb-4 border-t border-surface-800/30"
                >
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                    <div>
                      <p className="text-[10px] text-surface-500 uppercase tracking-wider mb-1">Container</p>
                      <p className="text-sm text-surface-200 font-mono">{ship.container_id}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-surface-500 uppercase tracking-wider mb-1">Items</p>
                      <p className="text-sm text-surface-200">{ship.items}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-surface-500 uppercase tracking-wider mb-1">Quantity</p>
                      <p className="text-sm text-surface-200">{ship.quantity?.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-surface-500 uppercase tracking-wider mb-1">Priority</p>
                      <p className="text-sm text-surface-200">{ship.priority}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))
        )}
      </div>

      {!loading && filtered.length === 0 && (
        <div className="text-center py-12 text-surface-500">
          <Ship className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No shipments found</p>
        </div>
      )}
    </div>
  );
}
