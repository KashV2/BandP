import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { Download } from 'lucide-react';
import KPICard from '../components/shared/KPICard';
import DataTable, { Column } from '../components/shared/DataTable';
import { cn } from '../utils/format';

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const fadeUp: import('framer-motion').Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const periods = ['YTD', 'Full Year', 'Q1', 'Q2', 'Q3', 'Q4'];

const aiInsights = [
  "Portfolio expense ratio at 54.3% is 4.6pp below the industry benchmark of 58.9%, indicating strong cost discipline across business lines.",
  "SaaS division leads at 42.1% — 16.8pp below benchmark. Hospitality at 71.2% requires immediate management attention as it exceeds the 70% action threshold.",
  "YTD improvement of 180bps driven by Manufacturing and Logistics optimisation. Recommend extending cost programs to Construction and Healthcare.",
];

const trendData = [
  { month: 'Jan', Manufacturing: 52.1, Retail: 58.2, SaaS: 44.5, Healthcare: 61.5, Construction: 63.8, Logistics: 55.8, Hospitality: 69.5, Financial: 57.2 },
  { month: 'Feb', Manufacturing: 51.8, Retail: 57.9, SaaS: 44.1, Healthcare: 61.2, Construction: 63.5, Logistics: 55.4, Hospitality: 69.8, Financial: 56.8 },
  { month: 'Mar', Manufacturing: 51.5, Retail: 57.5, SaaS: 43.6, Healthcare: 60.8, Construction: 63.1, Logistics: 55.0, Hospitality: 70.2, Financial: 56.5 },
  { month: 'Apr', Manufacturing: 51.2, Retail: 57.8, SaaS: 43.2, Healthcare: 60.5, Construction: 62.8, Logistics: 54.6, Hospitality: 70.5, Financial: 56.2 },
  { month: 'May', Manufacturing: 50.8, Retail: 57.2, SaaS: 42.8, Healthcare: 60.1, Construction: 62.4, Logistics: 54.2, Hospitality: 70.8, Financial: 55.8 },
  { month: 'Jun', Manufacturing: 50.4, Retail: 56.8, SaaS: 42.1, Healthcare: 59.7, Construction: 62.0, Logistics: 53.8, Hospitality: 71.2, Financial: 55.4 },
];

const lineColors: Record<string, string> = {
  Manufacturing: '#00D4B4',
  Retail: '#C9A84C',
  SaaS: '#60a5fa',
  Healthcare: '#a78bfa',
  Construction: '#f97316',
  Logistics: '#ec4899',
  Hospitality: '#ef4444',
  Financial: '#94a3b8',
};

interface BusinessLineRow {
  rank: number;
  businessLine: string;
  revenue: string;
  opex: string;
  expenseRatio: number;
  priorRatio: number;
  change: number;
  sparkline: number[];
}

const tableData: BusinessLineRow[] = [
  { rank: 1, businessLine: 'SaaS', revenue: '₹1.0 Cr', opex: '₹42.1 L', expenseRatio: 42.1, priorRatio: 44.3, change: -2.2, sparkline: [44.5, 44.1, 43.6, 43.2, 42.8, 42.1] },
  { rank: 2, businessLine: 'Manufacturing', revenue: '₹1.5 Cr', opex: '₹75.6 L', expenseRatio: 50.4, priorRatio: 52.2, change: -1.8, sparkline: [52.1, 51.8, 51.5, 51.2, 50.8, 50.4] },
  { rank: 3, businessLine: 'Logistics', revenue: '₹0.7 Cr', opex: '₹37.7 L', expenseRatio: 53.8, priorRatio: 55.8, change: -2.0, sparkline: [55.8, 55.4, 55.0, 54.6, 54.2, 53.8] },
  { rank: 4, businessLine: 'Financial', revenue: '₹0.5 Cr', opex: '₹27.7 L', expenseRatio: 55.4, priorRatio: 57.2, change: -1.8, sparkline: [57.2, 56.8, 56.5, 56.2, 55.8, 55.4] },
  { rank: 5, businessLine: 'Retail', revenue: '₹1.2 Cr', opex: '₹68.2 L', expenseRatio: 56.8, priorRatio: 58.2, change: -1.4, sparkline: [58.2, 57.9, 57.5, 57.8, 57.2, 56.8] },
  { rank: 6, businessLine: 'Healthcare', revenue: '₹0.9 Cr', opex: '₹53.7 L', expenseRatio: 59.7, priorRatio: 61.5, change: -1.8, sparkline: [61.5, 61.2, 60.8, 60.5, 60.1, 59.7] },
  { rank: 7, businessLine: 'Construction', revenue: '₹0.8 Cr', opex: '₹49.6 L', expenseRatio: 62.0, priorRatio: 63.8, change: -1.8, sparkline: [63.8, 63.5, 63.1, 62.8, 62.4, 62.0] },
  { rank: 8, businessLine: 'Hospitality', revenue: '₹0.6 Cr', opex: '₹42.7 L', expenseRatio: 71.2, priorRatio: 70.3, change: 0.9, sparkline: [69.5, 69.8, 70.2, 70.5, 70.8, 71.2] },
];

function getRatioBadge(ratio: number) {
  if (ratio < 50) return <span className="badge-ready">Excellent</span>;
  if (ratio < 60) return <span className="badge-approved">On Target</span>;
  if (ratio < 70) return <span className="badge-review">Watch</span>;
  return <span className="badge-high-risk">Action Needed</span>;
}

function MiniSparkline({ data, improving }: { data: number[]; improving: boolean }) {
  const chartData = data.map((v, i) => ({ idx: i, val: v }));
  const color = improving ? '#00D4B4' : '#ef4444';
  return (
    <div style={{ width: 80, height: 30 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
          <defs>
            <linearGradient id={`mini-${data[0]}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.3} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="val"
            stroke={color}
            strokeWidth={1.5}
            fill={`url(#mini-${data[0]})`}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

const tableColumns: Column<BusinessLineRow>[] = [
  { key: 'rank', label: 'Rank' },
  { key: 'businessLine', label: 'Business Line', render: (val: string) => <span className="font-medium text-white">{val}</span> },
  { key: 'revenue', label: 'Revenue (₹)' },
  { key: 'opex', label: 'Operating Expense (₹)' },
  {
    key: 'expenseRatio',
    label: 'Expense Ratio %',
    render: (val: number) => (
      <div className="flex items-center gap-2">
        <span>{val.toFixed(1)}%</span>
        {getRatioBadge(val)}
      </div>
    ),
  },
  { key: 'priorRatio', label: 'Prior Period %', render: (val: number) => `${val.toFixed(1)}%` },
  {
    key: 'change',
    label: 'Change (pp)',
    render: (val: number) => (
      <span className={val <= 0 ? 'text-teal font-medium' : 'text-red-400 font-medium'}>
        {val > 0 ? '+' : ''}{val.toFixed(1)}pp
      </span>
    ),
  },
  {
    key: 'sparkline',
    label: 'Trend',
    render: (_val: number[], row: BusinessLineRow) => (
      <MiniSparkline data={row.sparkline} improving={row.change <= 0} />
    ),
  },
];

const bands = [
  { label: 'Excellent (<50%)', className: 'badge-ready' },
  { label: 'On Target (<60%)', className: 'badge-approved' },
  { label: 'Watch (<70%)', className: 'badge-review' },
  { label: 'Action Needed (≥70%)', className: 'badge-high-risk' },
];

const CostEfficiency: React.FC = () => {
  const [activePeriod, setActivePeriod] = useState('YTD');

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={fadeUp} className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="section-title">Cost Efficiency</h1>
        <div className="flex items-center gap-3">
          <div className="flex gap-1 p-1 rounded-lg bg-surface-dark/50 border border-surface-border/30">
            {periods.map((p) => (
              <button
                key={p}
                onClick={() => setActivePeriod(p)}
                className={cn(
                  'px-3 py-1.5 rounded-md text-xs font-medium transition-all',
                  activePeriod === p
                    ? 'bg-teal/20 text-teal shadow-sm'
                    : 'text-gray-400 hover:text-gray-200'
                )}
              >
                {p}
              </button>
            ))}
          </div>
          <button className="btn-secondary flex items-center gap-2 text-xs">
            <Download size={14} />
            Export PDF
          </button>
          <button className="btn-secondary flex items-center gap-2 text-xs">
            <Download size={14} />
            Export CSV
          </button>
        </div>
      </motion.div>

      {/* AI Insight Banner */}
      <motion.div variants={fadeUp} className="glass-card border-gold/30 border p-5">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-gold/10 mt-0.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-gold">
              <path d="M12 2L14.09 8.26L20 9.27L15.55 13.97L16.91 20L12 16.9L7.09 20L8.45 13.97L4 9.27L9.91 8.26L12 2Z" fill="currentColor" />
            </svg>
          </div>
          <div className="flex-1 space-y-2">
            <h3 className="text-sm font-semibold text-gold">AI Insights — Cost Efficiency</h3>
            <ul className="space-y-1.5">
              {aiInsights.map((insight, i) => (
                <li key={i} className="text-xs text-gray-300 leading-relaxed flex items-start gap-2">
                  <span className="text-gold/60 mt-0.5">•</span>
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Portfolio Avg Expense Ratio"
          value="54.3%"
          change="-180bps"
          changeType="positive"
          subtitle="YTD improvement"
          sparklineData={[56.0, 55.6, 55.2, 54.8, 54.5, 54.3]}
        />
        <KPICard
          title="Best Performing"
          value="SaaS (42.1%)"
          change="-220bps"
          changeType="positive"
          subtitle="Lowest expense ratio"
          sparklineData={[44.5, 44.1, 43.6, 43.2, 42.8, 42.1]}
        />
        <KPICard
          title="Needs Attention"
          value="Hospitality (71.2%)"
          change="+90bps"
          changeType="negative"
          subtitle="Above action threshold"
          sparklineData={[69.5, 69.8, 70.2, 70.5, 70.8, 71.2]}
        />
        <KPICard
          title="vs Industry Benchmark"
          value="-4.6pp"
          change="below 58.9%"
          changeType="positive"
          subtitle="Below industry average"
          sparklineData={[5.2, 4.9, 4.8, 4.7, 4.6, 4.6]}
        />
      </motion.div>

      {/* Expense Ratio Trend Chart */}
      <motion.div variants={fadeUp} className="glass-card p-6">
        <h2 className="text-sm font-semibold text-white mb-4">Expense Ratio Trend by Business Line</h2>
        <div className="h-[380px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="month"
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                domain={[38, 75]}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 20, 30, 0.95)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                formatter={(value: any) => [`${Number(value).toFixed(1)}%`]}
                labelStyle={{ color: '#9ca3af' }}
              />
              <Legend
                wrapperStyle={{ fontSize: '11px', paddingTop: '12px' }}
              />
              <ReferenceLine
                y={58.9}
                stroke="#C9A84C"
                strokeDasharray="6 4"
                strokeWidth={2}
                label={{ value: 'Benchmark 58.9%', position: 'right', fill: '#C9A84C', fontSize: 11 }}
              />
              {Object.keys(lineColors).map((key) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={lineColors[key]}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 2 }}
                  animationDuration={1200}
                  animationEasing="ease-out"
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Business Line Ranking Table */}
      <motion.div variants={fadeUp}>
        <h2 className="text-sm font-semibold text-white mb-3">Business Line Ranking</h2>
        <DataTable
          columns={tableColumns}
          data={tableData}
          searchable
          exportable
          sortable
        />
      </motion.div>

      {/* Ratio Bands Legend */}
      <motion.div variants={fadeUp} className="glass-card p-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-gray-400 mr-2">Ratio Bands:</span>
          {bands.map((band) => (
            <span key={band.label} className={band.className}>
              {band.label}
            </span>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CostEfficiency;
