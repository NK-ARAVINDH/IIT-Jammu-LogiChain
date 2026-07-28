import { motion } from 'framer-motion';
import { Ship, ShieldAlert, AlertTriangle, Lightbulb, TrendingUp, DollarSign, Clock, CheckCircle2, Award, Zap } from 'lucide-react';

const formatCurrency = (val) => {
  if (typeof val !== 'number') return '—';
  if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
  return `$${(val / 1000).toFixed(0)}K`;
};

export default function KPICards({ stats }) {
  const cards = [
    {
      label: 'Revenue At Risk',
      value: stats ? formatCurrency(stats.revenue_at_risk) : '—',
      icon: DollarSign,
      gradient: 'kpi-red',
      iconColor: 'text-risk-critical',
      description: 'Capital in disrupted lanes'
    },
    {
      label: 'Critical Shipments',
      value: stats?.critical_shipments ?? '—',
      icon: ShieldAlert,
      gradient: 'kpi-amber',
      iconColor: 'text-risk-high',
      description: 'High urgency actions required'
    },
    {
      label: 'Average Transit Delay',
      value: stats ? `${stats.avg_delay} Days` : '—',
      icon: Clock,
      gradient: 'kpi-blue',
      iconColor: 'text-brand-400',
      description: 'System-wide delay projection'
    },
    {
      label: 'AI Confidence Index',
      value: stats ? `${stats.avg_confidence}%` : '—',
      icon: CheckCircle2,
      gradient: 'kpi-green',
      iconColor: 'text-risk-low',
      description: 'Telemetry matching accuracy'
    },
    {
      label: 'Supplier Reliability',
      value: stats ? `${stats.supplier_reliability}%` : '—',
      icon: Award,
      gradient: 'kpi-violet',
      iconColor: 'text-accent-violet',
      description: 'Historical supply compliance'
    },
    {
      label: 'Mitigated Shipments',
      value: stats?.mitigated_shipments ?? '—',
      icon: Lightbulb,
      gradient: 'kpi-blue',
      iconColor: 'text-accent-cyan',
      description: 'Alternate routes approved'
    },
    {
      label: 'AI Decisions Today',
      value: stats?.ai_decisions_today ?? '—',
      icon: Zap,
      gradient: 'kpi-amber',
      iconColor: 'text-amber-400',
      description: 'Autonomous copilot runs'
    },
    {
      label: 'Active Shipments',
      value: stats?.active_shipments ?? '—',
      icon: Ship,
      gradient: 'kpi-violet',
      iconColor: 'text-white',
      description: 'Total monitored cargos'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => {
        const Icon = card.icon;

        return (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.4 }}
            className={`glass-hover p-5 ${card.gradient}`}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-surface-450 uppercase tracking-widest">
                  {card.label}
                </p>
                <motion.p
                  key={card.value}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-2xl font-bold text-white tracking-tight"
                >
                  {card.value}
                </motion.p>
                <p className="text-[9px] text-surface-400 leading-none mt-1.5 block">
                  {card.description}
                </p>
              </div>
              <div className={`p-2 rounded-lg bg-surface-900/60 border border-surface-800/40 ${card.iconColor}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
