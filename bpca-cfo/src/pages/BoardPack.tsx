import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Printer,
  Download,
  TrendingUp,
  DollarSign,
  BarChart3,
  Percent,
  Target,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import KPICard from '../components/shared/KPICard';
import AIInsightBanner from '../components/shared/AIInsightBanner';
import PeriodSelector from '../components/shared/PeriodSelector';
import { cn } from '../utils/format';

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
/*  DEMO DATA                                                         */
/* ------------------------------------------------------------------ */

const aiInsights = [
  "Revenue growth of 13.6% YoY outpaces industry median of 8.2%, positioning Bharat Manufacturing in the top quartile. EBITDA margin expansion to 21% reflects disciplined cost management and operating leverage.",
  "Working capital efficiency remains the primary improvement opportunity — CCC at 78 days vs 58-day target locks up approximately ₹6.8 Cr. Board should prioritise the receivables sprint approved in April.",
  "Three of eight business lines exceed plan (SaaS +12%, Manufacturing +5%, Logistics +2%). Hospitality underperformance (-22% vs plan) warrants strategic review at the next board meeting.",
];

const kpiCards = [
  {
    title: 'Total Revenue',
    value: '₹8.7 Cr',
    change: '+13.6% YoY',
    changeType: 'positive' as const,
    subtitle: 'Consolidated portfolio revenue',
    icon: TrendingUp,
    sparklineData: [5.8, 6.2, 6.5, 7.0, 7.4, 7.8, 8.2, 8.7],
  },
  {
    title: 'EBITDA',
    value: '₹1.8 Cr',
    change: '21% margin · +2.3pp',
    changeType: 'positive' as const,
    subtitle: 'Operating profit margin expansion',
    icon: DollarSign,
    sparklineData: [1.1, 1.2, 1.3, 1.4, 1.5, 1.5, 1.7, 1.8],
  },
  {
    title: 'Free Cash Flow',
    value: '₹1.2 Cr',
    change: '+18% YoY',
    changeType: 'positive' as const,
    subtitle: 'Post-capex cash generation',
    icon: BarChart3,
    sparklineData: [0.6, 0.7, 0.8, 0.8, 0.9, 1.0, 1.1, 1.2],
  },
  {
    title: 'Avg EBITDA Margin',
    value: '21.0%',
    change: '+2.3pp vs prior',
    changeType: 'positive' as const,
    subtitle: 'Portfolio weighted average',
    icon: Percent,
    sparklineData: [17.5, 18.0, 18.5, 19.0, 19.5, 20.0, 20.5, 21.0],
  },
  {
    title: 'Budget Variance',
    value: '+6.1%',
    change: '₹50L favourable',
    changeType: 'positive' as const,
    subtitle: 'Actual vs plan (revenue basis)',
    icon: Target,
    sparklineData: [2.1, 3.0, 3.8, 4.2, 4.8, 5.2, 5.8, 6.1],
  },
];

type BudgetVarianceItem = {
  category: string;
  variance: number;
  favorable: boolean;
};

const budgetVarianceData: BudgetVarianceItem[] = [
  { category: 'Revenue', variance: 6.1, favorable: true },
  { category: 'COGS', variance: -3.2, favorable: true },
  { category: 'Salaries', variance: 2.1, favorable: false },
  { category: 'Marketing', variance: -8.5, favorable: true },
  { category: 'Admin', variance: 1.2, favorable: false },
  { category: 'Finance Costs', variance: -5.0, favorable: true },
  { category: 'Other Opex', variance: 0.8, favorable: false },
];

type BusinessLine = {
  name: string;
  revenue: string;
  revenueRaw: number;
  ebitda: string;
  ebitdaMargin: number;
  budgetVariance: number;
  grossMargin: number;
  icr: number;
  capacityUtil: number;
  health: 'On Track' | 'Watch' | 'Action Needed';
  revVariance: number;
  costVariance: number;
};

const businessLines: BusinessLine[] = [
  { name: 'Manufacturing', revenue: '₹1.5 Cr', revenueRaw: 15000000, ebitda: '₹38L', ebitdaMargin: 25.3, budgetVariance: 5.2, grossMargin: 42.8, icr: 4.2, capacityUtil: 78, health: 'On Track', revVariance: 6.1, costVariance: -1.2 },
  { name: 'Retail', revenue: '₹1.2 Cr', revenueRaw: 12000000, ebitda: '₹22L', ebitdaMargin: 18.3, budgetVariance: -2.1, grossMargin: 38.5, icr: 3.1, capacityUtil: 72, health: 'Watch', revVariance: -1.5, costVariance: -0.6 },
  { name: 'SaaS', revenue: '₹1.0 Cr', revenueRaw: 10000000, ebitda: '₹35L', ebitdaMargin: 35.0, budgetVariance: 12.4, grossMargin: 68.2, icr: 8.5, capacityUtil: 85, health: 'On Track', revVariance: 10.2, costVariance: 2.2 },
  { name: 'Healthcare', revenue: '₹0.9 Cr', revenueRaw: 9000000, ebitda: '₹18L', ebitdaMargin: 20.0, budgetVariance: -4.5, grossMargin: 45.2, icr: 2.8, capacityUtil: 68, health: 'Watch', revVariance: -3.0, costVariance: -1.5 },
  { name: 'Construction', revenue: '₹0.8 Cr', revenueRaw: 8000000, ebitda: '₹12L', ebitdaMargin: 15.0, budgetVariance: 1.8, grossMargin: 32.4, icr: 2.2, capacityUtil: 74, health: 'Watch', revVariance: 2.0, costVariance: 0.2 },
  { name: 'Logistics', revenue: '₹0.7 Cr', revenueRaw: 7000000, ebitda: '₹14L', ebitdaMargin: 20.0, budgetVariance: 2.3, grossMargin: 35.8, icr: 3.5, capacityUtil: 82, health: 'On Track', revVariance: 3.0, costVariance: 0.7 },
  { name: 'Hospitality', revenue: '₹0.6 Cr', revenueRaw: 6000000, ebitda: '₹5L', ebitdaMargin: 8.3, budgetVariance: -22.0, grossMargin: 28.5, icr: 1.2, capacityUtil: 45, health: 'Action Needed', revVariance: -18.0, costVariance: -4.0 },
  { name: 'Financial', revenue: '₹0.5 Cr', revenueRaw: 5000000, ebitda: '₹10L', ebitdaMargin: 20.0, budgetVariance: -1.2, grossMargin: 52.1, icr: 4.8, capacityUtil: 62, health: 'On Track', revVariance: 0.5, costVariance: -1.7 },
];

/* ------------------------------------------------------------------ */
/*  HEALTH BADGE                                                      */
/* ------------------------------------------------------------------ */

const healthBadgeStyles: Record<string, string> = {
  'On Track': 'bg-teal/15 text-teal border border-teal/30',
  'Watch': 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
  'Action Needed': 'bg-red-500/15 text-red-400 border border-red-500/30',
};

/* ------------------------------------------------------------------ */
/*  CUSTOM TOOLTIP                                                    */
/* ------------------------------------------------------------------ */

const VarianceTooltip: React.FC<any> = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload as BudgetVarianceItem;
  return (
    <div className="glass-card p-3 border border-surface-border/60 text-xs space-y-1">
      <p className="text-white font-medium">{d.category}</p>
      <p className={cn('font-mono font-semibold', d.favorable ? 'text-teal' : 'text-red-400')}>
        {d.variance > 0 ? '+' : ''}{d.variance.toFixed(1)}%
        <span className="ml-2 text-gray-400 font-normal">
          {d.favorable ? '(Favourable)' : '(Adverse)'}
        </span>
      </p>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  BOARD PACK PAGE                                                   */
/* ------------------------------------------------------------------ */

const BoardPack: React.FC = () => {
  const [activePeriod, setActivePeriod] = useState('YTD');

  return (
    <>
      {/* Print-only styles */}
      <style>{`
        @media print {
          body, html {
            background: #fff !important;
            color: #111 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .board-pack-wrapper * {
            color: #1a1a1a !important;
            border-color: #ddd !important;
          }
          .board-pack-wrapper .glass-card,
          .board-pack-wrapper .glass-card-hover {
            background: #fff !important;
            border: 1px solid #ddd !important;
            box-shadow: none !important;
            backdrop-filter: none !important;
          }
          .board-pack-wrapper .kpi-value {
            color: #111 !important;
          }
          .board-pack-wrapper .text-teal,
          .board-pack-wrapper .text-teal-500 {
            color: #008573 !important;
          }
          .board-pack-wrapper .text-red-400 {
            color: #c62828 !important;
          }
          .board-pack-wrapper .text-amber-400 {
            color: #e65100 !important;
          }
          .board-pack-wrapper .text-gray-400,
          .board-pack-wrapper .text-gray-500 {
            color: #555 !important;
          }
          .board-pack-wrapper .ai-regenerate-btn,
          .board-pack-wrapper .no-print,
          nav, aside, header {
            display: none !important;
          }
          .print-header {
            display: flex !important;
          }
          .board-pack-wrapper .recharts-cartesian-grid line {
            stroke: #e0e0e0 !important;
          }
          @page {
            margin: 12mm;
            size: A4 landscape;
          }
        }
      `}</style>

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="board-pack-wrapper space-y-6"
      >
        {/* ---- PRINT HEADER (hidden on screen) ---- */}
        <div className="print-header hidden items-center justify-between border-b border-gray-300 pb-4 mb-4">
          <div>
            <p className="text-xl font-bold tracking-wide">BPCA One</p>
            <p className="text-sm text-gray-500">Bharat Manufacturing Pvt Ltd</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold">Board Performance Report</p>
            <p className="text-sm text-gray-500">YTD FY 2025-26</p>
          </div>
        </div>

        {/* ---- SECTION 1: PAGE HEADER ---- */}
        <motion.div variants={fadeUp}>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="section-title">Board Pack</h1>
              <p className="text-sm text-gray-400 mt-1">Executive Performance Summary</p>
            </div>

            <div className="flex items-center gap-4">
              <PeriodSelector
                activePeriod={activePeriod}
                onPeriodChange={setActivePeriod}
              />

              <div className="no-print flex items-center gap-2">
                <button
                  className="btn-gold flex items-center gap-2"
                  onClick={() => window.print()}
                >
                  <Printer size={14} />
                  Print Report
                </button>
                <button className="btn-primary flex items-center gap-2">
                  <Download size={14} />
                  Export PDF
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ---- SECTION 2: AI INSIGHT BANNER ---- */}
        <motion.div variants={fadeUp}>
          <AIInsightBanner insights={aiInsights} pageTitle="Board Pack" />
        </motion.div>

        {/* ---- SECTION 3: KPI STRIP ---- */}
        <motion.div variants={fadeUp}>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {kpiCards.map((kpi) => (
              <KPICard key={kpi.title} {...kpi} />
            ))}
          </div>
        </motion.div>

        {/* ---- SECTION 4: BUDGET VARIANCE CHART ---- */}
        <motion.div variants={fadeUp} className="glass-card p-6 space-y-4">
          <h2 className="section-title flex items-center gap-2">
            <BarChart3 size={18} className="text-teal" />
            Budget Variance by Category
          </h2>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart
              data={budgetVarianceData}
              layout="vertical"
              margin={{ top: 5, right: 40, left: 10, bottom: 5 }}
              barSize={20}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2040" horizontal={false} />
              <XAxis
                type="number"
                tickFormatter={(v) => `${v > 0 ? '+' : ''}${v}%`}
                tick={{ fill: '#9ca3af', fontSize: 11 }}
                axisLine={{ stroke: '#2a3155' }}
                domain={['dataMin - 2', 'dataMax + 2']}
              />
              <YAxis
                dataKey="category"
                type="category"
                tick={{ fill: '#e2e8f0', fontSize: 12 }}
                axisLine={{ stroke: '#2a3155' }}
                width={110}
              />
              <Tooltip content={<VarianceTooltip />} cursor={{ fill: 'rgba(0,212,180,0.05)' }} />
              <Bar dataKey="variance" radius={[0, 4, 4, 0]} animationDuration={1200}>
                {budgetVarianceData.map((entry, idx) => (
                  <Cell
                    key={idx}
                    fill={entry.favorable ? '#00D4B4' : '#f87171'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* ---- SECTION 5: BUSINESS LINE CARDS ---- */}
        <motion.div variants={fadeUp} className="space-y-4">
          <h2 className="section-title flex items-center gap-2">
            <TrendingUp size={18} className="text-gold" />
            Business Line Performance
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {businessLines.map((bl) => (
              <motion.div
                key={bl.name}
                variants={fadeUp}
                whileHover={{ y: -2 }}
                className="glass-card-hover p-5 space-y-3"
              >
                {/* Header */}
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-white">{bl.name}</h3>
                  <span className={cn(
                    'text-[10px] px-2.5 py-0.5 rounded-full font-medium',
                    healthBadgeStyles[bl.health]
                  )}>
                    {bl.health}
                  </span>
                </div>

                {/* Metrics grid */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div>
                    <p className="text-[11px] text-gray-500 uppercase tracking-wider">Revenue</p>
                    <p className="font-mono font-semibold text-white">{bl.revenue}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-500 uppercase tracking-wider">EBITDA</p>
                    <p className="font-mono font-semibold text-white">
                      {bl.ebitda}{' '}
                      <span className="text-gray-400 text-xs">{bl.ebitdaMargin}%</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-500 uppercase tracking-wider">Budget Var.</p>
                    <p className={cn(
                      'font-mono font-semibold',
                      bl.budgetVariance >= 0 ? 'text-teal' : 'text-red-400'
                    )}>
                      {bl.budgetVariance > 0 ? '+' : ''}{bl.budgetVariance.toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-500 uppercase tracking-wider">Gross Margin</p>
                    <p className="font-mono text-white">{bl.grossMargin}%</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-500 uppercase tracking-wider">ICR</p>
                    <p className="font-mono text-white">{bl.icr}x</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-500 uppercase tracking-wider">Capacity</p>
                    <p className="font-mono text-white">{bl.capacityUtil}%</p>
                  </div>
                </div>

                {/* Mini budget variance bar */}
                <div className="space-y-1">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Rev vs Cost Variance</p>
                  <div className="flex items-center gap-1 h-2">
                    <div
                      className="h-full rounded-sm"
                      style={{
                        width: `${Math.min(Math.max(Math.abs(bl.revVariance) * 3, 8), 60)}%`,
                        backgroundColor: bl.revVariance >= 0 ? '#00D4B4' : '#f87171',
                      }}
                      title={`Rev: ${bl.revVariance > 0 ? '+' : ''}${bl.revVariance}%`}
                    />
                    <div
                      className="h-full rounded-sm"
                      style={{
                        width: `${Math.min(Math.max(Math.abs(bl.costVariance) * 3, 8), 40)}%`,
                        backgroundColor: bl.costVariance <= 0 ? '#00D4B4' : '#f87171',
                      }}
                      title={`Cost: ${bl.costVariance > 0 ? '+' : ''}${bl.costVariance}%`}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[9px] text-gray-500">
                    <span>Rev {bl.revVariance > 0 ? '+' : ''}{bl.revVariance}%</span>
                    <span>Cost {bl.costVariance > 0 ? '+' : ''}{bl.costVariance}%</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default BoardPack;
