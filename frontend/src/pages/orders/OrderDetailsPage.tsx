import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/client';
import { mockOrders } from '../../api/mockData';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useToast } from '../../context/ToastContext';
import {
  ShoppingCart,
  ArrowLeft,
  Truck,
  RotateCcw,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  User,
  ShieldAlert,
  FileText,
} from 'lucide-react';

export const OrderDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<any | null>(null);
  const { addToast } = useToast();

  useEffect(() => {
    const found = mockOrders.find((o) => o.id === id || String(o.id) === String(id)) || mockOrders[0];
    setOrder(found);
  }, [id]);

  if (!order) return <div className="p-8 text-center text-slate-500">Loading order details...</div>;

  const handleCancelOrder = () => {
    setOrder({ ...order, status: 'CANCELLED' });
    addToast('info', 'Order Cancelled', 'Reserved stock released back to available inventory.');
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const timelineSteps = [
    { label: 'Order Placed', status: 'PENDING', date: '2026-10-31 10:15', done: true },
    { label: 'Inventory Reserved', status: 'CONFIRMED', date: '2026-10-31 10:16', done: true },
    { label: 'Warehouse Processing', status: 'PROCESSING', date: '2026-10-31 11:30', done: order.status !== 'CONFIRMED' && order.status !== 'PENDING' },
    { label: 'Item Picked', status: 'PICKED', date: '2026-10-31 13:00', done: ['PICKED', 'PACKED', 'SHIPPED', 'DELIVERED'].includes(order.status) },
    { label: 'Packed & Barcoded', status: 'PACKED', date: '2026-10-31 14:15', done: ['PACKED', 'SHIPPED', 'DELIVERED'].includes(order.status) },
    { label: 'Dispatched / In-Transit', status: 'SHIPPED', date: '2026-10-31 15:45', done: ['SHIPPED', 'DELIVERED'].includes(order.status) },
    { label: 'Delivered', status: 'DELIVERED', date: 'Pending', done: order.status === 'DELIVERED' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link
            to="/orders"
            className="text-xs font-semibold text-slate-500 hover:text-blue-600 flex items-center gap-1 mb-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Orders
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black tracking-tight text-slate-900 font-mono">
              {order.orderNumber}
            </h1>
            <Badge
              variant={
                order.status === 'DELIVERED'
                  ? 'success'
                  : order.status === 'CANCELLED'
                  ? 'danger'
                  : 'info'
              }
            >
              {order.status}
            </Badge>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Placed on {new Date(order.orderDate).toLocaleString('en-IN')} • Payment Status:{' '}
            <strong className="text-emerald-600">PAID (PREPAID RAZORPAY)</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          {order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
            <Button variant="outline" size="sm" onClick={handleCancelOrder} className="text-rose-600 hover:bg-rose-50 border-rose-200">
              Cancel Order & Release Stock
            </Button>
          )}

          {['CONFIRMED', 'PROCESSING', 'PICKED', 'PACKED'].includes(order.status) && (
            <Link to={`/orders/fulfillment?orderId=${order.id}`}>
              <Button variant="primary" size="sm" className="flex items-center gap-1.5 shadow-xs">
                <Truck className="w-4 h-4" /> Open Fulfillment Wizard
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Fulfillment Status Stepper */}
      <Card className="p-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-6">
          Lifecycle & Fulfillment Stepper (Epic 3 Specification)
        </h3>
        <div className="flex flex-wrap items-center justify-between gap-2 relative">
          {timelineSteps.map((step, idx) => (
            <div key={idx} className="flex flex-col items-center text-center flex-1 min-w-[100px] z-10">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-2 transition-all ${
                  step.done
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                    : 'bg-slate-100 text-slate-400 border border-slate-300'
                }`}
              >
                {step.done ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
              </div>
              <span className={`text-xs font-bold ${step.done ? 'text-slate-900' : 'text-slate-400'}`}>
                {step.label}
              </span>
              <span className="text-[10px] text-slate-400 font-mono mt-0.5">{step.date}</span>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Line Items */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h3 className="font-bold text-slate-900 text-sm mb-4 pb-2 border-b border-slate-100">
              Ordered Line Items ({order.items?.length || 2})
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Product</th>
                    <th className="py-2.5 px-3 text-right">Unit Price</th>
                    <th className="py-2.5 px-3 text-center">Qty</th>
                    <th className="py-2.5 px-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {(order.items || [
                    { productName: 'Raymond Men Slim Fit Suit', sku: 'APP-SUIT-001', unitPrice: 7999, quantity: 2, total: 15998 },
                    { productName: 'Fabindia Cotton Kurta', sku: 'APP-KRT-003', unitPrice: 1699, quantity: 1, total: 1699 },
                  ]).map((item: any, i: number) => (
                    <tr key={i} className="hover:bg-slate-50/60">
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-slate-800">{item.productName}</div>
                        <div className="font-mono text-[10px] text-blue-600">{item.sku}</div>
                      </td>
                      <td className="py-2.5 px-3 text-right text-slate-700">{formatCurrency(item.unitPrice)}</td>
                      <td className="py-2.5 px-3 text-center font-bold text-slate-900">{item.quantity}</td>
                      <td className="py-2.5 px-3 text-right font-black text-slate-900">{formatCurrency(item.unitPrice * item.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-col items-end space-y-1 text-xs">
              <div className="flex justify-between w-56 text-slate-600">
                <span>Subtotal:</span>
                <span>{formatCurrency(order.totalAmount * 0.82)}</span>
              </div>
              <div className="flex justify-between w-56 text-slate-600">
                <span>GST (18%):</span>
                <span>{formatCurrency(order.totalAmount * 0.18)}</span>
              </div>
              <div className="flex justify-between w-56 text-sm font-black text-slate-900 pt-1 border-t border-slate-200">
                <span>Total Amount:</span>
                <span className="text-blue-600">{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Customer & Delivery Info */}
        <div className="space-y-6">
          <Card className="p-5 space-y-3">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider border-b border-slate-100 pb-2">
              Customer Details
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-800 font-semibold">
                <User className="w-4 h-4 text-slate-400" />
                <span>{order.customerName}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Phone className="w-4 h-4 text-slate-400" />
                <span>+91 98201 55678</span>
              </div>
              <div className="flex items-start gap-2 text-slate-600 pt-1">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>{order.shippingAddress || 'Indiranagar Flagship, Bengaluru, KA 560038'}</span>
              </div>
            </div>
          </Card>

          <Card className="p-5 space-y-3">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider border-b border-slate-100 pb-2">
              Logistics & Dispatch Carrier
            </h3>
            <div className="space-y-2 text-xs text-slate-600">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Courier Partner</span>
                <span className="font-bold text-slate-800">BlueDart Express / XYZ Logistics</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">AWB Tracking Number</span>
                <span className="font-mono font-bold text-blue-600">BD-IN-889920144</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Estimated Delivery</span>
                <span className="font-semibold text-slate-800">November 2, 2026</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

