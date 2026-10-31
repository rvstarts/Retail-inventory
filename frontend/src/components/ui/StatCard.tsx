import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  change?: string;
  color?: 'blue' | 'indigo' | 'emerald' | 'amber' | 'rose' | 'purple' | 'cyan' | 'violet';
  description?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  trendUp = true,
  change,
  color = 'blue',
  description,
}) => {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    cyan: 'bg-cyan-50 text-cyan-600 border-cyan-100',
    violet: 'bg-violet-50 text-violet-600 border-violet-100',
  };

  const isUp = trend === 'up' || trendUp;

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{title}</span>
        <div className={`p-2 rounded-xl border ${colorMap[color] || colorMap.blue}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="mt-2.5 flex items-baseline gap-2">
        <span className="text-xl font-extrabold tracking-tight text-slate-900">{value}</span>
      </div>
      {(change || description) && (
        <div className="mt-1 flex items-center gap-1.5 text-[11px]">
          {trend && (
            <span
              className={`font-bold px-1.5 py-0.2 rounded ${
                isUp ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'
              }`}
            >
              {isUp ? '↑' : '↓'}
            </span>
          )}
          <span className="text-slate-500 font-medium truncate">{change || description}</span>
        </div>
      )}
    </div>
  );
};
