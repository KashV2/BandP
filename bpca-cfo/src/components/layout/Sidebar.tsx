import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  CalendarCheck,
  FileBarChart,
  Search,
  Library,
  FileText,
  Wallet,
  TrendingUp,
  LineChart,
  Settings,
  HelpCircle,
  User,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  PieChart,
  Presentation,
  BookOpen,
} from 'lucide-react';
import { cn } from '../../utils/format';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

interface NavGroup {
  id: string;
  label: string;
  icon: React.ElementType;
  children: NavItem[];
}

interface SidebarProps {
  activeSection: string;
  onNavigate: (section: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const topLevelItems: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
];

const navGroups: NavGroup[] = [
  {
    id: 'accounting',
    label: 'Accounting',
    icon: BookOpen,
    children: [
      { id: 'accounting', label: 'Vouchers & Dashboard', icon: BookOpen },
    ],
  },
  {
    id: 'financial',
    label: 'Financial',
    icon: FileText,
    children: [
      { id: 'month-end', label: 'Month-End Close', icon: CalendarCheck },
      { id: 'mis-pack', label: 'MIS Pack', icon: FileBarChart },
      { id: 'cost-efficiency', label: 'Cost Efficiency', icon: PieChart },
      { id: 'financial-statements', label: 'Financial Statements', icon: FileText },
    ],
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: TrendingUp,
    children: [
      { id: 'drilldowns', label: 'Drilldowns', icon: Search },
      { id: 'working-capital', label: 'Working Capital', icon: Wallet },
      { id: 'sales', label: 'Sales', icon: TrendingUp },
      { id: 'fp-and-a', label: 'FP&A', icon: LineChart },
    ],
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: Library,
    children: [
      { id: 'report-library', label: 'Report Library', icon: Library },
      { id: 'board-pack', label: 'Board Pack', icon: Presentation },
    ],
  },
];

const bottomNavItems: NavItem[] = [
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'help', label: 'Help', icon: HelpCircle },
  { id: 'profile', label: 'User Profile', icon: User },
];

function getGroupForSection(sectionId: string): string | null {
  for (const g of navGroups) {
    if (g.children.some(c => c.id === sectionId)) return g.id;
  }
  return null;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onNavigate,
  collapsed,
  onToggleCollapse,
}) => {
  const activeGroup = getGroupForSection(activeSection);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    navGroups.forEach(g => { init[g.id] = g.children.some(c => c.id === activeSection); });
    return init;
  });

  const toggleGroup = (groupId: string) => {
    setOpenGroups(prev => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const renderNavItem = (item: NavItem, indent: boolean = false) => {
    const isActive = activeSection === item.id;
    const Icon = item.icon;

    return (
      <button
        key={item.id}
        onClick={() => onNavigate(item.id)}
        className={cn(
          'w-full',
          isActive ? 'sidebar-item-active' : 'sidebar-item',
          collapsed && 'justify-center px-0',
          indent && !collapsed && 'pl-10'
        )}
        title={collapsed ? item.label : undefined}
      >
        <Icon size={indent ? 16 : 20} className="flex-shrink-0" />
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className={cn('whitespace-nowrap overflow-hidden', indent ? 'text-xs' : 'text-sm')}
            >
              {item.label}
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    );
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 256 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="h-screen border-r flex flex-col overflow-hidden flex-shrink-0 print:hidden"
      style={{ backgroundColor: 'var(--sidebar-bg)', borderColor: 'var(--card-border)' }}
    >
      {/* Collapse toggle */}
      <div className={cn('flex items-center px-3 py-4', collapsed ? 'justify-center' : 'justify-end')}>
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-surface-light transition-colors"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Main navigation */}
      <nav className="flex-1 px-2 space-y-1 overflow-y-auto">
        {/* Top-level items (Overview) */}
        {topLevelItems.map(item => renderNavItem(item))}

        {/* Grouped sections */}
        {navGroups.map(group => {
          const isGroupOpen = openGroups[group.id] || false;
          const isGroupActive = activeGroup === group.id;
          const GroupIcon = group.icon;

          return (
            <div key={group.id}>
              {/* Group header */}
              <button
                onClick={() => {
                  if (collapsed) {
                    onNavigate(group.children[0].id);
                  } else {
                    toggleGroup(group.id);
                  }
                }}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 cursor-pointer',
                  isGroupActive
                    ? 'text-teal bg-teal/5'
                    : 'text-gray-400 hover:text-white hover:bg-surface-light',
                  collapsed && 'justify-center px-0'
                )}
                title={collapsed ? group.label : undefined}
              >
                <GroupIcon size={20} className="flex-shrink-0" />
                <AnimatePresence mode="wait">
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-sm font-medium whitespace-nowrap overflow-hidden flex-1 text-left uppercase tracking-wider"
                    >
                      {group.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {!collapsed && (
                  <motion.div
                    animate={{ rotate: isGroupOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown size={14} className="text-gray-500" />
                  </motion.div>
                )}
              </button>

              {/* Group children (expanded) */}
              <AnimatePresence initial={false}>
                {isGroupOpen && !collapsed && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="mt-0.5 space-y-0.5">
                      {group.children.map(child => renderNavItem(child, true))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="mx-4 border-t border-surface-border/30" />

      {/* Bottom navigation */}
      <div className="px-2 py-3 space-y-1">
        {bottomNavItems.map(item => renderNavItem(item))}
      </div>
    </motion.aside>
  );
};

export default Sidebar;
