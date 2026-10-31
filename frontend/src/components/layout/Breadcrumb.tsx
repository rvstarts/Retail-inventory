import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export const Breadcrumb: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const formatTitle = (str: string) => {
    return str
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (pathnames.length === 0 || (pathnames.length === 1 && pathnames[0] === 'dashboard')) {
    return (
      <div className="flex items-center text-xs text-slate-500 py-1">
        <span className="font-semibold text-slate-700 flex items-center gap-1.5">
          <Home className="w-3.5 h-3.5 text-blue-600" /> Executive Overview
        </span>
      </div>
    );
  }

  return (
    <nav className="flex items-center space-x-1.5 text-xs text-slate-500 py-1">
      <Link
        to="/dashboard"
        className="hover:text-blue-600 flex items-center gap-1 font-medium text-slate-600 transition-colors"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Home</span>
      </Link>

      {pathnames.map((segment, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;

        return (
          <React.Fragment key={routeTo}>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            {isLast ? (
              <span className="font-semibold text-slate-800">{formatTitle(segment)}</span>
            ) : (
              <Link to={routeTo} className="hover:text-blue-600 text-slate-600 font-medium transition-colors">
                {formatTitle(segment)}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

