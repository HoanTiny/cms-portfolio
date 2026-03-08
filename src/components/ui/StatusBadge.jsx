const StatusBadge = ({ status }) => {
  const styles = {
    published: 'bg-primary-500/10 text-primary-500 border-primary-500/20',
    draft: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    admin: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    editor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status] || styles.draft}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
