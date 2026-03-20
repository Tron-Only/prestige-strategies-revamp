import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LayoutDashboard, Briefcase, Calendar, GraduationCap, FileText, LogOut } from 'lucide-react';

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
    { name: 'Resources', path: '/admin/resources', icon: FileText },
  ];

  const isActive = (path: string) => location.pathname.startsWith(path);

  const activeItem = navItems.find((item) => isActive(item.path));

  return (
    <div className="admin-shell flex h-screen" style={{ backgroundColor: '#F8F6F0' }}>
      {/* Sidebar */}
      <aside className="w-72 bg-white shadow-sm flex flex-col" style={{ borderRight: '1px solid #E5E5E5' }}>
        <div className="p-6 border-b" style={{ borderColor: '#E5E5E5' }}>
          <p className="text-xs uppercase tracking-[0.14em] font-semibold" style={{ color: '#D4AF37' }}>Control Center</p>
          <h1 className="text-xl font-bold mt-1" style={{ color: '#00CED1' }}>Prestige Admin</h1>
        </div>
        
        <nav className="p-4 space-y-2 flex-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
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
        <header className="bg-white border-b px-6 py-4" style={{ borderColor: '#E5E5E5' }}>
          <p className="text-xs uppercase tracking-[0.12em] font-semibold" style={{ color: '#6B7280' }}>Admin Workspace</p>
          <h2 className="text-lg font-semibold" style={{ color: '#00CED1' }}>{activeItem?.name || 'Dashboard'}</h2>
        </header>
        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
