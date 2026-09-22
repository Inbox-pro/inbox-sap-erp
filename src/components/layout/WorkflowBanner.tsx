import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import {
  Play,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  ShoppingCart,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  BookOpen
} from 'lucide-react';

interface WorkflowBannerProps {
  onOpenArchitecture: () => void;
}

export const WorkflowBanner: React.FC<WorkflowBannerProps> = ({ onOpenArchitecture }) => {
  const {
    runFullPurchaseDemo,
    runFullSalesDemo,
    isSimulating,
    resetAllDemoData,
    setActiveTab,
  } = useERP();

  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [selectedFlow, setSelectedFlow] = useState<'purchase' | 'sales'>('purchase');

  return (
    <aside aria-label="End-to-end interactive demo flows" className="bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border-b border-indigo-900/60 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Title & Badge */}
          <div className="flex items-center gap-2.5">
            <span className="flex items-center justify-center w-6 h-6 rounded-md bg-indigo-500/20 text-indigo-400 border border-indigo-400/30">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xs font-bold tracking-wide uppercase text-indigo-200">
                  Interactive End-to-End ERP Demonstration
                </h2>
                <span className="text-[10px] bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 font-semibold px-1.5 py-0.2 rounded">
                  Live POC
                </span>
              </div>
              <p className="text-[11px] text-slate-300 hidden sm:block">
                Demonstrates cross-module reactivity: PO receipts increase stock & generate AP bills; SO delivery deducts stock & invoices clients.
              </p>
            </div>
          </div>

          {/* Action Triggers */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => runFullPurchaseDemo()}
              disabled={isSimulating}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs transition-all disabled:opacity-50 cursor-pointer"
              title="Runs Vendor -> PR -> PO -> Stock + -> Invoice -> Payment"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Simulate Purchase Flow</span>
            </button>

            <button
              onClick={() => runFullSalesDemo()}
              disabled={isSimulating}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs transition-all disabled:opacity-50 cursor-pointer"
              title="Runs Customer -> Quote -> SO -> Stock - -> Invoice -> Payment"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Simulate Sales Flow</span>
            </button>

            <button
              onClick={onOpenArchitecture}
              className="hidden md:flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              title="View Database Schema, REST API & Roadmap"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>Architecture</span>
            </button>

            <button
              onClick={resetAllDemoData}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80 transition-colors"
              title="Reset sample records to initial state"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80 transition-colors"
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Collapsible Stepper */}
        {isExpanded && (
          <div className="mt-2.5 pt-2.5 border-t border-indigo-900/50">
            {/* Flow Toggle tabs */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedFlow('purchase')}
                  className={`text-[11px] font-bold px-2 py-0.5 rounded transition-colors ${
                    selectedFlow === 'purchase'
                      ? 'bg-indigo-500/30 text-indigo-300 border border-indigo-400/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Purchase Flow (Inbound: Vendor → Stock +)
                </button>
                <button
                  onClick={() => setSelectedFlow('sales')}
                  className={`text-[11px] font-bold px-2 py-0.5 rounded transition-colors ${
                    selectedFlow === 'sales'
                      ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-400/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Sales Flow (Outbound: Client → Stock -)
                </button>
              </div>
              <span className="text-[10px] text-slate-400">
                Click any node below to navigate & execute manually
              </span>
            </div>

            {/* Stepper Pipeline */}
            {selectedFlow === 'purchase' ? (
              <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[11px]">
                {[
                  { name: '1. Vendor Created', module: 'vendors' },
                  { name: '2. Purchase Req.', module: 'procurement' },
                  { name: '3. Approval', module: 'approvals' },
                  { name: '4. Purchase Order', module: 'procurement' },
                  { name: '5. Goods Receipt (Stock +)', module: 'inventory', highlight: true },
                  { name: '6. Purchase Invoice', module: 'invoices' },
                  { name: '7. Payment Recorded', module: 'finance' },
                  { name: '8. Audit Log', module: 'audit-logs' },
                ].map((step, idx, arr) => (
                  <React.Fragment key={step.name}>
                    <button
                      onClick={() => setActiveTab(step.module as any)}
                      className={`shrink-0 px-2.5 py-1 rounded-md transition-all font-medium flex items-center gap-1.5 ${
                        step.highlight
                          ? 'bg-indigo-600 text-white font-bold ring-1 ring-indigo-400 shadow-xs'
                          : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
                      }`}
                    >
                      <span>{step.name}</span>
                    </button>
                    {idx < arr.length - 1 && (
                      <ArrowRight className="w-3 h-3 text-indigo-400/60 shrink-0" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[11px]">
                {[
                  { name: '1. Customer Created', module: 'customers' },
                  { name: '2. Sales Quotation', module: 'sales' },
                  { name: '3. Sales Order', module: 'sales' },
                  { name: '4. Inventory Check', module: 'inventory' },
                  { name: '5. Delivery (Stock -)', module: 'sales', highlight: true },
                  { name: '6. Sales Invoice', module: 'invoices' },
                  { name: '7. Payment Received', module: 'finance' },
                  { name: '8. Audit Log', module: 'audit-logs' },
                ].map((step, idx, arr) => (
                  <React.Fragment key={step.name}>
                    <button
                      onClick={() => setActiveTab(step.module as any)}
                      className={`shrink-0 px-2.5 py-1 rounded-md transition-all font-medium flex items-center gap-1.5 ${
                        step.highlight
                          ? 'bg-emerald-600 text-white font-bold ring-1 ring-emerald-400 shadow-xs'
                          : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
                      }`}
                    >
                      <span>{step.name}</span>
                    </button>
                    {idx < arr.length - 1 && (
                      <ArrowRight className="w-3 h-3 text-emerald-400/60 shrink-0" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};
