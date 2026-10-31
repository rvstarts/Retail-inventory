import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ScrollText, Search, ShieldCheck } from 'lucide-react';

export const AuditLogsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const auditLogs = [
    { id: 'AUD-8821', action: 'INVENTORY_STOCK_IN', entity: 'Product (HOM-AF-006)', user: 'wh_manager', ip: '192.168.1.45', timestamp: '2026-10-31 16:15:20', details: 'Added 50 units via PO-2026-0002 receipt' },
    { id: 'AUD-8822', action: 'ORDER_RESERVATION', entity: 'CustomerOrder (ORD-2026-0001)', user: 'sales_staff', ip: '192.168.1.88', timestamp: '2026-10-31 15:30:10', details: 'Reserved 2 units of APP-SUIT-001' },
    { id: 'AUD-8823', action: 'INTER_STORE_TRANSFER', entity: 'StockTransfer (TRF-2026-0001)', user: 'superadmin', ip: '192.168.1.10', timestamp: '2026-10-31 14:00:00', details: 'Transferred 30 units from BOM Hub to Indiranagar' },
    { id: 'AUD-8824', action: 'SECURITY_AUTH_LOGIN', entity: 'User (superadmin)', user: 'superadmin', ip: '192.168.1.10', timestamp: '2026-10-31 13:45:11', details: 'JWT authentication issued successfully' },
    { id: 'AUD-8825', action: 'PRICE_MODIFICATION', entity: 'Product (APP-BIB-005)', user: 'admin', ip: '192.168.1.12', timestamp: '2026-10-30 18:20:00', details: 'MSRP adjusted from ₹3,299 to ₹3,499' },
  ];

  const filtered = auditLogs.filter((l) => {
    return (
      l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.entity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.details.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
          <ScrollText className="w-6 h-6 text-blue-600" /> Security & Regulatory Audit Trail
        </h1>
        <p className="text-sm text-slate-500 font-medium">
          Non-repudiable audit logs of all security, inventory, and transaction alterations.
        </p>
      </div>

      <Card className="p-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Action, Entity, Operator, or Details..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 uppercase font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Audit ID / Timestamp</th>
                <th className="py-3 px-3">Action Signature</th>
                <th className="py-3 px-3">Target Entity</th>
                <th className="py-3 px-3">Operator User</th>
                <th className="py-3 px-3">Source IP</th>
                <th className="py-3 px-4">Audit Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-mono font-bold text-slate-900">{log.id}</div>
                    <div className="font-mono text-[10px] text-slate-400">{log.timestamp}</div>
                  </td>
                  <td className="py-3 px-3">
                    <Badge variant="info">{log.action}</Badge>
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-800">{log.entity}</td>
                  <td className="py-3 px-3 font-mono font-bold text-blue-600">{log.user}</td>
                  <td className="py-3 px-3 font-mono text-slate-500">{log.ip}</td>
                  <td className="py-3 px-4 text-slate-600">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

