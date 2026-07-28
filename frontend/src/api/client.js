const API_BASE = 'http://localhost:8000';
const WS_BASE = 'ws://localhost:8001';

// --- REST API ---

export async function fetchDashboardStats() {
  const res = await fetch(`${API_BASE}/api/dashboard/stats`);
  if (!res.ok) throw new Error('Failed to fetch dashboard stats');
  return res.json();
}

export async function fetchShipments() {
  const res = await fetch(`${API_BASE}/api/shipments`);
  if (!res.ok) throw new Error('Failed to fetch shipments');
  return res.json();
}

export async function fetchShipmentDetail(shipmentId) {
  const res = await fetch(`${API_BASE}/api/shipments/${shipmentId}`);
  if (!res.ok) throw new Error('Failed to fetch shipment');
  return res.json();
}

export async function fetchIncidents() {
  const res = await fetch(`${API_BASE}/api/incidents`);
  if (!res.ok) throw new Error('Failed to fetch incidents');
  return res.json();
}

export async function fetchRiskReports() {
  const res = await fetch(`${API_BASE}/api/risk-reports`);
  if (!res.ok) throw new Error('Failed to fetch risk reports');
  return res.json();
}

export async function uploadDocument(file) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_BASE}/api/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Upload failed' }));
    throw new Error(err.detail || 'Upload failed');
  }
  return res.json();
}

export async function runWhatIf(scenario, targetPort, severity = 9) {
  const res = await fetch(`${API_BASE}/api/what-if`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      scenario,
      target_port: targetPort,
      severity_override: severity,
    }),
  });
  if (!res.ok) throw new Error('What-if simulation failed');
  return res.json();
}

export async function analyzeAllShipments() {
  const res = await fetch(`${API_BASE}/api/analyze-all`, { method: 'POST' });
  if (!res.ok) throw new Error('Analysis failed');
  return res.json();
}

export async function downloadReport(reportId) {
  const res = await fetch(`${API_BASE}/api/reports/${reportId}/download`);
  if (!res.ok) throw new Error('Download failed');
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `risk_report_${reportId}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

// --- WebSocket ---

export function createWebSocket(onMessage) {
  let ws = null;
  let reconnectTimeout = null;

  function connect() {
    ws = new WebSocket(`${WS_BASE}/ws`);

    ws.onopen = () => {
      console.log('[WS] Connected');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (e) {
        console.error('[WS] Parse error', e);
      }
    };

    ws.onclose = () => {
      console.log('[WS] Disconnected, reconnecting...');
      reconnectTimeout = setTimeout(connect, 3000);
    };

    ws.onerror = (err) => {
      console.error('[WS] Error', err);
      ws.close();
    };
  }

  connect();

  return {
    close: () => {
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      if (ws) ws.close();
    },
    send: (data) => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(data));
      }
    },
  };
}
