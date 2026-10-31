import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  Filter,
  PieChart as PieIcon,
  Boxes,
  Truck,
  CheckCircle2,
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

export const AnalyticsDashboardPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState('6M');

  const categoryDistribution = [
    { category: 'Apparel', units: 1450, turnover: 4.8 },
    { category: 'Electronics', units: 620, turnover: 6.2 },
    { category: 'Home Goods', units: 890, turnover: 3.9 },
    { category: 'Footwear', units: 580, turnover: 4.1 },
    { category: 'Beauty', units: 410, turnover: 5.5 },
    { category: 'Groceries', units: 1100, turnover: 8.4 },
  ];

  const warehouseValuation = [
    { name: 'Central BOM Hub', value: 6850000, color: '#2563eb' },
    { name: 'North DEL Hub', value: 4320000, color: '#0d9488' },
    { name: 'South BLR Hub', value: 3115000, color: '#f59e0b' },
  ];

  const fulfillmentVelocity = [
    { month: 'Jun', rate: 91.2, stockouts: 6 },
    { month: 'Jul', rate: 93.0, stockouts: 4 },
    { month: 'Aug', rate: 94.5, stockouts: 3 },
    { month: 'Sep', rate: 96.0, stockouts: 2 },
    { month: 'Oct', rate: 98.2, stockouts: 0 },
  ];

  const topSelling = [
    { name: 'Raymond Suit', revenue: 799900 },
    { name: 'Samsung TV', revenue: 672000 },
    { name: 'Philips Air Fryer', revenue: 472500 },
    { name: 'Sony Headphones', revenue: 390000 },
    { name: 'Fabindia Kurta', revenue: 254850 },
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-600" /> Advanced Retail Inventory Analytics
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Turnover velocity, fulfillment yield, and multi-location asset health.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 p-1 rounded-lg text-xs font-semibold">
            {['1M', '3M', '6M', '1Y'].map((t) => (
              <button
                key={t}
                onClick={() => setTimeRange(t)}
                className={`px-3 py-1 rounded-md transition-colors ${
                  timeRange === t ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid 1: Turnover & Fulfillment Rate */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-5">
          <h3 className="font-bold text-slate-800 text-sm mb-1">Inventory Turnover Ratio by Category</h3>
          <p className="text-xs text-slate-500 mb-4">Annualized stock turns (Higher indicates optimal capital flow)</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="category" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val: any) => [`${val} Turns/Year`, 'Turnover Ratio']}
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                />
                <Bar dataKey="turnover" name="Turnover Ratio" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-bold text-slate-800 text-sm mb-1">Order Fulfillment Success Rate (Objective 4: ≥95%)</h3>
          <p className="text-xs text-slate-500 mb-4">Historical progression of order accuracy and zero stockouts</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={fulfillmentVelocity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis domain={[85, 100]} tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val: any) => [`${val}%`, 'Fulfillment Rate']}
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                />
                <Line type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Grid 2: Revenue Leaders & Asset Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-5">
          <h3 className="font-bold text-slate-800 text-sm mb-1">Top Revenue Contributing Products</h3>
          <p className="text-xs text-slate-500 mb-4">Sales volume revenue across retail channels</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={topSelling} margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={90} />
                <Tooltip
                  formatter={(val: any) => [formatCurrency(val), 'Revenue']}
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                />
                <Bar dataKey="revenue" name="Revenue" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-800 text-sm mb-1">Warehouse Asset Valuation Share</h3>
            <p className="text-xs text-slate-500 mb-4">Percentage allocation of physical inventory capital</p>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={warehouseValuation}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {warehouseValuation.map((entry, index) => (
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
          </div>

          <div className="space-y-1.5 border-t border-slate-100 pt-3">
            {warehouseValuation.map((w) => (
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
      </div>
    </div>
  );
};

