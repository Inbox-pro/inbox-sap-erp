import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import {
  User,
  UserRole,
  Company,
  Branch,
  Department,
  Warehouse,
  Customer,
  Vendor,
  Product,
  InventoryMovement,
  PurchaseOrder,
  PurchaseRequisition,
  SalesOrder,
  SalesQuotation,
  Invoice,
  Payment,
  Employee,
  AttendanceRecord,
  LeaveRequest,
  ApprovalTask,
  Notification,
  AuditLog,
  ExpenseItem,
  ChartOfAccount,
  PayrollRecord,
  ApprovalRequest
} from '../types/erp';
import {
  initialCompany,
  initialBranches,
  initialDepartments,
  initialWarehouses,
  demoUsers,
  initialCustomers,
  initialVendors,
  initialProducts,
  initialInventoryMovements,
  initialPurchaseRequisitions,
  initialPurchaseOrders,
  initialSalesQuotations,
  initialSalesOrders,
  initialInvoices,
  initialPayments,
  initialEmployees,
  initialAttendance,
  initialLeaveRequests,
  initialApprovalTasks,
  initialNotifications,
  initialAuditLogs,
  initialExpenses,
} from '../data/mockData';

export type ERPNavModule =
  | 'dashboard'
  | 'organization'
  | 'customers'
  | 'vendors'
  | 'products'
  | 'inventory'
  | 'procurement'
  | 'sales'
  | 'finance'
  | 'invoices'
  | 'hr'
  | 'approvals'
  | 'reports'
  | 'notifications'
  | 'audit-logs'
  | 'settings';

interface Toast {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

interface ERPContextType {
  // Auth & RBAC
  currentUser: User;
  setCurrentUser: (user: User) => void;
  isLoggedIn: boolean;
  login: (roleOrEmail?: UserRole | string, password?: string) => void;
  logout: () => void;
  hasPermission: (module: ERPNavModule) => boolean;

  // Theme
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;

  // Navigation
  activeTab: ERPNavModule;
  setActiveTab: (tab: ERPNavModule) => void;

  // Organization Master
  company: Company;
  branches: Branch[];
  departments: Department[];
  warehouses: Warehouse[];

  // Masters
  customers: Customer[];
  vendors: Vendor[];
  products: Product[];

  // Operations
  inventoryMovements: InventoryMovement[];
  purchaseRequisitions: PurchaseRequisition[];
  purchaseOrders: PurchaseOrder[];
  salesQuotations: SalesQuotation[];
  salesOrders: SalesOrder[];
  invoices: Invoice[];
  payments: Payment[];
  expenses: ExpenseItem[];
  chartOfAccounts: ChartOfAccount[];

  // HR
  employees: Employee[];
  attendance: AttendanceRecord[];
  leaveRequests: LeaveRequest[];
  payrollRecords: PayrollRecord[];

  // Workflows
  approvalTasks: ApprovalTask[];
  approvalRequests: ApprovalRequest[];
  notifications: Notification[];
  auditLogs: AuditLog[];
  unreadNotificationCount: number;

  // Dialog & Modal Controls
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;
  isArchitectureOpen: boolean;
  setIsArchitectureOpen: (open: boolean) => void;

  // Toasts
  toasts: Toast[];
  showToast: (type: Toast['type'], title: string, message: string) => void;
  removeToast: (id: string) => void;

  // Actions - Customers & Vendors
  addCustomer: (cust: Omit<Customer, 'id' | 'createdAt' | 'outstandingBalance'>) => void;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  addVendor: (ven: Omit<Vendor, 'id' | 'createdAt' | 'outstandingPayable'>) => void;
  updateVendor: (id: string, updates: Partial<Vendor>) => void;

  // Actions - Products & Inventory
  addProduct: (prod: Omit<Product, 'id' | 'createdAt' | 'currentStock' | 'reservedStock' | 'warehouseStock'>, initialWarehouseId: string, initialQty: number) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  stockIn: (productId: string, warehouseId: string, quantity: number, reference: string, notes?: string) => void;
  stockOut: (productId: string, warehouseId: string, quantity: number, reference: string, notes?: string) => boolean;
  stockTransfer: (productId: string, fromWarehouseId: string, toWarehouseId: string, quantity: number, notes?: string) => boolean;
  stockAdjustment: (productId: string, warehouseId: string, diffQuantity: number, reason: string) => void;

  // Actions - Procurement Flow
  createPurchaseRequisition: (req: Omit<PurchaseRequisition, 'id' | 'reqNumber' | 'status'>) => void;
  approvePurchaseRequisition: (id: string, comment?: string) => void;
  rejectPurchaseRequisition: (id: string, comment?: string) => void;
  convertPRToPO: (prId: string, vendorId: string, warehouseId: string) => string;
  createPurchaseOrder: (po: Omit<PurchaseOrder, 'id' | 'poNumber' | 'status'>) => string;
  approvePurchaseOrder: (id: string, comment?: string) => void;
  receiveGoods: (poId: string) => boolean;
  recordPOPayment: (poId: string, paymentMode: Payment['paymentMode'], transactionRef: string) => void;

  // Actions - Sales Flow
  createSalesQuotation: (quo: Omit<SalesQuotation, 'id' | 'quotationNumber' | 'status'>) => void;
  convertQuotationToSO: (quoteId: string, warehouseId?: string) => string;
  createSalesOrder: (so: Omit<SalesOrder, 'id' | 'orderNumber' | 'status' | 'deliveryStatus'>) => string;
  confirmSalesOrder: (soId: string) => void;
  deliverSalesOrder: (soId: string) => boolean;
  recordSOPayment: (soId: string, paymentMode: Payment['paymentMode'], transactionRef: string) => void;

  // Actions - Finance & Invoices
  recordInvoicePayment: (invoiceId: string, amount: number, paymentMode: Payment['paymentMode'], transactionRef: string) => void;
  recordPayment: (payment: any) => void;
  addExpense: (expense: Omit<ExpenseItem, 'id' | 'recordedBy'>) => void;

  // Actions - HR & Approvals
  addEmployee: (emp: Omit<Employee, 'id'>) => void;
  toggleAttendance: (employeeId: string) => void;
  applyLeave: (leave: Omit<LeaveRequest, 'id' | 'status'>) => void;
  processApproval: (taskId: string, decision: 'Approved' | 'Rejected', comment?: string) => void;
  approveRequest: (id: string, comments?: string) => void;
  rejectRequest: (id: string, comments?: string) => void;
  processPayrollRun: (month: string) => number;

  // Actions - System
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  addAuditLog: (action: string, module: string, recordId: string, previousValue?: string, newValue?: string) => void;
  resetAllDemoData: () => void;

  // Guided Walkthrough Simulation Triggers
  runFullPurchaseDemo: () => Promise<void>;
  runFullSalesDemo: () => Promise<void>;
  isSimulating: boolean;
}

const ERPContext = createContext<ERPContextType | undefined>(undefined);

export const ERPProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('ganga_erp_theme');
      if (savedTheme === 'dark' || savedTheme === 'light') return savedTheme;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const root = document.documentElement;
      if (theme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      localStorage.setItem('ganga_erp_theme', theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Current session & auth state
  const [currentUser, setCurrentUser] = useState<User>(demoUsers[0]); // Default to Admin
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<ERPNavModule>('dashboard');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // Core Entity States
  const [company] = useState<Company>(initialCompany);
  const [branches] = useState<Branch[]>(initialBranches);
  const [departments] = useState<Department[]>(initialDepartments);
  const [warehouses] = useState<Warehouse[]>(initialWarehouses);

  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [vendors, setVendors] = useState<Vendor[]>(initialVendors);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [inventoryMovements, setInventoryMovements] = useState<InventoryMovement[]>(initialInventoryMovements);

  const [purchaseRequisitions, setPurchaseRequisitions] = useState<PurchaseRequisition[]>(initialPurchaseRequisitions);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(initialPurchaseOrders);
  const [salesQuotations, setSalesQuotations] = useState<SalesQuotation[]>(initialSalesQuotations);
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>(initialSalesOrders);
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [expenses, setExpenses] = useState<ExpenseItem[]>(initialExpenses);
  const [chartOfAccounts, setChartOfAccounts] = useState<ChartOfAccount[]>([
    { code: '1010', name: 'Cash and Bank Balances (HDFC Operating A/c)', type: 'Asset', balance: 3450000 },
    { code: '1020', name: 'Accounts Receivable (Trade Debtors)', type: 'Asset', balance: 875000 },
    { code: '1030', name: 'Inventory Asset (Finished & Raw Goods)', type: 'Asset', balance: 1420000 },
    { code: '2010', name: 'Accounts Payable (Trade Creditors)', type: 'Liability', balance: 640000 },
    { code: '2020', name: 'Duties & Taxes (GST Output / Input Clearing)', type: 'Liability', balance: 185000 },
    { code: '3010', name: 'Share Capital & Retained Earnings', type: 'Equity', balance: 4500000 },
    { code: '4010', name: 'Sales & Operating Revenues', type: 'Revenue', balance: 5200000 },
    { code: '5010', name: 'Procurement COGS & Material Purchases', type: 'Expense', balance: 2850000 },
    { code: '5020', name: 'Employee Compensation & Payroll', type: 'Expense', balance: 950000 },
    { code: '5030', name: 'Operating Logistics & Admin Overhead', type: 'Expense', balance: 310000 },
  ]);

  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(initialAttendance);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(initialLeaveRequests);
  const [approvalTasks, setApprovalTasks] = useState<ApprovalTask[]>(initialApprovalTasks);

  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([
    {
      id: 'PAY-2025-01-01',
      employeeId: 'EMP-001',
      employeeName: 'Rajesh Sharma',
      month: 'January 2025',
      basic: 90000,
      hra: 54000,
      allowances: 36000,
      pfDeduction: 10800,
      taxDeduction: 18000,
      netSalary: 151200,
      status: 'Processed',
    },
    {
      id: 'PAY-2025-01-02',
      employeeId: 'EMP-002',
      employeeName: 'Priya Patel',
      month: 'January 2025',
      basic: 60000,
      hra: 36000,
      allowances: 24000,
      pfDeduction: 7200,
      taxDeduction: 12000,
      netSalary: 100800,
      status: 'Processed',
    },
    {
      id: 'PAY-2025-01-03',
      employeeId: 'EMP-003',
      employeeName: 'Vikram Malhotra',
      month: 'January 2025',
      basic: 47500,
      hra: 28500,
      allowances: 19000,
      pfDeduction: 5700,
      taxDeduction: 9500,
      netSalary: 79800,
      status: 'Processed',
    },
  ]);

  const [approvalRequests, setApprovalRequests] = useState<ApprovalRequest[]>([
    {
      id: 'APR-2025-001',
      type: 'Purchase Order',
      referenceNumber: 'PO-2025-001',
      submittedBy: 'Amit Kumar',
      submissionDate: '2025-01-16',
      amount: 531000,
      details: 'Procurement of Enterprise Server Blade Systems from Dell Technologies India',
      status: 'Pending',
      approvalLevel: 'Finance Director Stage',
      approver: 'Rajesh Sharma',
    },
    {
      id: 'APR-2025-002',
      type: 'Purchase Requisition',
      referenceNumber: 'REQ-2025-002',
      submittedBy: 'Priya Patel',
      submissionDate: '2025-01-18',
      amount: 147500,
      details: 'Network switches expansion for Bangalore Tech Hub',
      status: 'Pending',
      approvalLevel: 'Department Head Stage',
      approver: 'Vikram Malhotra',
    },
    {
      id: 'APR-2025-003',
      type: 'Customer Credit',
      referenceNumber: 'CR-2025-001',
      submittedBy: 'Neha Gupta',
      submissionDate: '2025-01-14',
      amount: 250000,
      details: 'Credit limit extension to 45 days for Tata Consultancy Services',
      status: 'Approved',
      approvalLevel: 'Executive Authorization',
      approver: 'Rajesh Sharma',
      comments: 'Approved based on prompt payment track record.',
    },
  ]);

  // Modal dialog states
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState<boolean>(false);

  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Toast dispatch
  const showToast = (type: Toast['type'], title: string, message: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Audit Log dispatch
  const addAuditLog = (
    action: string,
    module: string,
    recordId: string,
    previousValue?: string,
    newValue?: string
  ) => {
    const now = new Date();
    const timestamp = `${now.toISOString().split('T')[0]} ${now.toTimeString().split(' ')[0].substring(0, 5)}`;
    const newLog: AuditLog = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      action,
      module,
      recordId,
      timestamp,
      previousValue,
      newValue,
      ipAddress: '192.168.1.101',
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Push Notification
  const pushNotification = (
    title: string,
    message: string,
    type: Notification['type'],
    targetModule: string,
    recordId?: string
  ) => {
    const newNotif: Notification = {
      id: `NOTIF-${Date.now()}`,
      title,
      message,
      type,
      targetModule,
      recordId,
      timestamp: 'Just now',
      isRead: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Role Based Access Control Matrix
  const hasPermission = (module: ERPNavModule): boolean => {
    if (currentUser.role === 'ADMIN') return true;

    switch (currentUser.role) {
      case 'MANAGER':
        return [
          'dashboard',
          'customers',
          'vendors',
          'products',
          'inventory',
          'procurement',
          'sales',
          'approvals',
          'reports',
          'notifications',
          'audit-logs',
        ].includes(module);
      case 'FINANCE':
        return [
          'dashboard',
          'finance',
          'invoices',
          'reports',
          'notifications',
          'procurement',
          'sales',
        ].includes(module);
      case 'HR':
        return [
          'dashboard',
          'hr',
          'approvals',
          'notifications',
          'reports',
        ].includes(module);
      case 'EMPLOYEE':
        return [
          'dashboard',
          'customers',
          'products',
          'sales',
          'procurement',
          'inventory',
          'notifications',
        ].includes(module);
      default:
        return false;
    }
  };

  // Switch Role / Login
  const login = (roleOrEmail?: UserRole | string, _password?: string) => {
    const targetRole = roleOrEmail || 'ADMIN';
    const match =
      demoUsers.find((u) => u.role === targetRole || u.email.toLowerCase() === String(targetRole).toLowerCase()) ||
      demoUsers[0];
    setCurrentUser(match);
    setIsLoggedIn(true);
    showToast('info', 'Logged In', `Switched active session to ${match.name} (${match.role})`);
    addAuditLog('User Login', 'Authentication', match.id, undefined, `Role: ${match.role}`);
  };

  const logout = () => {
    setIsLoggedIn(false);
    showToast('info', 'Session Ended', 'Logged out successfully');
  };

  // -------------------------------------------------------------
  // CUSTOMER & VENDOR ACTIONS
  // -------------------------------------------------------------
  const addCustomer = (custData: Omit<Customer, 'id' | 'createdAt' | 'outstandingBalance'>) => {
    const newId = `CUS-${1000 + customers.length + 1}`;
    const newCust: Customer = {
      ...custData,
      id: newId,
      outstandingBalance: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setCustomers((prev) => [newCust, ...prev]);
    showToast('success', 'Customer Created', `${newCust.companyName} (${newId}) added to master.`);
    addAuditLog('Created Customer', 'Customers', newId, undefined, `Name: ${newCust.companyName}`);
  };

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
    showToast('info', 'Customer Updated', `Customer record ${id} modified.`);
    addAuditLog('Updated Customer', 'Customers', id, undefined, JSON.stringify(updates));
  };

  const addVendor = (venData: Omit<Vendor, 'id' | 'createdAt' | 'outstandingPayable'>) => {
    const newId = `VEN-${2000 + vendors.length + 1}`;
    const newVen: Vendor = {
      ...venData,
      id: newId,
      outstandingPayable: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setVendors((prev) => [newVen, ...prev]);
    showToast('success', 'Vendor Onboarded', `${newVen.companyName} (${newId}) added.`);
    addAuditLog('Created Vendor', 'Vendors', newId, undefined, `Name: ${newVen.companyName}`);
  };

  const updateVendor = (id: string, updates: Partial<Vendor>) => {
    setVendors((prev) =>
      prev.map((v) => (v.id === id ? { ...v, ...updates } : v))
    );
    showToast('info', 'Vendor Updated', `Vendor record ${id} modified.`);
    addAuditLog('Updated Vendor', 'Vendors', id, undefined, JSON.stringify(updates));
  };

  // -------------------------------------------------------------
  // PRODUCT & INVENTORY ACTIONS
  // -------------------------------------------------------------
  const addProduct = (
    prodData: Omit<Product, 'id' | 'createdAt' | 'currentStock' | 'reservedStock' | 'warehouseStock'>,
    initialWarehouseId: string,
    initialQty: number
  ) => {
    const newId = `PROD-${100 + products.length + 1}`;
    const warehouseStock: Record<string, number> = {
      'WH-MUM': 0,
      'WH-AHM': 0,
      'WH-BLR': 0,
    };
    warehouseStock[initialWarehouseId] = initialQty;

    const newProd: Product = {
      ...prodData,
      id: newId,
      currentStock: initialQty,
      reservedStock: 0,
      warehouseStock,
      warehouseId: initialWarehouseId,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setProducts((prev) => [newProd, ...prev]);

    // Initial stock receipt movement
    if (initialQty > 0) {
      const now = new Date();
      const movement: InventoryMovement = {
        id: `MOV-${Date.now().toString().slice(-4)}`,
        date: `${now.toISOString().split('T')[0]} ${now.toTimeString().split(' ')[0].substring(0, 5)}`,
        productId: newId,
        productName: newProd.name,
        sku: newProd.sku,
        type: 'Adjustment Increase',
        warehouseId: initialWarehouseId,
        quantity: initialQty,
        previousStock: 0,
        newStock: initialQty,
        referenceDocId: 'INIT-STOCK',
        performedBy: currentUser.name,
        notes: 'Initial inventory master stock initialization',
      };
      setInventoryMovements((prev) => [movement, ...prev]);
    }

    showToast('success', 'Product Registered', `${newProd.name} (${newProd.sku}) created.`);
    addAuditLog('Created Product', 'Products', newId, undefined, `Price: ₹${newProd.sellingPrice}, Stock: ${initialQty}`);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    const existing = products.find((p) => p.id === id);
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    showToast('info', 'Product Updated', `Item ${id} specifications saved.`);
    addAuditLog(
      'Updated Product',
      'Products',
      id,
      existing ? `Selling: ₹${existing.sellingPrice}, Min: ${existing.minStockLevel}` : undefined,
      JSON.stringify(updates)
    );
  };

  const stockIn = (
    productId: string,
    warehouseId: string,
    quantity: number,
    reference: string,
    notes?: string
  ) => {
    const product = products.find((p) => p.id === productId);
    if (!product || quantity <= 0) return;

    const prevStock = product.currentStock;
    const newStock = prevStock + quantity;
    const prevWhStock = product.warehouseStock[warehouseId] || 0;
    const newWhStock = prevWhStock + quantity;

    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? {
              ...p,
              currentStock: newStock,
              status: newStock <= p.minStockLevel ? 'Low Stock' : 'Active',
              warehouseStock: { ...p.warehouseStock, [warehouseId]: newWhStock },
            }
          : p
      )
    );

    const now = new Date();
    const movement: InventoryMovement = {
      id: `MOV-${Date.now().toString().slice(-4)}`,
      date: `${now.toISOString().split('T')[0]} ${now.toTimeString().split(' ')[0].substring(0, 5)}`,
      productId,
      productName: product.name,
      sku: product.sku,
      type: 'Purchase Receipt',
      warehouseId,
      quantity,
      previousStock: prevStock,
      newStock,
      referenceDocId: reference,
      performedBy: currentUser.name,
      notes,
    };
    setInventoryMovements((prev) => [movement, ...prev]);

    showToast('success', 'Stock Increased', `+${quantity} units added to ${warehouseId} for ${product.name}`);
    addAuditLog('Stock In', 'Inventory', productId, `Stock: ${prevStock}`, `Stock: ${newStock} (+${quantity} via ${reference})`);
  };

  const stockOut = (
    productId: string,
    warehouseId: string,
    quantity: number,
    reference: string,
    notes?: string
  ): boolean => {
    const product = products.find((p) => p.id === productId);
    if (!product || quantity <= 0) return false;

    const currentWhStock = product.warehouseStock[warehouseId] || 0;
    if (currentWhStock < quantity) {
      showToast('error', 'Insufficient Stock', `Warehouse ${warehouseId} only has ${currentWhStock} units available.`);
      return false;
    }

    const prevStock = product.currentStock;
    const newStock = Math.max(0, prevStock - quantity);
    const newWhStock = currentWhStock - quantity;

    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? {
              ...p,
              currentStock: newStock,
              status: newStock <= p.minStockLevel ? 'Low Stock' : 'Active',
              warehouseStock: { ...p.warehouseStock, [warehouseId]: newWhStock },
            }
          : p
      )
    );

    const now = new Date();
    const movement: InventoryMovement = {
      id: `MOV-${Date.now().toString().slice(-4)}`,
      date: `${now.toISOString().split('T')[0]} ${now.toTimeString().split(' ')[0].substring(0, 5)}`,
      productId,
      productName: product.name,
      sku: product.sku,
      type: 'Sales Delivery',
      warehouseId,
      quantity: -quantity,
      previousStock: prevStock,
      newStock,
      referenceDocId: reference,
      performedBy: currentUser.name,
      notes,
    };
    setInventoryMovements((prev) => [movement, ...prev]);

    if (newStock <= product.minStockLevel) {
      pushNotification(
        'Low Stock Warning',
        `${product.name} is now at ${newStock} units (Threshold: ${product.minStockLevel})`,
        'low_stock',
        'Inventory',
        productId
      );
    }

    addAuditLog('Stock Out', 'Inventory', productId, `Stock: ${prevStock}`, `Stock: ${newStock} (-${quantity} via ${reference})`);
    return true;
  };

  const stockTransfer = (
    productId: string,
    fromWarehouseId: string,
    toWarehouseId: string,
    quantity: number,
    notes?: string
  ): boolean => {
    const product = products.find((p) => p.id === productId);
    if (!product || quantity <= 0 || fromWarehouseId === toWarehouseId) return false;

    const fromStock = product.warehouseStock[fromWarehouseId] || 0;
    if (fromStock < quantity) {
      showToast('error', 'Transfer Failed', `Source warehouse only holds ${fromStock} units.`);
      return false;
    }

    const toStock = product.warehouseStock[toWarehouseId] || 0;
    const newFromStock = fromStock - quantity;
    const newToStock = toStock + quantity;

    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? {
              ...p,
              warehouseStock: {
                ...p.warehouseStock,
                [fromWarehouseId]: newFromStock,
                [toWarehouseId]: newToStock,
              },
            }
          : p
      )
    );

    const now = new Date();
    const trfRef = `TRF-${Date.now().toString().slice(-4)}`;
    const timeStr = `${now.toISOString().split('T')[0]} ${now.toTimeString().split(' ')[0].substring(0, 5)}`;

    const outMove: InventoryMovement = {
      id: `MOV-${Date.now().toString().slice(-4)}-1`,
      date: timeStr,
      productId,
      productName: product.name,
      sku: product.sku,
      type: 'Transfer Out',
      warehouseId: fromWarehouseId,
      quantity: -quantity,
      previousStock: product.currentStock,
      newStock: product.currentStock,
      referenceDocId: trfRef,
      performedBy: currentUser.name,
      notes: notes || `Transfer to ${toWarehouseId}`,
    };

    const inMove: InventoryMovement = {
      id: `MOV-${Date.now().toString().slice(-4)}-2`,
      date: timeStr,
      productId,
      productName: product.name,
      sku: product.sku,
      type: 'Transfer In',
      warehouseId: toWarehouseId,
      quantity: quantity,
      previousStock: product.currentStock,
      newStock: product.currentStock,
      referenceDocId: trfRef,
      performedBy: currentUser.name,
      notes: notes || `Transfer from ${fromWarehouseId}`,
    };

    setInventoryMovements((prev) => [inMove, outMove, ...prev]);
    showToast('success', 'Stock Transferred', `${quantity} units shifted from ${fromWarehouseId} to ${toWarehouseId}`);
    addAuditLog('Stock Transfer', 'Inventory', productId, `${fromWarehouseId}: ${fromStock}`, `${fromWarehouseId}: ${newFromStock}, ${toWarehouseId}: ${newToStock}`);
    return true;
  };

  const stockAdjustment = (
    productId: string,
    warehouseId: string,
    diffQuantity: number,
    reason: string
  ) => {
    const product = products.find((p) => p.id === productId);
    if (!product || diffQuantity === 0) return;

    const prevStock = product.currentStock;
    const newStock = Math.max(0, prevStock + diffQuantity);
    const prevWhStock = product.warehouseStock[warehouseId] || 0;
    const newWhStock = Math.max(0, prevWhStock + diffQuantity);

    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? {
              ...p,
              currentStock: newStock,
              status: newStock <= p.minStockLevel ? 'Low Stock' : 'Active',
              warehouseStock: { ...p.warehouseStock, [warehouseId]: newWhStock },
            }
          : p
      )
    );

    const now = new Date();
    const movement: InventoryMovement = {
      id: `MOV-${Date.now().toString().slice(-4)}`,
      date: `${now.toISOString().split('T')[0]} ${now.toTimeString().split(' ')[0].substring(0, 5)}`,
      productId,
      productName: product.name,
      sku: product.sku,
      type: diffQuantity > 0 ? 'Adjustment Increase' : 'Adjustment Decrease',
      warehouseId,
      quantity: diffQuantity,
      previousStock: prevStock,
      newStock,
      referenceDocId: `ADJ-${Date.now().toString().slice(-4)}`,
      performedBy: currentUser.name,
      notes: reason,
    };

    setInventoryMovements((prev) => [movement, ...prev]);
    showToast('info', 'Inventory Adjusted', `Stock adjusted by ${diffQuantity > 0 ? '+' : ''}${diffQuantity} (${reason})`);
    addAuditLog('Stock Adjustment', 'Inventory', productId, `Stock: ${prevStock}`, `Stock: ${newStock} (${reason})`);
  };

  // -------------------------------------------------------------
  // PROCUREMENT WORKFLOW
  // -------------------------------------------------------------
  const createPurchaseRequisition = (
    reqData: Omit<PurchaseRequisition, 'id' | 'reqNumber' | 'status'>
  ) => {
    const reqNumber = `PR-2025-${String(purchaseRequisitions.length + 1).padStart(3, '0')}`;
    const newReq: PurchaseRequisition = {
      ...reqData,
      id: reqNumber,
      reqNumber,
      status: 'Pending',
    };

    setPurchaseRequisitions((prev) => [newReq, ...prev]);

    // Create approval task
    const approvalTask: ApprovalTask = {
      id: `APV-${Date.now().toString().slice(-3)}`,
      type: 'Purchase Requisition',
      referenceId: newReq.id,
      referenceNumber: newReq.reqNumber,
      title: `Requisition: ${newReq.department} (${newReq.items.length} items)`,
      requestedBy: newReq.requestedBy,
      department: newReq.department,
      requestDate: newReq.requestDate,
      amount: newReq.totalEstimatedAmount,
      details: newReq.reason,
      status: 'Pending',
      history: [
        {
          user: currentUser.name,
          action: 'Created Requisition',
          date: new Date().toISOString().split('T')[0],
        },
      ],
    };
    setApprovalTasks((prev) => [approvalTask, ...prev]);

    pushNotification(
      'New Purchase Requisition',
      `${newReq.reqNumber} from ${newReq.requestedBy} requires authorization`,
      'pending_approval',
      'Procurement',
      newReq.id
    );

    showToast('success', 'Requisition Submitted', `${reqNumber} sent for managerial approval.`);
    addAuditLog('Created PR', 'Procurement', reqNumber, undefined, `Amount: ₹${newReq.totalEstimatedAmount.toLocaleString('en-IN')}`);
  };

  const approvePurchaseRequisition = (id: string, comment?: string) => {
    setPurchaseRequisitions((prev) =>
      prev.map((pr) =>
        pr.id === id
          ? { ...pr, status: 'Approved', approverComment: comment || 'Approved by Manager' }
          : pr
      )
    );
    // Mark associated approval task as approved
    setApprovalTasks((prev) =>
      prev.map((task) =>
        task.referenceId === id
          ? {
              ...task,
              status: 'Approved',
              history: [
                ...task.history,
                {
                  user: currentUser.name,
                  action: 'Approved Requisition',
                  date: new Date().toISOString().split('T')[0],
                  comment,
                },
              ],
            }
          : task
      )
    );

    showToast('success', 'Requisition Approved', `${id} is ready to be converted into a Purchase Order.`);
    addAuditLog('Approved PR', 'Procurement', id, 'Status: Pending', `Status: Approved (${comment || 'Approved'})`);
  };

  const rejectPurchaseRequisition = (id: string, comment?: string) => {
    setPurchaseRequisitions((prev) =>
      prev.map((pr) =>
        pr.id === id
          ? { ...pr, status: 'Rejected', approverComment: comment || 'Rejected' }
          : pr
      )
    );
    setApprovalTasks((prev) =>
      prev.map((task) =>
        task.referenceId === id ? { ...task, status: 'Rejected' } : task
      )
    );
    showToast('warning', 'Requisition Rejected', `${id} marked as rejected.`);
    addAuditLog('Rejected PR', 'Procurement', id, 'Status: Pending', `Status: Rejected (${comment || 'No reason provided'})`);
  };

  const convertPRToPO = (prId: string, vendorId: string, warehouseId: string): string => {
    const pr = purchaseRequisitions.find((r) => r.id === prId);
    const vendor = vendors.find((v) => v.id === vendorId);
    if (!pr || !vendor) return '';

    const poNumber = `PO-2025-${String(purchaseOrders.length + 1).padStart(3, '0')}`;
    let subtotal = 0;
    let taxAmount = 0;

    const items = pr.items.map((it) => {
      const prod = products.find((p) => p.id === it.productId);
      const taxRate = prod ? prod.taxRate : 18;
      const total = it.quantity * it.estimatedUnitPrice * (1 + taxRate / 100);
      subtotal += it.quantity * it.estimatedUnitPrice;
      taxAmount += it.quantity * it.estimatedUnitPrice * (taxRate / 100);
      return {
        productId: it.productId,
        productName: it.productName,
        sku: prod ? prod.sku : 'SKU-GEN',
        quantity: it.quantity,
        unitPrice: it.estimatedUnitPrice,
        taxRate,
        total,
      };
    });

    const newPO: PurchaseOrder = {
      id: poNumber,
      poNumber,
      requisitionId: pr.id,
      vendorId: vendor.id,
      vendorName: vendor.companyName,
      orderDate: new Date().toISOString().split('T')[0],
      expectedDeliveryDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      warehouseId,
      items,
      subtotal,
      taxAmount,
      totalAmount: subtotal + taxAmount,
      status: 'Approved',
      approvedBy: currentUser.name,
      approvedDate: new Date().toISOString().split('T')[0],
    };

    setPurchaseOrders((prev) => [newPO, ...prev]);

    // Update PR status
    setPurchaseRequisitions((prev) =>
      prev.map((r) => (r.id === prId ? { ...r, status: 'Converted to PO', poId: poNumber } : r))
    );

    showToast('success', 'Purchase Order Generated', `${poNumber} created from requisition ${prId}.`);
    addAuditLog('Converted PR to PO', 'Procurement', poNumber, `From ${prId}`, `PO Total: ₹${newPO.totalAmount.toLocaleString('en-IN')}`);
    return poNumber;
  };

  const createPurchaseOrder = (poData: Omit<PurchaseOrder, 'id' | 'poNumber' | 'status'>): string => {
    const poNumber = `PO-2025-${String(purchaseOrders.length + 1).padStart(3, '0')}`;
    const newPO: PurchaseOrder = {
      ...poData,
      id: poNumber,
      poNumber,
      status: 'Approved', // Auto-approved in demo for smooth workflow testing
      approvedBy: currentUser.name,
      approvedDate: new Date().toISOString().split('T')[0],
    };

    setPurchaseOrders((prev) => [newPO, ...prev]);
    showToast('success', 'Purchase Order Created', `${poNumber} sent to ${newPO.vendorName}.`);
    addAuditLog('Created PO', 'Procurement', poNumber, undefined, `Vendor: ${newPO.vendorName}, Amount: ₹${newPO.totalAmount.toLocaleString('en-IN')}`);
    return poNumber;
  };

  const approvePurchaseOrder = (id: string, comment?: string) => {
    setPurchaseOrders((prev) =>
      prev.map((po) =>
        po.id === id
          ? {
              ...po,
              status: 'Approved',
              approvedBy: currentUser.name,
              approvedDate: new Date().toISOString().split('T')[0],
            }
          : po
      )
    );
    showToast('success', 'Purchase Order Approved', `${id} is now approved for procurement.`);
    addAuditLog('Approved PO', 'Procurement', id, 'Status: Pending', `Status: Approved (${comment || 'Approved'})`);
  };

  // -------------------------------------------------------------
  // CRITICAL FLOW: RECEIVE GOODS (GOODS RECEIPT NOTE - GRN)
  // AUTOMATICALLY INCREASES INVENTORY IN WAREHOUSE & GENERATES PURCHASE INVOICE
  // -------------------------------------------------------------
  const receiveGoods = (poId: string): boolean => {
    const po = purchaseOrders.find((p) => p.id === poId);
    if (!po) return false;
    if (po.status === 'Received') {
      showToast('warning', 'Already Received', `PO ${poId} was already fulfilled.`);
      return false;
    }

    const grnId = `GRN-${Date.now().toString().slice(-4)}`;
    const invoiceId = `INV-P-2025-${String(invoices.length + 1).padStart(3, '0')}`;

    // 1. Automatically Increase Stock for all items in the target warehouse
    po.items.forEach((item) => {
      stockIn(
        item.productId,
        po.warehouseId,
        item.quantity,
        po.poNumber,
        `Goods Receipt Note ${grnId} against PO ${po.poNumber}`
      );
    });

    // 2. Mark PO as Received & link GRN + Invoice
    setPurchaseOrders((prev) =>
      prev.map((p) =>
        p.id === poId
          ? {
              ...p,
              status: 'Received',
              goodsReceiptId: grnId,
              invoiceId,
              items: p.items.map((i) => ({ ...i, receivedQuantity: i.quantity })),
            }
          : p
      )
    );

    // 3. Automatically Generate Purchase Invoice in Finance (Accounts Payable)
    const vendor = vendors.find((v) => v.id === po.vendorId);
    const newInvoice: Invoice = {
      id: invoiceId,
      invoiceNumber: invoiceId,
      type: 'Purchase',
      referenceId: po.poNumber,
      partyId: po.vendorId,
      partyName: po.vendorName,
      partyGst: vendor ? vendor.gstNumber : '27AABCM4567A1Z3',
      partyAddress: vendor ? `${vendor.address}, ${vendor.city}, ${vendor.state}` : 'MIDC Industrial Area, Mumbai',
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      items: po.items.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        taxRate: item.taxRate,
        taxAmount: (item.unitPrice * item.quantity * item.taxRate) / 100,
        total: item.total,
      })),
      subtotal: po.subtotal,
      taxAmount: po.taxAmount,
      discountAmount: 0,
      totalAmount: po.totalAmount,
      paidAmount: 0,
      balanceAmount: po.totalAmount,
      status: 'Sent',
      paymentIds: [],
    };
    setInvoices((prev) => [newInvoice, ...prev]);

    // 4. Update Vendor outstanding payable balance
    setVendors((prev) =>
      prev.map((v) =>
        v.id === po.vendorId
          ? { ...v, outstandingPayable: v.outstandingPayable + po.totalAmount }
          : v
      )
    );

    // 5. Notify
    pushNotification(
      'Goods Receipt Completed',
      `PO ${po.poNumber} received in ${po.warehouseId}. Inventory updated & invoice ${invoiceId} generated.`,
      'system',
      'Inventory',
      po.poNumber
    );

    showToast(
      'success',
      'Goods Received Successfully',
      `Inventory increased! Purchase invoice ${invoiceId} generated for ₹${po.totalAmount.toLocaleString('en-IN')}`
    );

    addAuditLog('Goods Receipt & Stock Added', 'Inventory', po.poNumber, 'Status: Ordered', `GRN: ${grnId}, Stock Increased, Invoice: ${invoiceId}`);
    return true;
  };

  const recordPOPayment = (poId: string, paymentMode: Payment['paymentMode'], transactionRef: string) => {
    const po = purchaseOrders.find((p) => p.id === poId);
    if (!po) return;

    const inv = invoices.find((i) => i.id === po.invoiceId || i.referenceId === po.poNumber);
    const amount = inv ? inv.balanceAmount : po.totalAmount;
    const paymentId = `PAY-OUT-${Date.now().toString().slice(-3)}`;

    const newPayment: Payment = {
      id: paymentId,
      paymentNumber: paymentId,
      invoiceId: inv ? inv.id : po.poNumber,
      invoiceNumber: inv ? inv.invoiceNumber : po.poNumber,
      partyName: po.vendorName,
      partyType: 'Vendor',
      date: new Date().toISOString().split('T')[0],
      amount,
      paymentMode,
      referenceTransactionId: transactionRef,
      notes: `Disbursement for Purchase Order ${po.poNumber}`,
    };

    setPayments((prev) => [newPayment, ...prev]);

    // Update PO
    setPurchaseOrders((prev) =>
      prev.map((p) => (p.id === poId ? { ...p, isPaid: true } : p))
    );

    // Update Invoice
    if (inv) {
      setInvoices((prev) =>
        prev.map((i) =>
          i.id === inv.id
            ? {
                ...i,
                paidAmount: i.paidAmount + amount,
                balanceAmount: 0,
                status: 'Paid',
                paymentIds: [...i.paymentIds, paymentId],
              }
            : i
        )
      );
    }

    // Update Vendor outstanding payable
    setVendors((prev) =>
      prev.map((v) =>
        v.id === po.vendorId
          ? { ...v, outstandingPayable: Math.max(0, v.outstandingPayable - amount) }
          : v
      )
    );

    showToast('success', 'Vendor Payment Recorded', `Paid ₹${amount.toLocaleString('en-IN')} to ${po.vendorName}`);
    addAuditLog('Recorded PO Payment', 'Finance', po.poNumber, undefined, `Paid: ₹${amount.toLocaleString('en-IN')}, Ref: ${transactionRef}`);
  };

  // -------------------------------------------------------------
  // SALES WORKFLOW
  // -------------------------------------------------------------
  const createSalesQuotation = (quoData: Omit<SalesQuotation, 'id' | 'quotationNumber' | 'status'>) => {
    const quotationNumber = `QUO-2025-${String(salesQuotations.length + 1).padStart(3, '0')}`;
    const newQuo: SalesQuotation = {
      ...quoData,
      id: quotationNumber,
      quotationNumber,
      status: 'Sent',
    };
    setSalesQuotations((prev) => [newQuo, ...prev]);
    showToast('success', 'Quotation Dispatched', `${quotationNumber} sent to ${newQuo.customerName}`);
    addAuditLog('Created Quotation', 'Sales', quotationNumber, undefined, `Customer: ${newQuo.customerName}, Total: ₹${newQuo.totalAmount.toLocaleString('en-IN')}`);
  };

  const convertQuotationToSO = (quoteId: string, warehouseId: string = 'WH-MUM'): string => {
    const quote = salesQuotations.find((q) => q.id === quoteId);
    if (!quote) return '';

    const orderNumber = `SO-2025-${String(salesOrders.length + 1).padStart(3, '0')}`;
    let subtotal = 0;
    let discountAmount = 0;
    let taxAmount = 0;

    quote.items.forEach((item) => {
      const lineSub = item.quantity * item.unitPrice;
      const lineDisc = (lineSub * item.discountPercentage) / 100;
      const lineTax = (lineSub - lineDisc) * (item.taxRate / 100);
      subtotal += lineSub;
      discountAmount += lineDisc;
      taxAmount += lineTax;
    });

    const newSO: SalesOrder = {
      id: orderNumber,
      orderNumber,
      quotationId: quote.id,
      customerId: quote.customerId,
      customerName: quote.customerName,
      orderDate: new Date().toISOString().split('T')[0],
      deliveryDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
      warehouseId,
      items: quote.items,
      subtotal,
      discountAmount,
      taxAmount,
      totalAmount: subtotal - discountAmount + taxAmount,
      status: 'Confirmed',
      deliveryStatus: 'Pending',
    };

    setSalesOrders((prev) => [newSO, ...prev]);
    setSalesQuotations((prev) =>
      prev.map((q) => (q.id === quoteId ? { ...q, status: 'Converted', salesOrderId: orderNumber } : q))
    );

    showToast('success', 'Quotation Converted', `Created Sales Order ${orderNumber} from quote ${quoteId}`);
    addAuditLog('Converted Quote to SO', 'Sales', orderNumber, `Quote: ${quoteId}`, `Total: ₹${newSO.totalAmount.toLocaleString('en-IN')}`);
    return orderNumber;
  };

  const createSalesOrder = (soData: Omit<SalesOrder, 'id' | 'orderNumber' | 'status' | 'deliveryStatus'>): string => {
    const orderNumber = `SO-2025-${String(salesOrders.length + 1).padStart(3, '0')}`;
    const newSO: SalesOrder = {
      ...soData,
      id: orderNumber,
      orderNumber,
      status: 'Confirmed',
      deliveryStatus: 'Pending',
    };

    setSalesOrders((prev) => [newSO, ...prev]);
    pushNotification(
      'New Sales Order',
      `${orderNumber} confirmed from ${newSO.customerName} (₹${newSO.totalAmount.toLocaleString('en-IN')})`,
      'new_order',
      'Sales',
      orderNumber
    );

    showToast('success', 'Sales Order Confirmed', `${orderNumber} registered for ${newSO.customerName}`);
    addAuditLog('Created Sales Order', 'Sales', orderNumber, undefined, `Total: ₹${newSO.totalAmount.toLocaleString('en-IN')}`);
    return orderNumber;
  };

  const confirmSalesOrder = (soId: string) => {
    setSalesOrders((prev) =>
      prev.map((so) => (so.id === soId ? { ...so, status: 'Confirmed' } : so))
    );
    showToast('info', 'Order Confirmed', `Order ${soId} is now confirmed for dispatch.`);
    addAuditLog('Confirmed Sales Order', 'Sales', soId, 'Status: Pending', 'Status: Confirmed');
  };

  // -------------------------------------------------------------
  // CRITICAL FLOW: DELIVER SALES ORDER
  // AUTOMATICALLY REDUCES INVENTORY & GENERATES SALES INVOICE
  // -------------------------------------------------------------
  const deliverSalesOrder = (soId: string): boolean => {
    const so = salesOrders.find((s) => s.id === soId);
    if (!so) return false;
    if (so.deliveryStatus === 'Delivered') {
      showToast('warning', 'Already Dispatched', `Sales order ${soId} has already been dispatched.`);
      return false;
    }

    // Check inventory availability first
    for (const item of so.items) {
      const prod = products.find((p) => p.id === item.productId);
      const whStock = prod?.warehouseStock[so.warehouseId] || 0;
      if (whStock < item.quantity) {
        showToast(
          'error',
          'Stock Shortage',
          `Cannot deliver: ${item.productName} has only ${whStock} units in ${so.warehouseId} (required: ${item.quantity}).`
        );
        return false;
      }
    }

    // 1. Deduct Inventory for all items
    so.items.forEach((item) => {
      stockOut(
        item.productId,
        so.warehouseId,
        item.quantity,
        so.orderNumber,
        `Sales Delivery for ${so.customerName} via SO ${so.orderNumber}`
      );
    });

    const invoiceId = `INV-S-2025-${String(invoices.length + 1).padStart(3, '0')}`;

    // 2. Update Sales Order status
    setSalesOrders((prev) =>
      prev.map((s) =>
        s.id === soId
          ? {
              ...s,
              status: 'Delivered',
              deliveryStatus: 'Delivered',
              invoiceId,
            }
          : s
      )
    );

    // 3. Automatically Generate Sales Invoice in Accounts Receivable
    const customer = customers.find((c) => c.id === so.customerId);
    const newInvoice: Invoice = {
      id: invoiceId,
      invoiceNumber: invoiceId,
      type: 'Sales',
      referenceId: so.orderNumber,
      partyId: so.customerId,
      partyName: so.customerName,
      partyGst: customer ? customer.gstNumber : '27AAACA1234A1Z5',
      partyAddress: customer ? `${customer.address}, ${customer.city}, ${customer.state}` : 'Seepz Complex, Andheri East, Mumbai',
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      items: so.items.map((item) => {
        const lineSub = item.quantity * item.unitPrice;
        const lineDisc = (lineSub * item.discountPercentage) / 100;
        const lineTax = (lineSub - lineDisc) * (item.taxRate / 100);
        return {
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          taxRate: item.taxRate,
          taxAmount: lineTax,
          discount: lineDisc,
          total: item.total,
        };
      }),
      subtotal: so.subtotal,
      discountAmount: so.discountAmount,
      taxAmount: so.taxAmount,
      totalAmount: so.totalAmount,
      paidAmount: 0,
      balanceAmount: so.totalAmount,
      status: 'Sent',
      paymentIds: [],
    };
    setInvoices((prev) => [newInvoice, ...prev]);

    // 4. Update Customer's Outstanding Balance
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === so.customerId
          ? { ...c, outstandingBalance: c.outstandingBalance + so.totalAmount }
          : c
      )
    );

    pushNotification(
      'Delivery Dispatched',
      `${so.orderNumber} delivered to ${so.customerName}. Stock updated & invoice ${invoiceId} issued.`,
      'system',
      'Sales',
      so.orderNumber
    );

    showToast(
      'success',
      'Dispatched & Invoiced',
      `Inventory decreased! Sales Invoice ${invoiceId} generated for ₹${so.totalAmount.toLocaleString('en-IN')}`
    );

    addAuditLog('Delivered Sales Order', 'Sales', so.orderNumber, 'Delivery: Pending', `Delivery: Delivered, Invoice: ${invoiceId}, Stock deducted`);
    return true;
  };

  const recordSOPayment = (soId: string, paymentMode: Payment['paymentMode'], transactionRef: string) => {
    const so = salesOrders.find((s) => s.id === soId);
    if (!so) return;

    const inv = invoices.find((i) => i.id === so.invoiceId || i.referenceId === so.orderNumber);
    const amount = inv ? inv.balanceAmount : so.totalAmount;
    const paymentId = `PAY-IN-${Date.now().toString().slice(-3)}`;

    const newPayment: Payment = {
      id: paymentId,
      paymentNumber: paymentId,
      invoiceId: inv ? inv.id : so.orderNumber,
      invoiceNumber: inv ? inv.invoiceNumber : so.orderNumber,
      partyName: so.customerName,
      partyType: 'Customer',
      date: new Date().toISOString().split('T')[0],
      amount,
      paymentMode,
      referenceTransactionId: transactionRef,
      notes: `Settlement for Sales Order ${so.orderNumber}`,
    };

    setPayments((prev) => [newPayment, ...prev]);

    // Update SO
    setSalesOrders((prev) =>
      prev.map((s) => (s.id === soId ? { ...s, status: 'Completed', isPaid: true } : s))
    );

    // Update Invoice
    if (inv) {
      setInvoices((prev) =>
        prev.map((i) =>
          i.id === inv.id
            ? {
                ...i,
                paidAmount: i.paidAmount + amount,
                balanceAmount: 0,
                status: 'Paid',
                paymentIds: [...i.paymentIds, paymentId],
              }
            : i
        )
      );
    }

    // Update Customer outstanding balance
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === so.customerId
          ? { ...c, outstandingBalance: Math.max(0, c.outstandingBalance - amount) }
          : c
      )
    );

    pushNotification(
      'Payment Received',
      `₹${amount.toLocaleString('en-IN')} received from ${so.customerName}`,
      'payment_received',
      'Finance',
      so.orderNumber
    );

    showToast('success', 'Customer Payment Logged', `Received ₹${amount.toLocaleString('en-IN')} from ${so.customerName}`);
    addAuditLog('Recorded Customer Payment', 'Finance', so.orderNumber, undefined, `Paid: ₹${amount.toLocaleString('en-IN')}, Ref: ${transactionRef}`);
  };

  // -------------------------------------------------------------
  // FINANCE & INVOICES
  // -------------------------------------------------------------
  const recordInvoicePayment = (
    invoiceId: string,
    amount: number,
    paymentMode: Payment['paymentMode'],
    transactionRef: string
  ) => {
    const inv = invoices.find((i) => i.id === invoiceId);
    if (!inv || amount <= 0) return;

    const paymentId = `PAY-${inv.type === 'Sales' ? 'IN' : 'OUT'}-${Date.now().toString().slice(-3)}`;
    const newPaidAmount = inv.paidAmount + amount;
    const newBalance = Math.max(0, inv.totalAmount - newPaidAmount);
    const newStatus = newBalance === 0 ? 'Paid' : 'Partially Paid';

    const newPayment: Payment = {
      id: paymentId,
      paymentNumber: paymentId,
      invoiceId: inv.id,
      invoiceNumber: inv.invoiceNumber,
      partyName: inv.partyName,
      partyType: inv.type === 'Sales' ? 'Customer' : 'Vendor',
      date: new Date().toISOString().split('T')[0],
      amount,
      paymentMode,
      referenceTransactionId: transactionRef,
      notes: `Payment for ${inv.invoiceNumber}`,
    };

    setPayments((prev) => [newPayment, ...prev]);

    setInvoices((prev) =>
      prev.map((i) =>
        i.id === invoiceId
          ? {
              ...i,
              paidAmount: newPaidAmount,
              balanceAmount: newBalance,
              status: newStatus,
              paymentIds: [...i.paymentIds, paymentId],
            }
          : i
      )
    );

    if (inv.type === 'Sales') {
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === inv.partyId
            ? { ...c, outstandingBalance: Math.max(0, c.outstandingBalance - amount) }
            : c
        )
      );
    } else {
      setVendors((prev) =>
        prev.map((v) =>
          v.id === inv.partyId
            ? { ...v, outstandingPayable: Math.max(0, v.outstandingPayable - amount) }
            : v
        )
      );
    }

    showToast('success', 'Payment Saved', `Recorded ₹${amount.toLocaleString('en-IN')} for ${inv.invoiceNumber}`);
    addAuditLog('Recorded Payment', 'Finance', inv.invoiceNumber, `Balance: ₹${inv.balanceAmount}`, `Balance: ₹${newBalance}`);
  };

  const addExpense = (expenseData: Omit<ExpenseItem, 'id' | 'recordedBy'>) => {
    const newId = `EXP-${Date.now().toString().slice(-4)}`;
    const newExpense: ExpenseItem = {
      ...expenseData,
      id: newId,
      recordedBy: currentUser.name,
    };
    setExpenses((prev) => [newExpense, ...prev]);
    showToast('success', 'Expense Logged', `₹${newExpense.amount.toLocaleString('en-IN')} under ${newExpense.category}`);
    addAuditLog('Recorded Expense', 'Finance', newId, undefined, `Amount: ₹${newExpense.amount}, Cat: ${newExpense.category}`);
  };

  // -------------------------------------------------------------
  // HR & APPROVALS
  // -------------------------------------------------------------
  const addEmployee = (empData: Omit<Employee, 'id'>) => {
    const newId = `EMP-${100 + employees.length + 1}`;
    const newEmp: Employee = {
      ...empData,
      id: newId,
      employeeId: newId,
    };
    setEmployees((prev) => [newEmp, ...prev]);
    showToast('success', 'Employee Onboarded', `${newEmp.name} added to ${newEmp.department}`);
    addAuditLog('Onboarded Employee', 'HR', newId, undefined, `Name: ${newEmp.name}, Role: ${newEmp.designation}`);
  };

  const toggleAttendance = (employeeId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const existing = attendance.find((a) => a.employeeId === employeeId && a.date === today);

    if (existing) {
      setAttendance((prev) =>
        prev.map((a) =>
          a.id === existing.id
            ? { ...a, status: a.status === 'Present' ? 'Absent' : 'Present' }
            : a
        )
      );
    } else {
      const emp = employees.find((e) => e.id === employeeId);
      const newRec: AttendanceRecord = {
        id: `ATT-${Date.now().toString().slice(-4)}`,
        employeeId,
        employeeName: emp ? emp.name : 'Employee',
        date: today,
        checkInTime: new Date().toTimeString().split(' ')[0].substring(0, 5),
        status: 'Present',
      };
      setAttendance((prev) => [newRec, ...prev]);
    }
  };

  const applyLeave = (leaveData: Omit<LeaveRequest, 'id' | 'status'>) => {
    const newId = `LV-2025-${String(leaveRequests.length + 1).padStart(2, '0')}`;
    const newLeave: LeaveRequest = {
      ...leaveData,
      id: newId,
      status: 'Pending',
    };
    setLeaveRequests((prev) => [newLeave, ...prev]);

    // Create approval task
    const approvalTask: ApprovalTask = {
      id: `APV-${Date.now().toString().slice(-3)}`,
      type: 'Leave Request',
      referenceId: newId,
      referenceNumber: newId,
      title: `${newLeave.leaveType} - ${newLeave.employeeName} (${newLeave.days} Days)`,
      requestedBy: newLeave.employeeName,
      department: newLeave.department,
      requestDate: new Date().toISOString().split('T')[0],
      details: newLeave.reason,
      status: 'Pending',
      history: [
        {
          user: currentUser.name,
          action: 'Applied Leave',
          date: new Date().toISOString().split('T')[0],
        },
      ],
    };
    setApprovalTasks((prev) => [approvalTask, ...prev]);

    showToast('info', 'Leave Submitted', `Application ${newId} submitted for HR review.`);
    addAuditLog('Applied Leave', 'HR', newId, undefined, `Days: ${newLeave.days}, Reason: ${newLeave.reason}`);
  };

  const processApproval = (taskId: string, decision: 'Approved' | 'Rejected', comment?: string) => {
    const task = approvalTasks.find((t) => t.id === taskId);
    if (!task) return;

    setApprovalTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              status: decision,
              history: [
                ...t.history,
                {
                  user: currentUser.name,
                  action: `${decision} Task`,
                  date: new Date().toISOString().split('T')[0],
                  comment,
                },
              ],
            }
          : t
      )
    );

    // Sync underlying domain entity
    if (task.type === 'Purchase Requisition') {
      if (decision === 'Approved') approvePurchaseRequisition(task.referenceId, comment);
      else rejectPurchaseRequisition(task.referenceId, comment);
    } else if (task.type === 'Purchase Order') {
      if (decision === 'Approved') approvePurchaseOrder(task.referenceId, comment);
    } else if (task.type === 'Leave Request') {
      setLeaveRequests((prev) =>
        prev.map((l) =>
          l.id === task.referenceId
            ? { ...l, status: decision, approverComment: comment }
            : l
        )
      );
    }

    showToast('info', `Approval ${decision}`, `Task ${task.referenceNumber} marked ${decision}.`);
    addAuditLog(`Approval ${decision}`, 'Approvals', task.referenceNumber, 'Status: Pending', `Status: ${decision} (${comment || 'Done'})`);
  };

  // -------------------------------------------------------------
  // NOTIFICATIONS
  // -------------------------------------------------------------
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    showToast('info', 'Notifications Cleared', 'All alerts marked as read.');
  };

  const unreadNotificationCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications]
  );

  // -------------------------------------------------------------
  // RESET DEMO DATA
  // -------------------------------------------------------------
  const resetAllDemoData = () => {
    setCustomers(initialCustomers);
    setVendors(initialVendors);
    setProducts(initialProducts);
    setInventoryMovements(initialInventoryMovements);
    setPurchaseRequisitions(initialPurchaseRequisitions);
    setPurchaseOrders(initialPurchaseOrders);
    setSalesQuotations(initialSalesQuotations);
    setSalesOrders(initialSalesOrders);
    setInvoices(initialInvoices);
    setPayments(initialPayments);
    setEmployees(initialEmployees);
    setAttendance(initialAttendance);
    setLeaveRequests(initialLeaveRequests);
    setApprovalTasks(initialApprovalTasks);
    setNotifications(initialNotifications);
    setAuditLogs(initialAuditLogs);
    setExpenses(initialExpenses);
    showToast('info', 'Demo Data Reset', 'All enterprise modules restored to factory demo state.');
  };

  // -------------------------------------------------------------
  // INTERACTIVE GUIDED END-TO-END DEMO SIMULATIONS
  // Demonstrates:
  // Flow 1 (Purchase): Vendor -> PR -> Approval -> PO -> Goods Receipt (Stock +) -> Invoice -> Payment -> Audit Log
  // Flow 2 (Sales): Customer -> Quotation -> SO -> Delivery (Stock -) -> Invoice -> Payment -> Audit Log
  // -------------------------------------------------------------
  const runFullPurchaseDemo = async () => {
    setIsSimulating(true);
    showToast('info', 'Starting Purchase Flow Simulation', 'Step 1: Selecting Vendor & Submitting Requisition...');
    
    // Step 1: Create PR
    const prNumber = `PR-DEMO-${Date.now().toString().slice(-3)}`;
    const newPR: PurchaseRequisition = {
      id: prNumber,
      reqNumber: prNumber,
      requestedBy: currentUser.name,
      department: 'Operations',
      requestDate: new Date().toISOString().split('T')[0],
      requiredDate: new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0],
      items: [
        {
          productId: 'PROD-102',
          productName: 'Cisco 24-Port Managed Gigabit Switch',
          quantity: 5,
          estimatedUnitPrice: 28000,
          estimatedTotal: 140000,
        },
      ],
      totalEstimatedAmount: 140000,
      status: 'Approved',
      reason: 'Interactive Demo: Branch expansion procurement',
    };
    setPurchaseRequisitions((prev) => [newPR, ...prev]);
    addAuditLog('Created PR', 'Procurement', prNumber, undefined, 'Total: ₹1,40,000');

    await new Promise((r) => setTimeout(r, 1200));
    showToast('info', 'Step 2: Approved & Converted to PO', 'Converting requisition into formal Purchase Order...');

    // Step 2: Create PO
    const poNumber = `PO-DEMO-${Date.now().toString().slice(-3)}`;
    const newPO: PurchaseOrder = {
      id: poNumber,
      poNumber,
      requisitionId: prNumber,
      vendorId: 'VEN-2002',
      vendorName: 'Spectra Networking Technologies',
      orderDate: new Date().toISOString().split('T')[0],
      expectedDeliveryDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
      warehouseId: 'WH-MUM',
      items: [
        {
          productId: 'PROD-102',
          productName: 'Cisco 24-Port Managed Gigabit Switch',
          sku: 'NET-CS24-GS',
          quantity: 5,
          unitPrice: 28000,
          taxRate: 18,
          total: 165200,
        },
      ],
      subtotal: 140000,
      taxAmount: 25200,
      totalAmount: 165200,
      status: 'Approved',
      approvedBy: currentUser.name,
      approvedDate: new Date().toISOString().split('T')[0],
    };
    setPurchaseOrders((prev) => [newPO, ...prev]);
    addAuditLog('Created PO', 'Procurement', poNumber, undefined, 'Amount: ₹1,65,200');

    await new Promise((r) => setTimeout(r, 1500));
    showToast('info', 'Step 3: Receiving Goods (GRN)', 'Increasing inventory stock in Mumbai warehouse...');

    // Step 3: Receive Goods & Increase Stock
    receiveGoods(poNumber);

    await new Promise((r) => setTimeout(r, 1500));
    showToast('info', 'Step 4: Purchase Invoice Generated', 'Recording bank disbursement payment...');

    // Step 4: Record Payment
    recordPOPayment(poNumber, 'Bank Transfer (NEFT/RTGS)', `HDFC-DEMO-${Date.now().toString().slice(-4)}`);

    await new Promise((r) => setTimeout(r, 800));
    showToast('success', 'Purchase Flow Complete!', 'Vendor → PR → PO → Stock (+) → Invoice → Payment recorded in Audit Log.');
    setIsSimulating(false);
    setActiveTab('procurement');
  };

  const runFullSalesDemo = async () => {
    setIsSimulating(true);
    showToast('info', 'Starting Sales Flow Simulation', 'Step 1: Creating Quotation for Customer...');

    // Step 1: Create Quote
    const quoteNumber = `QUO-DEMO-${Date.now().toString().slice(-3)}`;
    const newQuote: SalesQuotation = {
      id: quoteNumber,
      quotationNumber: quoteNumber,
      customerId: 'CUS-1002',
      customerName: 'TechNova Global Systems',
      date: new Date().toISOString().split('T')[0],
      validUntil: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
      items: [
        {
          productId: 'PROD-107',
          productName: 'NVMe Gen4 Enterprise SSD 1.92TB',
          sku: 'STR-NVME-192',
          quantity: 3,
          unitPrice: 20500,
          discountPercentage: 0,
          taxRate: 18,
          total: 72570,
        },
      ],
      totalAmount: 72570,
      status: 'Converted',
    };
    setSalesQuotations((prev) => [newQuote, ...prev]);

    await new Promise((r) => setTimeout(r, 1200));
    showToast('info', 'Step 2: Converted to Sales Order', 'Order confirmed. Checking warehouse inventory...');

    // Step 2: Create Sales Order
    const soNumber = `SO-DEMO-${Date.now().toString().slice(-3)}`;
    const newSO: SalesOrder = {
      id: soNumber,
      orderNumber: soNumber,
      quotationId: quoteNumber,
      customerId: 'CUS-1002',
      customerName: 'TechNova Global Systems',
      orderDate: new Date().toISOString().split('T')[0],
      deliveryDate: new Date().toISOString().split('T')[0],
      warehouseId: 'WH-MUM',
      items: newQuote.items,
      subtotal: 61500,
      discountAmount: 0,
      taxAmount: 11070,
      totalAmount: 72570,
      status: 'Confirmed',
      deliveryStatus: 'Pending',
    };
    setSalesOrders((prev) => [newSO, ...prev]);

    await new Promise((r) => setTimeout(r, 1500));
    showToast('info', 'Step 3: Dispatching Delivery', 'Stock automatically reduced from Mumbai warehouse...');

    // Step 3: Dispatch Delivery & Deduct Inventory
    deliverSalesOrder(soNumber);

    await new Promise((r) => setTimeout(r, 1500));
    showToast('info', 'Step 4: Invoice Issued & Payment Received', 'Receiving customer funds via UPI...');

    // Step 4: Record Payment
    recordSOPayment(soNumber, 'UPI', `UPI-DEMO-${Date.now().toString().slice(-4)}`);

    await new Promise((r) => setTimeout(r, 800));
    showToast('success', 'Sales Flow Complete!', 'Customer → Quote → SO → Stock (-) → Invoice → Payment logged in Audit Trail.');
    setIsSimulating(false);
    setActiveTab('sales');
  };

  const approveRequest = (id: string, comments?: string) => {
    setApprovalRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: 'Approved', comments: comments || 'Approved', approver: currentUser.name }
          : r
      )
    );
    showToast('success', 'Request Approved', `Approval request ${id} has been authorized.`);
    addAuditLog('Approved', 'Approval', id, 'Pending', 'Approved');
  };

  const rejectRequest = (id: string, comments?: string) => {
    setApprovalRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: 'Rejected', comments: comments || 'Rejected', approver: currentUser.name }
          : r
      )
    );
    showToast('warning', 'Request Rejected', `Approval request ${id} was returned.`);
    addAuditLog('Rejected', 'Approval', id, 'Pending', 'Rejected');
  };

  const processPayrollRun = (month: string): number => {
    const newSlips: PayrollRecord[] = employees.map((emp, idx) => {
      const gross = emp.monthlySalary || emp.salary || 60000;
      const basic = Math.round(gross * 0.5);
      const hra = Math.round(gross * 0.3);
      const allowances = Math.round(gross * 0.2);
      const pfDeduction = Math.round(basic * 0.12);
      const taxDeduction = Math.round(gross * 0.1);
      const netSalary = gross - pfDeduction - taxDeduction;

      return {
        id: `PAY-${Date.now().toString().slice(-4)}-${idx + 1}`,
        employeeId: emp.id,
        employeeName: emp.name,
        month,
        basic,
        hra,
        allowances,
        pfDeduction,
        taxDeduction,
        netSalary,
        status: 'Processed',
      };
    });

    setPayrollRecords((prev) => [...newSlips, ...prev]);
    showToast(
      'success',
      'Payroll Processed',
      `Generated ${newSlips.length} pay slips for ${month} with statutory tax deductions.`
    );
    addAuditLog('Created', 'HR', `PAY-${month}`, undefined, `${newSlips.length} slips generated`);
    return newSlips.length;
  };

  const recordPayment = (p: any) => {
    const paymentItem: Payment = {
      id: `PAY-${Date.now().toString().slice(-4)}`,
      paymentNumber: `RCP-${Date.now().toString().slice(-4)}`,
      invoiceId: p.invoiceId || '',
      invoiceNumber: p.invoiceNumber || 'INV-DIRECT',
      partyName: p.partyName || 'Counterparty',
      partyType: p.partyType || (p.type === 'Receipt' ? 'Customer' : 'Vendor'),
      date: p.date || new Date().toISOString().split('T')[0],
      amount: p.amount || 0,
      paymentMode: p.paymentMode || 'Bank Transfer (NEFT/RTGS)',
      referenceTransactionId: p.referenceNumber || p.referenceTransactionId || `TXN-${Date.now()}`,
      referenceNumber: p.referenceNumber,
      type: p.type,
      notes: p.notes,
    };
    setPayments((prev) => [paymentItem, ...prev]);
    showToast('success', 'Payment Recorded', `Payment voucher ${paymentItem.paymentNumber} of ₹${paymentItem.amount.toLocaleString('en-IN')} posted.`);
    addAuditLog('Paid', 'Finance', paymentItem.id, undefined, `Amount: ₹${paymentItem.amount}`);
  };

  return (
    <ERPContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        currentUser,
        setCurrentUser,
        isLoggedIn,
        login,
        logout,
        hasPermission,
        activeTab,
        setActiveTab,
        company,
        branches,
        departments,
        warehouses,
        customers,
        vendors,
        products,
        inventoryMovements,
        purchaseRequisitions,
        purchaseOrders,
        salesQuotations,
        salesOrders,
        invoices,
        payments,
        expenses,
        chartOfAccounts,
        employees,
        attendance,
        leaveRequests,
        payrollRecords,
        approvalTasks,
        approvalRequests,
        notifications,
        auditLogs,
        unreadNotificationCount,
        isSearchOpen,
        setIsSearchOpen,
        isNotificationsOpen,
        setIsNotificationsOpen,
        isArchitectureOpen,
        setIsArchitectureOpen,
        toasts,
        showToast,
        removeToast,
        addCustomer,
        updateCustomer,
        addVendor,
        updateVendor,
        addProduct,
        updateProduct,
        stockIn,
        stockOut,
        stockTransfer,
        stockAdjustment,
        createPurchaseRequisition,
        approvePurchaseRequisition,
        rejectPurchaseRequisition,
        convertPRToPO,
        createPurchaseOrder,
        approvePurchaseOrder,
        receiveGoods,
        recordPOPayment,
        createSalesQuotation,
        convertQuotationToSO,
        createSalesOrder,
        confirmSalesOrder,
        deliverSalesOrder,
        recordSOPayment,
        recordInvoicePayment,
        recordPayment,
        addExpense,
        addEmployee,
        toggleAttendance,
        applyLeave,
        processApproval,
        approveRequest,
        rejectRequest,
        processPayrollRun,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        addAuditLog,
        resetAllDemoData,
        runFullPurchaseDemo,
        runFullSalesDemo,
        isSimulating,
      }}
    >
      {children}
    </ERPContext.Provider>
  );
};

export const useERP = (): ERPContextType => {
  const context = useContext(ERPContext);
  if (!context) {
    throw new Error('useERP must be used within an ERPProvider');
  }
  return context;
};
