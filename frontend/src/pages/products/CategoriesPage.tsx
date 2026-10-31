import React, { useState } from 'react';
import { mockCategories } from '../../api/mockData';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../context/ToastContext';
import { Layers, PlusCircle, Edit2, FolderTree, Package, CheckCircle2 } from 'lucide-react';

export const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<any[]>(mockCategories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCat, setSelectedCat] = useState<any | null>(null);
  const [formData, setFormData] = useState({ name: '', code: '', description: '' });
  const { addToast } = useToast();

  const handleOpenAdd = () => {
    setIsEditing(false);
    setSelectedCat(null);
    setFormData({ name: '', code: '', description: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: any) => {
    setIsEditing(true);
    setSelectedCat(cat);
    setFormData({ name: cat.name, code: cat.code, description: cat.description || '' });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && selectedCat) {
      setCategories(
        categories.map((c) => (c.id === selectedCat.id ? { ...c, ...formData } : c))
      );
      addToast('success', 'Category Updated', `Category "${formData.name}" has been updated.`);
    } else {
      const newCat = {
        id: String(Date.now()),
        ...formData,
        productCount: 0,
      };
      setCategories([...categories, newCat]);
      addToast('success', 'Category Created', `New category "${formData.name}" added.`);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
            <Layers className="w-6 h-6 text-blue-600" /> Category Hierarchy
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Manage product taxonomy, classification codes, and departmental organization.
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={handleOpenAdd} className="flex items-center gap-1.5 shadow-xs">
          <PlusCircle className="w-4 h-4" /> Add Category
        </Button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <Card key={cat.id} className="p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  {cat.code}
                </span>
                <button
                  onClick={() => handleOpenEdit(cat)}
                  className="p-1 text-slate-400 hover:text-blue-600 transition-colors"
                  title="Edit Category"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <h3 className="font-bold text-slate-800 text-base">{cat.name}</h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                {cat.description || 'Departmental category supporting inventory segregation.'}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 flex items-center gap-1">
                <Package className="w-3.5 h-3.5 text-slate-400" /> Catalog items:
              </span>
              <span className="font-bold text-slate-800">{cat.productCount || 4} Products</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Add / Edit Category Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditing ? 'Edit Category' : 'Create New Category'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Category Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Footwear"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Category Code *
            </label>
            <input
              type="text"
              required
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              placeholder="e.g. CAT_FTW"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-bold text-blue-600 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Departmental scope, target audience or item classifications..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {isEditing ? 'Save Changes' : 'Create Category'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

