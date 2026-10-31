import React, { useState } from 'react';
import { mockProducts } from '../../api/mockData';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useToast } from '../../context/ToastContext';
import {
  ScanBarcode,
  Search,
  Camera,
  CheckCircle2,
  ArrowDownLeft,
  ArrowUpRight,
  Printer,
  History,
  AlertCircle,
} from 'lucide-react';

export const BarcodeScannerPage: React.FC = () => {
  const [barcodeInput, setBarcodeInput] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<any | null>(mockProducts[0]);
  const [scanQty, setScanQty] = useState(1);
  const [scanHistory, setScanHistory] = useState<any[]>([
    { id: '1', barcode: '890123400001', sku: 'APP-SUIT-001', name: 'Raymond Men Slim Fit Suit', action: 'LOOKUP', timestamp: '10:45 AM' },
    { id: '2', barcode: '890123400004', sku: 'HOM-VAC-004', name: 'Eureka Forbes Robot Vacuum', action: 'VERIFY', timestamp: '10:50 AM' },
  ]);
  const { addToast } = useToast();

  const handleLookup = (code: string) => {
    const found = mockProducts.find(
      (p) => p.barcode === code || p.sku.toLowerCase() === code.toLowerCase()
    );

    if (found) {
      setSelectedProduct(found);
      addToast('success', 'Barcode Verified', `Identified: ${found.name} (${found.sku})`);
      setScanHistory([
        {
          id: String(Date.now()),
          barcode: code,
          sku: found.sku,
          name: found.name,
          action: 'LOOKUP',
          timestamp: new Date().toLocaleTimeString(),
        },
        ...scanHistory,
      ]);
    } else {
      addToast('error', 'Barcode Not Found', `No catalog item registered for barcode: ${code}`);
    }
  };

  const handleStockAction = (type: 'STOCK_IN' | 'STOCK_OUT') => {
    if (!selectedProduct) return;
    addToast(
      'success',
      type === 'STOCK_IN' ? 'Stock-In Verified' : 'Stock-Out Verified',
      `Processed ${scanQty} unit(s) of ${selectedProduct.name} via barcode scan.`
    );
    setScanHistory([
      {
        id: String(Date.now()),
        barcode: selectedProduct.barcode,
        sku: selectedProduct.sku,
        name: selectedProduct.name,
        action: type,
        timestamp: new Date().toLocaleTimeString(),
      },
      ...scanHistory,
    ]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
            <ScanBarcode className="w-6 h-6 text-blue-600" /> Barcode Scanning & Verification Engine
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Standard Code 128 / EAN-13 scanning terminal with instantaneous stock identification.
          </p>
        </div>

        <Badge variant="success" className="text-xs py-1 px-3">
          Scanner Engine: Active & Listening
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Scanner Input & Active Product */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <ScanBarcode className="w-4 h-4 text-blue-600" /> Barcode Reader Terminal
            </h3>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <ScanBarcode className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleLookup(barcodeInput);
                    }
                  }}
                  placeholder="Scan with USB barcode scanner, or type barcode..."
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm font-mono font-semibold focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <Button
                variant="primary"
                onClick={() => handleLookup(barcodeInput)}
                className="flex items-center gap-1.5 shadow-xs"
              >
                <Search className="w-4 h-4" /> Decode
              </Button>
            </div>

            {/* Quick barcode test shortcuts */}
            <div className="pt-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Sample Barcode Test Chips (Click to Scan):
              </span>
              <div className="flex flex-wrap gap-2">
                {mockProducts.slice(0, 4).map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setBarcodeInput(p.barcode || '');
                      handleLookup(p.barcode || '');
                    }}
                    className="px-2.5 py-1 rounded bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 text-xs font-mono font-semibold border border-slate-200 transition-colors"
                  >
                    {p.barcode} ({p.sku})
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* Active Scanned Product Card */}
          {selectedProduct && (
            <Card className="p-6 border-2 border-blue-500/30 space-y-4">
              <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                <div>
                  <Badge variant="success">Decoded Match</Badge>
                  <h2 className="text-xl font-black text-slate-900 mt-1">{selectedProduct.name}</h2>
                  <p className="text-xs text-slate-500 font-mono">
                    SKU: <strong>{selectedProduct.sku}</strong> • Category: {selectedProduct.categoryName}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block font-bold uppercase">MSRP</span>
                  <span className="text-xl font-black text-blue-600">
                    ₹{selectedProduct.sellingPrice.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Code 128 Display */}
              <div className="bg-slate-50 p-4 rounded-xl text-center space-y-2 border border-slate-200">
                <div className="flex justify-center items-center h-12 gap-[2px]">
                  {Array.from({ length: 48 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-slate-900 h-full"
                      style={{
                        width: i % 4 === 0 ? '3px' : i % 2 === 0 ? '2px' : '1px',
                        opacity: i % 5 === 0 ? 0 : 1,
                      }}
                    />
                  ))}
                </div>
                <span className="font-mono text-sm font-bold text-slate-700 tracking-widest block">
                  {selectedProduct.barcode}
                </span>
              </div>

              {/* Instant Scan-To-Stock Actions */}
              <div className="pt-2 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700">Units:</span>
                  <input
                    type="number"
                    min="1"
                    value={scanQty}
                    onChange={(e) => setScanQty(parseInt(e.target.value) || 1)}
                    className="w-20 px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-center"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleStockAction('STOCK_IN')}
                    className="bg-emerald-600 hover:bg-emerald-700 flex items-center gap-1 text-xs"
                  >
                    <ArrowDownLeft className="w-3.5 h-3.5" /> Rapid Stock-In
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStockAction('STOCK_OUT')}
                    className="text-rose-600 hover:bg-rose-50 border-rose-200 flex items-center gap-1 text-xs"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" /> Rapid Stock-Out
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Right Column: Scan History */}
        <div className="space-y-6">
          <Card className="p-5 space-y-3">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
              <History className="w-4 h-4 text-blue-600" /> Recent Scan History
            </h3>

            <div className="space-y-2.5">
              {scanHistory.map((item) => (
                <div
                  key={item.id}
                  className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/70 text-xs space-y-0.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 truncate">{item.name}</span>
                    <Badge
                      variant={
                        item.action === 'STOCK_IN'
                          ? 'success'
                          : item.action === 'STOCK_OUT'
                          ? 'danger'
                          : 'info'
                      }
                    >
                      {item.action}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>{item.barcode}</span>
                    <span>{item.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

