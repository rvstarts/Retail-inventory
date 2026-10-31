import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { mockDashboardStats, mockProducts, mockOrders, mockWarehouses } from '../../api/mockData';
import { StatCard } from '../../components/ui/StatCard';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  Package,
  Warehouse,
  Store,
  Boxes,
  IndianRupee,
  AlertTriangle,
  XCircle,
  Clock,
  CheckCircle2,
  Users2,
  TrendingUp,
  ArrowRight,
  PlusCircle,
  ArrowLeftRight,
  ScanBarcode,
  RefreshCw,
  Calendar,
  Filter,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<any>(mockDashboardStats);
  const [loading, setLoading] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState('ALL');

  useEffect(() => {
    loadDashboardData();
  }, [selectedWarehouse]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/dashboard/summary', {
        params: selectedWarehouse !== 'ALL' ? { warehouseId: selectedWarehouse } : {},
      });
      if (res.data?.data) {
        setStats(res.data.data);
      }
    } catch {
      // Gracefully uses fallback stats
    } finally {
      setLoading(false);
    }
  };

  const categoryData = stats?.stockByCategory || [
    { category: 'Apparel', units: 1450, value: 2850000 },
    { category: 'Electronics', units: 620, value: 5400000 },
    { category: 'Home Goods', units: 890, value: 1650000 },
    { category: 'Footwear', units: 580, value: 1450000 },
    { category: 'Beauty', units: 410, value: 680000 },
    { category: 'Groceries', units: 1100, value: 890000 },
  ];

  const warehouseValueData = stats?.warehouseValue || [
    { name: 'Central Distribution (BOM)', value: 6850000, color: '#2563eb' },
    { name: 'North Hub (DEL)', value: 4320000, color: '#0d9488' },
    { name: 'South Hub (BLR)', value: 3115000, color: '#f59e0b' },
  ];

  const monthlyFlowData = [
    { month: 'May', stockIn: 1850, stockOut: 1420 },
    { month: 'Jun', stockIn: 2100, stockOut: 1980 },
    { month: 'Jul', stockIn: 2600, stockOut: 2300 },
    { month: 'Aug', stockIn: 2900, stockOut: 2750 },
    { month: 'Sep', stockIn: 3400, stockOut: 3100 },
    { month: 'Oct', stockIn: 3850, stockOut: 3420 },
  ];

  const orderStatusData = [
    { name: 'Delivered', value: 38, color: '#10b981' },
    { name: 'Processing', value: 14, color: '#3b82f6' },
    { name: 'Shipped', value: 8, color: '#6366f1' },
    { name: 'Pending', value: 5, color: '#f59e0b' },
    { name: 'Cancelled', value: 2, color: '#ef4444' },
  ];

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Executive Inventory Command Center
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Real-time multi-location metrics, stock health, and supply chain telemetry.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Warehouse Filter */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-lg px-3 py-1.5 shadow-2xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedWarehouse}
              onChange={(e) => setSelectedWarehouse(e.target.value)}
              className="text-xs font-semibold text-slate-700 bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Warehouses & Stores</option>
              {mockWarehouses.map((wh) => (
                <option key={wh.id} value={wh.id}>
                  {wh.name} ({wh.code})
                </option>
              ))}
            </select>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={loadDashboardData}
            loading={loading}
            className="flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </Button>

          <Link to="/products/new">
            <Button variant="primary" size="sm" className="flex items-center gap-1.5 shadow-xs">
              <PlusCircle className="w-4 h-4" /> Add Product
            </Button>
          </Link>
        </div>
      </div>

      {/* Ten Official Business KPIs Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        <StatCard
          title="Total Products"
          value={stats?.totalProducts ?? 32}
          icon={Package}
          color="blue"
          change="Catalog items"
        />
        <StatCard
          title="Warehouses"
          value={stats?.totalWarehouses ?? 3}
          icon={Warehouse}
          color="indigo"
          change="Central Hubs"
        />
        <StatCard
          title="Retail Stores"
          value={stats?.totalStores ?? 5}
          icon={Store}
          color="cyan"
          change="Point-of-Sale"
        />
        <StatCard
          title="Total Stock Units"
          value={(stats?.totalInventoryUnits ?? 5740).toLocaleString('en-IN')}
          icon={Boxes}
          color="emerald"
          change="+8.4% this month"
          trend="up"
        />
        <StatCard
          title="Inventory Valuation"
          value={formatCurrency(stats?.totalInventoryValue ?? 14285000)}
          icon={IndianRupee}
          color="violet"
          change="At cost price"
        />
        <StatCard
          title="Low Stock Alerts"
          value={stats?.lowStockProducts ?? 3}
          icon={AlertTriangle}
          color="amber"
          change="Requires reorder"
          trend="down"
        />
        <StatCard
          title="Out-of-Stock"
          value={stats?.outOfStockProducts ?? 0}
          icon={XCircle}
          color="rose"
          change="Zero stockouts"
          trend="up"
        />
        <StatCard
          title="Pending Orders"
          value={stats?.pendingOrders ?? 2}
          icon={Clock}
          color="amber"
          change="Awaiting picking"
        />
        <StatCard
          title="Completed Orders"
          value={stats?.completedOrders ?? 28}
          icon={CheckCircle2}
          color="emerald"
          change="98.5% fulfillment"
          trend="up"
        />
        <StatCard
          title="Active Suppliers"
          value={stats?.totalSuppliers ?? 5}
          icon={Users2}
          color="blue"
          change="Tier-1 Vendors"
        />
      </div>

      {/* Quick Operations Bar */}
      <Card className="p-3 bg-gradient-to-r from-blue-900 to-indigo-900 text-white border-0 shadow-lg">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-800/80 rounded-lg text-blue-200">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Rapid Stock Actions</h4>
              <p className="text-xs text-blue-200 font-normal">
                Perform verified inventory operations with complete transaction ledger logging.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link to="/inventory/stock-in">
              <Button size="sm" className="bg-white text-blue-900 hover:bg-blue-50 font-semibold border-0">
                + Stock In
              </Button>
            </Link>
            <Link to="/inventory/stock-out">
              <Button size="sm" variant="secondary" className="bg-blue-800 text-white hover:bg-blue-700 border-blue-700">
                - Stock Out
              </Button>
            </Link>
            <Link to="/inventory/transfers">
              <Button size="sm" variant="secondary" className="bg-blue-800 text-white hover:bg-blue-700 border-blue-700">
                <ArrowLeftRight className="w-3.5 h-3.5 mr-1" /> Transfer
              </Button>
            </Link>
            <Link to="/tracking/barcode">
              <Button size="sm" variant="secondary" className="bg-blue-800 text-white hover:bg-blue-700 border-blue-700">
                <ScanBarcode className="w-3.5 h-3.5 mr-1" /> Scan Barcode
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      {/* Charts Section 1: Monthly Flow & Category Units */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Stock Movement */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Monthly Stock Inflow vs Outflow</h3>
              <p className="text-xs text-slate-500">6-Month inventory velocity tracking</p>
            </div>
            <Badge variant="info">Units / Month</Badge>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyFlowData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="stockIn" name="Stock In" fill="#2563eb" radius={[4, 4, 0, 0]} />
                <Bar dataKey="stockOut" name="Stock Out" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Stock Distribution by Category */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Stock Distribution by Category</h3>
              <p className="text-xs text-slate-500">Active inventory volume across 8 departments</p>
            </div>
            <Link to="/products" className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-semibold">
              View Catalog <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={categoryData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="category" type="category" tick={{ fontSize: 11 }} width={80} />
                <Tooltip
                  formatter={(val: any) => [`${val} Units`, 'Volume']}
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                />
                <Bar dataKey="units" name="Stock Units" fill="#0ea5e9" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Charts Section 2: Warehouse Value & Order Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inventory Value by Warehouse */}
        <Card className="p-5 lg:col-span-1">
          <h3 className="font-bold text-slate-800 text-sm mb-1">Asset Value by Warehouse</h3>
          <p className="text-xs text-slate-500 mb-3">Capital distribution across logistics nodes</p>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={warehouseValueData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {warehouseValueData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [formatCurrency(val), 'Valuation']}
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 mt-2 border-t border-slate-100 pt-3">
            {warehouseValueData.map((w) => (
              <div key={w.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: w.color }} />
                  {w.name}
                </span>
                <span className="font-bold text-slate-800">{formatCurrency(w.value)}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Order Fulfillment Distribution */}
        <Card className="p-5 lg:col-span-1">
          <h3 className="font-bold text-slate-800 text-sm mb-1">Order Fulfillment Status</h3>
          <p className="text-xs text-slate-500 mb-3">Live customer orders across 500+ stores</p>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`status-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2 border-t border-slate-100 pt-3 text-xs">
            {orderStatusData.map((s) => (
              <div key={s.name} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="text-slate-600">{s.name}:</span>
                <span className="font-bold text-slate-800">{s.value}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Urgent Low Stock Alerts */}
        <Card className="p-5 lg:col-span-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-500" /> Critical Low Stock
                </h3>
                <p className="text-xs text-slate-500">Products currently below safety reorder threshold</p>
              </div>
              <Link to="/inventory/low-stock">
                <Badge variant="danger">Action Required</Badge>
              </Link>
            </div>

            <div className="space-y-3">
              <div className="p-2.5 rounded-lg border border-rose-200 bg-rose-50/50 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Eureka Forbes Robot Vacuum</h4>
                  <p className="text-[10px] text-slate-500 font-mono">SKU: HOM-VAC-004</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-rose-600">8 Units</span>
                  <span className="text-[10px] text-slate-500 block">Min: 15</span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg border border-amber-200 bg-amber-50/50 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Philips Air Fryer XL</h4>
                  <p className="text-[10px] text-slate-500 font-mono">SKU: HOM-AF-006</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-amber-600">12 Units</span>
                  <span className="text-[10px] text-slate-500 block">Min: 20</span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg border border-amber-200 bg-amber-50/50 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Sony WH-1000XM5 Headphones</h4>
                  <p className="text-[10px] text-slate-500 font-mono">SKU: ELE-AUD-002</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-amber-600">14 Units</span>
                  <span className="text-[10px] text-slate-500 block">Min: 25</span>
                </div>
              </div>
            </div>
          </div>

          <Link to="/purchase-orders" className="mt-4">
            <Button variant="outline" size="sm" className="w-full justify-center text-xs font-semibold">
              Generate Reorder Purchase Orders <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </Card>
      </div>

      {/* Recent Orders & Stock Movements Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Recent Customer Orders</h3>
              <p className="text-xs text-slate-500">Live order allocation and fulfillment pipeline</p>
            </div>
            <Link to="/orders" className="text-xs text-blue-600 hover:underline font-semibold flex items-center gap-1">
              All Orders <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Order #</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Total</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mockOrders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 font-mono font-semibold text-blue-600">{order.orderNumber}</td>
                    <td className="py-2.5 px-3 font-medium text-slate-700">{order.customerName}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{formatCurrency(order.totalAmount)}</td>
                    <td className="py-2.5 px-3">
                      <Badge
                        variant={
                          order.status === 'DELIVERED'
                            ? 'success'
                            : order.status === 'SHIPPED' || order.status === 'PACKED'
                            ? 'info'
                            : order.status === 'PROCESSING' || order.status === 'PICKED'
                            ? 'warning'
                            : 'neutral'
                        }
                      >
                        {order.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Top Moving Products */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">High-Velocity Catalog Items</h3>
              <p className="text-xs text-slate-500">Top selling inventory across all retail channels</p>
            </div>
            <Link to="/reports" className="text-xs text-blue-600 hover:underline font-semibold flex items-center gap-1">
              Full Report <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Product</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Selling Price</th>
                  <th className="py-2.5 px-3 text-right">In Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mockProducts.slice(0, 5).map((prod) => (
                  <tr key={prod.id} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-slate-800">{prod.name}</div>
                      <div className="font-mono text-[10px] text-slate-400">{prod.sku}</div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 font-medium">{prod.categoryName}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{formatCurrency(prod.sellingPrice)}</td>
                    <td className="py-2.5 px-3 text-right font-black text-emerald-600">
                      {prod.currentStock || 120} units
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

