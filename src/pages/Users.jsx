import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersAPI } from '../services/api';
import DataTable from '../components/tables/DataTable';
import StatusBadge from '../components/ui/StatusBadge';
import Modal from '../components/ui/Modal';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineX } from 'react-icons/hi';

const Users = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });
  const [formModal, setFormModal] = useState({ open: false, data: null });
  const [formData, setFormData] = useState({ username: '', email: '', password: '', role: 'editor' });

  const { data, isLoading } = useQuery({
    queryKey: ['users', page],
    queryFn: () => usersAPI.getAll({ page, limit: 10 }),
  });

  const createMutation = useMutation({
    mutationFn: (data) => usersAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User created!');
      setFormModal({ open: false, data: null });
    },
    onError: (err) => toast.error(err.response?.data?.error || 'Create failed'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => usersAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User updated!');
      setFormModal({ open: false, data: null });
    },
    onError: (err) => toast.error(err.response?.data?.error || 'Update failed'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => usersAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User deleted!');
    },
    onError: (err) => toast.error(err.response?.data?.error || 'Delete failed'),
  });

  const openCreateModal = () => {
    setFormData({ username: '', email: '', password: '', role: 'editor' });
    setFormModal({ open: true, data: null });
  };

  const openEditModal = (user) => {
    setFormData({ username: user.username, email: user.email, password: '', role: user.role });
    setFormModal({ open: true, data: user });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email) return toast.error('Username and email are required');
    if (formModal.data) {
      const { password, ...updateData } = formData;
      updateMutation.mutate({ id: formModal.data._id, data: updateData });
    } else {
      if (!formData.password) return toast.error('Password is required');
      createMutation.mutate(formData);
    }
  };

  const columns = [
    {
      key: 'username',
      label: 'User',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary-500/20 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-primary-500 font-medium text-sm">{row.username?.charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <p className="font-medium text-dark-100">{row.username}</p>
            <p className="text-xs text-dark-500">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      label: 'Role',
      render: (row) => <StatusBadge status={row.role} />,
    },
    {
      key: 'createdAt',
      label: 'Joined',
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
          <h1 className="text-2xl font-bold text-white">Users</h1>
          <p className="text-dark-400 text-sm mt-1">Manage admin and editor accounts</p>
        </div>
        <button onClick={openCreateModal} className="btn-primary">
          <HiOutlinePlus size={18} /> New User
        </button>
      </div>

      <DataTable columns={columns} data={data?.data?.data} pagination={data?.data?.pagination} onPageChange={setPage} loading={isLoading} />

      {/* Form Modal */}
      {formModal.open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setFormModal({ open: false, data: null })} />
          <div className="relative bg-dark-800 border border-dark-700 rounded-2xl p-6 w-full max-w-md animate-scaleIn">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">{formModal.data ? 'Edit User' : 'New User'}</h3>
              <button onClick={() => setFormModal({ open: false, data: null })} className="text-dark-400 hover:text-white">
                <HiOutlineX size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Username *</label>
                <input value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} className="input-field" placeholder="Username" autoFocus />
              </div>
              <div>
                <label className="label">Email *</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="input-field" placeholder="Email" />
              </div>
              {!formModal.data && (
                <div>
                  <label className="label">Password *</label>
                  <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="input-field" placeholder="Min 6 characters" />
                </div>
              )}
              <div>
                <label className="label">Role</label>
                <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="input-field">
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setFormModal({ open: false, data: null })} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">{formModal.data ? 'Save Changes' : 'Create User'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, id: null })}
        onConfirm={() => deleteMutation.mutate(deleteModal.id)}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
      />
    </div>
  );
};

export default Users;
