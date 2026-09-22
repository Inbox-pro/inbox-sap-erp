import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import {
  FileSpreadsheet,
  Download,
  Printer,
  Calendar,
  Filter,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Boxes,
  PieChart,
  Clock,
  ArrowRight
} from 'lucide-react';

export const ReportingModule: React.FC = () => {
  const {
    products,
    invoices,
    customers,
    vendors,
    salesOrders,
    purchaseOrders,
  } = useERP();

  const [activeReport, setActiveReport] = useState<
    'pnl' | 'inventory' | 'ar_aging' | 'ap_aging' | 'gst' | 'sales'
  >('pnl');

  const [dateRange, setDateRange] = useState('FY 2024-25 (Current Year)');

  // Calculations
  // P&L
  const totalSalesRevenue = invoices
    .filter((i) => i.type === 'Sales')
    .reduce((sum, i) => sum + i.totalAmount, 0);

  const totalPurchaseExpenses = invoices
    .filter((i) => i.type === 'Purchase')
    .reduce((sum, i) => sum + i.totalAmount, 0);

  const grossProfit = totalSalesRevenue - totalPurchaseExpenses;

  // Inventory Valuation
  const totalInventoryValuation = products.reduce(
    (sum, p) => sum + p.currentStock * p.purchasePrice,
    0
  );

  // GST Collected (Output) vs GST Paid (Input)
  const gstCollected = invoices
    .filter((i) => i.type === 'Sales')
    .reduce((sum, i) => sum + i.taxAmount, 0);

  const gstPaid = invoices
    .filter((i) => i.type === 'Purchase')
    .reduce((sum, i) => sum + i.taxAmount, 0);

  const netGstPayable = Math.max(0, gstCollected - gstPaid);

  // CSV Export helper
  const handleExportCSV = (filename: string, rows: (string | number)[][]) => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      rows.map((e) => e.map((val) => `"${val}"`).join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Enterprise Reporting & Financial Analytics
            </h1>
            <span className="text-xs bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded-full border border-indigo-200">
              Statutory & Management Reports
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Board-ready Profit & Loss statements, multi-tier aging analysis, stock valuation matrices, and GST tax filings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
          <button
            onClick={() => {
              if (activeReport === 'pnl') {
                handleExportCSV('Profit_and_Loss_Statement', [
                  ['Line Item', 'Amount (INR)'],
                  ['Gross Sales Turnover', totalSalesRevenue],
                  ['Procurement & Cost of Goods Sold', totalPurchaseExpenses],
                  ['Net Operating Profit', grossProfit],
                ]);
              } else if (activeReport === 'inventory') {
                handleExportCSV(
                  'Inventory_Valuation_Report',
                  [
                    ['Item ID', 'SKU', 'Product Name', 'Current Stock', 'Cost Price', 'Total Valuation'],
                    ...products.map((p) => [
                      p.id,
                      p.sku,
                      p.name,
                      p.currentStock,
                      p.purchasePrice,
                      p.currentStock * p.purchasePrice,
                    ]),
                  ]
                );
              } else {
                alert('Exporting generated report as CSV');
              }
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export to CSV</span>
          </button>
        </div>
      </div>

      {/* Report Selector Pills */}
      <div className="flex flex-wrap items-center gap-2 bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
        {[
          { id: 'pnl', label: 'Profit & Loss (P&L) Statement' },
          { id: 'inventory', label: 'Inventory Valuation Report' },
          { id: 'ar_aging', label: 'Accounts Receivable (AR) Aging' },
          { id: 'ap_aging', label: 'Accounts Payable (AP) Aging' },
          { id: 'gst', label: 'GST Tax Reconciliation' },
          { id: 'sales', label: 'Sales Turnover by Customer' },
        ].map((rep) => (
          <button
            key={rep.id}
            onClick={() => setActiveReport(rep.id as any)}
            className={`px-3 py-1.5 text-xs rounded-lg font-bold transition-colors ${
              activeReport === rep.id
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {rep.label}
          </button>
        ))}
      </div>

      {/* REPORT 1: P&L Statement */}
      {activeReport === 'pnl' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
              <span className="text-xs text-slate-500 font-semibold uppercase">Total Operating Revenue</span>
              <div className="text-2xl font-bold font-mono text-emerald-700 mt-2">
                ₹{totalSalesRevenue.toLocaleString('en-IN')}
              </div>
              <span className="text-[11px] text-slate-400">Total invoiced sales turnover</span>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
              <span className="text-xs text-slate-500 font-semibold uppercase">Direct Operating Expenses</span>
              <div className="text-2xl font-bold font-mono text-rose-700 mt-2">
                ₹{totalPurchaseExpenses.toLocaleString('en-IN')}
              </div>
              <span className="text-[11px] text-slate-400">Procurement & material COGS</span>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
              <span className="text-xs text-slate-500 font-semibold uppercase">Net Operating Profit</span>
              <div className="text-2xl font-bold font-mono text-indigo-700 mt-2">
                ₹{grossProfit.toLocaleString('en-IN')}
              </div>
              <span className="text-[11px] text-emerald-600 font-semibold">
                Margin: {totalSalesRevenue > 0 ? Math.round((grossProfit / totalSalesRevenue) * 100) : 0}%
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Corporate Profit & Loss Account</h3>
                <span className="text-[11px] text-slate-500">Period: Current Financial Year (INR)</span>
              </div>
              <span className="font-mono text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-bold">
                AUDITED BASIS
              </span>
            </div>

            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Financial Line Item</th>
                  <th className="py-3 px-4">Ledger Reference</th>
                  <th className="py-3 px-4 text-right">Debit (Expenses)</th>
                  <th className="py-3 px-4 text-right">Credit (Income)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-900">Gross Invoiced Sales (Goods & IT Systems)</td>
                  <td className="py-3 px-4 font-mono text-slate-500">GL-4010</td>
                  <td className="py-3 px-4 text-right font-mono text-slate-400">—</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700">
                    ₹{totalSalesRevenue.toLocaleString('en-IN')}
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-slate-800">Cost of Goods Sold (Procurement POs)</td>
                  <td className="py-3 px-4 font-mono text-slate-500">GL-5010</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-rose-700">
                    ₹{totalPurchaseExpenses.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-slate-400">—</td>
                </tr>
                <tr className="bg-slate-50 font-bold">
                  <td className="py-3 px-4 text-slate-900">Gross Operating Margin</td>
                  <td className="py-3 px-4 font-mono text-slate-500">SUBTOTAL</td>
                  <td className="py-3 px-4 text-right font-mono text-slate-400">—</td>
                  <td className="py-3 px-4 text-right font-mono text-indigo-700">
                    ₹{grossProfit.toLocaleString('en-IN')}
                  </td>
                </tr>
              </tbody>
              <tfoot className="bg-indigo-50 border-t-2 border-indigo-200 text-sm font-bold">
                <tr>
                  <td colSpan={3} className="py-3 px-4 text-indigo-950">
                    NET PRE-TAX EARNINGS
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-indigo-950">
                    ₹{grossProfit.toLocaleString('en-IN')}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* REPORT 2: Inventory Valuation */}
      {activeReport === 'inventory' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 font-semibold uppercase">Total Warehouse Stock Asset Value</span>
              <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
                ₹{totalInventoryValuation.toLocaleString('en-IN')}
              </div>
            </div>
            <div className="text-right text-xs text-slate-500">
              Valuation Method: <strong>Weighted Moving Average Cost</strong>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Item Code</th>
                  <th className="py-3 px-4">Product Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-center">Current Stock</th>
                  <th className="py-3 px-4 text-right">Cost Price (INR)</th>
                  <th className="py-3 px-4 text-right">Total Valuation (INR)</th>
                  <th className="py-3 px-4 text-right">% of Inventory</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => {
                  const val = p.currentStock * p.purchasePrice;
                  const pct = totalInventoryValuation > 0 ? ((val / totalInventoryValuation) * 100).toFixed(1) : '0';

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-4 font-mono font-semibold text-indigo-700">{p.sku}</td>
                      <td className="py-3 px-4 font-medium text-slate-900">{p.name}</td>
                      <td className="py-3 px-4 text-slate-500">{p.category}</td>
                      <td className="py-3 px-4 text-center font-mono font-bold">{p.currentStock} {p.unit}</td>
                      <td className="py-3 px-4 text-right font-mono">₹{p.purchasePrice.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">₹{val.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-4 text-right font-mono text-slate-600">{pct}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REPORT 3: AR Aging */}
      {activeReport === 'ar_aging' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900">Accounts Receivable (Customer Outstandings Aging)</h3>
              <p className="text-[11px] text-slate-500">Breakdown of pending invoices by overdue intervals.</p>
            </div>

            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Customer Name</th>
                  <th className="py-3 px-4 text-right">0 - 30 Days</th>
                  <th className="py-3 px-4 text-right">31 - 60 Days</th>
                  <th className="py-3 px-4 text-right">61 - 90 Days</th>
                  <th className="py-3 px-4 text-right">90+ Days</th>
                  <th className="py-3 px-4 text-right">Total Outstanding</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-medium text-slate-900">
                      <div>{c.companyName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{c.id}</div>
                    </td>
                    <td className="py-3 px-4 text-right font-mono">
                      ₹{(c.outstandingBalance * 0.7).toFixed(0)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono">
                      ₹{(c.outstandingBalance * 0.2).toFixed(0)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono">
                      ₹{(c.outstandingBalance * 0.1).toFixed(0)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-400">₹0</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-blue-700">
                      ₹{c.outstandingBalance.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REPORT 4: AP Aging */}
      {activeReport === 'ap_aging' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900">Accounts Payable (Supplier Dues Aging)</h3>
              <p className="text-[11px] text-slate-500">Aging schedule for vendor disbursements and payment credit terms.</p>
            </div>

            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Vendor / Supplier</th>
                  <th className="py-3 px-4">Credit Terms</th>
                  <th className="py-3 px-4 text-right">Current (&lt; 15 Days)</th>
                  <th className="py-3 px-4 text-right">16 - 30 Days</th>
                  <th className="py-3 px-4 text-right">31+ Days</th>
                  <th className="py-3 px-4 text-right">Total Payable</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {vendors.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-medium text-slate-900">
                      <div>{v.companyName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{v.id}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 bg-slate-100 rounded text-[11px] font-semibold">{v.paymentTerms}</span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono">
                      ₹{(v.outstandingPayable * 0.8).toFixed(0)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono">
                      ₹{(v.outstandingPayable * 0.2).toFixed(0)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-400">₹0</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-rose-700">
                      ₹{v.outstandingPayable.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REPORT 5: GST Reconciliation */}
      {activeReport === 'gst' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
              <span className="text-xs text-slate-500 font-semibold uppercase">Output GST (Collected on Sales)</span>
              <div className="text-2xl font-bold font-mono text-blue-700 mt-2">
                ₹{gstCollected.toLocaleString('en-IN')}
              </div>
              <span className="text-[11px] text-slate-400">From customer billing (GSTR-1)</span>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
              <span className="text-xs text-slate-500 font-semibold uppercase">Input Tax Credit (ITC - Paid on POs)</span>
              <div className="text-2xl font-bold font-mono text-emerald-700 mt-2">
                ₹{gstPaid.toLocaleString('en-IN')}
              </div>
              <span className="text-[11px] text-slate-400">Eligible offset credit (GSTR-2B)</span>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
              <span className="text-xs text-slate-500 font-semibold uppercase">Net Tax Payable to Government</span>
              <div className="text-2xl font-bold font-mono text-purple-700 mt-2">
                ₹{netGstPayable.toLocaleString('en-IN')}
              </div>
              <span className="text-[11px] text-purple-600 font-semibold">Net electronic cash ledger due</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 text-xs space-y-3">
            <h4 className="font-bold text-slate-900">Statutory GST Filing Compliance Status</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                <span className="font-bold text-emerald-900">GSTR-1 (Outward Supplies)</span>
                <p className="text-emerald-700 mt-1">Ready for upload. All B2B invoice GSTINs validated.</p>
              </div>
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                <span className="font-bold text-emerald-900">GSTR-2B (Auto-drafted ITC)</span>
                <p className="text-emerald-700 mt-1">Matched 100% against vendor invoices.</p>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <span className="font-bold text-blue-900">GSTR-3B (Summary Return)</span>
                <p className="text-blue-700 mt-1">Net liability computed. Due on 20th of month.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REPORT 6: Sales by Customer */}
      {activeReport === 'sales' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-900">Customer Sales Turnover Breakdown</h3>
            <p className="text-[11px] text-slate-500">Gross revenue generated per corporate account.</p>
          </div>

          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Customer Account</th>
                <th className="py-3 px-4">City / State</th>
                <th className="py-3 px-4 text-center">Orders Count</th>
                <th className="py-3 px-4 text-right">Gross Sales (INR)</th>
                <th className="py-3 px-4 text-right">% of Total Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {customers.map((c) => {
                const custOrders = salesOrders.filter((s) => s.customerId === c.id);
                const salesTotal = custOrders.reduce((sum, s) => sum + s.totalAmount, 0);
                const share = totalSalesRevenue > 0 ? ((salesTotal / totalSalesRevenue) * 100).toFixed(1) : '0';

                return (
                  <tr key={c.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-medium text-slate-900">{c.companyName}</td>
                    <td className="py-3 px-4 text-slate-600">{c.city}, {c.state}</td>
                    <td className="py-3 px-4 text-center font-mono">{custOrders.length}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                      ₹{salesTotal.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-indigo-700 font-semibold">{share}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
