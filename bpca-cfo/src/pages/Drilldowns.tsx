import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';
import {
  Search, SlidersHorizontal, ArrowUpDown, Filter, Eye,
  Download, Layers, AlertTriangle, TrendingUp, BookOpen,
} from 'lucide-react';
import KPICard from '../components/shared/KPICard';
import StatusBadge from '../components/shared/StatusBadge';
import ChartTooltip from '../components/shared/ChartTooltip';
import { formatIndianCurrency, cn } from '../utils/format';

type FilterType = 'All' | 'Exceptions' | 'Negative' | 'Material' | 'Normal';
type SortField = 'balance' | 'materiality' | 'name';

interface LedgerRow {
  ledger: string;
  group: string;
  opening: number;
  closing: number;
  movement: number;
  status: string;
}

const groupChartData = [
  { group: 'Current Assets', opening: 28000000, closing: 34000000 },
  { group: 'Fixed Assets', opening: 42000000, closing: 45000000 },
  { group: 'Current Liabilities', opening: 18000000, closing: 21000000 },
  { group: 'Equity', opening: 52000000, closing: 58000000 },
  { group: 'Revenue', opening: 0, closing: 87000000 },
  { group: 'Expenses', opening: 0, closing: 69000000 },
];

const ledgerData: LedgerRow[] = [
  { ledger: 'Sundry Debtors', group: 'Current Assets', opening: 7200000, closing: 8400000, movement: 1200000, status: 'Review' },
  { ledger: 'HDFC Bank - Main', group: 'Bank Accounts', opening: 3800000, closing: 4680000, movement: 880000, status: 'Ready' },
  { ledger: 'Raw Materials', group: 'Inventory', opening: 1800000, closing: 2200000, movement: 400000, status: 'Ready' },
  { ledger: 'Machinery & Equipment', group: 'Fixed Assets', opening: 12000000, closing: 13500000, movement: 1500000, status: 'Ready' },
  { ledger: 'Sundry Creditors', group: 'Current Liabilities', opening: 3500000, closing: 4000000, movement: 500000, status: 'Review' },
  { ledger: 'ICICI Bank - CC', group: 'Bank Accounts', opening: 1200000, closing: 980000, movement: -220000, status: 'Exception' },
  { ledger: 'Share Capital', group: 'Equity', opening: 10000000, closing: 10000000, movement: 0, status: 'Ready' },
  { ledger: 'Reserves & Surplus', group: 'Equity', opening: 42000000, closing: 48000000, movement: 6000000, status: 'Ready' },
  { ledger: 'Sales - Domestic', group: 'Revenue', opening: 0, closing: 72000000, movement: 72000000, status: 'Ready' },
  { ledger: 'Sales - Export', group: 'Revenue', opening: 0, closing: 15000000, movement: 15000000, status: 'Ready' },
  { ledger: 'Salary & Wages', group: 'Expenses', opening: 0, closing: 28000000, movement: 28000000, status: 'Ready' },
  { ledger: 'Office Rent', group: 'Expenses', opening: 0, closing: 3600000, movement: 3600000, status: 'Ready' },
  { ledger: 'Vehicle Loan - SBI', group: 'Loans', opening: 850000, closing: 620000, movement: -230000, status: 'Ready' },
  { ledger: 'Depreciation', group: 'Expenses', opening: 0, closing: 4500000, movement: 4500000, status: 'Draft' },
  { ledger: 'Electricity & Utilities', group: 'Expenses', opening: 0, closing: 1800000, movement: 1800000, status: 'Ready' },
  { ledger: 'Petty Cash', group: 'Cash', opening: 50000, closing: 32000, movement: -18000, status: 'Exception' },
  { ledger: 'Input GST Receivable', group: 'Current Assets', opening: 420000, closing: 580000, movement: 160000, status: 'Review' },
  { ledger: 'Output GST Payable', group: 'Current Liabilities', opening: 380000, closing: 510000, movement: 130000, status: 'Review' },
  { ledger: 'Finished Goods', group: 'Inventory', opening: 1400000, closing: 1650000, movement: 250000, status: 'Ready' },
  { ledger: 'Furniture & Fixtures', group: 'Fixed Assets', opening: 2800000, closing: 2650000, movement: -150000, status: 'Ready' },
  { ledger: 'TDS Receivable', group: 'Current Assets', opening: 180000, closing: 240000, movement: 60000, status: 'Pending' },
  { ledger: 'Professional Fees', group: 'Expenses', opening: 0, closing: 960000, movement: 960000, status: 'Ready' },
  { ledger: 'Advance to Suppliers', group: 'Current Assets', opening: 320000, closing: 150000, movement: -170000, status: 'Exception' },
  { ledger: 'Interest on FD', group: 'Revenue', opening: 0, closing: 280000, movement: 280000, status: 'Ready' },
  { ledger: 'Goodwill', group: 'Fixed Assets', opening: 4500000, closing: 4500000, movement: 0, status: 'Draft' },
];

const formatRupees = (v: number) => {
  const abs = Math.abs(v);
  if (abs >= 10000000) return `₹${(v / 10000000).toFixed(2)} Cr`;
  if (abs >= 100000) return `₹${(v / 100000).toFixed(2)} L`;
  return `₹${v.toLocaleString('en-IN')}`;
};

const filterButtons: FilterType[] = ['All', 'Exceptions', 'Negative', 'Material', 'Normal'];

const Drilldowns: React.FC = () => {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');
  const [materialityThreshold, setMaterialityThreshold] = useState(100000);
  const [sortField, setSortField] = useState<SortField>('balance');

  const filteredData = useMemo(() => {
    let data = [...ledgerData];

    if (search) {
      const q = search.toLowerCase();
      data = data.filter(
        (r) => r.ledger.toLowerCase().includes(q) || r.group.toLowerCase().includes(q)
      );
    }

    switch (activeFilter) {
      case 'Exceptions':
        data = data.filter((r) => r.status === 'Exception' || r.status === 'Review');
        break;
      case 'Negative':
        data = data.filter((r) => r.movement < 0);
        break;
      case 'Material':
        data = data.filter((r) => Math.abs(r.closing) >= materialityThreshold);
        break;
      case 'Normal':
        data = data.filter((r) => r.status === 'Ready');
        break;
    }

    switch (sortField) {
      case 'balance':
        data.sort((a, b) => Math.abs(b.closing) - Math.abs(a.closing));
        break;
      case 'materiality':
        data.sort((a, b) => Math.abs(b.movement) - Math.abs(a.movement));
        break;
      case 'name':
        data.sort((a, b) => a.ledger.localeCompare(b.ledger));
        break;
    }

    return data;
  }, [search, activeFilter, materialityThreshold, sortField]);

  const handleExportCSV = () => {
    const headers = ['Ledger', 'Group', 'Opening', 'Closing', 'Movement', 'Status'];
    const rows = filteredData.map((r) => [
      r.ledger, r.group, r.opening, r.closing, r.movement, r.status,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ledger_drilldown.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="section-title flex items-center gap-3">
            <BookOpen className="text-teal" size={24} />
            Drilldowns — Ledger Explorer
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Deep-dive ledger analysis with filtering, grouping, and exception tracking
          </p>
        </div>
        <button onClick={handleExportCSV} className="btn-secondary flex items-center gap-2">
          <Download size={14} />
          Export CSV
        </button>
      </motion.div>

      {/* Summary Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPICard
          title="Filtered Ledgers"
          value={filteredData.length.toString()}
          icon={Layers}
          subtitle="Active ledger accounts"
        />
        <KPICard
          title="Largest Ledger"
          value="₹84L"
          icon={TrendingUp}
          subtitle="Sundry Debtors"
          changeType="positive"
          change="+16.7%"
        />
        <KPICard
          title="Net Movement"
          value="₹1.2 Cr"
          icon={ArrowUpDown}
          subtitle="Total net change"
          changeType="positive"
          change="+14.2%"
        />
        <KPICard
          title="Exceptions"
          value="12"
          icon={AlertTriangle}
          subtitle="Require attention"
          changeType="negative"
          change="+3"
        />
      </div>

      <div className="flex gap-6">
        {/* Left Filter Panel */}
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="glass-card p-5 space-y-6 w-[260px] flex-shrink-0 h-fit sticky top-4"
        >
          <div>
            <label className="text-xs text-gray-400 uppercase tracking-wider mb-2 block">
              Search Ledger
            </label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Ledger or group name..."
                className="input-field w-full pl-9"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Filter size={12} />
              Filter By
            </label>
            <div className="flex flex-wrap gap-2">
              {filterButtons.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200',
                    activeFilter === f
                      ? 'bg-teal/20 text-teal border border-teal/40'
                      : 'bg-surface-light text-gray-400 border border-surface-border hover:text-white'
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-400 uppercase tracking-wider mb-2 block">
              Materiality Threshold
            </label>
            <input
              type="range"
              min={0}
              max={1000000}
              step={10000}
              value={materialityThreshold}
              onChange={(e) => setMaterialityThreshold(Number(e.target.value))}
              className="w-full accent-teal h-1.5 bg-surface-light rounded-full appearance-none cursor-pointer"
            />
            <div className="flex justify-between mt-1.5">
              <span className="text-xs text-gray-500">₹0</span>
              <span className="text-xs text-teal font-mono">
                {formatIndianCurrency(materialityThreshold)}
              </span>
              <span className="text-xs text-gray-500">₹10L</span>
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <SlidersHorizontal size={12} />
              Sort By
            </label>
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value as SortField)}
              className="input-field w-full"
            >
              <option value="balance">Balance (High → Low)</option>
              <option value="materiality">Materiality (Movement)</option>
              <option value="name">Name (A → Z)</option>
            </select>
          </div>

          <div className="pt-2 border-t border-surface-border/30">
            <p className="text-xs text-gray-500">
              Showing <span className="text-teal font-mono">{filteredData.length}</span> of {ledgerData.length} ledgers
            </p>
          </div>
        </motion.aside>

        {/* Main Content */}
        <div className="flex-1 space-y-6 min-w-0">
          {/* Group Opening vs Closing Bar Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6"
          >
            <h2 className="section-title text-base mb-4">Group: Opening vs Closing</h2>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={groupChartData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a2040" vertical={false} />
                <XAxis
                  dataKey="group"
                  tick={{ fill: '#9ca3af', fontSize: 11 }}
                  axisLine={{ stroke: '#2a3155' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#9ca3af', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${(v / 10000000).toFixed(1)} Cr`}
                />
                <Tooltip content={<ChartTooltip formatter={(v) => formatRupees(v)} />} />
                <Legend
                  wrapperStyle={{ fontSize: 12, color: '#9ca3af' }}
                  iconType="circle"
                  iconSize={8}
                />
                <Bar dataKey="opening" name="Opening" fill="#C9A84C" radius={[4, 4, 0, 0]} />
                <Bar dataKey="closing" name="Closing" fill="#00D4B4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Ledger Drilldown Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-surface-border/30 flex items-center justify-between">
              <h2 className="section-title text-base">Ledger Drilldown</h2>
              <span className="text-xs text-gray-500 font-mono">
                {filteredData.length} records
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="table-header">Ledger</th>
                    <th className="table-header">Group</th>
                    <th className="table-header text-right">Opening (₹)</th>
                    <th className="table-header text-right">Closing (₹)</th>
                    <th className="table-header text-right">Movement (₹)</th>
                    <th className="table-header text-center">Status</th>
                    <th className="table-header text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((row, i) => (
                    <motion.tr
                      key={row.ledger}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.02 }}
                      className="table-row"
                    >
                      <td className="table-cell font-medium text-white">{row.ledger}</td>
                      <td className="table-cell text-gray-400">{row.group}</td>
                      <td className="table-cell text-right font-mono">
                        {row.opening.toLocaleString('en-IN')}
                      </td>
                      <td className="table-cell text-right font-mono">
                        {row.closing.toLocaleString('en-IN')}
                      </td>
                      <td className={cn(
                        'table-cell text-right font-mono',
                        row.movement > 0 ? 'text-teal' : row.movement < 0 ? 'text-red-400' : 'text-gray-400'
                      )}>
                        {row.movement > 0 ? '+' : ''}{row.movement.toLocaleString('en-IN')}
                      </td>
                      <td className="table-cell text-center">
                        <StatusBadge status={row.status} size="sm" />
                      </td>
                      <td className="table-cell text-center">
                        <button className="inline-flex items-center gap-1.5 text-xs text-teal hover:text-teal-300 transition-colors">
                          <Eye size={13} />
                          View
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Drilldowns;
