import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';
import { Settings, Save, ShieldCheck, CheckCircle2, Building, DollarSign } from 'lucide-react';

export const ApplicationSettingsPage: React.FC = () => {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);

  const [settings, setSettings] = useState({
    companyName: 'XYZ Retail Corporation',
    systemCode: 'PRG_RIMS_001',
    defaultCurrency: 'INR (₹)',
    gstTaxRate: 18,
    defaultMinStock: 10,
    defaultReorderPoint: 25,
    sessionTimeoutMinutes: 60,
    lowStockAlertsEmail: 'inventory-alerts@xyzretail.com',
    enforceStrictNegativeStockPrevention: true,
    enableAutomatedPoTrigger: true,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      addToast('success', 'Configuration Saved', 'System operational parameters updated.');
    }, 500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
          <Settings className="w-6 h-6 text-blue-600" /> System Global Configuration
        </h1>
        <p className="text-sm text-slate-500 font-medium">
          Enterprise operational parameters, safety buffers, and integration flags.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <Card className="p-6 space-y-4">
          <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2 flex items-center gap-2">
            <Building className="w-4 h-4 text-blue-600" /> Enterprise Identity & Localization
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Company Legal Name
              </label>
              <input
                type="text"
                value={settings.companyName}
                onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                LMS Project Code
              </label>
              <input
                type="text"
                disabled
                value={settings.systemCode}
                className="w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-lg text-xs font-mono font-bold text-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Currency Standard
              </label>
              <input
                type="text"
                disabled
                value={settings.defaultCurrency}
                className="w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-lg text-xs font-bold text-slate-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Standard GST Rate (%)
              </label>
              <input
                type="number"
                value={settings.gstTaxRate}
                onChange={(e) => setSettings({ ...settings, gstTaxRate: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Inventory Safety & Governance
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Default Safety Stock Buffer (Units)
              </label>
              <input
                type="number"
                value={settings.defaultMinStock}
                onChange={(e) => setSettings({ ...settings, defaultMinStock: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Default Reorder Threshold (Units)
              </label>
              <input
                type="number"
                value={settings.defaultReorderPoint}
                onChange={(e) => setSettings({ ...settings, defaultReorderPoint: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold"
              />
            </div>

            <div className="col-span-2 space-y-3 pt-2">
              <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enforceStrictNegativeStockPrevention}
                  onChange={(e) => setSettings({ ...settings, enforceStrictNegativeStockPrevention: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <div>
                  <span className="font-bold text-xs text-slate-900 block">
                    Zero-Negative Inventory Invariant Enforcement
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Strictly block any transaction or order allocation that causes available stock to drop below 0.
                  </span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableAutomatedPoTrigger}
                  onChange={(e) => setSettings({ ...settings, enableAutomatedPoTrigger: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <div>
                  <span className="font-bold text-xs text-slate-900 block">
                    Automated PO Draft Trigger on Low Stock Breach
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Automatically draft a replenishment PO to primary vendor when stock breaches reorder point.
                  </span>
                </div>
              </label>
            </div>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button variant="primary" type="submit" loading={loading} className="flex items-center gap-1.5 shadow-md">
            <Save className="w-4 h-4" /> Save System Settings
          </Button>
        </div>
      </form>
    </div>
  );
};

