import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import KPICards from '../components/dashboard/KPICards';
import ShipmentTable from '../components/dashboard/ShipmentTable';
import IncidentFeed from '../components/dashboard/IncidentFeed';
import RiskCharts from '../components/dashboard/RiskCharts';
import AgentActivity from '../components/dashboard/AgentActivity';
import WhatIfPanel from '../components/simulation/WhatIfPanel';
import ExecutiveDecisionPanel from '../components/dashboard/ExecutiveDecisionPanel';
import { fetchDashboardStats, fetchShipments, fetchIncidents, analyzeAllShipments } from '../api/client';
import { Loader2, RefreshCw, Play } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [shipments, setShipments] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState(null);

  const loadData = useCallback(async () => {
    try {
      const [s, sh, inc] = await Promise.all([
        fetchDashboardStats(),
        fetchShipments(),
        fetchIncidents(),
      ]);
      setStats(s);
      setShipments(sh);
      setIncidents(inc);
      
      // Keep selected shipment references updated
      if (selectedShipment) {
        const updated = sh.find(item => item.shipment_id === selectedShipment.shipment_id);
        if (updated) setSelectedShipment(updated);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedShipment]);

  useEffect(() => { loadData(); }, []);

  const handleAnalyzeAll = async () => {
    setAnalyzing(true);
    try {
      await analyzeAllShipments();
      await loadData();
    } catch (err) {
      console.error('Analysis failed:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-brand-400 animate-spin mx-auto mb-3" />
          <p className="text-sm text-surface-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-white">Platform Dashboard</h1>
          <p className="text-xs text-surface-400 mt-1">
            Real-time supply chain risk prediction and autonomous recommendations
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="flex items-center gap-2 px-3 py-2 text-xs font-medium
              text-surface-300 bg-surface-800/60 border border-surface-700/50
              rounded-lg hover:bg-surface-700/60 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
          <button
            onClick={handleAnalyzeAll}
            disabled={analyzing}
            className="flex items-center gap-2 px-4 py-2 text-xs font-medium
              text-white bg-gradient-to-r from-brand-500 to-accent-cyan
              rounded-lg hover:opacity-90 transition-opacity shadow-lg shadow-brand-500/20
              disabled:opacity-50"
          >
            {analyzing ? (
              <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Analyzing...</>
            ) : (
              <><Play className="w-3.5 h-3.5" /> Analyze All Shipments</>
            )}
          </button>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <KPICards stats={stats} />

      {/* Charts Row */}
      <RiskCharts stats={stats} />

      {/* Table + Copilot Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ShipmentTable
            shipments={shipments}
            onSelect={setSelectedShipment}
            selectedId={selectedShipment?.shipment_id}
          />
          <IncidentFeed incidents={incidents} />
        </div>
        <div className="lg:col-span-1">
          <ExecutiveDecisionPanel
            shipment={selectedShipment}
            onMitigate={(id) => {
              // Mock mitigation: update shipment status
              setShipments(prev => prev.map(s => s.shipment_id === id ? { ...s, status: 'Mitigated' } : s));
              setSelectedShipment(prev => prev ? { ...prev, status: 'Mitigated' } : null);
            }}
          />
        </div>
      </div>

      {/* Agent Activity + What-If */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AgentActivity />
        <WhatIfPanel />
      </div>
    </div>
  );
}
