import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { demoUsers } from '../../data/mockData';
import { UserRole } from '../../types/erp';
import { InboxERPLogo } from '../common/InboxERPLogo';
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Sun,
  Moon,
  Building2,
  CheckCircle2,
  UserCheck,
  Zap,
  Eye,
  EyeOff,
  Server,
  Layers,
  Sparkles
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, theme, toggleTheme, company, branches } = useERP();

  const [activeTab, setActiveTab] = useState<'persona' | 'credentials'>('persona');
  const [selectedRole, setSelectedRole] = useState<UserRole>('ADMIN');
  const [email, setEmail] = useState<string>('rajesh.sharma@inboxerp.com');
  const [password, setPassword] = useState<string>('Enterprise@2025');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [selectedBranch, setSelectedBranch] = useState<string>(branches[0]?.name || 'Mumbai Corporate HQ');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handlePersonaLogin = (role: UserRole) => {
    setIsLoading(true);
    setErrorMessage('');
    setTimeout(() => {
      login(role);
      setIsLoading(false);
    }, 400);
  };

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please provide both official email address and password.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setTimeout(() => {
      // Find matching demo user or use selected role
      const matched = demoUsers.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() || u.role === selectedRole
      );
      login(matched ? matched.role : selectedRole);
      setIsLoading(false);
    }, 450);
  };

  const roleBadges: Record<UserRole, { label: string; color: string; desc: string }> = {
    ADMIN: {
      label: 'Super Admin',
      color: 'bg-purple-100 text-purple-800 dark:bg-purple-950/70 dark:text-purple-300 border-purple-200 dark:border-purple-800',
      desc: 'Unrestricted control over all business modules, approvals & audit logs'
    },
    MANAGER: {
      label: 'Operations Director',
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300 border-blue-200 dark:border-blue-800',
      desc: 'Manages Procurement, Sales, Inventory movements & team requisitions'
    },
    FINANCE: {
      label: 'Finance Lead',
      color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
      desc: 'Invoicing, double-entry ledgers, vouchers, payments & financial reporting'
    },
    HR: {
      label: 'HR Manager',
      color: 'bg-teal-100 text-teal-800 dark:bg-teal-950/70 dark:text-teal-300 border-teal-200 dark:border-teal-800',
      desc: 'Employee directory, attendance registry, leave authorization & payroll'
    },
    EMPLOYEE: {
      label: 'Operations Staff',
      color: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
      desc: 'Daily order entries, inventory check-in and basic request submissions'
    },
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 selection:bg-blue-600 selection:text-white">
      {/* Top Header Bar */}
      <header className="w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
        <div className="flex items-center gap-3">
          <InboxERPLogo size="sm" showSubtext={true} />
          <div className="hidden md:flex items-center gap-2 pl-3 border-l border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <Building2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>{company.name}</span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="font-mono text-[11px] text-slate-400">Enterprise POC v2.5</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Theme Switcher Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            id="login-theme-toggle-btn"
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all shadow-2xs cursor-pointer"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-blue-600" />
                <span className="hidden sm:inline">Dark Mode</span>
              </>
            )}
          </button>

          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/80">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Connected to Local ERP Core</span>
          </div>
        </div>
      </header>

      {/* Main Login Workspace */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
            {/* Left Column: Brand, Context & Highlights */}
            <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900 text-white p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold mb-4">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  <span>Interactive Proof-of-Concept</span>
                </div>

                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
                  Enterprise ERP Solution
                </h1>
                <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Unified enterprise resource platform interconnecting Sales (O2C), Procurement (P2P), Warehouses, Double-Entry Finance, and Human Capital.
                </p>

                <div className="mt-8 space-y-3.5">
                  <div className="flex items-start gap-3 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-white">Cross-Module Data Continuity:</span>
                      <p className="text-slate-400 text-[11px] mt-0.5">PO goods receipt automatically adjusts stock ledger, posts invoice & audit logs.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-white">Role-Based Access Governance:</span>
                      <p className="text-slate-400 text-[11px] mt-0.5">Custom permission matrices tailored for Super Admin, Finance, Ops & HR.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-white">India Financial Compliance:</span>
                      <p className="text-slate-400 text-[11px] mt-0.5">GST HSN codes, PAN numbers, and INR (₹) double-entry ledger vouchers.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom security badges */}
              <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                  <span>TLS 256-Bit Secured</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Server className="w-3.5 h-3.5 text-purple-400" />
                  <span>Modular Monolith</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Login Options */}
            <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      Authentication Portal
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Select an enterprise persona or sign in with corporate credentials
                    </p>
                  </div>
                </div>

                {/* Authentication Method Tabs */}
                <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-5 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setActiveTab('persona')}
                    id="tab-persona-btn"
                    className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
                      activeTab === 'persona'
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <span>1-Click Demo Personas (RBAC)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('credentials')}
                    id="tab-credentials-btn"
                    className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
                      activeTab === 'credentials'
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Lock className="w-3.5 h-3.5 text-blue-500" />
                    <span>Standard Credentials</span>
                  </button>
                </div>

                {errorMessage && (
                  <div className="mb-4 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Tab 1: 1-Click Demo Personas */}
                {activeTab === 'persona' && (
                  <div className="space-y-2.5">
                    <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                      <span>Select Role to Test Governance</span>
                      <span className="text-[10px] lowercase text-blue-600 dark:text-blue-400">instant session switch</span>
                    </div>

                    {demoUsers.map((user) => {
                      const badge = roleBadges[user.role];
                      return (
                        <button
                          key={user.id}
                          type="button"
                          disabled={isLoading}
                          onClick={() => handlePersonaLogin(user.role)}
                          id={`persona-login-${user.role.toLowerCase()}`}
                          className="w-full text-left p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/50 hover:bg-blue-50/80 dark:hover:bg-slate-800 hover:border-blue-300 dark:hover:border-blue-700 transition-all flex items-center justify-between group cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-slate-900 dark:bg-slate-700 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-xs text-slate-900 dark:text-white">
                                  {user.name}
                                </span>
                                <span
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded border ${badge.color}`}
                                >
                                  {user.role}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
                                {badge.desc}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors shrink-0">
                            <span className="text-[11px] font-semibold hidden sm:inline">Launch</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Tab 2: Standard Credentials Form */}
                {activeTab === 'credentials' && (
                  <form onSubmit={handleCredentialsSubmit} className="space-y-4 text-xs">
                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                        Corporate Email Address
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@inboxerp.com"
                          id="login-email-input"
                          className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                        Security Password
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••••••"
                          id="login-password-input"
                          className="w-full pl-9 pr-10 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                          Role Context
                        </label>
                        <select
                          value={selectedRole}
                          onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                          id="login-role-select"
                          className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
                        >
                          <option value="ADMIN">Super Admin (Executive)</option>
                          <option value="MANAGER">Operations Manager</option>
                          <option value="FINANCE">Finance Lead</option>
                          <option value="HR">HR Officer</option>
                          <option value="EMPLOYEE">Operations Staff</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                          Branch Location
                        </label>
                        <select
                          value={selectedBranch}
                          onChange={(e) => setSelectedBranch(e.target.value)}
                          className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
                        >
                          {branches.map((b) => (
                            <option key={b.id} value={b.name}>
                              {b.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      id="login-submit-btn"
                      className="w-full mt-2 py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-semibold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Sign In to ERP System</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>

              {/* Bottom Demo Quick Tip */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Default Super Admin: <strong>rajesh.sharma@inboxerp.com</strong></span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
                  <Layers className="w-3.5 h-3.5" />
                  <span>14 Connected Modules Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 py-3 px-4 text-center text-xs text-slate-500 dark:text-slate-400">
        Enterprise ERP Solution – Demo / POC • High-performance in-memory state engine • All workflows synchronized
      </footer>
    </div>
  );
};
