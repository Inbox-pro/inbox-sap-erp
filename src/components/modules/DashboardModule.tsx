import React from 'react';
import { useERP } from '../../context/ERPContext';
import {
  TrendingUp,
  TrendingDown,
  Boxes,
  CreditCard,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  ShoppingCart,
  ShoppingBag,
  Plus,
  ArrowRight,
  CheckCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { StatusBadge } from '../common/StatusBadge';

export const DashboardModule: React.FC = () => {
  const {
    salesOrders,
    purchaseOrders,
    products,
    invoices,
    customers,
    vendors,
    setActiveTab,
    runFullPurchaseDemo,
    runFullSalesDemo,
    isSimulating,
  } = useERP();

  // Metrics Calculations
  const totalRevenue = salesOrders.reduce((sum, so) => sum + so.totalAmount, 0);
  const totalPurchases = purchaseOrders.reduce((sum, po) => sum + po.totalAmount, 0);

  const inventoryValuation = products.reduce(
    (sum, p) => sum + p.currentStock * p.purchasePrice,
    0
  );

  const accountsReceivable = invoices
    .filter((inv) => inv.type === 'Sales' && inv.status !== 'Paid')
    .reduce((sum, inv) => sum + inv.balanceAmount, 0);

  const accountsPayable = invoices
    .filter((inv) => inv.type === 'Purchase' && inv.status !== 'Paid')
    .reduce((sum, inv) => sum + inv.balanceAmount, 0);

  const netOperatingSpread = totalRevenue - totalPurchases;

  const lowStockItems = products.filter((p) => p.currentStock <= p.minStockLevel);

  // Chart Data: Monthly Sales vs Purchases Comparison
  const monthlyData = [
    { month: 'Oct 2024', sales: 1850000, purchases: 1420000 },
    { month: 'Nov 2024', sales: 2200000, purchases: 1680000 },
    { month: 'Dec 2024', sales: 2750000, purchases: 1950000 },
    { month: 'Jan 2025', sales: 2400000, purchases: 1720000 },
    { month: 'Feb 2025', sales: 2950000, purchases: 2100000 },
    { month: 'Mar 2025', sales: totalRevenue, purchases: totalPurchases },
  ];

  // Inventory by Category Data
  const categoryCounts = products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + p.currentStock * p.purchasePrice;
    return acc;
  }, {} as Record<string, number>);

  const pieColors = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ec4899'];
  const categoryData = Object.entries(categoryCounts).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome & Quick Simulator */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Enterprise Executive Overview
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Multi-entity consolidated dashboard • Real-time cross-module synchronization
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setActiveTab('sales')}
              className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Create Sales Order</span>
            </button>
            <button
              onClick={() => setActiveTab('procurement')}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>New Purchase Order</span>
            </button>
            <button
              onClick={() => setActiveTab('inventory')}
              className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold rounded-lg shadow-2xs transition-colors"
            >
              <Boxes className="w-3.5 h-3.5" />
              <span>Stock Transfer</span>
            </button>
          </div>
        </div>
      </div>

      {/* Low Stock Warning Banner if any */}
      {lowStockItems.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between gap-4 text-amber-900">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-100 text-amber-700 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wide">
                Inventory Alert: {lowStockItems.length} Products Below Safety Threshold
              </h2>
              <p className="text-xs text-amber-700 mt-0.5">
                Items like {lowStockItems.slice(0, 2).map((p) => p.name).join(', ')} need replenishment.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('inventory')}
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg shrink-0 transition-colors"
          >
            Review & Restock
          </button>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Revenue (Orders)
            </span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2 font-mono">
            ₹{totalRevenue.toLocaleString('en-IN')}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-600 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+14.2% vs previous period</span>
          </div>
        </div>

        {/* Total Purchases */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Procurement Spend
            </span>
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2 font-mono">
            ₹{totalPurchases.toLocaleString('en-IN')}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-500">
            <span>{purchaseOrders.length} Purchase Orders active</span>
          </div>
        </div>

        {/* Accounts Receivable */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Accounts Receivable (AR)
            </span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2 font-mono">
            ₹{accountsReceivable.toLocaleString('en-IN')}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-amber-600 font-medium">
            <Clock className="w-3.5 h-3.5" />
            <span>Pending customer settlements</span>
          </div>
        </div>

        {/* Accounts Payable */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Accounts Payable (AP)
            </span>
            <div className="p-2 rounded-lg bg-rose-50 text-rose-600">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2 font-mono">
            ₹{accountsPayable.toLocaleString('en-IN')}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-500">
            <span>Payable to suppliers</span>
          </div>
        </div>
      </div>

      {/* Secondary KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center justify-between shadow-2xs">
          <div>
            <span className="text-xs font-medium text-slate-500">Warehouse Stock Valuation</span>
            <div className="text-xl font-bold text-slate-900 font-mono mt-1">
              ₹{inventoryValuation.toLocaleString('en-IN')}
            </div>
            <span className="text-[11px] text-slate-400">Across 3 regional warehouses</span>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Boxes className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center justify-between shadow-2xs">
          <div>
            <span className="text-xs font-medium text-slate-500">Active Customers</span>
            <div className="text-xl font-bold text-slate-900 font-mono mt-1">
              {customers.length} Accounts
            </div>
            <span className="text-[11px] text-slate-400">100% KYC verified with GSTIN</span>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <ShoppingCart className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center justify-between shadow-2xs">
          <div>
            <span className="text-xs font-medium text-slate-500">Verified Suppliers</span>
            <div className="text-xl font-bold text-slate-900 font-mono mt-1">
              {vendors.length} Vendors
            </div>
            <span className="text-[11px] text-slate-400">Net 30 & Net 45 payment terms</span>
          </div>
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Charts Section: Monthly Trends & Category Allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales vs Procurement Trend Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Revenue vs Procurement Expenditure (INR)
              </h2>
              <p className="text-xs text-slate-500">Trailing 6-month operational comparison</p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
              FY 24-25
            </span>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`}
                />
                <Tooltip
                  formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, '']}
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="sales" name="Sales Revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="purchases" name="Purchases Spend" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Inventory Category Value Allocation */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Inventory Valuation by Category</h2>
              <p className="text-xs text-slate-500">Asset distribution in warehouses</p>
            </div>
          </div>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Valuation']}
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 mt-2">
            {categoryData.map((cat, idx) => (
              <div key={cat.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: pieColors[idx % pieColors.length] }}
                  />
                  <span className="text-slate-600 truncate">{cat.name}</span>
                </div>
                <span className="font-mono font-medium text-slate-900">
                  ₹{(cat.value / 100000).toFixed(1)}L
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Sales Orders */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">Recent Sales Orders</h3>
            </div>
            <button
              onClick={() => setActiveTab('sales')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-2.5 px-3">Order ID</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Delivery</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {salesOrders.slice(0, 5).map((so) => (
                  <tr key={so.id} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 font-mono font-semibold text-slate-800">
                      {so.orderNumber}
                    </td>
                    <td className="py-2.5 px-3 text-slate-700 font-medium truncate max-w-[130px]">
                      {so.customerName}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                      ₹{so.totalAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-2.5 px-3">
                      <StatusBadge status={so.status} size="sm" />
                    </td>
                    <td className="py-2.5 px-3">
                      <StatusBadge status={so.deliveryStatus} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Purchase Orders */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-purple-600" />
              <h3 className="text-sm font-bold text-slate-900">Recent Purchase Orders</h3>
            </div>
            <button
              onClick={() => setActiveTab('procurement')}
              className="text-xs font-semibold text-purple-600 hover:text-purple-800 flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-2.5 px-3">PO Number</th>
                  <th className="py-2.5 px-3">Vendor</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Warehouse</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {purchaseOrders.slice(0, 5).map((po) => (
                  <tr key={po.id} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 font-mono font-semibold text-slate-800">
                      {po.poNumber}
                    </td>
                    <td className="py-2.5 px-3 text-slate-700 font-medium truncate max-w-[130px]">
                      {po.vendorName}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                      ₹{po.totalAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-2.5 px-3">
                      <StatusBadge status={po.status} size="sm" />
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-500">
                      {po.warehouseId}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
