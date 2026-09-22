import React from 'react';
import { useERP } from '../../context/ERPContext';
import {
  Bell,
  AlertTriangle,
  FileCheck,
  ShoppingCart,
  Calendar,
  CreditCard,
  Layers,
  CheckCheck,
  X
} from 'lucide-react';

interface NotificationPopoverProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationPopover: React.FC<NotificationPopoverProps> = ({ isOpen, onClose }) => {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead, setActiveTab } = useERP();

  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'low_stock':
        return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      case 'pending_approval':
        return <FileCheck className="w-4 h-4 text-amber-600" />;
      case 'new_order':
        return <ShoppingCart className="w-4 h-4 text-blue-600" />;
      case 'invoice_due':
        return <Calendar className="w-4 h-4 text-rose-600" />;
      case 'payment_received':
        return <CreditCard className="w-4 h-4 text-emerald-600" />;
      default:
        return <Layers className="w-4 h-4 text-indigo-600" />;
    }
  };

  const handleItemClick = (notif: any) => {
    markNotificationAsRead(notif.id);
    if (notif.targetModule) {
      const mod = notif.targetModule.toLowerCase();
      if (mod.includes('inventory')) setActiveTab('inventory');
      else if (mod.includes('procurement')) setActiveTab('procurement');
      else if (mod.includes('sales')) setActiveTab('sales');
      else if (mod.includes('finance')) setActiveTab('finance');
    }
    onClose();
  };

  return (
    <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/70">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-slate-700" />
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Notifications ({notifications.filter((n) => !n.isRead).length} new)
          </h4>
        </div>
        <button
          onClick={markAllNotificationsAsRead}
          className="text-[11px] text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
        >
          <CheckCheck className="w-3.5 h-3.5" />
          Mark all read
        </button>
      </div>

      {/* List */}
      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400">
            No notifications available
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => handleItemClick(notif)}
              className={`flex items-start gap-3 p-3.5 hover:bg-slate-50 cursor-pointer transition-colors ${
                !notif.isRead ? 'bg-blue-50/40' : ''
              }`}
            >
              <div className="p-1.5 rounded-lg bg-slate-100 shrink-0 mt-0.5">
                {getIcon(notif.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <p className="text-xs font-semibold text-slate-900 truncate">
                    {notif.title}
                  </p>
                  <span className="text-[10px] text-slate-400 shrink-0">
                    {notif.timestamp}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed line-clamp-2">
                  {notif.message}
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-[10px] font-medium text-blue-600 bg-blue-100/60 px-1.5 py-0.2 rounded">
                    {notif.targetModule}
                  </span>
                  {!notif.isRead && (
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-slate-100 bg-slate-50 text-center">
        <button
          onClick={() => {
            setActiveTab('notifications');
            onClose();
          }}
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          View All Notifications Center
        </button>
      </div>
    </div>
  );
};
