import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-dark-800 border border-dark-700 rounded-lg px-3 py-2 shadow-xl">
        <p className="text-dark-400 text-xs">{label}</p>
        <p className="text-white font-semibold">{payload[0].value} posts</p>
      </div>
    );
  }
  return null;
};

const PostsChart = ({ data }) => {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-white mb-6">Posts Overview</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
          <YAxis stroke="#64748b" fontSize={12} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="posts" fill="#33a381" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PostsChart;
