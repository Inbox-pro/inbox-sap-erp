import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import {
  Building,
  MapPin,
  Users2,
  Boxes,
  FileCheck2,
  CheckCircle,
  ExternalLink,
  ShieldCheck,
  Building2,
  Layers
} from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';

export const OrganizationModule: React.FC = () => {
  const { company, branches, departments, warehouses, products } = useERP();
  const [activeSubTab, setActiveSubTab] = useState<'company' | 'branches' | 'departments' | 'warehouses'>('company');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Organization Master</h1>
            <span className="text-xs bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded-full border border-blue-200">
              Multi-Branch Structure
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Configure legal company entities, regional branches, operational departments, and physical storage warehouses.
          </p>
        </div>

        {/* Sub-tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
          {[
            { id: 'company', label: 'Company Master', icon: Building },
            { id: 'branches', label: `Branches (${branches.length})`, icon: MapPin },
            { id: 'departments', label: `Departments (${departments.length})`, icon: Users2 },
            { id: 'warehouses', label: `Warehouses (${warehouses.length})`, icon: Boxes },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Subtab 1: Company Master */}
      {activeSubTab === 'company' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-6">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-mono text-blue-600 font-semibold">LEGAL ENTITY</span>
                <h3 className="text-lg font-bold text-slate-900">{company.name}</h3>
                <p className="text-xs text-slate-500">Corporate Headquarters • Registered Indian Enterprise</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Active & Compliant</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-lg">
                <span className="text-slate-400 font-medium">GST Identification Number (GSTIN)</span>
                <div className="font-mono font-bold text-sm text-slate-900 mt-1">{company.gstNumber}</div>
                <span className="text-[11px] text-slate-500">State Code: 27 (Maharashtra)</span>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-lg">
                <span className="text-slate-400 font-medium">Permanent Account Number (PAN)</span>
                <div className="font-mono font-bold text-sm text-slate-900 mt-1">{company.panNumber}</div>
                <span className="text-[11px] text-slate-500">Corporate Income Tax PAN</span>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-lg">
                <span className="text-slate-400 font-medium">Corporate Identification (CIN)</span>
                <div className="font-mono font-bold text-sm text-slate-900 mt-1">{company.cinNumber}</div>
                <span className="text-[11px] text-slate-500">ROC Mumbai Registered</span>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-lg">
                <span className="text-slate-400 font-medium">Financial Year & Reporting Currency</span>
                <div className="font-mono font-bold text-sm text-slate-900 mt-1">
                  {company.currency} ({company.financialYear})
                </div>
                <span className="text-[11px] text-slate-500">April 1 to March 31</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Registered Office Address</h4>
              <p className="text-xs text-slate-700 bg-slate-50 border border-slate-100 p-3 rounded-lg leading-relaxed">
                {company.address}
              </p>
            </div>
          </div>

          {/* Quick Stats sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Multi-Entity Summary</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-blue-50/60 border border-blue-100 text-xs">
                  <span className="font-medium text-slate-700">Operating Branches</span>
                  <span className="font-mono font-bold text-blue-700">{branches.length} Locations</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-purple-50/60 border border-purple-100 text-xs">
                  <span className="font-medium text-slate-700">Cost Center Departments</span>
                  <span className="font-mono font-bold text-purple-700">{departments.length} Divisions</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-100 text-xs">
                  <span className="font-medium text-slate-700">Fulfilment Warehouses</span>
                  <span className="font-mono font-bold text-emerald-700">{warehouses.length} Nodes</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 text-slate-200 rounded-xl p-5 text-xs space-y-2">
              <div className="flex items-center gap-2 text-indigo-400 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Statutory Compliance Ready</span>
              </div>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                Built for Indian enterprise taxation rules: CGST, SGST, IGST, reverse charge mechanisms, and multi-state billing.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Subtab 2: Branches */}
      {activeSubTab === 'branches' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {branches.map((b) => (
            <div key={b.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-blue-600 px-1.5 py-0.5 rounded bg-blue-50 border border-blue-200">
                    {b.code}
                  </span>
                  <h3 className="font-bold text-sm text-slate-900 mt-2">{b.name}</h3>
                  <p className="text-xs text-slate-500">{b.city}, {b.state}</p>
                </div>
                <StatusBadge status={b.status || 'Active'} size="sm" />
              </div>

              <div className="text-xs space-y-2 pt-2 border-t border-slate-100">
                <div>
                  <span className="text-slate-400">Address:</span>
                  <p className="text-slate-700 mt-0.5 text-[11px] leading-relaxed">{b.address}</p>
                </div>
                <div>
                  <span className="text-slate-400">Branch GSTIN:</span>
                  <p className="font-mono text-slate-800 font-semibold">{b.gstNumber}</p>
                </div>
                <div>
                  <span className="text-slate-400">Branch Manager:</span>
                  <p className="text-slate-800 font-medium">{b.managerName}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Subtab 3: Departments */}
      {activeSubTab === 'departments' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {departments.map((d) => (
            <div key={d.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  {d.code}
                </span>
                <span className="text-xs text-slate-500 font-medium">{d.employeeCount} Members</span>
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">{d.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">Head of Dept: {d.headOfDepartment}</p>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400">Budget Allocation:</span>
                <span className="font-mono font-bold text-slate-800">₹{(d.budget / 100000).toFixed(1)} Lakhs</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Subtab 4: Warehouses */}
      {activeSubTab === 'warehouses' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {warehouses.map((w) => {
            // Calculate total stock items in this warehouse
            const itemsInWh = products.filter((p) => (p.warehouseStock[w.id] || 0) > 0);
            const totalStockUnits = products.reduce((sum, p) => sum + (p.warehouseStock[w.id] || 0), 0);

            return (
              <div key={w.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-emerald-700 px-1.5 py-0.5 rounded bg-emerald-50 border border-emerald-200">
                      {w.code}
                    </span>
                    <h3 className="font-bold text-sm text-slate-900 mt-2">{w.name}</h3>
                    <p className="text-xs text-slate-500">{w.city}, {w.state}</p>
                  </div>
                  <StatusBadge status={w.status || 'Active'} size="sm" />
                </div>

                <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-50 rounded-lg text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase">SKUs Stored</span>
                    <div className="font-bold text-slate-900 text-sm font-mono mt-0.5">
                      {itemsInWh.length} Items
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase">Units in Stock</span>
                    <div className="font-bold text-emerald-700 text-sm font-mono mt-0.5">
                      {totalStockUnits} Units
                    </div>
                  </div>
                </div>

                <div className="text-xs space-y-1 text-slate-600 text-[11px]">
                  <div><span className="text-slate-400">Capacity:</span> {w.capacity}</div>
                  <div><span className="text-slate-400">Facility Manager:</span> {w.managerName}</div>
                  <div><span className="text-slate-400">Address:</span> {w.address}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
