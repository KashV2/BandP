import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell,
} from 'recharts';
import {
  FileText, TrendingUp, Landmark, Wallet, ShieldCheck,
  CheckCircle2, Calendar, ChevronRight,
} from 'lucide-react';
import KPICard from '../components/shared/KPICard';
import StatusBadge from '../components/shared/StatusBadge';
import ChartTooltip from '../components/shared/ChartTooltip';
import AIInsightBanner from '../components/shared/AIInsightBanner';
import PeriodSelector from '../components/shared/PeriodSelector';
import { cn, formatIndianCurrency } from '../utils/format';

const statementTrendData = [
  { month: 'Oct', revenue: 68000000, grossProfit: 28000000, ebitda: 12000000 },
  { month: 'Nov', revenue: 71000000, grossProfit: 30000000, ebitda: 13000000 },
  { month: 'Dec', revenue: 74000000, grossProfit: 31000000, ebitda: 14000000 },
  { month: 'Jan', revenue: 78000000, grossProfit: 33000000, ebitda: 15000000 },
  { month: 'Feb', revenue: 82000000, grossProfit: 35000000, ebitda: 16000000 },
  { month: 'Mar', revenue: 87000000, grossProfit: 37000000, ebitda: 18000000 },
];

const financialPositionData = [
  { name: 'Assets', value: 79000000 },
  { name: 'Liabilities', value: 21000000 },
  { name: 'Equity', value: 58000000 },
  { name: 'Net WC', value: 4400000 },
];

const donutData = [
  { name: 'Fixed Assets', value: 48.2, color: '#C9A84C' },
  { name: 'Trade Receivables', value: 11.1, color: '#3b82f6' },
  { name: 'Borrowings', value: 10.6, color: '#f59e0b' },
  { name: 'Cash', value: 6.6, color: '#00D4B4' },
  { name: 'Inventory', value: 2.9, color: '#a855f7' },
  { name: 'Other', value: 20.6, color: '#6b7280' },
];

const tabs = [
  'Schedule III Balance Sheet',
  'P&L',
  'Cash Flow',
  'Trial Balance',
  'Schedule III Mapping',
  'AR/AP Ageing',
  'Analytical Ratios',
  'Notes to Accounts',
];

interface BSLine {
  label: string;
  current: number;
  previous: number;
  movement: number;
  note: number;
  indent: number;
  isHeader?: boolean;
  isTotal?: boolean;
}

const equityAndLiabilities: BSLine[] = [
  { label: "Shareholders' Funds", current: 0, previous: 0, movement: 0, note: 0, indent: 0, isHeader: true },
  { label: 'Share Capital', current: 10000000, previous: 10000000, movement: 0, note: 1, indent: 1 },
  { label: 'Reserves & Surplus', current: 48000000, previous: 42000000, movement: 6000000, note: 2, indent: 1 },
  { label: 'Non-Current Liabilities', current: 0, previous: 0, movement: 0, note: 0, indent: 0, isHeader: true },
  { label: 'Long-term Borrowings', current: 8000000, previous: 9500000, movement: -1500000, note: 3, indent: 1 },
  { label: 'Deferred Tax Liabilities', current: 1200000, previous: 1000000, movement: 200000, note: 4, indent: 1 },
  { label: 'Current Liabilities', current: 0, previous: 0, movement: 0, note: 0, indent: 0, isHeader: true },
  { label: 'Trade Payables', current: 4000000, previous: 3500000, movement: 500000, note: 5, indent: 1 },
  { label: 'Other Current Liabilities', current: 2800000, previous: 2500000, movement: 300000, note: 6, indent: 1 },
  { label: 'Short-term Provisions', current: 1800000, previous: 1500000, movement: 300000, note: 7, indent: 1 },
];

const assets: BSLine[] = [
  { label: 'Non-Current Assets', current: 0, previous: 0, movement: 0, note: 0, indent: 0, isHeader: true },
  { label: 'Fixed Assets (Tangible)', current: 32000000, previous: 30000000, movement: 2000000, note: 8, indent: 1 },
  { label: 'Fixed Assets (Intangible)', current: 4500000, previous: 4000000, movement: 500000, note: 9, indent: 1 },
  { label: 'Long-term Loans & Advances', current: 3500000, previous: 3000000, movement: 500000, note: 10, indent: 1 },
  { label: 'Current Assets', current: 0, previous: 0, movement: 0, note: 0, indent: 0, isHeader: true },
  { label: 'Inventories', current: 2200000, previous: 1800000, movement: 400000, note: 11, indent: 1 },
  { label: 'Trade Receivables', current: 8400000, previous: 7200000, movement: 1200000, note: 12, indent: 1 },
  { label: 'Cash & Bank', current: 5000000, previous: 4200000, movement: 800000, note: 13, indent: 1 },
  { label: 'Short-term Loans & Advances', current: 2200000, previous: 1800000, movement: 400000, note: 14, indent: 1 },
];

const totalEL = equityAndLiabilities.reduce((s, r) => s + (r.isHeader ? 0 : r.current), 0);
const totalAssets = assets.reduce((s, r) => s + (r.isHeader ? 0 : r.current), 0);
const isBalanced = totalEL === totalAssets;

const formatBSValue = (v: number) => v.toLocaleString('en-IN');

const getMovementStatus = (m: number): string => {
  if (m === 0) return 'Ready';
  if (Math.abs(m) >= 5000000) return 'Review';
  return 'Ready';
};

const BSRow: React.FC<{ line: BSLine; index: number }> = ({ line, index }) => {
  if (line.isHeader) {
    return (
      <motion.tr
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: index * 0.02 }}
      >
        <td
          colSpan={6}
          className="px-4 py-3 text-sm font-semibold text-gold border-t border-surface-border/30 bg-gold/5"
        >
          {line.label}
        </td>
      </motion.tr>
    );
  }

  return (
    <motion.tr
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.02 }}
      className="table-row"
    >
      <td className="table-cell text-gray-300" style={{ paddingLeft: `${line.indent * 24 + 16}px` }}>
        {line.label}
      </td>
      <td className="table-cell text-right font-mono text-white">
        {formatBSValue(line.current)}
      </td>
      <td className="table-cell text-right font-mono text-gray-400">
        {formatBSValue(line.previous)}
      </td>
      <td className={cn(
        'table-cell text-right font-mono',
        line.movement > 0 ? 'text-teal' : line.movement < 0 ? 'text-red-400' : 'text-gray-500'
      )}>
        {line.movement > 0 ? '+' : ''}{formatBSValue(line.movement)}
      </td>
      <td className="table-cell text-center">
        <StatusBadge status={getMovementStatus(line.movement)} size="sm" />
      </td>
      <td className="table-cell text-center text-xs text-gray-500 font-mono">
        Note {line.note}
      </td>
    </motion.tr>
  );
};

const FinancialStatements: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [period, setPeriod] = useState('YTD');

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="section-title flex items-center gap-3">
          <Landmark className="text-teal" size={24} />
          Financial Statements
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Statutory reporting — audit-ready, Companies Act 2013 compliant
        </p>
        <div className="mt-3">
          <PeriodSelector activePeriod={period} onPeriodChange={setPeriod} />
        </div>
      </motion.div>

      {/* Header Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <KPICard
          title="Revenue"
          value="₹8.7 Cr"
          icon={TrendingUp}
          change="+6.1%"
          changeType="positive"
          sparklineData={[68, 71, 74, 78, 82, 87]}
        />
        <KPICard
          title="Total Assets"
          value="₹7.9 Cr"
          icon={Landmark}
          change="+5.3%"
          changeType="positive"
        />
        <KPICard
          title="Net Working Capital"
          value="₹44L"
          icon={Wallet}
          change="+12.8%"
          changeType="positive"
        />
        <KPICard
          title="Statement Quality"
          value="94%"
          icon={ShieldCheck}
          change="+3%"
          changeType="positive"
          sparklineData={[86, 88, 90, 91, 93, 94]}
        />
        <KPICard
          title="Reports"
          value="6/8 ready"
          icon={CheckCircle2}
          subtitle="75% completion"
        />
        <KPICard
          title="As at"
          value="Mar 31, 2025"
          icon={Calendar}
          subtitle="Financial year end"
        />
      </div>

      {/* AI Insight Banner */}
      <AIInsightBanner
        insights={[
          "Balance sheet is well-capitalised with a debt-to-equity ratio of 0.14x — well below the 0.5x industry median. Total assets grew 10.5% YoY with strong working capital generation.",
          "Trade receivables at ₹84L represent 10.6% of total assets — within acceptable limits but trending upward. The ₹12L YoY increase warrants closer monitoring of debtor days.",
          "Schedule III classification is 94% complete. 6 of 8 statements are publication-ready. Recommend prioritising Cash Flow Statement and AR/AP Ageing completion for board submission."
        ]}
      />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Statement Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6"
        >
          <h2 className="section-title text-base mb-4">Statement Trend (6 Months)</h2>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={statementTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2040" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                axisLine={{ stroke: '#2a3155' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${(v / 10000000).toFixed(1)} Cr`}
              />
              <Tooltip content={<ChartTooltip formatter={(v) => formatIndianCurrency(v)} />} />
              <Legend wrapperStyle={{ fontSize: 12 }} iconType="circle" iconSize={8} />
              <Line
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke="#00D4B4"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#00D4B4', strokeWidth: 0 }}
              />
              <Line
                type="monotone"
                dataKey="grossProfit"
                name="Gross Profit"
                stroke="#C9A84C"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#C9A84C', strokeWidth: 0 }}
              />
              <Line
                type="monotone"
                dataKey="ebitda"
                name="EBITDA"
                stroke="#94a3b8"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 3, fill: '#94a3b8', strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Financial Position */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-card p-6"
        >
          <h2 className="section-title text-base mb-4">Financial Position</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={financialPositionData} barSize={48}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2040" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                axisLine={{ stroke: '#2a3155' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${(v / 10000000).toFixed(1)} Cr`}
              />
              <Tooltip content={<ChartTooltip formatter={(v) => formatIndianCurrency(v)} />} />
              <Bar dataKey="value" name="Amount" radius={[6, 6, 0, 0]}>
                <Cell fill="#00D4B4" />
                <Cell fill="#C9A84C" />
                <Cell fill="#6b7280" />
                <Cell fill="#94a3b8" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card overflow-hidden"
      >
        <div className="flex overflow-x-auto border-b border-surface-border/30">
          {tabs.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={cn(
                'px-5 py-3.5 text-sm font-medium whitespace-nowrap transition-all duration-200 border-b-2',
                activeTab === i
                  ? 'text-teal border-teal bg-teal/5'
                  : 'text-gray-400 border-transparent hover:text-white hover:bg-surface-light/30'
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 0 ? (
            <div className="space-y-6">
              {/* Schedule III Balance Sheet */}
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="font-display text-lg text-white">
                    Schedule III Balance Sheet
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    As per Companies Act, 2013 — As at March 31, 2025
                  </p>
                </div>
                <div className="text-xs text-gray-500 font-mono">
                  All amounts in ₹
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="table-header w-[35%]">Particulars</th>
                      <th className="table-header text-right w-[15%]">Current Year (₹)</th>
                      <th className="table-header text-right w-[15%]">Previous Year (₹)</th>
                      <th className="table-header text-right w-[15%]">Movement (₹)</th>
                      <th className="table-header text-center w-[10%]">Status</th>
                      <th className="table-header text-center w-[10%]">Note Ref</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* EQUITY AND LIABILITIES Section Header */}
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-3 text-sm font-bold text-white border-t-2 border-teal/30 bg-teal/5 uppercase tracking-wider"
                      >
                        EQUITY AND LIABILITIES
                      </td>
                    </tr>
                    {equityAndLiabilities.map((line, i) => (
                      <BSRow key={`el-${i}`} line={line} index={i} />
                    ))}
                    {/* E&L Total */}
                    <tr className="border-t-2 border-teal/30 bg-teal/5">
                      <td className="px-4 py-3 text-sm font-bold text-white uppercase">
                        Total Equity & Liabilities
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-teal text-sm">
                        {formatBSValue(totalEL)}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-gray-400 text-sm">
                        {formatBSValue(equityAndLiabilities.reduce((s, r) => s + (r.isHeader ? 0 : r.previous), 0))}
                      </td>
                      <td colSpan={3} />
                    </tr>

                    {/* Spacer */}
                    <tr><td colSpan={6} className="py-2" /></tr>

                    {/* ASSETS Section Header */}
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-3 text-sm font-bold text-white border-t-2 border-gold/30 bg-gold/5 uppercase tracking-wider"
                      >
                        ASSETS
                      </td>
                    </tr>
                    {assets.map((line, i) => (
                      <BSRow key={`a-${i}`} line={line} index={i + equityAndLiabilities.length} />
                    ))}
                    {/* Assets Total */}
                    <tr className="border-t-2 border-gold/30 bg-gold/5">
                      <td className="px-4 py-3 text-sm font-bold text-white uppercase">
                        Total Assets
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-gold text-sm">
                        {formatBSValue(totalAssets)}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-gray-400 text-sm">
                        {formatBSValue(assets.reduce((s, r) => s + (r.isHeader ? 0 : r.previous), 0))}
                      </td>
                      <td colSpan={3} />
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Balance Check Footer */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className={cn(
                  'flex items-center justify-center gap-3 p-4 rounded-xl border',
                  isBalanced
                    ? 'bg-teal/10 border-teal/30 text-teal'
                    : 'bg-red-500/10 border-red-500/30 text-red-400'
                )}
              >
                <CheckCircle2 size={18} />
                <span className="font-medium text-sm">
                  {isBalanced
                    ? 'Assets = Equity + Liabilities ✓ Balanced'
                    : 'Balance Sheet does not tally — review required'}
                </span>
                <span className="font-mono text-xs opacity-70">
                  (₹{formatBSValue(totalAssets)} = ₹{formatBSValue(totalEL)})
                </span>
              </motion.div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-surface-light flex items-center justify-center mb-4">
                <FileText size={28} className="text-gray-500" />
              </div>
              <h3 className="text-lg text-white font-medium mb-2">{tabs[activeTab]}</h3>
              <p className="text-sm text-gray-500 max-w-md">
                This statement is currently being prepared. Connect your Tally data source to auto-generate
                this report with Schedule III compliance.
              </p>
              <button className="btn-primary mt-6 flex items-center gap-2">
                Configure Data Source
                <ChevronRight size={14} />
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Balance Sheet Mix Donut */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="glass-card p-6"
      >
        <h2 className="section-title text-base mb-4">Balance Sheet Composition</h2>
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <ResponsiveContainer width="100%" height={300} className="max-w-[360px]">
            <PieChart>
              <Pie
                data={donutData}
                cx="50%"
                cy="50%"
                innerRadius={75}
                outerRadius={120}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {donutData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0];
                  return (
                    <div className="bg-surface/90 backdrop-blur-md border border-surface-border/60 rounded-lg px-3 py-2 shadow-xl">
                      <p className="text-sm text-white font-medium">{d.name}</p>
                      <p className="text-xs font-mono text-teal">{Number(d.value).toFixed(1)}%</p>
                    </div>
                  );
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 flex-1">
            {donutData.map((item) => (
              <div key={item.name} className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <div>
                  <p className="text-sm text-gray-300">{item.name}</p>
                  <p className="text-sm font-mono text-white">{item.value}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FinancialStatements;
