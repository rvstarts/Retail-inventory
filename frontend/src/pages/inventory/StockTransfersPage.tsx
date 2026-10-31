import React, { useState } from 'react';
import { mockTransfers, mockProducts, mockWarehouses, mockStores } from '../../api/mockData';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../context/ToastContext';
import {
  ArrowLeftRight,
  PlusCircle,
  Truck,
  CheckCircle2,
  Clock,
  Warehouse,
  Store,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';

export const StockTransfersPage: React.FC = () => {
  const [transfers, setTransfers] = useState<any[]>(mockTransfers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    sourceLocation: 'Central Distribution (BOM)',
    targetLocation: 'Indiranagar Flagship Store',
    productName: 'Fabindia Cotton Kurta',
    sku: 'APP-KRT-003',
    quantity: 30,
    vehicleNumber: 'KA-01-MJ-4412',
    notes: 'Urgent weekend retail stock replenishment.',
  });

  const handleCreateTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const newTrf = {
      id: String(Date.now()),
      transferNumber: `TRF-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      ...formData,
      status: 'REQUESTED',
      createdAt: new Date().toISOString(),
    };
    setTransfers([newTrf, ...transfers]);
    addToast('success', 'Transfer Created', `Transfer ${newTrf.transferNumber} initialized.`);
    setIsModalOpen(false);
  };

  const handleUpdateStatus = (trfId: string, nextStatus: string) => {
    setTransfers(
      transfers.map((t) => (t.id === trfId ? { ...t, status: nextStatus } : t))
    );
    if (nextStatus === 'IN_TRANSIT') {
      addToast('info', 'Dispatched', 'Stock deducted from source and marked in-transit.');
    } else if (nextStatus === 'COMPLETED') {
      addToast('success', 'Transfer Received', 'Stock credited to destination inventory ledger.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
            <ArrowLeftRight className="w-6 h-6 text-blue-600" /> Inter-Facility Stock Transfers
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Atomic inventory movements between central warehouses and 500+ retail stores.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 shadow-xs"
        >
          <PlusCircle className="w-4 h-4" /> New Transfer Order
        </Button>
      </div>

      {/* Transfers Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 uppercase font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Transfer #</th>
                <th className="py-3 px-3">Route (Origin → Destination)</th>
                <th className="py-3 px-3">Product / SKU</th>
                <th className="py-3 px-3 text-center">Qty</th>
                <th className="py-3 px-3">Tracking / Vehicle</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {transfers.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-blue-600">{t.transferNumber}</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5 text-slate-800 font-semibold">
                      <span>{t.sourceLocation}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-blue-600">{t.targetLocation}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900">{t.productName}</div>
                    <div className="font-mono text-[10px] text-slate-500">{t.sku}</div>
                  </td>
                  <td className="py-3 px-3 text-center font-black text-slate-800 text-sm">
                    {t.quantity}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-600 text-[11px]">
                    {t.vehicleNumber || 'Standard Logistics'}
                  </td>
                  <td className="py-3 px-3">
                    <Badge
                      variant={
                        t.status === 'COMPLETED'
                          ? 'success'
                          : t.status === 'IN_TRANSIT'
                          ? 'warning'
                          : 'info'
                      }
                    >
                      {t.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {t.status === 'REQUESTED' && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleUpdateStatus(t.id, 'IN_TRANSIT')}
                          className="text-[11px] py-1 px-2.5 h-auto flex items-center gap-1"
                        >
                          <Truck className="w-3.5 h-3.5 text-blue-600" /> Dispatch
                        </Button>
                      )}
                      {t.status === 'IN_TRANSIT' && (
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => handleUpdateStatus(t.id, 'COMPLETED')}
                          className="text-[11px] py-1 px-2.5 h-auto flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Receive & Restock
                        </Button>
                      )}
                      {t.status === 'COMPLETED' && (
                        <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Reconciled
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Create Transfer Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Initiate Stock Transfer Order">
        <form onSubmit={handleCreateTransfer} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Source Location (Origin) *
              </label>
              <select
                value={formData.sourceLocation}
                onChange={(e) => setFormData({ ...formData, sourceLocation: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-blue-500"
              >
                {mockWarehouses.map((w) => (
                  <option key={w.id} value={w.name}>
                    {w.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Destination (Retail Store / WH) *
              </label>
              <select
                value={formData.targetLocation}
                onChange={(e) => setFormData({ ...formData, targetLocation: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-blue-500"
              >
                {mockStores.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Select Product to Transfer *
              </label>
              <select
                value={formData.sku}
                onChange={(e) => {
                  const p = mockProducts.find((item) => item.sku === e.target.value);
                  setFormData({
                    ...formData,
                    sku: e.target.value,
                    productName: p?.name || '',
                  });
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-blue-500"
              >
                {mockProducts.map((p) => (
                  <option key={p.id} value={p.sku}>
                    {p.name} ({p.sku})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Transfer Quantity (Units) *
              </label>
              <input
                type="number"
                min="1"
                required
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Logistics Vehicle / Docket #
              </label>
              <input
                type="text"
                value={formData.vehicleNumber}
                onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                placeholder="e.g. MH-12-PQ-9081"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Transfer Notes
              </label>
              <textarea
                rows={2}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Create Transfer Order
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

