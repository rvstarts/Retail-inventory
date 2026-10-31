import React, { useState } from 'react';
import { mockOrders } from '../../api/mockData';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useToast } from '../../context/ToastContext';
import {
  Truck,
  CheckCircle2,
  PackageCheck,
  ScanBarcode,
  ArrowRight,
  ClipboardList,
  Box,
} from 'lucide-react';

export const OrderFulfillmentPage: React.FC = () => {
  const [orders, setOrders] = useState<any[]>(
    mockOrders.filter((o) => ['CONFIRMED', 'PROCESSING', 'PICKED', 'PACKED'].includes(o.status))
  );
  const { addToast } = useToast();

  const handleAdvanceStep = (orderId: string, currentStatus: string) => {
    let nextStatus = 'PROCESSING';
    let message = '';

    if (currentStatus === 'CONFIRMED' || currentStatus === 'PENDING') {
      nextStatus = 'PROCESSING';
      message = 'Order moved to warehouse queue for picking.';
    } else if (currentStatus === 'PROCESSING') {
      nextStatus = 'PICKED';
      message = 'Items picked from bin location.';
    } else if (currentStatus === 'PICKED') {
      nextStatus = 'PACKED';
      message = 'Items verified, boxed, and shipping label generated.';
    } else if (currentStatus === 'PACKED') {
      nextStatus = 'SHIPPED';
      message = 'Physical stock deducted from warehouse inventory. Tracking AWB activated.';
    }

    setOrders(
      orders
        .map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o))
        .filter((o) => nextStatus !== 'SHIPPED')
    );

    addToast('success', `Order ${nextStatus}`, message);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
            <Truck className="w-6 h-6 text-blue-600" /> Warehouse Fulfillment Center
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Execute Pick, Pack, and Ship operations with automated physical stock deduction upon dispatch.
          </p>
        </div>

        <Badge variant="info" className="text-xs py-1 px-3">
          {orders.length} Orders Awaiting Fulfillment
        </Badge>
      </div>

      {/* Fulfillment Pipeline Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Step 1: Picking Queue */}
        <div className="space-y-3">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between">
            <span className="font-bold text-xs text-blue-900 flex items-center gap-1.5">
              <ClipboardList className="w-4 h-4 text-blue-600" /> 1. Picking Queue
            </span>
            <Badge variant="info">
              {orders.filter((o) => ['CONFIRMED', 'PROCESSING'].includes(o.status)).length}
            </Badge>
          </div>

          <div className="space-y-3">
            {orders
              .filter((o) => ['CONFIRMED', 'PROCESSING'].includes(o.status))
              .map((order) => (
                <Card key={order.id} className="p-4 space-y-3 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-blue-600 text-xs">{order.orderNumber}</span>
                    <Badge variant="warning">{order.status}</Badge>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-xs">{order.customerName}</h4>
                    <p className="text-[11px] text-slate-400 truncate">{order.shippingAddress}</p>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Items: <strong>2 Line Items</strong> (Central BOM Hub)
                  </div>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => handleAdvanceStep(order.id, order.status)}
                    className="w-full justify-center text-xs"
                  >
                    Mark as Picked <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </Card>
              ))}
          </div>
        </div>

        {/* Step 2: Packing Queue */}
        <div className="space-y-3">
          <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center justify-between">
            <span className="font-bold text-xs text-indigo-900 flex items-center gap-1.5">
              <Box className="w-4 h-4 text-indigo-600" /> 2. Packing & Verification
            </span>
            <Badge variant="info">{orders.filter((o) => o.status === 'PICKED').length}</Badge>
          </div>

          <div className="space-y-3">
            {orders
              .filter((o) => o.status === 'PICKED')
              .map((order) => (
                <Card key={order.id} className="p-4 space-y-3 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-indigo-600 text-xs">{order.orderNumber}</span>
                    <Badge variant="warning">PICKED</Badge>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-xs">{order.customerName}</h4>
                    <p className="text-[11px] text-slate-400">Barcode scan verified</p>
                  </div>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => handleAdvanceStep(order.id, order.status)}
                    className="w-full justify-center text-xs bg-indigo-600 hover:bg-indigo-700"
                  >
                    Pack & Generate Label <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </Card>
              ))}
          </div>
        </div>

        {/* Step 3: Shipping Dispatch Queue */}
        <div className="space-y-3">
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
            <span className="font-bold text-xs text-emerald-900 flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-emerald-600" /> 3. Dispatch & Ship
            </span>
            <Badge variant="success">{orders.filter((o) => o.status === 'PACKED').length}</Badge>
          </div>

          <div className="space-y-3">
            {orders
              .filter((o) => o.status === 'PACKED')
              .map((order) => (
                <Card key={order.id} className="p-4 space-y-3 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-emerald-600 text-xs">{order.orderNumber}</span>
                    <Badge variant="info">PACKED</Badge>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-xs">{order.customerName}</h4>
                    <span className="font-mono text-[10px] text-blue-600 block">AWB: BD-2026-99182</span>
                  </div>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => handleAdvanceStep(order.id, order.status)}
                    className="w-full justify-center text-xs bg-emerald-600 hover:bg-emerald-700 shadow-md"
                  >
                    Dispatch Courier & Deduct Stock <CheckCircle2 className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </Card>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

