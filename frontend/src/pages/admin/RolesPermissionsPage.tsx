import React from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Shield, Check, X, ShieldAlert, Lock } from 'lucide-react';

export const RolesPermissionsPage: React.FC = () => {
  const permissions = [
    { name: 'Product Catalog (CRUD, CSV Import)', key: 'catalog' },
    { name: 'Multi-Location Stock Visibility', key: 'view_stock' },
    { name: 'Stock Adjustments & Write-Offs', key: 'adjust_stock' },
    { name: 'Inter-Facility Transfers Dispatch', key: 'transfers' },
    { name: 'Customer Sales Order Processing', key: 'orders' },
    { name: 'Warehouse Fulfillment (Pick/Pack/Ship)', key: 'fulfillment' },
    { name: 'Supplier PO Creation & Receipt', key: 'procurement' },
    { name: 'Barcode & RFID Operations', key: 'tracking' },
    { name: 'Executive Analytics & 10 Reports', key: 'analytics' },
    { name: 'User & System Administration', key: 'admin' },
    { name: 'SAP ERP & Tally Prime Sync', key: 'integrations' },
  ];

  const roles = [
    { name: 'SUPER_ADMIN', desc: 'Unrestricted enterprise control & root privileges', perms: ['catalog', 'view_stock', 'adjust_stock', 'transfers', 'orders', 'fulfillment', 'procurement', 'tracking', 'analytics', 'admin', 'integrations'] },
    { name: 'ADMIN', desc: 'Store & warehouse configuration, user management', perms: ['catalog', 'view_stock', 'adjust_stock', 'transfers', 'orders', 'fulfillment', 'procurement', 'tracking', 'analytics', 'admin', 'integrations'] },
    { name: 'WAREHOUSE_MANAGER', desc: 'Central logistics hub dispatch & inbound receiving', perms: ['catalog', 'view_stock', 'adjust_stock', 'transfers', 'fulfillment', 'tracking', 'analytics'] },
    { name: 'STORE_MANAGER', desc: 'Retail store sales, local inventory & restock orders', perms: ['view_stock', 'transfers', 'orders', 'tracking', 'analytics'] },
    { name: 'INVENTORY_STAFF', desc: 'Cycle counting, shelf stocking & barcode scanning', perms: ['view_stock', 'adjust_stock', 'transfers', 'tracking'] },
    { name: 'PROCUREMENT_MANAGER', desc: 'Vendor management & purchase order execution', perms: ['view_stock', 'procurement', 'analytics'] },
    { name: 'SALES_STAFF', desc: 'Customer order entry & checkout operations', perms: ['view_stock', 'orders', 'tracking'] },
    { name: 'ANALYST', desc: 'Read-only financial audits, reports & KPI telemetry', perms: ['view_stock', 'analytics'] },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
          <Shield className="w-6 h-6 text-blue-600" /> Role-Based Access Control (RBAC) Matrix
        </h1>
        <p className="text-sm text-slate-500 font-medium">
          Strict authorization boundaries across the 8 enterprise functional personas.
        </p>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 min-w-[220px]">Capability / Module</th>
                {roles.map((r) => (
                  <th key={r.name} className="py-3 px-2 text-center text-[10px] uppercase font-mono tracking-wider">
                    {r.name.replace('_', ' ')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {permissions.map((p) => (
                <tr key={p.key} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-4 font-semibold text-slate-900">{p.name}</td>
                  {roles.map((r) => {
                    const hasPerm = r.perms.includes(p.key);
                    return (
                      <td key={r.name} className="py-2.5 px-2 text-center">
                        {hasPerm ? (
                          <div className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-50 text-emerald-600">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        ) : (
                          <div className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-50 text-slate-300">
                            <X className="w-3 h-3" />
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

