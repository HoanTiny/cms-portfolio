import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { postsAPI, categoriesAPI } from '../services/api';
import toast from 'react-hot-toast';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import { HiOutlineArrowLeft } from 'react-icons/hi';

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['blockquote', 'code-block'],
    ['link', 'image'],
    ['clean'],
  ],
};

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: postData, isLoading } = useQuery({
    queryKey: ['post', id],
    queryFn: () => postsAPI.getOne(id),
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesAPI.getAll(),
  });

  const post = postData?.data?.data?.post;
  const categories = categoriesData?.data?.data?.categories || [];

  const { register, handleSubmit, control, formState: { errors } } = useForm({
    values: post
      ? {
          title: post.title,
          content: post.content,
          category: post.category?._id || '',
          tags: post.tags?.join(', ') || '',
          status: post.status,
          thumbnail: post.thumbnail || '',
        }
      : undefined,
  });

  const updateMutation = useMutation({
    mutationFn: (data) => postsAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post', id] });
      toast.success('Post updated successfully!');
      navigate('/posts');
    },
    onError: (err) => toast.error(err.response?.data?.error || 'Update failed'),
  });

  const onSubmit = (data) => {
    const payload = {
      ...data,
      tags: data.tags ? data.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      category: data.category || undefined,
    };
    updateMutation.mutate(payload);
  };

  if (isLoading) return <LoadingSkeleton type="table" rows={8} />;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/posts')} className="p-2 text-dark-400 hover:text-white hover:bg-dark-800 rounded-lg transition-colors">
          <HiOutlineArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">Edit Post</h1>
          <p className="text-dark-400 text-sm mt-1">Update post details</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="card space-y-5">
          <div>
            <label className="label">Title *</label>
            <input {...register('title', { required: 'Title is required' })} className="input-field" />
            {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Category</label>
              <select {...register('category')} className="input-field">
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Status</label>
              <select {...register('status')} className="input-field">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          <div>
            <label className="label">Tags</label>
            <input {...register('tags')} className="input-field" placeholder="react, javascript (comma separated)" />
          </div>

          <div>
            <label className="label">Thumbnail URL</label>
            <input {...register('thumbnail')} className="input-field" />
          </div>

          <div>
            <label className="label">Content *</label>
            <Controller
              name="content"
              control={control}
              rules={{ required: 'Content is required' }}
              render={({ field }) => (
                <ReactQuill theme="snow" modules={modules} {...field} />
              )}
            />
            {errors.content && <p className="text-red-400 text-xs mt-1">{errors.content.message}</p>}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button type="button" onClick={() => navigate('/posts')} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={updateMutation.isPending} className="btn-primary">
            {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPost;
