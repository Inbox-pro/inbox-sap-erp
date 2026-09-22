import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import {
  ShieldAlert,
  Search,
  Filter,
  Clock,
  UserCheck,
  Laptop,
  ArrowUpDown,
  FileSpreadsheet
} from 'lucide-react';

export const AuditModule: React.FC = () => {
  const { auditLogs } = useERP();

  const [searchTerm, setSearchTerm] = useState('');
  const [moduleFilter, setModuleFilter] = useState('All');
  const [actionFilter, setActionFilter] = useState('All');

  const modules = ['All', 'Sales', 'Procurement', 'Inventory', 'Finance', 'HR', 'Master Data', 'Approval'];
  const actions = ['All', 'Created', 'Approved', 'Delivered', 'Received', 'Paid', 'Transferred', 'Adjusted', 'Onboarded'];

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      (log.description ? log.description.toLowerCase().includes(searchTerm.toLowerCase()) : false) ||
      (log.action && log.action.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.userName && log.userName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.recordId && log.recordId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.entityId ? log.entityId.toLowerCase().includes(searchTerm.toLowerCase()) : false) ||
      log.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesModule = moduleFilter === 'All' || log.module === moduleFilter;
    const matchesAction = actionFilter === 'All' || log.action === actionFilter;
    return matchesSearch && matchesModule && matchesAction;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Enterprise Audit Trail & Governance Log
            </h1>
            <span className="text-xs bg-slate-900 text-white font-semibold px-2 py-0.5 rounded-full">
              Immutable Log ({auditLogs.length} Events)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Tamper-evident record of all transactions, approvals, stock movements, and financial postings across every module.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Compliance Logging: Active</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by action, user, or entity ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            className="text-xs p-1.5 border border-slate-200 rounded-md bg-slate-50"
          >
            {modules.map((m) => (
              <option key={m} value={m}>
                Module: {m}
              </option>
            ))}
          </select>

          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="text-xs p-1.5 border border-slate-200 rounded-md bg-slate-50"
          >
            {actions.map((a) => (
              <option key={a} value={a}>
                Action: {a}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Log ID</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Operator / User</th>
                <th className="py-3 px-4">Module</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Target Entity</th>
                <th className="py-3 px-4">Event Description</th>
                <th className="py-3 px-4 text-right">Client Terminal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400 font-sans text-xs">
                    No audit records found matching current query.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 text-slate-500 font-semibold">
                      {log.id}
                    </td>
                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="py-3 px-4 font-sans font-medium text-slate-900">
                      <div>{log.userName}</div>
                      <div className="text-[10px] font-mono text-slate-400">{log.userId}</div>
                    </td>
                    <td className="py-3 px-4 font-sans">
                      <span className="px-2 py-0.5 rounded bg-slate-100 font-semibold text-slate-700">
                        {log.module}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-sans">
                      <span
                        className={`px-2 py-0.5 rounded font-bold text-[10px] uppercase ${
                          log.action === 'Created'
                            ? 'bg-blue-50 text-blue-700'
                            : log.action === 'Approved'
                            ? 'bg-emerald-50 text-emerald-700'
                            : log.action === 'Delivered'
                            ? 'bg-cyan-50 text-cyan-700'
                            : log.action === 'Received'
                            ? 'bg-purple-50 text-purple-700'
                            : log.action === 'Paid'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-blue-600 font-semibold">
                      {log.entityId}
                    </td>
                    <td className="py-3 px-4 font-sans text-slate-700 max-w-[280px]">
                      {log.description}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-400">
                      {log.ipAddress}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
