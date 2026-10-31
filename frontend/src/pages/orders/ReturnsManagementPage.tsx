import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useToast } from '../../context/ToastContext';
import {
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Package,
  Search,
  Filter,
} from 'lucide-react';

export const ReturnsManagementPage: React.FC = () => {
  const { addToast } = useToast();
  const [returns, setReturns] = useState<any[]>([
    {
      id: 'RET-2026-001',
      orderNumber: 'ORD-2026-0004',
      customerName: 'Kavita Iyer',
      productName: 'Raymond Men Slim Fit Suit',
      sku: 'APP-SUIT-001',
      quantity: 1,
      reason: 'Size exchange needed (Too small)',
      inspectionCondition: 'RESTOCKABLE',
      refundStatus: 'PENDING_RESTOCK',
      location: 'Connaught Place Store',
    },
    {
      id: 'RET-2026-002',
      orderNumber: 'ORD-2026-0002',
      customerName: 'Priya Patel',
      productName: 'Philips Air Fryer HD9252/90',
      sku: 'HOM-AF-006',
      quantity: 1,
      reason: 'Dented packaging during transit',
      inspectionCondition: 'DAMAGED',
      refundStatus: 'REFUND_APPROVED',
      location: 'Central Distribution (BOM)',
    },
  ]);

  const handleRestock = (returnId: string) => {
    setReturns(
      returns.map((r) =>
        r.id === returnId
          ? { ...r, refundStatus: 'RESTOCKED_AND_REFUNDED' }
          : r
      )
    );
    addToast(
      'success',
      'Inventory Restocked',
      'Item verified and credited back to sellable store stock. Customer refund initiated.'
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
            <RotateCcw className="w-6 h-6 text-blue-600" /> Customer Returns & Restock Management
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Quality inspection workflow: safely return undamaged items to active inventory and audit write-offs.
          </p>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 uppercase font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Return ID / Order #</th>
                <th className="py-3 px-3">Customer</th>
                <th className="py-3 px-3">Product / SKU</th>
                <th className="py-3 px-3">Reason</th>
                <th className="py-3 px-3">Inspection Status</th>
                <th className="py-3 px-3">Refund & Stock Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {returns.map((ret) => (
                <tr key={ret.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-slate-900">{ret.id}</span>
                    <div className="font-mono text-[10px] text-blue-600 font-semibold">{ret.orderNumber}</div>
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-800">{ret.customerName}</td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-800">{ret.productName}</div>
                    <div className="font-mono text-[10px] text-slate-400">{ret.sku} (Qty: {ret.quantity})</div>
                  </td>
                  <td className="py-3 px-3 text-slate-600">{ret.reason}</td>
                  <td className="py-3 px-3">
                    <Badge variant={ret.inspectionCondition === 'RESTOCKABLE' ? 'success' : 'danger'}>
                      {ret.inspectionCondition}
                    </Badge>
                  </td>
                  <td className="py-3 px-3">
                    <Badge
                      variant={
                        ret.refundStatus === 'RESTOCKED_AND_REFUNDED'
                          ? 'success'
                          : ret.refundStatus === 'REFUND_APPROVED'
                          ? 'info'
                          : 'warning'
                      }
                    >
                      {ret.refundStatus}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {ret.inspectionCondition === 'RESTOCKABLE' &&
                    ret.refundStatus === 'PENDING_RESTOCK' ? (
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleRestock(ret.id)}
                        className="text-xs bg-emerald-600 hover:bg-emerald-700"
                      >
                        Restock to Inventory
                      </Button>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-medium">Processed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

