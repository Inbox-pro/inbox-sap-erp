import React, { useState } from 'react';
import { ERPProvider, useERP } from './context/ERPContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopNav } from './components/layout/TopNav';
import { WorkflowBanner } from './components/layout/WorkflowBanner';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { ArchitectureModal } from './components/common/ArchitectureModal';
import { ToastContainer } from './components/common/ToastContainer';

// Modules
import { DashboardModule } from './components/modules/DashboardModule';
import { OrganizationModule } from './components/modules/OrganizationModule';
import { CustomerModule } from './components/modules/CustomerModule';
import { VendorModule } from './components/modules/VendorModule';
import { ProductModule } from './components/modules/ProductModule';
import { InventoryModule } from './components/modules/InventoryModule';
import { ProcurementModule } from './components/modules/ProcurementModule';
import { SalesModule } from './components/modules/SalesModule';
import { FinanceModule } from './components/modules/FinanceModule';
import { HRModule } from './components/modules/HRModule';
import { ApprovalModule } from './components/modules/ApprovalModule';
import { ReportingModule } from './components/modules/ReportingModule';
import { AuditModule } from './components/modules/AuditModule';

const ERPContent: React.FC = () => {
  const {
    activeTab,
    isSearchOpen,
    setIsSearchOpen,
    isNotificationsOpen,
    setIsNotificationsOpen,
    isArchitectureOpen,
    setIsArchitectureOpen,
  } = useERP();

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const renderModule = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardModule />;
      case 'organization':
        return <OrganizationModule />;
      case 'customers':
        return <CustomerModule />;
      case 'vendors':
        return <VendorModule />;
      case 'products':
        return <ProductModule />;
      case 'inventory':
        return <InventoryModule />;
      case 'procurement':
        return <ProcurementModule />;
      case 'sales':
        return <SalesModule />;
      case 'finance':
      case 'invoices':
        return <FinanceModule />;
      case 'hr':
        return <HRModule />;
      case 'approvals':
        return <ApprovalModule />;
      case 'reports':
        return <ReportingModule />;
      case 'audit-logs':
        return <AuditModule />;
      case 'settings':
        return <OrganizationModule />;
      default:
        return <DashboardModule />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 font-sans text-slate-800">
      {/* Collapsible Enterprise Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
        {/* Global Top Navbar with RBAC & Global Actions */}
        <TopNav
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenArchitecture={() => setIsArchitectureOpen(true)}
        />

        {/* Interactive Guided Demo Workflow Banner */}
        <WorkflowBanner
          onOpenArchitecture={() => setIsArchitectureOpen(true)}
        />

        {/* Scrollable Module Workspace */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {renderModule()}
          </div>
        </main>
      </div>

      {/* Global Modals & Toasts */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
      <ArchitectureModal
        isOpen={isArchitectureOpen}
        onClose={() => setIsArchitectureOpen(false)}
      />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <ERPProvider>
      <ERPContent />
    </ERPProvider>
  );
}
