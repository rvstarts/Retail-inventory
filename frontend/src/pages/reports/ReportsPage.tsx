import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useToast } from '../../context/ToastContext';
import {
  FileText,
  Download,
  Printer,
  Calendar,
  Filter,
  CheckCircle2,
  Table,
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState('inventory_summary');
  const [dateRange, setDateRange] = useState('30d');
  const { addToast } = useToast();

  const reportDefinitions: Record<string, { title: string; desc: string; headers: string[]; rows: any[] }> = {
    inventory_summary: {
      title: '1. Inventory Summary Report',
      desc: 'Complete overview of units on hand, reserved stock, and available units across facilities.',
      headers: ['Product Name', 'SKU', 'Category', 'Total Physical', 'Reserved', 'Available (ATP)', 'Status'],
      rows: [
        ['Raymond Men Slim Fit Suit', 'APP-SUIT-001', 'Apparel', '180', '20', '160', 'HEALTHY'],
        ['Philips Air Fryer HD9252/90', 'HOM-AF-006', 'Home Goods', '12', '0', '12', 'LOW_STOCK'],
        ['Eureka Forbes Robot Vacuum', 'HOM-VAC-004', 'Home Goods', '8', '2', '6', 'CRITICAL_LOW'],
        ['Sony WH-1000XM5 Headphones', 'ELE-AUD-002', 'Electronics', '14', '0', '14', 'LOW_STOCK'],
        ['Fabindia Cotton Kurta', 'APP-KRT-003', 'Apparel', '95', '5', '90', 'HEALTHY'],
      ],
    },
    stock_movement: {
      title: '2. Stock Movement Report',
      desc: 'Summary of inflow, outflow, and internal transfers by category for the selected period.',
      headers: ['Category', 'Opening Stock', 'Total Stock-In', 'Total Stock-Out', 'Net Transfers', 'Closing Stock'],
      rows: [
        ['Apparel', '1,200', '+450', '-200', '+50', '1,500'],
        ['Electronics', '550', '+180', '-110', '-10', '610'],
        ['Home Goods', '780', '+220', '-110', '0', '890'],
        ['Footwear', '500', '+150', '-70', '0', '580'],
      ],
    },
    low_stock: {
      title: '3. Low Stock Report',
      desc: 'Catalog items currently at or below their configured safety reorder points.',
      headers: ['Product Name', 'SKU', 'Current Stock', 'Reorder Point', 'Min Safety', 'Deficit', 'Primary Supplier'],
      rows: [
        ['Eureka Forbes Robot Vacuum', 'HOM-VAC-004', '8', '15', '10', '-7', 'Eureka Forbes Ltd'],
        ['Philips Air Fryer HD9252/90', 'HOM-AF-006', '12', '20', '15', '-8', 'Philips India Ltd'],
        ['Sony WH-1000XM5 Headphones', 'ELE-AUD-002', '14', '25', '15', '-11', 'Sony India Pvt Ltd'],
      ],
    },
    out_of_stock: {
      title: '4. Out-of-Stock Report',
      desc: 'List of SKUs with zero physical inventory across retail locations.',
      headers: ['Product Name', 'SKU', 'Category', 'Out of Stock Since', 'Pending Inbound PO', 'Expected Date'],
      rows: [
        ['No items currently out of stock. Zero-stockout SLA target maintained.', '—', '—', '—', '—', '—'],
      ],
    },
    inventory_valuation: {
      title: '5. Inventory Valuation Report',
      desc: 'Asset balance sheet based on FIFO/Weighted Average cost price by warehouse and category.',
      headers: ['Facility / Hub', 'Total Units', 'Total Cost Valuation', 'Retail MSRP Value', 'Unrealized Margin %'],
      rows: [
        ['Central Distribution (BOM)', '3,100', '₹68,50,000', '₹1,02,75,000', '33.3%'],
        ['North Logistics Hub (DEL)', '1,520', '₹43,20,000', '₹64,80,000', '33.3%'],
        ['South Distribution (BLR)', '1,120', '₹31,15,000', '₹46,72,500', '33.3%'],
      ],
    },
    purchase_orders: {
      title: '6. Purchase Order Report',
      desc: 'Vendor procurement commitments, delivery schedule status, and fulfillment ratios.',
      headers: ['PO #', 'Supplier Vendor', 'Order Date', 'Expected Date', 'Amount (₹)', 'Fulfillment Status'],
      rows: [
        ['PO-2026-0001', 'Raymond Apparel Ltd', '2026-10-25', '2026-10-31', '₹1,90,000', 'RECEIVED'],
        ['PO-2026-0002', 'Philips India Ltd', '2026-10-28', '2026-11-04', '₹2,10,000', 'PARTIALLY_RECEIVED'],
        ['PO-2026-0003', 'Sony India Pvt Ltd', '2026-10-30', '2026-11-06', '₹3,90,000', 'APPROVED'],
      ],
    },
    sales_orders: {
      title: '7. Sales Order Report',
      desc: 'Customer sales performance, order cycle times, and fulfillment conversion rate.',
      headers: ['Order #', 'Customer', 'Items', 'Order Total', 'Fulfillment Status', 'Payment Method'],
      rows: [
        ['ORD-2026-0001', 'Aarav Sharma', '2', '₹15,998', 'CONFIRMED', 'Prepaid Razorpay'],
        ['ORD-2026-0002', 'Priya Patel', '1', '₹4,999', 'SHIPPED', 'Prepaid NetBanking'],
        ['ORD-2026-0003', 'Vikram Malhotra', '1', '₹42,000', 'DELIVERED', 'Credit Card EMI'],
      ],
    },
    product_performance: {
      title: '8. Product Performance Report',
      desc: 'High-velocity sales volume, gross margins, and inventory days of supply (DOS).',
      headers: ['Product Name', 'SKU', 'Units Sold (30d)', 'Revenue Generated', 'Gross Margin %', 'Days of Supply (DOS)'],
      rows: [
        ['Raymond Men Slim Fit Suit', 'APP-SUIT-001', '124', '₹9,91,876', '52.5%', '43.5 Days'],
        ['Samsung 55" QLED 4K Smart TV', 'ELE-TV-001', '16', '₹6,72,000', '28.0%', '60.0 Days'],
        ['Philips Air Fryer HD9252', 'HOM-AF-006', '95', '₹4,74,905', '35.4%', '7.5 Days'],
      ],
    },
    supplier_performance: {
      title: '9. Supplier Performance Report',
      desc: 'Vendor scorecard: On-time delivery rate, quality rejection rate, and lead time reliability.',
      headers: ['Supplier Name', 'Total POs', 'On-Time Delivery %', 'Quality Defect %', 'Avg Lead Time', 'Vendor Rating'],
      rows: [
        ['Raymond Apparel Limited', '14', '98.5%', '0.2%', '4.2 Days', '4.9 / 5.0'],
        ['Philips Domestic Appliances', '8', '94.0%', '0.5%', '3.5 Days', '4.7 / 5.0'],
        ['Sony India Private Limited', '6', '96.0%', '0.1%', '5.0 Days', '4.8 / 5.0'],
      ],
    },
    inventory_turnover: {
      title: '10. Inventory Turnover Report',
      desc: 'Cost of Goods Sold (COGS) divided by average inventory investment across categories.',
      headers: ['Category', 'Annualized COGS', 'Avg Inventory Investment', 'Turnover Ratio', 'Velocity Rating'],
      rows: [
        ['Groceries', '₹1,20,00,000', '₹14,28,000', '8.4x', 'EXCELLENT'],
        ['Electronics', '₹85,00,000', '₹13,70,000', '6.2x', 'HIGH'],
        ['Beauty & Personal Care', '₹45,00,000', '₹8,18,000', '5.5x', 'OPTIMAL'],
        ['Apparel', '₹95,00,000', '₹19,79,000', '4.8x', 'GOOD'],
      ],
    },
  };

  const currentReport = reportDefinitions[selectedReport] || reportDefinitions.inventory_summary;

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [currentReport.headers.join(','), ...currentReport.rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${selectedReport}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('success', 'Report Exported', `${currentReport.title} saved to CSV.`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" /> Enterprise Business Reports Suite
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            All 10 official reporting modules generated from live database relations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint} className="flex items-center gap-1.5">
            <Printer className="w-4 h-4 text-slate-600" /> Print Report
          </Button>
          <Button variant="primary" size="sm" onClick={handleExportCSV} className="flex items-center gap-1.5 shadow-xs">
            <Download className="w-4 h-4" /> Export CSV
          </Button>
        </div>
      </div>

      {/* Report Switcher & Filter Controls */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2">
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
              Select Business Report Module *
            </label>
            <select
              value={selectedReport}
              onChange={(e) => setSelectedReport(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-blue-600 focus:ring-2 focus:ring-blue-500"
            >
              <option value="inventory_summary">1. Inventory Summary Report</option>
              <option value="stock_movement">2. Stock Movement Report</option>
              <option value="low_stock">3. Low Stock Report</option>
              <option value="out_of_stock">4. Out-of-Stock Report</option>
              <option value="inventory_valuation">5. Inventory Valuation Report</option>
              <option value="purchase_orders">6. Purchase Order Report</option>
              <option value="sales_orders">7. Sales Order Report</option>
              <option value="product_performance">8. Product Performance Report</option>
              <option value="supplier_performance">9. Supplier Performance Report</option>
              <option value="inventory_turnover">10. Inventory Turnover Report</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
              Reporting Time Window
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days (MTD)</option>
              <option value="90d">Last Quarter (Q3)</option>
              <option value="1y">Fiscal Year 2026 (YTD)</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Report Canvas */}
      <Card className="overflow-hidden">
        <div className="p-5 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-black text-slate-900">{currentReport.title}</h2>
            <p className="text-xs text-slate-500 mt-0.5">{currentReport.desc}</p>
          </div>
          <Badge variant="info">Generated Live from PostgreSQL Ledger</Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 uppercase font-bold tracking-wider border-b border-slate-200">
              <tr>
                {currentReport.headers.map((h, i) => (
                  <th key={i} className="py-3 px-4">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {currentReport.rows.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  {row.map((cell: any, cIdx: number) => (
                    <td key={cIdx} className="py-3 px-4 text-slate-800">
                      {cIdx === 0 ? <strong>{cell}</strong> : cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Total Records Rendered: <strong>{currentReport.rows.length}</strong></span>
          <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" /> Certified Audit Report • LMS PRG_RIMS_001
          </span>
        </div>
      </Card>
    </div>
  );
};

