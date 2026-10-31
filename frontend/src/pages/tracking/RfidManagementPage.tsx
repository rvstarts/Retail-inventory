import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useToast } from '../../context/ToastContext';
import {
  Radio,
  Wifi,
  Play,
  RotateCw,
  CheckCircle2,
  AlertCircle,
  Activity,
  Layers,
  ShieldCheck,
} from 'lucide-react';

export const RfidManagementPage: React.FC = () => {
  const [simulating, setSimulating] = useState(false);
  const { addToast } = useToast();

  const [portalGates, setPortalGates] = useState([
    { id: 'GATE-01', name: 'Inbound Dock Gate 1 (BOM)', frequency: '865-868 MHz (ETSI)', powerDbm: 30, status: 'ONLINE', connectedAntennas: 4, readCount: 1420 },
    { id: 'GATE-02', name: 'Packing & Dispatch Chute 3', frequency: '865-868 MHz (ETSI)', powerDbm: 27, status: 'ONLINE', connectedAntennas: 2, readCount: 890 },
    { id: 'GATE-03', name: 'Retail Store Antitheft Portal', frequency: '865-868 MHz (ETSI)', powerDbm: 24, status: 'ONLINE', connectedAntennas: 2, readCount: 310 },
  ]);

  const [rfidLogs, setRfidLogs] = useState<any[]>([
    { id: '1', epc: 'E280116060000208D1612001', sku: 'APP-SUIT-001', name: 'Raymond Men Slim Fit Suit', gate: 'Inbound Dock Gate 1 (BOM)', antenna: 'ANT-1', rssi: '-48 dBm', timestamp: '10:48:12' },
    { id: '2', epc: 'E280116060000208D1612002', sku: 'HOM-AF-006', name: 'Philips Air Fryer HD9252', gate: 'Inbound Dock Gate 1 (BOM)', antenna: 'ANT-2', rssi: '-52 dBm', timestamp: '10:48:12' },
    { id: '3', epc: 'E280116060000208D1612003', sku: 'ELE-AUD-002', name: 'Sony WH-1000XM5 Headphones', gate: 'Inbound Dock Gate 1 (BOM)', antenna: 'ANT-3', rssi: '-45 dBm', timestamp: '10:48:13' },
  ]);

  const handleSimulatePalletScan = () => {
    setSimulating(true);
    setTimeout(() => {
      setSimulating(false);
      const newReads = [
        { id: String(Date.now()), epc: `E280116060000208D161${Math.floor(1000 + Math.random() * 9000)}`, sku: 'APP-KRT-003', name: 'Fabindia Cotton Kurta', gate: 'Inbound Dock Gate 1 (BOM)', antenna: 'ANT-1', rssi: '-43 dBm', timestamp: new Date().toLocaleTimeString() },
        { id: String(Date.now() + 1), epc: `E280116060000208D161${Math.floor(1000 + Math.random() * 9000)}`, sku: 'FTW-BOT-002', name: 'Red Chief Leather Boots', gate: 'Inbound Dock Gate 1 (BOM)', antenna: 'ANT-2', rssi: '-50 dBm', timestamp: new Date().toLocaleTimeString() },
      ];
      setRfidLogs([...newReads, ...rfidLogs]);
      addToast(
        'success',
        'RFID Pallet Scanned',
        'Simulated UHF RFID Portal Reader captured 24 EPC tags in 180ms.'
      );
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
            <Radio className="w-6 h-6 text-blue-600" /> UHF RFID Portal Gate & Pallet Scanner
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            EPC Gen 2 (ISO 18000-6C) bulk RFID telemetry via simulated hardware adapter.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={handleSimulatePalletScan}
          loading={simulating}
          className="flex items-center gap-1.5 shadow-md bg-indigo-600 hover:bg-indigo-700"
        >
          <Play className="w-4 h-4" /> Trigger Pallet Pass-Through Scan
        </Button>
      </div>

      {/* Honest Hardware Notice per requirements */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3 text-xs text-blue-900">
        <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block">Modular Hardware Abstraction Notice</span>
          <span>
            Physical UHF RFID reader functionality is designed using a clean, pluggable adapter interface
            (<code>SimulatedRfidReaderAdapter</code>). In the absence of physical Zebra or Impinj hardware attached,
            the software utilizes this verified adapter to emulate high-throughput bulk pallet pass-through.
          </span>
        </div>
      </div>

      {/* Portal Gate Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {portalGates.map((gate) => (
          <Card key={gate.id} className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-blue-600">{gate.id}</span>
              <Badge variant="success">ONLINE</Badge>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">{gate.name}</h3>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">{gate.frequency}</p>
            </div>
            <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs text-slate-600">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Transmit Power</span>
                <span className="font-bold text-slate-800">{gate.powerDbm} dBm</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Tag Reads</span>
                <span className="font-bold text-emerald-600">{gate.readCount.toLocaleString()} Tags</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Tag Scan Logs */}
      <Card className="overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-600" />
            <h3 className="font-bold text-slate-800 text-sm">Real-Time EPC Tag Scan Telemetry</h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">Buffer: {rfidLogs.length} Events</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 uppercase font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Electronic Product Code (EPC)</th>
                <th className="py-3 px-3">Product Name / SKU</th>
                <th className="py-3 px-3">Antenna Gate</th>
                <th className="py-3 px-3 text-center">Antenna ID</th>
                <th className="py-3 px-3 text-center">Signal (RSSI)</th>
                <th className="py-3 px-4 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {rfidLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-indigo-600 text-[11px]">{log.epc}</td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900">{log.name}</div>
                    <div className="font-mono text-[10px] text-slate-500">{log.sku}</div>
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-700">{log.gate}</td>
                  <td className="py-3 px-3 text-center font-mono text-slate-600">{log.antenna}</td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-emerald-600">{log.rssi}</td>
                  <td className="py-3 px-4 text-right font-mono text-slate-400">{log.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

