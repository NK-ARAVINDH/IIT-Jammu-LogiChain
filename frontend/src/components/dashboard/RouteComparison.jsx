import React from 'react';
import { ArrowRight, Compass, ShieldAlert, DollarSign, Trees, Zap } from 'lucide-react';

export default function RouteComparison({ recommendation }) {
  if (!recommendation) return null;

  const {
    alternative_port = '',
    alternative_route = '',
    estimated_cost_impact = 'N/A',
    estimated_savings = 'N/A',
    estimated_recovery_time = 'N/A',
    co2_estimate = 'N/A',
    action = '',
    confidence = 0.85
  } = recommendation;

  return (
    <div className="glass p-6 space-y-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-accent-cyan/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center gap-2.5 border-b border-surface-800/60 pb-4">
        <Compass className="w-5 h-5 text-accent-cyan" />
        <div>
          <h3 className="text-sm font-semibold text-white tracking-wide uppercase">Route Optimization Comparison</h3>
          <p className="text-[11px] text-surface-450 mt-0.5">AI Engine alternative lane analysis</p>
        </div>
      </div>

      {/* Rerouting Recommendation Text */}
      <div className="bg-accent-cyan/5 border border-accent-cyan/20 rounded-xl p-4 flex gap-3">
        <div className="w-8 h-8 rounded-lg bg-accent-cyan/15 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Zap className="w-4.5 h-4.5 text-accent-cyan" />
        </div>
        <div className="space-y-1">
          <p className="text-xs font-semibold text-white leading-normal">Operational Recommendation</p>
          <p className="text-xs text-surface-350 leading-relaxed">{action}</p>
        </div>
      </div>

      {/* Route Columns Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
        {/* Divider line for desktop */}
        <div className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1px] bg-surface-800/60" />

        {/* Current Lane */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-surface-400 uppercase tracking-wider">Primary Lane</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-risk-critical/10 text-risk-critical border border-risk-critical/20 uppercase font-semibold">Active Alert</span>
          </div>

          <div className="bg-surface-950/40 border border-surface-850/60 rounded-xl p-4 space-y-3.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-surface-450">Routing Status</span>
              <span className="font-semibold text-white">Disrupted (Incidents Present)</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-surface-450">Delay Vulnerability</span>
              <span className="font-semibold text-risk-high flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" /> High Risk
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-surface-450">CO₂ Emission Index</span>
              <span className="font-semibold text-white">Standard baseline</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-surface-450">Incremental Cost</span>
              <span className="font-semibold text-white">$0.00</span>
            </div>
          </div>
        </div>

        {/* Optimized Lane */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-surface-400 uppercase tracking-wider">Simulated Alternative Lane</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-risk-low/10 text-risk-low border border-risk-low/20 uppercase font-semibold">AI Recommended</span>
          </div>

          <div className="bg-surface-950/40 border border-surface-850/60 rounded-xl p-4 space-y-3.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-surface-450">Alternative Port Hub</span>
              <span className="font-semibold text-accent-cyan flex items-center gap-1">
                {alternative_port || 'Port Klang'}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-surface-450">Delay Resolution</span>
              <span className="font-semibold text-white flex items-center gap-1">
                Recovery in {estimated_recovery_time || '1 Day'}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-surface-450">CO₂ Estimate</span>
              <span className="font-semibold text-green-400 flex items-center gap-1">
                <Trees className="w-3.5 h-3.5" /> {co2_estimate || '8 Tons'}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-surface-450">Operational Cost Delta</span>
              <span className="font-semibold text-amber-400 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5" /> {estimated_cost_impact || '+ $5K'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary savings footer */}
      {estimated_savings !== 'N/A' && (
        <div className="border-t border-surface-800/60 pt-4 flex items-center justify-between text-xs">
          <span className="text-surface-450">Estimated Financial Protection:</span>
          <span className="font-bold text-green-400">{estimated_savings}</span>
        </div>
      )}
    </div>
  );
}
