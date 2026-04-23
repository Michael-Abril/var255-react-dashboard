import React, { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

const styles = {
  container: { minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', padding: '24px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' },
  title: { fontSize: '24px', fontWeight: '700', color: '#f1f5f9' },
  subtitle: { fontSize: '14px', color: '#64748b', marginTop: '4px' },
  badge: { background: '#10b981', color: '#fff', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' },
  card: { background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '20px' },
  metricValue: { fontSize: '32px', fontWeight: '700', color: '#f1f5f9', marginTop: '8px' },
  metricLabel: { fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' },
  metricChange: { fontSize: '13px', color: '#10b981', marginTop: '4px' },
  chartCard: { background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '24px', marginBottom: '24px' },
  chartTitle: { fontSize: '16px', fontWeight: '600', color: '#f1f5f9', marginBottom: '20px' },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' },
}

function generateLatencyData() {
  return Array.from({ length: 20 }, (_, i) => ({
    t: `${i * 3}m`,
    p50: Math.round(80 + Math.random() * 40),
    p99: Math.round(180 + Math.random() * 80),
  }))
}

function generateThroughputData() {
  return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => ({
    day,
    requests: Math.round(12000 + Math.random() * 8000),
    errors: Math.round(20 + Math.random() * 60),
  }))
}

export default function App() {
  const [latency, setLatency] = useState(generateLatencyData())
  const [throughput] = useState(generateThroughputData())
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setLatency(prev => [...prev.slice(1), { t: 'now', p50: Math.round(80 + Math.random() * 40), p99: Math.round(180 + Math.random() * 80) }])
      setTick(t => t + 1)
    }, 2000)
    return () => clearInterval(id)
  }, [])

  const metrics = [
    { label: 'Active Deployments', value: '47', change: '+3 today' },
    { label: 'Avg Latency (p50)', value: `${latency.at(-1)?.p50 ?? '--'}ms`, change: '↓ 12ms vs yesterday' },
    { label: 'Requests / min', value: (14200 + tick * 7).toLocaleString(), change: '↑ 8.3%' },
    { label: 'Cost vs AWS', value: '−68%', change: 'Hosting savings' },
  ]

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <div style={styles.title}>AI Infrastructure Dashboard</div>
          <div style={styles.subtitle}>Real-time metrics — hosted on Varity</div>
        </div>
        <div style={styles.badge}>● LIVE</div>
      </div>

      <div style={styles.grid}>
        {metrics.map(m => (
          <div key={m.label} style={styles.card}>
            <div style={styles.metricLabel}>{m.label}</div>
            <div style={styles.metricValue}>{m.value}</div>
            <div style={styles.metricChange}>{m.change}</div>
          </div>
        ))}
      </div>

      <div style={styles.row}>
        <div style={styles.chartCard}>
          <div style={styles.chartTitle}>API Latency — Live (2s window)</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={latency}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="t" stroke="#64748b" tick={{ fontSize: 10 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 10 }} unit="ms" />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', color: '#f1f5f9' }} />
              <Line type="monotone" dataKey="p50" stroke="#3b82f6" dot={false} strokeWidth={2} />
              <Line type="monotone" dataKey="p99" stroke="#f59e0b" dot={false} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={styles.chartCard}>
          <div style={styles.chartTitle}>Weekly Request Volume</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={throughput}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', color: '#f1f5f9' }} />
              <Bar dataKey="requests" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="errors" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={styles.chartCard}>
        <div style={styles.chartTitle}>Model Hosting Scenarios — Status</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
          {[
            { name: 'SaaS Starter', status: '✅ Live', url: 'Next.js + Auth' },
            { name: 'CrewAI Agent', status: '✅ Live', url: 'Python + LLM' },
            { name: 'Express API', status: '✅ Live', url: 'Node + Postgres' },
            { name: 'React Dashboard', status: '✅ Live', url: 'Static + CDN' },
            { name: 'FastAPI + pgvector', status: '✅ Live', url: 'Python + ML' },
          ].map(s => (
            <div key={s.name} style={{ background: '#0f172a', borderRadius: '8px', padding: '12px', border: '1px solid #334155' }}>
              <div style={{ fontSize: '12px', fontWeight: '600', color: '#f1f5f9' }}>{s.name}</div>
              <div style={{ fontSize: '11px', color: '#10b981', marginTop: '4px' }}>{s.status}</div>
              <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>{s.url}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
