import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { mockPurchaseOrders } from '../../api/mockData';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useToast } from '../../context/ToastContext';
import {
  PackageCheck,
  ArrowLeft,
  Warehouse,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
} from 'lucide-react';

export const ReceivePurchaseOrderPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [po, setPo] = useState<any | null>(null);
  const [docketNumber, setDocketNumber] = useState('DN-89210-MUM');
  const [receivedQty, setReceivedQty] = useState(50);
  const [damagedQty, setDamagedQty] = useState(0);
  const [notes, setNotes] = useState('All boxes intact, barcode verified against manifest.');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const found = mockPurchaseOrders.find((p) => p.id === id || String(p.id) === String(id)) || mockPurchaseOrders[0];
    setPo(found);
    if (found && found.items?.[0]) {
      setReceivedQty(found.items[0].quantityOrdered - found.items[0].quantityReceived);
    }
  }, [id]);

  if (!po) return <div className="p-8 text-center text-slate-500">Loading Purchase Order...</div>;

  const item = po.items?.[0] || {
    productName: 'Raymond Men Slim Fit Suit',
    sku: 'APP-SUIT-001',
    quantityOrdered: 50,
    quantityReceived: 0,
    unitCost: 3800,
  };

  const handleConfirmReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    if (receivedQty <= 0) {
      addToast('error', 'Invalid Quantity', 'Received quantity must be greater than zero.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const isFull = item.quantityReceived + receivedQty >= item.quantityOrdered;
      addToast(
        'success',
        isFull ? 'PO Received in Full' : 'Partial Delivery Recorded',
        `Credited ${receivedQty} units of ${item.productName} into ${po.warehouseName}.`
      );
      navigate('/purchase-orders');
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <Link
          to="/purchase-orders"
          className="text-xs font-semibold text-slate-500 hover:text-blue-600 flex items-center gap-1 mb-1 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Purchase Orders
        </Link>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
          <PackageCheck className="w-6 h-6 text-emerald-600" /> Goods Inward Receipt (GRN)
        </h1>
        <p className="text-sm text-slate-500 font-medium">
          Verify physical delivery from vendor and automatically increase warehouse stock.
        </p>
      </div>

      <Card className="p-6 space-y-4">
        <div className="flex items-start justify-between border-b border-slate-100 pb-3">
          <div>
            <span className="font-mono font-bold text-blue-600 text-sm">{po.poNumber}</span>
            <h3 className="font-bold text-slate-900 text-base">{po.supplierName}</h3>
          </div>
          <Badge variant="info">{po.warehouseName}</Badge>
        </div>

        <form onSubmit={handleConfirmReceipt} className="space-y-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-400 block uppercase font-bold text-[10px]">Product / SKU</span>
              <span className="font-bold text-slate-900 text-sm">{item.productName}</span>
              <span className="font-mono text-blue-600 block text-[11px]">{item.sku}</span>
            </div>
            <div>
              <span className="text-slate-400 block uppercase font-bold text-[10px]">Order Status</span>
              <span className="text-slate-700">
                Ordered: <strong>{item.quantityOrdered}</strong> | Previously Received:{' '}
                <strong>{item.quantityReceived}</strong>
              </span>
              <span className="font-bold text-amber-600 block mt-0.5">
                Remaining to Receive: {item.quantityOrdered - item.quantityReceived} units
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Vendor Delivery Challan / Docket Number *
              </label>
              <input
                type="text"
                required
                value={docketNumber}
                onChange={(e) => setDocketNumber(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-bold text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Quantity Received (Units) *
              </label>
              <input
                type="number"
                min="1"
                max={item.quantityOrdered - item.quantityReceived}
                required
                value={receivedQty}
                onChange={(e) => setReceivedQty(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-bold text-emerald-600 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Damaged / Rejected Count
              </label>
              <input
                type="number"
                min="0"
                value={damagedQty}
                onChange={(e) => setDamagedQty(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-bold text-rose-600 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Receiving Notes / Quality Inspection Inspection
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              On confirmation, <strong>{receivedQty} units</strong> will be posted to the inventory ledger
              at <strong>{po.warehouseName}</strong>.
            </span>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Link to="/purchase-orders">
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </Link>
            <Button variant="primary" type="submit" loading={loading} className="flex items-center gap-1.5 shadow-md bg-emerald-600 hover:bg-emerald-700">
              <FileCheck className="w-4 h-4" /> Confirm & Credit Warehouse Stock
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

