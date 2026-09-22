import React, { useState, useMemo } from 'react';
import { useERP } from '../../context/ERPContext';
import {
  Search,
  Users,
  Building2,
  Package,
  ShoppingCart,
  ShoppingBag,
  FileText,
  UserCheck,
  ArrowRight,
  X
} from 'lucide-react';
import { StatusBadge } from './StatusBadge';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const {
    customers,
    vendors,
    products,
    salesOrders,
    purchaseOrders,
    invoices,
    employees,
    setActiveTab,
  } = useERP();

  const query = searchTerm.trim().toLowerCase();

  const filteredResults = useMemo(() => {
    if (!query) return null;

    const matchedCustomers = customers.filter(
      (c) =>
        c.id.toLowerCase().includes(query) ||
        c.name.toLowerCase().includes(query) ||
        c.companyName.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query) ||
        c.city.toLowerCase().includes(query) ||
        c.gstNumber.toLowerCase().includes(query)
    );

    const matchedVendors = vendors.filter(
      (v) =>
        v.id.toLowerCase().includes(query) ||
        v.name.toLowerCase().includes(query) ||
        v.companyName.toLowerCase().includes(query) ||
        v.contactPerson.toLowerCase().includes(query) ||
        v.gstNumber.toLowerCase().includes(query)
    );

    const matchedProducts = products.filter(
      (p) =>
        p.id.toLowerCase().includes(query) ||
        p.name.toLowerCase().includes(query) ||
        p.sku.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
    );

    const matchedSalesOrders = salesOrders.filter(
      (s) =>
        s.orderNumber.toLowerCase().includes(query) ||
        s.customerName.toLowerCase().includes(query) ||
        s.customerId.toLowerCase().includes(query)
    );

    const matchedPurchaseOrders = purchaseOrders.filter(
      (p) =>
        p.poNumber.toLowerCase().includes(query) ||
        p.vendorName.toLowerCase().includes(query) ||
        p.vendorId.toLowerCase().includes(query)
    );

    const matchedInvoices = invoices.filter(
      (i) =>
        i.invoiceNumber.toLowerCase().includes(query) ||
        i.partyName.toLowerCase().includes(query) ||
        i.referenceId.toLowerCase().includes(query)
    );

    const matchedEmployees = employees.filter(
      (e) =>
        (e.employeeId ? e.employeeId.toLowerCase().includes(query) : false) ||
        (e.id && e.id.toLowerCase().includes(query)) ||
        e.name.toLowerCase().includes(query) ||
        e.department.toLowerCase().includes(query) ||
        e.designation.toLowerCase().includes(query)
    );

    const total =
      matchedCustomers.length +
      matchedVendors.length +
      matchedProducts.length +
      matchedSalesOrders.length +
      matchedPurchaseOrders.length +
      matchedInvoices.length +
      matchedEmployees.length;

    return {
      customers: matchedCustomers,
      vendors: matchedVendors,
      products: matchedProducts,
      salesOrders: matchedSalesOrders,
      purchaseOrders: matchedPurchaseOrders,
      invoices: matchedInvoices,
      employees: matchedEmployees,
      total,
    };
  }, [query, customers, vendors, products, salesOrders, purchaseOrders, invoices, employees]);

  if (!isOpen) return null;

  const navigateTo = (tab: any) => {
    setActiveTab(tab);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 sm:px-6">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col z-10 max-h-[75vh]">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 bg-slate-50/50">
          <Search className="w-5 h-5 text-slate-400 shrink-0 ml-1" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Customers, Vendors, Products, Orders, Invoices, Employees... (e.g. CUS-1001, Server, PO-2025)"
            className="w-full px-3 py-1.5 text-sm bg-transparent border-0 focus:outline-hidden focus:ring-0 text-slate-800 placeholder-slate-400"
            autoFocus
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block text-[10px] uppercase font-mono px-2 py-0.5 bg-slate-200/70 text-slate-600 rounded-md border border-slate-300 ml-2">
            ESC
          </kbd>
        </div>

        {/* Results Area */}
        <div className="p-4 overflow-y-auto space-y-4">
          {!query ? (
            <div className="py-8 text-center text-slate-400 text-sm">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-500" />
              <p>Type an ID, company name, SKU, or person to search across the entire ERP.</p>
              <div className="flex flex-wrap justify-center gap-2 mt-4 text-xs">
                <button
                  onClick={() => setSearchTerm('CUS-1001')}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
                >
                  Try: CUS-1001
                </button>
                <button
                  onClick={() => setSearchTerm('Server')}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
                >
                  Try: Server
                </button>
                <button
                  onClick={() => setSearchTerm('PO-2025')}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
                >
                  Try: PO-2025
                </button>
              </div>
            </div>
          ) : filteredResults && filteredResults.total === 0 ? (
            <div className="py-8 text-center text-slate-500 text-sm">
              No matching records found for "{searchTerm}".
            </div>
          ) : (
            filteredResults && (
              <>
                {/* Customers */}
                {filteredResults.customers.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      <Users className="w-3.5 h-3.5 text-blue-600" />
                      <span>Customers ({filteredResults.customers.length})</span>
                    </div>
                    <div className="space-y-1">
                      {filteredResults.customers.map((c) => (
                        <div
                          key={c.id}
                          onClick={() => navigateTo('customers')}
                          className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 cursor-pointer transition-all"
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm text-slate-900">{c.companyName}</span>
                              <span className="text-xs font-mono text-slate-500">{c.id}</span>
                            </div>
                            <p className="text-xs text-slate-500 truncate">{c.city}, {c.state} • GST: {c.gstNumber}</p>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className="text-xs font-medium text-slate-700">₹{c.outstandingBalance.toLocaleString('en-IN')} Due</span>
                            <ArrowRight className="w-4 h-4 text-slate-400" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Vendors */}
                {filteredResults.vendors.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      <Building2 className="w-3.5 h-3.5 text-purple-600" />
                      <span>Vendors ({filteredResults.vendors.length})</span>
                    </div>
                    <div className="space-y-1">
                      {filteredResults.vendors.map((v) => (
                        <div
                          key={v.id}
                          onClick={() => navigateTo('vendors')}
                          className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 cursor-pointer transition-all"
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm text-slate-900">{v.companyName}</span>
                              <span className="text-xs font-mono text-slate-500">{v.id}</span>
                            </div>
                            <p className="text-xs text-slate-500 truncate">{v.city} • Contact: {v.contactPerson}</p>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className="text-xs font-medium text-slate-700">₹{v.outstandingPayable.toLocaleString('en-IN')} Payable</span>
                            <ArrowRight className="w-4 h-4 text-slate-400" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Products */}
                {filteredResults.products.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      <Package className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Products & Items ({filteredResults.products.length})</span>
                    </div>
                    <div className="space-y-1">
                      {filteredResults.products.map((p) => (
                        <div
                          key={p.id}
                          onClick={() => navigateTo('products')}
                          className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 cursor-pointer transition-all"
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm text-slate-900">{p.name}</span>
                              <span className="text-xs font-mono text-slate-500">{p.sku}</span>
                            </div>
                            <p className="text-xs text-slate-500">Category: {p.category} • Selling: ₹{p.sellingPrice.toLocaleString('en-IN')}</p>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className="text-xs font-medium text-slate-700">Stock: {p.currentStock} {p.unit}</span>
                            <StatusBadge status={p.status} size="sm" />
                            <ArrowRight className="w-4 h-4 text-slate-400" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sales Orders */}
                {filteredResults.salesOrders.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      <ShoppingCart className="w-3.5 h-3.5 text-blue-600" />
                      <span>Sales Orders ({filteredResults.salesOrders.length})</span>
                    </div>
                    <div className="space-y-1">
                      {filteredResults.salesOrders.map((so) => (
                        <div
                          key={so.id}
                          onClick={() => navigateTo('sales')}
                          className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 cursor-pointer transition-all"
                        >
                          <div>
                            <span className="font-mono text-sm font-semibold text-slate-900">{so.orderNumber}</span>
                            <p className="text-xs text-slate-500">{so.customerName} • {so.orderDate}</p>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className="text-xs font-bold text-slate-800">₹{so.totalAmount.toLocaleString('en-IN')}</span>
                            <StatusBadge status={so.status} size="sm" />
                            <ArrowRight className="w-4 h-4 text-slate-400" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Purchase Orders */}
                {filteredResults.purchaseOrders.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      <ShoppingBag className="w-3.5 h-3.5 text-amber-600" />
                      <span>Purchase Orders ({filteredResults.purchaseOrders.length})</span>
                    </div>
                    <div className="space-y-1">
                      {filteredResults.purchaseOrders.map((po) => (
                        <div
                          key={po.id}
                          onClick={() => navigateTo('procurement')}
                          className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 cursor-pointer transition-all"
                        >
                          <div>
                            <span className="font-mono text-sm font-semibold text-slate-900">{po.poNumber}</span>
                            <p className="text-xs text-slate-500">{po.vendorName} • {po.orderDate}</p>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className="text-xs font-bold text-slate-800">₹{po.totalAmount.toLocaleString('en-IN')}</span>
                            <StatusBadge status={po.status} size="sm" />
                            <ArrowRight className="w-4 h-4 text-slate-400" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Invoices */}
                {filteredResults.invoices.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      <FileText className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Invoices ({filteredResults.invoices.length})</span>
                    </div>
                    <div className="space-y-1">
                      {filteredResults.invoices.map((inv) => (
                        <div
                          key={inv.id}
                          onClick={() => navigateTo('invoices')}
                          className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 cursor-pointer transition-all"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-sm font-semibold text-slate-900">{inv.invoiceNumber}</span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 font-semibold text-slate-600">
                                {inv.type}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500">{inv.partyName} • Ref: {inv.referenceId}</p>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className="text-xs font-bold text-slate-800">₹{inv.totalAmount.toLocaleString('en-IN')}</span>
                            <StatusBadge status={inv.status} size="sm" />
                            <ArrowRight className="w-4 h-4 text-slate-400" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Employees */}
                {filteredResults.employees.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      <UserCheck className="w-3.5 h-3.5 text-teal-600" />
                      <span>Employees ({filteredResults.employees.length})</span>
                    </div>
                    <div className="space-y-1">
                      {filteredResults.employees.map((e) => (
                        <div
                          key={e.id}
                          onClick={() => navigateTo('hr')}
                          className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 cursor-pointer transition-all"
                        >
                          <div>
                            <span className="text-sm font-semibold text-slate-900">{e.name}</span>
                            <p className="text-xs text-slate-500">{e.designation} • Dept: {e.department}</p>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className="text-xs font-mono text-slate-600">{e.employeeId}</span>
                            <StatusBadge status={e.status} size="sm" />
                            <ArrowRight className="w-4 h-4 text-slate-400" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-400">
          <span>Enterprise Unified Global Search</span>
          <span>Press ESC to close</span>
        </div>
      </div>
    </div>
  );
};
