import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { History, Search, Filter, Download, ArrowDownLeft, ArrowUpRight, ArrowLeftRight, CheckCircle2 } from 'lucide-react';

export const InventoryHistoryPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');

  const transactions = [
    { id: 'TXN-901', timestamp: '2026-10-31 16:20:10', type: 'STOCK_IN', sku: 'APP-SUIT-001', productName: 'Raymond Men Slim Fit Suit', location: 'Central Distribution (BOM)', quantityDelta: 50, prevBalance: 60, newBalance: 110, reference: 'PO-2026-0001', user: 'wh_manager' },
    { id: 'TXN-902', timestamp: '2026-10-31 14:15:32', type: 'STOCK_OUT', sku: 'ELE-TV-001', productName: 'Samsung 55" QLED 4K Smart TV', location: 'South Distribution (BLR)', quantityDelta: -4, prevBalance: 36, newBalance: 32, reference: 'ORD-2026-0003', user: 'sales_staff' },
    { id: 'TXN-903', timestamp: '2026-10-31 11:42:05', type: 'TRANSFER_IN', sku: 'APP-KRT-003', productName: 'Fabindia Cotton Kurta', location: 'Indiranagar Flagship Store', quantityDelta: 30, prevBalance: 15, newBalance: 45, reference: 'TRF-2026-0001', user: 'store_manager' },
    { id: 'TXN-904', timestamp: '2026-10-31 09:30:18', type: 'TRANSFER_OUT', sku: 'APP-KRT-003', productName: 'Fabindia Cotton Kurta', location: 'Central Distribution (BOM)', quantityDelta: -30, prevBalance: 210, newBalance: 180, reference: 'TRF-2026-0001', user: 'wh_manager' },
    { id: 'TXN-905', timestamp: '2026-10-30 17:55:00', type: 'ADJUSTMENT', sku: 'HOM-AF-006', productName: 'Philips Air Fryer HD9252/90', location: 'North Logistics Hub (DEL)', quantityDelta: -2, prevBalance: 14, newBalance: 12, reference: 'CYCLE-COUNT-AUDIT', user: 'superadmin' },
    { id: 'TXN-906', timestamp: '2026-10-30 13:10:44', type: 'RETURN_IN', sku: 'APP-BIB-005', productName: 'Biba Women Anarkali Suit', location: 'Connaught Place Store', quantityDelta: 1, prevBalance: 33, newBalance: 34, reference: 'RET-2026-0012', user: 'store_manager' },
  ];

  const filtered = transactions.filter((t) => {
    const matchesSearch =
      t.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.reference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'ALL' || t.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
            <History className="w-6 h-6 text-blue-600" /> Immutable Stock Transaction Ledger
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Cryptographically audited record of every physical and virtual inventory event.
          </p>
        </div>
      </div>

      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Product Name, SKU, Reference Docket..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Event Types</option>
              <option value="STOCK_IN">STOCK_IN (Receipt)</option>
              <option value="STOCK_OUT">STOCK_OUT (Dispatch)</option>
              <option value="TRANSFER_IN">TRANSFER_IN</option>
              <option value="TRANSFER_OUT">TRANSFER_OUT</option>
              <option value="ADJUSTMENT">ADJUSTMENT (Audit)</option>
              <option value="RETURN_IN">RETURN_IN</option>
            </select>
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 uppercase font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Txn # / Timestamp</th>
                <th className="py-3 px-3">Event Type</th>
                <th className="py-3 px-3">Product / SKU</th>
                <th className="py-3 px-3">Location</th>
                <th className="py-3 px-3 text-center">Delta</th>
                <th className="py-3 px-3 text-center">Balance Transition</th>
                <th className="py-3 px-3">Reference</th>
                <th className="py-3 px-4 text-right">User</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-mono font-bold text-slate-900">{t.id}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{t.timestamp}</div>
                  </td>
                  <td className="py-3 px-3">
                    <Badge
                      variant={
                        t.quantityDelta > 0
                          ? 'success'
                          : t.type === 'ADJUSTMENT'
                          ? 'warning'
                          : 'danger'
                      }
                    >
                      {t.type}
                    </Badge>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900">{t.productName}</div>
                    <div className="font-mono text-[10px] text-blue-600">{t.sku}</div>
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-700">{t.location}</td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`font-black text-sm px-2 py-0.5 rounded ${
                        t.quantityDelta > 0
                          ? 'text-emerald-700 bg-emerald-50'
                          : 'text-rose-700 bg-rose-50'
                      }`}
                    >
                      {t.quantityDelta > 0 ? `+${t.quantityDelta}` : t.quantityDelta}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center font-mono text-slate-600">
                    <span className="text-slate-400">{t.prevBalance}</span>
                    <span className="mx-1.5 text-slate-300">→</span>
                    <strong className="text-slate-900">{t.newBalance}</strong>
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] text-blue-600 font-semibold">
                    {t.reference}
                  </td>
                  <td className="py-3 px-4 text-right font-medium text-slate-600">{t.user}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

