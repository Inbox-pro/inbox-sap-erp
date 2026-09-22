export type UserRole = 'ADMIN' | 'MANAGER' | 'EMPLOYEE' | 'FINANCE' | 'HR';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  avatar?: string;
  title: string;
}

export interface Company {
  id: string;
  name: string;
  legalName: string;
  taxId: string; // GSTIN in India
  cin: string; // Corporate Identity Number
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  phone: string;
  email: string;
  currency: string;
  fiscalYearStart: string;
  gstNumber?: string;
  panNumber?: string;
  cinNumber?: string;
  financialYear?: string;
}

export interface Branch {
  id: string;
  name: string;
  code: string;
  city: string;
  state: string;
  isHeadquarters: boolean;
  manager: string;
  employeeCount: number;
  status?: string;
  address?: string;
  gstNumber?: string;
  managerName?: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  head: string;
  budget: number;
  branchId: string;
  headOfDepartment?: string;
  employeeCount?: number;
}

export interface Warehouse {
  id: string;
  name: string;
  code: string;
  branchId: string;
  city: string;
  capacitySqFt: number;
  utilizedPercentage: number;
  manager: string;
  state?: string;
  status?: string;
  capacity?: string | number;
  managerName?: string;
  address?: string;
}

export interface Customer {
  id: string;
  name: string;
  companyName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  gstNumber: string;
  panNumber: string;
  paymentTerms: 'Immediate' | 'Net 15' | 'Net 30' | 'Net 45' | 'Net 60';
  creditLimit: number;
  outstandingBalance: number;
  status: 'Active' | 'Inactive' | 'On Hold';
  createdAt: string;
}

export interface Vendor {
  id: string;
  name: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  gstNumber: string;
  paymentTerms: 'Immediate' | 'Net 15' | 'Net 30' | 'Net 45';
  outstandingPayable: number;
  rating: number; // 1-5
  status: 'Active' | 'Under Review' | 'Blacklisted';
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: 'Hardware' | 'Electronics' | 'Networking' | 'Office Supplies' | 'Software Licenses' | 'Raw Material';
  unit: 'Pcs' | 'Kg' | 'Meters' | 'Boxes' | 'Licenses';
  purchasePrice: number;
  sellingPrice: number;
  taxRate: number; // GST %: 5, 12, 18, 28
  minStockLevel: number;
  currentStock: number;
  reservedStock: number;
  warehouseId: string;
  warehouseStock: Record<string, number>; // warehouseId -> qty
  status: 'Active' | 'Discontinued' | 'Low Stock';
  reorderQuantity: number;
  createdAt: string;
  description?: string;
}

export interface InventoryMovement {
  id: string;
  date: string;
  productId: string;
  productName: string;
  sku: string;
  type: 'Purchase Receipt' | 'Sales Delivery' | 'Transfer In' | 'Transfer Out' | 'Adjustment Increase' | 'Adjustment Decrease';
  warehouseId: string;
  quantity: number;
  previousStock: number;
  newStock: number;
  referenceDocId: string; // PO-xxx, SO-xxx, TR-xxx
  performedBy: string;
  notes?: string;
}

export interface PurchaseOrderItem {
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  total: number;
  receivedQuantity?: number;
}

export type POStatus = 'Draft' | 'Pending Approval' | 'Approved' | 'Ordered' | 'Partially Received' | 'Received' | 'Cancelled';

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  requisitionId?: string;
  vendorId: string;
  vendorName: string;
  orderDate: string;
  expectedDeliveryDate: string;
  warehouseId: string;
  items: PurchaseOrderItem[];
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  status: POStatus;
  notes?: string;
  approvedBy?: string;
  approvedDate?: string;
  goodsReceiptId?: string;
  invoiceId?: string;
  isPaid?: boolean;
}

export interface PurchaseRequisition {
  id: string;
  reqNumber: string;
  requestedBy: string;
  department: string;
  requestDate: string;
  requiredDate: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    estimatedUnitPrice: number;
    estimatedTotal: number;
  }>;
  totalEstimatedAmount: number;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Converted to PO';
  reason: string;
  approverComment?: string;
  poId?: string;
}

export interface SalesOrderItem {
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  discountPercentage: number;
  taxRate: number;
  total: number;
}

export type SOStatus = 'Draft' | 'Pending' | 'Confirmed' | 'Processing' | 'Delivered' | 'Completed' | 'Cancelled';

export interface SalesOrder {
  id: string;
  orderNumber: string;
  quotationId?: string;
  customerId: string;
  customerName: string;
  orderDate: string;
  deliveryDate: string;
  warehouseId: string;
  items: SalesOrderItem[];
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  status: SOStatus;
  deliveryStatus: 'Pending' | 'Dispatched' | 'Delivered';
  invoiceId?: string;
  isPaid?: boolean;
  notes?: string;
}

export interface SalesQuotation {
  id: string;
  quotationNumber: string;
  customerId: string;
  customerName: string;
  date: string;
  validUntil: string;
  items: SalesOrderItem[];
  totalAmount: number;
  status: 'Draft' | 'Sent' | 'Accepted' | 'Rejected' | 'Converted';
  salesOrderId?: string;
}

export type InvoiceType = 'Sales' | 'Purchase';
export type InvoiceStatus = 'Draft' | 'Sent' | 'Partially Paid' | 'Paid' | 'Overdue';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  type: InvoiceType;
  referenceId: string; // SO-xxx or PO-xxx
  partyId: string; // CustomerId or VendorId
  partyName: string;
  partyGst: string;
  partyAddress: string;
  invoiceDate: string;
  dueDate: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    taxRate: number;
    taxAmount: number;
    discount?: number;
    total: number;
  }>;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  status: InvoiceStatus;
  paymentIds: string[];
}

export interface Payment {
  id: string;
  paymentNumber: string;
  invoiceId: string;
  invoiceNumber: string;
  partyName: string;
  partyType: 'Customer' | 'Vendor';
  date: string;
  amount: number;
  paymentMode: 'Bank Transfer (NEFT/RTGS)' | 'UPI' | 'Cheque' | 'Credit Card' | 'Cash';
  referenceTransactionId: string;
  referenceNumber?: string;
  type?: string;
  notes?: string;
}

export interface Employee {
  id: string;
  employeeId?: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  joiningDate?: string;
  dateOfJoining?: string;
  salary?: number;
  monthlySalary?: number;
  status: 'Active' | 'On Leave' | 'Probation' | 'Terminated';
  branchId?: string;
  reportingManager?: string;
  panNumber?: string;
  bankAccount?: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  checkInTime: string;
  checkOutTime?: string;
  status: 'Present' | 'Late' | 'Half Day' | 'Absent' | 'On Leave';
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  leaveType: 'Casual Leave' | 'Sick Leave' | 'Privilege Leave' | 'Maternity/Paternity';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  approverComment?: string;
}

export interface ApprovalTask {
  id: string;
  type: 'Purchase Requisition' | 'Purchase Order' | 'Leave Request' | 'Expense Claim';
  referenceId: string;
  referenceNumber: string;
  title: string;
  requestedBy: string;
  department: string;
  requestDate: string;
  amount?: number;
  details: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  history: Array<{
    user: string;
    action: string;
    date: string;
    comment?: string;
  }>;
}

export interface ApprovalRequest {
  id: string;
  type: string;
  referenceNumber: string;
  submittedBy: string;
  submissionDate: string;
  amount: number;
  details: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  approvalLevel?: string;
  approver?: string;
  comments?: string;
}

export interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  month: string;
  basic: number;
  hra: number;
  allowances: number;
  pfDeduction: number;
  taxDeduction: number;
  netSalary: number;
  status: 'Processed' | 'Draft';
}

export interface ChartOfAccount {
  code: string;
  name: string;
  type: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
  balance: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'low_stock' | 'pending_approval' | 'new_order' | 'invoice_due' | 'payment_received' | 'system';
  targetModule: string;
  recordId?: string;
  timestamp: string;
  isRead: boolean;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string; // 'Created', 'Updated', 'Approved', 'Stock Received', 'Delivered', 'Payment Recorded'
  module: string; // 'Products', 'Inventory', 'Sales', 'Procurement', 'Finance', 'HR', 'Customers', 'Vendors'
  recordId: string;
  timestamp: string;
  previousValue?: string;
  newValue?: string;
  ipAddress?: string;
  description?: string;
  entityId?: string;
}

export interface ExpenseItem {
  id: string;
  title: string;
  category: 'Utilities' | 'Rent' | 'Logistics' | 'Software Subscriptions' | 'Marketing' | 'Office Maintenance' | 'Travel';
  amount: number;
  date: string;
  department: string;
  paymentMode: string;
  receiptNumber: string;
  recordedBy: string;
}
