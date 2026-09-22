import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { PurchaseOrder, PurchaseRequisition } from '../../types/erp';
import {
  ShoppingBag,
  Plus,
  Search,
  CheckCircle,
  Clock,
  ArrowRight,
  Eye,
  Truck,
  CreditCard,
  FileText,
  AlertCircle
} from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';

export const ProcurementModule: React.FC = () => {
  const {
    purchaseOrders,
    purchaseRequisitions,
    vendors,
    products,
    warehouses,
    createPurchaseRequisition,
    convertPRToPO,
    createPurchaseOrder,
    receiveGoods,
    recordPOPayment,
  } = useERP();

  const [activeTab, setActiveTab] = useState<'pos' | 'prs'>('pos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);

  // Modals
  const [isCreatePOModalOpen, setIsCreatePOModalOpen] = useState(false);
  const [isCreatePRModalOpen, setIsCreatePRModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // New PO form state
  const [poForm, setPoForm] = useState({
    vendorId: vendors[0]?.id || '',
    warehouseId: 'WH-MUM',
    items: [
      {
        productId: products[0]?.id || '',
        quantity: 10,
        unitPrice: products[0]?.purchasePrice || 10000,
      },
    ],
  });

  // New PR form state
  const [prForm, setPrForm] = useState({
    department: 'Operations',
    requestedBy: 'Kavita Iyer',
    requiredDate: new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0],
    productId: products[0]?.id || '',
    quantity: 15,
    estimatedUnitPrice: products[0]?.purchasePrice || 10000,
    reason: 'Replenishing regional warehouse safety buffer',
  });

  // Payment form state
  const [paymentData, setPaymentData] = useState({
    paymentMode: 'Bank Transfer (NEFT/RTGS)' as const,
    transactionRef: `HDFC-NEFT-${Math.floor(100000 + Math.random() * 900000)}`,
  });

  const filteredPOs = purchaseOrders.filter((po) => {
    const matchesSearch =
      po.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const filteredPRs = purchaseRequisitions.filter((pr) => {
    const matchesSearch =
      pr.reqNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pr.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pr.requestedBy.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleCreatePO = (e: React.FormEvent) => {
    e.preventDefault();
    const vendor = vendors.find((v) => v.id === poForm.vendorId);
    if (!vendor) return;

    let subtotal = 0;
    let taxAmount = 0;

    const items = poForm.items.map((it) => {
      const prod = products.find((p) => p.id === it.productId);
      const taxRate = prod ? prod.taxRate : 18;
      const total = it.quantity * it.unitPrice * (1 + taxRate / 100);
      subtotal += it.quantity * it.unitPrice;
      taxAmount += it.quantity * it.unitPrice * (taxRate / 100);

      return {
        productId: it.productId,
        productName: prod ? prod.name : 'Procured Item',
        sku: prod ? prod.sku : 'SKU-GEN',
        quantity: Number(it.quantity),
        unitPrice: Number(it.unitPrice),
        taxRate,
        total,
      };
    });

    createPurchaseOrder({
      vendorId: vendor.id,
      vendorName: vendor.companyName,
      orderDate: new Date().toISOString().split('T')[0],
      expectedDeliveryDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      warehouseId: poForm.warehouseId,
      items,
      subtotal,
      taxAmount,
      totalAmount: subtotal + taxAmount,
    });

    setIsCreatePOModalOpen(false);
  };

  const handleCreatePR = (e: React.FormEvent) => {
    e.preventDefault();
    const prod = products.find((p) => p.id === prForm.productId);
    const estTotal = Number(prForm.quantity) * Number(prForm.estimatedUnitPrice);

    createPurchaseRequisition({
      department: prForm.department,
      requestedBy: prForm.requestedBy,
      requestDate: new Date().toISOString().split('T')[0],
      requiredDate: prForm.requiredDate,
      items: [
        {
          productId: prForm.productId,
          productName: prod ? prod.name : 'Requested Product',
          quantity: Number(prForm.quantity),
          estimatedUnitPrice: Number(prForm.estimatedUnitPrice),
          estimatedTotal: estTotal,
        },
      ],
      totalEstimatedAmount: estTotal,
      reason: prForm.reason,
    });

    setIsCreatePRModalOpen(false);
  };

  const handleExecutePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPO) return;
    recordPOPayment(selectedPO.id, paymentData.paymentMode, paymentData.transactionRef);
    setIsPaymentModalOpen(false);
    setSelectedPO(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Procurement & Purchase (Procure to Pay - P2P)
            </h1>
            <span className="text-xs bg-purple-50 text-purple-700 font-semibold px-2 py-0.5 rounded-full border border-purple-200">
              Inbound Supply Chain
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Requisitions → Approval → Purchase Orders → Goods Receipt Note (GRN Stock +) → Purchase Invoice → Payment
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsCreatePRModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Requisition</span>
          </button>
          <button
            onClick={() => setIsCreatePOModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Purchase Order</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('pos')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              activeTab === 'pos'
                ? 'bg-purple-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Purchase Orders ({purchaseOrders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('prs')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              activeTab === 'prs'
                ? 'bg-purple-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Purchase Requisitions ({purchaseRequisitions.length})</span>
          </button>
        </div>

        <div className="relative w-64 hidden sm:block">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search POs, vendors, PRs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Tab 1: Purchase Orders Table */}
      {activeTab === 'pos' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">PO Number</th>
                  <th className="py-3 px-4">Vendor Name</th>
                  <th className="py-3 px-4">Order Date</th>
                  <th className="py-3 px-4">Destination WH</th>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-4">Total (INR)</th>
                  <th className="py-3 px-4">PO Status</th>
                  <th className="py-3 px-4">Goods Receipt (GRN)</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPOs.map((po) => {
                  const isReceived = po.status === 'Received';
                  const isPaid = po.isPaid;

                  return (
                    <tr key={po.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-semibold text-purple-700">
                        {po.poNumber}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-900">
                        {po.vendorName}
                      </td>
                      <td className="py-3 px-4 text-slate-500 font-mono">
                        {po.orderDate}
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-slate-700">
                        {po.warehouseId}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {po.items.length} item(s)
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        ₹{po.totalAmount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={po.status} size="sm" />
                      </td>
                      <td className="py-3 px-4">
                        {isReceived ? (
                          <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                            <span>Stock In ({po.goodsReceiptId})</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => receiveGoods(po.id)}
                            className="flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-md shadow-2xs transition-colors"
                            title="Receive goods: Increases warehouse stock & generates purchase invoice"
                          >
                            <Truck className="w-3 h-3" />
                            <span>Receive Goods (GRN)</span>
                          </button>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          onClick={() => setSelectedPO(po)}
                          className="p-1.5 text-slate-600 hover:text-purple-600 hover:bg-purple-50 rounded-md"
                          title="View PO Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {isReceived && !isPaid && (
                          <button
                            onClick={() => {
                              setSelectedPO(po);
                              setIsPaymentModalOpen(true);
                            }}
                            className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-md border border-blue-200"
                            title="Record Disbursement"
                          >
                            Pay Bill
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

      {/* Tab 2: Purchase Requisitions */}
      {activeTab === 'prs' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">PR Number</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Requested By</th>
                  <th className="py-3 px-4">Request Date</th>
                  <th className="py-3 px-4">Estimated Total</th>
                  <th className="py-3 px-4">Reason / Notes</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Convert to PO</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPRs.map((pr) => {
                  const isApproved = pr.status === 'Approved';
                  const isConverted = pr.status === 'Converted to PO';

                  return (
                    <tr key={pr.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-semibold text-slate-900">
                        {pr.reqNumber}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-800">
                        {pr.department}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {pr.requestedBy}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-500">
                        {pr.requestDate}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        ₹{pr.totalEstimatedAmount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-4 text-slate-600 max-w-[200px] truncate">
                        {pr.reason}
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={pr.status} size="sm" />
                      </td>
                      <td className="py-3 px-4 text-right">
                        {isApproved && (
                          <button
                            onClick={() => convertPRToPO(pr.id, vendors[0].id, 'WH-MUM')}
                            className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-md shadow-2xs text-[11px]"
                          >
                            Convert to PO →
                          </button>
                        )}
                        {isConverted && (
                          <span className="font-mono text-[11px] text-purple-700 font-semibold">
                            {pr.poId}
                          </span>
                        )}
                        {pr.status === 'Pending' && (
                          <span className="text-[11px] text-amber-600 font-medium">
                            Pending Approval
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

      {/* PO View Modal */}
      {selectedPO && !isPaymentModalOpen && (
        <Modal
          isOpen={!!selectedPO}
          onClose={() => setSelectedPO(null)}
          title={`Purchase Order: ${selectedPO.poNumber}`}
          subtitle={`Supplier: ${selectedPO.vendorName} • Warehouse: ${selectedPO.warehouseId}`}
          maxWidth="4xl"
        >
          <div className="space-y-6 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-400">Order Date:</span>
                <div className="font-mono font-bold text-slate-900 mt-0.5">{selectedPO.orderDate}</div>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-400">Expected Delivery:</span>
                <div className="font-mono font-bold text-slate-900 mt-0.5">{selectedPO.expectedDeliveryDate}</div>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-400">Status:</span>
                <div className="mt-1"><StatusBadge status={selectedPO.status} size="sm" /></div>
              </div>
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <span className="text-purple-700 font-semibold">Total Amount:</span>
                <div className="font-mono font-bold text-base text-purple-900 mt-0.5">
                  ₹{selectedPO.totalAmount.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-sm text-slate-900 mb-2">Line Items</h4>
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-semibold">
                    <tr>
                      <th className="p-2.5">Item Description</th>
                      <th className="p-2.5">SKU</th>
                      <th className="p-2.5 text-center">Qty</th>
                      <th className="p-2.5 text-right">Unit Price</th>
                      <th className="p-2.5 text-right">GST Rate</th>
                      <th className="p-2.5 text-right">Total (INR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedPO.items.map((it, idx) => (
                      <tr key={idx}>
                        <td className="p-2.5 font-medium text-slate-900">{it.productName}</td>
                        <td className="p-2.5 font-mono text-slate-500">{it.sku}</td>
                        <td className="p-2.5 text-center font-mono font-semibold">{it.quantity}</td>
                        <td className="p-2.5 text-right font-mono">₹{it.unitPrice.toLocaleString('en-IN')}</td>
                        <td className="p-2.5 text-right font-mono">{it.taxRate}%</td>
                        <td className="p-2.5 text-right font-mono font-bold">₹{it.total.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-50 border-t border-slate-200 font-mono text-xs">
                    <tr>
                      <td colSpan={5} className="p-2 text-right text-slate-600">Subtotal:</td>
                      <td className="p-2 text-right font-semibold">₹{selectedPO.subtotal.toLocaleString('en-IN')}</td>
                    </tr>
                    <tr>
                      <td colSpan={5} className="p-2 text-right text-slate-600">Tax Amount (GST):</td>
                      <td className="p-2 text-right font-semibold">₹{selectedPO.taxAmount.toLocaleString('en-IN')}</td>
                    </tr>
                    <tr className="border-t border-slate-200 font-bold text-slate-900 text-sm">
                      <td colSpan={5} className="p-2 text-right">Grand Total:</td>
                      <td className="p-2 text-right text-purple-700">₹{selectedPO.totalAmount.toLocaleString('en-IN')}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Cross-module links */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1 text-slate-600">
              <div><span className="font-semibold text-slate-800">Linked GRN Document:</span> {selectedPO.goodsReceiptId || 'Pending goods arrival'}</div>
              <div><span className="font-semibold text-slate-800">Generated Purchase Invoice:</span> {selectedPO.invoiceId || 'Auto-generated on receipt'}</div>
              <div><span className="font-semibold text-slate-800">Payment Status:</span> {selectedPO.isPaid ? 'Settled in full' : 'Unpaid Accounts Payable'}</div>
            </div>
          </div>
        </Modal>
      )}

      {/* Record Payment Modal */}
      {selectedPO && isPaymentModalOpen && (
        <Modal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          title={`Disburse Payment for PO ${selectedPO.poNumber}`}
          subtitle={`Payee: ${selectedPO.vendorName} • Amount: ₹${selectedPO.totalAmount.toLocaleString('en-IN')}`}
        >
          <form onSubmit={handleExecutePayment} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Payment Method</label>
              <select
                value={paymentData.paymentMode}
                onChange={(e) => setPaymentData({ ...paymentData, paymentMode: e.target.value as any })}
                className="w-full p-2 border border-slate-200 rounded-lg"
              >
                <option value="Bank Transfer (NEFT/RTGS)">Bank Transfer (NEFT/RTGS)</option>
                <option value="UPI">UPI</option>
                <option value="Cheque">Corporate Cheque</option>
                <option value="Cash">Cash</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Transaction Reference / UTR Number</label>
              <input
                type="text"
                required
                value={paymentData.transactionRef}
                onChange={(e) => setPaymentData({ ...paymentData, transactionRef: e.target.value })}
                className="w-full p-2 border border-slate-200 rounded-lg font-mono"
              />
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 text-[11px]">
              This action will mark the Purchase Invoice as Paid, reduce the vendor's Accounts Payable balance, and record a financial outflow in the audit trail.
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
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold shadow-xs"
              >
                Confirm Disbursement
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Create Purchase Order Modal */}
      <Modal
        isOpen={isCreatePOModalOpen}
        onClose={() => setIsCreatePOModalOpen(false)}
        title="Issue New Purchase Order (PO)"
        subtitle="Procure goods from approved vendor into target warehouse"
      >
        <form onSubmit={handleCreatePO} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Vendor / Supplier *</label>
              <select
                value={poForm.vendorId}
                onChange={(e) => setPoForm({ ...poForm, vendorId: e.target.value })}
                className="w-full p-2 border border-slate-200 rounded-lg"
              >
                {vendors.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.companyName} ({v.city})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Destination Warehouse *</label>
              <select
                value={poForm.warehouseId}
                onChange={(e) => setPoForm({ ...poForm, warehouseId: e.target.value })}
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
            <label className="block text-slate-600 font-semibold mb-1">Item to Procure *</label>
            <select
              value={poForm.items[0].productId}
              onChange={(e) => {
                const prod = products.find((p) => p.id === e.target.value);
                setPoForm({
                  ...poForm,
                  items: [
                    {
                      productId: e.target.value,
                      quantity: poForm.items[0].quantity,
                      unitPrice: prod ? prod.purchasePrice : 10000,
                    },
                  ],
                });
              }}
              className="w-full p-2 border border-slate-200 rounded-lg"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.sku}) - Price: ₹{p.purchasePrice}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Order Quantity *</label>
              <input
                type="number"
                min={1}
                required
                value={poForm.items[0].quantity}
                onChange={(e) =>
                  setPoForm({
                    ...poForm,
                    items: [
                      {
                        ...poForm.items[0],
                        quantity: Number(e.target.value),
                      },
                    ],
                  })
                }
                className="w-full p-2 border border-slate-200 rounded-lg font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Unit Purchase Price (INR) *</label>
              <input
                type="number"
                required
                value={poForm.items[0].unitPrice}
                onChange={(e) =>
                  setPoForm({
                    ...poForm,
                    items: [
                      {
                        ...poForm.items[0],
                        unitPrice: Number(e.target.value),
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
              onClick={() => setIsCreatePOModalOpen(false)}
              className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold shadow-xs"
            >
              Generate Purchase Order
            </button>
          </div>
        </form>
      </Modal>

      {/* Create Requisition Modal */}
      <Modal
        isOpen={isCreatePRModalOpen}
        onClose={() => setIsCreatePRModalOpen(false)}
        title="Submit Purchase Requisition (PR)"
        subtitle="Departmental request requiring managerial approval prior to PO issuance"
      >
        <form onSubmit={handleCreatePR} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Department *</label>
              <select
                value={prForm.department}
                onChange={(e) => setPrForm({ ...prForm, department: e.target.value })}
                className="w-full p-2 border border-slate-200 rounded-lg"
              >
                <option value="Operations">Operations</option>
                <option value="IT Infrastructure">IT Infrastructure</option>
                <option value="Procurement">Procurement</option>
                <option value="Sales & Marketing">Sales & Marketing</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Requested By *</label>
              <input
                type="text"
                required
                value={prForm.requestedBy}
                onChange={(e) => setPrForm({ ...prForm, requestedBy: e.target.value })}
                className="w-full p-2 border border-slate-200 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-1">Product Item *</label>
            <select
              value={prForm.productId}
              onChange={(e) => {
                const prod = products.find((p) => p.id === e.target.value);
                setPrForm({
                  ...prForm,
                  productId: e.target.value,
                  estimatedUnitPrice: prod ? prod.purchasePrice : 10000,
                });
              }}
              className="w-full p-2 border border-slate-200 rounded-lg"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.sku}) - Est: ₹{p.purchasePrice}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Required Quantity</label>
              <input
                type="number"
                min={1}
                required
                value={prForm.quantity}
                onChange={(e) => setPrForm({ ...prForm, quantity: Number(e.target.value) })}
                className="w-full p-2 border border-slate-200 rounded-lg font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Estimated Unit Price (INR)</label>
              <input
                type="number"
                required
                value={prForm.estimatedUnitPrice}
                onChange={(e) => setPrForm({ ...prForm, estimatedUnitPrice: Number(e.target.value) })}
                className="w-full p-2 border border-slate-200 rounded-lg font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-1">Business Justification *</label>
            <textarea
              rows={2}
              required
              value={prForm.reason}
              onChange={(e) => setPrForm({ ...prForm, reason: e.target.value })}
              className="w-full p-2 border border-slate-200 rounded-lg"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsCreatePRModalOpen(false)}
              className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-semibold shadow-xs"
            >
              Submit Requisition
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
