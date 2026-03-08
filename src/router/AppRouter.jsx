import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminLayout from '../components/layout/AdminLayout';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Posts from '../pages/Posts';
import CreatePost from '../pages/CreatePost';
import EditPost from '../pages/EditPost';
import Categories from '../pages/Categories';
import Users from '../pages/Users';
import Media from '../pages/Media';
import ProfilePage from '../pages/Profile';
import { SkillsPage, ServicesPage, ExperiencesPage, ProjectsPage, StatsPage, ResearchPage } from '../pages/PortfolioPages';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-dark-950">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const AppRouter = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-dark-950">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        {/* CMS */}
        <Route index element={<Dashboard />} />
        <Route path="posts" element={<Posts />} />
        <Route path="posts/create" element={<CreatePost />} />
        <Route path="posts/edit/:id" element={<EditPost />} />
        <Route path="categories" element={<Categories />} />
        <Route path="users" element={<Users />} />
        <Route path="media" element={<Media />} />

        {/* Portfolio */}
        <Route path="profile" element={<ProfilePage />} />
        <Route path="skills" element={<SkillsPage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="experiences" element={<ExperiencesPage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="stats" element={<StatsPage />} />
        <Route path="research" element={<ResearchPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;
