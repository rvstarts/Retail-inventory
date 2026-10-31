import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
}) => {
  const variantStyles = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs font-semibold px-2.5 py-1',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium uppercase tracking-wider ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${
        variant === 'success' ? 'bg-emerald-500' :
        variant === 'warning' ? 'bg-amber-500' :
        variant === 'danger' ? 'bg-rose-500' :
        variant === 'info' ? 'bg-blue-500' : 'bg-slate-400'
      }`} />
      {children}
    </span>
  );
};

export const statusToVariant = (status: string | undefined): 'success' | 'warning' | 'danger' | 'info' | 'neutral' => {
  if (!status) return 'neutral';
  const s = status.toUpperCase();
  if (['ACTIVE', 'DELIVERED', 'RECEIVED', 'COMPLETED', 'HEALTHY', 'RESTOCKED'].includes(s)) return 'success';
  if (['PENDING', 'PROCESSING', 'LOW_STOCK', 'PARTIALLY_RECEIVED', 'IN_TRANSIT', 'REQUESTED'].includes(s)) return 'warning';
  if (['OUT_OF_STOCK', 'CANCELLED', 'REJECTED', 'ERROR', 'DAMAGED'].includes(s)) return 'danger';
  if (['CONFIRMED', 'PICKED', 'PACKED', 'SHIPPED', 'APPROVED', 'SUBMITTED', 'DRAFT'].includes(s)) return 'info';
  return 'neutral';
};

