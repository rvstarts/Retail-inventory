import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/client';
import { mockProducts } from '../../api/mockData';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import {
  Package,
  ArrowLeft,
  Edit2,
  Barcode,
  Printer,
  Boxes,
  Warehouse,
  Store,
  History,
  TrendingUp,
  Tag,
  ShieldCheck,
} from 'lucide-react';

export const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any | null>(null);

  useEffect(() => {
    const found = mockProducts.find((p) => p.id === id || String(p.id) === String(id)) || mockProducts[0];
    setProduct(found);
  }, [id]);

  if (!product) {
    return <div className="p-8 text-center text-slate-500">Loading product details...</div>;
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const handlePrintBarcode = () => {
    window.print();
  };

  const locationStock = [
    { location: 'Central Distribution (BOM)', type: 'WAREHOUSE', quantity: 180, reserved: 20, available: 160 },
    { location: 'North Logistics Hub (DEL)', type: 'WAREHOUSE', quantity: 95, reserved: 5, available: 90 },
    { location: 'South Distribution (BLR)', type: 'WAREHOUSE', quantity: 60, reserved: 0, available: 60 },
    { location: 'Indiranagar Flagship Store', type: 'STORE', quantity: 24, reserved: 2, available: 22 },
    { location: 'Bandra Retail Outlet', type: 'STORE', quantity: 18, reserved: 0, available: 18 },
    { location: 'Connaught Place Store', type: 'STORE', quantity: 12, reserved: 1, available: 11 },
  ];

  const totalStock = locationStock.reduce((acc, curr) => acc + curr.quantity, 0);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link
            to="/products"
            className="text-xs font-semibold text-slate-500 hover:text-blue-600 flex items-center gap-1 mb-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Catalog
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black tracking-tight text-slate-900">{product.name}</h1>
            <Badge variant={product.status === 'ACTIVE' ? 'success' : 'neutral'}>
              {product.status || 'ACTIVE'}
            </Badge>
          </div>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            SKU: <strong className="text-blue-600">{product.sku}</strong> • Category:{' '}
            <strong className="text-slate-700">{product.categoryName}</strong> • Brand:{' '}
            <strong className="text-slate-700">{product.brand}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePrintBarcode} className="flex items-center gap-1.5">
            <Printer className="w-4 h-4 text-slate-600" /> Print Label
          </Button>

          <Link to={`/products/edit/${product.id}`}>
            <Button variant="primary" size="sm" className="flex items-center gap-1.5 shadow-xs">
              <Edit2 className="w-4 h-4" /> Edit Details
            </Button>
          </Link>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-blue-50/40 border-blue-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-xs">
              <Boxes className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Aggregate Stock</p>
              <h3 className="text-xl font-black text-slate-900">{totalStock} Units</h3>
              <p className="text-[10px] text-emerald-600 font-semibold">Across 6 active nodes</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-emerald-50/40 border-emerald-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-600 text-white rounded-xl shadow-xs">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Selling Price</p>
              <h3 className="text-xl font-black text-slate-900">{formatCurrency(product.sellingPrice)}</h3>
              <p className="text-[10px] text-slate-500">Cost: {formatCurrency(product.costPrice)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-violet-50/40 border-violet-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-violet-600 text-white rounded-xl shadow-xs">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Gross Margin</p>
              <h3 className="text-xl font-black text-violet-700">
                {product.costPrice
                  ? `${Math.round(((product.sellingPrice - product.costPrice) / product.sellingPrice) * 100)}%`
                  : '35%'}
              </h3>
              <p className="text-[10px] text-slate-500">₹{product.sellingPrice - product.costPrice} / unit</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-amber-50/40 border-amber-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500 text-white rounded-xl shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Reorder Threshold</p>
              <h3 className="text-xl font-black text-slate-900">{product.reorderPoint || 20} Units</h3>
              <p className="text-[10px] text-amber-700 font-semibold">Min safety stock: {product.minStockLevel || 10}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Grid: Details & Barcode */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h3 className="font-bold text-slate-900 text-sm mb-4 pb-2 border-b border-slate-100">
              Product Specifications & Metadata
            </h3>
            <p className="text-xs text-slate-600 mb-6 leading-relaxed">
              {product.description || 'Enterprise grade catalog merchandise managed under XYZ Retail Corporation central logistics distribution protocol.'}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Product SKU</span>
                <span className="font-mono font-bold text-slate-800 text-sm">{product.sku}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Barcode Number</span>
                <span className="font-mono font-bold text-slate-800 text-sm">{product.barcode || '890100234501'}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Category</span>
                <span className="font-bold text-slate-800 text-sm">{product.categoryName}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Manufacturer Brand</span>
                <span className="font-bold text-slate-800 text-sm">{product.brand || 'XYZ Retail'}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Cost Price (COGS)</span>
                <span className="font-bold text-slate-800 text-sm">{formatCurrency(product.costPrice)}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Selling Price (MSRP)</span>
                <span className="font-bold text-slate-800 text-sm">{formatCurrency(product.sellingPrice)}</span>
              </div>
            </div>
          </Card>

          {/* Location Inventory Table */}
          <Card className="overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <Boxes className="w-4 h-4 text-blue-600" /> Multi-Location Stock Allocation
                </h3>
                <p className="text-xs text-slate-500">Live inventory across warehouses and retail showrooms</p>
              </div>
              <Link to="/inventory/transfers">
                <Button variant="outline" size="sm" className="text-xs">
                  Initiate Transfer
                </Button>
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-4">Location Name</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3 text-right">Physical On Hand</th>
                    <th className="py-2.5 px-3 text-right">Reserved (Orders)</th>
                    <th className="py-2.5 px-4 text-right">Available to Sell</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {locationStock.map((loc) => (
                    <tr key={loc.location} className="hover:bg-slate-50/80">
                      <td className="py-2.5 px-4 font-semibold text-slate-800 flex items-center gap-2">
                        {loc.type === 'WAREHOUSE' ? (
                          <Warehouse className="w-3.5 h-3.5 text-blue-600" />
                        ) : (
                          <Store className="w-3.5 h-3.5 text-emerald-600" />
                        )}
                        {loc.location}
                      </td>
                      <td className="py-2.5 px-3">
                        <Badge variant={loc.type === 'WAREHOUSE' ? 'info' : 'success'}>
                          {loc.type}
                        </Badge>
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-slate-800">{loc.quantity}</td>
                      <td className="py-2.5 px-3 text-right text-amber-600 font-semibold">{loc.reserved}</td>
                      <td className="py-2.5 px-4 text-right font-bold text-emerald-600">{loc.available}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right Column: Barcode Visual & Actions */}
        <div className="space-y-6">
          {/* Printable Barcode Label Card */}
          <Card className="p-6 text-center space-y-4 border-2 border-slate-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Official Shelf Tag
              </span>
              <Badge variant="info">Code 128</Badge>
            </div>

            <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-2xs space-y-2">
              <div className="text-[10px] font-bold uppercase text-slate-400">XYZ Retail Corp</div>
              <div className="font-bold text-slate-900 text-xs truncate">{product.name}</div>
              <div className="font-black text-base text-slate-900">{formatCurrency(product.sellingPrice)}</div>

              {/* Code 128 Visual representation */}
              <div className="py-2 flex justify-center items-center">
                <div className="flex items-center h-12 gap-[2px]">
                  {Array.from({ length: 48 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-black h-full"
                      style={{
                        width: i % 5 === 0 ? '3px' : i % 3 === 0 ? '2px' : '1px',
                        opacity: i % 7 === 0 ? 0 : 1,
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="font-mono text-xs font-bold text-slate-700 tracking-widest">
                {product.barcode || '890100234501'}
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handlePrintBarcode}
              className="w-full justify-center flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" /> Print Thermal Barcode Sticker
            </Button>
          </Card>

          {/* Quick Operations Card */}
          <Card className="p-5 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">Stock Operations</h4>
            <div className="space-y-2">
              <Link to="/inventory/stock-in" className="block">
                <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                  + Add Stock-In Batch
                </Button>
              </Link>
              <Link to="/inventory/stock-out" className="block">
                <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                  - Issue Stock-Out
                </Button>
              </Link>
              <Link to="/tracking/barcode" className="block">
                <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                  <Barcode className="w-3.5 h-3.5 mr-1" /> Barcode Verification
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

