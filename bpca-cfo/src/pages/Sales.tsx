import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp,
  Percent,
  Target,
  FileWarning,
  Users,
  Clock,
  Layers,
  Package,
} from 'lucide-react';
import KPICard from '../components/shared/KPICard';
import AIInsightBanner from '../components/shared/AIInsightBanner';
import { formatIndianCurrency, cn } from '../utils/format';

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const fadeUp: import('framer-motion').Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const tabs = ['Overview', 'Revenue', 'Margin', 'Trend', 'Customers', 'Geography', 'Pipeline', 'Collections'] as const;

const revenueTrendData = [
  { month: 'Apr', current: 52, prior: 45 },
  { month: 'May', current: 55, prior: 48 },
  { month: 'Jun', current: 58, prior: 50 },
  { month: 'Jul', current: 54, prior: 47 },
  { month: 'Aug', current: 60, prior: 52 },
  { month: 'Sep', current: 62, prior: 54 },
  { month: 'Oct', current: 58, prior: 51 },
  { month: 'Nov', current: 64, prior: 56 },
  { month: 'Dec', current: 68, prior: 60 },
  { month: 'Jan', current: 72, prior: 63 },
  { month: 'Feb', current: 75, prior: 66 },
  { month: 'Mar', current: 82, prior: 72 },
];

const industryMixData = [
  { name: 'Manufacturing', value: 21, color: '#00D4B4' },
  { name: 'Retail', value: 17, color: '#C9A84C' },
  { name: 'SaaS', value: 14, color: '#60a5fa' },
  { name: 'Healthcare', value: 13, color: '#a78bfa' },
  { name: 'Construction', value: 11, color: '#f97316' },
  { name: 'Logistics', value: 10, color: '#ec4899' },
  { name: 'Hospitality', value: 8, color: '#34d399' },
  { name: 'Financial', value: 7, color: '#94a3b8' },
];

const pipelineData = [
  { stage: 'Prospecting', value: 25000000, deals: 45, color: '#3b82f6' },
  { stage: 'Qualified', value: 18000000, deals: 28, color: '#6366f1' },
  { stage: 'Proposal', value: 12000000, deals: 15, color: '#8b5cf6' },
  { stage: 'Negotiation', value: 8000000, deals: 8, color: '#06b6d4' },
  { stage: 'Closed Won', value: 6000000, deals: 5, color: '#00D4B4' },
];

const arAgeingData = [
  { bucket: '0-30 days', value: 12000000, color: '#00D4B4' },
  { bucket: '31-60 days', value: 8000000, color: '#C9A84C' },
  { bucket: '61-90 days', value: 6000000, color: '#f59e0b' },
  { bucket: '90+ days', value: 5000000, color: '#ef4444' },
];

const attainmentData = [
  { industry: 'Manufacturing', pct: 105 },
  { industry: 'Retail', pct: 98 },
  { industry: 'SaaS', pct: 112 },
  { industry: 'Healthcare', pct: 87 },
  { industry: 'Construction', pct: 94 },
  { industry: 'Logistics', pct: 102 },
  { industry: 'Hospitality', pct: 78 },
  { industry: 'Financial', pct: 91 },
];

const getBarColor = (pct: number) => {
  if (pct >= 100) return '#00D4B4';
  if (pct >= 80) return '#C9A84C';
  return '#ef4444';
};

const ChartTooltipContent = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card p-3 text-xs border border-surface-border">
      <p className="text-white font-medium mb-1">{label}</p>
      {payload.map((entry: any) => (
        <p key={entry.name} style={{ color: entry.color }}>
          {entry.name}: {typeof entry.value === 'number' && entry.value >= 100000
            ? formatIndianCurrency(entry.value)
            : `₹${entry.value}L`}
        </p>
      ))}
    </div>
  );
};

const PipelineTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  return (
    <div className="glass-card p-3 text-xs border border-surface-border">
      <p className="text-white font-medium mb-1">{data.stage}</p>
      <p className="text-teal">{formatIndianCurrency(data.value)}</p>
      <p className="text-gray-400">{data.deals} deals</p>
    </div>
  );
};

const PieTooltipContent = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card p-3 text-xs border border-surface-border">
      <p className="text-white font-medium">{payload[0].name}: {payload[0].value}%</p>
    </div>
  );
};

const Sales: React.FC = () => {
  const [activeTab, setActiveTab] = useState<typeof tabs[number]>('Overview');

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
      {/* 1. Tab Navigation */}
      <motion.div variants={fadeUp} className="flex gap-1 overflow-x-auto pb-1 scrollbar-thin">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200',
              activeTab === tab
                ? 'bg-teal/15 text-teal border border-teal/30'
                : 'text-gray-400 hover:text-white hover:bg-surface-light'
            )}
          >
            {tab}
          </button>
        ))}
      </motion.div>

      {/* AI Insight Banner */}
      <AIInsightBanner
        insights={[
          "Revenue growth of 13.6% YoY is outpacing industry median of 8.2%, driven primarily by SaaS (+22%) and Manufacturing (+18%) segments.",
          "Pipeline coverage at ₹6.9 Cr provides 97.5% attainment visibility. However, the Negotiation-to-Close conversion rate of 62.5% is below the 75% benchmark — recommend deal acceleration program.",
          "AR overdue at 42.2% is the primary cash flow risk. Top 3 overdue accounts (Zenith, Metro Retail, Sunrise Healthcare) represent ₹27L of the ₹31L outstanding."
        ]}
      />

      {activeTab !== 'Overview' ? (
        <motion.div variants={fadeUp} className="glass-card p-12 text-center">
          <p className="text-gray-400 text-lg">{activeTab} — detailed view coming soon</p>
          <p className="text-gray-500 text-sm mt-2">Switch to Overview for the full sales intelligence dashboard</p>
        </motion.div>
      ) : (
        <>
          {/* 2. KPI Cards — Row 1 */}
          <motion.div variants={fadeUp}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <KPICard title="Total Revenue" value="₹6.9 Cr" change="+13.6% YoY" changeType="positive" subtitle="FY 2025-26" icon={TrendingUp} sparklineData={[52, 55, 58, 54, 60, 62, 58, 64, 68, 72, 75, 82]} />
              <KPICard title="Gross Margin" value="42.7%" change="₹3.0 Cr" changeType="positive" subtitle="Above industry avg" icon={Percent} sparklineData={[40.1, 40.8, 41.2, 41.5, 42.0, 42.3, 42.5, 42.7]} />
              <KPICard title="Pipeline Coverage" value="₹6.9 Cr" change="97.5% attainment" changeType="positive" subtitle="Weighted pipeline" icon={Target} sparklineData={[5.2, 5.5, 5.8, 6.0, 6.3, 6.5, 6.7, 6.9]} />
              <KPICard title="AR Outstanding" value="₹3.1 Cr" change="42.2% overdue" changeType="negative" subtitle="Collections priority" icon={FileWarning} sparklineData={[2.8, 2.9, 3.0, 3.1, 3.1, 3.0, 3.1, 3.1]} />
            </div>
          </motion.div>

          {/* 2b. KPI Cards — Row 2 */}
          <motion.div variants={fadeUp}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <KPICard title="Top Customer Concentration" value="75.7%" change="Top 10 clients" changeType="neutral" subtitle="Risk threshold: 60%" icon={Users} />
              <KPICard title="Avg DSO" value="49 days" change="Target: 30d" changeType="negative" subtitle="Receivable cycle" icon={Clock} />
              <KPICard title="Industry Lines" value="8" change="1 under review" changeType="neutral" subtitle="Active verticals" icon={Layers} />
              <KPICard title="Avg Inventory Days" value="47 days" change="DIO benchmark" changeType="neutral" subtitle="Stock turnover" icon={Package} />
            </div>
          </motion.div>

          {/* 3. Revenue Trend + 4. Revenue Mix */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div variants={fadeUp} className="lg:col-span-2 glass-card p-6">
              <h2 className="section-title mb-6">Revenue Trend vs Prior Year</h2>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1a2040" />
                    <XAxis dataKey="month" tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} unit="L" />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend wrapperStyle={{ fontSize: 12, color: '#9ca3af' }} />
                    <Line type="monotone" dataKey="current" name="FY 2025-26" stroke="#00D4B4" strokeWidth={2.5} dot={{ r: 3, fill: '#00D4B4' }} activeDot={{ r: 5, stroke: '#00D4B4', strokeWidth: 2 }} animationDuration={1500} />
                    <Line type="monotone" dataKey="prior" name="FY 2024-25" stroke="#C9A84C" strokeWidth={2} strokeDasharray="6 3" dot={{ r: 2, fill: '#C9A84C' }} animationDuration={1800} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="glass-card p-6">
              <h2 className="section-title mb-4">Revenue Mix by Industry</h2>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={industryMixData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      dataKey="value"
                      nameKey="name"
                      stroke="none"
                      animationDuration={1200}
                    >
                      {industryMixData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<PieTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-2">
                {industryMixData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2 text-xs">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-gray-400 truncate">{item.name}</span>
                    <span className="font-mono text-white ml-auto">{item.value}%</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* 5. Pipeline Stages + 6. AR Ageing */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div variants={fadeUp} className="glass-card p-6">
              <h2 className="section-title mb-6">Pipeline Stages</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={pipelineData} layout="vertical" barSize={28}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1a2040" horizontal={false} />
                    <XAxis type="number" tickFormatter={(v) => formatIndianCurrency(v)} tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="stage" tick={{ fill: '#e2e8f0', fontSize: 12 }} axisLine={false} tickLine={false} width={90} />
                    <Tooltip content={<PipelineTooltip />} />
                    <Bar dataKey="value" name="Pipeline Value" radius={[0, 6, 6, 0]} animationDuration={1200}>
                      {pipelineData.map((entry) => (
                        <Cell key={entry.stage} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-3 mt-4">
                {pipelineData.map((p) => (
                  <div key={p.stage} className="flex items-center gap-1.5 text-xs text-gray-400">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                    {p.deals} deals
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="glass-card p-6">
              <h2 className="section-title mb-6">AR Ageing</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={arAgeingData} barSize={40}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1a2040" vertical={false} />
                    <XAxis dataKey="bucket" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tickFormatter={(v) => formatIndianCurrency(v)} tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      return (
                        <div className="glass-card p-3 text-xs border border-surface-border">
                          <p className="text-white font-medium">{payload[0].payload.bucket}</p>
                          <p style={{ color: payload[0].payload.color }}>{formatIndianCurrency(payload[0].value as number)}</p>
                        </div>
                      );
                    }} />
                    <Bar dataKey="value" name="Outstanding" radius={[6, 6, 0, 0]} animationDuration={1200}>
                      {arAgeingData.map((entry) => (
                        <Cell key={entry.bucket} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* 7. Target Attainment */}
          <motion.div variants={fadeUp} className="glass-card p-6">
            <h2 className="section-title mb-6">Target Attainment by Industry</h2>
            <div className="space-y-4">
              {attainmentData.map((item) => {
                const barColor = getBarColor(item.pct);
                const barWidth = Math.min(item.pct, 120);
                return (
                  <div key={item.industry} className="flex items-center gap-4">
                    <span className="text-sm text-gray-300 w-28 shrink-0">{item.industry}</span>
                    <div className="flex-1 h-6 bg-surface-light rounded-full overflow-hidden relative">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(barWidth / 120) * 100}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="h-full rounded-full relative"
                        style={{ backgroundColor: barColor }}
                      >
                        {item.pct >= 100 && (
                          <div className="absolute inset-0 bg-white/10 animate-pulse-subtle rounded-full" />
                        )}
                      </motion.div>
                      <div className="absolute left-[83.3%] top-0 h-full w-px bg-gray-500/50" />
                    </div>
                    <span className={cn('font-mono text-sm font-semibold w-14 text-right', item.pct >= 100 ? 'text-teal' : item.pct >= 80 ? 'text-gold' : 'text-red-400')}>
                      {item.pct}%
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-surface-border/30 text-xs text-gray-500">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-teal" /> ≥100% On Track</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-gold" /> 80–99% Watch</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-400" /> &lt;80% At Risk</span>
            </div>
          </motion.div>
        </>
      )}
    </motion.div>
  );
};

export default Sales;
