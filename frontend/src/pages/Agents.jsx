import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ReactFlow,
  Background,
  Controls,
  Handle,
  Position,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Bot, FileSearch, Globe, ShieldCheck, Lightbulb, Play, ArrowRight } from 'lucide-react';

const nodeColors = {
  document_intake: { bg: '#1e40af', border: '#3b82f6', icon: FileSearch },
  watchtower: { bg: '#0e7490', border: '#06b6d4', icon: Globe },
  risk_prediction: { bg: '#b45309', border: '#f59e0b', icon: ShieldCheck },
  mitigation: { bg: '#7c3aed', border: '#8b5cf6', icon: Lightbulb },
};

function AgentNode({ data }) {
  const config = nodeColors[data.id] || { bg: '#334155', border: '#64748b', icon: Bot };
  const Icon = config.icon;

  return (
    <div
      className="rounded-2xl px-6 py-4 text-center min-w-[200px] border-2 shadow-lg"
      style={{ background: `${config.bg}22`, borderColor: config.border }}
    >
      <Handle type="target" position={Position.Left} style={{ background: config.border }} />
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${config.bg}44` }}>
          <Icon className="w-5 h-5" style={{ color: config.border }} />
        </div>
        <div className="text-left">
          <p className="text-sm font-semibold text-white">{data.label}</p>
          <p className="text-[10px] text-surface-400">{data.description}</p>
        </div>
      </div>
      <Handle type="source" position={Position.Right} style={{ background: config.border }} />
    </div>
  );
}

const nodeTypes = { agent: AgentNode };

const initialNodes = [
  {
    id: 'start',
    type: 'input',
    position: { x: 0, y: 100 },
    data: { label: '📄 Document Upload' },
    style: {
      background: '#0f172a', border: '2px solid #334155',
      borderRadius: '12px', padding: '12px 20px', color: '#e2e8f0',
      fontSize: '13px', fontWeight: 600,
    },
  },
  {
    id: 'document_intake',
    type: 'agent',
    position: { x: 250, y: 0 },
    data: { id: 'document_intake', label: 'Document Intake', description: 'Parse & extract shipment data' },
  },
  {
    id: 'watchtower',
    type: 'agent',
    position: { x: 550, y: 0 },
    data: { id: 'watchtower', label: 'Global Watchtower', description: 'Scan risk events & feeds' },
  },
  {
    id: 'risk_prediction',
    type: 'agent',
    position: { x: 250, y: 150 },
    data: { id: 'risk_prediction', label: 'Risk Prediction', description: 'Calculate composite risk score' },
  },
  {
    id: 'mitigation',
    type: 'agent',
    position: { x: 550, y: 150 },
    data: { id: 'mitigation', label: 'Mitigation Agent', description: 'Generate recommendations' },
  },
  {
    id: 'end',
    type: 'output',
    position: { x: 850, y: 100 },
    data: { label: '📊 Dashboard Update' },
    style: {
      background: '#0f172a', border: '2px solid #22c55e',
      borderRadius: '12px', padding: '12px 20px', color: '#e2e8f0',
      fontSize: '13px', fontWeight: 600,
    },
  },
];

const initialEdges = [
  { id: 'e-start-doc', source: 'start', target: 'document_intake', animated: true, style: { stroke: '#3b82f6', strokeWidth: 2 } },
  { id: 'e-doc-watch', source: 'document_intake', target: 'watchtower', animated: true, style: { stroke: '#06b6d4', strokeWidth: 2 } },
  { id: 'e-watch-risk', source: 'watchtower', target: 'risk_prediction', animated: true, style: { stroke: '#f59e0b', strokeWidth: 2 } },
  { id: 'e-risk-mit', source: 'risk_prediction', target: 'mitigation', animated: true, style: { stroke: '#8b5cf6', strokeWidth: 2 } },
  { id: 'e-mit-end', source: 'mitigation', target: 'end', animated: true, style: { stroke: '#22c55e', strokeWidth: 2 } },
];

export default function Agents() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold text-white">AI Agents</h1>
        <p className="text-sm text-surface-400 mt-1">Autonomous multi-agent workflow visualization</p>
      </motion.div>

      {/* Agent Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Object.entries(nodeColors).map(([id, config], i) => {
          const Icon = config.icon;
          const labels = {
            document_intake: { name: 'Document Intake', desc: 'Parses PDF/DOCX/TXT files and extracts structured shipment data using regex heuristics and AI.' },
            watchtower: { name: 'Global Watchtower', desc: 'Scans simulated feeds for port congestion, weather, strikes, and political conflicts.' },
            risk_prediction: { name: 'Risk Prediction', desc: 'Calculates composite risk scores using severity, priority, ETA proximity, and compounding.' },
            mitigation: { name: 'Mitigation', desc: 'Generates rerouting, supplier change, mode shift, and buffer recommendations.' },
          };
          return (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass p-5"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                style={{ background: `${config.bg}33` }}>
                <Icon className="w-5 h-5" style={{ color: config.border }} />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">{labels[id].name}</h3>
              <p className="text-xs text-surface-400 leading-relaxed">{labels[id].desc}</p>
              <div className="mt-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-risk-low" />
                <span className="text-[10px] text-surface-500">Ready</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* React Flow */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass overflow-hidden"
        style={{ height: '400px' }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.3 }}
          proOptions={{ hideAttribution: true }}
          style={{ background: '#0a0f1e' }}
        >
          <Background color="#1e293b" gap={20} size={1} />
          <Controls
            style={{ background: '#1e293b', borderColor: '#334155', borderRadius: '8px' }}
          />
        </ReactFlow>
      </motion.div>
    </div>
  );
}
