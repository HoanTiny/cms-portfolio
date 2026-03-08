import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  HiOutlineMenuAlt2,
  HiOutlineSearch,
  HiOutlineBell,
  HiOutlineLogout,
} from 'react-icons/hi';

const Topbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 bg-dark-900/80 backdrop-blur-md border-b border-dark-700 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-dark-400 hover:text-white hover:bg-dark-800 rounded-lg transition-colors"
        >
          <HiOutlineMenuAlt2 size={20} />
        </button>

        {/* Search */}
        <div className="hidden sm:flex items-center gap-2 bg-dark-800 border border-dark-700 rounded-lg px-3 py-2 w-64">
          <HiOutlineSearch className="text-dark-500" size={16} />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-sm text-dark-200 placeholder-dark-500 focus:outline-none w-full"
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Notification */}
        <button className="relative p-2 text-dark-400 hover:text-white hover:bg-dark-800 rounded-lg transition-colors">
          <HiOutlineBell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-500 rounded-full" />
        </button>

        {/* User */}
        <div className="flex items-center gap-3 ml-2 pl-3 border-l border-dark-700">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-dark-100">{user?.username}</p>
            <p className="text-xs text-dark-500 capitalize">{user?.role}</p>
          </div>
          <div className="w-8 h-8 bg-primary-500/20 rounded-full flex items-center justify-center">
            <span className="text-primary-500 font-medium text-sm">
              {user?.username?.charAt(0).toUpperCase()}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-dark-400 hover:text-red-400 hover:bg-dark-800 rounded-lg transition-colors"
            title="Logout"
          >
            <HiOutlineLogout size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
