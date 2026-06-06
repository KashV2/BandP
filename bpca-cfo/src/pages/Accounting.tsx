import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Save,
  RotateCcw,
  Trash2,
  Download,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  CreditCard,
  ArrowDownLeft,
  ArrowUpRight,
  BarChart3,
  Calendar,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { cn, formatIndianCurrency } from '../utils/format';

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const fadeUp: import('framer-motion').Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const VOUCHER_TYPES = ['Payment', 'Receipt', 'Journal', 'Purchase', 'Sales', 'Contra', 'Credit Note', 'Debit Note'] as const;
type VoucherType = typeof VOUCHER_TYPES[number];

const PAYMENT_MODES = ['Cash', 'Bank Transfer', 'UPI', 'Cheque', 'NEFT/RTGS', 'Credit Card'] as const;
const COST_CENTERS = ['Head Office', 'Branch A', 'Branch B', 'Factory', 'Warehouse'] as const;

interface LedgerLine {
  id: number;
  account: string;
  debit: number;
  credit: number;
}

interface Voucher {
  id: string;
  type: VoucherType;
  date: string;
  reference: string;
  party: string;
  narration: string;
  amount: number;
  status: 'synced' | 'pending' | 'draft';
}

const Accounting: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'entry' | 'dashboard'>('entry');

  // Voucher entry state
  const [voucherType, setVoucherType] = useState<VoucherType>('Payment');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [reference, setReference] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [party, setParty] = useState('');
  const [paymentMode, setPaymentMode] = useState('');
  const [instrument, setInstrument] = useState('');
  const [costCenter, setCostCenter] = useState('');
  const [project, setProject] = useState('');
  const [narration, setNarration] = useState('');
  const [showDetails, setShowDetails] = useState(true);
  const [lines, setLines] = useState<LedgerLine[]>([
    { id: 1, account: '', debit: 0, credit: 0 },
    { id: 2, account: '', debit: 0, credit: 0 },
  ]);

  // Saved vouchers
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [dashboardPeriod, setDashboardPeriod] = useState<'today' | 'month' | 'all'>('month');

  const totalDebit = lines.reduce((sum, l) => sum + l.debit, 0);
  const totalCredit = lines.reduce((sum, l) => sum + l.credit, 0);
  const isBalanced = totalDebit > 0 && totalDebit === totalCredit;

  const readinessChecks = [
    { label: 'Type', done: true },
    { label: 'Date', done: !!date },
    { label: 'Ledger names', done: lines.some(l => l.account.trim() !== '') },
    { label: 'Balanced', done: isBalanced },
    { label: 'Context', done: !!narration || !!party },
  ];
  const readinessPercent = Math.round((readinessChecks.filter(c => c.done).length / readinessChecks.length) * 100);

  const addLine = () => {
    setLines(prev => [...prev, { id: Date.now(), account: '', debit: 0, credit: 0 }]);
  };

  const removeLine = (id: number) => {
    if (lines.length <= 2) return;
    setLines(prev => prev.filter(l => l.id !== id));
  };

  const updateLine = (id: number, field: keyof LedgerLine, value: string | number) => {
    setLines(prev => prev.map(l => l.id === id ? { ...l, [field]: value } : l));
  };

  const resetForm = () => {
    setVoucherType('Payment');
    setDate(new Date().toISOString().split('T')[0]);
    setReference('');
    setDueDate('');
    setParty('');
    setPaymentMode('');
    setInstrument('');
    setCostCenter('');
    setProject('');
    setNarration('');
    setLines([
      { id: 1, account: '', debit: 0, credit: 0 },
      { id: 2, account: '', debit: 0, credit: 0 },
    ]);
  };

  const saveVoucher = () => {
    if (!isBalanced) return;
    const newVoucher: Voucher = {
      id: `V-${Date.now()}`,
      type: voucherType,
      date,
      reference: reference || `AUTO-${vouchers.length + 1}`,
      party: party || 'General',
      narration,
      amount: totalDebit,
      status: 'synced',
    };
    setVouchers(prev => [newVoucher, ...prev]);
    resetForm();
  };

  // Dashboard calculations
  const filteredVouchers = useMemo(() => {
    const now = new Date();
    return vouchers.filter(v => {
      if (dashboardPeriod === 'all') return true;
      const vDate = new Date(v.date);
      if (dashboardPeriod === 'today') return vDate.toDateString() === now.toDateString();
      return vDate.getMonth() === now.getMonth() && vDate.getFullYear() === now.getFullYear();
    });
  }, [vouchers, dashboardPeriod]);

  const totalAmount = filteredVouchers.reduce((s, v) => s + v.amount, 0);
  const payments = filteredVouchers.filter(v => v.type === 'Payment');
  const receipts = filteredVouchers.filter(v => v.type === 'Receipt');

  const typeBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    filteredVouchers.forEach(v => { map[v.type] = (map[v.type] || 0) + v.amount; });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [filteredVouchers]);

  const last7Days = useMemo(() => {
    const days: { day: string; count: number; amount: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayStr = d.toLocaleDateString('en-IN', { weekday: 'short' });
      const dateStr = d.toISOString().split('T')[0];
      const dayVouchers = vouchers.filter(v => v.date === dateStr);
      days.push({ day: dayStr, count: dayVouchers.length, amount: dayVouchers.reduce((s, v) => s + v.amount, 0) });
    }
    return days;
  }, [vouchers]);

  const PIE_COLORS = ['#00D4B4', '#C9A84C', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#10b981', '#ec4899'];

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
      {/* Section tabs */}
      <motion.div variants={fadeUp} className="flex items-center gap-4">
        <h1 className="font-display text-2xl text-white tracking-wide">Accounting</h1>
        <div className="flex items-center gap-1 rounded-lg p-1 ml-4" style={{ background: 'var(--table-header-bg)' }}>
          <button
            onClick={() => setActiveSection('entry')}
            className={cn(
              'px-4 py-2 rounded-md text-sm font-medium transition-all',
              activeSection === 'entry' ? 'bg-teal/15 text-teal border border-teal/30' : 'text-gray-400 hover:text-white'
            )}
          >
            New Voucher
          </button>
          <button
            onClick={() => setActiveSection('dashboard')}
            className={cn(
              'px-4 py-2 rounded-md text-sm font-medium transition-all',
              activeSection === 'dashboard' ? 'bg-teal/15 text-teal border border-teal/30' : 'text-gray-400 hover:text-white'
            )}
          >
            Dashboard
          </button>
        </div>
      </motion.div>

      {activeSection === 'entry' && (
        <>
          {/* VOUCHER ENTRY SECTION */}
          <motion.div variants={fadeUp} className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main form — 3 cols */}
            <div className="lg:col-span-3 space-y-5">
              {/* Voucher Type selector */}
              <div className="glass-card p-5 space-y-4">
                <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Voucher Type</h2>
                <div className="flex flex-wrap gap-2">
                  {VOUCHER_TYPES.map(type => (
                    <button
                      key={type}
                      onClick={() => setVoucherType(type)}
                      className={cn(
                        'px-3 py-1.5 rounded-lg text-sm font-medium border transition-all',
                        voucherType === type
                          ? 'bg-teal/15 text-teal border-teal/40'
                          : 'text-gray-400 border-transparent hover:text-white hover:bg-surface-light'
                      )}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date & Reference */}
              <div className="glass-card p-5 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs uppercase text-gray-400 font-medium tracking-wider">Date</label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="input-field w-full"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs uppercase text-gray-400 font-medium tracking-wider">Reference No.</label>
                    <input
                      type="text"
                      value={reference}
                      onChange={(e) => setReference(e.target.value)}
                      placeholder="e.g. INV-001, CHQ-123"
                      className="input-field w-full"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs uppercase text-gray-400 font-medium tracking-wider">Due Date</label>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="input-field w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Voucher Details (collapsible) */}
              <div className="glass-card p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Voucher Details</h3>
                  <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="text-xs text-teal hover:text-teal-300 transition-colors"
                  >
                    {showDetails ? 'Hide' : 'Show'}
                  </button>
                </div>
                {showDetails && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs uppercase text-gray-400 font-medium tracking-wider">Party / Counterparty</label>
                      <input
                        type="text"
                        value={party}
                        onChange={(e) => setParty(e.target.value)}
                        placeholder="Customer, vendor, employee..."
                        className="input-field w-full"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs uppercase text-gray-400 font-medium tracking-wider">Payment Mode</label>
                      <select
                        value={paymentMode}
                        onChange={(e) => setPaymentMode(e.target.value)}
                        className="input-field w-full"
                      >
                        <option value="">Select mode</option>
                        {PAYMENT_MODES.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs uppercase text-gray-400 font-medium tracking-wider">Instrument / UTR</label>
                      <input
                        type="text"
                        value={instrument}
                        onChange={(e) => setInstrument(e.target.value)}
                        placeholder="Cheque, UPI, NEFT ref..."
                        className="input-field w-full"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs uppercase text-gray-400 font-medium tracking-wider">Cost Center</label>
                      <select
                        value={costCenter}
                        onChange={(e) => setCostCenter(e.target.value)}
                        className="input-field w-full"
                      >
                        <option value="">Select cost center</option>
                        {COST_CENTERS.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs uppercase text-gray-400 font-medium tracking-wider">Project / Job</label>
                      <input
                        type="text"
                        value={project}
                        onChange={(e) => setProject(e.target.value)}
                        placeholder="Project or job code"
                        className="input-field w-full"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs uppercase text-gray-400 font-medium tracking-wider">Narration</label>
                      <input
                        type="text"
                        value={narration}
                        onChange={(e) => setNarration(e.target.value)}
                        placeholder="Short description..."
                        className="input-field w-full"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Ledger Entries */}
              <div className="glass-card p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Ledger Entries</h3>
                  <p className="text-xs text-gray-500">Double-entry bookkeeping — debits must equal credits</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="table-header w-12">#</th>
                        <th className="table-header">Ledger Account</th>
                        <th className="table-header w-36">Debit (Dr)</th>
                        <th className="table-header w-36">Credit (Cr)</th>
                        <th className="table-header w-12"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {lines.map((line, idx) => (
                        <tr key={line.id} className="table-row">
                          <td className="table-cell text-center text-sm text-gray-500">{idx + 1}</td>
                          <td className="table-cell">
                            <input
                              type="text"
                              value={line.account}
                              onChange={(e) => updateLine(line.id, 'account', e.target.value)}
                              placeholder="Search ledger..."
                              className="input-field w-full text-sm"
                            />
                          </td>
                          <td className="table-cell">
                            <input
                              type="number"
                              value={line.debit || ''}
                              onChange={(e) => updateLine(line.id, 'debit', Number(e.target.value) || 0)}
                              placeholder="0"
                              className="input-field w-full text-sm font-mono text-right"
                            />
                          </td>
                          <td className="table-cell">
                            <input
                              type="number"
                              value={line.credit || ''}
                              onChange={(e) => updateLine(line.id, 'credit', Number(e.target.value) || 0)}
                              placeholder="0"
                              className="input-field w-full text-sm font-mono text-right"
                            />
                          </td>
                          <td className="table-cell text-center">
                            <button
                              onClick={() => removeLine(line.id)}
                              className="text-gray-600 hover:text-red-400 transition-colors disabled:opacity-20"
                              disabled={lines.length <= 2}
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2" style={{ borderColor: 'var(--card-border)' }}>
                        <td className="table-cell" colSpan={2}>
                          <span className="font-semibold text-sm text-white">Total</span>
                        </td>
                        <td className="table-cell">
                          <span className="font-mono text-sm font-semibold text-white">{formatIndianCurrency(totalDebit)}</span>
                        </td>
                        <td className="table-cell">
                          <span className="font-mono text-sm font-semibold text-white">{formatIndianCurrency(totalCredit)}</span>
                        </td>
                        <td className="table-cell"></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Balance indicator */}
                <div className="flex items-center justify-between">
                  <button onClick={addLine} className="text-sm text-teal hover:text-teal-300 flex items-center gap-1.5 transition-colors">
                    <Plus size={14} /> Add Line
                  </button>
                  <span className={cn('text-xs font-medium flex items-center gap-1.5', isBalanced ? 'text-teal' : 'text-amber-400')}>
                    {isBalanced ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
                    {isBalanced ? 'Balanced' : totalDebit || totalCredit ? `Difference: ${formatIndianCurrency(Math.abs(totalDebit - totalCredit))}` : 'Enter amounts above'}
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-3">
                <button onClick={resetForm} className="btn-secondary flex items-center gap-2">
                  <RotateCcw size={14} /> Reset Draft
                </button>
                <button
                  onClick={saveVoucher}
                  disabled={!isBalanced}
                  className="btn-primary flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Save size={14} /> Save &amp; Sync to Tally
                </button>
              </div>
            </div>

            {/* Right sidebar — Readiness */}
            <div className="space-y-4">
              <div className="glass-card p-5 space-y-4">
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Voucher Readiness</h3>
                <div className="flex items-center gap-3">
                  <div className="relative w-16 h-16">
                    <svg width={64} height={64} className="-rotate-90">
                      <circle cx={32} cy={32} r={26} fill="none" strokeWidth={5} style={{ stroke: 'var(--card-border)' }} />
                      <circle
                        cx={32} cy={32} r={26} fill="none"
                        stroke={readinessPercent === 100 ? '#00D4B4' : '#C9A84C'}
                        strokeWidth={5}
                        strokeDasharray={2 * Math.PI * 26}
                        strokeDashoffset={2 * Math.PI * 26 * (1 - readinessPercent / 100)}
                        strokeLinecap="round"
                        className="transition-all duration-500"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-mono font-semibold text-white">
                      {readinessPercent}%
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">{readinessPercent}% complete</span>
                </div>
                <div className="space-y-2">
                  {readinessChecks.map(check => (
                    <div key={check.label} className="flex items-center gap-2">
                      {check.done ? (
                        <CheckCircle2 size={14} className="text-teal shrink-0" />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full border-2 border-gray-600 shrink-0" />
                      )}
                      <span className={cn('text-xs', check.done ? 'text-white' : 'text-gray-500')}>{check.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick info */}
              <div className="glass-card p-4 space-y-2">
                <p className="text-xs text-gray-400">Type: <span className="text-white font-medium">{voucherType}</span></p>
                <p className="text-xs text-gray-400">Date: <span className="text-white font-medium">{date}</span></p>
                {party && <p className="text-xs text-gray-400">Party: <span className="text-white font-medium">{party}</span></p>}
                {reference && <p className="text-xs text-gray-400">Ref: <span className="text-white font-medium">{reference}</span></p>}
              </div>
            </div>
          </motion.div>
        </>
      )}

      {activeSection === 'dashboard' && (
        <>
          {/* ACCOUNTING DASHBOARD */}
          <motion.div variants={fadeUp} className="space-y-6">
            {/* Period selector */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 rounded-lg p-1" style={{ background: 'var(--table-header-bg)' }}>
                {(['today', 'month', 'all'] as const).map(p => (
                  <button
                    key={p}
                    onClick={() => setDashboardPeriod(p)}
                    className={cn(
                      'px-3 py-1.5 rounded-md text-xs font-medium transition-all capitalize',
                      dashboardPeriod === p ? 'bg-teal/15 text-teal border border-teal/30' : 'text-gray-400 hover:text-white'
                    )}
                  >
                    {p === 'month' ? 'This Month' : p === 'all' ? 'All Time' : 'Today'}
                  </button>
                ))}
              </div>
              <button className="btn-secondary flex items-center gap-2 text-xs">
                <Download size={13} /> Export
              </button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="glass-card p-4 space-y-1">
                <div className="flex items-center gap-2">
                  <FileText size={14} className="text-teal" />
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Total Vouchers</p>
                </div>
                <p className="font-mono text-2xl font-bold text-white">{filteredVouchers.length}</p>
                <p className="text-[10px] text-gray-500">
                  {dashboardPeriod === 'today' ? 'Today' : dashboardPeriod === 'month' ? 'This Month' : 'All Time'}
                </p>
              </div>
              <div className="glass-card p-4 space-y-1">
                <div className="flex items-center gap-2">
                  <CreditCard size={14} className="text-gold" />
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Total Amount</p>
                </div>
                <p className="font-mono text-2xl font-bold text-white">{formatIndianCurrency(totalAmount)}</p>
                <p className="text-[10px] text-gray-500">Sum of all vouchers</p>
              </div>
              <div className="glass-card p-4 space-y-1">
                <div className="flex items-center gap-2">
                  <ArrowUpRight size={14} className="text-red-400" />
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Payments</p>
                </div>
                <p className="font-mono text-2xl font-bold text-white">{formatIndianCurrency(payments.reduce((s, v) => s + v.amount, 0))}</p>
                <p className="text-[10px] text-gray-500">{payments.length} vouchers</p>
              </div>
              <div className="glass-card p-4 space-y-1">
                <div className="flex items-center gap-2">
                  <ArrowDownLeft size={14} className="text-teal" />
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Receipts</p>
                </div>
                <p className="font-mono text-2xl font-bold text-white">{formatIndianCurrency(receipts.reduce((s, v) => s + v.amount, 0))}</p>
                <p className="text-[10px] text-gray-500">{receipts.length} vouchers</p>
              </div>
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 7-day activity */}
              <div className="glass-card p-5 space-y-3">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <BarChart3 size={15} className="text-teal" /> 7-Day Voucher Activity
                </h3>
                {last7Days.some(d => d.count > 0) ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={last7Days}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" vertical={false} />
                      <XAxis dataKey="day" tick={{ fill: 'var(--table-header-text)', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: 'var(--table-header-text)', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <Tooltip
                        contentStyle={{ background: 'var(--dropdown-bg)', border: '1px solid var(--card-border)', borderRadius: 8, fontSize: 12 }}
                        labelStyle={{ color: 'var(--section-title-color)' }}
                      />
                      <Bar dataKey="count" fill="#00D4B4" radius={[4, 4, 0, 0]} barSize={24} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[200px] text-gray-500">
                    <Calendar size={32} className="mb-2 opacity-40" />
                    <p className="text-sm">No voucher data yet</p>
                    <p className="text-xs text-gray-600 mt-1">Enter vouchers to see activity</p>
                  </div>
                )}
              </div>

              {/* Type breakdown */}
              <div className="glass-card p-5 space-y-3">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Clock size={15} className="text-gold" /> Amount by Voucher Type
                </h3>
                {typeBreakdown.length > 0 ? (
                  <div className="flex items-center gap-6">
                    <ResponsiveContainer width={160} height={160}>
                      <PieChart>
                        <Pie
                          data={typeBreakdown}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={70}
                          dataKey="value"
                          strokeWidth={0}
                        >
                          {typeBreakdown.map((_, i) => (
                            <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(v: any) => formatIndianCurrency(v)}
                          contentStyle={{ background: 'var(--dropdown-bg)', border: '1px solid var(--card-border)', borderRadius: 8, fontSize: 12 }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-2">
                      {typeBreakdown.map((item, i) => (
                        <div key={item.name} className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                          <span className="text-xs text-gray-300">{item.name}</span>
                          <span className="text-xs font-mono text-white ml-auto">{formatIndianCurrency(item.value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[160px] text-gray-500">
                    <p className="text-sm">No data for this period</p>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Vouchers */}
            <div className="glass-card p-5 space-y-3">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Recent Vouchers</h3>
              {filteredVouchers.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr>
                        {['Ref', 'Type', 'Date', 'Party', 'Amount', 'Status'].map(h => (
                          <th key={h} className="table-header">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredVouchers.slice(0, 10).map(v => (
                        <tr key={v.id} className="table-row">
                          <td className="table-cell font-mono text-sm text-white">{v.reference}</td>
                          <td className="table-cell text-sm">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-teal/10 text-teal border border-teal/20">
                              {v.type}
                            </span>
                          </td>
                          <td className="table-cell text-sm text-gray-300">{v.date}</td>
                          <td className="table-cell text-sm text-white">{v.party}</td>
                          <td className="table-cell font-mono text-sm font-semibold text-white">{formatIndianCurrency(v.amount)}</td>
                          <td className="table-cell">
                            <span className="inline-flex items-center gap-1 text-xs text-teal">
                              <CheckCircle2 size={11} /> Synced
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-8 text-center text-gray-500 text-sm">
                  No vouchers in this period
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </motion.div>
  );
};

export default Accounting;
