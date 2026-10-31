import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Layers,
  Warehouse,
  Store,
  Boxes,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  History,
  AlertTriangle,
  ShoppingCart,
  PlusCircle,
  Truck,
  RotateCcw,
  Users2,
  FileSpreadsheet,
  ScanBarcode,
  Radio,
  BarChart3,
  FileText,
  UserCheck,
  ShieldAlert,
  Cpu,
  ScrollText,
  Settings,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  collapsed?: boolean;
}

interface NavItem {
  name: string;
  path: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
  roles?: string[];
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed = false }) => {
  const { user } = useAuth();

  const userRoles = user?.roles || ['SUPER_ADMIN'];
  const hasRole = (allowedRoles?: string[]) => {
    if (!allowedRoles || allowedRoles.length === 0) return true;
    if (userRoles.includes('ROLE_SUPER_ADMIN') || userRoles.includes('SUPER_ADMIN')) return true;
    return allowedRoles.some(r => userRoles.includes(r) || userRoles.includes(`ROLE_${r}`));
  };

  const navigation: NavSection[] = [
    {
      title: 'Core',
      items: [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      title: 'Catalog (Epic 1)',
      items: [
        { name: 'Products', path: '/products', icon: Package },
        { name: 'New Product', path: '/products/new', icon: PlusCircle, roles: ['SUPER_ADMIN', 'ADMIN', 'INVENTORY_STAFF'] },
        { name: 'Categories', path: '/categories', icon: Layers },
      ],
    },
    {
      title: 'Inventory & Stock (Epic 2)',
      items: [
        { name: 'Stock Overview', path: '/inventory', icon: Boxes },
        { name: 'Stock-In', path: '/inventory/stock-in', icon: ArrowDownLeft, roles: ['SUPER_ADMIN', 'ADMIN', 'WAREHOUSE_MANAGER', 'INVENTORY_STAFF'] },
        { name: 'Stock-Out', path: '/inventory/stock-out', icon: ArrowUpRight, roles: ['SUPER_ADMIN', 'ADMIN', 'WAREHOUSE_MANAGER', 'INVENTORY_STAFF'] },
        { name: 'Transfers', path: '/inventory/transfers', icon: ArrowLeftRight },
        { name: 'Stock Ledger', path: '/inventory/transactions', icon: History },
        { name: 'Low Stock Alerts', path: '/inventory/low-stock', icon: AlertTriangle, badge: '3', badgeColor: 'bg-rose-500 text-white' },
      ],
    },
    {
      title: 'Locations (Epic 2)',
      items: [
        { name: 'Warehouses', path: '/warehouses', icon: Warehouse },
        { name: 'Retail Stores', path: '/stores', icon: Store },
      ],
    },
    {
      title: 'Orders & Fulfillment (Epic 3)',
      items: [
        { name: 'Sales Orders', path: '/orders', icon: ShoppingCart, badge: '5', badgeColor: 'bg-blue-600 text-white' },
        { name: 'Create Order', path: '/orders/new', icon: PlusCircle, roles: ['SUPER_ADMIN', 'ADMIN', 'STORE_MANAGER', 'SALES_STAFF'] },
        { name: 'Fulfillment Center', path: '/orders/fulfillment', icon: Truck },
        { name: 'Returns & Restock', path: '/orders/returns', icon: RotateCcw },
      ],
    },
    {
      title: 'Procurement (Epic 4)',
      items: [
        { name: 'Suppliers', path: '/suppliers', icon: Users2 },
        { name: 'Purchase Orders', path: '/purchase-orders', icon: FileSpreadsheet },
      ],
    },
    {
      title: 'Scanning & RFID (Epic 5)',
      items: [
        { name: 'Barcode Scanner', path: '/tracking/barcode', icon: ScanBarcode },
        { name: 'Simulated RFID Gate', path: '/tracking/rfid', icon: Radio },
      ],
    },
    {
      title: 'Analytics & Reports (Epic 6)',
      items: [
        { name: 'Analytics Hub', path: '/analytics', icon: BarChart3 },
        { name: '10 Enterprise Reports', path: '/reports', icon: FileText },
      ],
    },
    {
      title: 'Administration (Epic 7 & 8)',
      items: [
        { name: 'User Management', path: '/admin/users', icon: UserCheck, roles: ['SUPER_ADMIN', 'ADMIN'] },
        { name: 'Roles & RBAC', path: '/admin/roles', icon: ShieldAlert, roles: ['SUPER_ADMIN', 'ADMIN'] },
        { name: 'ERP / Tally Integrations', path: '/admin/integrations', icon: Cpu, roles: ['SUPER_ADMIN', 'ADMIN'] },
        { name: 'Audit Trail Logs', path: '/admin/audit-logs', icon: ScrollText, roles: ['SUPER_ADMIN', 'ADMIN', 'ANALYST'] },
        { name: 'System Settings', path: '/admin/settings', icon: Settings, roles: ['SUPER_ADMIN', 'ADMIN'] },
      ],
    },
  ];

  return (
    <aside
      className={`bg-slate-900 text-slate-300 border-r border-slate-800 transition-all duration-300 ease-in-out flex flex-col shrink-0 ${
        collapsed ? 'w-20' : 'w-64'
      } h-screen sticky top-0 z-40 select-none shadow-xl`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center px-5 border-b border-slate-800 gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-extrabold text-lg shadow-md shadow-blue-500/30 shrink-0">
          R
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="font-extrabold text-white text-base tracking-tight leading-none">
              RIMS <span className="text-blue-400 font-semibold text-xs ml-1 px-1.5 py-0.5 bg-blue-900/50 rounded border border-blue-700/40">PRO</span>
            </h1>
            <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">
              XYZ Retail Corporation
            </p>
          </div>
        )}
      </div>

      {/* Navigation Scroll */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        {navigation.map((section) => {
          const visibleItems = section.items.filter((item) => hasRole(item.roles));
          if (visibleItems.length === 0) return null;

          return (
            <div key={section.title} className="space-y-1">
              {!collapsed && (
                <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {section.title}
                </div>
              )}
              {visibleItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all group relative ${
                        isActive
                          ? 'bg-blue-600 text-white font-semibold shadow-sm shadow-blue-600/40'
                          : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                      } ${collapsed ? 'justify-center px-0' : ''}`
                    }
                    title={collapsed ? item.name : undefined}
                  >
                    <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-105" />
                    {!collapsed && <span className="truncate flex-1">{item.name}</span>}
                    {!collapsed && item.badge && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none ${
                          item.badgeColor || 'bg-slate-700 text-slate-300'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    {collapsed && item.badge && (
                      <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-rose-500" />
                    )}
                  </NavLink>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Footer Profile Mini */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
        <div className={`flex items-center gap-3 px-2 py-1.5 rounded-lg ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 rounded-lg bg-blue-900/60 border border-blue-700/60 text-blue-300 flex items-center justify-center font-bold text-xs shrink-0">
            {user?.fullName?.charAt(0) || 'U'}
          </div>
          {!collapsed && (
            <div className="overflow-hidden flex-1">
              <p className="text-xs font-semibold text-white truncate">{user?.fullName || 'User'}</p>
              <p className="text-[10px] text-slate-400 truncate capitalize">{user?.roles?.[0]?.replace('ROLE_', '').toLowerCase().replace('_', ' ') || 'User'}</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

