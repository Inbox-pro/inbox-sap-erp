import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { Employee, PayrollRecord } from '../../types/erp';
import {
  Users,
  Search,
  Plus,
  DollarSign,
  FileText,
  Calendar,
  Eye,
  CheckCircle,
  Briefcase,
  Building,
  UserCheck
} from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';

export const HRModule: React.FC = () => {
  const {
    employees,
    departments,
    payrollRecords,
    addEmployee,
    processPayrollRun,
  } = useERP();

  const [activeTab, setActiveTab] = useState<'employees' | 'payroll'>('employees');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('All');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedPayslip, setSelectedPayslip] = useState<PayrollRecord | null>(null);

  // Modals
  const [isOnboardModalOpen, setIsOnboardModalOpen] = useState(false);

  // Onboard form state
  const [employeeForm, setEmployeeForm] = useState({
    name: '',
    department: 'Operations',
    designation: 'Operations Specialist',
    email: '',
    phone: '',
    dateOfJoining: new Date().toISOString().split('T')[0],
    monthlySalary: 75000,
    status: 'Active' as Employee['status'],
    panNumber: 'ABCDE1234F',
    bankAccount: 'HDFC000123456789',
  });

  const totalMonthlyPayroll = employees.reduce((sum, e) => sum + (e.monthlySalary || e.salary || 0), 0);

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.designation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDeptFilter === 'All' || emp.department === selectedDeptFilter;
    return matchesSearch && matchesDept;
  });

  const handleOnboardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeForm.name || !employeeForm.email) return;

    addEmployee({
      name: employeeForm.name,
      department: employeeForm.department,
      designation: employeeForm.designation,
      email: employeeForm.email,
      phone: employeeForm.phone,
      dateOfJoining: employeeForm.dateOfJoining,
      monthlySalary: Number(employeeForm.monthlySalary),
      status: employeeForm.status,
      panNumber: employeeForm.panNumber,
      bankAccount: employeeForm.bankAccount,
    });

    setIsOnboardModalOpen(false);
  };

  const handleRunMonthlyPayroll = () => {
    const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
    const count = processPayrollRun(currentMonth);
    setActiveTab('payroll');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Human Resources & Payroll
            </h1>
            <span className="text-xs bg-cyan-50 text-cyan-700 font-semibold px-2 py-0.5 rounded-full border border-cyan-200">
              HCM & Compensation
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Employee master directory, Indian payroll structures (Basic, HRA, PF, TDS), and automated payslip generation.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleRunMonthlyPayroll}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors"
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Process Monthly Payroll</span>
          </button>
          <button
            onClick={() => setIsOnboardModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Onboard Employee</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Workforce
            </span>
            <div className="p-2 rounded-lg bg-cyan-50 text-cyan-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2 font-mono">
            {employees.length} Staff
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Across {departments.length} corporate departments
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Monthly CTC Commitment
            </span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-700 mt-2 font-mono">
            ₹{totalMonthlyPayroll.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-slate-500 mt-1">Gross salary pool</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Processed Pay Slips
            </span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2 font-mono">
            {payrollRecords.length} Records
          </div>
          <div className="text-xs text-slate-500 mt-1">Tax compliant payslips</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('employees')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              activeTab === 'employees'
                ? 'bg-cyan-700 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Employee Directory ({employees.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('payroll')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              activeTab === 'payroll'
                ? 'bg-cyan-700 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Payroll & Pay Slips ({payrollRecords.length})</span>
          </button>
        </div>

        <div className="relative w-64 hidden sm:block">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search staff, role, ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Tab 1: Employees Directory */}
      {activeTab === 'employees' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Department:</span>
            <select
              value={selectedDeptFilter}
              onChange={(e) => setSelectedDeptFilter(e.target.value)}
              className="text-xs p-1.5 border border-slate-200 rounded-md bg-slate-50"
            >
              <option value="All">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Employee ID</th>
                    <th className="py-3 px-4">Full Name</th>
                    <th className="py-3 px-4">Department & Role</th>
                    <th className="py-3 px-4">Joining Date</th>
                    <th className="py-3 px-4">Monthly CTC</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredEmployees.map((emp) => (
                    <tr key={emp.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-semibold text-cyan-700">
                        {emp.id}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-900">
                        <div>{emp.name}</div>
                        <div className="text-[11px] text-slate-400">{emp.email}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800">{emp.designation}</div>
                        <div className="text-[11px] text-slate-500">{emp.department}</div>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-500">
                        {emp.dateOfJoining}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        ₹{(emp.monthlySalary || emp.salary || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={emp.status} size="sm" />
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedEmployee(emp)}
                          className="p-1.5 text-slate-600 hover:text-cyan-700 hover:bg-cyan-50 rounded-md"
                          title="View Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Payroll Records */}
      {activeTab === 'payroll' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Slip ID</th>
                  <th className="py-3 px-4">Payroll Month</th>
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4 text-right">Basic</th>
                  <th className="py-3 px-4 text-right">HRA</th>
                  <th className="py-3 px-4 text-right">Allowances</th>
                  <th className="py-3 px-4 text-right">PF & TDS Deductions</th>
                  <th className="py-3 px-4 text-right">Net Payable Salary</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">View Payslip</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payrollRecords.map((pay) => (
                  <tr key={pay.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-slate-700">
                      {pay.id}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      {pay.month}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-900">
                      <div>{pay.employeeName}</div>
                      <div className="text-[10px] font-mono text-slate-400">{pay.employeeId}</div>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-600">
                      ₹{pay.basic.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-600">
                      ₹{pay.hra.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-600">
                      ₹{pay.allowances.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-rose-600 font-semibold">
                      -₹{(pay.pfDeduction + pay.taxDeduction).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700">
                      ₹{pay.netSalary.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <StatusBadge status={pay.status} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedPayslip(pay)}
                        className="px-2.5 py-1 bg-cyan-50 hover:bg-cyan-100 text-cyan-800 font-semibold rounded-md border border-cyan-200 text-[11px]"
                      >
                        Print Slip
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Onboard Employee Modal */}
      <Modal
        isOpen={isOnboardModalOpen}
        onClose={() => setIsOnboardModalOpen(false)}
        title="Onboard New Employee"
        subtitle="Add team member to corporate roster, payroll, and benefits master"
      >
        <form onSubmit={handleOnboardSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Full Legal Name *</label>
              <input
                type="text"
                required
                value={employeeForm.name}
                onChange={(e) => setEmployeeForm({ ...employeeForm, name: e.target.value })}
                placeholder="e.g. Anand Mahindra"
                className="w-full p-2 border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Official Work Email *</label>
              <input
                type="email"
                required
                value={employeeForm.email}
                onChange={(e) => setEmployeeForm({ ...employeeForm, email: e.target.value })}
                placeholder="anand@enterprise-corp.in"
                className="w-full p-2 border border-slate-200 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Department *</label>
              <select
                value={employeeForm.department}
                onChange={(e) => setEmployeeForm({ ...employeeForm, department: e.target.value })}
                className="w-full p-2 border border-slate-200 rounded-lg"
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Designation / Role *</label>
              <input
                type="text"
                required
                value={employeeForm.designation}
                onChange={(e) => setEmployeeForm({ ...employeeForm, designation: e.target.value })}
                placeholder="Senior Systems Engineer"
                className="w-full p-2 border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Gross Monthly CTC (INR) *</label>
              <input
                type="number"
                required
                value={employeeForm.monthlySalary}
                onChange={(e) => setEmployeeForm({ ...employeeForm, monthlySalary: Number(e.target.value) })}
                className="w-full p-2 border border-slate-200 rounded-lg font-mono font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Phone Number</label>
              <input
                type="text"
                value={employeeForm.phone}
                onChange={(e) => setEmployeeForm({ ...employeeForm, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full p-2 border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-semibold mb-1">PAN Card Number</label>
              <input
                type="text"
                value={employeeForm.panNumber}
                onChange={(e) => setEmployeeForm({ ...employeeForm, panNumber: e.target.value.toUpperCase() })}
                placeholder="ABCDE1234F"
                className="w-full p-2 border border-slate-200 rounded-lg font-mono uppercase"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Salary Bank A/C</label>
              <input
                type="text"
                value={employeeForm.bankAccount}
                onChange={(e) => setEmployeeForm({ ...employeeForm, bankAccount: e.target.value })}
                placeholder="HDFC000123456789"
                className="w-full p-2 border border-slate-200 rounded-lg font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsOnboardModalOpen(false)}
              className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-cyan-700 hover:bg-cyan-800 text-white rounded-lg font-semibold shadow-xs"
            >
              Confirm Onboarding
            </button>
          </div>
        </form>
      </Modal>

      {/* Payslip View Modal */}
      {selectedPayslip && (
        <Modal
          isOpen={!!selectedPayslip}
          onClose={() => setSelectedPayslip(null)}
          title={`Salary Pay Slip: ${selectedPayslip.month}`}
          subtitle={`Employee: ${selectedPayslip.employeeName} (${selectedPayslip.employeeId})`}
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex justify-between items-center">
              <div>
                <span className="text-slate-400">Company:</span>
                <div className="font-bold text-slate-900">Enterprise Solutions India Pvt Ltd</div>
              </div>
              <div className="text-right">
                <span className="text-slate-400">Pay Period:</span>
                <div className="font-bold text-slate-900">{selectedPayslip.month}</div>
              </div>
            </div>

            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-semibold">
                  <tr>
                    <th className="p-2.5">Earnings Item</th>
                    <th className="p-2.5 text-right">Amount (INR)</th>
                    <th className="p-2.5">Deductions</th>
                    <th className="p-2.5 text-right">Amount (INR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-2.5">Basic Salary (50%)</td>
                    <td className="p-2.5 text-right font-mono font-medium">₹{selectedPayslip.basic.toLocaleString('en-IN')}</td>
                    <td className="p-2.5">Provident Fund (PF - 12%)</td>
                    <td className="p-2.5 text-right font-mono text-rose-600">₹{selectedPayslip.pfDeduction.toLocaleString('en-IN')}</td>
                  </tr>
                  <tr>
                    <td className="p-2.5">House Rent Allowance (HRA - 30%)</td>
                    <td className="p-2.5 text-right font-mono font-medium">₹{selectedPayslip.hra.toLocaleString('en-IN')}</td>
                    <td className="p-2.5">Tax Deduction (TDS - 10%)</td>
                    <td className="p-2.5 text-right font-mono text-rose-600">₹{selectedPayslip.taxDeduction.toLocaleString('en-IN')}</td>
                  </tr>
                  <tr>
                    <td className="p-2.5">Special Allowances (20%)</td>
                    <td className="p-2.5 text-right font-mono font-medium">₹{selectedPayslip.allowances.toLocaleString('en-IN')}</td>
                    <td className="p-2.5">Total Deductions</td>
                    <td className="p-2.5 text-right font-mono font-bold text-rose-600">
                      ₹{(selectedPayslip.pfDeduction + selectedPayslip.taxDeduction).toLocaleString('en-IN')}
                    </td>
                  </tr>
                </tbody>
                <tfoot className="bg-emerald-50 border-t border-emerald-200 font-bold text-sm">
                  <tr>
                    <td colSpan={2} className="p-3 text-emerald-900">Gross Monthly CTC</td>
                    <td colSpan={2} className="p-3 text-right text-emerald-900 font-mono">
                      Net Take-Home: ₹{selectedPayslip.netSalary.toLocaleString('en-IN')}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedPayslip(null)}
                className="px-4 py-1.5 bg-slate-800 text-white rounded-lg font-medium"
              >
                Close Pay Slip
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Employee Details Modal */}
      {selectedEmployee && (
        <Modal
          isOpen={!!selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
          title={`Employee Record: ${selectedEmployee.name}`}
          subtitle={`ID: ${selectedEmployee.id} • ${selectedEmployee.designation}`}
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-400">Department:</span>
                <div className="font-bold text-slate-800 mt-0.5">{selectedEmployee.department}</div>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-400">Employment Status:</span>
                <div className="mt-1"><StatusBadge status={selectedEmployee.status} size="sm" /></div>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-400">Official Email:</span>
                <div className="font-bold text-slate-800 mt-0.5">{selectedEmployee.email}</div>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-400">Monthly Compensation:</span>
                <div className="font-mono font-bold text-emerald-700 mt-0.5">
                  ₹{(selectedEmployee.monthlySalary || selectedEmployee.salary || 0).toLocaleString('en-IN')}
                </div>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-400">PAN Document:</span>
                <div className="font-mono font-bold text-slate-800 mt-0.5">{selectedEmployee.panNumber || 'N/A'}</div>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-400">Disbursement A/C:</span>
                <div className="font-mono font-bold text-slate-800 mt-0.5">{selectedEmployee.bankAccount || 'N/A'}</div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
