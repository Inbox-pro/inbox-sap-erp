import React, { useState, useEffect, useRef } from 'react';
import { useERP } from '../../context/ERPContext';
import { demoUsers } from '../../data/mockData';
import { UserRole } from '../../types/erp';
import {
  Search,
  Bell,
  Building,
  ChevronDown,
  Shield,
  Menu,
  BookOpen,
  LogOut,
  Layers,
  ChevronRight
} from 'lucide-react';
import { NotificationPopover } from '../common/NotificationPopover';
import { InboxERPLogo } from '../common/InboxERPLogo';

interface TopNavProps {
  onToggleSidebar: () => void;
  onOpenSearch: () => void;
  onOpenArchitecture: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  onToggleSidebar,
  onOpenSearch,
  onOpenArchitecture,
}) => {
  const {
    currentUser,
    login,
    logout,
    company,
    branches,
    unreadNotificationCount,
    activeTab,
    isNotificationsOpen,
    setIsNotificationsOpen,
  } = useERP();

  const [selectedBranch, setSelectedBranch] = useState<string>(branches[0]?.name || 'Mumbai Corporate HQ');
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsRoleDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onOpenSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenSearch]);

  const moduleInfo: Record<string, { title: string; category: string }> = {
    dashboard: { title: 'Executive Overview', category: 'Dashboard' },
    organization: { title: 'Organization Master', category: 'Master Data' },
    customers: { title: 'Customer Master', category: 'Master Data' },
    vendors: { title: 'Vendor Master', category: 'Master Data' },
    products: { title: 'Product & Item Master', category: 'Master Data' },
    inventory: { title: 'Inventory & Warehouses', category: 'Supply Chain' },
    procurement: { title: 'Procurement (P2P)', category: 'Supply Chain' },
    sales: { title: 'Sales & Delivery (O2C)', category: 'Supply Chain' },
    invoices: { title: 'Invoices & Billing', category: 'Finance' },
    finance: { title: 'Financial Accounting & Cash', category: 'Finance' },
    hr: { title: 'HR & Workforce', category: 'Human Capital' },
    approvals: { title: 'Approval Center', category: 'Governance' },
    reports: { title: 'Reports & Analytics', category: 'Intelligence' },
    notifications: { title: 'Alerts & Notifications', category: 'Intelligence' },
    'audit-logs': { title: 'Immutable Audit Trail', category: 'Governance' },
    settings: { title: 'System Configurations', category: 'Admin' },
  };

  const currentMod = moduleInfo[activeTab] || { title: 'Enterprise Portal', category: 'ERP' };

  const roleColors: Record<UserRole, string> = {
    ADMIN: 'bg-purple-100 text-purple-800 border-purple-200',
    MANAGER: 'bg-blue-100 text-blue-800 border-blue-200',
    FINANCE: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    HR: 'bg-teal-100 text-teal-800 border-teal-200',
    EMPLOYEE: 'bg-slate-100 text-slate-800 border-slate-200',
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
      <div className="px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left Side: On Mobile shows Hamburger + Logo; On Desktop shows Module Breadcrumb */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Mobile menu button */}
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Open Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Mobile only logo */}
          <div className="lg:hidden flex items-center">
            <InboxERPLogo size="sm" showSubtext={false} />
          </div>

          {/* Desktop Breadcrumb & Entity Context (Logo is already in the Sidebar) */}
          <div className="hidden lg:flex items-center gap-2.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <span className="text-slate-400 font-medium">{currentMod.category}</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
              <span className="text-slate-900 font-bold text-sm tracking-tight">
                {currentMod.title}
              </span>
            </div>

            <div className="h-4 w-px bg-slate-200 mx-1" />

            <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100/80 px-2.5 py-1 rounded-md border border-slate-200/60">
              <Building className="w-3.5 h-3.5 text-blue-600" />
              <span className="font-medium text-slate-700">{company.name}</span>
              <span className="text-slate-400 text-[10px] font-mono">• FY 24-25</span>
            </div>
          </div>
        </div>

        {/* Center: Global Search Bar */}
        <div className="flex-1 max-w-md hidden md:block">
          <button
            type="button"
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-3.5 py-2 text-xs text-slate-500 bg-slate-100/80 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all shadow-2xs group"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
              <span>Search customers, orders, inventory, invoices...</span>
            </div>
            <kbd className="text-[10px] uppercase font-mono px-2 py-0.5 bg-white text-slate-500 rounded border border-slate-200 shadow-2xs">
              Ctrl+K
            </kbd>
          </button>
        </div>

        {/* Right Side: Branch selector, Architecture, Notifications, User & Role Switcher */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Mobile search trigger */}
          <button
            onClick={onOpenSearch}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Branch Selector */}
          <div className="hidden xl:flex items-center text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
            <span className="text-slate-400 mr-1.5">Branch:</span>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="bg-transparent font-medium text-slate-800 focus:outline-hidden cursor-pointer text-xs"
            >
              {branches.map((b) => (
                <option key={b.id} value={b.name}>
                  {b.name} ({b.city})
                </option>
              ))}
            </select>
          </div>

          {/* Architecture / Spec Doc Button */}
          <button
            onClick={onOpenArchitecture}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-colors cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Architecture & API</span>
          </button>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotificationCount > 0 && (
                <span className="absolute top-1 right-1 flex items-center justify-center min-w-4 h-4 px-1 text-[10px] font-bold text-white bg-rose-600 rounded-full border-2 border-white animate-pulse">
                  {unreadNotificationCount}
                </span>
              )}
            </button>

            <NotificationPopover
              isOpen={isNotificationsOpen}
              onClose={() => setIsNotificationsOpen(false)}
            />
          </div>

          {/* User Role Switcher Dropdown (Interactive RBAC Demo) */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-slate-100 border border-slate-200/80 bg-white transition-all text-left shadow-2xs cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-linear-to-tr from-slate-900 to-slate-800 text-white font-bold text-xs flex items-center justify-center shrink-0">
                {currentUser.name.charAt(0)}
              </div>
              <div className="hidden sm:block">
                <div className="text-xs font-bold text-slate-900 leading-tight">
                  {currentUser.name}
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${
                      roleColors[currentUser.role]
                    }`}
                  >
                    {currentUser.role}
                  </span>
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
            </button>

            {isRoleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                <div className="p-3 bg-slate-50 border-b border-slate-100">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                    <Shield className="w-3.5 h-3.5 text-blue-600" />
                    <span>RBAC Role Switcher (POC Demo)</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Switch user role to test granular module view permissions:
                  </p>
                </div>

                <div className="p-1 space-y-0.5">
                  {demoUsers.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => {
                        login(user.role);
                        setIsRoleDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-lg text-xs font-medium transition-colors text-left ${
                        currentUser.role === user.role
                          ? 'bg-blue-50 text-blue-700 font-bold'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="truncate">{user.name}</div>
                        <div className="text-[10px] text-slate-400 font-normal">{user.department}</div>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ml-2 ${
                          roleColors[user.role]
                        }`}
                      >
                        {user.role}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="p-2 border-t border-slate-100 bg-slate-50">
                  <button
                    onClick={() => {
                      logout();
                      setIsRoleDropdownOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Simulate Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
