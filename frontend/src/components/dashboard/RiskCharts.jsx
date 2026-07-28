import { motion } from 'framer-motion';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line, Area, AreaChart,
} from 'recharts';
import { RISK_COLORS } from '../../utils/constants';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass px-3 py-2 text-xs">
      <p className="text-surface-300">{label || payload[0]?.name}</p>
      <p className="text-white font-medium">{payload[0]?.value}</p>
    </div>
  );
};

export default function RiskCharts({ stats }) {
  // Pie data
  const pieData = stats?.risk_distribution
    ? Object.entries(stats.risk_distribution).map(([name, value]) => ({
        name, value, color: RISK_COLORS[name],
      }))
    : [];

  // Bar data
  const barData = stats?.port_delays
    ? Object.entries(stats.port_delays).map(([port, score]) => ({
        port: port.length > 8 ? port.slice(0, 8) + '…' : port,
        fullPort: port,
        score,
      }))
    : [];

  // Line data (simulated timeline)
  const lineData = Array.from({ length: 14 }, (_, i) => ({
    day: `Day ${i + 1}`,
    incidents: Math.floor(Math.random() * 5) + 1 + Math.floor(i / 3),
    risk: Math.floor(Math.random() * 30) + 20 + i * 2,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Pie Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass p-5"
      >
        <h3 className="text-sm font-semibold text-white mb-4">Risk Distribution</h3>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
              animationBegin={500}
              animationDuration={1200}
            >
              {pieData.map((entry, i) => (
                <Cell key={i} fill={entry.color} stroke="transparent" />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap gap-3 mt-2 justify-center">
          {pieData.map(d => (
            <div key={d.name} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
              <span className="text-[11px] text-surface-400">{d.name} ({d.value})</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Bar Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass p-5"
      >
        <h3 className="text-sm font-semibold text-white mb-4">Risk Score by Port</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={barData} margin={{ top: 5, right: 5, bottom: 5, left: -15 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis
              dataKey="port"
              tick={{ fill: '#94a3b8', fontSize: 10 }}
              axisLine={{ stroke: '#334155' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#94a3b8', fontSize: 10 }}
              axisLine={{ stroke: '#334155' }}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="score"
              radius={[4, 4, 0, 0]}
              animationDuration={1500}
              animationBegin={600}
            >
              {barData.map((entry, i) => (
                <Cell
                  key={i}
                  fill={entry.score > 50 ? '#ef4444' : entry.score > 30 ? '#f59e0b' : '#3381ff'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Area Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="glass p-5"
      >
        <h3 className="text-sm font-semibold text-white mb-4">Incident Timeline</h3>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={lineData} margin={{ top: 5, right: 5, bottom: 5, left: -15 }}>
            <defs>
              <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3381ff" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3381ff" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorIncidents" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis
              dataKey="day"
              tick={{ fill: '#94a3b8', fontSize: 9 }}
              axisLine={{ stroke: '#334155' }}
              tickLine={false}
              interval={2}
            />
            <YAxis
              tick={{ fill: '#94a3b8', fontSize: 10 }}
              axisLine={{ stroke: '#334155' }}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="risk"
              stroke="#3381ff"
              fill="url(#colorRisk)"
              strokeWidth={2}
              animationDuration={2000}
            />
            <Area
              type="monotone"
              dataKey="incidents"
              stroke="#f59e0b"
              fill="url(#colorIncidents)"
              strokeWidth={2}
              animationDuration={2000}
              animationBegin={500}
            />
          </AreaChart>
        </ResponsiveContainer>
        <div className="flex gap-4 mt-2 justify-center">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 bg-brand-500 rounded" />
            <span className="text-[11px] text-surface-400">Risk Score</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 bg-risk-medium rounded" />
            <span className="text-[11px] text-surface-400">Incidents</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
