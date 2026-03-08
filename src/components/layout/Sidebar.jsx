import { NavLink } from 'react-router-dom';
import {
  HiOutlineViewGrid,
  HiOutlineDocumentText,
  HiOutlineFolder,
  HiOutlinePhotograph,
  HiOutlineUsers,
  HiOutlineCog,
  HiOutlineX,
  HiOutlineUser,
  HiOutlineChip,
  HiOutlineBriefcase,
  HiOutlineAcademicCap,
  HiOutlineCode,
  HiOutlineChartBar,
  HiOutlineBeaker,
} from 'react-icons/hi';

const cmsItems = [
  { path: '/', label: 'Dashboard', icon: HiOutlineViewGrid },
  { path: '/posts', label: 'Posts', icon: HiOutlineDocumentText },
  { path: '/categories', label: 'Categories', icon: HiOutlineFolder },
  { path: '/media', label: 'Media', icon: HiOutlinePhotograph },
  { path: '/users', label: 'Users', icon: HiOutlineUsers },
];

const portfolioItems = [
  { path: '/profile', label: 'Profile', icon: HiOutlineUser },
  { path: '/skills', label: 'Skills', icon: HiOutlineChip },
  { path: '/services', label: 'Services', icon: HiOutlineBriefcase },
  { path: '/experiences', label: 'Experiences', icon: HiOutlineAcademicCap },
  { path: '/projects', label: 'Projects', icon: HiOutlineCode },
  { path: '/stats', label: 'Stats', icon: HiOutlineChartBar },
  { path: '/research', label: 'Research', icon: HiOutlineBeaker },
];

const MenuItem = ({ item, onClose }) => (
  <NavLink
    to={item.path}
    end={item.path === '/'}
    onClick={onClose}
    className={({ isActive }) =>
      `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
        isActive
          ? 'bg-primary-500/10 text-primary-500'
          : 'text-dark-400 hover:text-dark-100 hover:bg-dark-800'
      }`
    }
  >
    <item.icon size={18} />
    {item.label}
  </NavLink>
);

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 bg-dark-900 border-r border-dark-700 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-dark-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CMS</span>
            </div>
            <span className="font-mono text-lg font-medium text-white">Portfolio</span>
          </div>
          <button onClick={onClose} className="lg:hidden text-dark-400 hover:text-white">
            <HiOutlineX size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          <p className="px-3 text-xs font-medium text-dark-500 uppercase tracking-wider mb-2">CMS</p>
          {cmsItems.map((item) => (
            <MenuItem key={item.path} item={item} onClose={onClose} />
          ))}

          <div className="my-3 border-t border-dark-700/50" />

          <p className="px-3 text-xs font-medium text-dark-500 uppercase tracking-wider mb-2">Portfolio</p>
          {portfolioItems.map((item) => (
            <MenuItem key={item.path} item={item} onClose={onClose} />
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-dark-700">
          <div className="flex items-center gap-3 px-3 py-2 text-dark-500 text-xs">
            <HiOutlineCog size={16} />
            <span>v1.0.0 — Portfolio CMS</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
