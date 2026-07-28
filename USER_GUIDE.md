# LogiChain AI — User Guide

Welcome to **LogiChain AI**, your autonomous supply chain risk prediction and mitigation assistant. 

This guide is designed for logistics managers, supply chain operators, and business leaders. It explains how to navigate the platform, understand metrics, upload documents, simulate disruptions, and download actionable AI recommendations.

---

## 🧭 Dashboard Navigation

On the left side of your screen is the navigation menu containing the following sections:

1. **Dashboard**: Your operational control center. Shows live metrics, interactive maps, timelines, active shipments, global incidents, and the simulation panel.
2. **Shipments**: A searchable, filterable directory of all active cargo currently in transit across the globe.
3. **Incidents**: A list of active global incidents (storms, labor strikes, customs delays, etc.) categorized by severity.
4. **AI Agents**: A visual, interactive model mapping out how the 4 AI agents process documents and predict risks.
5. **Reports**: Access to deep-dive briefings, safety buffers, stockout warnings, and mitigation logs.
6. **Settings**: General platform preferences and options.

---

## 🖥️ Step-by-Step Operations

### 1. Ingestion: Ingesting a Shipping Document
When you receive a new Bill of Lading, manifest, or Purchase Order, you can submit it to the system to check for transit delays:

1. Click the **"Upload Document"** button in the top right header.
2. Drag and drop your document file (e.g., `sample_manifest.txt`) into the dashed box, or click to select the file from your computer.
3. Click **"Analyze Document"**.
4. You will see a live progress bar tracking the four autonomous AI agents:
   - **Document Intake**: Extracts parameters like origin, destination, ETA, and items.
   - **Global Watchtower**: Cross-references the route against global storm and strike feeds.
   - **Risk Prediction**: Calculates cargo vulnerability and delay probability.
   - **Mitigation Agent**: Prepares rerouting plans and calculates costs.
5. Once completed, a confirmation notice will appear, and the shipment details are automatically updated on your main dashboard table.

---

### 2. Monitoring: Understanding the Main Dashboard
Once you run the analysis, the dashboard organizes real-time information:

- **Active Shipments Card**: Tracks the total count of active containers on the water.
- **High Risk Card**: Displays the count of shipments with elevated threat ratings. Pay immediate attention to this metric.
- **Open Incidents Card**: Shows active weather or labor disruptions globally.
- **Risk Distribution Chart**: Hover over sections of the donut chart to see the percentage of Low, Medium, High, or Critical shipments in your supply chain.
- **Port Congestion Bar**: Helps you quickly identify which ports (e.g., Shanghai, Singapore) are experiencing the worst delay ratings.
- **Live Feed**: A scrolling tick of global alerts. Check here to read short summaries of new incidents (e.g., crane failures or cyclones).

---

### 3. Simulation: Running "What-If" Disruptions
Use the What-If panel at the bottom of the dashboard to test your supply chain's resilience during potential global disruptions.

1. Locate the **"What-If Simulation"** card.
2. **Select Scenario**: Choose the type of disruption you want to test (e.g., *Port Closure* or *Labor Strike*).
3. **Select Target Port**: Choose the port you want to simulate the disruption at (e.g., *Singapore* or *Rotterdam*).
4. **Select Severity**: Drag the slider from 1 (minor) to 10 (total shutdown).
5. Click **"Run Simulation"**.
6. The simulator will immediately calculate the impact and display:
   - The total number of shipments affected.
   - The average increase in risk scores.
   - A side-by-side view showing each shipment's current risk level vs. its new simulated risk level.
   - Immediate AI-suggested mitigation paths (e.g., rerouting options or shifting priority cargo to air freight).

---

### 4. Mitigation: Reviewing & Exporting AI Reports
For shipments labeled as **High** or **Critical** risk, the system compiles comprehensive mitigation briefs:

1. Navigate to the **"Reports"** page from the sidebar menu.
2. Find the Shipment or Report ID you want to inspect and click the row to expand it.
3. Review the three sections:
   - **Risk Factors**: Explains *why* the shipment is in danger (e.g., "ETA overlaps with a 72-hour dock strike").
   - **AI Recommendations**: View alternate logistics paths, backup suppliers, safety stock adjustments, or schedule delays along with their estimated cost impacts and business ROI.
   - **Executive Summary**: A summary memo detailing the situation.
4. Click the **"Download"** button on the right side of the report row. Your browser will download a clean, readable `.txt` report file that you can print, email, or present in operational meetings.
