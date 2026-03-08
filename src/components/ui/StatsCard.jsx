const StatsCard = ({ title, value, icon: Icon, color = 'primary', trend }) => {
  const colorMap = {
    primary: 'bg-primary-500/10 text-primary-500',
    blue: 'bg-blue-500/10 text-blue-500',
    purple: 'bg-purple-500/10 text-purple-500',
    orange: 'bg-orange-500/10 text-orange-500',
  };

  return (
    <div className="card hover:border-dark-600 transition-all duration-300 group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-dark-400 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-white mt-2 font-mono">{value}</p>
          {trend && (
            <p className="text-xs text-primary-500 mt-2">
              {trend}
            </p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl ${colorMap[color]} flex items-center justify-center group-hover:scale-110 transition-transform`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
