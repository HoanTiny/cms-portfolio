import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { postsAPI, categoriesAPI } from '../services/api';
import toast from 'react-hot-toast';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
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

const CreatePost = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { register, handleSubmit, control, formState: { errors } } = useForm({
    defaultValues: { title: '', content: '', category: '', tags: '', status: 'draft', thumbnail: '' },
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesAPI.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: (data) => postsAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Post created successfully!');
      navigate('/posts');
    },
    onError: (err) => toast.error(err.response?.data?.error || 'Create failed'),
  });

  const onSubmit = (data) => {
    const payload = {
      ...data,
      tags: data.tags ? data.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      category: data.category || undefined,
    };
    createMutation.mutate(payload);
  };

  const categories = categoriesData?.data?.data?.categories || [];

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/posts')} className="p-2 text-dark-400 hover:text-white hover:bg-dark-800 rounded-lg transition-colors">
          <HiOutlineArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">Create Post</h1>
          <p className="text-dark-400 text-sm mt-1">Write a new blog post</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="card space-y-5">
          {/* Title */}
          <div>
            <label className="label">Title *</label>
            <input {...register('title', { required: 'Title is required' })} className="input-field" placeholder="Enter post title" />
            {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
          </div>

          {/* Category & Status */}
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

          {/* Tags */}
          <div>
            <label className="label">Tags</label>
            <input {...register('tags')} className="input-field" placeholder="react, javascript, web (comma separated)" />
          </div>

          {/* Thumbnail */}
          <div>
            <label className="label">Thumbnail URL</label>
            <input {...register('thumbnail')} className="input-field" placeholder="https://example.com/image.jpg" />
          </div>

          {/* Content */}
          <div>
            <label className="label">Content *</label>
            <Controller
              name="content"
              control={control}
              rules={{ required: 'Content is required' }}
              render={({ field }) => (
                <ReactQuill theme="snow" modules={modules} placeholder="Write your post content..." {...field} />
              )}
            />
            {errors.content && <p className="text-red-400 text-xs mt-1">{errors.content.message}</p>}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button type="button" onClick={() => navigate('/posts')} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={createMutation.isPending} className="btn-primary">
            {createMutation.isPending ? 'Creating...' : 'Create Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
