import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Lock, User, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('superadmin');
  const [password, setPassword] = useState('Password123!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(username, password);
      addToast('success', 'Logged in successfully', `Welcome back, ${username}!`);
      navigate('/dashboard');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Invalid username or password';
      setError(msg);
      addToast('error', 'Authentication Failed', msg);
    } finally {
      setLoading(false);
    }
  };

  const setDemoCredentials = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 flex flex-col justify-center items-center p-6 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden relative z-10">
        {/* Brand Banner */}
        <div className="bg-slate-900 p-8 text-center text-white relative">
          <div className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-2xl mx-auto flex items-center justify-center text-white font-extrabold text-2xl shadow-lg shadow-blue-500/30 mb-3 border border-blue-400/20">
            R
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            RIMS <span className="text-blue-400">Enterprise</span>
          </h1>
          <p className="text-xs text-slate-300 font-medium mt-1">
            Retail Inventory Management System • XYZ Retail Corp
          </p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-900/50 text-blue-300 border border-blue-700/50 text-[11px] font-semibold mt-3">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> Academic & Industry Project PRG_RIMS_001
          </div>
        </div>

        {/* Login Form */}
        <div className="p-8 space-y-6">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Username or Email
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. superadmin"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full justify-center shadow-md shadow-blue-500/20"
            >
              Sign In to RIMS Portal <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </form>

          {/* Quick Demo Logins */}
          <div className="pt-4 border-t border-slate-200">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center mb-3">
              One-Click Demo Roles
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setDemoCredentials('superadmin', 'Password123!')}
                className="p-2 border border-slate-200 rounded-lg text-left hover:border-blue-500 hover:bg-blue-50/50 transition-colors group"
              >
                <div className="font-bold text-slate-800 group-hover:text-blue-600">Super Admin</div>
                <div className="text-[10px] text-slate-500">Full system access</div>
              </button>

              <button
                type="button"
                onClick={() => setDemoCredentials('wh_manager', 'Password123!')}
                className="p-2 border border-slate-200 rounded-lg text-left hover:border-blue-500 hover:bg-blue-50/50 transition-colors group"
              >
                <div className="font-bold text-slate-800 group-hover:text-blue-600">WH Manager</div>
                <div className="text-[10px] text-slate-500">Warehouse stock & dispatch</div>
              </button>

              <button
                type="button"
                onClick={() => setDemoCredentials('store_manager', 'Password123!')}
                className="p-2 border border-slate-200 rounded-lg text-left hover:border-blue-500 hover:bg-blue-50/50 transition-colors group"
              >
                <div className="font-bold text-slate-800 group-hover:text-blue-600">Store Manager</div>
                <div className="text-[10px] text-slate-500">Store retail operations</div>
              </button>

              <button
                type="button"
                onClick={() => setDemoCredentials('procure_manager', 'Password123!')}
                className="p-2 border border-slate-200 rounded-lg text-left hover:border-blue-500 hover:bg-blue-50/50 transition-colors group"
              >
                <div className="font-bold text-slate-800 group-hover:text-blue-600">Procurement</div>
                <div className="text-[10px] text-slate-500">POs & Suppliers</div>
              </button>
            </div>
          </div>
        </div>

        {/* Security Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5 font-medium">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>JWT Stateless Session • Spring Security 6 • BCrypt 12 Rounds</span>
        </div>
      </div>
    </div>
  );
};

