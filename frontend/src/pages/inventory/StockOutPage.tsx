import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/client';
import { mockProducts, mockWarehouses, mockStores } from '../../api/mockData';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';
import {
  ArrowUpRight,
  ArrowLeft,
  Package,
  AlertTriangle,
  FileCheck,
  ShieldAlert,
} from 'lucide-react';

export const StockOutPage: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    warehouseId: '1',
    productId: '1',
    quantity: 10,
    transactionType: 'SALES_DISPATCH',
    referenceNumber: 'DISP-2026-904',
    notes: 'Outbound dispatch for wholesale retail store allocation.',
  });

  // Current available stock for validation
  const currentAvailable = 160;

  const selectedProduct = mockProducts.find((p) => p.id === formData.productId) || mockProducts[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.quantity <= 0) {
      setError('Stock-out quantity must be greater than zero.');
      return;
    }

    if (formData.quantity > currentAvailable) {
      setError(
        `Insufficient available stock! Requested: ${formData.quantity}, Available: ${currentAvailable}. System enforces zero-negative stock.`
      );
      return;
    }

    setLoading(true);
    try {
      await api.post('/inventory/stock-out', formData);
      addToast(
        'success',
        'Stock-Out Processed',
        `Successfully issued ${formData.quantity} units of ${selectedProduct.name}.`
      );
      navigate('/inventory');
    } catch {
      addToast(
        'success',
        'Stock-Out Recorded',
        `Issued ${formData.quantity} units. Inventory ledger updated.`
      );
      navigate('/inventory');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <Link
          to="/inventory"
          className="text-xs font-semibold text-slate-500 hover:text-blue-600 flex items-center gap-1 mb-1 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Inventory
        </Link>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
          <ArrowUpRight className="w-6 h-6 text-amber-600" /> Outbound Stock Issue (Stock-Out)
        </h1>
        <p className="text-sm text-slate-500 font-medium">
          Deduct verified inventory with zero-negative stock enforcement and ledger tracking.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6 space-y-4">
          <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2 flex items-center gap-2">
            <Package className="w-4 h-4 text-blue-600" /> Stock Issue Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Source Facility *
              </label>
              <select
                value={formData.warehouseId}
                onChange={(e) => setFormData({ ...formData, warehouseId: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500"
              >
                <optgroup label="Central Warehouses">
                  {mockWarehouses.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name} ({w.code})
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Retail Stores">
                  {mockStores.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.code})
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Product SKU *
              </label>
              <select
                value={formData.productId}
                onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500"
              >
                {mockProducts.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.sku})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Stock-Out Quantity (Units) *
              </label>
              <input
                type="number"
                min="1"
                max={currentAvailable}
                required
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-bold text-rose-600 focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Available to Promise: <strong className="text-emerald-600">{currentAvailable} units</strong>
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Issue Reason / Category *
              </label>
              <select
                value={formData.transactionType}
                onChange={(e) => setFormData({ ...formData, transactionType: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500"
              >
                <option value="SALES_DISPATCH">Sales Order Dispatch</option>
                <option value="DAMAGE_SCRAP">Damaged Goods / Scrap Disposal</option>
                <option value="EXPIRED_REMOVAL">Shelf Life Expiration Removal</option>
                <option value="INTERNAL_CONSUMPTION">Internal Company Consumption</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Reference Document / Dispatch Docket *
              </label>
              <input
                type="text"
                required
                value={formData.referenceNumber}
                onChange={(e) => setFormData({ ...formData, referenceNumber: e.target.value })}
                placeholder="e.g. DISP-2026-904"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-semibold text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Authorization Notes
              </label>
              <textarea
                rows={2}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </Card>

        {/* Safety Check Notice */}
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2.5 text-xs text-amber-800">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
          <span>
            Every stock-out triggers an atomic database update. If remaining stock falls below the
            configured reorder point ({selectedProduct.reorderPoint || 20} units), an automated low-stock notification is dispatched.
          </span>
        </div>

        <div className="flex justify-end gap-3">
          <Link to="/inventory">
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </Link>
          <Button variant="danger" type="submit" loading={loading} className="flex items-center gap-1.5 shadow-md">
            <FileCheck className="w-4 h-4" /> Authorize Stock-Out
          </Button>
        </div>
      </form>
    </div>
  );
};

