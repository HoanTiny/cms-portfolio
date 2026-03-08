const LoadingSkeleton = ({ type = 'table', rows = 5 }) => {
  if (type === 'cards') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card animate-pulse">
            <div className="flex justify-between">
              <div>
                <div className="h-4 w-20 bg-dark-700 rounded mb-3" />
                <div className="h-8 w-16 bg-dark-700 rounded" />
              </div>
              <div className="w-12 h-12 bg-dark-700 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'grid') {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="card p-0 animate-pulse">
            <div className="h-40 bg-dark-700 rounded-t-xl" />
            <div className="p-3">
              <div className="h-3 w-3/4 bg-dark-700 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="card animate-pulse">
      <div className="space-y-4">
        <div className="h-10 bg-dark-700 rounded-lg" />
        {[...Array(rows)].map((_, i) => (
          <div key={i} className="h-14 bg-dark-700/50 rounded-lg" />
        ))}
      </div>
    </div>
  );
};

export default LoadingSkeleton;
