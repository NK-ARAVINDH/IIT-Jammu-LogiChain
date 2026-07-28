import { motion } from 'framer-motion';
import { CheckCircle, Loader2, Bot, FileSearch, Globe, ShieldCheck, Lightbulb } from 'lucide-react';
import { useEffect, useState } from 'react';

const AGENT_DEFINITIONS = [
  {
    id: 'document_intake',
    name: 'Document Intake Agent',
    description: 'Parsing uploaded document',
    icon: FileSearch,
    color: 'text-brand-400',
    bgColor: 'bg-brand-500/10',
  },
  {
    id: 'watchtower',
    name: 'Global Watchtower Agent',
    description: 'Checking global risk events',
    icon: Globe,
    color: 'text-accent-cyan',
    bgColor: 'bg-accent-cyan/10',
  },
  {
    id: 'risk_prediction',
    name: 'Risk Prediction Agent',
    description: 'Calculating risk scores',
    icon: ShieldCheck,
    color: 'text-risk-medium',
    bgColor: 'bg-risk-medium/10',
  },
  {
    id: 'mitigation',
    name: 'Mitigation Agent',
    description: 'Generating recommendations',
    icon: Lightbulb,
    color: 'text-accent-violet',
    bgColor: 'bg-accent-violet/10',
  },
];

export default function AgentActivity({ updates = [], isRunning = false }) {
  const [demoSteps, setDemoSteps] = useState([]);

  // If no real updates, show demo animation on mount
  useEffect(() => {
    if (updates.length === 0 && !isRunning) {
      // Run a demo sequence
      const steps = AGENT_DEFINITIONS.map(a => ({ ...a, status: 'completed', duration_ms: Math.floor(Math.random() * 1000) + 200 }));
      setDemoSteps([]);
      steps.forEach((step, i) => {
        setTimeout(() => {
          setDemoSteps(prev => [...prev, step]);
        }, i * 600);
      });
    }
  }, []);

  const activeSteps = updates.length > 0
    ? AGENT_DEFINITIONS.map(def => {
        const update = updates.find(u => u.agent === def.id);
        return {
          ...def,
          status: update?.status || 'pending',
          duration_ms: update?.duration_ms || 0,
        };
      })
    : demoSteps.length > 0
      ? AGENT_DEFINITIONS.map((def, i) => ({
          ...def,
          status: i < demoSteps.length ? 'completed' : 'pending',
          duration_ms: demoSteps[i]?.duration_ms || 0,
        }))
      : AGENT_DEFINITIONS.map(def => ({ ...def, status: 'pending', duration_ms: 0 }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="glass p-5"
    >
      <div className="flex items-center gap-2 mb-5">
        <Bot className="w-4 h-4 text-brand-400" />
        <h3 className="text-sm font-semibold text-white">Agent Activity</h3>
        {isRunning && (
          <span className="ml-auto flex items-center gap-1.5 text-xs text-brand-400">
            <Loader2 className="w-3 h-3 animate-spin" /> Processing
          </span>
        )}
      </div>

      <div className="space-y-0">
        {activeSteps.map((step, i) => {
          const Icon = step.icon;
          const isCompleted = step.status === 'completed';
          const isRunningStep = step.status === 'running';
          const isLast = i === activeSteps.length - 1;

          return (
            <div key={step.id}>
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.15 }}
                className="flex items-center gap-3 py-2.5"
              >
                {/* Status Icon */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  isCompleted ? step.bgColor : isRunningStep ? 'bg-brand-500/10' : 'bg-surface-800/60'
                }`}>
                  {isCompleted && <CheckCircle className={`w-4 h-4 ${step.color}`} />}
                  {isRunningStep && <Loader2 className="w-4 h-4 text-brand-400 animate-spin" />}
                  {!isCompleted && !isRunningStep && <Icon className="w-4 h-4 text-surface-600" />}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${
                    isCompleted ? 'text-surface-200' :
                    isRunningStep ? 'text-brand-400' :
                    'text-surface-500'
                  }`}>
                    {step.name}
                  </p>
                  <p className="text-[11px] text-surface-500">{step.description}</p>
                </div>

                {/* Duration */}
                {isCompleted && step.duration_ms > 0 && (
                  <span className="text-[10px] text-surface-500 font-mono">
                    {step.duration_ms}ms
                  </span>
                )}
              </motion.div>

              {/* Connector Line */}
              {!isLast && (
                <div className={`w-0.5 h-3 ml-[15px] rounded-full transition-colors duration-500 ${
                  isCompleted ? 'bg-brand-500/50' : 'bg-surface-800'
                }`} />
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
