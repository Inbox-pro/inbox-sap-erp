import React, { useState } from 'react';
import { Modal } from './Modal';
import {
  Database,
  Layers,
  ShieldCheck,
  Server,
  Code2,
  Workflow,
  Sparkles,
  GitBranch,
  Terminal,
  Cpu
} from 'lucide-react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'datamodel' | 'api' | 'security' | 'future'>('architecture');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Ganga ERP System Architecture & Technical Specifications"
      subtitle="Modular architecture, database schemas, REST API endpoints, and production scalability roadmap"
      maxWidth="4xl"
    >
      <div className="space-y-6">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 gap-2 overflow-x-auto pb-1">
          {[
            { id: 'architecture', label: 'Modular Architecture', icon: Layers },
            { id: 'datamodel', label: 'Database Schema & ERD', icon: Database },
            { id: 'api', label: 'REST API Specs', icon: Server },
            { id: 'security', label: 'Security & RBAC Blueprint', icon: ShieldCheck },
            { id: 'future', label: 'Future Phase Roadmap', icon: GitBranch },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors whitespace-nowrap ${
                  isActive
                    ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50/50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Architecture */}
        {activeTab === 'architecture' && (
          <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
            <div className="p-4 bg-slate-900 text-slate-100 rounded-xl font-mono text-[11px] overflow-x-auto">
              <div className="text-emerald-400 font-bold mb-2">// Modular Monolith ERP Architecture</div>
              <pre className="text-slate-300">
{`Ganga ERP Platform
├── Core / Auth & RBAC (Multi-role permissions: Admin, Manager, Finance, HR, Employee)
├── Master Data Management
│   ├── Organization (Company, Branches, Departments, Warehouses)
│   ├── Customer Master (Billing, GSTIN, Ledger, Credit Limits)
│   ├── Vendor Master (Procurement terms, Payment schedules)
│   └── Product Master (SKU, Categories, Multi-warehouse stock)
├── Business Transaction Modules
│   ├── Procurement (Requisition → Approval → PO → Goods Receipt / GRN)
│   ├── Sales (Quotation → Order → Warehouse Dispatch → Delivery)
│   ├── Inventory Engine (Multi-warehouse stock, Movements, Transfers, Adjustments)
│   └── Finance & Invoicing (AP/AR, GST Breakdown, Payments, Expense Ledger)
├── People & Governance
│   ├── HR & Workforce (Employees, Attendance, Leave workflows)
│   ├── Universal Approval Workflow (Multi-level approvals, audit history)
│   └── Immutable Audit Trail (User, Action, Timestamp, Diff, IP tracking)
└── Analytics & Integrations (Reporting, Global Search, Realtime Alerts)`}
              </pre>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-lg">
                <h5 className="font-bold text-slate-900 text-xs mb-1">State Decoupling & Reactive Bus</h5>
                <p>Designed with isolated service contracts. Cross-module operations like Goods Receipt trigger domain events that notify Inventory and Accounts Payable without tightly coupled database dependencies.</p>
              </div>
              <div className="p-3 bg-purple-50/70 border border-purple-100 rounded-lg">
                <h5 className="font-bold text-slate-900 text-xs mb-1">Microservices Migration Ready</h5>
                <p>Domain models and bounded contexts (Procurement, Sales, Inventory, Accounting) are cleanly partitioned, permitting easy future extraction into containerized microservices or serverless functions.</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Database Schema & ERD */}
        {activeTab === 'datamodel' && (
          <div className="space-y-4 text-xs text-slate-600">
            <p className="text-slate-700">
              The data model is engineered for direct translation into PostgreSQL, Cloud SQL, MySQL, or CockroachDB tables with primary keys, foreign keys, and referential integrity constraints:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
                <h6 className="font-bold text-slate-900 text-xs flex items-center gap-1.5 mb-2">
                  <Database className="w-3.5 h-3.5 text-blue-600" />
                  <span>Procurement & Inbound Flow</span>
                </h6>
                <div className="space-y-1.5 font-mono text-[10px] text-slate-600">
                  <div className="p-1.5 bg-white border border-slate-200 rounded">
                    <strong>vendors</strong> (id PK, company_name, gstin, payment_terms, status)
                  </div>
                  <div className="text-center text-blue-500 font-bold">↓ 1:N</div>
                  <div className="p-1.5 bg-white border border-slate-200 rounded">
                    <strong>purchase_orders</strong> (id PK, vendor_id FK, status, warehouse_id FK, total_amount)
                  </div>
                  <div className="text-center text-blue-500 font-bold">↓ 1:1</div>
                  <div className="p-1.5 bg-white border border-slate-200 rounded">
                    <strong>goods_receipts (GRN)</strong> (id PK, po_id FK, warehouse_id FK, received_date)
                  </div>
                  <div className="text-center text-blue-500 font-bold">↓ triggers</div>
                  <div className="p-1.5 bg-emerald-50 border border-emerald-200 rounded text-emerald-800">
                    <strong>inventory_transactions</strong> (product_id FK, warehouse_id FK, qty: +N)
                  </div>
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
                <h6 className="font-bold text-slate-900 text-xs flex items-center gap-1.5 mb-2">
                  <Database className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Sales & Outbound Flow</span>
                </h6>
                <div className="space-y-1.5 font-mono text-[10px] text-slate-600">
                  <div className="p-1.5 bg-white border border-slate-200 rounded">
                    <strong>customers</strong> (id PK, name, company_name, gstin, credit_limit)
                  </div>
                  <div className="text-center text-emerald-500 font-bold">↓ 1:N</div>
                  <div className="p-1.5 bg-white border border-slate-200 rounded">
                    <strong>sales_orders</strong> (id PK, customer_id FK, warehouse_id FK, status, total)
                  </div>
                  <div className="text-center text-emerald-500 font-bold">↓ 1:1</div>
                  <div className="p-1.5 bg-white border border-slate-200 rounded">
                    <strong>deliveries / dispatch</strong> (id PK, so_id FK, dispatch_date)
                  </div>
                  <div className="text-center text-emerald-500 font-bold">↓ triggers</div>
                  <div className="p-1.5 bg-rose-50 border border-rose-200 rounded text-rose-800">
                    <strong>inventory_transactions</strong> (product_id FK, warehouse_id FK, qty: -N)
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900">
              <span className="font-bold">Unified Financial Settlement: </span>
              Invoices (Sales & Purchase) feed directly into Accounts Receivable / Accounts Payable with 1:N relational links to <code>payments</code> (allocating NEFT/RTGS, UPI, Cheques) and updating customer/vendor outstanding balances in real time.
            </div>
          </div>
        )}

        {/* Tab 3: REST API */}
        {activeTab === 'api' && (
          <div className="space-y-3 text-xs">
            <p className="text-slate-600">
              The POC component handlers are structured to map 1:1 to standard RESTful microservice API endpoints:
            </p>
            <div className="border border-slate-200 rounded-lg overflow-hidden font-mono text-[11px]">
              <table className="w-full text-left">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-2">HTTP Method</th>
                    <th className="p-2">Endpoint</th>
                    <th className="p-2">Description</th>
                    <th className="p-2">RBAC Authorization</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  <tr>
                    <td className="p-2 text-blue-600 font-bold">GET / POST</td>
                    <td className="p-2">/api/v1/customers</td>
                    <td className="p-2">Query & create customer master records</td>
                    <td className="p-2 text-slate-500">Admin, Manager, Sales</td>
                  </tr>
                  <tr>
                    <td className="p-2 text-blue-600 font-bold">GET / POST</td>
                    <td className="p-2">/api/v1/products</td>
                    <td className="p-2">Product catalogue, SKU lookup & prices</td>
                    <td className="p-2 text-slate-500">All Roles</td>
                  </tr>
                  <tr>
                    <td className="p-2 text-purple-600 font-bold">POST</td>
                    <td className="p-2">/api/v1/inventory/transfer</td>
                    <td className="p-2">Inter-warehouse stock transfer with atomic lock</td>
                    <td className="p-2 text-slate-500">Admin, Operations Manager</td>
                  </tr>
                  <tr>
                    <td className="p-2 text-emerald-600 font-bold">POST</td>
                    <td className="p-2">/api/v1/procurement/grn</td>
                    <td className="p-2">Receive goods, update stock, generate AP bill</td>
                    <td className="p-2 text-slate-500">Admin, Operations</td>
                  </tr>
                  <tr>
                    <td className="p-2 text-emerald-600 font-bold">POST</td>
                    <td className="p-2">/api/v1/sales/orders/:id/deliver</td>
                    <td className="p-2">Dispatch delivery note, deduct stock, issue invoice</td>
                    <td className="p-2 text-slate-500">Admin, Sales, Operations</td>
                  </tr>
                  <tr>
                    <td className="p-2 text-amber-600 font-bold">POST</td>
                    <td className="p-2">/api/v1/finance/payments</td>
                    <td className="p-2">Log inbound or outbound payment against invoice</td>
                    <td className="p-2 text-slate-500">Admin, Finance</td>
                  </tr>
                  <tr>
                    <td className="p-2 text-rose-600 font-bold">GET</td>
                    <td className="p-2">/api/v1/audit-logs</td>
                    <td className="p-2">Immutable audit trail with filters</td>
                    <td className="p-2 text-slate-500">Admin Only</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Security */}
        {activeTab === 'security' && (
          <div className="space-y-4 text-xs text-slate-600">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Authentication & Tokens</span>
                </div>
                <p>JWT-based access tokens with refresh tokens in HttpOnly secure cookies. MFA/2FA readiness and SSO integration via SAML 2.0 / OAuth 2.0.</p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                  <Layers className="w-4 h-4 text-blue-600" />
                  <span>Granular RBAC Matrix</span>
                </div>
                <p>Role-based access checks at route level and database row-level security (RLS) ensuring employees only query their own department's data.</p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                  <Terminal className="w-4 h-4 text-purple-600" />
                  <span>Immutable Audit Logging</span>
                </div>
                <p>Every mutation (creating, editing, approving, stock updates) logs user ID, timestamp, before/after values, and client IP address in append-only storage.</p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                  <Cpu className="w-4 h-4 text-amber-600" />
                  <span>Data Encryption & Compliance</span>
                </div>
                <p>AES-256 encryption at rest for customer PAN/GSTIN and financial ledgers. TLS 1.3 in transit with strict CORS and rate-limiting policies.</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Future Roadmap */}
        {activeTab === 'future' && (
          <div className="space-y-3 text-xs text-slate-600">
            <p className="text-slate-700">
              Future expansion blueprint once POC approval is secured:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 border border-slate-200 rounded-lg bg-slate-50 space-y-1">
                <h6 className="font-bold text-slate-900">Phase 2: Core Enterprise</h6>
                <ul className="list-disc pl-4 space-y-0.5 text-slate-600">
                  <li>Double-Entry Ledger & Chart of Accounts</li>
                  <li>Automated Indian GST E-Invoicing & E-Way Bills</li>
                  <li>Multi-Currency & Forex Rate Feeds</li>
                  <li>Complete Payroll & PF/ESIC Deductions</li>
                </ul>
              </div>

              <div className="p-3 border border-slate-200 rounded-lg bg-slate-50 space-y-1">
                <h6 className="font-bold text-slate-900">Phase 3: Operations & Supply</h6>
                <ul className="list-disc pl-4 space-y-0.5 text-slate-600">
                  <li>Manufacturing & Bill of Materials (BOM)</li>
                  <li>Batch & Serial Number Tracking with Barcodes</li>
                  <li>Work Orders & Shop-Floor Routing</li>
                  <li>Predictive Reorder Level Forecasting</li>
                </ul>
              </div>

              <div className="p-3 border border-slate-200 rounded-lg bg-slate-50 space-y-1">
                <h6 className="font-bold text-slate-900">Phase 4: Ecosystem & Intelligence</h6>
                <ul className="list-disc pl-4 space-y-0.5 text-slate-600">
                  <li>Native iOS / Android Field Delivery App</li>
                  <li>CRM Pipeline & Lead Conversion</li>
                  <li>PowerBI / Metabase BI Dashboards</li>
                  <li>EDI & SAP/Oracle Bridge Connectors</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Close Button */}
        <div className="flex justify-end pt-2 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            Close Specifications
          </button>
        </div>
      </div>
    </Modal>
  );
};
