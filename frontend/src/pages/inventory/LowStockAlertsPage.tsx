import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { AlertTriangle, PlusCircle, ArrowRight, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const LowStockAlertsPage: React.FC = () => {
  const lowStockItems = [
    {
      id: '1',
      name: 'Eureka Forbes Robot Vacuum',
      sku: 'HOM-VAC-004',
      category: 'Home Goods',
      currentStock: 8,
      minStock: 10,
      reorderPoint: 15,
      deficit: 12,
      supplier: 'Eureka Forbes Ltd',
      leadTimeDays: 4,
      costPrice: 9500,
    },
    {
      id: '2',
      name: 'Philips Air Fryer XL HD9252',
      sku: 'HOM-AF-006',
      category: 'Home Goods',
      currentStock: 12,
      minStock: 15,
      reorderPoint: 20,
      deficit: 18,
      supplier: 'Philips India Domestic Appliances',
      leadTimeDays: 3,
      costPrice: 4200,
    },
    {
      id: '3',
      name: 'Sony WH-1000XM5 Noise Cancelling Headphones',
      sku: 'ELE-AUD-002',
      category: 'Electronics',
      currentStock: 14,
      minStock: 15,
      reorderPoint: 25,
      deficit: 20,
      supplier: 'Sony India Pvt Ltd',
      leadTimeDays: 5,
      costPrice: 19500,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-amber-500" /> Automated Low Stock & Stockout Alerts
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Proactive replenishment system identifying inventory breaches below safety thresholds.
          </p>
        </div>

        <Link to="/purchase-orders">
          <Button variant="primary" size="sm" className="flex items-center gap-1.5 shadow-xs">
            <PlusCircle className="w-4 h-4" /> Bulk Purchase Order Generation
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-rose-50/60 border-rose-200">
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 block">Critical SKUs</span>
          <h3 className="text-2xl font-black text-rose-900 mt-1">3 Products</h3>
          <p className="text-xs text-rose-700 mt-0.5">Below configured reorder threshold</p>
        </Card>

        <Card className="p-4 bg-emerald-50/60 border-emerald-200">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 block">Zero Stockouts</span>
          <h3 className="text-2xl font-black text-emerald-900 mt-1">0 Items</h3>
          <p className="text-xs text-emerald-700 mt-0.5">Objective 2 target met (Stockouts reduced by 25%)</p>
        </Card>

        <Card className="p-4 bg-blue-50/60 border-blue-200">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 block">Avg Vendor Lead Time</span>
          <h3 className="text-2xl font-black text-blue-900 mt-1">3.8 Days</h3>
          <p className="text-xs text-blue-700 mt-0.5">Sufficient to prevent stock exhaustion</p>
        </Card>
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 uppercase font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Product / SKU</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3 text-center">Current Stock</th>
                <th className="py-3 px-3 text-center">Safety Reorder Point</th>
                <th className="py-3 px-3 text-center">Recommended PO Qty</th>
                <th className="py-3 px-3">Primary Supplier</th>
                <th className="py-3 px-4 text-right">Procurement Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {lowStockItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{item.name}</div>
                    <div className="font-mono text-[11px] text-blue-600 font-semibold">{item.sku}</div>
                  </td>
                  <td className="py-3 px-3 text-slate-600 font-medium">{item.category}</td>
                  <td className="py-3 px-3 text-center">
                    <span className="font-black text-rose-600 text-sm px-2 py-0.5 bg-rose-50 rounded border border-rose-200">
                      {item.currentStock} Units
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center font-bold text-slate-700">
                    {item.reorderPoint} Units
                  </td>
                  <td className="py-3 px-3 text-center font-bold text-blue-600">
                    +{item.deficit} Units
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-800">{item.supplier}</div>
                    <div className="text-[10px] text-slate-400">Lead time: {item.leadTimeDays} days</div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link to={`/purchase-orders?autoSku=${item.sku}`}>
                      <Button variant="primary" size="sm" className="text-xs">
                        Create PO <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    </Link>
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

