import React, { useState, useEffect } from 'react';
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';
import AIChatWidget from './components/shared/AIChatWidget';
import Login from './pages/Login';
import Overview from './pages/Overview';
import MonthEndClose from './pages/MonthEndClose';
import MISPack from './pages/MISPack';
import Drilldowns from './pages/Drilldowns';
import ReportLibrary from './pages/ReportLibrary';
import FinancialStatements from './pages/FinancialStatements';
import WorkingCapital from './pages/WorkingCapital';
import Sales from './pages/Sales';
import FPandA from './pages/FPandA';
import CostEfficiency from './pages/CostEfficiency';
import BoardPack from './pages/BoardPack';
import Accounting from './pages/Accounting';

const pages: Record<string, React.FC> = {
  overview: Overview,
  accounting: Accounting,
  'month-end': MonthEndClose,
  'mis-pack': MISPack,
  'cost-efficiency': CostEfficiency,
  drilldowns: Drilldowns,
  'report-library': ReportLibrary,
  'board-pack': BoardPack,
  'financial-statements': FinancialStatements,
  'working-capital': WorkingCapital,
  sales: Sales,
  'fp-and-a': FPandA,
};

function App() {
  const [authenticated, setAuthenticated] = useState(() => {
    return localStorage.getItem('bpca-authenticated') === 'true';
  });
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem('bpca-dark-mode');
    return stored !== null ? stored === 'true' : true;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.remove('light');
      root.classList.add('dark');
      document.body.style.backgroundColor = '#0A0F1E';
      document.body.style.color = '#e2e8f0';
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      document.body.style.backgroundColor = '#ffffff';
      document.body.style.color = '#1e3a5f';
    }
    localStorage.setItem('bpca-dark-mode', String(darkMode));
  }, [darkMode]);

  if (!authenticated) {
    return <Login onLogin={() => setAuthenticated(true)} />;
  }

  const ActivePage = pages[activeSection] || Overview;

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: 'var(--body-bg)' }}>
      <Sidebar
        activeSection={activeSection}
        onNavigate={setActiveSection}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
          onNavigate={setActiveSection}
        />
        <main className="flex-1 overflow-y-auto p-6" style={{ backgroundColor: 'var(--body-bg)' }}>
          <ActivePage />
        </main>
      </div>
      <AIChatWidget />
    </div>
  );
}

export default App;
