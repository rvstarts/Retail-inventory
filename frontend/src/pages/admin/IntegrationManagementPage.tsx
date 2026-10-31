import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useToast } from '../../context/ToastContext';
import {
  Cpu,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  Server,
  Activity,
  ArrowLeftRight,
} from 'lucide-react';

export const IntegrationManagementPage: React.FC = () => {
  const { addToast } = useToast();
  const [syncingSystem, setSyncingSystem] = useState<string | null>(null);

  const [integrations, setIntegrations] = useState([
    {
      id: 'sap',
      name: 'SAP S/4HANA Enterprise ERP',
      type: 'ERP',
      endpoint: 'https://sap.xyzretail.com/sap/opu/odata/sap/MM_PUR_PO_MAINT_V2',
      status: 'CONNECTED',
      lastSync: '2026-10-31 16:00:15',
      syncFrequency: 'Every 15 Minutes',
      entities: 'Master Catalog, Purchase Orders, Material Ledger',
    },
    {
      id: 'tally',
      name: 'Tally Prime Gold Accounting',
      type: 'ACCOUNTING',
      endpoint: 'http://localhost:9000/tally-xml-server',
      status: 'CONNECTED',
      lastSync: '2026-10-31 15:45:00',
      syncFrequency: 'Real-time on Sales Invoice',
      entities: 'Sales Invoices, Tax Ledgers, Credit Notes',
    },
    {
      id: 'bluedart',
      name: 'BlueDart Express Courier API',
      type: 'LOGISTICS',
      endpoint: 'https://netconnect.bluedart.com/Ver1.10/ShippingAPI/Waybill',
      status: 'CONNECTED',
      lastSync: '2026-10-31 16:15:30',
      syncFrequency: 'On Dispatch & Webhooks',
      entities: 'AWB Generation, Real-Time Geo Tracking',
    },
  ]);

  const [logs, setLogs] = useState<any[]>([
    { id: '1', system: 'SAP S/4HANA ERP', event: 'PO_STATUS_SYNC', status: 'SUCCESS', records: 8, timestamp: '16:00:15', responseMs: 142 },
    { id: '2', system: 'Tally Prime Gold', event: 'SALES_INVOICE_PUSH', status: 'SUCCESS', records: 4, timestamp: '15:45:00', responseMs: 88 },
    { id: '3', system: 'BlueDart Express', event: 'AWB_GENERATION', status: 'SUCCESS', records: 2, timestamp: '15:30:10', responseMs: 210 },
  ]);

  const handleTriggerSync = (sysId: string) => {
    setSyncingSystem(sysId);
    setTimeout(() => {
      setSyncingSystem(null);
      const target = integrations.find((i) => i.id === sysId);
      const newLog = {
        id: String(Date.now()),
        system: target?.name || 'External System',
        event: 'MANUAL_DELTA_SYNC',
        status: 'SUCCESS',
        records: Math.floor(5 + Math.random() * 15),
        timestamp: new Date().toLocaleTimeString(),
        responseMs: Math.floor(90 + Math.random() * 150),
      };
      setLogs([newLog, ...logs]);
      addToast('success', 'Sync Successful', `Bidirectional data sync completed with ${target?.name}.`);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
            <Cpu className="w-6 h-6 text-blue-600" /> Enterprise ERP & Accounting Integrations (Epic 8)
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Bi-directional data exchange connectors for SAP ERP, Tally Prime, and courier gateways.
          </p>
        </div>
      </div>

      {/* Integration Connectors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {integrations.map((sys) => (
          <Card key={sys.id} className="p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{sys.name}</h3>
                  <Badge variant="info" className="mt-1">{sys.type}</Badge>
                </div>
                <Badge variant="success">ONLINE</Badge>
              </div>

              <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Data Scope</span>
                  <span className="font-semibold text-slate-800">{sys.entities}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Sync Cadence</span>
                  <span className="text-slate-700">{sys.syncFrequency}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Last Synced</span>
                  <span className="font-mono text-slate-500">{sys.lastSync}</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100">
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleTriggerSync(sys.id)}
                loading={syncingSystem === sys.id}
                className="w-full justify-center flex items-center gap-1.5 text-xs shadow-xs"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Trigger Manual Sync
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Sync Telemetry Log Table */}
      <Card className="overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-slate-800 text-sm">Integration Exchange Telemetry</h3>
          </div>
          <span className="text-xs text-slate-500">Live Webhook / REST Journal</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 uppercase font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">System Adapter</th>
                <th className="py-3 px-3">Event Signature</th>
                <th className="py-3 px-3 text-center">Records Synced</th>
                <th className="py-3 px-3 text-center">Latency</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">{log.system}</td>
                  <td className="py-3 px-3 font-mono text-blue-600 font-semibold">{log.event}</td>
                  <td className="py-3 px-3 text-center font-bold text-slate-800">{log.records}</td>
                  <td className="py-3 px-3 text-center font-mono text-slate-500">{log.responseMs} ms</td>
                  <td className="py-3 px-3">
                    <Badge variant={log.status === 'SUCCESS' ? 'success' : 'danger'}>
                      {log.status}
                    </Badge>
                  </td>
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

