import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { Product } from '../../types/erp';
import {
  Package,
  Search,
  Plus,
  Boxes,
  Eye,
  Edit2,
  TrendingUp,
  AlertTriangle,
  ArrowUpDown,
  History
} from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';

export const ProductModule: React.FC = () => {
  const { products, warehouses, inventoryMovements, addProduct, updateProduct } = useERP();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const categories = ['All', 'Networking', 'IT Hardware', 'Storage', 'Software', 'Raw Materials', 'Office Supplies'];

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: 'Networking' as Product['category'],
    unit: 'Pcs' as Product['unit'],
    purchasePrice: 10000,
    sellingPrice: 14000,
    taxRate: 18,
    minStockLevel: 10,
    status: 'Active' as Product['status'],
    initialWarehouseId: 'WH-MUM',
    initialQty: 25,
    description: '',
  });

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'All' || p.category === categoryFilter;
    const matchesStatus =
      statusFilter === 'All'
        ? true
        : statusFilter === 'Low Stock'
        ? p.currentStock <= p.minStockLevel
        : p.status === statusFilter;
    return matchesSearch && matchesCat && matchesStatus;
  });

  const handleOpenCreate = () => {
    setFormData({
      name: '',
      sku: 'SKU-' + Math.floor(1000 + Math.random() * 9000),
      category: 'Networking' as Product['category'],
      unit: 'Pcs',
      purchasePrice: 15000,
      sellingPrice: 21000,
      taxRate: 18,
      minStockLevel: 10,
      status: 'Active',
      initialWarehouseId: 'WH-MUM',
      initialQty: 20,
      description: '',
    });
    setIsCreateModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setFormData({
      name: p.name,
      sku: p.sku,
      category: p.category,
      unit: p.unit,
      purchasePrice: p.purchasePrice,
      sellingPrice: p.sellingPrice,
      taxRate: p.taxRate,
      minStockLevel: p.minStockLevel,
      status: p.status,
      initialWarehouseId: p.warehouseId,
      initialQty: p.currentStock,
      description: p.description || '',
    });
    setSelectedProduct(p);
    setIsEditModalOpen(true);
  };

  const handleSubmitCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.sku) return;
    addProduct(
      {
        name: formData.name,
        sku: formData.sku,
        category: formData.category,
        unit: formData.unit,
        purchasePrice: Number(formData.purchasePrice),
        sellingPrice: Number(formData.sellingPrice),
        taxRate: Number(formData.taxRate),
        minStockLevel: Number(formData.minStockLevel),
        reorderQuantity: 20,
        warehouseId: formData.initialWarehouseId,
        status: formData.status,
        description: formData.description,
      },
      formData.initialWarehouseId,
      Number(formData.initialQty)
    );
    setIsCreateModalOpen(false);
  };

  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    updateProduct(selectedProduct.id, {
      name: formData.name,
      category: formData.category,
      unit: formData.unit,
      purchasePrice: Number(formData.purchasePrice),
      sellingPrice: Number(formData.sellingPrice),
      taxRate: Number(formData.taxRate),
      minStockLevel: Number(formData.minStockLevel),
      status: formData.status,
      description: formData.description,
    });
    setIsEditModalOpen(false);
  };

  const productMovements = selectedProduct
    ? inventoryMovements.filter((m) => m.productId === selectedProduct.id)
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Product & Item Master</h1>
            <span className="text-xs bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
              {products.length} SKUs Listed
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Enterprise catalogue of hardware, networking equipment, components, GST tax brackets, and pricing.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Product name, SKU, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-md border border-slate-200 bg-slate-50 text-slate-700"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                Category: {c}
              </option>
            ))}
          </select>

          {/* Status buttons */}
          <div className="flex items-center gap-1">
            {['All', 'Active', 'Low Stock', 'Discontinued'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                  statusFilter === st
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Item ID</th>
                <th className="py-3 px-4">Product Name & SKU</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Cost Price</th>
                <th className="py-3 px-4">Selling Price</th>
                <th className="py-3 px-4">Margin</th>
                <th className="py-3 px-4">GST Rate</th>
                <th className="py-3 px-4">Current Stock</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-400">
                    No items found matching current filters.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((prod) => {
                  const marginPercent = Math.round(
                    ((prod.sellingPrice - prod.purchasePrice) / prod.sellingPrice) * 100
                  );
                  const isLow = prod.currentStock <= prod.minStockLevel;

                  return (
                    <tr key={prod.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-semibold text-emerald-700">
                        {prod.id}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-900">
                        <div>{prod.name}</div>
                        <div className="text-[11px] font-mono text-slate-400">{prod.sku}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        <span className="px-2 py-0.5 rounded bg-slate-100 font-medium text-[11px]">
                          {prod.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600">
                        ₹{prod.purchasePrice.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        ₹{prod.sellingPrice.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-4 font-mono text-emerald-600 font-semibold">
                        {marginPercent}%
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600">
                        {prod.taxRate}% GST
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`font-mono font-bold ${
                              isLow ? 'text-amber-600' : 'text-slate-800'
                            }`}
                          >
                            {prod.currentStock} {prod.unit}
                          </span>
                          {isLow && (
                            <span className="text-[10px] text-amber-600 font-bold px-1.5 py-0.2 bg-amber-50 rounded border border-amber-200">
                              Low
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={isLow ? 'Low Stock' : prod.status} size="sm" />
                      </td>
                      <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          onClick={() => setSelectedProduct(prod)}
                          className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                          title="View Stock Breakdown"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(prod)}
                          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                          title="Edit Item"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Details & Warehouse Stock Modal */}
      {selectedProduct && !isEditModalOpen && (
        <Modal
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          title={`Item Specifications: ${selectedProduct.name}`}
          subtitle={`SKU: ${selectedProduct.sku} • ID: ${selectedProduct.id}`}
          maxWidth="4xl"
        >
          <div className="space-y-6 text-xs">
            {/* Top Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-400 font-medium">Selling Price</span>
                <div className="font-mono font-bold text-base text-slate-900 mt-1">
                  ₹{selectedProduct.sellingPrice.toLocaleString('en-IN')}
                </div>
                <span className="text-[11px] text-slate-500">+ {selectedProduct.taxRate}% GST</span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-400 font-medium">Purchase / Cost Price</span>
                <div className="font-mono font-bold text-base text-slate-700 mt-1">
                  ₹{selectedProduct.purchasePrice.toLocaleString('en-IN')}
                </div>
                <span className="text-[11px] text-emerald-600 font-semibold">
                  Profit: ₹{(selectedProduct.sellingPrice - selectedProduct.purchasePrice).toLocaleString('en-IN')}
                </span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-400 font-medium">Total On-Hand Stock</span>
                <div className="font-mono font-bold text-base text-emerald-700 mt-1">
                  {selectedProduct.currentStock} {selectedProduct.unit}
                </div>
                <span className="text-[11px] text-slate-500">Threshold: {selectedProduct.minStockLevel} {selectedProduct.unit}</span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-400 font-medium">Inventory Asset Value</span>
                <div className="font-mono font-bold text-base text-slate-900 mt-1">
                  ₹{(selectedProduct.currentStock * selectedProduct.purchasePrice).toLocaleString('en-IN')}
                </div>
                <span className="text-[11px] text-slate-500">At cost price</span>
              </div>
            </div>

            {/* Warehouse Distribution */}
            <div>
              <h4 className="font-bold text-sm text-slate-900 mb-2">Regional Warehouse Allocation</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {warehouses.map((wh) => {
                  const qty = selectedProduct.warehouseStock[wh.id] || 0;
                  return (
                    <div key={wh.id} className="p-3 border border-slate-200 rounded-lg bg-slate-50">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800">{wh.name}</span>
                        <span className="text-[10px] font-mono text-slate-500">{wh.id}</span>
                      </div>
                      <div className="mt-2 flex items-baseline justify-between">
                        <span className="text-slate-500">Stock:</span>
                        <span className="text-base font-mono font-bold text-slate-900">
                          {qty} {selectedProduct.unit}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Stock Movement History for this product */}
            <div>
              <h4 className="font-bold text-sm text-slate-900 mb-2">Recent Inventory Movements ({productMovements.length})</h4>
              {productMovements.length === 0 ? (
                <div className="p-4 bg-slate-50 text-slate-400 text-center rounded-lg">No stock movements recorded yet</div>
              ) : (
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-600 font-semibold">
                      <tr>
                        <th className="p-2">Date & Time</th>
                        <th className="p-2">Movement Type</th>
                        <th className="p-2">Warehouse</th>
                        <th className="p-2">Quantity</th>
                        <th className="p-2">Reference</th>
                        <th className="p-2">Executed By</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {productMovements.map((mov) => (
                        <tr key={mov.id}>
                          <td className="p-2 font-mono text-slate-600">{mov.date}</td>
                          <td className="p-2 font-medium">{mov.type}</td>
                          <td className="p-2 font-mono">{mov.warehouseId}</td>
                          <td className="p-2 font-mono font-bold">
                            <span className={mov.quantity > 0 ? 'text-emerald-600' : 'text-rose-600'}>
                              {mov.quantity > 0 ? `+${mov.quantity}` : mov.quantity}
                            </span>
                          </td>
                          <td className="p-2 font-mono text-blue-600">{mov.referenceDocId}</td>
                          <td className="p-2 text-slate-500">{mov.performedBy}</td>
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

      {/* Create Product Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Add New Product / SKU"
        subtitle="Register item specifications, pricing, tax rate, and initial stock"
      >
        <form onSubmit={handleSubmitCreate} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Product Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Cisco Catalyst 2960-X Switch"
                className="w-full p-2 border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-semibold mb-1">SKU / Item Code *</label>
              <input
                type="text"
                required
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
                placeholder="NET-SW-2960X"
                className="w-full p-2 border border-slate-200 rounded-lg font-mono uppercase"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as Product['category'] })}
                className="w-full p-2 border border-slate-200 rounded-lg"
              >
                <option value="Networking">Networking</option>
                <option value="IT Hardware">IT Hardware</option>
                <option value="Storage">Storage</option>
                <option value="Software">Software</option>
                <option value="Raw Materials">Raw Materials</option>
                <option value="Office Supplies">Office Supplies</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Unit of Measure (UOM)</label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value as any })}
                className="w-full p-2 border border-slate-200 rounded-lg"
              >
                <option value="Pcs">Pieces (Pcs)</option>
                <option value="Set">Set</option>
                <option value="Box">Box</option>
                <option value="Meter">Meter</option>
                <option value="Kg">Kilogram (Kg)</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-600 font-semibold mb-1">GST Tax Rate</label>
              <select
                value={formData.taxRate}
                onChange={(e) => setFormData({ ...formData, taxRate: Number(e.target.value) })}
                className="w-full p-2 border border-slate-200 rounded-lg"
              >
                <option value={0}>0% GST</option>
                <option value={5}>5% GST</option>
                <option value={12}>12% GST</option>
                <option value={18}>18% GST (Standard)</option>
                <option value={28}>28% GST</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Purchase / Cost Price (INR)</label>
              <input
                type="number"
                required
                value={formData.purchasePrice}
                onChange={(e) => setFormData({ ...formData, purchasePrice: Number(e.target.value) })}
                className="w-full p-2 border border-slate-200 rounded-lg font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Selling Price (INR)</label>
              <input
                type="number"
                required
                value={formData.sellingPrice}
                onChange={(e) => setFormData({ ...formData, sellingPrice: Number(e.target.value) })}
                className="w-full p-2 border border-slate-200 rounded-lg font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Initial Warehouse</label>
              <select
                value={formData.initialWarehouseId}
                onChange={(e) => setFormData({ ...formData, initialWarehouseId: e.target.value })}
                className="w-full p-2 border border-slate-200 rounded-lg"
              >
                {warehouses.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name} ({w.id})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Initial Stock Units</label>
              <input
                type="number"
                value={formData.initialQty}
                onChange={(e) => setFormData({ ...formData, initialQty: Number(e.target.value) })}
                className="w-full p-2 border border-slate-200 rounded-lg font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Reorder Point (Min)</label>
              <input
                type="number"
                value={formData.minStockLevel}
                onChange={(e) => setFormData({ ...formData, minStockLevel: Number(e.target.value) })}
                className="w-full p-2 border border-slate-200 rounded-lg font-mono"
              />
            </div>
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
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold shadow-xs"
            >
              Register Product
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Product Modal */}
      {selectedProduct && isEditModalOpen && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title={`Edit Product: ${selectedProduct.id}`}
          subtitle={selectedProduct.name}
        >
          <form onSubmit={handleSubmitEdit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Product Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2 border border-slate-200 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Purchase Price (INR)</label>
                <input
                  type="number"
                  value={formData.purchasePrice}
                  onChange={(e) => setFormData({ ...formData, purchasePrice: Number(e.target.value) })}
                  className="w-full p-2 border border-slate-200 rounded-lg font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Selling Price (INR)</label>
                <input
                  type="number"
                  value={formData.sellingPrice}
                  onChange={(e) => setFormData({ ...formData, sellingPrice: Number(e.target.value) })}
                  className="w-full p-2 border border-slate-200 rounded-lg font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Min Stock Reorder Level</label>
                <input
                  type="number"
                  value={formData.minStockLevel}
                  onChange={(e) => setFormData({ ...formData, minStockLevel: Number(e.target.value) })}
                  className="w-full p-2 border border-slate-200 rounded-lg font-mono"
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
                  <option value="Discontinued">Discontinued</option>
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
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold shadow-xs"
              >
                Save Changes
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
