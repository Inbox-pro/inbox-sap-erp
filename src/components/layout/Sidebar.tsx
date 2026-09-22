import React, { useState } from 'react';
import { useERP, ERPNavModule } from '../../context/ERPContext';
import {
  LayoutDashboard,
  Building,
  Users,
  Building2,
  Package,
  Boxes,
  ShoppingBag,
  ShoppingCart,
  Receipt,
  CreditCard,
  UserCheck,
  FileCheck,
  BarChart3,
  Bell,
  History,
  Settings,
  ChevronLeft,
  ChevronRight,
  X,
  Search,
  Shield,
  Activity
} from 'lucide-react';
import { InboxERPLogo } from '../common/InboxERPLogo';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  id: ERPNavModule;
  label: string;
  shortLabel?: string;
  icon: React.ElementType;
  badge?: number | string;
  badgeType?: 'warning' | 'danger' | 'info' | 'neutral';
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const {
    activeTab,
    setActiveTab,
    hasPermission,
    approvalTasks,
    unreadNotificationCount,
    products,
    currentUser,
    setIsNotificationsOpen,
  } = useERP();

  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [filterQuery, setFilterQuery] = useState<string>('');

  const pendingApprovalsCount = approvalTasks.filter((t) => t.status === 'Pending').length;
  const lowStockCount = products.filter((p) => p.currentStock <= p.minStockLevel).length;

  const navGroups: NavGroup[] = [
    {
      group: 'Overview',
      items: [
        { id: 'dashboard', label: 'Executive Dashboard', shortLabel: 'Dashboard', icon: LayoutDashboard },
      ],
    },
    {
      group: 'Master Data',
      items: [
        { id: 'organization', label: 'Organization Master', shortLabel: 'Organization', icon: Building },
        { id: 'customers', label: 'Customer Master', shortLabel: 'Customers', icon: Users },
        { id: 'vendors', label: 'Vendor Master', shortLabel: 'Vendors', icon: Building2 },
        { id: 'products', label: 'Product & Item Master', shortLabel: 'Products', icon: Package },
      ],
    },
    {
      group: 'Supply Chain & Sales',
      items: [
        {
          id: 'inventory',
          label: 'Inventory & Warehouses',
          shortLabel: 'Inventory',
          icon: Boxes,
          badge: lowStockCount > 0 ? `${lowStockCount} low` : undefined,
          badgeType: 'warning',
        },
        { id: 'procurement', label: 'Procurement (P2P)', shortLabel: 'Procurement', icon: ShoppingBag },
        { id: 'sales', label: 'Sales & Delivery (O2C)', shortLabel: 'Sales', icon: ShoppingCart },
      ],
    },
    {
      group: 'Finance & Accounts',
      items: [
        { id: 'invoices', label: 'Invoices & Billing', shortLabel: 'Invoices', icon: Receipt },
        { id: 'finance', label: 'Financial Accounting & Cash', shortLabel: 'Finance', icon: CreditCard },
      ],
    },
    {
      group: 'Workforce & Governance',
      items: [
        { id: 'hr', label: 'HR & Workforce', shortLabel: 'HR Hub', icon: UserCheck },
        {
          id: 'approvals',
          label: 'Approval Center',
          shortLabel: 'Approvals',
          icon: FileCheck,
          badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined,
          badgeType: 'danger',
        },
      ],
    },
    {
      group: 'Intelligence & Control',
      items: [
        { id: 'reports', label: 'Reports & Analytics', shortLabel: 'Analytics', icon: BarChart3 },
        {
          id: 'notifications',
          label: 'Alerts & Notifications',
          shortLabel: 'Alerts',
          icon: Bell,
          badge: unreadNotificationCount > 0 ? unreadNotificationCount : undefined,
          badgeType: 'info',
        },
        { id: 'audit-logs', label: 'Immutable Audit Trail', shortLabel: 'Audit Logs', icon: History },
        { id: 'settings', label: 'System Configurations', shortLabel: 'Settings', icon: Settings },
      ],
    },
  ];

  const handleSelectModule = (id: ERPNavModule) => {
    if (id === 'notifications') {
      setIsNotificationsOpen(true);
    } else {
      setActiveTab(id);
    }
    onClose();
  };

  const getBadgeStyle = (badgeType?: 'warning' | 'danger' | 'info' | 'neutral', isActive?: boolean) => {
    if (isActive) {
      return 'bg-white text-blue-700 font-bold shadow-xs';
    }
    switch (badgeType) {
      case 'warning':
        return 'bg-amber-500/20 text-amber-300 border border-amber-500/30';
      case 'danger':
        return 'bg-rose-500/20 text-rose-300 border border-rose-500/30';
      case 'info':
        return 'bg-blue-500/20 text-blue-300 border border-blue-500/30';
      default:
        return 'bg-slate-700 text-slate-300 border border-slate-600';
    }
  };

  const filteredGroups = navGroups
    .map((group) => {
      const permitted = group.items.filter((item) => hasPermission(item.id));
      if (!filterQuery.trim()) {
        return { ...group, items: permitted };
      }
      const matched = permitted.filter(
        (item) =>
          item.label.toLowerCase().includes(filterQuery.toLowerCase()) ||
          (item.shortLabel && item.shortLabel.toLowerCase().includes(filterQuery.toLowerCase()))
      );
      return { ...group, items: matched };
    })
    .filter((group) => group.items.length > 0);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-xs transition-opacity lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-slate-900 border-r border-slate-800 text-slate-300 shadow-2xl transition-all duration-300 ease-in-out lg:static lg:z-auto lg:shadow-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'w-20' : 'w-64'}`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/90 bg-slate-950/70 shrink-0">
          <div className="flex items-center min-w-0 overflow-hidden">
            {isCollapsed ? (
              <div className="mx-auto flex items-center justify-center cursor-pointer" onClick={() => setIsCollapsed(false)} title="Expand Sidebar">
                <InboxERPLogo size="sm" inverted={true} iconOnly={true} />
              </div>
            ) : (
              <InboxERPLogo size="sm" inverted={true} showSubtitle={true} />
            )}
          </div>

          {/* Header Controls: Collapse toggle on Desktop & Close on Mobile */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex items-center justify-center p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Optional Quick Module Filter (when expanded) */}
        {!isCollapsed && (
          <div className="px-3 pt-3 pb-1 shrink-0">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Filter modules..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-950/60 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
              {filterQuery && (
                <button
                  type="button"
                  onClick={() => setFilterQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        )}

        {/* Scrollable Navigation Groups */}
        <nav className="flex-1 overflow-y-auto px-2.5 py-3 space-y-4 custom-scrollbar">
          {filteredGroups.map((group) => (
            <div key={group.group} className="space-y-1">
              {/* Group Title (hidden when collapsed) */}
              {!isCollapsed && (
                <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                  {group.group}
                </div>
              )}

              {/* Group Divider when collapsed */}
              {isCollapsed && <div className="h-px bg-slate-800/80 my-2 mx-1" />}

              {/* Group Nav Items */}
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectModule(item.id)}
                      title={isCollapsed ? item.label : undefined}
                      className={`group relative w-full flex items-center rounded-xl transition-all duration-150 ${
                        isCollapsed
                          ? 'justify-center p-2.5'
                          : 'justify-between px-3 py-2 text-xs'
                      } ${
                        isActive
                          ? 'bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-md shadow-blue-600/20'
                          : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                      }`}
                    >
                      {/* Active Left Indicator Pill */}
                      {isActive && (
                        <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-white shadow-xs" />
                      )}

                      <div className={`flex items-center gap-2.5 min-w-0 ${isCollapsed ? 'justify-center' : ''}`}>
                        <Icon
                          className={`shrink-0 transition-transform group-hover:scale-105 ${
                            isCollapsed ? 'w-5 h-5' : 'w-4 h-4'
                          } ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'}`}
                        />
                        {!isCollapsed && (
                          <span className="truncate tracking-wide">{item.label}</span>
                        )}
                      </div>

                      {/* Badge for notifications, approvals, low stock */}
                      {item.badge !== undefined && (
                        <>
                          {!isCollapsed ? (
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 tracking-tight ${getBadgeStyle(
                                item.badgeType,
                                isActive
                              )}`}
                            >
                              {item.badge}
                            </span>
                          ) : (
                            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-slate-900" />
                          )}
                        </>
                      )}

                      {/* Tooltip on Hover for Collapsed Mode */}
                      {isCollapsed && (
                        <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-950 text-white text-xs font-medium rounded-md shadow-xl border border-slate-700 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 flex items-center gap-2">
                          <span>{item.label}</span>
                          {item.badge !== undefined && (
                            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${getBadgeStyle(item.badgeType, false)}`}>
                              {item.badge}
                            </span>
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {filteredGroups.length === 0 && (
            <div className="py-6 text-center text-xs text-slate-500">
              No matching modules found
            </div>
          )}
        </nav>

        {/* User Card & System Status Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60 shrink-0">
          {!isCollapsed ? (
            <div className="space-y-2">
              {/* User summary */}
              <div className="flex items-center gap-2.5 px-1">
                <div className="w-8 h-8 rounded-full bg-linear-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 ring-2 ring-slate-700">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold text-white truncate leading-tight">
                    {currentUser.name}
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      {currentUser.role}
                    </span>
                    <span className="text-[10px] text-slate-400 truncate">{currentUser.department}</span>
                  </div>
                </div>
              </div>

              {/* System Connection Badge */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 px-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-mono">v1.2.0-live</span>
                </div>
                <span className="text-slate-400 font-mono">ERP Enterprise</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 py-1">
              <div
                className="w-8 h-8 rounded-full bg-linear-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center ring-2 ring-slate-700"
                title={`${currentUser.name} (${currentUser.role})`}
              >
                {currentUser.name.charAt(0)}
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400" title="Connected" />
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
