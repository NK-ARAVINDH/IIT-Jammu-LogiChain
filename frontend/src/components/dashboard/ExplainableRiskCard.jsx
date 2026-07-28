import React from 'react';
import { Shield, CheckCircle, AlertTriangle, Clock, TrendingUp, Info } from 'lucide-react';

export default function ExplainableRiskCard({ riskData }) {
  if (!riskData) return null;

  const {
    risk_score = 0,
    confidence = 85,
    severity = 'Low',
    business_impact = 'Low',
    expected_delay = 0,
    explanation = '',
    reasons = []
  } = riskData;

  // Determine colors based on risk severity
  const getSeverityStyle = (sev) => {
    switch (sev?.toLowerCase()) {
      case 'critical':
        return {
          text: 'text-risk-critical',
          bg: 'bg-risk-critical/10 border-risk-critical/30',
          badge: 'badge-critical',
          glow: 'shadow-risk-critical/20'
        };
      case 'high':
        return {
          text: 'text-risk-high',
          bg: 'bg-risk-high/10 border-risk-high/30',
          badge: 'badge-high',
          glow: 'shadow-risk-high/20'
        };
      case 'medium':
        return {
          text: 'text-risk-medium',
          bg: 'bg-risk-medium/10 border-risk-medium/30',
          badge: 'badge-medium',
          glow: 'shadow-risk-medium/20'
        };
      default:
        return {
          text: 'text-risk-low',
          bg: 'bg-risk-low/10 border-risk-low/30',
          badge: 'badge-low',
          glow: 'shadow-risk-low/20'
        };
    }
  };

  const styles = getSeverityStyle(severity);

  // Parse explanation if it's a string with newlines
  const reasonList = reasons.length > 0 
    ? reasons 
    : explanation.split('\n').filter(r => r.trim());

  return (
    <div className="glass p-6 space-y-6 relative overflow-hidden transition-all duration-300 hover:border-surface-600/50">
      {/* Decorative gradient blur in background */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-surface-800/60 pb-4">
        <div className="flex items-center gap-2.5">
          <Shield className={`w-5 h-5 ${styles.text}`} />
          <h3 className="text-sm font-semibold text-white tracking-wide uppercase">AI Explainable Risk Model</h3>
        </div>
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${styles.badge}`}>
          {severity} Severity
        </span>
      </div>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Risk Score Circular Progress / Value */}
        <div className="bg-surface-900/40 border border-surface-800/40 rounded-xl p-3.5 flex flex-col items-center justify-center text-center">
          <div className="relative flex items-center justify-center w-14 h-14 rounded-full border-2 border-surface-800">
            {/* Simple SVG Circle representing score */}
            <svg className="absolute w-full h-full transform -rotate-90">
              <circle
                cx="28"
                cy="28"
                r="24"
                stroke="currentColor"
                strokeWidth="3.5"
                fill="transparent"
                className="text-surface-800"
              />
              <circle
                cx="28"
                cy="28"
                r="24"
                stroke="currentColor"
                strokeWidth="3.5"
                fill="transparent"
                strokeDasharray={`${2 * Math.PI * 24}`}
                strokeDashoffset={`${2 * Math.PI * 24 * (1 - risk_score / 100)}`}
                className={`${styles.text} transition-all duration-1000`}
              />
            </svg>
            <span className="text-base font-bold text-white leading-none">{Math.round(risk_score)}</span>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-surface-450 mt-2">Risk Score</span>
        </div>

        {/* Confidence Engine */}
        <div className="bg-surface-900/40 border border-surface-800/40 rounded-xl p-3.5 flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 rounded-lg bg-brand-500/10 flex items-center justify-center mb-1.5">
            <CheckCircle className="w-5 h-5 text-brand-400" />
          </div>
          <span className="text-base font-bold text-white">{confidence}%</span>
          <span className="text-[10px] uppercase font-bold tracking-wider text-surface-450 mt-1">AI Confidence</span>
        </div>

        {/* Expected Delay */}
        <div className="bg-surface-900/40 border border-surface-800/40 rounded-xl p-3.5 flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 rounded-lg bg-accent-violet/10 flex items-center justify-center mb-1.5">
            <Clock className="w-5 h-5 text-accent-violet" />
          </div>
          <span className="text-base font-bold text-white">{expected_delay} Days</span>
          <span className="text-[10px] uppercase font-bold tracking-wider text-surface-450 mt-1">Expected Delay</span>
        </div>

        {/* Business Impact */}
        <div className="bg-surface-900/40 border border-surface-800/40 rounded-xl p-3.5 flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 rounded-lg bg-accent-cyan/10 flex items-center justify-center mb-1.5">
            <TrendingUp className="w-5 h-5 text-accent-cyan" />
          </div>
          <span className="text-base font-bold text-white">{business_impact}</span>
          <span className="text-[10px] uppercase font-bold tracking-wider text-surface-450 mt-1">Business Impact</span>
        </div>
      </div>

      {/* Explanations List */}
      <div className="bg-surface-950/40 rounded-xl border border-surface-800/60 p-4 space-y-3">
        <h4 className="text-xs font-bold text-surface-300 uppercase tracking-widest flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-brand-400" /> Explanatory Analysis
        </h4>
        <div className="space-y-2">
          {reasonList.map((reason, idx) => (
            <div key={idx} className="flex gap-2.5 text-xs leading-relaxed text-surface-350">
              <span className="text-brand-400 font-semibold">•</span>
              <p>{reason}</p>
            </div>
          ))}
          {reasonList.length === 0 && (
            <p className="text-xs text-surface-550 italic">No threats or disruptions flagged for this shipment.</p>
          )}
        </div>
      </div>
    </div>
  );
}
