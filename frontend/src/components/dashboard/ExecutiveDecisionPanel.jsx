import React from 'react';
import { Bot, Shield, Calendar, AlertOctagon, HelpCircle, FileCheck, Landmark, DollarSign, Compass, RefreshCw, Zap } from 'lucide-react';
import ExplainableRiskCard from './ExplainableRiskCard';
import RouteComparison from './RouteComparison';

export default function ExecutiveDecisionPanel({ shipment, onMitigate }) {
  if (!shipment) {
    return (
      <div className="glass p-8 flex flex-col items-center justify-center text-center h-full min-h-[300px] border-dashed border-2 border-surface-800">
        <Bot className="w-12 h-12 text-surface-600 mb-3 animate-pulse" />
        <h3 className="text-sm font-semibold text-surface-300">Executive Decision Deck</h3>
        <p className="text-xs text-surface-550 mt-1 max-w-[280px]">
          Select a shipment from the table above to invoke the Copilot Decision Support panel.
        </p>
      </div>
    );
  }

  // Find routing recommendations
  const rerouteRec = shipment.recommendations?.find(r => r.action_type === 'reroute');
  const supplierRec = shipment.recommendations?.find(r => r.action_type === 'supplier_change');

  return (
    <div className="glass overflow-hidden border border-brand-500/20 relative">
      {/* Copilot Header */}
      <div className="bg-gradient-to-r from-brand-650/40 via-surface-900 to-surface-900 px-6 py-4 border-b border-surface-800/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-450 to-accent-cyan flex items-center justify-center">
            <Bot className="w-4.5 h-4.5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              LogiChain Copilot <span className="text-[10px] bg-brand-500/20 text-brand-400 border border-brand-500/30 px-1.5 py-0.2 rounded uppercase font-semibold">Pro v1.2</span>
            </h3>
            <p className="text-[10px] text-surface-450 mt-0.5">Decision Intelligence & Action Hub</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-green-400 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-ping" /> Real-time Sync
          </span>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Shipment Overview Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-950/40 border border-surface-850/60 rounded-xl p-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-white tracking-wide">{shipment.shipment_id}</span>
              <span className="text-[10px] text-surface-400 font-medium px-2 py-0.5 bg-surface-800 rounded">
                {shipment.container_id}
              </span>
            </div>
            <p className="text-xs text-surface-350">{shipment.items} (Qty: {shipment.quantity} / Wt: {shipment.weight} kg)</p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-surface-450 block text-[10px] uppercase font-bold tracking-wider">Affected Port</span>
              <span className="font-semibold text-white mt-0.5 block">{shipment.port}</span>
            </div>
            <div>
              <span className="text-surface-450 block text-[10px] uppercase font-bold tracking-wider">Origin Vendor</span>
              <span className="font-semibold text-white mt-0.5 block">{shipment.supplier}</span>
            </div>
          </div>
        </div>

        {/* Explainable Risk score card */}
        <ExplainableRiskCard riskData={shipment} />

        {/* Route Comparison panel */}
        {rerouteRec && <RouteComparison recommendation={rerouteRec} />}

        {/* Copilot Suggested Actions & Savings Deck */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Estimated Financial Protection */}
          <div className="bg-surface-900/30 border border-surface-800/60 rounded-xl p-5 space-y-3">
            <h4 className="text-xs font-bold text-surface-300 uppercase tracking-widest flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-green-400" /> Economic Protection
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] text-surface-450 uppercase font-semibold">Protected Capital</span>
                <span className="text-lg font-bold text-green-400 block mt-0.5">
                  {rerouteRec?.estimated_savings || '$45K est'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-surface-450 uppercase font-semibold">Mitigation Cost</span>
                <span className="text-lg font-bold text-amber-400 block mt-0.5">
                  {rerouteRec?.estimated_cost_impact || '+$12K'}
                </span>
              </div>
            </div>
          </div>

          {/* Supplier Reliability Details */}
          <div className="bg-surface-900/30 border border-surface-800/60 rounded-xl p-5 space-y-3">
            <h4 className="text-xs font-bold text-surface-300 uppercase tracking-widest flex items-center gap-1.5">
              <Landmark className="w-4 h-4 text-accent-violet" /> Supplier Reliability Lens
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] text-surface-450 uppercase font-semibold">Reliability Index</span>
                <span className="text-lg font-bold text-white block mt-0.5">
                  {shipment.supplier_reliability}%
                </span>
              </div>
              <div>
                <span className="text-[10px] text-surface-450 uppercase font-semibold">Backup Supplier</span>
                <span className="text-xs font-bold text-accent-violet block mt-1.5 truncate">
                  {supplierRec?.alternative_supplier || 'Pegatron Corp'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button Deck */}
        <div className="border-t border-surface-800/60 pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-brand-400" />
            <span className="text-xs text-surface-400">Mitigation status: <span className="font-semibold text-white">Pending Approval</span></span>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => onMitigate && onMitigate(shipment.shipment_id)}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold
                text-white bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700
                rounded-xl transition-all shadow-lg shadow-brand-500/20 active:scale-95"
            >
              <Zap className="w-4 h-4 text-amber-300" /> Authorize Reroute Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
