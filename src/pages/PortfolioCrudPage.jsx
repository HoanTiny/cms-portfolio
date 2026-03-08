import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DataTable from '../components/tables/DataTable';
import Modal from '../components/ui/Modal';
import toast from 'react-hot-toast';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineX } from 'react-icons/hi';

/**
 * Generic CRUD page for portfolio items (Skills, Services, Experiences, Projects, Stats, Research)
 */
const PortfolioCrudPage = ({ title, subtitle, apiService, queryKey, fields, dataKey }) => {
  const queryClient = useQueryClient();
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });
  const [formModal, setFormModal] = useState({ open: false, data: null });
  const [formData, setFormData] = useState({});

  const { data, isLoading } = useQuery({
    queryKey: [queryKey],
    queryFn: () => apiService.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: (d) => apiService.create(d),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: [queryKey] }); toast.success('Created!'); setFormModal({ open: false, data: null }); },
    onError: (err) => toast.error(err.response?.data?.error || 'Create failed'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data: d }) => apiService.update(id, d),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: [queryKey] }); toast.success('Updated!'); setFormModal({ open: false, data: null }); },
    onError: (err) => toast.error(err.response?.data?.error || 'Update failed'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => apiService.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: [queryKey] }); toast.success('Deleted!'); },
    onError: (err) => toast.error(err.response?.data?.error || 'Delete failed'),
  });

  const openCreate = () => {
    const init = {};
    fields.forEach((f) => { init[f.key] = f.defaultValue ?? ''; });
    setFormData(init);
    setFormModal({ open: true, data: null });
  };

  const openEdit = (item) => {
    const init = {};
    fields.forEach((f) => {
      init[f.key] = f.key === 'techStack' ? (item[f.key]?.join(', ') || '') : (item[f.key] ?? '');
    });
    setFormData(init);
    setFormModal({ open: true, data: item });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...formData };
    // Convert techStack from string to array
    if (payload.techStack && typeof payload.techStack === 'string') {
      payload.techStack = payload.techStack.split(',').map((s) => s.trim()).filter(Boolean);
    }
    // Convert order to number
    if (payload.order) payload.order = Number(payload.order);

    if (formModal.data) {
      updateMutation.mutate({ id: formModal.data._id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const items = data?.data?.data?.[dataKey] || [];

  // Build table columns from fields
  const columns = fields
    .filter((f) => f.showInTable)
    .map((f) => ({
      key: f.key,
      label: f.label,
      render: (row) => {
        if (f.key === 'techStack') return <span className="text-dark-300 text-xs">{row[f.key]?.join(', ')}</span>;
        if (f.key === 'type') return (
          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${row.type === 'work' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'}`}>
            {row.type}
          </span>
        );
        if (f.key === 'group') return <span className="text-dark-400 text-xs">{row.group}</span>;
        return <span className="text-dark-300">{String(row[f.key] || '—').substring(0, 60)}</span>;
      },
    }));

  // Add actions column
  columns.push({
    key: 'actions', label: 'Actions', width: '100px',
    render: (row) => (
      <div className="flex items-center gap-1">
        <button onClick={() => openEdit(row)} className="p-1.5 text-dark-400 hover:text-primary-500 hover:bg-dark-700 rounded-lg transition-all"><HiOutlinePencil size={16} /></button>
        <button onClick={() => setDeleteModal({ open: true, id: row._id })} className="p-1.5 text-dark-400 hover:text-red-500 hover:bg-dark-700 rounded-lg transition-all"><HiOutlineTrash size={16} /></button>
      </div>
    ),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          <p className="text-dark-400 text-sm mt-1">{subtitle}</p>
        </div>
        <button onClick={openCreate} className="btn-primary"><HiOutlinePlus size={18} /> Add New</button>
      </div>

      <DataTable columns={columns} data={items} loading={isLoading} />

      {/* Form Modal */}
      {formModal.open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setFormModal({ open: false, data: null })} />
          <div className="relative bg-dark-800 border border-dark-700 rounded-2xl p-6 w-full max-w-lg animate-scaleIn max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">{formModal.data ? `Edit ${title.slice(0, -1)}` : `New ${title.slice(0, -1)}`}</h3>
              <button onClick={() => setFormModal({ open: false, data: null })} className="text-dark-400 hover:text-white"><HiOutlineX size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {fields.map((f) => (
                <div key={f.key}>
                  <label className="label">{f.label}{f.required ? ' *' : ''}</label>
                  {f.type === 'textarea' ? (
                    <textarea value={formData[f.key]} onChange={(e) => setFormData({ ...formData, [f.key]: e.target.value })} className="input-field" rows={3} placeholder={f.placeholder} />
                  ) : f.type === 'select' ? (
                    <select value={formData[f.key]} onChange={(e) => setFormData({ ...formData, [f.key]: e.target.value })} className="input-field">
                      {f.options?.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  ) : f.type === 'checkbox' ? (
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={!!formData[f.key]} onChange={(e) => setFormData({ ...formData, [f.key]: e.target.checked })} className="w-4 h-4 accent-primary-500" />
                      <span className="text-sm text-dark-300">{f.placeholder || 'Yes'}</span>
                    </label>
                  ) : (
                    <input type={f.type || 'text'} value={formData[f.key]} onChange={(e) => setFormData({ ...formData, [f.key]: e.target.value })} className="input-field" placeholder={f.placeholder} />
                  )}
                </div>
              ))}
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setFormModal({ open: false, data: null })} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">{formModal.data ? 'Save' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Modal isOpen={deleteModal.open} onClose={() => setDeleteModal({ open: false, id: null })} onConfirm={() => deleteMutation.mutate(deleteModal.id)} title="Delete Item" message="Are you sure? This action cannot be undone." />
    </div>
  );
};

export default PortfolioCrudPage;
