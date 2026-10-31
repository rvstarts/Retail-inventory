import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../context/ToastContext';
import {
  UserCheck,
  PlusCircle,
  Shield,
  Search,
  CheckCircle2,
  XCircle,
  Mail,
  Phone,
} from 'lucide-react';

export const UserManagementPage: React.FC = () => {
  const { addToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [users, setUsers] = useState<any[]>([
    { id: '1', username: 'superadmin', fullName: 'Vikramaditya Roy', email: 'superadmin@xyzretail.com', role: 'SUPER_ADMIN', status: 'ACTIVE', lastLogin: '2026-10-31 16:30' },
    { id: '2', username: 'admin', fullName: 'Pooja Verma', email: 'admin@xyzretail.com', role: 'ADMIN', status: 'ACTIVE', lastLogin: '2026-10-31 15:10' },
    { id: '3', username: 'wh_manager', fullName: 'Ramesh Patil', email: 'wh_manager@xyzretail.com', role: 'WAREHOUSE_MANAGER', status: 'ACTIVE', lastLogin: '2026-10-31 14:45' },
    { id: '4', username: 'store_manager', fullName: 'Anand Kumar', email: 'store_manager@xyzretail.com', role: 'STORE_MANAGER', status: 'ACTIVE', lastLogin: '2026-10-31 12:20' },
    { id: '5', username: 'inv_staff', fullName: 'Sunil Rao', email: 'inv_staff@xyzretail.com', role: 'INVENTORY_STAFF', status: 'ACTIVE', lastLogin: '2026-10-30 18:00' },
    { id: '6', username: 'procure_manager', fullName: 'Sneha Kulkarni', email: 'procure_manager@xyzretail.com', role: 'PROCUREMENT_MANAGER', status: 'ACTIVE', lastLogin: '2026-10-31 11:00' },
    { id: '7', username: 'sales_staff', fullName: 'Rahul Sharma', email: 'sales_staff@xyzretail.com', role: 'SALES_STAFF', status: 'ACTIVE', lastLogin: '2026-10-31 13:15' },
    { id: '8', username: 'analyst', fullName: 'Meera Nair', email: 'analyst@xyzretail.com', role: 'ANALYST', status: 'ACTIVE', lastLogin: '2026-10-29 09:30' },
  ]);

  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    role: 'INVENTORY_STAFF',
    password: 'Password123!',
  });

  const handleToggleStatus = (userId: string) => {
    setUsers(
      users.map((u) =>
        u.id === userId
          ? { ...u, status: u.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' }
          : u
      )
    );
    addToast('info', 'Status Updated', 'User account activation state toggled.');
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser = {
      id: String(Date.now()),
      ...formData,
      status: 'ACTIVE',
      lastLogin: 'Never',
    };
    setUsers([...users, newUser]);
    addToast('success', 'User Created', `User account for ${formData.fullName} created with role ${formData.role}.`);
    setIsModalOpen(false);
  };

  const filteredUsers = users.filter((u) => {
    return (
      u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-blue-600" /> Enterprise User Management & RBAC
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Manage enterprise operators, credential security, and role-based authorization.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 shadow-xs"
        >
          <PlusCircle className="w-4 h-4" /> Provision User Account
        </Button>
      </div>

      <Card className="p-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search users by name, username, role, or corporate email..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 uppercase font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Operator Name / Username</th>
                <th className="py-3 px-3">Corporate Email</th>
                <th className="py-3 px-3">Role Authority</th>
                <th className="py-3 px-3">Last Active</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{u.fullName}</div>
                    <div className="font-mono text-[11px] text-blue-600">@{u.username}</div>
                  </td>
                  <td className="py-3 px-3 text-slate-600">{u.email}</td>
                  <td className="py-3 px-3">
                    <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] text-slate-400">{u.lastLogin}</td>
                  <td className="py-3 px-3 text-center">
                    <Badge variant={u.status === 'ACTIVE' ? 'success' : 'neutral'}>
                      {u.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button
                      variant={u.status === 'ACTIVE' ? 'outline' : 'primary'}
                      size="sm"
                      onClick={() => handleToggleStatus(u.id)}
                      className="text-xs"
                    >
                      {u.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Provision User Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Provision New Operator">
        <form onSubmit={handleCreateUser} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="e.g. Ananya Sen"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Username *
              </label>
              <input
                type="text"
                required
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="e.g. ananya_sen"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-bold text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Corporate Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="ananya@xyzretail.com"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Assigned Role *
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-blue-500"
              >
                <option value="SUPER_ADMIN">SUPER_ADMIN (Full Access)</option>
                <option value="ADMIN">ADMIN</option>
                <option value="WAREHOUSE_MANAGER">WAREHOUSE_MANAGER</option>
                <option value="STORE_MANAGER">STORE_MANAGER</option>
                <option value="INVENTORY_STAFF">INVENTORY_STAFF</option>
                <option value="PROCUREMENT_MANAGER">PROCUREMENT_MANAGER</option>
                <option value="SALES_STAFF">SALES_STAFF</option>
                <option value="ANALYST">ANALYST (Read-Only Analytics)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Initial Password *
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Provision Account
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

