import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Shield, Play, Loader2, Cpu, CheckCircle2, Server, HelpCircle, FileText, Database, Settings } from 'lucide-react';
import { createWebSocket, analyzeAllShipments } from '../api/client';

export default function AIReasoning() {
  const [logs, setLogs] = useState([
    { id: 1, text: '✔ LogiChain WS Core initialized.', timestamp: new Date().toLocaleTimeString() },
    { id: 2, text: '✔ Ready for document ingestion or batch analysis.', timestamp: new Date().toLocaleTimeString() },
  ]);
  const [running, setRunning] = useState(false);
  const [activeStep, setActiveStep] = useState(null); // 'document_intake', 'watchtower', 'risk_prediction', 'mitigation'
  const [stepData, setStepData] = useState({
    document_intake: { status: 'idle', duration: 0, input: 'Raw Logistics File', output: 'Shipment JSON', summary: 'Parses document using layout regex rulebooks.', confidence: '98%' },
    watchtower: { status: 'idle', duration: 0, input: 'Target Port Code', output: 'Incident Array', summary: 'Scans incident database for port region conflicts.', confidence: '90%' },
    risk_prediction: { status: 'idle', duration: 0, input: 'Shipment + Incidents', output: 'Risk Score (0-100)', summary: 'Calculates delay vectors & supplier reliability factors.', confidence: '95%' },
    mitigation: { status: 'idle', duration: 0, input: 'Risk Score + Supplier', output: 'Alternatives & Savings', summary: 'Matches alternative ports and backup suppliers.', confidence: '89%' }
  });

  const consoleEndRef = useRef(null);

  useEffect(() => {
    // Scroll terminal to bottom
    consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  useEffect(() => {
    // Connect to WebSocket server on port 8001
    const ws = createWebSocket((msg) => {
      if (msg.type === 'console_log') {
        setLogs((prev) => [
          ...prev,
          { id: Date.now(), text: msg.message, timestamp: new Date().toLocaleTimeString() }
        ]);
      } else if (msg.type === 'agent_update') {
        const { agent, status, duration_ms } = msg.data;
        if (status === 'running') {
          setActiveStep(agent);
          setStepData((prev) => ({
            ...prev,
            [agent]: { ...prev[agent], status: 'running' }
          }));
        } else if (status === 'completed') {
          setStepData((prev) => ({
            ...prev,
            [agent]: { ...prev[agent], status: 'completed', duration: duration_ms }
          }));
        } else if (status === 'error') {
          setStepData((prev) => ({
            ...prev,
            [agent]: { ...prev[agent], status: 'error', duration: duration_ms }
          }));
        }
      } else if (msg.type === 'workflow_complete') {
        setRunning(false);
        setActiveStep(null);
        setLogs((prev) => [
          ...prev,
          { id: Date.now(), text: '✔ Workflow execution trace completed successfully.', timestamp: new Date().toLocaleTimeString() }
        ]);
      }
    });

    return () => {
      ws.close();
    };
  }, []);

  const triggerBatchAnalysis = async () => {
    setRunning(true);
    setLogs((prev) => [
      ...prev,
      { id: Date.now(), text: '▶ Initiating full batch supply chain analysis...', timestamp: new Date().toLocaleTimeString() }
    ]);
    
    // Reset steps to running/idle
    setStepData({
      document_intake: { status: 'idle', duration: 0, input: 'Raw Logistics File', output: 'Shipment JSON', summary: 'Parses document using layout regex rulebooks.', confidence: '98%' },
      watchtower: { status: 'idle', duration: 0, input: 'Target Port Code', output: 'Incident Array', summary: 'Scans incident database for port region conflicts.', confidence: '90%' },
      risk_prediction: { status: 'idle', duration: 0, input: 'Shipment + Incidents', output: 'Risk Score (0-100)', summary: 'Calculates delay vectors & supplier reliability factors.', confidence: '95%' },
      mitigation: { status: 'idle', duration: 0, input: 'Risk Score + Supplier', output: 'Alternatives & Savings', summary: 'Matches alternative ports and backup suppliers.', confidence: '89%' }
    });

    try {
      // Direct REST call, which triggers graph updates broadcasted on WebSocket
      await analyzeAllShipments();
    } catch (err) {
      setLogs((prev) => [
        ...prev,
        { id: Date.now(), text: `✖ Error executing batch: ${err.message}`, timestamp: new Date().toLocaleTimeString() }
      ]);
      setRunning(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <span className="text-[10px] bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded uppercase font-semibold">Complete</span>;
      case 'running':
        return <span className="text-[10px] bg-brand-500/10 text-brand-400 border border-brand-500/20 px-2 py-0.5 rounded uppercase font-semibold flex items-center gap-1"><Loader2 className="w-2.5 h-2.5 animate-spin" /> Active</span>;
      case 'error':
        return <span className="text-[10px] bg-risk-critical/10 text-risk-critical border border-risk-critical/20 px-2 py-0.5 rounded uppercase font-semibold">Failed</span>;
      default:
        return <span className="text-[10px] bg-surface-800 text-surface-400 border border-surface-700 px-2 py-0.5 rounded uppercase font-semibold">Idle</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">AI Reasoning Workflow</h1>
          <p className="text-xs text-surface-400 mt-1">Audit execution traces and active WebSocket telemetry.</p>
        </div>
        <button
          onClick={triggerBatchAnalysis}
          disabled={running}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-brand-500 to-accent-cyan rounded-xl hover:opacity-90 transition-all shadow-lg shadow-brand-500/10 disabled:opacity-50"
        >
          {running ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
          Trigger Pipeline Trace
        </button>
      </div>

      {/* Node Flow Visualizer */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
        {Object.entries(stepData).map(([key, value], idx) => {
          const stepNames = {
            document_intake: '1. Document Ingest',
            watchtower: '2. Watchtower Scan',
            risk_prediction: '3. Risk Engine',
            mitigation: '4. Mitigations Plan'
          };
          const isCurrent = activeStep === key;
          const isCompleted = value.status === 'completed';

          return (
            <motion.div
              key={key}
              className={`glass p-5 space-y-4 relative transition-all duration-300 ${isCurrent ? 'border-brand-500/40 bg-brand-500/[0.02]' : ''} ${isCompleted ? 'border-green-500/20' : ''}`}
            >
              {/* Connector line on desktop */}
              {idx < 3 && (
                <div className={`hidden md:block absolute top-1/2 -right-3.5 w-3 h-[1px] ${isCompleted ? 'bg-green-500/45' : 'bg-surface-800'}`} />
              )}

              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{stepNames[key]}</span>
                {getStatusBadge(value.status)}
              </div>

              <div className="space-y-2 bg-surface-950/40 p-3 rounded-lg border border-surface-850/60 text-[11px] leading-relaxed">
                <div className="flex justify-between">
                  <span className="text-surface-450">Input:</span>
                  <span className="text-surface-300 font-mono truncate max-w-[120px]">{value.input}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-450">Output:</span>
                  <span className="text-surface-300 font-mono truncate max-w-[120px]">{value.output}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-450">Accuracy Est:</span>
                  <span className="text-brand-400 font-semibold">{value.confidence}</span>
                </div>
                {value.duration > 0 && (
                  <div className="flex justify-between">
                    <span className="text-surface-450">Trace Time:</span>
                    <span className="text-surface-300 font-semibold">{value.duration}ms</span>
                  </div>
                )}
              </div>

              <div className="text-[10px] text-surface-400 leading-normal border-t border-surface-800/60 pt-2.5">
                <p className="font-semibold text-white">Execution summary:</p>
                <p className="mt-1 text-surface-450">{value.summary}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Live Console Terminal */}
      <div className="glass border-surface-800 bg-[#090D1A] overflow-hidden flex flex-col h-[350px]">
        {/* Terminal Header */}
        <div className="bg-[#0D1224] px-5 py-2.5 border-b border-surface-850/80 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <Terminal className="w-4.5 h-4.5 text-brand-400" />
            <span className="text-[11px] font-bold text-white tracking-wider uppercase font-mono">Live WebSocket Streaming Console</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-risk-critical" />
            <span className="w-2 h-2 rounded-full bg-risk-medium" />
            <span className="w-2 h-2 rounded-full bg-risk-low" />
          </div>
        </div>

        {/* Terminal Logs */}
        <div className="flex-1 p-5 overflow-y-auto font-mono text-xs space-y-2">
          {logs.map((log) => (
            <div key={log.id} className="flex gap-4 hover:bg-surface-900/30 py-0.5 rounded px-1 transition-colors">
              <span className="text-surface-650 text-[10px] select-none flex-shrink-0">{log.timestamp}</span>
              <span className="text-surface-300 leading-relaxed break-all">{log.text}</span>
            </div>
          ))}
          <div ref={consoleEndRef} />
        </div>
      </div>
    </div>
  );
}
