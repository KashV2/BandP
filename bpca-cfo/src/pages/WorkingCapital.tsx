import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import {
  Unlock,
  HeartPulse,
  Wallet,
  Timer,
  Save,
  RefreshCw,
  Brain,
  Database,
  FileSpreadsheet,
  Package,
  Receipt,
  Gauge,
  TrendingUp,
  Target,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import KPICard from '../components/shared/KPICard';
import DataTable from '../components/shared/DataTable';
import StatusBadge from '../components/shared/StatusBadge';
import AnimatedNumber from '../components/shared/AnimatedNumber';
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

type Preset = 'Balanced' | 'Collections' | 'Inventory' | 'Terms';

const presetValues: Record<Preset, { dso: number; dio: number; dpo: number }> = {
  Balanced: { dso: 10, dio: 5, dpo: 8 },
  Collections: { dso: 19, dio: 2, dpo: 3 },
  Inventory: { dso: 5, dio: 15, dpo: 3 },
  Terms: { dso: 3, dio: 2, dpo: 18 },
};

const cycleData = [
  { metric: 'DSO', current: 49, target: 30, label: 'Receivable Days' },
  { metric: 'DPO', current: 17, target: 42, label: 'Payable Days' },
  { metric: 'DIO', current: 35, target: 55, label: 'Inventory Days' },
  { metric: 'CCC', current: 78, target: 58, label: 'Cash Conversion' },
];

const agedExposureData = [
  { bucket: '0-30d', AR: 4500000, Inventory: 1200000, AP: 2500000 },
  { bucket: '31-60d', AR: 2200000, Inventory: 600000, AP: 1000000 },
  { bucket: '61-90d', AR: 1000000, Inventory: 300000, AP: 400000 },
  { bucket: '90+d', AR: 700000, Inventory: 100000, AP: 100000 },
];

const executionData = [
  { lever: 'Receivables Sprint', owner: 'Collections Lead', targetDays: '-10d', cashImpact: '₹1.4 Cr', status: 'In Progress', priority: 'High', dueDate: 'Jun 15', comment: 'Focus on top 20 debtors' },
  { lever: 'Inventory/WIP Release', owner: 'Operations Head', targetDays: '-5d', cashImpact: '₹0.6 Cr', status: 'Pending', priority: 'Medium', dueDate: 'Jun 20', comment: 'Slow-moving SKU review' },
  { lever: 'Vendor Term Reset', owner: 'Procurement Lead', targetDays: '+8d', cashImpact: '₹0.6 Cr', status: 'Draft', priority: 'Medium', dueDate: 'Jun 25', comment: 'Renegotiate with top 5 vendors' },
  { lever: 'Early Payment Discount', owner: 'Treasury', targetDays: '—', cashImpact: '₹0.2 Cr', status: 'Review', priority: 'Normal', dueDate: 'Jun 30', comment: '2% discount for early payment' },
];

const executionColumns = [
  { key: 'lever', label: 'Lever' },
  { key: 'owner', label: 'Owner' },
  { key: 'targetDays', label: 'Target Days' },
  { key: 'cashImpact', label: 'Cash Impact', render: (val: unknown) => <span className="font-mono text-teal font-medium">{String(val)}</span> },
  { key: 'status', label: 'Status', render: (val: unknown) => <StatusBadge status={String(val)} size="sm" /> },
  { key: 'priority', label: 'Priority', render: (val: unknown) => <StatusBadge status={String(val)} size="sm" /> },
  { key: 'dueDate', label: 'Due Date' },
  { key: 'comment', label: 'Comment', render: (val: unknown) => <span className="text-gray-400 text-xs">{String(val)}</span> },
];

const CycleTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card p-3 text-xs border border-surface-border">
      <p className="text-white font-medium mb-1">{label}</p>
      {payload.map((entry: any) => (
        <p key={entry.name} style={{ color: entry.color }}>
          {entry.name}: {entry.value} days
        </p>
      ))}
    </div>
  );
};

const AgedTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card p-3 text-xs border border-surface-border">
      <p className="text-white font-medium mb-1">{label}</p>
      {payload.map((entry: any) => (
        <p key={entry.name} style={{ color: entry.color }}>
          {entry.name}: {formatIndianCurrency(entry.value)}
        </p>
      ))}
    </div>
  );
};

const WorkingCapital: React.FC = () => {
  const [preset, setPreset] = useState<Preset>('Balanced');
  const [dsoReduction, setDsoReduction] = useState(10);
  const [dioReduction, setDioReduction] = useState(5);
  const [dpoExtension, setDpoExtension] = useState(8);

  const [targets, setTargets] = useState({
    dso: 30, dio: 55, dpo: 42, ccc: 58,
    materiality: 100000, concentration: 35,
  });

  const dsoImpact = useMemo(() => (dsoReduction / 365) * 87000000, [dsoReduction]);
  const dioImpact = useMemo(() => (dioReduction / 365) * 44000000, [dioReduction]);
  const dpoImpact = useMemo(() => (dpoExtension / 365) * 27000000, [dpoExtension]);
  const totalImpact = useMemo(() => dsoImpact + dioImpact + dpoImpact, [dsoImpact, dioImpact, dpoImpact]);

  const handlePreset = (p: Preset) => {
    setPreset(p);
    const v = presetValues[p];
    setDsoReduction(v.dso);
    setDioReduction(v.dio);
    setDpoExtension(v.dpo);
  };

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
      {/* 1. Header KPI Cards */}
      <motion.div variants={fadeUp}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Cash Unlock Potential"
            value="₹6.8 Cr"
            change="Actionable"
            changeType="positive"
            subtitle="Total recoverable from WC optimization"
            icon={Unlock}
            sparklineData={[4.2, 4.8, 5.1, 5.6, 6.0, 6.3, 6.5, 6.8]}
          />
          <KPICard
            title="Health Score"
            value="59%"
            change="Needs attention"
            changeType="negative"
            subtitle="Below 70% threshold"
            icon={HeartPulse}
          />
          <KPICard
            title="Net Working Capital"
            value="₹44 L"
            change="+8% QoQ"
            changeType="positive"
            subtitle="Current Assets − Current Liabilities"
            icon={Wallet}
            sparklineData={[38, 40, 41, 39, 42, 43, 44, 44]}
          />
          <KPICard
            title="Cash Conversion Cycle"
            value="78 days"
            change="Target: 58d"
            changeType="negative"
            subtitle="DSO + DIO − DPO"
            icon={Timer}
            sparklineData={[85, 82, 80, 79, 78, 78, 78, 78]}
          />
        </div>
      </motion.div>

      {/* AI Insight Banner */}
      <AIInsightBanner
        insights={[
          "DSO is 22 days above target; receivables sprint on top 5 overdue customers could release ₹5 Cr. Inventory/WIP blockage at 64 days is the second-largest cash drag.",
          "Your cash conversion cycle at 78 days is locking ₹6.8 Cr in working capital. The quickest wins are in receivables — targeting your top 20 debtors could unlock ₹1.4 Cr within 30 days.",
          "Vendor payment terms at 17 DPO are significantly below market standard of 42 days. Renegotiating with top 5 vendors could release an additional ₹0.6 Cr."
        ]}
      />

      {/* 2. What-if Preset Buttons */}
      <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
        {(['Balanced', 'Collections', 'Inventory', 'Terms'] as Preset[]).map((p) => (
          <button
            key={p}
            onClick={() => handlePreset(p)}
            className={preset === p ? 'btn-primary' : 'btn-secondary'}
          >
            {p}
          </button>
        ))}
      </motion.div>

      {/* 3. Cycle Cockpit + 4. Cash Release Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={fadeUp} className="glass-card p-6">
          <h2 className="section-title mb-6 flex items-center gap-2">
            <Gauge size={20} className="text-teal" />
            Cycle Cockpit
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cycleData} layout="vertical" barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a2040" horizontal={false} />
                <XAxis type="number" tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} unit="d" />
                <YAxis type="category" dataKey="metric" tick={{ fill: '#e2e8f0', fontSize: 13, fontFamily: 'IBM Plex Mono' }} axisLine={false} tickLine={false} width={50} />
                <Tooltip content={<CycleTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12, color: '#9ca3af' }} />
                <Bar dataKey="current" name="Current" fill="#00D4B4" radius={[0, 4, 4, 0]} animationDuration={1200} />
                <Bar dataKey="target" name="Target" fill="transparent" stroke="#C9A84C" strokeWidth={1.5} strokeDasharray="4 2" radius={[0, 4, 4, 0]} animationDuration={1400} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="glass-card p-6">
          <h2 className="section-title mb-6 flex items-center gap-2">
            <Zap size={20} className="text-gold" />
            Cash Release Simulator
          </h2>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">DSO Reduction</span>
                <span className="font-mono text-white">{dsoReduction}d → <span className="text-teal">{formatIndianCurrency(dsoImpact)}</span></span>
              </div>
              <input type="range" min={0} max={30} value={dsoReduction} onChange={(e) => setDsoReduction(Number(e.target.value))}
                className="w-full h-1.5 bg-surface-light rounded-full appearance-none cursor-pointer accent-teal" />
              <div className="flex justify-between text-xs text-gray-500 mt-1"><span>0d</span><span>30d</span></div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">DIO Reduction</span>
                <span className="font-mono text-white">{dioReduction}d → <span className="text-teal">{formatIndianCurrency(dioImpact)}</span></span>
              </div>
              <input type="range" min={0} max={20} value={dioReduction} onChange={(e) => setDioReduction(Number(e.target.value))}
                className="w-full h-1.5 bg-surface-light rounded-full appearance-none cursor-pointer accent-teal" />
              <div className="flex justify-between text-xs text-gray-500 mt-1"><span>0d</span><span>20d</span></div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">DPO Extension</span>
                <span className="font-mono text-white">{dpoExtension}d → <span className="text-teal">{formatIndianCurrency(dpoImpact)}</span></span>
              </div>
              <input type="range" min={0} max={20} value={dpoExtension} onChange={(e) => setDpoExtension(Number(e.target.value))}
                className="w-full h-1.5 bg-surface-light rounded-full appearance-none cursor-pointer accent-teal" />
              <div className="flex justify-between text-xs text-gray-500 mt-1"><span>0d</span><span>20d</span></div>
            </div>

            <div className="glass-card p-4 text-center bg-teal/5 border-teal/20">
              <p className="text-xs text-gray-400 mb-1">Total Projected Cash Impact</p>
              <AnimatedNumber
                value={totalImpact}
                prefix="₹"
                formatFn={(v) => formatIndianCurrency(v).replace('₹', '')}
                className="text-3xl font-semibold text-teal"
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* 5. Database Targets + 6. Analysis Fields */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={fadeUp} className="glass-card p-6">
          <h2 className="section-title mb-4 flex items-center gap-2">
            <Target size={20} className="text-teal" />
            Database Targets
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">DSO Target</label>
              <input type="number" value={targets.dso} onChange={(e) => setTargets({ ...targets, dso: Number(e.target.value) })} className="input-field w-full" />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">DIO Target</label>
              <input type="number" value={targets.dio} onChange={(e) => setTargets({ ...targets, dio: Number(e.target.value) })} className="input-field w-full" />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">DPO Target</label>
              <input type="number" value={targets.dpo} onChange={(e) => setTargets({ ...targets, dpo: Number(e.target.value) })} className="input-field w-full" />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">CCC Target</label>
              <input type="number" value={targets.ccc} onChange={(e) => setTargets({ ...targets, ccc: Number(e.target.value) })} className="input-field w-full" />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Materiality (₹)</label>
              <input type="number" value={targets.materiality} onChange={(e) => setTargets({ ...targets, materiality: Number(e.target.value) })} className="input-field w-full" />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Concentration Limit (%)</label>
              <input type="number" value={targets.concentration} onChange={(e) => setTargets({ ...targets, concentration: Number(e.target.value) })} className="input-field w-full" />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button className="btn-primary flex items-center gap-2"><Save size={14} /> Save Targets</button>
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="space-y-4">
          <h2 className="section-title flex items-center gap-2">
            <ShieldCheck size={20} className="text-teal" />
            Analysis Fields
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Liquidity Coverage', value: '42 days', color: 'text-teal' },
              { label: 'WC/Revenue %', value: '5.1%', color: 'text-gold' },
              { label: 'Top Ledger Share', value: '28.4%', color: 'text-amber-400' },
              { label: 'Action Readiness', value: '72%', color: 'text-teal' },
            ].map((field) => (
              <motion.div key={field.label} whileHover={{ scale: 1.02 }} className="glass-card-hover p-4">
                <p className="text-xs text-gray-400 mb-2">{field.label}</p>
                <p className={cn('font-mono text-xl font-semibold', field.color)}>{field.value}</p>
              </motion.div>
            ))}
          </div>

          {/* 7. Source Mix */}
          <div className="glass-card p-4">
            <p className="text-xs text-gray-400 mb-3 uppercase tracking-wider">Source Mix</p>
            <div className="flex gap-4">
              {[
                { label: 'Receivables', count: '847 rows', icon: FileSpreadsheet, color: 'text-teal' },
                { label: 'Inventory', count: '342 rows', icon: Package, color: 'text-gold' },
                { label: 'Payables', count: '215 rows', icon: Receipt, color: 'text-blue-400' },
              ].map((src) => (
                <div key={src.label} className="flex-1 flex items-center gap-2">
                  <src.icon size={16} className={src.color} />
                  <div>
                    <p className="text-xs text-gray-400">{src.label}</p>
                    <p className="font-mono text-sm text-white">{src.count}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* 8. Aged Exposure Signal */}
      <motion.div variants={fadeUp} className="glass-card p-6">
        <h2 className="section-title mb-6 flex items-center gap-2">
          <TrendingUp size={20} className="text-amber-400" />
          Aged Exposure Signal
        </h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={agedExposureData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2040" horizontal={false} />
              <XAxis type="number" tickFormatter={(v) => formatIndianCurrency(v)} tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="bucket" tick={{ fill: '#e2e8f0', fontSize: 12, fontFamily: 'IBM Plex Mono' }} axisLine={false} tickLine={false} width={60} />
              <Tooltip content={<AgedTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12, color: '#9ca3af' }} />
              <Bar dataKey="AR" name="Receivables" stackId="a" fill="#00D4B4" animationDuration={1200}>
                {agedExposureData.map((_, i) => (
                  <Cell key={i} fill={['#00D4B4', '#C9A84C', '#f59e0b', '#ef4444'][i]} />
                ))}
              </Bar>
              <Bar dataKey="Inventory" name="Inventory" stackId="b" fill="#C9A84C" animationDuration={1400}>
                {agedExposureData.map((_, i) => (
                  <Cell key={i} fill={['#00D4B4', '#C9A84C', '#f59e0b', '#ef4444'][i]} fillOpacity={0.6} />
                ))}
              </Bar>
              <Bar dataKey="AP" name="Payables" stackId="c" fill="#60a5fa" animationDuration={1600}>
                {agedExposureData.map((_, i) => (
                  <Cell key={i} fill={['#00D4B4', '#C9A84C', '#f59e0b', '#ef4444'][i]} fillOpacity={0.4} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* 9. Execution Register */}
      <motion.div variants={fadeUp} className="space-y-2">
        <h2 className="section-title flex items-center gap-2">
          <Database size={20} className="text-teal" />
          Execution Register
        </h2>
        <DataTable columns={executionColumns} data={executionData} searchable exportable sortable />
      </motion.div>

      {/* 10. AI WC Diagnosis */}
      <motion.div variants={fadeUp} className="glass-card p-6 border-l-2 border-l-teal">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-teal/10 shrink-0">
            <Brain size={24} className="text-teal" />
          </div>
          <div className="flex-1">
            <h2 className="section-title mb-3">AI Working Capital Diagnosis</h2>
            <p className="text-sm text-gray-300 leading-relaxed">
              Your cash conversion cycle at <span className="text-white font-medium">78 days</span> is{' '}
              <span className="text-red-400 font-medium">20 days above target</span>, locking up approximately{' '}
              <span className="text-teal font-mono font-medium">₹6.8 Cr</span> in working capital. The primary driver is
              extended receivables at <span className="text-white font-medium">49 DSO</span> — 19 days above the 30-day target.
              Recommend prioritising a receivables sprint targeting your top 20 debtors, which could unlock{' '}
              <span className="text-teal font-mono font-medium">₹1.4 Cr</span> within 30 days. Inventory days are well-managed
              at 35 DIO, but vendor payment terms at 17 DPO are significantly below market standard, suggesting room to
              negotiate extended terms.
            </p>
            <button className="btn-gold mt-4 flex items-center gap-2">
              <RefreshCw size={14} />
              Refresh Analysis
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default WorkingCapital;
