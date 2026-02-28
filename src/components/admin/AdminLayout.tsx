import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LayoutDashboard, Briefcase, Calendar, GraduationCap, LogOut } from 'lucide-react';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Jobs', path: '/admin/jobs', icon: Briefcase },
    { name: 'Events', path: '/admin/events', icon: Calendar },
    { name: 'Courses', path: '/admin/courses', icon: GraduationCap },
  ];

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <div className="flex h-screen" style={{ backgroundColor: '#F8F6F0' }}>
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-sm flex flex-col" style={{ borderRight: '1px solid #E5E5E5' }}>
        <div className="p-6 border-b" style={{ borderColor: '#E5E5E5' }}>
          <h1 className="text-xl font-bold" style={{ color: '#00CED1' }}>Prestige Admin</h1>
        </div>
        
        <nav className="p-4 space-y-2 flex-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded transition ${
                isActive(item.path)
                  ? ''
                  : ''
              }`}
              style={
                isActive(item.path)
                  ? { backgroundColor: '#F4E4C1', color: '#00CED1', fontWeight: 600 }
                  : { color: '#6B7280' }
              }
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t" style={{ borderColor: '#E5E5E5' }}>
          <div className="mb-2 px-4">
            <p className="text-sm font-medium" style={{ color: '#00CED1' }}>{user?.email}</p>
            <p className="text-xs" style={{ color: '#6B7280' }}>Administrator</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-2 px-4 py-2 rounded transition hover:opacity-80"
            style={{ color: '#DC2626', backgroundColor: '#FEF2F2' }}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
