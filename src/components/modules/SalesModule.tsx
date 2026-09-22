import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { SalesOrder, SalesQuotation } from '../../types/erp';
import {
  ShoppingCart,
  Plus,
  Search,
  CheckCircle,
  Truck,
  CreditCard,
  Eye,
  FileText,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';

export const SalesModule: React.FC = () => {
  const {
    salesOrders,
    salesQuotations,
    customers,
    products,
    warehouses,
    createSalesQuotation,
    convertQuotationToSO,
    createSalesOrder,
    deliverSalesOrder,
    recordSOPayment,
  } = useERP();

  const [activeTab, setActiveTab] = useState<'orders' | 'quotes'>('orders');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<SalesOrder | null>(null);

  // Modals
  const [isCreateSOModalOpen, setIsCreateSOModalOpen] = useState(false);
  const [isCreateQuoteModalOpen, setIsCreateQuoteModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // New SO Form State
  const [soForm, setSoForm] = useState({
    customerId: customers[0]?.id || '',
    warehouseId: 'WH-MUM',
    items: [
      {
        productId: products[0]?.id || '',
        quantity: 5,
        unitPrice: products[0]?.sellingPrice || 14000,
        discountPercentage: 0,
      },
    ],
  });

  // New Quote Form State
  const [quoteForm, setQuoteForm] = useState({
    customerId: customers[0]?.id || '',
    validUntil: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
    productId: products[0]?.id || '',
    quantity: 10,
    unitPrice: products[0]?.sellingPrice || 14000,
    discountPercentage: 5,
  });

  // Payment Form State
  const [paymentData, setPaymentData] = useState({
    paymentMode: 'UPI' as const,
    transactionRef: `UPI-REC-${Math.floor(100000 + Math.random() * 900000)}`,
  });

  const filteredOrders = salesOrders.filter((so) => {
    const matchesSearch =
      so.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      so.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      so.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const filteredQuotes = salesQuotations.filter((q) => {
    const matchesSearch =
      q.quotationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleCreateSO = (e: React.FormEvent) => {
    e.preventDefault();
    const customer = customers.find((c) => c.id === soForm.customerId);
    if (!customer) return;

    let subtotal = 0;
    let discountAmount = 0;
    let taxAmount = 0;

    const items = soForm.items.map((it) => {
      const prod = products.find((p) => p.id === it.productId);
      const taxRate = prod ? prod.taxRate : 18;
      const lineSub = it.quantity * it.unitPrice;
      const lineDisc = (lineSub * it.discountPercentage) / 100;
      const lineTax = (lineSub - lineDisc) * (taxRate / 100);
      const total = lineSub - lineDisc + lineTax;

      subtotal += lineSub;
      discountAmount += lineDisc;
      taxAmount += lineTax;

      return {
        productId: it.productId,
        productName: prod ? prod.name : 'Sold Item',
        sku: prod ? prod.sku : 'SKU-GEN',
        quantity: Number(it.quantity),
        unitPrice: Number(it.unitPrice),
        discountPercentage: Number(it.discountPercentage),
        taxRate,
        total,
      };
    });

    createSalesOrder({
      customerId: customer.id,
      customerName: customer.companyName,
      orderDate: new Date().toISOString().split('T')[0],
      deliveryDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
      warehouseId: soForm.warehouseId,
      items,
      subtotal,
      discountAmount,
      taxAmount,
      totalAmount: subtotal - discountAmount + taxAmount,
    });

    setIsCreateSOModalOpen(false);
  };

  const handleCreateQuote = (e: React.FormEvent) => {
    e.preventDefault();
    const customer = customers.find((c) => c.id === quoteForm.customerId);
    const prod = products.find((p) => p.id === quoteForm.productId);
    if (!customer) return;

    const lineSub = Number(quoteForm.quantity) * Number(quoteForm.unitPrice);
    const lineDisc = (lineSub * Number(quoteForm.discountPercentage)) / 100;
    const taxRate = prod ? prod.taxRate : 18;
    const lineTax = (lineSub - lineDisc) * (taxRate / 100);
    const total = lineSub - lineDisc + lineTax;

    createSalesQuotation({
      customerId: customer.id,
      customerName: customer.companyName,
      date: new Date().toISOString().split('T')[0],
      validUntil: quoteForm.validUntil,
      items: [
        {
          productId: quoteForm.productId,
          productName: prod ? prod.name : 'Product',
          sku: prod ? prod.sku : 'SKU-GEN',
          quantity: Number(quoteForm.quantity),
          unitPrice: Number(quoteForm.unitPrice),
          discountPercentage: Number(quoteForm.discountPercentage),
          taxRate,
          total,
        },
      ],
      totalAmount: total,
    });

    setIsCreateQuoteModalOpen(false);
  };

  const handleCollectPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    recordSOPayment(selectedOrder.id, paymentData.paymentMode, paymentData.transactionRef);
    setIsPaymentModalOpen(false);
    setSelectedOrder(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Sales & Order Management (Order to Cash - O2C)
            </h1>
            <span className="text-xs bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded-full border border-blue-200">
              Outbound Fulfilment
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Customer Quotation → Sales Order → Warehouse Stock Check → Delivery (Stock -) → Sales Invoice → Payment Collection
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsCreateQuoteModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Quotation</span>
          </button>
          <button
            onClick={() => setIsCreateSOModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Sales Order</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              activeTab === 'orders'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Sales Orders ({salesOrders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('quotes')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              activeTab === 'quotes'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Quotations ({salesQuotations.length})</span>
          </button>
        </div>

        <div className="relative w-64 hidden sm:block">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search orders, clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Tab 1: Sales Orders Table */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Order Number</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Order Date</th>
                  <th className="py-3 px-4">Fulfillment WH</th>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-4">Total (INR)</th>
                  <th className="py-3 px-4">Order Status</th>
                  <th className="py-3 px-4">Delivery & Stock Deduction</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((so) => {
                  const isDelivered = so.deliveryStatus === 'Delivered';
                  const isPaid = so.isPaid;

                  return (
                    <tr key={so.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-semibold text-blue-600">
                        {so.orderNumber}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-900">
                        {so.customerName}
                      </td>
                      <td className="py-3 px-4 text-slate-500 font-mono">
                        {so.orderDate}
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-slate-700">
                        {so.warehouseId}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {so.items.length} item(s)
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        ₹{so.totalAmount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={so.status} size="sm" />
                      </td>
                      <td className="py-3 px-4">
                        {isDelivered ? (
                          <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                            <span>Stock Deducted</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => deliverSalesOrder(so.id)}
                            className="flex items-center gap-1 px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] rounded-md shadow-2xs transition-colors"
                            title="Dispatch Delivery: Checks warehouse stock, reduces inventory, and generates Sales Invoice"
                          >
                            <Truck className="w-3 h-3" />
                            <span>Dispatch & Deliver</span>
                          </button>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          onClick={() => setSelectedOrder(so)}
                          className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-md"
                          title="View Order Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {isDelivered && !isPaid && (
                          <button
                            onClick={() => {
                              setSelectedOrder(so);
                              setIsPaymentModalOpen(true);
                            }}
                            className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold rounded-md border border-emerald-200"
                            title="Collect Payment"
                          >
                            Receive Payment
                          </button>
                        )}
                        {isPaid && (
                          <span className="text-[11px] text-emerald-600 font-semibold px-2 py-0.5 bg-emerald-50 rounded border border-emerald-200">
                            Paid
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
      )}

      {/* Tab 2: Sales Quotations Table */}
      {activeTab === 'quotes' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Quotation #</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Date Issued</th>
                  <th className="py-3 px-4">Valid Until</th>
                  <th className="py-3 px-4">Quoted Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Convert to Order</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredQuotes.map((q) => {
                  const isConverted = q.status === 'Converted';

                  return (
                    <tr key={q.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-semibold text-slate-900">
                        {q.quotationNumber}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-800">
                        {q.customerName}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-500">
                        {q.date}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-500">
                        {q.validUntil}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        ₹{q.totalAmount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={q.status} size="sm" />
                      </td>
                      <td className="py-3 px-4 text-right">
                        {isConverted ? (
                          <span className="font-mono text-[11px] text-blue-600 font-semibold">
                            {q.salesOrderId}
                          </span>
                        ) : (
                          <button
                            onClick={() => convertQuotationToSO(q.id)}
                            className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md shadow-2xs text-[11px]"
                          >
                            Convert to Order →
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order View Modal */}
      {selectedOrder && !isPaymentModalOpen && (
        <Modal
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          title={`Sales Order: ${selectedOrder.orderNumber}`}
          subtitle={`Client: ${selectedOrder.customerName} • Fulfilled via: ${selectedOrder.warehouseId}`}
          maxWidth="4xl"
        >
          <div className="space-y-6 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-400">Order Date:</span>
                <div className="font-mono font-bold text-slate-900 mt-0.5">{selectedOrder.orderDate}</div>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-400">Delivery Status:</span>
                <div className="mt-1"><StatusBadge status={selectedOrder.deliveryStatus} size="sm" /></div>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-400">Order Status:</span>
                <div className="mt-1"><StatusBadge status={selectedOrder.status} size="sm" /></div>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <span className="text-blue-700 font-semibold">Total Revenue:</span>
                <div className="font-mono font-bold text-base text-blue-900 mt-0.5">
                  ₹{selectedOrder.totalAmount.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-sm text-slate-900 mb-2">Order Line Items</h4>
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-semibold">
                    <tr>
                      <th className="p-2.5">Item Description</th>
                      <th className="p-2.5">SKU</th>
                      <th className="p-2.5 text-center">Qty</th>
                      <th className="p-2.5 text-right">Unit Price</th>
                      <th className="p-2.5 text-right">Discount</th>
                      <th className="p-2.5 text-right">GST</th>
                      <th className="p-2.5 text-right">Total (INR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedOrder.items.map((it, idx) => (
                      <tr key={idx}>
                        <td className="p-2.5 font-medium text-slate-900">{it.productName}</td>
                        <td className="p-2.5 font-mono text-slate-500">{it.sku}</td>
                        <td className="p-2.5 text-center font-mono font-semibold">{it.quantity}</td>
                        <td className="p-2.5 text-right font-mono">₹{it.unitPrice.toLocaleString('en-IN')}</td>
                        <td className="p-2.5 text-right font-mono">{it.discountPercentage}%</td>
                        <td className="p-2.5 text-right font-mono">{it.taxRate}%</td>
                        <td className="p-2.5 text-right font-mono font-bold">₹{it.total.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-50 border-t border-slate-200 font-mono text-xs">
                    <tr>
                      <td colSpan={6} className="p-2 text-right text-slate-600">Subtotal:</td>
                      <td className="p-2 text-right font-semibold">₹{selectedOrder.subtotal.toLocaleString('en-IN')}</td>
                    </tr>
                    <tr>
                      <td colSpan={6} className="p-2 text-right text-slate-600">GST Tax:</td>
                      <td className="p-2 text-right font-semibold">₹{selectedOrder.taxAmount.toLocaleString('en-IN')}</td>
                    </tr>
                    <tr className="border-t border-slate-200 font-bold text-slate-900 text-sm">
                      <td colSpan={6} className="p-2 text-right">Grand Total:</td>
                      <td className="p-2 text-right text-blue-700">₹{selectedOrder.totalAmount.toLocaleString('en-IN')}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1 text-slate-600">
              <div><span className="font-semibold text-slate-800">Generated Sales Invoice:</span> {selectedOrder.invoiceId || 'Auto-generated upon delivery'}</div>
              <div><span className="font-semibold text-slate-800">Settlement Status:</span> {selectedOrder.isPaid ? 'Customer paid in full' : 'Unpaid Accounts Receivable'}</div>
            </div>
          </div>
        </Modal>
      )}

      {/* Collect Payment Modal */}
      {selectedOrder && isPaymentModalOpen && (
        <Modal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          title={`Collect Payment for SO ${selectedOrder.orderNumber}`}
          subtitle={`Client: ${selectedOrder.customerName} • Invoiced: ₹${selectedOrder.totalAmount.toLocaleString('en-IN')}`}
        >
          <form onSubmit={handleCollectPayment} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Receipt Channel</label>
              <select
                value={paymentData.paymentMode}
                onChange={(e) => setPaymentData({ ...paymentData, paymentMode: e.target.value as any })}
                className="w-full p-2 border border-slate-200 rounded-lg"
              >
                <option value="UPI">UPI Instant Payment</option>
                <option value="Bank Transfer (NEFT/RTGS)">Bank Transfer (NEFT/RTGS)</option>
                <option value="Cheque">Customer Cheque</option>
                <option value="Cash">Cash at Counter</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Transaction Ref / UPI UTR Number</label>
              <input
                type="text"
                required
                value={paymentData.transactionRef}
                onChange={(e) => setPaymentData({ ...paymentData, transactionRef: e.target.value })}
                className="w-full p-2 border border-slate-200 rounded-lg font-mono"
              />
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 text-[11px]">
              This will mark the Sales Invoice as Paid, reduce the customer's outstanding balance, and record a financial inflow into the cash ledger.
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsPaymentModalOpen(false)}
                className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold shadow-xs"
              >
                Record Payment
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Create Sales Order Modal */}
      <Modal
        isOpen={isCreateSOModalOpen}
        onClose={() => setIsCreateSOModalOpen(false)}
        title="Book New Sales Order"
        subtitle="Confirm customer purchase order and select fulfillment warehouse"
      >
        <form onSubmit={handleCreateSO} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Customer Account *</label>
              <select
                value={soForm.customerId}
                onChange={(e) => setSoForm({ ...soForm, customerId: e.target.value })}
                className="w-full p-2 border border-slate-200 rounded-lg"
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.companyName} ({c.city})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Dispatch Warehouse *</label>
              <select
                value={soForm.warehouseId}
                onChange={(e) => setSoForm({ ...soForm, warehouseId: e.target.value })}
                className="w-full p-2 border border-slate-200 rounded-lg"
              >
                {warehouses.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name} ({w.id})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-1">Select Item to Sell *</label>
            <select
              value={soForm.items[0].productId}
              onChange={(e) => {
                const prod = products.find((p) => p.id === e.target.value);
                setSoForm({
                  ...soForm,
                  items: [
                    {
                      productId: e.target.value,
                      quantity: soForm.items[0].quantity,
                      unitPrice: prod ? prod.sellingPrice : 14000,
                      discountPercentage: 0,
                    },
                  ],
                });
              }}
              className="w-full p-2 border border-slate-200 rounded-lg"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.sku}) - On Hand: {p.currentStock} {p.unit}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Quantity *</label>
              <input
                type="number"
                min={1}
                required
                value={soForm.items[0].quantity}
                onChange={(e) =>
                  setSoForm({
                    ...soForm,
                    items: [
                      {
                        ...soForm.items[0],
                        quantity: Number(e.target.value),
                      },
                    ],
                  })
                }
                className="w-full p-2 border border-slate-200 rounded-lg font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Selling Price (INR) *</label>
              <input
                type="number"
                required
                value={soForm.items[0].unitPrice}
                onChange={(e) =>
                  setSoForm({
                    ...soForm,
                    items: [
                      {
                        ...soForm.items[0],
                        unitPrice: Number(e.target.value),
                      },
                    ],
                  })
                }
                className="w-full p-2 border border-slate-200 rounded-lg font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Discount %</label>
              <input
                type="number"
                value={soForm.items[0].discountPercentage}
                onChange={(e) =>
                  setSoForm({
                    ...soForm,
                    items: [
                      {
                        ...soForm.items[0],
                        discountPercentage: Number(e.target.value),
                      },
                    ],
                  })
                }
                className="w-full p-2 border border-slate-200 rounded-lg font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsCreateSOModalOpen(false)}
              className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-xs"
            >
              Confirm Sales Order
            </button>
          </div>
        </form>
      </Modal>

      {/* Create Quotation Modal */}
      <Modal
        isOpen={isCreateQuoteModalOpen}
        onClose={() => setIsCreateQuoteModalOpen(false)}
        title="Generate Sales Quotation"
        subtitle="Formal price quotation for client before order conversion"
      >
        <form onSubmit={handleCreateQuote} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Customer Account *</label>
              <select
                value={quoteForm.customerId}
                onChange={(e) => setQuoteForm({ ...quoteForm, customerId: e.target.value })}
                className="w-full p-2 border border-slate-200 rounded-lg"
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.companyName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Valid Until Date</label>
              <input
                type="date"
                required
                value={quoteForm.validUntil}
                onChange={(e) => setQuoteForm({ ...quoteForm, validUntil: e.target.value })}
                className="w-full p-2 border border-slate-200 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-1">Product Item *</label>
            <select
              value={quoteForm.productId}
              onChange={(e) => {
                const prod = products.find((p) => p.id === e.target.value);
                setQuoteForm({
                  ...quoteForm,
                  productId: e.target.value,
                  unitPrice: prod ? prod.sellingPrice : 14000,
                });
              }}
              className="w-full p-2 border border-slate-200 rounded-lg"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.sku}) - Price: ₹{p.sellingPrice}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Quantity</label>
              <input
                type="number"
                min={1}
                required
                value={quoteForm.quantity}
                onChange={(e) => setQuoteForm({ ...quoteForm, quantity: Number(e.target.value) })}
                className="w-full p-2 border border-slate-200 rounded-lg font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Unit Price (INR)</label>
              <input
                type="number"
                required
                value={quoteForm.unitPrice}
                onChange={(e) => setQuoteForm({ ...quoteForm, unitPrice: Number(e.target.value) })}
                className="w-full p-2 border border-slate-200 rounded-lg font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Discount %</label>
              <input
                type="number"
                value={quoteForm.discountPercentage}
                onChange={(e) => setQuoteForm({ ...quoteForm, discountPercentage: Number(e.target.value) })}
                className="w-full p-2 border border-slate-200 rounded-lg font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsCreateQuoteModalOpen(false)}
              className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-semibold shadow-xs"
            >
              Dispatch Quotation
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
