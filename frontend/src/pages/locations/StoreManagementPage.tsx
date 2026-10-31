import React, { useState } from 'react';
import { mockStores } from '../../api/mockData';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../context/ToastContext';
import {
  Store,
  PlusCircle,
  MapPin,
  Phone,
  User,
  ShoppingBag,
  Warehouse,
  ExternalLink,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const StoreManagementPage: React.FC = () => {
  const [stores, setStores] = useState<any[]>(mockStores);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    address: '',
    city: '',
    state: '',
    contactPerson: '',
    contactPhone: '',
    associatedWarehouseId: '1',
  });
  const { addToast } = useToast();

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newStore = {
      id: String(Date.now()),
      ...formData,
      status: 'ACTIVE',
      currentStockUnits: 450,
      monthlyRevenue: 1250000,
    };
    setStores([...stores, newStore]);
    addToast('success', 'Retail Store Registered', `${formData.name} is now online in RIMS network.`);
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
            <Store className="w-6 h-6 text-blue-600" /> Retail Store Network (500+ Outlets)
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Manage point-of-sale store locations, local shelf inventories, and replenishment mappings.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 shadow-xs"
        >
          <PlusCircle className="w-4 h-4" /> Add Retail Store
        </Button>
      </div>

      {/* Stores Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stores.map((s) => (
          <Card key={s.id} className="p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl">
                    <Store className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{s.name}</h3>
                    <span className="font-mono text-[11px] font-bold text-emerald-600">{s.code}</span>
                  </div>
                </div>
                <Badge variant={s.status === 'ACTIVE' ? 'success' : 'neutral'}>
                  {s.status || 'ACTIVE'}
                </Badge>
              </div>

              <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>{s.address}, {s.city}, {s.state}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Store Manager: <strong>{s.contactPerson || 'Store Lead'}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-mono">{s.contactPhone || '+91 98450 12345'}</span>
                </div>
                <div className="flex items-center gap-2 text-blue-700 bg-blue-50/70 p-1.5 rounded-md">
                  <Warehouse className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span className="text-[11px] font-medium">Replenished from: <strong>Central BOM Hub</strong></span>
                </div>
              </div>
            </div>

            {/* Footer Stats & Actions */}
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Active Stock</span>
                <span className="text-sm font-black text-slate-900">
                  {s.currentStockUnits || 450} Units
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Link to="/inventory/transfers">
                  <Button variant="outline" size="sm" className="text-xs">
                    Replenish
                  </Button>
                </Link>
                <Link to={`/inventory?storeId=${s.id}`}>
                  <Button variant="secondary" size="sm" className="text-xs">
                    Stock
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Store Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register Retail Store Outlet">
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Store Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Phoenix Marketcity Mall Outlet"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Store Code *
              </label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="e.g. STR-BLR-06"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-bold text-emerald-600 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Supplying Warehouse
              </label>
              <select
                value={formData.associatedWarehouseId}
                onChange={(e) => setFormData({ ...formData, associatedWarehouseId: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-blue-500"
              >
                <option value="1">Central Distribution Hub (BOM)</option>
                <option value="2">North Logistics Hub (DEL)</option>
                <option value="3">South Distribution Center (BLR)</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Store Street Address *
              </label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Shop G-12, Ground Floor..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                City *
              </label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="e.g. Bengaluru"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                State *
              </label>
              <input
                type="text"
                required
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                placeholder="e.g. Karnataka"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Store Manager Name
              </label>
              <input
                type="text"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                placeholder="e.g. Anand Kumar"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Store Phone
              </label>
              <input
                type="text"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                placeholder="+91 98450 99887"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Register Store
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

