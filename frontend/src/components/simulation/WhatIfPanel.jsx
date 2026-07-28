import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, ChevronDown, ArrowRight, AlertTriangle, Loader2 } from 'lucide-react';
import { runWhatIf } from '../../api/client';
import { PORTS, WHAT_IF_SCENARIOS } from '../../utils/constants';
import { getRiskBadgeClass } from '../../utils/formatters';

export default function WhatIfPanel() {
  const [scenario, setScenario] = useState(WHAT_IF_SCENARIOS[0].id);
  const [port, setPort] = useState(PORTS[0]);
  const [severity, setSeverity] = useState(8);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSimulate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await runWhatIf(scenario, port, severity);
      setResult(res);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="glass overflow-hidden"
    >
      <div className="flex items-center gap-2 px-5 py-4 border-b border-surface-800/60
        bg-gradient-to-r from-accent-violet/5 to-brand-500/5">
        <Zap className="w-4 h-4 text-accent-violet" />
        <h3 className="text-sm font-semibold text-white">What-If Simulation</h3>
      </div>

      <div className="p-5">
        {/* Controls */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div>
            <label className="text-[10px] text-surface-500 uppercase tracking-wider mb-1.5 block">Scenario</label>
            <select
              value={scenario}
              onChange={(e) => setScenario(e.target.value)}
              className="w-full px-3 py-2 bg-surface-900/80 border border-surface-700/50 rounded-lg
                text-sm text-surface-200 focus:outline-none focus:border-brand-500/50 appearance-none cursor-pointer"
            >
              {WHAT_IF_SCENARIOS.map(s => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[10px] text-surface-500 uppercase tracking-wider mb-1.5 block">Target Port</label>
            <select
              value={port}
              onChange={(e) => setPort(e.target.value)}
              className="w-full px-3 py-2 bg-surface-900/80 border border-surface-700/50 rounded-lg
                text-sm text-surface-200 focus:outline-none focus:border-brand-500/50 appearance-none cursor-pointer"
            >
              {PORTS.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[10px] text-surface-500 uppercase tracking-wider mb-1.5 block">Severity ({severity})</label>
            <input
              type="range"
              min="1"
              max="10"
              value={severity}
              onChange={(e) => setSeverity(Number(e.target.value))}
              className="w-full mt-2 accent-accent-violet"
            />
          </div>
        </div>

        <button
          onClick={handleSimulate}
          disabled={loading}
          className="w-full py-2.5 text-sm font-medium text-white rounded-lg
            bg-gradient-to-r from-accent-violet to-brand-500
            hover:from-accent-violet/90 hover:to-brand-500/90
            disabled:opacity-50 transition-all shadow-lg shadow-accent-violet/20"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Simulating...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Zap className="w-4 h-4" /> Run Simulation
            </span>
          )}
        </button>

        {/* Error */}
        {error && (
          <div className="mt-3 p-3 bg-risk-critical/10 border border-risk-critical/20 rounded-lg text-xs text-risk-critical">
            {error}
          </div>
        )}

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4"
            >
              <div className="p-3 bg-surface-900/60 rounded-lg border border-surface-800/40 mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-risk-medium" />
                  <span className="text-sm font-medium text-white">
                    {result.total_affected} Shipment{result.total_affected !== 1 ? 's' : ''} Affected
                  </span>
                </div>
                <p className="text-xs text-surface-400 leading-relaxed">{result.summary}</p>
              </div>

              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {result.affected_shipments?.map((ship, i) => (
                  <motion.div
                    key={ship.shipment_id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3 p-2.5 bg-surface-900/40 rounded-lg"
                  >
                    <span className="text-xs font-mono text-brand-400">{ship.shipment_id}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${getRiskBadgeClass(ship.original_risk)}`}>
                      {ship.original_risk}
                    </span>
                    <ArrowRight className="w-3 h-3 text-surface-500" />
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${getRiskBadgeClass(ship.new_risk)}`}>
                      {ship.new_risk}
                    </span>
                    <span className="text-[10px] text-surface-500 ml-auto">
                      +{ship.delay_days}d delay
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
