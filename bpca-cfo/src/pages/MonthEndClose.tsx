import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Circle,
  Clock,
  ListChecks,
  Loader2,
  PieChart as PieChartIcon,
  CalendarCheck,
  ShieldAlert,
  RefreshCw,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import DataTable from '../components/shared/DataTable';
import StatusBadge from '../components/shared/StatusBadge';
import { cn, getHealthColor } from '../utils/format';

/* ------------------------------------------------------------------ */
/*  DEMO DATA                                                         */
/* ------------------------------------------------------------------ */

const taskData = [
  { task: 'Revenue Accrual Review', owner: 'Priya Sharma', status: 'In Review', risk: 'Medium', due: 'Jun 5' },
  { task: 'Depreciation JE Posting', owner: 'Rajesh Kumar', status: 'Pending', risk: 'Low', due: 'Jun 6' },
  { task: 'Bank Recon — HDFC Main', owner: 'Anita Desai', status: 'Done', risk: 'Low', due: 'Jun 4' },
  { task: 'GST 2B vs Books Recon', owner: 'Vikram Patel', status: 'Pending', risk: 'High', due: 'Jun 5' },
  { task: 'Inventory Valuation Check', owner: 'Meera Joshi', status: 'In Review', risk: 'Medium', due: 'Jun 6' },
  { task: 'Provision for Doubtful Debts', owner: 'Rajesh Kumar', status: 'Pending', risk: 'High', due: 'Jun 7' },
  { task: 'Inter-company Reconciliation', owner: 'Priya Sharma', status: 'Done', risk: 'Low', due: 'Jun 4' },
  { task: 'Prepaid Expense Amortisation', owner: 'Anita Desai', status: 'Pending', risk: 'Medium', due: 'Jun 7' },
  { task: 'Fixed Asset Register Update', owner: 'Vikram Patel', status: 'In Review', risk: 'Low', due: 'Jun 6' },
  { task: 'Tax Provision Calculation', owner: 'Meera Joshi', status: 'Pending', risk: 'Medium', due: 'Jun 8' },
];

const taskColumns = [
  { key: 'task', label: 'Task Name' },
  { key: 'owner', label: 'Owner' },
  {
    key: 'status',
    label: 'Status',
    render: (val: string) => <StatusBadge status={val} />,
  },
  {
    key: 'risk',
    label: 'Risk Level',
    render: (val: string) => <StatusBadge status={val} />,
  },
  { key: 'due', label: 'Due Date' },
];

const healthData = [
  { name: 'Positive Balance', value: 623, color: '#00D4B4' },
  { name: 'Negative Balance', value: 89, color: '#ef4444' },
  { name: 'Zero Balance', value: 135, color: '#6b7280' },
];

const checklistSteps = [
  { label: 'Pre-close Data Validation', status: 'done' as const },
  { label: 'Journal Entry Posting', status: 'done' as const },
  { label: 'Bank Reconciliation', status: 'done' as const },
  { label: 'Sub-ledger Reconciliation', status: 'in-progress' as const },
  { label: 'Management Review', status: 'pending' as const },
  { label: 'Final Sign-off', status: 'pending' as const },
];

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
/*  CIRCULAR PROGRESS (inline)                                        */
/* ------------------------------------------------------------------ */

const CircularProgress: React.FC<{ percent: number; size?: number }> = ({ percent, size = 72 }) => {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;
  const color = getHealthColor(percent);

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#1a2040" strokeWidth={6} />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={6}
        strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      />
    </svg>
  );
};

/* ------------------------------------------------------------------ */
/*  LIVE CLOCK                                                        */
/* ------------------------------------------------------------------ */

const LiveClock: React.FC = () => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const time = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  const date = now.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="text-center">
      <p className="font-mono text-3xl font-bold text-white tracking-widest">{time}</p>
      <p className="text-sm text-gray-400 mt-1">{date}</p>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  MONTH-END CLOSE PAGE                                              */
/* ------------------------------------------------------------------ */

const MonthEndClose: React.FC = () => {
  const closePercent = 68;
  const healthScore = 78;

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* ---- HEADER METRICS ---- */}
      <motion.div variants={fadeUp}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Close Progress */}
          <div className="glass-card p-5 flex items-center gap-4">
            <div className="relative flex-shrink-0">
              <CircularProgress percent={closePercent} />
              <span className="absolute inset-0 flex items-center justify-center font-mono text-sm font-bold text-white">
                {closePercent}%
              </span>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider">Close Progress</p>
              <p className="text-lg font-semibold text-white mt-1">Month-End</p>
            </div>
          </div>

          {/* Tasks Pending */}
          <div className="glass-card p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/15 flex items-center justify-center">
              <ListChecks size={24} className="text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider">Tasks Pending</p>
              <p className="font-mono text-2xl font-bold text-white">7</p>
            </div>
          </div>

          {/* High-Risk Items */}
          <div className="glass-card p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-500/15 flex items-center justify-center">
              <ShieldAlert size={24} className="text-red-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider">High-Risk Items</p>
              <p className="font-mono text-2xl font-bold text-red-400">2</p>
            </div>
          </div>

          {/* Last Updated */}
          <div className="glass-card p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal/15 flex items-center justify-center">
              <RefreshCw size={24} className="text-teal" />
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider">Last Updated</p>
              <p className="text-sm font-medium text-white mt-1">Today, 4:32 PM</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ---- TASK QUEUE ---- */}
      <motion.div variants={fadeUp} className="space-y-2">
        <h2 className="section-title flex items-center gap-2">
          <CalendarCheck size={20} className="text-teal" />
          Task Queue
        </h2>
        <DataTable
          columns={taskColumns}
          data={taskData}
          searchable
          sortable
        />
      </motion.div>

      {/* ---- BOTTOM GRID: BOOKS HEALTH + CLOCK + CHECKLIST ---- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Books Health */}
        <motion.div variants={fadeUp} className="glass-card p-6 space-y-4">
          <h3 className="section-title flex items-center gap-2">
            <PieChartIcon size={18} className="text-gold" />
            Books Health
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-navy-50/50 rounded-lg p-3">
              <p className="text-xs text-gray-400">Total Ledgers</p>
              <p className="font-mono text-xl font-bold text-white">847</p>
            </div>
            <div className="bg-navy-50/50 rounded-lg p-3">
              <p className="text-xs text-gray-400">Positive Balance</p>
              <p className="font-mono text-xl font-bold text-teal">623</p>
            </div>
            <div className="bg-navy-50/50 rounded-lg p-3">
              <p className="text-xs text-gray-400">Negative Balance</p>
              <p className="font-mono text-xl font-bold text-red-400">89</p>
            </div>
            <div className="bg-navy-50/50 rounded-lg p-3">
              <p className="text-xs text-gray-400">Zero Balance</p>
              <p className="font-mono text-xl font-bold text-gray-400">135</p>
            </div>
          </div>

          {/* Donut Chart */}
          <div className="flex items-center justify-center">
            <div className="relative">
              <ResponsiveContainer width={160} height={160}>
                <PieChart>
                  <Pie
                    data={healthData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    dataKey="value"
                    strokeWidth={0}
                    animationDuration={1200}
                  >
                    {healthData.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#111729', border: '1px solid #2a3155', borderRadius: '8px', fontSize: '12px' }}
                    itemStyle={{ color: '#e2e8f0' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-mono text-2xl font-bold" style={{ color: getHealthColor(healthScore) }}>
                  {healthScore}%
                </span>
                <span className="text-[10px] text-gray-400">Health</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Live Clock + Date */}
        <motion.div variants={fadeUp} className="glass-card p-6 flex flex-col items-center justify-center gap-6">
          <div className="w-16 h-16 rounded-full bg-teal/10 border border-teal/30 flex items-center justify-center animate-pulse-subtle">
            <Clock size={32} className="text-teal" />
          </div>
          <LiveClock />
          <div className="w-full pt-4 border-t border-surface-border/30">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>Close Period</span>
              <span className="font-mono text-white">May 2026</span>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-400 mt-2">
              <span>Deadline</span>
              <span className="font-mono text-amber-400">Jun 8, 2026</span>
            </div>
          </div>
        </motion.div>

        {/* Close Checklist Stepper */}
        <motion.div variants={fadeUp} className="glass-card p-6 space-y-4">
          <h3 className="section-title flex items-center gap-2">
            <ListChecks size={18} className="text-teal" />
            Close Checklist
          </h3>

          <div className="relative space-y-0">
            {checklistSteps.map((step, idx) => {
              const isLast = idx === checklistSteps.length - 1;
              const isDone = step.status === 'done';
              const isActive = step.status === 'in-progress';

              return (
                <div key={step.label} className="flex items-start gap-3">
                  {/* Connector + Icon */}
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        'w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 border',
                        isDone && 'bg-teal/20 border-teal text-teal',
                        isActive && 'bg-gold/20 border-gold text-gold animate-pulse-subtle',
                        !isDone && !isActive && 'bg-navy-50 border-surface-border text-gray-500'
                      )}
                    >
                      {isDone && <CheckCircle2 size={16} />}
                      {isActive && <Loader2 size={16} className="animate-spin" />}
                      {!isDone && !isActive && <Circle size={16} />}
                    </div>
                    {!isLast && (
                      <div
                        className={cn(
                          'w-0.5 h-8',
                          isDone ? 'bg-teal/40' : 'bg-surface-border/40'
                        )}
                      />
                    )}
                  </div>

                  {/* Label */}
                  <div className="pt-1">
                    <p
                      className={cn(
                        'text-sm',
                        isDone && 'text-teal font-medium',
                        isActive && 'text-gold font-medium',
                        !isDone && !isActive && 'text-gray-500'
                      )}
                    >
                      {step.label}
                    </p>
                    {isActive && (
                      <p className="text-[10px] text-gold/70 mt-0.5">In progress…</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MonthEndClose;
