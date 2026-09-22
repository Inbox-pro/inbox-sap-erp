import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Building,
  Search,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  FileText,
  Eye,
  CheckCircle2,
  Wallet
} from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';

export const FinanceModule: React.FC = () => {
  const {
    invoices,
    payments,
    chartOfAccounts,
    customers,
    vendors,
    recordPayment,
  } = useERP();

  const [activeTab, setActiveTab] = useState<'invoices' | 'payments' | 'coa'>('invoices');
  const [searchTerm, setSearchTerm] = useState('');
  const [invoiceTypeFilter, setInvoiceTypeFilter] = useState<'All' | 'Sales' | 'Purchase'>('All');
  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState(false);

  // Quick Payment Modal form
  const [paymentForm, setPaymentForm] = useState({
    invoiceId: invoices.find((i) => i.balanceAmount > 0)?.id || '',
    amount: 10000,
    paymentMode: 'Bank Transfer (NEFT/RTGS)' as const,
    referenceNumber: `UTR-${Math.floor(100000 + Math.random() * 900000)}`,
    notes: 'Invoice settlement',
  });

  // Financial aggregates
  const totalReceivables = customers.reduce((sum, c) => sum + c.outstandingBalance, 0);
  const totalPayables = vendors.reduce((sum, v) => sum + v.outstandingPayable, 0);

  const totalRevenue = invoices
    .filter((i) => i.type === 'Sales')
    .reduce((sum, i) => sum + i.totalAmount, 0);

  const totalExpenses = invoices
    .filter((i) => i.type === 'Purchase')
    .reduce((sum, i) => sum + i.totalAmount, 0);

  const cashBankBalance = chartOfAccounts
    .filter((a) => a.code === '1010' || a.code === '1020')
    .reduce((sum, a) => sum + a.balance, 0);

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.partyName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = invoiceTypeFilter === 'All' || inv.type === invoiceTypeFilter;
    return matchesSearch && matchesType;
  });

  const filteredPayments = payments.filter((p) => {
    const matchesSearch =
      p.partyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.referenceNumber ? p.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()) : false) ||
      (p.referenceTransactionId ? p.referenceTransactionId.toLowerCase().includes(searchTerm.toLowerCase()) : false) ||
      (p.paymentNumber ? p.paymentNumber.toLowerCase().includes(searchTerm.toLowerCase()) : false) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleExecutePayment = (e: React.FormEvent) => {
    e.preventDefault();
    const inv = invoices.find((i) => i.id === paymentForm.invoiceId);
    if (!inv) return;

    recordPayment({
      date: new Date().toISOString().split('T')[0],
      type: inv.type === 'Sales' ? 'Received' : 'Paid',
      partyType: inv.type === 'Sales' ? 'Customer' : 'Vendor',
      partyId: inv.partyId,
      partyName: inv.partyName,
      invoiceId: inv.id,
      invoiceNumber: inv.invoiceNumber,
      amount: Number(paymentForm.amount),
      paymentMode: paymentForm.paymentMode,
      referenceNumber: paymentForm.referenceNumber,
      notes: paymentForm.notes,
    });

    setIsRecordPaymentOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Financial Management & Accounting
            </h1>
            <span className="text-xs bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
              General Ledger & AP / AR
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time balance sheet aggregates, dual-entry chart of accounts, tax-compliant invoicing, and payment reconciliation.
          </p>
        </div>

        <button
          onClick={() => {
            const pendingInv = invoices.find((i) => i.balanceAmount > 0);
            if (pendingInv) {
              setPaymentForm({
                invoiceId: pendingInv.id,
                amount: pendingInv.balanceAmount,
                paymentMode: 'Bank Transfer (NEFT/RTGS)',
                referenceNumber: `UTR-${Math.floor(100000 + Math.random() * 900000)}`,
                notes: `Settlement for ${pendingInv.invoiceNumber}`,
              });
            }
            setIsRecordPaymentOpen(true);
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Record Payment / Receipt</span>
        </button>
      </div>

      {/* Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Invoiced Revenue
            </span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-emerald-700 mt-2 font-mono">
            ₹{totalRevenue.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Sales turnover booked</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Procurement Expense
            </span>
            <div className="p-2 rounded-lg bg-rose-50 text-rose-600">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-rose-700 mt-2 font-mono">
            ₹{totalExpenses.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Vendor purchase bills</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Accounts Receivable (AR)
            </span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-blue-700 mt-2 font-mono">
            ₹{totalReceivables.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-blue-600 mt-1 font-medium">Customer dues to collect</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Accounts Payable (AP)
            </span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-amber-700 mt-2 font-mono">
            ₹{totalPayables.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-amber-600 mt-1 font-medium">Vendor dues to disburse</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Cash & Bank Balance
            </span>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-indigo-700 mt-2 font-mono">
            ₹{cashBankBalance.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Liquid corporate funds</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('invoices')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              activeTab === 'invoices'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Invoices Ledger ({invoices.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              activeTab === 'payments'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Payments & Receipts ({payments.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('coa')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              activeTab === 'coa'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>Chart of Accounts ({chartOfAccounts.length})</span>
          </button>
        </div>

        <div className="relative w-64 hidden sm:block">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search invoice #, party, UTR..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Tab 1: Invoices */}
      {activeTab === 'invoices' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Invoice Classification:</span>
            {(['All', 'Sales', 'Purchase'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setInvoiceTypeFilter(t)}
                className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                  invoiceTypeFilter === t
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {t === 'All' ? 'All Invoices' : t === 'Sales' ? 'Sales (Receivable)' : 'Purchase (Payable)'}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Invoice #</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Entity / Party Name</th>
                    <th className="py-3 px-4">Date & Due Date</th>
                    <th className="py-3 px-4 text-right">Tax (GST)</th>
                    <th className="py-3 px-4 text-right">Total (INR)</th>
                    <th className="py-3 px-4 text-right">Balance Due</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredInvoices.map((inv) => {
                    const isUnpaid = inv.balanceAmount > 0;
                    const isSales = inv.type === 'Sales';

                    return (
                      <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4 font-mono font-semibold text-slate-900">
                          {inv.invoiceNumber}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                              isSales
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : 'bg-purple-50 text-purple-700 border border-purple-200'
                            }`}
                          >
                            {inv.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-800">
                          {inv.partyName}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-500">
                          <div>{inv.invoiceDate}</div>
                          <div className="text-[10px] text-slate-400">Due: {inv.dueDate}</div>
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-slate-600">
                          ₹{inv.taxAmount.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                          ₹{inv.totalAmount.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold">
                          <span className={isUnpaid ? (isSales ? 'text-amber-600' : 'text-rose-600') : 'text-emerald-600'}>
                            ₹{inv.balanceAmount.toLocaleString('en-IN')}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <StatusBadge status={inv.status} size="sm" />
                        </td>
                        <td className="py-3 px-4 text-right">
                          {isUnpaid ? (
                            <button
                              onClick={() => {
                                setPaymentForm({
                                  invoiceId: inv.id,
                                  amount: inv.balanceAmount,
                                  paymentMode: 'Bank Transfer (NEFT/RTGS)',
                                  referenceNumber: `UTR-${Math.floor(100000 + Math.random() * 900000)}`,
                                  notes: `Settlement for ${inv.invoiceNumber}`,
                                });
                                setIsRecordPaymentOpen(true);
                              }}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-md shadow-2xs"
                            >
                              Settle Now
                            </button>
                          ) : (
                            <span className="text-[11px] text-emerald-600 font-semibold px-2 py-0.5 bg-emerald-50 rounded border border-emerald-200">
                              Fully Settled
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Payments Ledger */}
      {activeTab === 'payments' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Payment ID</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Flow Type</th>
                  <th className="py-3 px-4">Counterparty</th>
                  <th className="py-3 px-4">Channel / Mode</th>
                  <th className="py-3 px-4">Bank Ref / UTR</th>
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-4 text-right">Amount (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPayments.map((p) => {
                  const isReceived = p.type === 'Received';

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-semibold text-slate-700">
                        {p.id}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-500">
                        {p.date}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`flex items-center gap-1 font-bold text-[11px] px-2 py-0.5 rounded w-fit ${
                            isReceived
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {isReceived ? <ArrowDownLeft className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                          <span>{p.type}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-900">
                        {p.partyName}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {p.paymentMode}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-700 font-semibold">
                        {p.referenceNumber}
                      </td>
                      <td className="py-3 px-4 font-mono text-blue-600">
                        {p.invoiceNumber}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-sm">
                        <span className={isReceived ? 'text-emerald-700' : 'text-rose-700'}>
                          {isReceived ? '+' : '-'} ₹{p.amount.toLocaleString('en-IN')}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Chart of Accounts */}
      {activeTab === 'coa' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Standard Enterprise Chart of Accounts (COA)
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Dual-entry account tree with real-time balance tracking across Assets, Liabilities, Equity, Revenue, and Expenses.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Account Code</th>
                  <th className="py-3 px-4">Account Title</th>
                  <th className="py-3 px-4">Classification</th>
                  <th className="py-3 px-4 text-right">Current Ledger Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {chartOfAccounts.map((coa) => {
                  const isAssetOrExpense = coa.type === 'Asset' || coa.type === 'Expense';

                  return (
                    <tr key={coa.code} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {coa.code}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-800">
                        {coa.name}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                            coa.type === 'Asset'
                              ? 'bg-blue-50 text-blue-700'
                              : coa.type === 'Liability'
                              ? 'bg-amber-50 text-amber-700'
                              : coa.type === 'Revenue'
                              ? 'bg-emerald-50 text-emerald-700'
                              : coa.type === 'Expense'
                              ? 'bg-rose-50 text-rose-700'
                              : 'bg-purple-50 text-purple-700'
                          }`}
                        >
                          {coa.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                        ₹{coa.balance.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      <Modal
        isOpen={isRecordPaymentOpen}
        onClose={() => setIsRecordPaymentOpen(false)}
        title="Post Payment or Receipt Voucher"
        subtitle="Apply funds to clear open invoice receivables or supplier disbursements"
      >
        <form onSubmit={handleExecutePayment} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-600 font-semibold mb-1">Target Invoice *</label>
            <select
              value={paymentForm.invoiceId}
              onChange={(e) => {
                const inv = invoices.find((i) => i.id === e.target.value);
                setPaymentForm({
                  ...paymentForm,
                  invoiceId: e.target.value,
                  amount: inv ? inv.balanceAmount : 10000,
                });
              }}
              className="w-full p-2 border border-slate-200 rounded-lg font-mono"
            >
              {invoices
                .filter((i) => i.balanceAmount > 0)
                .map((inv) => (
                  <option key={inv.id} value={inv.id}>
                    {inv.invoiceNumber} - {inv.type} ({inv.partyName}) | Due: ₹{inv.balanceAmount.toLocaleString('en-IN')}
                  </option>
                ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Payment Amount (INR) *</label>
              <input
                type="number"
                min={1}
                required
                value={paymentForm.amount}
                onChange={(e) => setPaymentForm({ ...paymentForm, amount: Number(e.target.value) })}
                className="w-full p-2 border border-slate-200 rounded-lg font-mono font-bold"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Payment Mode</label>
              <select
                value={paymentForm.paymentMode}
                onChange={(e) => setPaymentForm({ ...paymentForm, paymentMode: e.target.value as any })}
                className="w-full p-2 border border-slate-200 rounded-lg"
              >
                <option value="Bank Transfer (NEFT/RTGS)">Bank Transfer (NEFT/RTGS)</option>
                <option value="UPI">UPI Instant</option>
                <option value="Cheque">Corporate Cheque</option>
                <option value="Cash">Cash</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-1">Bank Reference / UTR Number *</label>
            <input
              type="text"
              required
              value={paymentForm.referenceNumber}
              onChange={(e) => setPaymentForm({ ...paymentForm, referenceNumber: e.target.value })}
              className="w-full p-2 border border-slate-200 rounded-lg font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-1">Accounting Notes / Narration</label>
            <textarea
              rows={2}
              value={paymentForm.notes}
              onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
              className="w-full p-2 border border-slate-200 rounded-lg"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsRecordPaymentOpen(false)}
              className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold shadow-xs"
            >
              Post Transaction
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
