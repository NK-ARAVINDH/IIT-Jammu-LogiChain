import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Compass, AlertTriangle, Ship, RefreshCw, Loader2, Info } from 'lucide-react';
import { ComposableMap, Geographies, Geography, Marker, Line } from 'react-simple-maps';
import { fetchShipments, fetchIncidents } from '../api/client';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export default function WorldRiskMap() {
  const navigate = useNavigate();
  const [shipments, setShipments] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPort, setSelectedPort] = useState(null);

  // Define port positions on our SVG coordinate system
  const ports = [
    { name: 'Singapore', coordinates: [103.8198, 1.3521], country: 'Singapore' },
    { name: 'Shanghai', coordinates: [121.4737, 31.2304], country: 'China' },
    { name: 'Rotterdam', coordinates: [4.4777, 51.9244], country: 'Netherlands' },
    { name: 'Los Angeles', coordinates: [-118.2437, 34.0522], country: 'USA' },
    { name: 'Mumbai', coordinates: [72.8777, 19.0760], country: 'India' },
    { name: 'Dubai', coordinates: [55.2708, 25.2048], country: 'UAE' },
  ];

  const loadMapData = async () => {
    setLoading(true);
    try {
      const [sh, inc] = await Promise.all([fetchShipments(), fetchIncidents()]);
      setShipments(sh);
      setIncidents(inc);
    } catch (err) {
      console.error('Failed to load map details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMapData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-brand-400 animate-spin mx-auto mb-3" />
          <p className="text-sm text-surface-400">Projecting global risk vectors...</p>
        </div>
      </div>
    );
  }

  // Helper to determine risk level color for a port
  const getPortRiskColor = (portName) => {
    const portShipments = shipments.filter(s => s.port === portName);
    if (!portShipments.length) return 'bg-green-500';
    const highestRisk = Math.max(...portShipments.map(s => s.risk_score));
    if (highestRisk >= 76) return 'bg-risk-critical';
    if (highestRisk >= 51) return 'bg-risk-high';
    if (highestRisk >= 26) return 'bg-risk-medium';
    return 'bg-risk-low';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">World Risk Heat Map</h1>
          <p className="text-xs text-surface-400 mt-1">
            Visual intelligence map showing global ports, active incident vectors, and shipping lanes.
          </p>
        </div>
        <button
          onClick={loadMapData}
          className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-surface-300 bg-surface-800/60 border border-surface-700/50 rounded-xl hover:bg-surface-700/60 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Reload map
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Map Vector Viewer */}
        <div className="lg:col-span-3 glass p-4 bg-[#0a0f24] min-h-[400px] relative overflow-hidden flex items-center justify-center">
          
          {/* Legend Overlay */}
          <div className="absolute bottom-4 left-4 bg-surface-950/80 backdrop-blur-md border border-surface-800 rounded-xl p-3 space-y-2 z-10 text-[10px]">
            <span className="font-semibold uppercase tracking-wider text-surface-400 block mb-1">Threat Index Legend</span>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-risk-low" /> <span>Low Risk (0-25)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-risk-medium" /> <span>Medium Risk (26-50)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-risk-high" /> <span>High Risk (51-75)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-risk-critical" /> <span>Critical Risk (76-100)</span>
            </div>
          </div>

          <ComposableMap projection="geoMercator" projectionConfig={{ scale: 120 }} width={800} height={450} className="w-full h-auto text-surface-850 opacity-90 select-none">
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="#1e293b"
                    stroke="#0f172a"
                    strokeWidth={0.5}
                    style={{
                      default: { outline: "none" },
                      hover: { outline: "none", fill: "#334155" },
                      pressed: { outline: "none" },
                    }}
                  />
                ))
              }
            </Geographies>

            {/* Traced Shipping Lane lines */}
            <Line from={[-118.2437, 34.0522]} to={[121.4737, 31.2304]} stroke="#334155" strokeWidth={1} strokeDasharray="3 3" opacity={0.6} />
            <Line from={[103.8198, 1.3521]} to={[4.4777, 51.9244]} stroke="#334155" strokeWidth={1} strokeDasharray="3 3" opacity={0.6} />
            <Line from={[121.4737, 31.2304]} to={[103.8198, 1.3521]} stroke="#334155" strokeWidth={1} strokeDasharray="3 3" opacity={0.6} />
            <Line from={[72.8777, 19.0760]} to={[55.2708, 25.2048]} stroke="#334155" strokeWidth={1} strokeDasharray="3 3" opacity={0.6} />
            <Line from={[55.2708, 25.2048]} to={[4.4777, 51.9244]} stroke="#334155" strokeWidth={1} strokeDasharray="3 3" opacity={0.6} />

            {/* Interactive pulsing incident circles */}
            {incidents.map((inc) => {
              const matchedPort = ports.find(p => p.name.toLowerCase() === inc.affected_port.toLowerCase());
              if (!matchedPort) return null;
              return (
                <Marker key={inc.id} coordinates={matchedPort.coordinates}>
                  <circle
                    r={inc.severity * 2.5}
                    className="text-risk-critical animate-ping"
                    fill="currentColor"
                    opacity="0.15"
                  />
                </Marker>
              );
            })}

            {/* Port Dots */}
            {ports.map((port) => {
              const colorClass = getPortRiskColor(port.name);
              const isSelected = selectedPort === port.name;
              
              return (
                <Marker key={port.name} coordinates={port.coordinates}>
                  <g
                    onClick={() => setSelectedPort(isSelected ? null : port.name)}
                    className="cursor-pointer group"
                  >
                    <circle
                      r={isSelected ? 10 : 7}
                      className={`${colorClass} transition-all duration-300 border-2 border-surface-950 group-hover:scale-125`}
                    />
                    <text
                      y={-12}
                      textAnchor="middle"
                      fill="#fff"
                      fontSize="9"
                      fontWeight="600"
                      className="opacity-60 group-hover:opacity-100 transition-opacity bg-black pointer-events-none"
                    >
                      {port.name}
                    </text>
                  </g>
                </Marker>
              );
            })}
          </ComposableMap>
        </div>

        {/* Selected Port Shipments Drawer */}
        <div className="glass p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-surface-800 pb-3">
            <Compass className="w-5 h-5 text-brand-400" />
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                {selectedPort ? `${selectedPort} Node` : 'Select a Port'}
              </h3>
              <p className="text-[10px] text-surface-450 mt-0.5">Active port bound shipments</p>
            </div>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-[300px]">
            {selectedPort ? (
              shipments.filter(s => s.port === selectedPort).length > 0 ? (
                shipments.filter(s => s.port === selectedPort).map((s) => (
                  <div
                    key={s.id}
                    onClick={() => navigate(`/shipments/${s.shipment_id}`)}
                    className="bg-surface-950/40 hover:bg-surface-900/60 border border-surface-850/60 hover:border-brand-500/30 rounded-xl p-3.5 cursor-pointer transition-all duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-white">{s.shipment_id}</span>
                      <span className={`text-[9px] font-semibold px-2 py-0.2 rounded uppercase ${
                        s.risk_level === 'Critical' ? 'bg-risk-critical/10 text-risk-critical' :
                        s.risk_level === 'High' ? 'bg-risk-high/10 text-risk-high' :
                        s.risk_level === 'Medium' ? 'bg-risk-medium/10 text-risk-medium' :
                        'bg-risk-low/10 text-risk-low'
                      }`}>
                        {s.risk_level}
                      </span>
                    </div>
                    <p className="text-[10px] text-surface-400 mt-2 truncate">{s.items}</p>
                    <div className="flex justify-between items-center text-[9px] text-surface-500 mt-2 pt-2 border-t border-surface-900">
                      <span>Conf: {s.confidence}%</span>
                      <span>ETA: {s.eta}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-xs text-surface-550 italic">No shipments currently routing through this port.</p>
                </div>
              )
            ) : (
              <div className="bg-surface-950/20 border border-dashed border-surface-800 rounded-xl p-6 text-center text-xs text-surface-500">
                <Info className="w-5 h-5 mx-auto mb-2 text-surface-600" />
                Click on any map port marker node to trace inbound logistics.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
