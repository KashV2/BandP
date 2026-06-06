import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
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
  TrendingUp,
  Landmark,
  Wallet,
  Hourglass,
  Timer,
  SlidersHorizontal,
  Eye,
  BarChart3,
  Brain,
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

type Scenario = 'Base' | 'Growth' | 'Efficiency' | 'Stress';

const scenarioPresets: Record<Scenario, {
  revenue: number; ebitda: number; ebitdaMargin: number;
  cash: number; runway: string; ccc: number;
}> = {
  Base: { revenue: 71000000, ebitda: 18000000, ebitdaMargin: 24.8, cash: 15000000, runway: '18+ months', ccc: 78 },
  Growth: { revenue: 85000000, ebitda: 24000000, ebitdaMargin: 28.2, cash: 18000000, runway: '24+ months', ccc: 72 },
  Efficiency: { revenue: 71000000, ebitda: 21000000, ebitdaMargin: 29.6, cash: 20000000, runway: '22+ months', ccc: 65 },
  Stress: { revenue: 58000000, ebitda: 9000000, ebitdaMargin: 15.5, cash: 6000000, runway: '8 months', ccc: 95 },
};

const monthLabels = ['Jul 25', 'Aug 25', 'Sep 25', 'Oct 25', 'Nov 25', 'Dec 25', 'Jan 26', 'Feb 26', 'Mar 26', 'Apr 26', 'May 26', 'Jun 26'];

const baseMonthly = {
  revenue: [7.1, 7.3, 7.5, 7.6, 7.8, 8.0, 8.1, 8.3, 8.5, 8.6, 8.8, 9.0],
  ebitda:  [1.8, 1.8, 1.9, 1.9, 2.0, 2.0, 2.1, 2.1, 2.2, 2.2, 2.3, 2.3],
  cash:    [1.5, 1.4, 1.5, 1.6, 1.5, 1.6, 1.7, 1.6, 1.7, 1.8, 1.9, 2.0],
};

const scenarioMultipliers: Record<Scenario, { rev: number; ebitda: number; cash: number }> = {
  Base: { rev: 1.0, ebitda: 1.0, cash: 1.0 },
  Growth: { rev: 1.2, ebitda: 1.33, cash: 1.2 },
  Efficiency: { rev: 1.0, ebitda: 1.17, cash: 1.33 },
  Stress: { rev: 0.82, ebitda: 0.5, cash: 0.4 },
};

const bridgeData = [
  { step: 'Base Plan', value: 15400000, isTotal: true },
  { step: 'Revenue Impact', value: 2600000, isPositive: true },
  { step: 'Margin Impact', value: 1200000, isPositive: true },
  { step: 'Opex Impact', value: -800000, isPositive: false },
  { step: 'Cycle Impact', value: -400000, isPositive: false },
  { step: 'Capex Impact', value: -200000, isPositive: false },
  { step: 'Forecast', value: 17800000, isTotal: true },
];

const monthNarratives: Record<number, { narrative: string; wcComment: string }> = {
  0: {
    narrative: 'July forecast reflects seasonal softness in manufacturing segment offset by strong SaaS renewals. EBITDA margin stable at 24.8% with operating leverage. Cash position supported by improved collections cycle.',
    wcComment: 'CCC projected at 78 days — recommend accelerating receivables sprint to meet 58-day target by Q3.',
  },
  1: {
    narrative: 'August shows recovery in manufacturing orders. SaaS recurring revenue provides baseline stability. EBITDA expected to hold at 24.7% despite raw material cost uptick.',
    wcComment: 'Receivables sprint targeting top 20 accounts expected to bring DSO to 42 days by month-end.',
  },
  2: {
    narrative: 'September benefits from Q2 close momentum. Healthcare vertical shows 15% MoM growth. Cash position recovers with strong collection push.',
    wcComment: 'DIO reduced to 33 days through slow-moving SKU clearance program launched in August.',
  },
  3: {
    narrative: 'October forecast includes festive season demand spike in retail (+22% MoM). Construction vertical remains steady.',
    wcComment: 'Vendor term renegotiation phase 1 complete — DPO extended to 24 days for top 5 vendors.',
  },
};

const ForecastTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card p-3 text-xs border border-surface-border">
      <p className="text-white font-medium mb-1">{label}</p>
      {payload.map((entry: any) => (
        <p key={entry.name} style={{ color: entry.color }}>
          {entry.name}: ₹{entry.value.toFixed(1)} Cr
        </p>
      ))}
    </div>
  );
};

const BridgeTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  return (
    <div className="glass-card p-3 text-xs border border-surface-border">
      <p className="text-white font-medium mb-1">{data.step}</p>
      <p className={data.isTotal ? 'text-gold' : data.isPositive ? 'text-teal' : 'text-red-400'}>
        {data.isTotal ? '' : data.isPositive ? '+' : ''}{formatIndianCurrency(data.isTotal ? data.value : data.value)}
      </p>
    </div>
  );
};

const FPandA: React.FC = () => {
  const [scenario, setScenario] = useState<Scenario>('Base');
  const [selectedMonth, setSelectedMonth] = useState(0);

  const [drivers, setDrivers] = useState({
    revenueGrowth: 12, marginLift: 0, opexChange: 5,
    dsoChange: 0, dpoChange: 0, dioChange: 0,
  });

  const preset = scenarioPresets[scenario];
  const mult = scenarioMultipliers[scenario];

  const adjustedRevenue = useMemo(() => preset.revenue * (1 + (drivers.revenueGrowth - 12) / 100), [preset.revenue, drivers.revenueGrowth]);
  const adjustedEbitda = useMemo(() => {
    const marginAdj = preset.ebitdaMargin + drivers.marginLift;
    const opexAdj = 1 - (drivers.opexChange - 5) / 100;
    return adjustedRevenue * (marginAdj / 100) * opexAdj;
  }, [adjustedRevenue, preset.ebitdaMargin, drivers.marginLift, drivers.opexChange]);
  const adjustedCash = useMemo(() => {
    const cycleEffect = ((drivers.dsoChange - drivers.dpoChange + drivers.dioChange) / 365) * adjustedRevenue;
    return preset.cash - cycleEffect;
  }, [preset.cash, drivers.dsoChange, drivers.dpoChange, drivers.dioChange, adjustedRevenue]);
  const adjustedCCC = useMemo(() => preset.ccc + drivers.dsoChange - drivers.dpoChange + drivers.dioChange, [preset.ccc, drivers.dsoChange, drivers.dpoChange, drivers.dioChange]);

  const forecastData = useMemo(() =>
    monthLabels.map((month, i) => ({
      month,
      Revenue: +(baseMonthly.revenue[i] * mult.rev * (1 + (drivers.revenueGrowth - 12) / 100)).toFixed(1),
      EBITDA: +(baseMonthly.ebitda[i] * mult.ebitda * (1 + drivers.marginLift / 25)).toFixed(1),
      Cash: +(baseMonthly.cash[i] * mult.cash).toFixed(1),
    })), [mult, drivers.revenueGrowth, drivers.marginLift]
  );

  const currentNarrative = monthNarratives[selectedMonth] || monthNarratives[0];

  const waterfallData = useMemo(() => {
    let running = 15400000;
    return bridgeData.map((item) => {
      if (item.isTotal && item.step === 'Base Plan') {
        return { ...item, start: 0, end: item.value, fill: '#C9A84C' };
      }
      if (item.isTotal && item.step === 'Forecast') {
        return { ...item, start: 0, end: item.value, fill: '#C9A84C' };
      }
      const start = running;
      running += item.value;
      return {
        ...item,
        start: Math.min(start, running),
        end: Math.max(start, running),
        fill: item.isPositive ? '#00D4B4' : '#ef4444',
      };
    });
  }, []);

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
      {/* 1. Scenario Tabs */}
      <motion.div variants={fadeUp} className="flex gap-2 overflow-x-auto pb-1">
        {(['Base', 'Growth', 'Efficiency', 'Stress'] as Scenario[]).map((s) => (
          <button
            key={s}
            onClick={() => setScenario(s)}
            className={cn(
              'px-5 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200',
              scenario === s
                ? s === 'Stress'
                  ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                  : 'bg-teal/15 text-teal border border-teal/30'
                : 'text-gray-400 hover:text-white hover:bg-surface-light'
            )}
          >
            {s}
          </button>
        ))}
      </motion.div>

      {/* 2. Forecast KPI Cards */}
      <motion.div variants={fadeUp}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <KPICard
            title="Forecast Revenue"
            value={formatIndianCurrency(adjustedRevenue)}
            change={scenario}
            changeType={scenario === 'Stress' ? 'negative' : 'positive'}
            subtitle="12-month rolling"
            icon={TrendingUp}
          />
          <KPICard
            title="Forecast EBITDA"
            value={formatIndianCurrency(adjustedEbitda)}
            change={`${((adjustedEbitda / adjustedRevenue) * 100).toFixed(1)}% margin`}
            changeType={scenario === 'Stress' ? 'negative' : 'positive'}
            subtitle="Operating profit forecast"
            icon={Landmark}
          />
          <KPICard
            title="Ending Cash"
            value={formatIndianCurrency(adjustedCash)}
            changeType={adjustedCash > 10000000 ? 'positive' : 'negative'}
            subtitle="Projected closing balance"
            icon={Wallet}
          />
          <KPICard
            title="Runway"
            value={preset.runway}
            changeType={scenario === 'Stress' ? 'negative' : 'positive'}
            subtitle="Months of operating cover"
            icon={Hourglass}
          />
          <KPICard
            title="CCC"
            value={`${adjustedCCC}d`}
            change="Target: 58d"
            changeType={adjustedCCC <= 65 ? 'positive' : 'negative'}
            subtitle="Cash conversion cycle"
            icon={Timer}
          />
        </div>
      </motion.div>

      {/* AI Insight Banner */}
      <AIInsightBanner
        insights={[
          "Base case projects ₹9.0 Cr revenue by Jun 2026, representing 3.4% CAGR from current ₹8.7 Cr. EBITDA margin expansion to 25.6% driven by operating leverage.",
          "Stress scenario reveals 8-month runway at current burn — recommend maintaining minimum ₹1.2 Cr cash reserve. The primary risk driver is a 33% revenue decline to ₹5.8 Cr.",
          "CCC improvement from 78 to 58 days would release ₹6.8 Cr in working capital — equivalent to 9 months of additional runway in the stress scenario."
        ]}
      />

      {/* 3. Rolling Forecast Chart */}
      <motion.div variants={fadeUp} className="glass-card p-6">
        <h2 className="section-title mb-6 flex items-center gap-2">
          <BarChart3 size={20} className="text-teal" />
          Rolling 12-Month Forecast
        </h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={forecastData} onClick={(e: any) => {
              if (e?.activeTooltipIndex !== undefined) setSelectedMonth(e.activeTooltipIndex);
            }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2040" />
              <XAxis dataKey="month" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} unit=" Cr" />
              <Tooltip content={<ForecastTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12, color: '#9ca3af' }} />
              <Line type="monotone" dataKey="Revenue" stroke="#00D4B4" strokeWidth={2.5} dot={{ r: 3, fill: '#00D4B4' }} activeDot={{ r: 6, stroke: '#00D4B4', strokeWidth: 2 }} animationDuration={1500} />
              <Line type="monotone" dataKey="EBITDA" stroke="#C9A84C" strokeWidth={2} dot={{ r: 2.5, fill: '#C9A84C' }} animationDuration={1700} />
              <Line type="monotone" dataKey="Cash" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 3" dot={{ r: 2, fill: '#94a3b8' }} animationDuration={1900} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-gray-500 mt-2">Click on any data point to view month detail below</p>
      </motion.div>

      {/* 4. Scenario Driver Sliders */}
      <motion.div variants={fadeUp} className="glass-card p-6">
        <h2 className="section-title mb-6 flex items-center gap-2">
          <SlidersHorizontal size={20} className="text-gold" />
          Scenario Drivers
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { label: 'Revenue Growth %', key: 'revenueGrowth' as const, min: -20, max: 40, unit: '%' },
            { label: 'Margin Lift (pts)', key: 'marginLift' as const, min: -5, max: 10, unit: 'pts' },
            { label: 'Opex Change %', key: 'opexChange' as const, min: -20, max: 20, unit: '%' },
            { label: 'DSO Change (days)', key: 'dsoChange' as const, min: -20, max: 20, unit: 'd' },
            { label: 'DPO Change (days)', key: 'dpoChange' as const, min: -20, max: 20, unit: 'd' },
            { label: 'DIO Change (days)', key: 'dioChange' as const, min: -20, max: 20, unit: 'd' },
          ].map(({ label, key, min, max, unit }) => (
            <div key={key}>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">{label}</span>
                <span className={cn('font-mono font-medium', drivers[key] > 0 ? 'text-teal' : drivers[key] < 0 ? 'text-red-400' : 'text-white')}>
                  {drivers[key] > 0 ? '+' : ''}{drivers[key]}{unit}
                </span>
              </div>
              <input
                type="range"
                min={min}
                max={max}
                value={drivers[key]}
                onChange={(e) => setDrivers({ ...drivers, [key]: Number(e.target.value) })}
                className="w-full h-1.5 bg-surface-light rounded-full appearance-none cursor-pointer accent-teal"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{min}{unit}</span>
                <span>{max}{unit}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* 5. Driver Bridge Waterfall */}
      <motion.div variants={fadeUp} className="glass-card p-6">
        <h2 className="section-title mb-6 flex items-center gap-2">
          <TrendingUp size={20} className="text-teal" />
          Driver Bridge — Base to Forecast
        </h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={waterfallData} barSize={40}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2040" vertical={false} />
              <XAxis dataKey="step" tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} interval={0} angle={-15} textAnchor="end" height={50} />
              <YAxis tickFormatter={(v) => formatIndianCurrency(v)} tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<BridgeTooltip />} />
              <Bar dataKey="end" radius={[4, 4, 0, 0]} animationDuration={1200}>
                {waterfallData.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} fillOpacity={entry.isTotal ? 1 : 0.85} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center gap-6 mt-3 text-xs text-gray-500">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-gold" /> Total</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-teal" /> Positive Impact</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-red-400" /> Negative Impact</span>
        </div>
      </motion.div>

      {/* 6. Month Lens */}
      <motion.div variants={fadeUp} className="glass-card p-6 border-l-2 border-l-gold">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-gold/10 shrink-0">
            <Eye size={24} className="text-gold" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="section-title">Month Lens</h2>
              <div className="flex gap-1 overflow-x-auto">
                {monthLabels.map((label, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedMonth(i)}
                    className={cn(
                      'px-2 py-1 rounded text-xs font-mono transition-all',
                      selectedMonth === i
                        ? 'bg-gold/20 text-gold border border-gold/30'
                        : 'text-gray-500 hover:text-gray-300 hover:bg-surface-light'
                    )}
                  >
                    {label.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="glass-card p-3">
                <p className="text-xs text-gray-400 mb-1">Revenue</p>
                <p className="font-mono text-lg text-teal font-semibold">₹{forecastData[selectedMonth]?.Revenue} Cr</p>
              </div>
              <div className="glass-card p-3">
                <p className="text-xs text-gray-400 mb-1">EBITDA</p>
                <p className="font-mono text-lg text-gold font-semibold">₹{forecastData[selectedMonth]?.EBITDA} Cr</p>
              </div>
              <div className="glass-card p-3">
                <p className="text-xs text-gray-400 mb-1">Cash</p>
                <p className="font-mono text-lg text-white font-semibold">₹{forecastData[selectedMonth]?.Cash} Cr</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Brain size={14} className="text-teal mt-0.5 shrink-0" />
                <p className="text-sm text-gray-300 leading-relaxed">{currentNarrative.narrative}</p>
              </div>
              <div className="glass-card p-3 bg-gold/5 border-gold/20">
                <p className="text-xs text-gold leading-relaxed">{currentNarrative.wcComment}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FPandA;
