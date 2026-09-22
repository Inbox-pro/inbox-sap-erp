import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { ApprovalRequest } from '../../types/erp';
import {
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  Eye,
  FileCheck,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';

export const ApprovalModule: React.FC = () => {
  const { approvalRequests, approveRequest, rejectRequest, currentUser } = useERP();

  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('Pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReq, setSelectedReq] = useState<ApprovalRequest | null>(null);

  // Approval Action Dialog state
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [comments, setComments] = useState('');

  const filteredRequests = approvalRequests.filter((req) => {
    const matchesStatus = statusFilter === 'All' || req.status === statusFilter;
    const matchesSearch =
      req.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.submittedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.type.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const pendingCount = approvalRequests.filter((r) => r.status === 'Pending').length;
  const approvedCount = approvalRequests.filter((r) => r.status === 'Approved').length;
  const rejectedCount = approvalRequests.filter((r) => r.status === 'Rejected').length;

  const handleOpenAction = (req: ApprovalRequest, type: 'approve' | 'reject') => {
    setSelectedReq(req);
    setActionType(type);
    setComments(type === 'approve' ? 'Approved based on departmental budget allocation.' : 'Exceeds current quarterly budget limit.');
  };

  const handleConfirmAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReq || !actionType) return;

    if (actionType === 'approve') {
      approveRequest(selectedReq.id, comments);
    } else {
      rejectRequest(selectedReq.id, comments);
    }

    setActionType(null);
    setSelectedReq(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Enterprise Approval Workflow Engine
            </h1>
            <span className="text-xs bg-amber-50 text-amber-700 font-semibold px-2 py-0.5 rounded-full border border-amber-200">
              Multi-Level Governance
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Stage-gate authorizations for Purchase Requisitions, Capital POs, and Vendor Credit agreements.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-slate-600">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Active Role: <strong className="text-slate-900">{currentUser.role}</strong></span>
        </div>
      </div>

      {/* KPI Status Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={() => setStatusFilter('Pending')}
          className={`cursor-pointer bg-white rounded-xl border p-4 shadow-2xs transition-all ${
            statusFilter === 'Pending' ? 'border-amber-400 ring-2 ring-amber-100' : 'border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Awaiting Action
            </span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-600 mt-2 font-mono">
            {pendingCount} Items
          </div>
          <div className="text-xs text-slate-500 mt-1">Requires supervisor authorization</div>
        </div>

        <div
          onClick={() => setStatusFilter('Approved')}
          className={`cursor-pointer bg-white rounded-xl border p-4 shadow-2xs transition-all ${
            statusFilter === 'Approved' ? 'border-emerald-400 ring-2 ring-emerald-100' : 'border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Approved
            </span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-600 mt-2 font-mono">
            {approvedCount} Passed
          </div>
          <div className="text-xs text-slate-500 mt-1">Processed and passed downstream</div>
        </div>

        <div
          onClick={() => setStatusFilter('Rejected')}
          className={`cursor-pointer bg-white rounded-xl border p-4 shadow-2xs transition-all ${
            statusFilter === 'Rejected' ? 'border-rose-400 ring-2 ring-rose-100' : 'border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Rejected
            </span>
            <div className="p-2 rounded-lg bg-rose-50 text-rose-600">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-rose-600 mt-2 font-mono">
            {rejectedCount} Returned
          </div>
          <div className="text-xs text-slate-500 mt-1">Returned with objection notes</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search request ID, submitter, ref..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {(['All', 'Pending', 'Approved', 'Rejected'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${
                statusFilter === st
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Request ID</th>
                <th className="py-3 px-4">Approval Type</th>
                <th className="py-3 px-4">Ref Number</th>
                <th className="py-3 px-4">Submitted By</th>
                <th className="py-3 px-4">Submission Date</th>
                <th className="py-3 px-4 text-right">Commitment Value</th>
                <th className="py-3 px-4">Approval Stage</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Decision Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    No approval requests found for this filter.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => {
                  const isPending = req.status === 'Pending';

                  return (
                    <tr key={req.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-semibold text-slate-900">
                        {req.id}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-800 px-2 py-0.5 bg-slate-100 rounded text-[11px]">
                          {req.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-blue-600 font-semibold">
                        {req.referenceNumber}
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        {req.submittedBy}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-500">
                        {req.submissionDate}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                        ₹{req.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-medium text-slate-600">
                            {req.approvalLevel}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={req.status} size="sm" />
                      </td>
                      <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                        {isPending ? (
                          <>
                            <button
                              onClick={() => handleOpenAction(req, 'approve')}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-md shadow-2xs text-[11px]"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleOpenAction(req, 'reject')}
                              className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-md shadow-2xs text-[11px]"
                            >
                              Reject
                            </button>
                          </>
                        ) : (
                          <div className="text-[11px] text-slate-500 italic">
                            {req.comments || `Decided by ${req.approver}`}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Dialog (Approve / Reject) */}
      {selectedReq && actionType && (
        <Modal
          isOpen={!!actionType}
          onClose={() => setActionType(null)}
          title={actionType === 'approve' ? 'Confirm Approval Authorization' : 'Record Rejection Decision'}
          subtitle={`Request ${selectedReq.id} • ${selectedReq.type} (${selectedReq.referenceNumber}) for ₹${selectedReq.amount.toLocaleString('en-IN')}`}
        >
          <form onSubmit={handleConfirmAction} className="space-y-4 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-slate-400">Request Details:</span>
              <p className="text-slate-800 font-medium mt-1">{selectedReq.details}</p>
              <div className="mt-2 text-slate-500">
                Submitted by: <strong>{selectedReq.submittedBy}</strong> on {selectedReq.submissionDate}
              </div>
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">
                {actionType === 'approve' ? 'Approval Comments / Notes' : 'Mandatory Reason for Rejection *'}
              </label>
              <textarea
                rows={3}
                required
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-lg"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActionType(null)}
                className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-4 py-2 text-white rounded-lg font-semibold shadow-xs ${
                  actionType === 'approve'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                {actionType === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
