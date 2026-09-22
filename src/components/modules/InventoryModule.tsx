import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import {
  Boxes,
  ArrowRightLeft,
  Sliders,
  History,
  AlertTriangle,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownLeft,
  Building,
  CheckCircle2
} from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';

export const InventoryModule: React.FC = () => {
  const {
    products,
    warehouses,
    inventoryMovements,
    stockTransfer,
    stockAdjustment,
  } = useERP();

  const [activeTab, setActiveTab] = useState<'matrix' | 'movements'>('matrix');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWarehouseFilter, setSelectedWarehouseFilter] = useState('All');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('All');

  // Modals
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);

  // Transfer Form State
  const [transferData, setTransferData] = useState({
    productId: products[0]?.id || '',
    fromWarehouseId: 'WH-MUM',
    toWarehouseId: 'WH-AHM',
    quantity: 5,
    notes: 'Inter-warehouse stock rebalancing',
  });

  // Adjustment Form State
  const [adjustData, setAdjustData] = useState({
    productId: products[0]?.id || '',
    warehouseId: 'WH-MUM',
    diffQuantity: -2,
    reason: 'Physical inventory audit variance / Damaged packaging',
  });

  // KPI aggregates
  const totalProductsCount = products.length;
  const lowStockCount = products.filter((p) => p.currentStock <= p.minStockLevel).length;
  const outOfStockCount = products.filter((p) => p.currentStock === 0).length;
  const totalInventoryValue = products.reduce(
    (sum, p) => sum + p.currentStock * p.purchasePrice,
    0
  );

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const filteredMovements = inventoryMovements.filter((m) => {
    const matchesSearch =
      m.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.referenceDocId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesWh =
      selectedWarehouseFilter === 'All' || m.warehouseId === selectedWarehouseFilter;
    const matchesType =
      selectedTypeFilter === 'All' || m.type === selectedTypeFilter;
    return matchesSearch && matchesWh && matchesType;
  });

  const handleExecuteTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (transferData.fromWarehouseId === transferData.toWarehouseId) {
      alert('Source and destination warehouses cannot be the same');
      return;
    }
    const success = stockTransfer(
      transferData.productId,
      transferData.fromWarehouseId,
      transferData.toWarehouseId,
      Number(transferData.quantity),
      transferData.notes
    );
    if (success) setIsTransferModalOpen(false);
  };

  const handleExecuteAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    stockAdjustment(
      adjustData.productId,
      adjustData.warehouseId,
      Number(adjustData.diffQuantity),
      adjustData.reason
    );
    setIsAdjustModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Inventory & Warehouse Management
            </h1>
            <span className="text-xs bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded-full border border-indigo-200">
              Multi-Warehouse Stock Control
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time stock valuation, inter-warehouse transfers, manual audit adjustments, and complete movement history.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsTransferModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Stock Transfer</span>
          </button>
          <button
            onClick={() => setIsAdjustModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Stock Adjustment</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Stock Valuation
            </span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2 font-mono">
            ₹{totalInventoryValue.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Across {warehouses.length} physical facilities
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Active Catalog SKUs
            </span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2 font-mono">
            {totalProductsCount} Items
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {products.reduce((acc, p) => acc + p.currentStock, 0)} total units
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Low Stock Alerts
            </span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-600 mt-2 font-mono">
            {lowStockCount} Items
          </div>
          <div className="text-xs text-amber-700 mt-1 font-medium">
            Below safety reorder threshold
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Out of Stock
            </span>
            <div className="p-2 rounded-lg bg-rose-50 text-rose-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-rose-600 mt-2 font-mono">
            {outOfStockCount} Items
          </div>
          <div className="text-xs text-slate-500 mt-1">Immediate PO required</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('matrix')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              activeTab === 'matrix'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Boxes className="w-4 h-4" />
            <span>Multi-Warehouse Stock Matrix</span>
          </button>

          <button
            onClick={() => setActiveTab('movements')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              activeTab === 'movements'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Stock Movement Ledger ({inventoryMovements.length})</span>
          </button>
        </div>

        {/* Global filter input */}
        <div className="relative w-64 hidden sm:block">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search items or refs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Tab 1: Multi-Warehouse Stock Matrix */}
      {activeTab === 'matrix' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Item ID & SKU</th>
                  <th className="py-3 px-4">Product Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-center">WH-MUM (Mumbai)</th>
                  <th className="py-3 px-4 text-center">WH-AHM (Ahmedabad)</th>
                  <th className="py-3 px-4 text-center">WH-BLR (Bengaluru)</th>
                  <th className="py-3 px-4 text-right">Total Stock</th>
                  <th className="py-3 px-4 text-right">Inventory Value</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((p) => {
                  const mumStock = p.warehouseStock['WH-MUM'] || 0;
                  const ahmStock = p.warehouseStock['WH-AHM'] || 0;
                  const blrStock = p.warehouseStock['WH-BLR'] || 0;
                  const isLow = p.currentStock <= p.minStockLevel;

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-semibold text-blue-600">
                        <div>{p.id}</div>
                        <div className="text-[10px] text-slate-400">{p.sku}</div>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-900">
                        {p.name}
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-[11px]">
                          {p.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-medium text-slate-700">
                        <span className={mumStock === 0 ? 'text-slate-300' : ''}>
                          {mumStock} {p.unit}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-medium text-slate-700">
                        <span className={ahmStock === 0 ? 'text-slate-300' : ''}>
                          {ahmStock} {p.unit}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-medium text-slate-700">
                        <span className={blrStock === 0 ? 'text-slate-300' : ''}>
                          {blrStock} {p.unit}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                        <span className={isLow ? 'text-amber-600' : ''}>
                          {p.currentStock} {p.unit}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-medium text-slate-800">
                        ₹{(p.currentStock * p.purchasePrice).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={isLow ? 'Low Stock' : p.status} size="sm" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Stock Movement Ledger */}
      {activeTab === 'movements' && (
        <div className="space-y-4">
          {/* Movement filters */}
          <div className="flex flex-wrap items-center gap-2 bg-white p-3 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500">Warehouse:</span>
            <select
              value={selectedWarehouseFilter}
              onChange={(e) => setSelectedWarehouseFilter(e.target.value)}
              className="text-xs p-1.5 border border-slate-200 rounded-md bg-slate-50"
            >
              <option value="All">All Warehouses</option>
              {warehouses.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.id} - {w.name}
                </option>
              ))}
            </select>

            <span className="text-xs text-slate-500 ml-2">Movement Type:</span>
            <select
              value={selectedTypeFilter}
              onChange={(e) => setSelectedTypeFilter(e.target.value)}
              className="text-xs p-1.5 border border-slate-200 rounded-md bg-slate-50"
            >
              <option value="All">All Types</option>
              <option value="Purchase Receipt">Purchase Receipt</option>
              <option value="Sales Delivery">Sales Delivery</option>
              <option value="Transfer In">Transfer In</option>
              <option value="Transfer Out">Transfer Out</option>
              <option value="Adjustment Increase">Adjustment Increase</option>
              <option value="Adjustment Decrease">Adjustment Decrease</option>
            </select>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Movement ID</th>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Product Name & SKU</th>
                    <th className="py-3 px-4">Movement Type</th>
                    <th className="py-3 px-4">Warehouse</th>
                    <th className="py-3 px-4 text-center">Change Qty</th>
                    <th className="py-3 px-4 text-center">Pre → Post</th>
                    <th className="py-3 px-4">Reference Doc</th>
                    <th className="py-3 px-4">Operator</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredMovements.map((mov) => {
                    const isPositive = mov.quantity > 0;
                    return (
                      <tr key={mov.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4 font-mono font-semibold text-slate-700">
                          {mov.id}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-500">
                          {mov.date}
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-900">
                          <div>{mov.productName}</div>
                          <div className="text-[10px] font-mono text-slate-400">{mov.sku}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                              mov.type.includes('Receipt') || mov.type.includes('In') || mov.type.includes('Increase')
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-rose-50 text-rose-700 border-rose-200'
                            }`}
                          >
                            {mov.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-700">
                          {mov.warehouseId}
                        </td>
                        <td className="py-3 px-4 text-center font-mono font-bold">
                          <span className={isPositive ? 'text-emerald-600' : 'text-rose-600'}>
                            {isPositive ? `+${mov.quantity}` : mov.quantity}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center font-mono text-slate-500">
                          {mov.previousStock} → {mov.newStock}
                        </td>
                        <td className="py-3 px-4 font-mono font-semibold text-blue-600">
                          {mov.referenceDocId}
                        </td>
                        <td className="py-3 px-4 text-slate-500">
                          {mov.performedBy}
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

      {/* Stock Transfer Modal */}
      <Modal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        title="Execute Inter-Warehouse Stock Transfer"
        subtitle="Shift physical stock between regional fulfillment centers"
      >
        <form onSubmit={handleExecuteTransfer} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-600 font-semibold mb-1">Select Product *</label>
            <select
              value={transferData.productId}
              onChange={(e) => setTransferData({ ...transferData, productId: e.target.value })}
              className="w-full p-2 border border-slate-200 rounded-lg font-medium"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.sku}) - Stock: {p.currentStock} {p.unit}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Source Warehouse (From) *</label>
              <select
                value={transferData.fromWarehouseId}
                onChange={(e) => setTransferData({ ...transferData, fromWarehouseId: e.target.value })}
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
              <label className="block text-slate-600 font-semibold mb-1">Destination Warehouse (To) *</label>
              <select
                value={transferData.toWarehouseId}
                onChange={(e) => setTransferData({ ...transferData, toWarehouseId: e.target.value })}
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
            <label className="block text-slate-600 font-semibold mb-1">Transfer Quantity *</label>
            <input
              type="number"
              min={1}
              required
              value={transferData.quantity}
              onChange={(e) => setTransferData({ ...transferData, quantity: Number(e.target.value) })}
              className="w-full p-2 border border-slate-200 rounded-lg font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-1">Transfer Remarks / Notes</label>
            <textarea
              rows={2}
              value={transferData.notes}
              onChange={(e) => setTransferData({ ...transferData, notes: e.target.value })}
              className="w-full p-2 border border-slate-200 rounded-lg"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsTransferModalOpen(false)}
              className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold shadow-xs"
            >
              Confirm Transfer
            </button>
          </div>
        </form>
      </Modal>

      {/* Stock Adjustment Modal */}
      <Modal
        isOpen={isAdjustModalOpen}
        onClose={() => setIsAdjustModalOpen(false)}
        title="Physical Inventory Adjustment"
        subtitle="Correct ledger quantity for discrepancies, damaged goods, or audit variances"
      >
        <form onSubmit={handleExecuteAdjustment} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-600 font-semibold mb-1">Select Product *</label>
            <select
              value={adjustData.productId}
              onChange={(e) => setAdjustData({ ...adjustData, productId: e.target.value })}
              className="w-full p-2 border border-slate-200 rounded-lg"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.sku}) - Current: {p.currentStock} {p.unit}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Warehouse Location *</label>
              <select
                value={adjustData.warehouseId}
                onChange={(e) => setAdjustData({ ...adjustData, warehouseId: e.target.value })}
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
              <label className="block text-slate-600 font-semibold mb-1">Difference Qty (+ or -) *</label>
              <input
                type="number"
                required
                value={adjustData.diffQuantity}
                onChange={(e) => setAdjustData({ ...adjustData, diffQuantity: Number(e.target.value) })}
                className="w-full p-2 border border-slate-200 rounded-lg font-mono"
              />
              <span className="text-[10px] text-slate-400">Positive adds stock, negative subtracts</span>
            </div>
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-1">Reason for Adjustment *</label>
            <textarea
              rows={2}
              required
              value={adjustData.reason}
              onChange={(e) => setAdjustData({ ...adjustData, reason: e.target.value })}
              placeholder="e.g. Audit variance, transit damage, expiry..."
              className="w-full p-2 border border-slate-200 rounded-lg"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAdjustModalOpen(false)}
              className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-semibold shadow-xs"
            >
              Post Adjustment
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
