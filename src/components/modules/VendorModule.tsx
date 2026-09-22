import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { Vendor } from '../../types/erp';
import {
  Building2,
  Search,
  Plus,
  Mail,
  Phone,
  Eye,
  Edit2,
  ShoppingBag,
  DollarSign,
  Clock
} from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';

export const VendorModule: React.FC = () => {
  const { vendors, purchaseOrders, invoices, addVendor, updateVendor } = useERP();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All');
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: 'Maharashtra',
    gstNumber: '',
    paymentTerms: 'Net 30' as Vendor['paymentTerms'],
    status: 'Active' as Vendor['status'],
  });

  const filteredVendors = vendors.filter((v) => {
    const matchesSearch =
      v.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.gstNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenCreate = () => {
    setFormData({
      name: '',
      companyName: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: 'Maharashtra',
      gstNumber: '27AABCM4567A1Z3',
      paymentTerms: 'Net 30',
      status: 'Active',
    });
    setIsCreateModalOpen(true);
  };

  const handleOpenEdit = (v: Vendor) => {
    setFormData({
      name: v.name,
      companyName: v.companyName,
      contactPerson: v.contactPerson,
      email: v.email,
      phone: v.phone,
      address: v.address,
      city: v.city,
      state: v.state,
      gstNumber: v.gstNumber,
      paymentTerms: v.paymentTerms,
      status: v.status,
    });
    setSelectedVendor(v);
    setIsEditModalOpen(true);
  };

  const handleSubmitCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.companyName) return;
    addVendor({
      ...formData,
      name: formData.companyName,
      rating: 4.8,
    });
    setIsCreateModalOpen(false);
  };

  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVendor) return;
    updateVendor(selectedVendor.id, formData);
    setIsEditModalOpen(false);
  };

  const vendorPOs = selectedVendor
    ? purchaseOrders.filter((p) => p.vendorId === selectedVendor.id)
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Vendor Master (Suppliers)</h1>
            <span className="text-xs bg-purple-50 text-purple-700 font-semibold px-2 py-0.5 rounded-full border border-purple-200">
              {vendors.length} Onboarded
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Supplier directory, GST compliance credentials, payment terms, and accounts payable balances.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Vendor</span>
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
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-purple-500"
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
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Vendors Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Vendor ID</th>
                <th className="py-3 px-4">Company Name</th>
                <th className="py-3 px-4">Contact Person</th>
                <th className="py-3 px-4">GST Number</th>
                <th className="py-3 px-4">City / State</th>
                <th className="py-3 px-4">Payment Terms</th>
                <th className="py-3 px-4">Accounts Payable</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredVendors.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    No suppliers found matching current filters.
                  </td>
                </tr>
              ) : (
                filteredVendors.map((ven) => (
                  <tr key={ven.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-purple-600">
                      {ven.id}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-900">
                      <div>{ven.companyName}</div>
                      <div className="text-[11px] text-slate-400">{ven.email}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      <div>{ven.contactPerson}</div>
                      <div className="text-[11px] text-slate-400">{ven.phone}</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">
                      {ven.gstNumber}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {ven.city}, {ven.state}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {ven.paymentTerms}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold">
                      <span className={ven.outstandingPayable > 0 ? 'text-rose-600' : 'text-slate-600'}>
                        ₹{ven.outstandingPayable.toLocaleString('en-IN')}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={ven.status} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedVendor(ven)}
                        className="p-1.5 text-slate-600 hover:text-purple-600 hover:bg-purple-50 rounded-md transition-colors"
                        title="View Vendor Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(ven)}
                        className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                        title="Edit Vendor"
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

      {/* Vendor 360 View Modal */}
      {selectedVendor && !isEditModalOpen && (
        <Modal
          isOpen={!!selectedVendor}
          onClose={() => setSelectedVendor(null)}
          title={`Vendor Details: ${selectedVendor.companyName}`}
          subtitle={`Supplier ID: ${selectedVendor.id} • GSTIN: ${selectedVendor.gstNumber}`}
          maxWidth="4xl"
        >
          <div className="space-y-6 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-400 font-medium">Contact Person</span>
                <div className="font-bold text-slate-900 mt-1">{selectedVendor.contactPerson}</div>
                <div className="text-slate-500 mt-0.5">{selectedVendor.email}</div>
                <div className="text-slate-500">{selectedVendor.phone}</div>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-400 font-medium">Credit Agreement</span>
                <div className="font-bold text-slate-900 mt-1">{selectedVendor.paymentTerms}</div>
                <div className="text-[11px] text-slate-500 mt-1">Due within invoice period</div>
              </div>

              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-lg">
                <span className="text-rose-800 font-medium">Current Accounts Payable</span>
                <div className="font-bold text-rose-900 text-base mt-1 font-mono">
                  ₹{selectedVendor.outstandingPayable.toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-rose-700 mt-1">Pending supplier disbursement</div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
              <span className="text-slate-400 font-medium">Factory / Registered Office:</span>
              <p className="text-slate-700 mt-0.5">{selectedVendor.address}, {selectedVendor.city}, {selectedVendor.state}</p>
            </div>

            {/* Purchase Orders with this vendor */}
            <div>
              <h4 className="font-bold text-sm text-slate-900 mb-2">Purchase Orders ({vendorPOs.length})</h4>
              {vendorPOs.length === 0 ? (
                <div className="p-4 bg-slate-50 text-slate-400 text-center rounded-lg">No POs issued to this vendor yet</div>
              ) : (
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-600 font-semibold">
                      <tr>
                        <th className="p-2">PO Number</th>
                        <th className="p-2">Date</th>
                        <th className="p-2">Warehouse</th>
                        <th className="p-2">Total Amount</th>
                        <th className="p-2">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {vendorPOs.map((po) => (
                        <tr key={po.id}>
                          <td className="p-2 font-mono font-semibold text-purple-600">{po.poNumber}</td>
                          <td className="p-2">{po.orderDate}</td>
                          <td className="p-2 font-mono">{po.warehouseId}</td>
                          <td className="p-2 font-mono font-bold">₹{po.totalAmount.toLocaleString('en-IN')}</td>
                          <td className="p-2"><StatusBadge status={po.status} size="sm" /></td>
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

      {/* Create Vendor Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Register New Vendor"
        subtitle="Onboard a new supplier to the procurement and purchase master"
      >
        <form onSubmit={handleSubmitCreate} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Company / Supplier Name *</label>
              <input
                type="text"
                required
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                placeholder="e.g. Precision Microelectronics Pvt Ltd"
                className="w-full p-2 border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Contact Person Name *</label>
              <input
                type="text"
                required
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                placeholder="e.g. Vikram Patel"
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
                placeholder="sales@supplier.com"
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
                placeholder="+91 98210 56789"
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
                placeholder="27AABCM4567A1Z3"
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
                placeholder="Pune"
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
              <label className="block text-slate-600 font-semibold mb-1">Payment Terms</label>
              <select
                value={formData.paymentTerms}
                onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value as any })}
                className="w-full p-2 border border-slate-200 rounded-lg"
              >
                <option value="Net 15">Net 15 Days</option>
                <option value="Net 30">Net 30 Days</option>
                <option value="Net 45">Net 45 Days</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Supplier Status</label>
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
            <label className="block text-slate-600 font-semibold mb-1">Factory Address</label>
            <textarea
              rows={2}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Plot No, Industrial Estate, Phase..."
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
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold shadow-xs"
            >
              Save Vendor
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Vendor Modal */}
      {selectedVendor && isEditModalOpen && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title={`Edit Vendor: ${selectedVendor.id}`}
          subtitle={selectedVendor.companyName}
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
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
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
                <label className="block text-slate-600 font-semibold mb-1">Payment Terms</label>
                <select
                  value={formData.paymentTerms}
                  onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value as any })}
                  className="w-full p-2 border border-slate-200 rounded-lg"
                >
                  <option value="Net 15">Net 15 Days</option>
                  <option value="Net 30">Net 30 Days</option>
                  <option value="Net 45">Net 45 Days</option>
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
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold shadow-xs"
              >
                Update Vendor
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
