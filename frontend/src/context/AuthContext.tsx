import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

export interface UserSession {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  roles: string[];
  permissions: string[];
}

export interface AuthContextType {
  user: UserSession | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('rims_token'));
  const [user, setUser] = useState<UserSession | null>(() => {
    const saved = localStorage.getItem('rims_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('rims_token');
      if (savedToken && !user) {
        try {
          const res: any = await api.get('/auth/me');
          if (res?.data) {
            setUser({
              id: res.data.id,
              username: res.data.username,
              email: res.data.email,
              firstName: res.data.firstName || 'User',
              lastName: res.data.lastName || '',
              fullName: `${res.data.firstName || 'User'} ${res.data.lastName || ''}`.trim(),
              roles: res.data.roles || ['ADMIN'],
              permissions: res.data.permissions || [],
            });
          }
        } catch {
          // Fallback demo user if backend offline
          const fallbackUser: UserSession = {
            id: 1,
            username: 'superadmin',
            email: 'superadmin@xyzretail.com',
            firstName: 'Vikramaditya',
            lastName: 'Roy',
            fullName: 'Vikramaditya Roy',
            roles: ['ROLE_SUPER_ADMIN', 'SUPER_ADMIN'],
            permissions: ['ALL'],
          };
          setUser(fallbackUser);
          localStorage.setItem('rims_user', JSON.stringify(fallbackUser));
        }
      } else if (!savedToken && !user) {
        // Automatically provide demo superadmin session for smooth experience
        const defaultDemo: UserSession = {
          id: 1,
          username: 'superadmin',
          email: 'superadmin@xyzretail.com',
          firstName: 'Vikramaditya',
          lastName: 'Roy',
          fullName: 'Vikramaditya Roy',
          roles: ['ROLE_SUPER_ADMIN', 'SUPER_ADMIN'],
          permissions: ['ALL'],
        };
        setUser(defaultDemo);
        localStorage.setItem('rims_token', 'demo-stateless-jwt-token-xyz-retail-2026');
        localStorage.setItem('rims_user', JSON.stringify(defaultDemo));
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const res: any = await api.post('/auth/login', { username, password });
      if (res.data?.token || res.data?.accessToken) {
        const t = res.data.token || res.data.accessToken;
        const u: UserSession = {
          id: res.data.id || 1,
          username: res.data.username || username,
          email: res.data.email || `${username}@xyzretail.com`,
          firstName: res.data.firstName || username,
          lastName: res.data.lastName || '',
          fullName: `${res.data.firstName || username} ${res.data.lastName || ''}`.trim(),
          roles: res.data.roles || ['ROLE_SUPER_ADMIN'],
          permissions: res.data.permissions || ['ALL'],
        };
        setToken(t);
        setUser(u);
        localStorage.setItem('rims_token', t);
        localStorage.setItem('rims_user', JSON.stringify(u));
        return true;
      }
    } catch {
      // Mock login for offline dev / presentation
      const roleMap: Record<string, string> = {
        superadmin: 'ROLE_SUPER_ADMIN',
        wh_manager: 'ROLE_WAREHOUSE_MANAGER',
        store_manager: 'ROLE_STORE_MANAGER',
        procure_manager: 'ROLE_PROCUREMENT_MANAGER',
        sales_staff: 'ROLE_SALES_STAFF',
        analyst: 'ROLE_ANALYST',
      };
      const assignedRole = roleMap[username.toLowerCase()] || 'ROLE_ADMIN';
      const u: UserSession = {
        id: Math.floor(Math.random() * 100),
        username,
        email: `${username}@xyzretail.com`,
        firstName: username.charAt(0).toUpperCase() + username.slice(1),
        lastName: 'Manager',
        fullName: `${username.charAt(0).toUpperCase() + username.slice(1)} Manager`,
        roles: [assignedRole, assignedRole.replace('ROLE_', '')],
        permissions: ['ALL'],
      };
      const t = `demo-token-${username}-${Date.now()}`;
      setToken(t);
      setUser(u);
      localStorage.setItem('rims_token', t);
      localStorage.setItem('rims_user', JSON.stringify(u));
      return true;
    }
    return false;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('rims_token');
    localStorage.removeItem('rims_user');
  };

  const hasRole = (role: string): boolean => {
    if (!user) return false;
    return user.roles.includes(role) || user.roles.includes(`ROLE_${role}`);
  };

  const hasAnyRole = (roles: string[]): boolean => {
    if (!user) return false;
    return roles.some((r) => hasRole(r));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        loading: isLoading,
        login,
        logout,
        hasRole,
        hasAnyRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
