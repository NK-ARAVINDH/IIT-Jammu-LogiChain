import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Ship, Shield, AlertTriangle, Clock, MapPin,
  FileCheck, Compass, Info, CheckCircle2, ChevronRight, UserCheck
} from 'lucide-react';
import { fetchShipmentDetail } from '../api/client';
import ExplainableRiskCard from '../components/dashboard/ExplainableRiskCard';
import RouteComparison from '../components/dashboard/RouteComparison';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export default function ShipmentDetails() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDetail() {
      try {
        const result = await fetchShipmentDetail(id);
        setData(result);
      } catch (err) {
        console.error('Failed to load shipment details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <Clock className="w-8 h-8 text-brand-400 animate-spin mx-auto mb-3" />
          <p className="text-sm text-surface-400">Fetching telemetry details...</p>
        </div>
      </div>
    );
  }

  if (!data || !data.shipment) {
    return (
      <div className="glass p-8 text-center max-w-md mx-auto mt-10">
        <AlertTriangle className="w-10 h-10 text-risk-critical mx-auto mb-3" />
        <h3 className="text-base font-bold text-white">Shipment Not Found</h3>
        <p className="text-xs text-surface-450 mt-1">Verify shipment code and try again.</p>
        <Link to="/shipments" className="mt-4 inline-block text-xs font-bold text-brand-400 hover:underline">
          Return to ship deck
        </Link>
      </div>
    );
  }

  const { shipment, risk_reports = [] } = data;
  const latestReport = risk_reports[0] || {};
  const recs = latestReport.recommendations || [];
  
  // Reconstruct risk and confidence trend chart data
  const chartData = [
    { name: 'Day -4', risk: Math.max(0, shipment.risk_score - 20), confidence: 80 },
    { name: 'Day -3', risk: Math.max(0, shipment.risk_score - 15), confidence: 82 },
    { name: 'Day -2', risk: Math.max(0, shipment.risk_score - 5), confidence: 85 },
    { name: 'Day -1', risk: Math.max(0, shipment.risk_score - 2), confidence: 88 },
    { name: 'Current', risk: shipment.risk_score, confidence: shipment.confidence }
  ];

  return (
    <div className="space-y-6">
      {/* Back navigation */}
      <div className="flex items-center gap-3">
        <Link
          to="/shipments"
          className="p-2 bg-surface-900/60 border border-surface-800/40 rounded-xl hover:bg-surface-800/60 transition-colors text-surface-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <span className="text-xs text-surface-500 font-semibold tracking-wider uppercase">Shipment Profile</span>
          <h1 className="text-xl font-bold text-white mt-0.5">{shipment.shipment_id}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Stats & Explainable Risk Card */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Metadata Card */}
          <div className="glass p-5 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <span className="text-[10px] text-surface-450 uppercase font-semibold">Origin</span>
              <span className="text-xs font-bold text-white block mt-0.5">{shipment.origin}</span>
            </div>
            <div>
              <span className="text-[10px] text-surface-450 uppercase font-semibold">Destination</span>
              <span className="text-xs font-bold text-white block mt-0.5">{shipment.destination}</span>
            </div>
            <div>
              <span className="text-[10px] text-surface-450 uppercase font-semibold">Scheduled ETA</span>
              <span className="text-xs font-bold text-white block mt-0.5">{shipment.eta}</span>
            </div>
            <div>
              <span className="text-[10px] text-surface-450 uppercase font-semibold">Priority level</span>
              <span className="text-xs font-bold text-white block mt-0.5 uppercase">{shipment.priority}</span>
            </div>
          </div>

          {/* Explainable Risk Component */}
          <ExplainableRiskCard riskData={shipment} />

          {/* Route Comparison */}
          {recs.length > 0 && <RouteComparison recommendation={recs[0]} />}

          {/* Historical Trend Charts */}
          <div className="glass p-6 space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Risk & Confidence History</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorConf" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: 8 }} />
                  <Area type="monotone" dataKey="risk" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorRisk)" name="Risk Score" />
                  <Area type="monotone" dataKey="confidence" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorConf)" name="Confidence" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column: Timelines & Supplier Details */}
        <div className="space-y-6">
          
          {/* Timeline Tracking */}
          <div className="glass p-6 space-y-5">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Risk Lifecycle Timeline</h3>
            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1.5px] before:bg-surface-800">
              
              <div className="relative">
                <span className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-green-500 border border-surface-950 flex items-center justify-center">
                  <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                </span>
                <p className="text-xs font-semibold text-white">Origin Dispatch</p>
                <p className="text-[10px] text-surface-450 mt-0.5">Cargo loaded at {shipment.origin}</p>
              </div>

              <div className="relative">
                <span className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-amber-500 border border-surface-950 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping" />
                </span>
                <p className="text-xs font-semibold text-white">Port Hub Crossing</p>
                <p className="text-[10px] text-surface-450 mt-0.5">ETA: {shipment.eta} via {shipment.port}</p>
                {shipment.expected_delay > 0 && (
                  <span className="text-[9px] text-risk-high mt-1 inline-block bg-risk-high/10 border border-risk-high/20 px-1.5 py-0.2 rounded font-semibold">
                    +{shipment.expected_delay} Day Delay Expected
                  </span>
                )}
              </div>

              <div className="relative">
                <span className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-surface-700 border border-surface-950" />
                <p className="text-xs font-semibold text-surface-400">Destination Delivery</p>
                <p className="text-[10px] text-surface-450 mt-0.5">Scheduled destination: {shipment.destination}</p>
              </div>
            </div>
          </div>

          {/* Supplier Reliability Card */}
          <div className="glass p-6 space-y-4">
            <div className="flex items-center gap-2.5 border-b border-surface-800/60 pb-3">
              <UserCheck className="w-5 h-5 text-accent-violet" />
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Supplier Intelligence</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <span className="text-[10px] text-surface-450 uppercase font-semibold">Assigned Vendor</span>
                <span className="text-xs font-bold text-white block mt-0.5">{shipment.supplier}</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface-950/40 p-3 rounded-lg border border-surface-850/60">
                  <span className="text-[9px] text-surface-450 uppercase font-bold tracking-wider block">Reliability</span>
                  <span className="text-base font-bold text-green-400 block mt-0.5">
                    {shipment.supplier_reliability}%
                  </span>
                </div>
                <div className="bg-surface-950/40 p-3 rounded-lg border border-surface-850/60">
                  <span className="text-[9px] text-surface-450 uppercase font-bold tracking-wider block">Risk Status</span>
                  <span className="text-xs font-semibold text-white block mt-1.5 uppercase">
                    {shipment.supplier_reliability > 90 ? 'Stable' : 'Elevated'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Incident History List */}
          <div className="glass p-6 space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Route Threat Incidents</h3>
            <div className="space-y-3.5">
              {latestReport.affected_incidents?.length > 0 ? (
                latestReport.affected_incidents.map((incId, idx) => (
                  <div key={idx} className="bg-surface-950/40 border border-surface-850/60 rounded-xl p-3 flex gap-3">
                    <AlertTriangle className="w-4 h-4 text-risk-high flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-white">{incId}</p>
                      <p className="text-[10px] text-surface-450 mt-0.5">Threat matched at port boundary of {shipment.port}.</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-xs text-surface-550 italic">No threats identified on this shipping route.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
