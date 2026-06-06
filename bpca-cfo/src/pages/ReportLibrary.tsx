import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';
import {
  FileText, CheckCircle, BarChart3, Zap, Clock, Send,
  ExternalLink, Download, Calendar, Users, Bell,
} from 'lucide-react';
import KPICard from '../components/shared/KPICard';
import StatusBadge from '../components/shared/StatusBadge';
import ChartTooltip from '../components/shared/ChartTooltip';
import AIInsightBanner from '../components/shared/AIInsightBanner';
import PeriodSelector from '../components/shared/PeriodSelector';
import { cn } from '../utils/format';

const automationTrendData = [
  { month: 'Jan', automated: 18, generated: 20 },
  { month: 'Feb', automated: 22, generated: 24 },
  { month: 'Mar', automated: 24, generated: 26 },
  { month: 'Apr', automated: 26, generated: 28 },
  { month: 'May', automated: 28, generated: 30 },
  { month: 'Jun', automated: 30, generated: 32 },
];

const coverageCategories = [
  { name: 'Board', count: 3, color: 'bg-teal/20 text-teal border-teal/30' },
  { name: 'MIS', count: 4, color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  { name: 'Treasury', count: 2, color: 'bg-gold/20 text-gold border-gold/30' },
  { name: 'Compliance', count: 5, color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  { name: 'Audit', count: 2, color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  { name: 'Financial Statements', count: 3, color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  { name: 'Operations', count: 4, color: 'bg-rose-500/20 text-rose-400 border-rose-500/30' },
];

interface ReportRow {
  name: string;
  cadence: string;
  owner: string;
  sources: string;
  status: string;
  quality: number;
  lastRun: string;
}

const reportData: ReportRow[] = [
  { name: 'Board MIS Pack', cadence: 'Monthly', owner: 'CFO', sources: 'Tally + Excel', status: 'Ready', quality: 98, lastRun: 'Jun 1' },
  { name: 'Cash Flow Statement', cadence: 'Monthly', owner: 'Treasury', sources: 'Tally', status: 'Ready', quality: 95, lastRun: 'Jun 1' },
  { name: 'GST Returns Summary', cadence: 'Monthly', owner: 'Tax Lead', sources: 'Tally + GST Portal', status: 'Review', quality: 88, lastRun: 'May 31' },
  { name: 'Balance Sheet', cadence: 'Quarterly', owner: 'CFO', sources: 'Tally', status: 'Ready', quality: 96, lastRun: 'Jun 1' },
  { name: 'P&L Statement', cadence: 'Monthly', owner: 'CFO', sources: 'Tally', status: 'Ready', quality: 97, lastRun: 'Jun 1' },
  { name: 'AR Ageing Report', cadence: 'Weekly', owner: 'Collections', sources: 'Tally', status: 'Ready', quality: 94, lastRun: 'Jun 3' },
  { name: 'AP Ageing Report', cadence: 'Weekly', owner: 'Procurement', sources: 'Tally', status: 'Ready', quality: 92, lastRun: 'Jun 3' },
  { name: 'Bank Reconciliation', cadence: 'Monthly', owner: 'Treasury', sources: 'Tally + Bank', status: 'Review', quality: 85, lastRun: 'May 30' },
  { name: 'Inventory Valuation', cadence: 'Monthly', owner: 'Operations', sources: 'Tally', status: 'Draft', quality: 78, lastRun: 'May 28' },
  { name: 'Budget vs Actual', cadence: 'Monthly', owner: 'FP&A', sources: 'Excel', status: 'Ready', quality: 91, lastRun: 'Jun 1' },
  { name: 'Working Capital Report', cadence: 'Monthly', owner: 'CFO', sources: 'Tally', status: 'Ready', quality: 93, lastRun: 'Jun 2' },
  { name: 'Tax Provision Summary', cadence: 'Quarterly', owner: 'Tax Lead', sources: 'Tally', status: 'Queued', quality: 82, lastRun: 'May 15' },
];

const scheduledDispatches = [
  {
    name: 'Board MIS Pack',
    frequency: 'Monthly',
    schedule: '1st of month',
    recipients: 'Board Members',
    status: 'Scheduled',
    next: 'Jul 1',
  },
  {
    name: 'Cash Flow Forecast',
    frequency: 'Weekly',
    schedule: 'Every Monday',
    recipients: 'CFO + Treasury',
    status: 'Active',
    next: 'Jun 9',
  },
  {
    name: 'GST Summary',
    frequency: 'Monthly',
    schedule: '5th of month',
    recipients: 'Tax Team',
    status: 'Scheduled',
    next: 'Jul 5',
  },
  {
    name: 'Working Capital Dashboard',
    frequency: 'Bi-weekly',
    schedule: '1st & 15th',
    recipients: 'CFO + COO',
    status: 'Active',
    next: 'Jun 15',
  },
];

const getQualityColor = (q: number) => {
  if (q >= 95) return 'bg-teal';
  if (q >= 85) return 'bg-teal/70';
  if (q >= 75) return 'bg-gold';
  return 'bg-red-400';
};

const ReportLibrary: React.FC = () => {
  const [period, setPeriod] = useState('YTD');

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="section-title flex items-center gap-3">
          <FileText className="text-teal" size={24} />
          Report Library
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Report management hub — generation, scheduling, and quality tracking
        </p>
        <div className="mt-3">
          <PeriodSelector activePeriod={period} onPeriodChange={setPeriod} />
        </div>
      </motion.div>

      {/* AI Insight Banner */}
      <AIInsightBanner
        insights={[
          "Report automation rate has increased from 56% in January to 94% in June — a 38pp improvement. This has reduced the month-end close cycle by 2.5 days.",
          "8 of 12 reports are publication-ready with an average data quality score of 93%. The three reports below 90% quality are Inventory Valuation (78%), Tax Provision (82%), and Bank Reconciliation (85%).",
          "Recommend scheduling the Working Capital Dashboard for bi-weekly board distribution — it's the most accessed report but currently manual."
        ]}
      />

      {/* Header Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <KPICard
          title="Total Reports"
          value="12"
          icon={FileText}
          subtitle="In library"
          sparklineData={[8, 9, 10, 10, 11, 12]}
          changeType="positive"
        />
        <KPICard
          title="Ready to Publish"
          value="8"
          icon={CheckCircle}
          change="67%"
          changeType="positive"
          subtitle="Publication-ready"
        />
        <KPICard
          title="Data Quality"
          value="93%"
          icon={BarChart3}
          change="+2.1%"
          changeType="positive"
          subtitle="Avg across reports"
          sparklineData={[85, 87, 89, 91, 92, 93]}
        />
        <KPICard
          title="Automated Runs"
          value="30"
          icon={Zap}
          change="+7.1%"
          changeType="positive"
          subtitle="This month"
        />
        <KPICard
          title="Next Dispatch"
          value="Jun 6, 9 AM"
          icon={Clock}
          subtitle="Board MIS Pack"
        />
      </div>

      {/* Automation Trend Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6"
      >
        <h2 className="section-title text-base mb-4">Report Automation Trend</h2>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={automationTrendData}>
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
            />
            <Tooltip content={<ChartTooltip formatter={(v) => `${v} reports`} />} />
            <Legend
              wrapperStyle={{ fontSize: 12 }}
              iconType="circle"
              iconSize={8}
            />
            <Line
              type="monotone"
              dataKey="automated"
              name="Automated"
              stroke="#00D4B4"
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#00D4B4', strokeWidth: 0 }}
              activeDot={{ r: 6, fill: '#00D4B4' }}
            />
            <Line
              type="monotone"
              dataKey="generated"
              name="Generated"
              stroke="#C9A84C"
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#C9A84C', strokeWidth: 0 }}
              activeDot={{ r: 6, fill: '#C9A84C' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Report Coverage */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="glass-card p-6"
      >
        <h2 className="section-title text-base mb-4">Report Coverage</h2>
        <div className="flex flex-wrap gap-3">
          {coverageCategories.map((cat) => (
            <span
              key={cat.name}
              className={cn(
                'inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border',
                cat.color
              )}
            >
              {cat.name}
              <span className="bg-white/10 px-2 py-0.5 rounded-full text-xs font-mono">
                {cat.count}
              </span>
            </span>
          ))}
        </div>
      </motion.div>

      {/* Report Library Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-surface-border/30 flex items-center justify-between">
          <h2 className="section-title text-base">Report Library</h2>
          <span className="text-xs text-gray-500 font-mono">{reportData.length} reports</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-header">Report Name</th>
                <th className="table-header">Cadence</th>
                <th className="table-header">Owner</th>
                <th className="table-header">Source Systems</th>
                <th className="table-header text-center">Status</th>
                <th className="table-header text-center">Quality %</th>
                <th className="table-header">Last Run</th>
                <th className="table-header text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((row, i) => (
                <motion.tr
                  key={row.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="table-row"
                >
                  <td className="table-cell font-medium text-white">{row.name}</td>
                  <td className="table-cell text-gray-400">{row.cadence}</td>
                  <td className="table-cell text-gray-400">{row.owner}</td>
                  <td className="table-cell text-gray-400 text-xs">{row.sources}</td>
                  <td className="table-cell text-center">
                    <StatusBadge status={row.status} size="sm" />
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-surface-light rounded-full overflow-hidden">
                        <div
                          className={cn('h-full rounded-full transition-all', getQualityColor(row.quality))}
                          style={{ width: `${row.quality}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono text-gray-400 w-8 text-right">
                        {row.quality}%
                      </span>
                    </div>
                  </td>
                  <td className="table-cell text-gray-400 text-xs">{row.lastRun}</td>
                  <td className="table-cell text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button className="text-teal hover:text-teal-300 transition-colors" title="Open">
                        <ExternalLink size={14} />
                      </button>
                      <button className="text-gray-400 hover:text-white transition-colors" title="Export">
                        <Download size={14} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Scheduled Dispatches */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <h2 className="section-title text-base mb-4 flex items-center gap-2">
          <Send size={18} className="text-teal" />
          Scheduled Dispatches
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {scheduledDispatches.map((d, i) => (
            <motion.div
              key={d.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.05 }}
              className="glass-card-hover p-5 space-y-3"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-white">{d.name}</h3>
                <StatusBadge
                  status={d.status === 'Active' ? 'Ready' : d.status}
                  size="sm"
                />
              </div>
              <div className="space-y-2 text-xs text-gray-400">
                <div className="flex items-center gap-2">
                  <Calendar size={12} className="text-gray-500" />
                  <span>{d.frequency} — {d.schedule}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={12} className="text-gray-500" />
                  <span>{d.recipients}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bell size={12} className="text-teal" />
                  <span className="text-teal font-mono">Next: {d.next}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Source Readiness Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="glass-card p-4 flex items-center justify-between"
      >
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-teal animate-pulse" />
            <span className="text-sm text-gray-300">
              Available Ledgers: <span className="font-mono text-teal">847/847</span>
            </span>
          </div>
          <div className="w-px h-5 bg-surface-border" />
          <span className="text-sm text-gray-300">
            Largest Exposure: <span className="font-mono text-gold">₹84L</span>
          </span>
          <div className="w-px h-5 bg-surface-border" />
          <span className="text-sm text-gray-300">
            Publication-ready: <span className="font-mono text-teal">8/12</span>
          </span>
        </div>
        <CheckCircle size={16} className="text-teal" />
      </motion.div>
    </div>
  );
};

export default ReportLibrary;
