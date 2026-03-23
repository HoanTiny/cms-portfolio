import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileAPI, mediaAPI } from '../services/api';
import toast from 'react-hot-toast';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import { HiOutlineSave, HiOutlineUpload } from 'react-icons/hi';

const ProfilePage = () => {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const { isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => profileAPI.get(),
    onSuccess: (res) => setForm(res.data.data.profile),
  });

  // Also initialize from data directly
  const { data } = useQuery({
    queryKey: ['profile'],
    queryFn: () => profileAPI.get(),
  });

  // Sync form when data arrives
  if (data && !form) {
    const p = data.data.data.profile;
    setForm(p);
  }

  const updateMutation = useMutation({
    mutationFn: (data) => profileAPI.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Profile updated!');
    },
    onError: (err) => toast.error(err.response?.data?.error || 'Update failed'),
  });

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await mediaAPI.uploadCV(formData);
      if (res.data?.data?.media?.path) {
        const path = res.data.data.media.path;
        setForm((prev) => ({ ...prev, cvLink: `${path}` }));
        toast.success('CV uploaded successfully!');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to upload CV');
    } finally {
      setIsUploading(false);
      e.target.value = ''; // Reset input
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate(form);
  };

  const set = (key, val) => setForm({ ...form, [key]: val });
  const setSocial = (key, val) => setForm({ ...form, socialLinks: { ...form.socialLinks, [key]: val } });

  if (isLoading || !form) return <LoadingSkeleton type="table" rows={8} />;

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Profile</h1>
        <p className="text-dark-400 text-sm mt-1">Manage your portfolio hero section & contact info</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="card space-y-4">
          <h3 className="text-lg font-semibold text-white">Basic Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Name *</label>
              <input value={form.name} onChange={(e) => set('name', e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="label">Title *</label>
              <input value={form.title} onChange={(e) => set('title', e.target.value)} className="input-field" />
            </div>
          </div>
          <div>
            <label className="label">Description</label>
            <textarea value={form.description} onChange={(e) => set('description', e.target.value)} className="input-field" rows={3} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Avatar URL</label>
              <input value={form.avatar} onChange={(e) => set('avatar', e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="label">CV Download Link</label>
              <div className="flex gap-2">
                <input value={form.cvLink} onChange={(e) => set('cvLink', e.target.value)} className="input-field flex-1" />
                <label className="btn-secondary cursor-pointer flex items-center gap-1 shrink-0 h-[42px] px-4 rounded-md bg-dark-600 hover:bg-dark-500 text-white transition-colors border border-dark-500">
                  <HiOutlineUpload size={18} /> {isUploading ? 'Uploading...' : 'Upload'}
                  <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleFileUpload} disabled={isUploading} />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="card space-y-4">
          <h3 className="text-lg font-semibold text-white">Contact Info</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="label">Email</label>
              <input value={form.email} onChange={(e) => set('email', e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="label">Phone</label>
              <input value={form.phone} onChange={(e) => set('phone', e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="label">Skype</label>
              <input value={form.skype} onChange={(e) => set('skype', e.target.value)} className="input-field" />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="card space-y-4">
          <h3 className="text-lg font-semibold text-white">Social Links</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">GitHub</label>
              <input value={form.socialLinks?.github || ''} onChange={(e) => setSocial('github', e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="label">LinkedIn</label>
              <input value={form.socialLinks?.linkedin || ''} onChange={(e) => setSocial('linkedin', e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="label">Facebook</label>
              <input value={form.socialLinks?.facebook || ''} onChange={(e) => setSocial('facebook', e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="label">Twitter</label>
              <input value={form.socialLinks?.twitter || ''} onChange={(e) => setSocial('twitter', e.target.value)} className="input-field" />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={updateMutation.isPending} className="btn-primary">
            <HiOutlineSave size={18} /> {updateMutation.isPending ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
