import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bell, Search, User as UserIcon, LogOut, Shield, ChevronDown, Check, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Navbar: React.FC<{ onToggleSidebar?: () => void }> = () => {
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifications = [
    { id: 1, title: 'Low Stock Alert', desc: 'Eureka Forbes Robot Vacuum is below safety stock (8 units left)', time: '10m ago', link: '/inventory/low-stock' },
    { id: 2, title: 'PO Received', desc: 'PO-2026-0001 from Raymond Apparel has been received', time: '1h ago', link: '/purchase-orders' },
    { id: 3, title: 'Transfer In-Transit', desc: 'TRF-2026-0002 dispatched to Indiranagar Store', time: '2h ago', link: '/inventory/transfers' },
  ];

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur border-b border-slate-200 px-6 flex items-center justify-between shadow-xs">
      {/* Left section */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-lg tracking-wider shadow-md shadow-blue-500/20">
            R
          </div>
          <div>
            <span className="font-extrabold text-slate-900 tracking-tight text-base leading-none block">
              RIMS<span className="text-blue-600">.</span>
            </span>
            <span className="text-[10px] font-semibold tracking-wider uppercase text-slate-400 block leading-tight">
              XYZ Retail Corp
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center ml-6 px-3 py-1.5 bg-slate-100 rounded-lg text-slate-500 text-xs gap-2">
          <Search className="w-3.5 h-3.5" />
          <span>Press <kbd className="font-mono bg-white border border-slate-200 px-1.5 py-0.5 rounded text-[10px] shadow-2xs font-semibold text-slate-700">Ctrl + K</kbd> to search</span>
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3">
        {/* Environment Badge */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          PRG_RIMS_001 • v1.0.0
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in-50 zoom-in-95">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Notifications</span>
                <span className="text-[10px] font-semibold text-blue-600 cursor-pointer hover:underline">Mark all read</span>
              </div>
              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <Link
                    key={n.id}
                    to={n.link}
                    onClick={() => setShowNotifications(false)}
                    className="p-3.5 block hover:bg-slate-50 transition-colors"
                  >
                    <p className="text-xs font-semibold text-slate-800">{n.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{n.desc}</p>
                    <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 p-1.5 pl-2 hover:bg-slate-100 rounded-xl transition-colors text-left"
          >
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-semibold text-xs flex items-center justify-center">
              {user?.firstName?.charAt(0) || 'U'}
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-bold text-slate-800 leading-none">
                {user ? `${user.firstName} ${user.lastName}` : 'Guest User'}
              </p>
              <p className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider mt-0.5">
                {user?.roles?.[0]?.replace('ROLE_', '') || 'STAFF'}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in-50 zoom-in-95">
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-800">{user?.username}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
              </div>
              <div className="py-1">
                <Link
                  to="/admin/profile"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                >
                  <UserIcon className="w-4 h-4" /> User Profile
                </Link>
                <Link
                  to="/admin/settings"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                >
                  <Shield className="w-4 h-4" /> System Settings
                </Link>
              </div>
              <div className="border-t border-slate-100 pt-1">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

