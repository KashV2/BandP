import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  TrendingUp,
  BookOpen,
  Layers,
  Search as SearchIcon,
  Receipt,
  Package,
  Wallet,
  CircleDollarSign,
  Lightbulb,
  AlertTriangle,
  Clock,
  Zap,
  ShieldCheck,
  Database,
  ArrowRight,
  Minus,
  Check,
  CalendarDays,
  User,
} from 'lucide-react';
import KPICard from '../components/shared/KPICard';
import RefreshBanner from '../components/shared/RefreshBanner';
import StatusBadge from '../components/shared/StatusBadge';
import { formatIndianCurrency, cn } from '../utils/format';

/* ------------------------------------------------------------------ */
/*  ANIMATION VARIANTS                                                */
/* ------------------------------------------------------------------ */

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const fadeUp: import('framer-motion').Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

/* ------------------------------------------------------------------ */
/*  DEMO DATA                                                         */
/* ------------------------------------------------------------------ */

const kpiData = [
  {
    title: 'Revenue',
    value: '₹8.7 Cr',
    change: '+12% YoY',
    changeType: 'positive' as const,
    subtitle: 'FY 2025-26',
    sparklineData: [5.2, 5.8, 6.1, 6.5, 7.2, 7.8, 8.2, 8.7],
  },
  {
    title: 'EBITDA',
    value: '₹1.8 Cr',
    change: '21% margin',
    changeType: 'positive' as const,
    subtitle: 'Operating Profit',
    sparklineData: [1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.8],
  },
  {
    title: 'Trade Receivable',
    value: '₹84 L',
    change: '35 DIO',
    changeType: 'neutral' as const,
    subtitle: 'Sundry Debtors',
    sparklineData: [92, 88, 85, 90, 87, 84, 86, 84],
  },
  {
    title: 'Trade Payable',
    value: '₹40 L',
    change: '17 DPO',
    changeType: 'neutral' as const,
    subtitle: 'Sundry Creditors',
    sparklineData: [35, 38, 42, 40, 39, 41, 40, 40],
  },
  {
    title: 'Bank Balance',
    value: '₹50 L',
    change: '+9% vs prior',
    changeType: 'positive' as const,
    subtitle: 'Cash & Bank',
    sparklineData: [42, 44, 45, 47, 48, 46, 49, 50],
  },
];

const noiTrendData = [
  { month: 'Oct', value: 1.1 },
  { month: 'Nov', value: 1.2 },
  { month: 'Dec', value: 1.3 },
  { month: 'Jan', value: 1.35 },
  { month: 'Feb', value: 1.5 },
  { month: 'Mar', value: 1.62 },
];

interface ActionItem {
  id: number;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  description: string;
  owner: string;
  due: string;
  dueStatus: 'overdue' | 'today' | 'future';
  cashImpact?: string;
}

const actionItems: ActionItem[] = [
  { id: 1, priority: 'CRITICAL', description: 'Collect ₹12.4L overdue from Zenith Exports (42 days past due)', owner: 'Collections', due: 'Today', dueStatus: 'today', cashImpact: '₹12.4L at risk' },
  { id: 2, priority: 'HIGH', description: 'Post depreciation journal entry for Q2 — ₹18L pending', owner: 'Rajesh Kumar', due: 'Today', dueStatus: 'today' },
  { id: 3, priority: 'HIGH', description: 'Reconcile HDFC bank account — 3 unmatched entries (₹2.1L)', owner: 'Anita Desai', due: 'Today', dueStatus: 'today', cashImpact: '₹2.1L variance' },
  { id: 4, priority: 'MEDIUM', description: 'Review and approve MIS variance commentary', owner: 'CFO', due: 'Tomorrow', dueStatus: 'future' },
  { id: 5, priority: 'MEDIUM', description: 'Follow up on GST 2B vs books reconciliation (₹2.4L mismatch)', owner: 'Vikram Patel', due: 'Jun 7', dueStatus: 'future', cashImpact: '₹2.4L mismatch' },
];

const receivablesData = [
  { customer: 'Zenith Exports Ltd', outstanding: 1240000, daysOverdue: 42, paymentScore: 62, importance: 'High', risk: 'High Risk' },
  { customer: 'Pinnacle Tech Solutions', outstanding: 870000, daysOverdue: 28, paymentScore: 78, importance: 'Critical', risk: 'Medium' },
  { customer: 'Greenfield Agro Industries', outstanding: 720000, daysOverdue: 15, paymentScore: 85, importance: 'High', risk: 'Low' },
  { customer: 'Metro Retail Chain', outstanding: 680000, daysOverdue: 35, paymentScore: 55, importance: 'Medium', risk: 'High Risk' },
  { customer: 'Apex Construction Co', outstanding: 590000, daysOverdue: 8, paymentScore: 92, importance: 'Medium', risk: 'Low' },
  { customer: 'Digital Services Hub', outstanding: 540000, daysOverdue: 22, paymentScore: 71, importance: 'Low', risk: 'Medium' },
  { customer: 'Sunrise Healthcare', outstanding: 480000, daysOverdue: 45, paymentScore: 48, importance: 'High', risk: 'High Risk' },
  { customer: 'Coastal Logistics', outstanding: 420000, daysOverdue: 12, paymentScore: 88, importance: 'Medium', risk: 'Low' },
  { customer: 'Heritage Hotels Group', outstanding: 380000, daysOverdue: 55, paymentScore: 35, importance: 'Low', risk: 'High Risk' },
  { customer: 'National Finance Corp', outstanding: 320000, daysOverdue: 5, paymentScore: 95, importance: 'Critical', risk: 'Low' },
];

const payablesData = [
  { vendor: 'Steel Corp India', outstanding: 820000, terms: 30, utilised: 15, discount: '2% if <15d', discountOpen: true },
  { vendor: 'Bharat Chemicals', outstanding: 650000, terms: 45, utilised: 22, discount: '1.5% if <20d', discountOpen: false },
  { vendor: 'Power Grid Supply', outstanding: 480000, terms: 30, utilised: 28, discount: '—', discountOpen: false },
  { vendor: 'IT Infra Solutions', outstanding: 420000, terms: 60, utilised: 18, discount: '2.5% if <30d', discountOpen: true },
  { vendor: 'Raw Materials Ltd', outstanding: 380000, terms: 30, utilised: 12, discount: '1% if <10d', discountOpen: false },
  { vendor: 'Logistics Partners', outstanding: 350000, terms: 45, utilised: 35, discount: '—', discountOpen: false },
  { vendor: 'Office Supplies Co', outstanding: 280000, terms: 30, utilised: 25, discount: '—', discountOpen: false },
  { vendor: 'Consulting Services', outstanding: 220000, terms: 60, utilised: 10, discount: '3% if <15d', discountOpen: true },
];

const healthTiles = [
  { icon: BookOpen, title: 'Ledgers', status: 'Configured', count: '847', color: 'text-teal' },
  { icon: Layers, title: 'Groups', status: 'Configured', count: '124', color: 'text-teal' },
  { icon: Receipt, title: 'Vouchers', status: 'Live', count: '15,230', color: 'text-green-400' },
  { icon: Package, title: 'Stock Items', status: 'Configured', count: '342', color: 'text-teal' },
  { icon: Wallet, title: 'Cash & Bank', status: 'Live', count: '₹50 L', color: 'text-green-400' },
  { icon: CircleDollarSign, title: 'Net Working Capital', status: 'Configured', count: '₹44 L', color: 'text-teal' },
];

const ledgerData = [
  { record: 'Sundry Debtors', group: 'Current Assets', opening: 7200000, closing: 8400000, movement: 1200000, source: 'Tally' },
  { record: 'Sundry Creditors', group: 'Current Liabilities', opening: 3500000, closing: 4000000, movement: 500000, source: 'Tally' },
  { record: 'Cash in Hand', group: 'Current Assets', opening: 250000, closing: 320000, movement: 70000, source: 'Tally' },
  { record: 'HDFC Bank - Main', group: 'Bank Accounts', opening: 3800000, closing: 4680000, movement: 880000, source: 'Tally' },
  { record: 'Raw Materials', group: 'Inventory', opening: 1800000, closing: 2200000, movement: 400000, source: 'Tally' },
  { record: 'Finished Goods', group: 'Inventory', opening: 1200000, closing: 1450000, movement: 250000, source: 'Tally' },
  { record: 'Sales Revenue', group: 'Income', opening: 0, closing: 87000000, movement: 87000000, source: 'Tally' },
  { record: 'ICICI Bank - OD', group: 'Bank Accounts', opening: 1200000, closing: 980000, movement: -220000, source: 'Tally' },
  { record: 'Employee Payables', group: 'Current Liabilities', opening: 420000, closing: 580000, movement: 160000, source: 'Tally' },
  { record: 'GST Input Credit', group: 'Duties & Taxes', opening: 310000, closing: 485000, movement: 175000, source: 'Tally' },
  { record: 'Electricity Expense', group: 'Indirect Expenses', opening: 0, closing: 380000, movement: 380000, source: 'Tally' },
  { record: 'Office Rent', group: 'Indirect Expenses', opening: 0, closing: 960000, movement: 960000, source: 'Tally' },
  { record: 'Professional Fees', group: 'Indirect Expenses', opening: 0, closing: 275000, movement: 275000, source: 'Tally' },
  { record: 'TDS Payable', group: 'Duties & Taxes', opening: 85000, closing: 142000, movement: 57000, source: 'Tally' },
  { record: 'Advance to Suppliers', group: 'Current Assets', opening: 520000, closing: 380000, movement: -140000, source: 'Tally' },
];


const aiInsights = [
  { id: 1, icon: TrendingUp, title: 'Revenue Acceleration', text: 'Revenue grew 12% YoY — fastest growth in 3 quarters. Collections cycle improved by 4 days.', color: 'text-teal' },
  { id: 2, icon: AlertTriangle, title: 'Working Capital Alert', text: 'Debtor days at 35 — above 30-day policy. ₹12L increase in receivables needs follow-up.', color: 'text-amber-400' },
  { id: 3, icon: ShieldCheck, title: 'EBITDA Margin Expansion', text: 'Margin expanded to 21% from 18.7% last quarter, driven by operating leverage and cost discipline.', color: 'text-teal' },
  { id: 4, icon: Zap, title: 'Cash Position Strong', text: 'Bank balance at ₹50L, up 9%. Sufficient runway for 4+ months of operating expenses.', color: 'text-teal' },
  { id: 5, icon: Database, title: 'Data Quality Score: 94%', text: '847 ledgers mapped. 3 ledgers flagged for missing group classification.', color: 'text-gold' },
];

const alerts = [
  { id: '1', type: 'warning' as const, title: 'GST 2B Mismatch', description: '₹2.4L input credit variance detected vs books.', timestamp: '12 min ago' },
  { id: '2', type: 'info' as const, title: 'Bank Recon Complete', description: 'HDFC Main account reconciled — zero variance.', timestamp: '28 min ago' },
  { id: '3', type: 'error' as const, title: 'Overdue Invoice', description: 'Invoice #INV-4872 — ₹3.8L overdue by 15 days.', timestamp: '1 hr ago' },
  { id: '4', type: 'success' as const, title: 'Month-End Task Done', description: 'Depreciation JE posted successfully by Rajesh.', timestamp: '2 hr ago' },
];

/* ------------------------------------------------------------------ */
/*  HELPER COMPONENTS                                                 */
/* ------------------------------------------------------------------ */

function NOIProgressRing({ percent }: { percent: number }) {
  const radius = 28;
  const stroke = 4;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative w-16 h-16 flex items-center justify-center">
      <svg width={64} height={64} className="-rotate-90">
        <circle cx={32} cy={32} r={radius} fill="none" stroke="#1a2040" strokeWidth={stroke} />
        <circle
          cx={32} cy={32} r={radius} fill="none"
          stroke="#C9A84C" strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000"
        />
      </svg>
      <span className="absolute text-xs font-mono font-semibold text-gold">
        {percent.toFixed(1)}%
      </span>
    </div>
  );
}

function PaymentScoreBar({ score }: { score: number }) {
  let color = 'bg-red-400';
  if (score >= 80) color = 'bg-teal';
  else if (score >= 60) color = 'bg-gold';
  else if (score >= 40) color = 'bg-amber-400';

  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 rounded-full bg-surface-light overflow-hidden">
        <div className={cn('h-full rounded-full transition-all duration-500', color)} style={{ width: `${score}%` }} />
      </div>
      <span className="text-xs font-mono text-gray-300">{score}</span>
    </div>
  );
}

function PriorityBadge({ priority }: { priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' }) {
  const styles = {
    CRITICAL: 'bg-red-500/15 text-red-400 border-red-500/30 animate-pulse-subtle',
    HIGH: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    MEDIUM: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  };
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wider border', styles[priority])}>
      {priority}
    </span>
  );
}

function ImportanceBadge({ importance }: { importance: string }) {
  const styles: Record<string, string> = {
    Critical: 'bg-red-500/15 text-red-400 border-red-500/30',
    High: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    Medium: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    Low: 'bg-gray-500/15 text-gray-400 border-gray-500/30',
  };
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border', styles[importance] || styles.Low)}>
      {importance}
    </span>
  );
}

function UtilisedCell({ utilised, terms }: { utilised: number; terms: number }) {
  const ratio = utilised / terms;
  let color = 'text-green-400';
  if (ratio > 0.8) color = 'text-red-400';
  else if (ratio >= 0.5) color = 'text-amber-400';

  return <span className={cn('font-mono text-sm', color)}>{utilised}d</span>;
}

/* ------------------------------------------------------------------ */
/*  LEDGER TABLE WITH DYNAMIC SUMMARY                                 */
/* ------------------------------------------------------------------ */

interface LedgerRow {
  record: string;
  group: string;
  opening: number;
  closing: number;
  movement: number;
  source: string;
}

function LedgerTable({ data }: { data: LedgerRow[] }) {
  const [search, setSearch] = useState('');

  const filtered = data.filter(row =>
    !search.trim() ||
    row.record.toLowerCase().includes(search.toLowerCase()) ||
    row.group.toLowerCase().includes(search.toLowerCase())
  );

  const totals = filtered.reduce(
    (acc, row) => ({
      opening: acc.opening + row.opening,
      closing: acc.closing + row.closing,
      movement: acc.movement + row.movement,
    }),
    { opening: 0, closing: 0, movement: 0 }
  );

  return (
    <div className="glass-card overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-surface-border/30">
        <div className="relative">
          <SearchIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Filter ledger..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9 w-64 text-sm"
          />
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="text-gray-400">Opening: <span className="font-mono font-semibold text-white">{formatIndianCurrency(totals.opening)}</span></span>
          <span className="text-gray-400">Closing: <span className="font-mono font-semibold text-white">{formatIndianCurrency(totals.closing)}</span></span>
          <span className={cn('text-gray-400', 'font-mono font-semibold', totals.movement >= 0 ? 'text-teal' : 'text-red-400')}>
            Movement: {totals.movement >= 0 ? '+' : ''}{formatIndianCurrency(totals.movement)}
          </span>
        </div>
      </div>
      <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
        <table className="w-full">
          <thead className="sticky top-0 z-10">
            <tr>
              {['Record', 'Group / Type', 'Opening (₹)', 'Closing (₹)', 'Movement (₹)', 'Source'].map(h => (
                <th key={h} className="table-header">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.record} className="table-row">
                <td className="table-cell text-sm">{row.record}</td>
                <td className="table-cell text-sm">{row.group}</td>
                <td className="table-cell font-mono text-sm text-gray-300">{formatIndianCurrency(row.opening)}</td>
                <td className="table-cell font-mono text-sm font-medium text-white">{formatIndianCurrency(row.closing)}</td>
                <td className="table-cell">
                  <span className={cn('font-mono text-sm font-medium', row.movement >= 0 ? 'text-teal' : 'text-red-400')}>
                    {row.movement >= 0 ? '+' : ''}{formatIndianCurrency(row.movement)}
                  </span>
                </td>
                <td className="table-cell">
                  <span className="inline-flex items-center gap-1.5 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse-subtle" />
                    {row.source}
                  </span>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="table-cell text-center text-gray-500 py-8">No records match filter</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="px-4 py-2 border-t border-surface-border/30 text-xs text-gray-500">
        Showing {filtered.length} of {data.length} records
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  OVERVIEW PAGE                                                     */
/* ------------------------------------------------------------------ */

const Overview: React.FC = () => {
  const [completedItems, setCompletedItems] = useState<Set<number>>(new Set());

  const toggleItem = (id: number) => {
    setCompletedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const todayStr = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* ---- TOP ROW: KPI STRIP + ALERTS ---- */}
      <motion.div variants={fadeUp}>
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
          {/* KPI Cards — take 3 columns, equal height grid */}
          <div className="xl:col-span-3 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {kpiData.map((kpi) => (
              <div key={kpi.title} className="h-full">
                <KPICard
                  title={kpi.title}
                  value={kpi.value}
                  change={kpi.change}
                  changeType={kpi.changeType}
                  subtitle={kpi.subtitle}
                  sparklineData={kpi.sparklineData}
                />
              </div>
            ))}
          </div>

          {/* Recent Alerts — top right */}
          <div className="xl:col-span-1 glass-card p-4 space-y-2 max-h-[280px] overflow-y-auto">
            <h3 className="section-title text-sm flex items-center gap-1.5 mb-1">
              <AlertTriangle size={14} className="text-amber-400" />
              Recent Alerts
            </h3>
            {alerts.map((alert) => {
              const colorMap: Record<string, string> = {
                warning: 'border-l-amber-400 bg-amber-400/5',
                info: 'border-l-blue-400 bg-blue-400/5',
                error: 'border-l-red-400 bg-red-400/5',
                success: 'border-l-teal bg-teal/5',
              };
              return (
                <div
                  key={alert.id}
                  className={cn('glass-card border-l-2 p-2.5', colorMap[alert.type])}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-white">{alert.title}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5 leading-snug">{alert.description}</p>
                    </div>
                    <span className="text-[9px] text-gray-500 whitespace-nowrap flex items-center gap-0.5 shrink-0">
                      <Clock size={8} />
                      {alert.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* ================================================================ */}
      {/* SECTION A: NET OPERATING INCOME (NOI)                            */}
      {/* ================================================================ */}
      <motion.div variants={fadeUp}>
        <div className="glass-card border-gold/30 p-6 relative overflow-hidden">
          {/* Subtle gold glow in the corner */}
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-start gap-6 relative z-10">
            {/* Left: Primary NOI value */}
            <div className="flex-1 space-y-4">
              <p className="text-xs uppercase tracking-widest text-gray-400">
                Net Operating Income (Revenue − Operating Expenses)
              </p>
              <div className="flex items-end gap-4">
                <span className="font-mono text-3xl font-bold text-gradient-gold">
                  ₹1.62 Cr
                </span>
                <span className="text-sm font-medium text-teal mb-1">+18.4% YoY</span>
              </div>

              {/* Breakdown flow */}
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <div className="bg-surface-light/80 border border-surface-border/50 rounded-lg px-3 py-2 text-center">
                  <p className="text-[10px] text-gray-500 uppercase">Revenue</p>
                  <p className="font-mono text-sm font-semibold text-white">₹8.7 Cr</p>
                </div>
                <Minus size={14} className="text-gray-500" />
                <div className="bg-surface-light/80 border border-surface-border/50 rounded-lg px-3 py-2 text-center">
                  <p className="text-[10px] text-gray-500 uppercase">Op. Expenses</p>
                  <p className="font-mono text-sm font-semibold text-white">₹6.9 Cr</p>
                </div>
                <Minus size={14} className="text-gray-500" />
                <div className="bg-surface-light/80 border border-surface-border/50 rounded-lg px-3 py-2 text-center">
                  <p className="text-[10px] text-gray-500 uppercase">Depreciation</p>
                  <p className="font-mono text-sm font-semibold text-white">₹18L</p>
                </div>
                <ArrowRight size={14} className="text-gold" />
                <div className="bg-gold/10 border border-gold/30 rounded-lg px-3 py-2 text-center">
                  <p className="text-[10px] text-gold/70 uppercase">NOI</p>
                  <p className="font-mono text-sm font-bold text-gold">₹1.62 Cr</p>
                </div>
              </div>
            </div>

            {/* Right: NOI Margin Ring + Trend */}
            <div className="flex items-center gap-6 shrink-0">
              <div className="text-center space-y-1">
                <NOIProgressRing percent={18.6} />
                <p className="text-[10px] text-gray-400 uppercase tracking-wide">NOI Margin</p>
              </div>

              <div className="w-44 h-20">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={noiTrendData}>
                    <defs>
                      <linearGradient id="noiGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#C9A84C" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#C9A84C" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" tick={{ fontSize: 9, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                    <YAxis hide domain={['dataMin - 0.1', 'dataMax + 0.1']} />
                    <Tooltip
                      contentStyle={{ background: '#111729', border: '1px solid #2a3155', borderRadius: 8, fontSize: 12 }}
                      labelStyle={{ color: '#9ca3af' }}
                      formatter={(v: any) => [`₹${v} Cr`, 'NOI']}
                    />
                    <Area type="monotone" dataKey="value" stroke="#C9A84C" strokeWidth={2} fill="url(#noiGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
                <p className="text-[10px] text-gray-500 text-center mt-0.5">6-Month NOI Trend</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ================================================================ */}
      {/* SECTION B: TOP ACTIONABLE ITEMS OF THE DAY                       */}
      {/* ================================================================ */}
      <motion.div variants={fadeUp}>
        <div className="glass-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-gold/10">
                <Zap size={16} className="text-gold" />
              </div>
              <h2 className="section-title text-lg">Top Actionable Items</h2>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <CalendarDays size={13} />
              {todayStr}
            </div>
          </div>

          <div className="space-y-2">
            {actionItems.map((item) => {
              const done = completedItems.has(item.id);
              return (
                <motion.div
                  key={item.id}
                  layout
                  className={cn(
                    'flex items-start gap-3 p-3 rounded-lg border transition-all duration-300',
                    done
                      ? 'bg-surface/30 border-surface-border/20 opacity-60'
                      : 'bg-surface-light/40 border-surface-border/40 hover:border-gold/20'
                  )}
                >
                  {/* Checkbox */}
                  <button
                    onClick={() => toggleItem(item.id)}
                    className={cn(
                      'mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all',
                      done
                        ? 'bg-teal border-teal'
                        : 'border-gray-600 hover:border-gray-400'
                    )}
                  >
                    {done && <Check size={12} className="text-navy" />}
                  </button>

                  {/* Content */}
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <PriorityBadge priority={item.priority} />
                      <span className={cn('text-sm text-gray-200 leading-snug', done && 'line-through text-gray-500')}>
                        {item.description}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
                      <span className="inline-flex items-center gap-1">
                        <User size={11} /> {item.owner}
                      </span>
                      <span className={cn(
                        'inline-flex items-center gap-1 font-medium',
                        item.dueStatus === 'overdue' && 'text-red-400',
                        item.dueStatus === 'today' && 'text-amber-400',
                        item.dueStatus === 'future' && 'text-gray-400'
                      )}>
                        <Clock size={11} /> {item.due}
                      </span>
                      {item.cashImpact && (
                        <span className="text-teal font-medium">{item.cashImpact}</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* ================================================================ */}
      {/* SECTION C: PAYABLES & RECEIVABLES SCOREBOARD                     */}
      {/* ================================================================ */}
      <motion.div variants={fadeUp}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT — Receivables Scoreboard */}
          <div className="glass-card p-5 space-y-4 overflow-hidden">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 rounded-lg bg-teal/10">
                <TrendingUp size={16} className="text-teal" />
              </div>
              <h2 className="section-title text-lg">Receivables Scoreboard</h2>
            </div>

            {/* Summary KPIs */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-surface-light/60 rounded-lg p-3 text-center">
                <p className="text-[10px] text-gray-500 uppercase">Total Receivable</p>
                <p className="font-mono text-lg font-semibold text-white">₹84L</p>
              </div>
              <div className="bg-surface-light/60 rounded-lg p-3 text-center">
                <p className="text-[10px] text-gray-500 uppercase">Avg DSO</p>
                <p className="font-mono text-lg font-semibold text-amber-400">35d <span className="text-xs text-gray-500">/ 30 target</span></p>
              </div>
              <div className="bg-surface-light/60 rounded-lg p-3 text-center">
                <p className="text-[10px] text-gray-500 uppercase">Overdue %</p>
                <p className="font-mono text-lg font-semibold text-red-400">38.2%</p>
              </div>
            </div>

            {/* Debtors table */}
            <div className="overflow-x-auto -mx-5 px-5">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr>
                    {['Customer', 'Outstanding', 'Overdue', 'Pay Score', 'Importance', 'Risk'].map((h) => (
                      <th key={h} className="table-header text-[10px]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {receivablesData.map((row) => (
                    <tr key={row.customer} className="table-row">
                      <td className="table-cell text-sm text-white font-medium whitespace-nowrap">{row.customer}</td>
                      <td className="table-cell font-mono text-sm">{formatIndianCurrency(row.outstanding)}</td>
                      <td className="table-cell">
                        <span className={cn(
                          'font-mono text-sm font-medium',
                          row.daysOverdue > 30 ? 'text-red-400' : row.daysOverdue > 15 ? 'text-amber-400' : 'text-gray-300'
                        )}>
                          {row.daysOverdue}d
                        </span>
                      </td>
                      <td className="table-cell"><PaymentScoreBar score={row.paymentScore} /></td>
                      <td className="table-cell"><ImportanceBadge importance={row.importance} /></td>
                      <td className="table-cell">
                        <StatusBadge status={row.risk} size="sm" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* RIGHT — Payables Overview */}
          <div className="glass-card p-5 space-y-4 overflow-hidden">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 rounded-lg bg-gold/10">
                <Receipt size={16} className="text-gold" />
              </div>
              <h2 className="section-title text-lg">Payables Overview</h2>
            </div>

            {/* Summary KPIs */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-surface-light/60 rounded-lg p-3 text-center">
                <p className="text-[10px] text-gray-500 uppercase">Total Payable</p>
                <p className="font-mono text-lg font-semibold text-white">₹40L</p>
              </div>
              <div className="bg-surface-light/60 rounded-lg p-3 text-center">
                <p className="text-[10px] text-gray-500 uppercase">Avg DPO</p>
                <p className="font-mono text-lg font-semibold text-teal">17d</p>
              </div>
              <div className="bg-surface-light/60 rounded-lg p-3 text-center">
                <p className="text-[10px] text-gray-500 uppercase">Early Pay Savings</p>
                <p className="font-mono text-lg font-semibold text-gold">₹0.8L</p>
              </div>
            </div>

            {/* Payables table */}
            <div className="overflow-x-auto -mx-5 px-5">
              <table className="w-full min-w-[560px]">
                <thead>
                  <tr>
                    {['Vendor', 'Outstanding', 'Terms', 'Utilised', 'Discount'].map((h) => (
                      <th key={h} className="table-header text-[10px]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {payablesData.map((row) => (
                    <tr key={row.vendor} className="table-row">
                      <td className="table-cell text-sm text-white font-medium whitespace-nowrap">{row.vendor}</td>
                      <td className="table-cell font-mono text-sm">{formatIndianCurrency(row.outstanding)}</td>
                      <td className="table-cell font-mono text-sm text-gray-300">{row.terms}d</td>
                      <td className="table-cell"><UtilisedCell utilised={row.utilised} terms={row.terms} /></td>
                      <td className="table-cell">
                        <span className="text-sm text-gray-300">
                          {row.discount}
                          {row.discountOpen && (
                            <span className="ml-1 text-teal font-bold">✓</span>
                          )}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ---- REFRESH BANNER ---- */}
      <motion.div variants={fadeUp}>
        <RefreshBanner
          lastSync="2 minutes ago"
          status="live"
          onRefresh={() => {}}
        />
      </motion.div>

      {/* ---- HEALTH TILES ---- */}
      <motion.div variants={fadeUp}>
        <h2 className="section-title mb-4">Data Source Health</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {healthTiles.map((tile) => {
            const Icon = tile.icon;
            return (
              <motion.div
                key={tile.title}
                whileHover={{ scale: 1.02 }}
                className="glass-card-hover p-4 flex flex-col gap-3"
              >
                <div className="flex items-center justify-between">
                  <Icon size={20} className={tile.color} />
                  <StatusBadge status={tile.status} size="sm" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">{tile.title}</p>
                  <p className="font-mono text-lg font-semibold text-white">{tile.count}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* ---- MAIN CONTENT GRID (2/3 + 1/3) ---- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT — LEDGER TABLE WITH DYNAMIC TOTALS */}
        <motion.div variants={fadeUp} className="lg:col-span-2 space-y-2">
          <h2 className="section-title">Live Ledger Feed</h2>
          <LedgerTable data={ledgerData} />
        </motion.div>

        {/* RIGHT — INSIGHTS + ALERTS */}
        <motion.div variants={fadeUp} className="space-y-6">
          {/* Quick Insights */}
          <div className="space-y-3">
            <h2 className="section-title flex items-center gap-2">
              <Lightbulb size={18} className="text-gold" />
              Quick Insights
            </h2>
            <div className="space-y-3">
              {aiInsights.map((insight) => {
                const Icon = insight.icon;
                return (
                  <motion.div
                    key={insight.id}
                    whileHover={{ x: 4 }}
                    className="glass-card p-4 cursor-pointer group"
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn('mt-0.5', insight.color)}>
                        <Icon size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white group-hover:text-teal transition-colors">
                          {insight.title}
                        </p>
                        <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                          {insight.text}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Overview;
