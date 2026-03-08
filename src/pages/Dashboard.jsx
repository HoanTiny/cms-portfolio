import { useQuery } from '@tanstack/react-query';
import { dashboardAPI } from '../services/api';
import StatsCard from '../components/ui/StatsCard';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import PostsChart from '../components/charts/PostsChart';
import StatusBadge from '../components/ui/StatusBadge';
import {
  HiOutlineDocumentText,
  HiOutlineUsers,
  HiOutlineFolder,
  HiOutlinePhotograph,
} from 'react-icons/hi';
import { format } from 'date-fns';

const Dashboard = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => dashboardAPI.getStats(),
  });

  const stats = data?.data?.data?.stats;
  const recentPosts = data?.data?.data?.recentPosts;
  const postsByStatus = data?.data?.data?.postsByStatus;

  // Generate chart data from postsByStatus
  const chartData = [
    { name: 'Published', posts: postsByStatus?.find((p) => p._id === 'published')?.count || 0 },
    { name: 'Draft', posts: postsByStatus?.find((p) => p._id === 'draft')?.count || 0 },
  ];

  if (isLoading) return <LoadingSkeleton type="cards" />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-dark-400 text-sm mt-1">Welcome back! Here's an overview.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Posts" value={stats?.totalPosts || 0} icon={HiOutlineDocumentText} color="primary" />
        <StatsCard title="Total Users" value={stats?.totalUsers || 0} icon={HiOutlineUsers} color="blue" />
        <StatsCard title="Categories" value={stats?.totalCategories || 0} icon={HiOutlineFolder} color="purple" />
        <StatsCard title="Media Files" value={stats?.totalMedia || 0} icon={HiOutlinePhotograph} color="orange" />
      </div>

      {/* Charts & Recent Posts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PostsChart data={chartData} />

        {/* Recent Posts */}
        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Posts</h3>
          <div className="space-y-3">
            {recentPosts?.map((post) => (
              <div
                key={post._id}
                className="flex items-center justify-between p-3 rounded-lg bg-dark-900/50 hover:bg-dark-700/50 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-dark-100 truncate">{post.title}</p>
                  <p className="text-xs text-dark-500 mt-0.5">
                    {post.author?.username} • {format(new Date(post.createdAt), 'MMM d, yyyy')}
                  </p>
                </div>
                <StatusBadge status={post.status} />
              </div>
            ))}
            {(!recentPosts || recentPosts.length === 0) && (
              <p className="text-dark-500 text-sm text-center py-8">No posts yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
