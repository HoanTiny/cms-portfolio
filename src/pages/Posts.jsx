import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { postsAPI } from '../services/api';
import DataTable from '../components/tables/DataTable';
import StatusBadge from '../components/ui/StatusBadge';
import Modal from '../components/ui/Modal';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import {
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineSearch,
} from 'react-icons/hi';

const Posts = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });

  const { data, isLoading } = useQuery({
    queryKey: ['posts', page, search],
    queryFn: () => postsAPI.getAll({ page, limit: 10, search }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => postsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Post deleted successfully');
    },
    onError: (err) => toast.error(err.response?.data?.error || 'Delete failed'),
  });

  const columns = [
    {
      key: 'title',
      label: 'Title',
      render: (row) => (
        <div className="max-w-xs">
          <p className="font-medium text-dark-100 truncate">{row.title}</p>
          <p className="text-xs text-dark-500 truncate mt-0.5">{row.slug}</p>
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Category',
      render: (row) => (
        <span className="text-dark-300">{row.category?.name || '—'}</span>
      ),
    },
    {
      key: 'author',
      label: 'Author',
      render: (row) => (
        <span className="text-dark-300">{row.author?.username || '—'}</span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'createdAt',
      label: 'Date',
      render: (row) => (
        <span className="text-dark-400 text-xs">
          {format(new Date(row.createdAt), 'MMM d, yyyy')}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      width: '100px',
      render: (row) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => navigate(`/posts/edit/${row._id}`)}
            className="p-1.5 text-dark-400 hover:text-primary-500 hover:bg-dark-700 rounded-lg transition-all"
          >
            <HiOutlinePencil size={16} />
          </button>
          <button
            onClick={() => setDeleteModal({ open: true, id: row._id })}
            className="p-1.5 text-dark-400 hover:text-red-500 hover:bg-dark-700 rounded-lg transition-all"
          >
            <HiOutlineTrash size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Posts</h1>
          <p className="text-dark-400 text-sm mt-1">Manage your blog posts</p>
        </div>
        <button onClick={() => navigate('/posts/create')} className="btn-primary">
          <HiOutlinePlus size={18} /> New Post
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <HiOutlineSearch className="absolute left-3 top-2.5 text-dark-500" size={18} />
          <input
            type="text"
            placeholder="Search posts..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="input-field pl-10"
          />
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={data?.data?.data}
        pagination={data?.data?.pagination}
        onPageChange={setPage}
        loading={isLoading}
      />

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, id: null })}
        onConfirm={() => deleteMutation.mutate(deleteModal.id)}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone."
      />
    </div>
  );
};

export default Posts;
