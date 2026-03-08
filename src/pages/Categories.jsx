import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoriesAPI } from '../services/api';
import DataTable from '../components/tables/DataTable';
import Modal from '../components/ui/Modal';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineX } from 'react-icons/hi';

const Categories = () => {
  const queryClient = useQueryClient();
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });
  const [formModal, setFormModal] = useState({ open: false, data: null });
  const [formData, setFormData] = useState({ name: '', description: '' });

  const { data, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesAPI.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: (data) => categoriesAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category created!');
      setFormModal({ open: false, data: null });
    },
    onError: (err) => toast.error(err.response?.data?.error || 'Create failed'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => categoriesAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category updated!');
      setFormModal({ open: false, data: null });
    },
    onError: (err) => toast.error(err.response?.data?.error || 'Update failed'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => categoriesAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category deleted!');
    },
    onError: (err) => toast.error(err.response?.data?.error || 'Delete failed'),
  });

  const openCreateModal = () => {
    setFormData({ name: '', description: '' });
    setFormModal({ open: true, data: null });
  };

  const openEditModal = (category) => {
    setFormData({ name: category.name, description: category.description || '' });
    setFormModal({ open: true, data: category });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return toast.error('Name is required');
    if (formModal.data) {
      updateMutation.mutate({ id: formModal.data._id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const categories = data?.data?.data?.categories || [];

  const columns = [
    {
      key: 'name',
      label: 'Name',
      render: (row) => <span className="font-medium text-dark-100">{row.name}</span>,
    },
    {
      key: 'slug',
      label: 'Slug',
      render: (row) => <span className="text-dark-400 font-mono text-xs">{row.slug}</span>,
    },
    {
      key: 'description',
      label: 'Description',
      render: (row) => (
        <span className="text-dark-400 text-sm truncate max-w-xs block">{row.description || '—'}</span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (row) => (
        <span className="text-dark-400 text-xs">{format(new Date(row.createdAt), 'MMM d, yyyy')}</span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      width: '100px',
      render: (row) => (
        <div className="flex items-center gap-1">
          <button onClick={() => openEditModal(row)} className="p-1.5 text-dark-400 hover:text-primary-500 hover:bg-dark-700 rounded-lg transition-all">
            <HiOutlinePencil size={16} />
          </button>
          <button onClick={() => setDeleteModal({ open: true, id: row._id })} className="p-1.5 text-dark-400 hover:text-red-500 hover:bg-dark-700 rounded-lg transition-all">
            <HiOutlineTrash size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Categories</h1>
          <p className="text-dark-400 text-sm mt-1">Manage post categories</p>
        </div>
        <button onClick={openCreateModal} className="btn-primary">
          <HiOutlinePlus size={18} /> New Category
        </button>
      </div>

      <DataTable columns={columns} data={categories} loading={isLoading} />

      {/* Form Modal */}
      {formModal.open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setFormModal({ open: false, data: null })} />
          <div className="relative bg-dark-800 border border-dark-700 rounded-2xl p-6 w-full max-w-md animate-scaleIn">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">
                {formModal.data ? 'Edit Category' : 'New Category'}
              </h3>
              <button onClick={() => setFormModal({ open: false, data: null })} className="text-dark-400 hover:text-white">
                <HiOutlineX size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Name *</label>
                <input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                  placeholder="Category name"
                  autoFocus
                />
              </div>
              <div>
                <label className="label">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field"
                  rows={3}
                  placeholder="Brief description"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setFormModal({ open: false, data: null })} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">
                  {formModal.data ? 'Save Changes' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, id: null })}
        onConfirm={() => deleteMutation.mutate(deleteModal.id)}
        title="Delete Category"
        message="Are you sure? Posts using this category will be unlinked."
      />
    </div>
  );
};

export default Categories;
