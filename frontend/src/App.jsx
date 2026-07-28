import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useCallback } from 'react';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Shipments from './pages/Shipments';
import Incidents from './pages/Incidents';
import Agents from './pages/Agents';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import AIReasoning from './pages/AIReasoning';
import WorldRiskMap from './pages/WorldRiskMap';
import ShipmentDetails from './pages/ShipmentDetails';

export default function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUploadComplete = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout onUploadComplete={handleUploadComplete} />}>
          <Route path="/" element={<Dashboard key={refreshKey} />} />
          <Route path="/shipments" element={<Shipments key={refreshKey} />} />
          <Route path="/shipments/:id" element={<ShipmentDetails />} />
          <Route path="/incidents" element={<Incidents />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/reports" element={<Reports key={refreshKey} />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/ai-reasoning" element={<AIReasoning />} />
          <Route path="/world-map" element={<WorldRiskMap />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
