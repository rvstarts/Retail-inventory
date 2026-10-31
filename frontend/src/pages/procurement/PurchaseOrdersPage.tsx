import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { mockPurchaseOrders, mockSuppliers, mockWarehouses, mockProducts } from '../../api/mockData';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../context/ToastContext';
import {
  FileSpreadsheet,
  PlusCircle,
  Search,
  Filter,
  CheckCircle2,
  PackageCheck,
  Eye,
  Clock,
  ArrowRight,
} from 'lucide-react';

export const PurchaseOrdersPage: React.FC = () => {
  const [purchaseOrders, setPurchaseOrders] = useState<any[]>(mockPurchaseOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    supplierName: mockSuppliers[0].name,
    warehouseName: mockWarehouses[0].name,
    expectedDeliveryDate: '2026-11-08',
    sku: mockProducts[0].sku,
    productName: mockProducts[0].name,
    quantity: 50,
    unitCost: mockProducts[0].costPrice,
    notes: 'Replenishment order for high-demand retail items.',
  });

  const filtered = purchaseOrders.filter((po) => {
    const matchesSearch =
      po.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.supplierName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || po.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreatePO = (e: React.FormEvent) => {
    e.preventDefault();
    const newPO = {
      id: String(Date.now()),
      poNumber: `PO-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      supplierName: formData.supplierName,
      warehouseName: formData.warehouseName,
      expectedDeliveryDate: formData.expectedDeliveryDate,
      totalAmount: formData.quantity * formData.unitCost,
      status: 'APPROVED',
      orderDate: new Date().toISOString(),
      items: [
        {
          productName: formData.productName,
          sku: formData.sku,
          quantityOrdered: formData.quantity,
          quantityReceived: 0,
          unitCost: formData.unitCost,
        },
      ],
    };

    setPurchaseOrders([newPO, ...purchaseOrders]);
    addToast('success', 'Purchase Order Issued', `${newPO.poNumber} sent to ${formData.supplierName}.`);
    setIsModalOpen(false);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-blue-600" /> Procurement Purchase Orders (POs)
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Manage vendor replenishment orders, approvals, delivery schedules, and inbound receiving.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 shadow-xs"
        >
          <PlusCircle className="w-4 h-4" /> Issue Purchase Order
        </Button>
      </div>

      {/* Filter / Search Bar */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by PO #, Supplier Name..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All PO Statuses</option>
              <option value="DRAFT">DRAFT</option>
              <option value="SUBMITTED">SUBMITTED</option>
              <option value="APPROVED">APPROVED</option>
              <option value="PARTIALLY_RECEIVED">PARTIALLY_RECEIVED</option>
              <option value="RECEIVED">RECEIVED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 uppercase font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">PO #</th>
                <th className="py-3 px-3">Supplier Vendor</th>
                <th className="py-3 px-3">Target Warehouse</th>
                <th className="py-3 px-3">Expected Date</th>
                <th className="py-3 px-3 text-right">PO Valuation</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.map((po) => (
                <tr key={po.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-blue-600">{po.poNumber}</td>
                  <td className="py-3 px-3 font-semibold text-slate-900">{po.supplierName}</td>
                  <td className="py-3 px-3 text-slate-700">{po.warehouseName}</td>
                  <td className="py-3 px-3 font-mono text-[11px] text-slate-500">
                    {po.expectedDeliveryDate}
                  </td>
                  <td className="py-3 px-3 text-right font-black text-slate-900">
                    {formatCurrency(po.totalAmount)}
                  </td>
                  <td className="py-3 px-3">
                    <Badge
                      variant={
                        po.status === 'RECEIVED'
                          ? 'success'
                          : po.status === 'PARTIALLY_RECEIVED'
                          ? 'warning'
                          : po.status === 'APPROVED'
                          ? 'info'
                          : 'neutral'
                      }
                    >
                      {po.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {['APPROVED', 'PARTIALLY_RECEIVED'].includes(po.status) ? (
                      <Link to={`/purchase-orders/receive/${po.id}`}>
                        <Button size="sm" variant="primary" className="text-xs bg-emerald-600 hover:bg-emerald-700 flex items-center gap-1">
                          <PackageCheck className="w-3.5 h-3.5" /> Receive Stock
                        </Button>
                      </Link>
                    ) : (
                      <span className="text-[11px] text-emerald-600 font-bold flex items-center justify-end gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Complete
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Create PO Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Issue Vendor Purchase Order">
        <form onSubmit={handleCreatePO} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Supplier Vendor *
              </label>
              <select
                value={formData.supplierName}
                onChange={(e) => setFormData({ ...formData, supplierName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-blue-500"
              >
                {mockSuppliers.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Receiving Warehouse *
              </label>
              <select
                value={formData.warehouseName}
                onChange={(e) => setFormData({ ...formData, warehouseName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-blue-500"
              >
                {mockWarehouses.map((w) => (
                  <option key={w.id} value={w.name}>
                    {w.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Product SKU to Procure *
              </label>
              <select
                value={formData.sku}
                onChange={(e) => {
                  const p = mockProducts.find((item) => item.sku === e.target.value);
                  setFormData({
                    ...formData,
                    sku: e.target.value,
                    productName: p?.name || '',
                    unitCost: p?.costPrice || formData.unitCost,
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
                Order Quantity (Units) *
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
                Agreed Unit Cost (₹) *
              </label>
              <input
                type="number"
                min="1"
                step="0.01"
                required
                value={formData.unitCost}
                onChange={(e) => setFormData({ ...formData, unitCost: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Expected Delivery Date *
              </label>
              <input
                type="date"
                required
                value={formData.expectedDeliveryDate}
                onChange={(e) => setFormData({ ...formData, expectedDeliveryDate: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Procurement Notes / Terms
              </label>
              <textarea
                rows={2}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium"
              />
            </div>
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between text-xs">
            <span className="font-semibold text-blue-900">Total Purchase Commitment:</span>
            <span className="font-black text-blue-900 text-sm">
              {formatCurrency(formData.quantity * formData.unitCost)}
            </span>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Approve & Issue PO
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

