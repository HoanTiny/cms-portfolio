import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mediaAPI } from '../services/api';
import Modal from '../components/ui/Modal';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import {
  HiOutlineUpload,
  HiOutlineTrash,
  HiOutlinePhotograph,
} from 'react-icons/hi';

const Media = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });
  const [uploading, setUploading] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['media', page],
    queryFn: () => mediaAPI.getAll({ page, limit: 20 }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => mediaAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
      toast.success('Media deleted!');
    },
    onError: (err) => toast.error(err.response?.data?.error || 'Delete failed'),
  });

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setUploading(true);
    try {
      await mediaAPI.upload(formData);
      queryClient.invalidateQueries({ queryKey: ['media'] });
      toast.success('File uploaded successfully!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const mediaList = data?.data?.data || [];
  const pagination = data?.data?.pagination;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Media Library</h1>
          <p className="text-dark-400 text-sm mt-1">Upload and manage your images</p>
        </div>
        <label className={`btn-primary cursor-pointer ${uploading ? 'opacity-50' : ''}`}>
          <HiOutlineUpload size={18} />
          {uploading ? 'Uploading...' : 'Upload Image'}
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
        </label>
      </div>

      {/* Upload area */}
      <div className="card border-2 border-dashed border-dark-600 hover:border-primary-500/50 transition-colors">
        <label className="flex flex-col items-center justify-center py-8 cursor-pointer">
          <HiOutlinePhotograph size={48} className="text-dark-600 mb-3" />
          <p className="text-dark-400 text-sm">Drag & drop or click to upload</p>
          <p className="text-dark-600 text-xs mt-1">PNG, JPG, GIF, WEBP up to 5MB</p>
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
        </label>
      </div>

      {/* Grid */}
      {isLoading ? (
        <LoadingSkeleton type="grid" />
      ) : mediaList.length === 0 ? (
        <div className="card text-center py-16">
          <HiOutlinePhotograph size={48} className="text-dark-600 mx-auto mb-3" />
          <p className="text-dark-400">No media files yet</p>
          <p className="text-dark-600 text-sm">Upload your first image above</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {mediaList.map((media) => (
              <div key={media._id} className="card p-0 group overflow-hidden hover:border-dark-600 transition-all">
                <div className="relative aspect-square bg-dark-900">
                  <img
                    src={`/${media.path}`}
                    alt={media.originalname}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => setDeleteModal({ open: true, id: media._id })}
                      className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <HiOutlineTrash size={18} />
                    </button>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-xs text-dark-300 truncate">{media.originalname}</p>
                  <p className="text-xs text-dark-500 mt-0.5">
                    {(media.size / 1024).toFixed(1)} KB • {format(new Date(media.createdAt), 'MMM d')}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2">
              {[...Array(pagination.totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setPage(i + 1)}
                  className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                    pagination.currentPage === i + 1
                      ? 'bg-primary-500 text-white'
                      : 'bg-dark-800 text-dark-400 hover:bg-dark-700'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, id: null })}
        onConfirm={() => deleteMutation.mutate(deleteModal.id)}
        title="Delete Media"
        message="Are you sure? This will permanently delete the file."
      />
    </div>
  );
};

export default Media;
