import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { mockProducts, mockWarehouses, mockStores } from '../../api/mockData';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../context/ToastContext';
import {
  Boxes,
  Search,
  Filter,
  PlusCircle,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  AlertTriangle,
  Warehouse,
  Store,
  Layers,
  History,
  CheckCircle2,
} from 'lucide-react';

export const InventoryOverviewPage: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [stockFilter, setStockFilter] = useState('ALL'); // ALL, LOW_STOCK, OUT_OF_STOCK
  const [loading, setLoading] = useState(false);
  const [adjustModalOpen, setAdjustModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [adjustedQty, setAdjustedQty] = useState(0);
  const [adjustReason, setAdjustReason] = useState('Cycle Count Reconciliation');
  const { addToast } = useToast();

  // Synthesize realistic inventory across locations
  const [inventoryList, setInventoryList] = useState<any[]>([
    { id: '1', productName: 'Philips Air Fryer HD9252/90', sku: 'HOM-AF-006', category: 'Home Goods', location: 'Central Distribution (BOM)', locationType: 'WAREHOUSE', quantity: 180, reserved: 20, available: 160, costPrice: 4200, reorderPoint: 25, status: 'NORMAL' },
    { id: '2', productName: 'Eureka Forbes Robot Vacuum', sku: 'HOM-VAC-004', category: 'Home Goods', location: 'Central Distribution (BOM)', locationType: 'WAREHOUSE', quantity: 8, reserved: 2, available: 6, costPrice: 9500, reorderPoint: 15, status: 'LOW_STOCK' },
    { id: '3', productName: 'Sony WH-1000XM5 Headphones', sku: 'ELE-AUD-002', category: 'Electronics', location: 'North Logistics Hub (DEL)', locationType: 'WAREHOUSE', quantity: 14, reserved: 0, available: 14, costPrice: 19500, reorderPoint: 20, status: 'LOW_STOCK' },
    { id: '4', productName: 'Raymond Men Slim Fit Suit', sku: 'APP-SUIT-001', category: 'Apparel', location: 'Central Distribution (BOM)', locationType: 'WAREHOUSE', quantity: 110, reserved: 15, available: 95, costPrice: 3800, reorderPoint: 20, status: 'NORMAL' },
    { id: '5', productName: 'Fabindia Cotton Kurta', sku: 'APP-KRT-003', category: 'Apparel', location: 'Indiranagar Flagship Store', locationType: 'STORE', quantity: 45, reserved: 5, available: 40, costPrice: 850, reorderPoint: 10, status: 'NORMAL' },
    { id: '6', productName: 'Samsung 55" QLED 4K Smart TV', sku: 'ELE-TV-001', category: 'Electronics', location: 'South Distribution (BLR)', locationType: 'WAREHOUSE', quantity: 32, reserved: 4, available: 28, costPrice: 42000, reorderPoint: 10, status: 'NORMAL' },
    { id: '7', productName: 'Red Chief Leather Boots', sku: 'FTW-BOT-002', category: 'Footwear', location: 'Bandra Retail Outlet', locationType: 'STORE', quantity: 28, reserved: 3, available: 25, costPrice: 1800, reorderPoint: 8, status: 'NORMAL' },
    { id: '8', productName: 'Biba Women Anarkali Suit', sku: 'APP-BIB-005', category: 'Apparel', location: 'Connaught Place Store', locationType: 'STORE', quantity: 34, reserved: 0, available: 34, costPrice: 1600, reorderPoint: 10, status: 'NORMAL' },
  ]);

  const filteredInventory = inventoryList.filter((item) => {
    const matchesSearch =
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLoc = selectedLocation === 'ALL' || item.location === selectedLocation;
    const matchesStatus =
      stockFilter === 'ALL' ||
      (stockFilter === 'LOW_STOCK' && item.quantity <= item.reorderPoint) ||
      (stockFilter === 'OUT_OF_STOCK' && item.quantity === 0);
    return matchesSearch && matchesLoc && matchesStatus;
  });

  const handleOpenAdjust = (item: any) => {
    setSelectedItem(item);
    setAdjustedQty(item.quantity);
    setAdjustModalOpen(true);
  };

  const handleSaveAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    if (adjustedQty < 0) {
      addToast('error', 'Invalid Quantity', 'Stock cannot be negative.');
      return;
    }

    setInventoryList(
      inventoryList.map((item) =>
        item.id === selectedItem.id
          ? {
              ...item,
              quantity: adjustedQty,
              available: Math.max(0, adjustedQty - item.reserved),
              status: adjustedQty <= item.reorderPoint ? 'LOW_STOCK' : 'NORMAL',
            }
          : item
      )
    );

    addToast('success', 'Stock Adjusted', `Inventory for ${selectedItem.sku} reconciled to ${adjustedQty} units.`);
    setAdjustModalOpen(false);
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
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
            <Boxes className="w-6 h-6 text-blue-600" /> Multi-Location Inventory Ledger
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Real-time tracking of physical, reserved, and available-to-promise inventory.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link to="/inventory/stock-in">
            <Button variant="primary" size="sm" className="flex items-center gap-1.5 shadow-xs">
              <ArrowDownLeft className="w-4 h-4" /> Stock-In
            </Button>
          </Link>
          <Link to="/inventory/stock-out">
            <Button variant="outline" size="sm" className="flex items-center gap-1.5">
              <ArrowUpRight className="w-4 h-4 text-slate-600" /> Stock-Out
            </Button>
          </Link>
          <Link to="/inventory/transfers">
            <Button variant="outline" size="sm" className="flex items-center gap-1.5">
              <ArrowLeftRight className="w-4 h-4 text-slate-600" /> Inter-Node Transfer
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Product Name, SKU, or Category..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Warehouses & Stores</option>
              <optgroup label="Central Warehouses">
                {mockWarehouses.map((w) => (
                  <option key={w.id} value={w.name}>
                    {w.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Retail Stores">
                {mockStores.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          <div>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Inventory Statuses</option>
              <option value="LOW_STOCK">Low Stock Only (≤ Reorder)</option>
              <option value="OUT_OF_STOCK">Out of Stock (Zero Units)</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Inventory Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 uppercase font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Product / SKU</th>
                <th className="py-3 px-3">Location Node</th>
                <th className="py-3 px-3 text-right">Physical On Hand</th>
                <th className="py-3 px-3 text-right">Reserved (Orders)</th>
                <th className="py-3 px-3 text-right">Available (ATP)</th>
                <th className="py-3 px-3 text-right">Valuation</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredInventory.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{item.productName}</div>
                    <div className="font-mono text-[11px] text-blue-600">{item.sku}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                      {item.locationType === 'WAREHOUSE' ? (
                        <Warehouse className="w-3.5 h-3.5 text-blue-600" />
                      ) : (
                        <Store className="w-3.5 h-3.5 text-emerald-600" />
                      )}
                      {item.location}
                    </div>
                    <span className="text-[10px] text-slate-400 capitalize">{item.locationType?.toLowerCase()}</span>
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-slate-800 text-sm">
                    {item.quantity}
                  </td>
                  <td className="py-3 px-3 text-right text-amber-600 font-bold">
                    {item.reserved}
                  </td>
                  <td className="py-3 px-3 text-right font-black text-emerald-600 text-sm">
                    {item.available}
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-slate-900">
                    {formatCurrency(item.quantity * item.costPrice)}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {item.quantity <= item.reorderPoint ? (
                      <Badge variant="danger">Low Stock ({item.quantity})</Badge>
                    ) : (
                      <Badge variant="success">Normal</Badge>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleOpenAdjust(item)}
                        className="text-[11px] py-1 px-2.5 h-auto font-semibold"
                      >
                        Adjust
                      </Button>
                      <Link to="/inventory/transfers">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-[11px] py-1 px-2.5 h-auto font-semibold"
                        >
                          Transfer
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredInventory.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No inventory records match the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Active Stock Records: <strong>{filteredInventory.length}</strong></span>
          <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
            <CheckCircle2 className="w-4 h-4" /> Zero Negative Stock Rule Enforced
          </span>
        </div>
      </Card>

      {/* Reconcile Stock Adjustment Modal */}
      <Modal
        isOpen={adjustModalOpen}
        onClose={() => setAdjustModalOpen(false)}
        title="Inventory Reconciliation & Adjustment"
      >
        <form onSubmit={handleSaveAdjustment} className="space-y-4">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs space-y-1">
            <div className="font-bold text-blue-900">{selectedItem?.productName}</div>
            <div className="text-blue-700">Location: {selectedItem?.location}</div>
            <div className="text-slate-600">Current System Stock: <strong>{selectedItem?.quantity}</strong> units</div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Physically Counted Quantity *
            </label>
            <input
              type="number"
              min="0"
              required
              value={adjustedQty}
              onChange={(e) => setAdjustedQty(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Reason Code / Audit Justification *
            </label>
            <select
              value={adjustReason}
              onChange={(e) => setAdjustReason(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500"
            >
              <option value="Cycle Count Reconciliation">Cycle Count Reconciliation</option>
              <option value="Physical Audit Discrepancy">Physical Audit Discrepancy</option>
              <option value="Damaged Goods Write-off">Damaged Goods Write-off</option>
              <option value="Shrinkage / Loss">Shrinkage / Loss</option>
              <option value="Found Unregistered Goods">Found Unregistered Goods</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" type="button" onClick={() => setAdjustModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Apply Reconciliation
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

