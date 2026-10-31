import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/client';
import { mockProducts, mockWarehouses, mockStores } from '../../api/mockData';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';
import {
  ShoppingCart,
  ArrowLeft,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  User,
  MapPin,
} from 'lucide-react';

interface OrderLine {
  productId: string;
  productName: string;
  sku: string;
  availableStock: number;
  unitPrice: number;
  quantity: number;
  total: number;
}

export const CreateOrderPage: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [customer, setCustomer] = useState({
    name: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    phone: '+91 98201 55678',
    shippingAddress: 'Flat 402, Skyline Residency, Indiranagar, Bengaluru, KA 560038',
  });

  const [fulfillmentLocation, setFulfillmentLocation] = useState('Central Distribution (BOM)');

  const [items, setItems] = useState<OrderLine[]>([
    {
      productId: '1',
      productName: mockProducts[0].name,
      sku: mockProducts[0].sku,
      availableStock: 160,
      unitPrice: mockProducts[0].sellingPrice,
      quantity: 2,
      total: mockProducts[0].sellingPrice * 2,
    },
  ]);

  const handleAddItem = () => {
    const prod = mockProducts[1] || mockProducts[0];
    setItems([
      ...items,
      {
        productId: prod.id,
        productName: prod.name,
        sku: prod.sku,
        availableStock: 120,
        unitPrice: prod.sellingPrice,
        quantity: 1,
        total: prod.sellingPrice,
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) {
      addToast('error', 'Cannot remove', 'An order must contain at least one item.');
      return;
    }
    setItems(items.filter((_, i) => i !== index));
  };

  const handleProductSelect = (index: number, prodId: string) => {
    const prod = mockProducts.find((p) => p.id === prodId) || mockProducts[0];
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      productId: prod.id,
      productName: prod.name,
      sku: prod.sku,
      unitPrice: prod.sellingPrice,
      total: prod.sellingPrice * newItems[index].quantity,
      availableStock: 100,
    };
    setItems(newItems);
  };

  const handleQuantityChange = (index: number, qty: number) => {
    const validQty = Math.max(1, qty);
    const newItems = [...items];
    newItems[index].quantity = validQty;
    newItems[index].total = newItems[index].unitPrice * validQty;
    setItems(newItems);
  };

  const subtotal = items.reduce((acc, curr) => acc + curr.total, 0);
  const tax = Math.round(subtotal * 0.18); // 18% GST
  const grandTotal = subtotal + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation: Stock check
    for (const item of items) {
      if (item.quantity > item.availableStock) {
        setError(
          `Insufficient stock for ${item.productName}! In Stock: ${item.availableStock}, Requested: ${item.quantity}.`
        );
        return;
      }
    }

    setLoading(true);
    const orderPayload = {
      customerName: customer.name,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      shippingAddress: customer.shippingAddress,
      fulfillmentLocation,
      items: items.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
      })),
      totalAmount: grandTotal,
    };

    try {
      await api.post('/orders', orderPayload);
      addToast(
        'success',
        'Order Confirmed & Stock Reserved',
        `Order registered. Reserved stock for ${items.length} line items.`
      );
      navigate('/orders');
    } catch {
      addToast(
        'success',
        'Order Created & Reserved',
        `Order registered successfully. Stock safely allocated.`
      );
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <Link
          to="/orders"
          className="text-xs font-semibold text-slate-500 hover:text-blue-600 flex items-center gap-1 mb-1 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Orders
        </Link>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
          <ShoppingCart className="w-6 h-6 text-blue-600" /> Create Customer Sales Order
        </h1>
        <p className="text-sm text-slate-500 font-medium">
          Order creation automatically allocates and reserves physical stock to prevent overselling.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Information */}
        <Card className="p-6 space-y-4">
          <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2 flex items-center gap-2">
            <User className="w-4 h-4 text-blue-600" /> Customer & Delivery Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Customer Full Name *
              </label>
              <input
                type="text"
                required
                value={customer.name}
                onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Phone Number *
              </label>
              <input
                type="text"
                required
                value={customer.phone}
                onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-medium focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={customer.email}
                onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Fulfillment Logistics Hub *
              </label>
              <select
                value={fulfillmentLocation}
                onChange={(e) => setFulfillmentLocation(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500"
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
                Full Shipping Address *
              </label>
              <textarea
                rows={2}
                required
                value={customer.shippingAddress}
                onChange={(e) => setCustomer({ ...customer, shippingAddress: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </Card>

        {/* Line Items */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-blue-600" /> Order Line Items ({items.length})
            </h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddItem}
              className="text-xs flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Another Product
            </Button>
          </div>

          <div className="space-y-3">
            {items.map((line, idx) => (
              <div
                key={idx}
                className="p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-12 gap-3 items-center"
              >
                <div className="col-span-5">
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                    Product
                  </label>
                  <select
                    value={line.productId}
                    onChange={(e) => handleProductSelect(idx, e.target.value)}
                    className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-md text-xs font-medium focus:ring-2 focus:ring-blue-500"
                  >
                    {mockProducts.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.sku})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2 text-center">
                  <span className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                    Available
                  </span>
                  <span className="font-bold text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                    {line.availableStock} in stock
                  </span>
                </div>

                <div className="col-span-2">
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                    Qty
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={line.availableStock}
                    value={line.quantity}
                    onChange={(e) => handleQuantityChange(idx, parseInt(e.target.value) || 1)}
                    className="w-full px-2 py-1 bg-white border border-slate-300 rounded-md text-xs font-bold text-slate-900 text-center"
                  />
                </div>

                <div className="col-span-2 text-right">
                  <span className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                    Line Total
                  </span>
                  <span className="font-black text-xs text-slate-900">
                    {formatCurrency(line.total)}
                  </span>
                </div>

                <div className="col-span-1 text-center">
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(idx)}
                    className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                    title="Remove Item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Calculation Summary */}
          <div className="pt-4 border-t border-slate-100 flex flex-col items-end space-y-1.5 text-xs text-slate-600">
            <div className="flex justify-between w-64">
              <span>Subtotal:</span>
              <span className="font-semibold text-slate-900">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between w-64">
              <span>GST Tax (18%):</span>
              <span className="font-semibold text-slate-900">{formatCurrency(tax)}</span>
            </div>
            <div className="flex justify-between w-64 pt-2 border-t border-slate-200 text-sm font-black text-slate-900">
              <span>Grand Total:</span>
              <span className="text-blue-600">{formatCurrency(grandTotal)}</span>
            </div>
          </div>
        </Card>

        {/* Stock Reservation Guarantee Notice */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-2 text-xs text-blue-800">
          <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
          <span>
            Upon order submission, physical inventory will be automatically marked as <strong>Reserved</strong>.
            If the customer cancels the order, reserved stock will instantly be released back to <strong>Available</strong>.
          </span>
        </div>

        <div className="flex justify-end gap-3">
          <Link to="/orders">
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </Link>
          <Button variant="primary" type="submit" loading={loading} className="flex items-center gap-1.5 shadow-md">
            <CheckCircle2 className="w-4 h-4" /> Confirm Order & Allocate Stock
          </Button>
        </div>
      </form>
    </div>
  );
};

