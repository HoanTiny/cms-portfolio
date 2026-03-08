import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi';

const DataTable = ({ columns, data, pagination, onPageChange, loading }) => {
  if (loading) {
    return (
      <div className="card animate-pulse">
        <div className="space-y-4">
          <div className="h-10 bg-dark-700 rounded-lg" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-14 bg-dark-700/50 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="card p-0 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-dark-700">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="text-left text-xs font-medium text-dark-400 uppercase tracking-wider px-6 py-4"
                  style={{ width: col.width }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-700/50">
            {data?.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center text-dark-500 py-12">
                  No data found
                </td>
              </tr>
            ) : (
              data?.map((row, idx) => (
                <tr
                  key={row._id || idx}
                  className="hover:bg-dark-800/50 transition-colors"
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-6 py-4 text-sm text-dark-200">
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-dark-700">
          <p className="text-sm text-dark-400">
            Showing page <span className="text-dark-200 font-medium">{pagination.currentPage}</span> of{' '}
            <span className="text-dark-200 font-medium">{pagination.totalPages}</span>
            {' '}({pagination.totalItems} items)
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage <= 1}
              className="p-2 rounded-lg border border-dark-700 text-dark-400 hover:text-white hover:bg-dark-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <HiOutlineChevronLeft size={16} />
            </button>
            {[...Array(Math.min(pagination.totalPages, 5))].map((_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                    pagination.currentPage === page
                      ? 'bg-primary-500 text-white'
                      : 'border border-dark-700 text-dark-400 hover:text-white hover:bg-dark-700'
                  }`}
                >
                  {page}
                </button>
              );
            })}
            <button
              onClick={() => onPageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage >= pagination.totalPages}
              className="p-2 rounded-lg border border-dark-700 text-dark-400 hover:text-white hover:bg-dark-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <HiOutlineChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
