import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Search,
  RefreshCw,
  Save,
  CheckCircle2,
  Clock,
  FileBarChart,
  TrendingUp,
  Database,
  ShieldCheck,
  AlertTriangle,
  MessageSquare,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import StatusBadge from '../components/shared/StatusBadge';
import AIInsightBanner from '../components/shared/AIInsightBanner';
import PeriodSelector from '../components/shared/PeriodSelector';
import { cn, formatIndianCurrency } from '../utils/format';

/* ------------------------------------------------------------------ */
/*  DEMO DATA                                                         */
/* ------------------------------------------------------------------ */

const varianceData = [
  { lineItem: 'Revenue', actual: 87000000, plan: 82000000, lastMonth: 78000000, variance: 5000000, varPct: '+6.1%', owner: 'CFO', status: 'Ready', comment: 'Strong collections in Q2' },
  { lineItem: 'Gross Margin', actual: 36500000, plan: 34400000, lastMonth: 32800000, variance: 2100000, varPct: '+6.1%', owner: 'CFO', status: 'Ready', comment: 'Mix improvement' },
  { lineItem: 'Operating Expense', actual: 18500000, plan: 19000000, lastMonth: 18200000, variance: -500000, varPct: '-2.6%', owner: 'COO', status: 'Review', comment: 'Underspend on marketing' },
  { lineItem: 'EBITDA', actual: 18000000, plan: 15400000, lastMonth: 14600000, variance: 2600000, varPct: '+16.9%', owner: 'CFO', status: 'Ready', comment: 'Operating leverage' },
  { lineItem: 'Cash Balance', actual: 5000000, plan: 4500000, lastMonth: 4600000, variance: 500000, varPct: '+11.1%', owner: 'Treasury', status: 'Ready', comment: 'Collections ahead of plan' },
  { lineItem: 'Depreciation', actual: 2400000, plan: 2500000, lastMonth: 2350000, variance: -100000, varPct: '-4.0%', owner: 'CFO', status: 'Ready', comment: 'In line with asset schedule' },
  { lineItem: 'Employee Cost', actual: 12000000, plan: 11500000, lastMonth: 11200000, variance: 500000, varPct: '+4.3%', owner: 'CHRO', status: 'Review', comment: 'New hires in tech team' },
  { lineItem: 'Finance Cost', actual: 1800000, plan: 2000000, lastMonth: 1900000, variance: -200000, varPct: '-10.0%', owner: 'CFO', status: 'Ready', comment: 'Lower utilisation of OD' },
];


const chartData = [
  { name: 'Revenue', Actual: 87000000, Plan: 82000000 },
  { name: 'Gross Margin', Actual: 36500000, Plan: 34400000 },
  { name: 'OpEx', Actual: 18500000, Plan: 19000000 },
  { name: 'EBITDA', Actual: 18000000, Plan: 15400000 },
  { name: 'Cash Balance', Actual: 5000000, Plan: 4500000 },
];

const checklistItems = [
  { task: 'Revenue Recognition', owner: 'CFO', status: 'Ready' },
  { task: 'Cost Allocation', owner: 'COO', status: 'Ready' },
  { task: 'Intercompany Elimination', owner: 'CFO', status: 'Ready' },
  { task: 'Variance Analysis', owner: 'FP&A Lead', status: 'Review' },
  { task: 'Final Sign-off', owner: 'CFO', status: 'Ready' },
];

const defaultCommentary = `Revenue exceeded plan by ₹50L driven by strong Q2 collections and higher-margin product mix. EBITDA margin expanded to 21% vs 18.8% plan, reflecting operating leverage. OpEx underspend of ₹5L primarily from deferred marketing campaign. Cash position improved to ₹50L, ahead of ₹45L target.`;

/* ------------------------------------------------------------------ */
/*  ANIMATION VARIANTS                                                */
/* ------------------------------------------------------------------ */

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const fadeUp: import('framer-motion').Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

/* ------------------------------------------------------------------ */
/*  CUSTOM TOOLTIP                                                    */
/* ------------------------------------------------------------------ */

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card p-3 border border-surface-border/60 text-xs space-y-1">
      <p className="text-white font-medium mb-1">{label}</p>
      {payload.map((entry: any) => (
        <div key={entry.name} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-gray-400">{entry.name}:</span>
          <span className="font-mono text-white">{formatIndianCurrency(entry.value)}</span>
        </div>
      ))}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  MIS PACK PAGE                                                     */
/* ------------------------------------------------------------------ */

const MISPack: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'current' | 'prior' | 'ytd'>('current');
  const [searchQuery, setSearchQuery] = useState('');
  const [commentary, setCommentary] = useState(defaultCommentary);
  const [period, setPeriod] = useState('YTD');
  const [rows, setRows] = useState(varianceData);
  const [editingComment, setEditingComment] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRow, setNewRow] = useState({ lineItem: '', actual: '', plan: '', owner: '', comment: '' });

  const tabs = [
    { id: 'current' as const, label: 'Current Month' },
    { id: 'prior' as const, label: 'Prior Month' },
    { id: 'ytd' as const, label: 'YTD' },
  ];

  const filteredVariance = rows.filter((row) =>
    row.lineItem.toLowerCase().includes(searchQuery.toLowerCase()) ||
    row.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
    row.comment.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCommentSave = (idx: number, newComment: string) => {
    setRows(prev => prev.map((r, i) => i === idx ? { ...r, comment: newComment } : r));
    setEditingComment(null);
  };

  const handleAddRow = () => {
    if (!newRow.lineItem.trim()) return;
    const actual = Number(newRow.actual) || 0;
    const plan = Number(newRow.plan) || 0;
    const variance = actual - plan;
    const varPct = plan ? `${variance >= 0 ? '+' : ''}${((variance / plan) * 100).toFixed(1)}%` : '0%';
    setRows(prev => [...prev, {
      lineItem: newRow.lineItem,
      actual,
      plan,
      lastMonth: 0,
      variance,
      varPct,
      owner: newRow.owner || 'Unassigned',
      status: 'Review',
      comment: newRow.comment || '',
    }]);
    setNewRow({ lineItem: '', actual: '', plan: '', owner: '', comment: '' });
    setShowAddForm(false);
  };

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* ---- HEADER: METRICS + ACTIONS ---- */}
      <motion.div variants={fadeUp}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-2">
          <h1 className="font-display text-2xl text-white tracking-wide">MIS Pack</h1>
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search MIS fields…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-9 w-56"
              />
            </div>
            <button className="btn-secondary flex items-center gap-2">
              <RefreshCw size={14} />
              Sync
            </button>
            <button className="btn-primary flex items-center gap-2">
              <Save size={14} />
              Save
            </button>
          </div>
        </div>

        {/* KPI Strip */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="glass-card p-4">
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck size={14} className="text-teal" />
              <p className="text-xs text-gray-400 uppercase tracking-wider">Report Quality</p>
            </div>
            <p className="font-mono text-2xl font-bold text-teal">96%</p>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center gap-2 mb-1">
              <Database size={14} className="text-blue-400" />
              <p className="text-xs text-gray-400 uppercase tracking-wider">Source Rows</p>
            </div>
            <p className="font-mono text-2xl font-bold text-white">15,230</p>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp size={14} className="text-gold" />
              <p className="text-xs text-gray-400 uppercase tracking-wider">Material Variance</p>
            </div>
            <p className="font-mono text-2xl font-bold text-gold">₹1.3 Cr</p>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 size={14} className="text-teal" />
              <p className="text-xs text-gray-400 uppercase tracking-wider">Close Controls</p>
            </div>
            <p className="font-mono text-2xl font-bold text-white">5/5</p>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center gap-2 mb-1">
              <Clock size={14} className="text-gray-400" />
              <p className="text-xs text-gray-400 uppercase tracking-wider">Last Sync</p>
            </div>
            <p className="text-sm font-medium text-white mt-1">Today, 4:15 PM</p>
          </div>
        </div>
      </motion.div>

      {/* ---- AI INSIGHT BANNER ---- */}
      <AIInsightBanner
        insights={[
          "EBITDA margin held at 21% despite a ₹11L opex increase — cost discipline is intact. Cash balance variance of -₹50L vs plan is the primary close risk this month.",
          "Revenue exceeded plan by ₹50L driven by strong Q2 collections and higher-margin product mix. Gross margin improvement of 60bps signals positive mix shift.",
          "Recommend accelerating marketing spend to capture seasonal demand — the ₹5L underspend may represent a missed opportunity in the current growth phase."
        ]}
      />

      {/* ---- TAB NAVIGATION ---- */}
      <motion.div variants={fadeUp}>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-navy-50/50 rounded-lg p-1 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'px-4 py-2 rounded-md text-sm font-medium transition-all duration-200',
                activeTab === tab.id
                  ? 'bg-teal/15 text-teal border border-teal/30'
                  : 'text-gray-400 hover:text-white hover:bg-surface-light'
              )}
            >
              {tab.label}
            </button>
          ))}
          </div>
          <PeriodSelector activePeriod={period} onPeriodChange={setPeriod} />
        </div>
      </motion.div>

      {/* ---- VARIANCE TABLE (EDITABLE) ---- */}
      <motion.div variants={fadeUp} className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="section-title flex items-center gap-2">
            <FileBarChart size={20} className="text-teal" />
            MIS Variance Register
          </h2>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="btn-primary text-xs flex items-center gap-1.5"
          >
            {showAddForm ? 'Cancel' : '+ Add Line Item'}
          </button>
        </div>

        {/* Add row form */}
        {showAddForm && (
          <div className="glass-card p-4 flex flex-wrap items-end gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase text-gray-400 font-medium">Line Item *</label>
              <input
                value={newRow.lineItem}
                onChange={(e) => setNewRow(p => ({ ...p, lineItem: e.target.value }))}
                className="input-field w-40 text-sm"
                placeholder="e.g. Marketing"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase text-gray-400 font-medium">Actual (₹)</label>
              <input
                type="number"
                value={newRow.actual}
                onChange={(e) => setNewRow(p => ({ ...p, actual: e.target.value }))}
                className="input-field w-32 text-sm"
                placeholder="0"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase text-gray-400 font-medium">Plan (₹)</label>
              <input
                type="number"
                value={newRow.plan}
                onChange={(e) => setNewRow(p => ({ ...p, plan: e.target.value }))}
                className="input-field w-32 text-sm"
                placeholder="0"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase text-gray-400 font-medium">Owner</label>
              <input
                value={newRow.owner}
                onChange={(e) => setNewRow(p => ({ ...p, owner: e.target.value }))}
                className="input-field w-28 text-sm"
                placeholder="CFO"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase text-gray-400 font-medium">Comment</label>
              <input
                value={newRow.comment}
                onChange={(e) => setNewRow(p => ({ ...p, comment: e.target.value }))}
                className="input-field w-48 text-sm"
                placeholder="Notes..."
              />
            </div>
            <button onClick={handleAddRow} className="btn-primary text-xs h-9">Add</button>
          </div>
        )}

        {/* Table */}
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  {['Line Item', 'Actual (₹)', 'Plan (₹)', 'Last Month (₹)', 'Variance (₹)', 'Var %', 'Owner', 'Status', 'Comment'].map(h => (
                    <th key={h} className="table-header">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredVariance.map((row, idx) => {
                  const originalIdx = rows.indexOf(row);
                  const favorable = row.variance >= 0;
                  return (
                    <tr key={idx} className="table-row">
                      <td className="table-cell text-sm font-medium text-white">{row.lineItem}</td>
                      <td className="table-cell font-mono text-sm text-white font-medium">{formatIndianCurrency(row.actual)}</td>
                      <td className="table-cell font-mono text-sm text-gray-400">{formatIndianCurrency(row.plan)}</td>
                      <td className="table-cell font-mono text-sm text-gray-400">{formatIndianCurrency(row.lastMonth)}</td>
                      <td className="table-cell">
                        <span className={cn('font-mono font-semibold', favorable ? 'text-teal' : 'text-red-400')}>
                          {favorable ? '+' : ''}{formatIndianCurrency(row.variance)}
                        </span>
                      </td>
                      <td className="table-cell">
                        <span className={cn('font-mono text-sm font-semibold', row.varPct.startsWith('+') ? 'text-teal' : 'text-red-400')}>
                          {row.varPct}
                        </span>
                      </td>
                      <td className="table-cell text-sm">{row.owner}</td>
                      <td className="table-cell"><StatusBadge status={row.status} /></td>
                      <td className="table-cell">
                        {editingComment === originalIdx ? (
                          <input
                            autoFocus
                            defaultValue={row.comment}
                            onBlur={(e) => handleCommentSave(originalIdx, e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleCommentSave(originalIdx, (e.target as HTMLInputElement).value);
                              if (e.key === 'Escape') setEditingComment(null);
                            }}
                            className="input-field text-xs w-full min-w-[120px]"
                          />
                        ) : (
                          <span
                            onClick={() => setEditingComment(originalIdx)}
                            className="text-xs text-gray-400 italic cursor-pointer hover:text-white transition-colors"
                            title="Click to edit"
                          >
                            {row.comment ? `"${row.comment}"` : '— click to add —'}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* ---- CHART + COMMENTARY ---- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart */}
        <motion.div variants={fadeUp} className="lg:col-span-2 glass-card p-6 space-y-4">
          <h3 className="section-title flex items-center gap-2">
            <BarChart3 size={18} className="text-teal" />
            Actual vs Plan
          </h3>
          <ResponsiveContainer width="100%" height={340}>
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              barGap={4}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2040" horizontal={false} />
              <XAxis
                type="number"
                tickFormatter={(val) => formatIndianCurrency(val)}
                tick={{ fill: '#9ca3af', fontSize: 11 }}
                axisLine={{ stroke: '#2a3155' }}
              />
              <YAxis
                dataKey="name"
                type="category"
                tick={{ fill: '#e2e8f0', fontSize: 12 }}
                axisLine={{ stroke: '#2a3155' }}
                width={100}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,212,180,0.05)' }} />
              <Legend
                wrapperStyle={{ fontSize: '12px', color: '#9ca3af' }}
                iconType="circle"
              />
              <Bar dataKey="Actual" fill="#00D4B4" radius={[0, 4, 4, 0]} barSize={16} animationDuration={1200} />
              <Bar dataKey="Plan" fill="#C9A84C" radius={[0, 4, 4, 0]} barSize={16} animationDuration={1200} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Commentary */}
        <motion.div variants={fadeUp} className="glass-card p-6 space-y-4">
          <h3 className="section-title flex items-center gap-2">
            <MessageSquare size={18} className="text-gold" />
            MIS Commentary
          </h3>
          <textarea
            value={commentary}
            onChange={(e) => setCommentary(e.target.value)}
            rows={12}
            className="input-field w-full resize-none text-sm leading-relaxed"
          />
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{commentary.length} characters</span>
            <span className="text-teal">Auto-saved</span>
          </div>
        </motion.div>
      </div>

      {/* ---- MIS CLOSE CHECKLIST ---- */}
      <motion.div variants={fadeUp} className="glass-card p-6 space-y-4">
        <h3 className="section-title flex items-center gap-2">
          <CheckCircle2 size={18} className="text-teal" />
          MIS Close Checklist
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {checklistItems.map((item) => {
            const isReady = item.status.toLowerCase() === 'ready';
            return (
              <div
                key={item.task}
                className={cn(
                  'glass-card p-4 border-l-2 flex flex-col gap-2',
                  isReady ? 'border-l-teal' : 'border-l-amber-400'
                )}
              >
                <div className="flex items-center justify-between">
                  {isReady ? (
                    <CheckCircle2 size={18} className="text-teal" />
                  ) : (
                    <AlertTriangle size={18} className="text-amber-400" />
                  )}
                  <StatusBadge status={item.status} size="sm" />
                </div>
                <p className="text-sm font-medium text-white">{item.task}</p>
                <p className="text-xs text-gray-400">{item.owner}</p>
              </div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MISPack;
