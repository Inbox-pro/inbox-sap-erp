import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { Customer } from '../../types/erp';
import {
  Users,
  Search,
  Plus,
  Building,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Eye,
  Edit2,
  FileText,
  DollarSign,
  ShoppingCart
} from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';

export const CustomerModule: React.FC = () => {
  const { customers, salesOrders, invoices, payments, addCustomer, updateCustomer } = useERP();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Form State for new/edit customer
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: 'Maharashtra',
    country: 'India',
    gstNumber: '',
    panNumber: 'AAACB1234A',
    paymentTerms: 'Net 30' as Customer['paymentTerms'],
    creditLimit: 500000,
    status: 'Active' as Customer['status'],
  });

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.gstNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenCreate = () => {
    setFormData({
      name: '',
      companyName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: 'Maharashtra',
      country: 'India',
      gstNumber: '27AAACB1234A1Z9',
      panNumber: 'AAACB1234A',
      paymentTerms: 'Net 30',
      creditLimit: 500000,
      status: 'Active',
    });
    setIsCreateModalOpen(true);
  };

  const handleOpenEdit = (c: Customer) => {
    setFormData({
      name: c.name,
      companyName: c.companyName,
      email: c.email,
      phone: c.phone,
      address: c.address,
      city: c.city,
      state: c.state,
      country: c.country || 'India',
      gstNumber: c.gstNumber,
      panNumber: c.panNumber || 'AAACB1234A',
      paymentTerms: c.paymentTerms || 'Net 30',
      creditLimit: c.creditLimit,
      status: c.status,
    });
    setSelectedCustomer(c);
    setIsEditModalOpen(true);
  };

  const handleSubmitCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.companyName) return;
    addCustomer(formData);
    setIsCreateModalOpen(false);
  };

  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;
    updateCustomer(selectedCustomer.id, formData);
    setIsEditModalOpen(false);
  };

  // Associated Customer Transactions
  const customerOrders = selectedCustomer
    ? salesOrders.filter((s) => s.customerId === selectedCustomer.id)
    : [];
  const customerInvoices = selectedCustomer
    ? invoices.filter((i) => i.partyId === selectedCustomer.id && i.type === 'Sales')
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Customer Master (CRM)</h1>
            <span className="text-xs bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded-full border border-blue-200">
              {customers.length} Accounts
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage corporate client accounts, GST credentials, credit limits, and real-time ledger balances.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Customer</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by ID, Company, or GSTIN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500">Status:</span>
          {(['All', 'Active', 'Inactive'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                statusFilter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Customer ID</th>
                <th className="py-3 px-4">Company Name</th>
                <th className="py-3 px-4">Contact Person</th>
                <th className="py-3 px-4">GST Number</th>
                <th className="py-3 px-4">City / State</th>
                <th className="py-3 px-4">Credit Limit</th>
                <th className="py-3 px-4">Outstanding Due</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    No customers found matching current filters.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-blue-600">
                      {cust.id}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-900">
                      <div>{cust.companyName}</div>
                      <div className="text-[11px] text-slate-400">{cust.email}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      <div>{cust.name}</div>
                      <div className="text-[11px] text-slate-400">{cust.phone}</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">
                      {cust.gstNumber}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {cust.city}, {cust.state}
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-slate-800">
                      ₹{cust.creditLimit.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold">
                      <span className={cust.outstandingBalance > 0 ? 'text-amber-600' : 'text-emerald-600'}>
                        ₹{cust.outstandingBalance.toLocaleString('en-IN')}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={cust.status} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedCustomer(cust)}
                        className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        title="Customer 360 View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(cust)}
                        className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                        title="Edit Customer"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer 360 View Modal */}
      {selectedCustomer && !isEditModalOpen && (
        <Modal
          isOpen={!!selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          title={`Customer 360: ${selectedCustomer.companyName}`}
          subtitle={`Account ID: ${selectedCustomer.id} • Registered GST: ${selectedCustomer.gstNumber}`}
          maxWidth="4xl"
        >
          <div className="space-y-6 text-xs">
            {/* Top Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-400 font-medium">Contact Details</span>
                <div className="font-bold text-slate-900 mt-1">{selectedCustomer.name}</div>
                <div className="text-slate-500 mt-0.5">{selectedCustomer.email}</div>
                <div className="text-slate-500">{selectedCustomer.phone}</div>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-400 font-medium">Credit Limit Utilization</span>
                <div className="font-bold text-slate-900 mt-1 font-mono">
                  ₹{selectedCustomer.creditLimit.toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Remaining Credit: ₹{Math.max(0, selectedCustomer.creditLimit - selectedCustomer.outstandingBalance).toLocaleString('en-IN')}
                </div>
              </div>

              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-lg">
                <span className="text-amber-800 font-medium">Current Outstanding Due</span>
                <div className="font-bold text-amber-900 text-base mt-1 font-mono">
                  ₹{selectedCustomer.outstandingBalance.toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-amber-700 mt-1">Unpaid customer invoices</div>
              </div>
            </div>

            {/* Address */}
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
              <span className="text-slate-400 font-medium">Billing & Delivery Address:</span>
              <p className="text-slate-700 mt-0.5">{selectedCustomer.address}, {selectedCustomer.city}, {selectedCustomer.state}</p>
            </div>

            {/* Transaction History: Orders & Invoices */}
            <div className="space-y-4">
              <h4 className="font-bold text-sm text-slate-900">Associated Sales Orders ({customerOrders.length})</h4>
              {customerOrders.length === 0 ? (
                <div className="p-4 bg-slate-50 text-slate-400 text-center rounded-lg">No orders recorded yet</div>
              ) : (
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-600 font-semibold">
                      <tr>
                        <th className="p-2">Order ID</th>
                        <th className="p-2">Date</th>
                        <th className="p-2">Total Amount</th>
                        <th className="p-2">Status</th>
                        <th className="p-2">Delivery</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {customerOrders.map((so) => (
                        <tr key={so.id}>
                          <td className="p-2 font-mono font-semibold text-blue-600">{so.orderNumber}</td>
                          <td className="p-2">{so.orderDate}</td>
                          <td className="p-2 font-mono font-bold">₹{so.totalAmount.toLocaleString('en-IN')}</td>
                          <td className="p-2"><StatusBadge status={so.status} size="sm" /></td>
                          <td className="p-2"><StatusBadge status={so.deliveryStatus} size="sm" /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <h4 className="font-bold text-sm text-slate-900 pt-2">Associated Invoices & Bills ({customerInvoices.length})</h4>
              {customerInvoices.length === 0 ? (
                <div className="p-4 bg-slate-50 text-slate-400 text-center rounded-lg">No invoices issued yet</div>
              ) : (
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-600 font-semibold">
                      <tr>
                        <th className="p-2">Invoice #</th>
                        <th className="p-2">Date</th>
                        <th className="p-2">Amount</th>
                        <th className="p-2">Paid</th>
                        <th className="p-2">Balance Due</th>
                        <th className="p-2">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {customerInvoices.map((inv) => (
                        <tr key={inv.id}>
                          <td className="p-2 font-mono font-semibold text-slate-900">{inv.invoiceNumber}</td>
                          <td className="p-2">{inv.invoiceDate}</td>
                          <td className="p-2 font-mono">₹{inv.totalAmount.toLocaleString('en-IN')}</td>
                          <td className="p-2 font-mono text-emerald-600">₹{inv.paidAmount.toLocaleString('en-IN')}</td>
                          <td className="p-2 font-mono font-bold text-rose-600">₹{inv.balanceAmount.toLocaleString('en-IN')}</td>
                          <td className="p-2"><StatusBadge status={inv.status} size="sm" /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Create Customer Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Register New Customer"
        subtitle="Add a new business or corporate account to the ERP customer master"
      >
        <form onSubmit={handleSubmitCreate} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Company / Entity Name *</label>
              <input
                type="text"
                required
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                placeholder="e.g. Apex Industrial Solutions Ltd."
                className="w-full p-2 border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Contact Person Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Rahul Sharma"
                className="w-full p-2 border border-slate-200 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="accounts@company.com"
                className="w-full p-2 border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Phone Number *</label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98200 12345"
                className="w-full p-2 border border-slate-200 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">GSTIN Number *</label>
              <input
                type="text"
                required
                value={formData.gstNumber}
                onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value.toUpperCase() })}
                placeholder="27AAACB1234A1Z9"
                className="w-full p-2 border border-slate-200 rounded-lg font-mono uppercase"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-semibold mb-1">City *</label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Mumbai"
                className="w-full p-2 border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-semibold mb-1">State *</label>
              <input
                type="text"
                required
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                placeholder="Maharashtra"
                className="w-full p-2 border border-slate-200 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Credit Limit (INR)</label>
              <input
                type="number"
                value={formData.creditLimit}
                onChange={(e) => setFormData({ ...formData, creditLimit: Number(e.target.value) })}
                className="w-full p-2 border border-slate-200 rounded-lg font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Account Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full p-2 border border-slate-200 rounded-lg"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-1">Registered Billing Address</label>
            <textarea
              rows={2}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Building, Road, Industrial Area..."
              className="w-full p-2 border border-slate-200 rounded-lg"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-xs"
            >
              Save Customer
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Customer Modal */}
      {selectedCustomer && isEditModalOpen && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title={`Edit Customer: ${selectedCustomer.id}`}
          subtitle={selectedCustomer.companyName}
        >
          <form onSubmit={handleSubmitEdit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Contact Person</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Phone</label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Credit Limit</label>
                <input
                  type="number"
                  value={formData.creditLimit}
                  onChange={(e) => setFormData({ ...formData, creditLimit: Number(e.target.value) })}
                  className="w-full p-2 border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full p-2 border border-slate-200 rounded-lg"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-xs"
              >
                Update Customer
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
