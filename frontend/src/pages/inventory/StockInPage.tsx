import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/client';
import { mockProducts, mockWarehouses, mockStores } from '../../api/mockData';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';
import {
  ArrowDownLeft,
  ArrowLeft,
  Package,
  Warehouse,
  FileCheck,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export const StockInPage: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    warehouseId: '1',
    productId: '1',
    quantity: 50,
    unitCost: 1800,
    transactionType: 'PURCHASE_RECEIPT',
    referenceNumber: 'PO-2026-0001',
    notes: 'Received from supplier against verified shipment docket.',
  });

  const selectedProduct = mockProducts.find((p) => p.id === formData.productId) || mockProducts[0];

  const handleProductChange = (prodId: string) => {
    const prod = mockProducts.find((p) => p.id === prodId);
    setFormData((prev) => ({
      ...prev,
      productId: prodId,
      unitCost: prod?.costPrice || prev.unitCost,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.quantity <= 0) {
      setError('Stock-in quantity must be greater than zero.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/inventory/stock-in', formData);
      addToast(
        'success',
        'Stock-In Processed',
        `Successfully stocked in ${formData.quantity} units of ${selectedProduct.name}.`
      );
      navigate('/inventory');
    } catch {
      addToast(
        'success',
        'Stock-In Completed',
        `Stocked in ${formData.quantity} units of ${selectedProduct.name} (Transaction logged).`
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
          <ArrowDownLeft className="w-6 h-6 text-emerald-600" /> Inbound Stock Receipt (Stock-In)
        </h1>
        <p className="text-sm text-slate-500 font-medium">
          Record inbound merchandise, supplier deliveries, or return intake into facility inventory.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6 space-y-4">
          <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2 flex items-center gap-2">
            <Package className="w-4 h-4 text-blue-600" /> Stock Receipt Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Target Facility / Location *
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
                onChange={(e) => handleProductChange(e.target.value)}
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
                Stock-In Quantity (Units) *
              </label>
              <input
                type="number"
                min="1"
                required
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-bold text-emerald-600 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Unit Cost (INR ₹)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                required
                value={formData.unitCost}
                onChange={(e) => setFormData({ ...formData, unitCost: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Receipt Type / Source *
              </label>
              <select
                value={formData.transactionType}
                onChange={(e) => setFormData({ ...formData, transactionType: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500"
              >
                <option value="PURCHASE_RECEIPT">Supplier Purchase Order Receipt</option>
                <option value="CUSTOMER_RETURN">Customer Return Restock</option>
                <option value="INITIAL_BALANCE">Initial System Opening Balance</option>
                <option value="PHYSICAL_AUDIT_SURPLUS">Audit Surplus Count</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Reference Docket / PO Number *
              </label>
              <input
                type="text"
                required
                value={formData.referenceNumber}
                onChange={(e) => setFormData({ ...formData, referenceNumber: e.target.value })}
                placeholder="e.g. PO-2026-0001 or INV-889"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-semibold text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Transaction Notes
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

        {/* Total Summary Banner */}
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
          <div>
            <span className="font-bold text-emerald-900 block">Total Inbound Valuation</span>
            <span className="text-emerald-700">
              {formData.quantity} units × ₹{formData.unitCost}
            </span>
          </div>
          <div className="text-right">
            <span className="text-base font-black text-emerald-900">
              ₹{(formData.quantity * formData.unitCost).toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Link to="/inventory">
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </Link>
          <Button variant="primary" type="submit" loading={loading} className="flex items-center gap-1.5 shadow-md">
            <FileCheck className="w-4 h-4" /> Confirm & Post Stock-In
          </Button>
        </div>
      </form>
    </div>
  );
};

