import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, BookOpen, User, Settings, LogOut, Languages, 
  Sparkles 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { icon: <Home size={24} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <BookOpen size={24} />, label: 'Start Course', path: '/start-course' },
    { icon: <User size={24} />, label: 'Profile', path: '/profile' },
    { icon: <Settings size={24} />, label: 'Settings', path: '/settings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="fixed left-0 top-0 h-screen w-64 border-r-2 flex flex-col p-6 z-40 hidden lg:flex" style={{ backgroundColor: 'var(--surface-solid)', borderColor: 'var(--border)' }}>
      {/* Logo */}
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
          <Languages className="text-white" size={24} />
        </div>
        <span className="text-2xl font-black text-primary tracking-tight">LLWP</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.path} 
              to={item.path}
              className={`
                flex items-center justify-between group px-4 py-3 rounded-2xl transition-all
                ${isActive 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-slate-400 hover:bg-primary/5 hover:text-primary'}
              `}
            >
              <div className="flex items-center gap-4">
                <span className={`transition-transform group-hover:scale-110 ${isActive ? 'text-primary' : ''}`}>
                  {item.icon}
                </span>
                <span className="font-black uppercase tracking-widest text-xs">{item.label}</span>
              </div>
              {isActive && (
                <motion.div layoutId="activeNav" className="h-1.5 w-1.5 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Card */}
      <div className="mt-auto pt-6 border-t-2 border-slate-50 space-y-4">
        <div className="rounded-3xl p-4 border-2 group cursor-pointer hover:border-primary/20 transition-all" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-secondary flex items-center justify-center text-white font-black text-xl shadow-inner">
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-black truncate uppercase tracking-tighter" style={{ color: 'var(--text)' }}>{user?.username}</p>
              <div className="flex items-center gap-1 text-accent font-black text-[10px] uppercase">
                <Sparkles size={10} />
                <span>{user?.streak || 0} Day Streak</span>
              </div>
            </div>
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-3 text-slate-400 hover:text-danger hover:bg-danger/5 rounded-2xl transition-all font-black uppercase tracking-widest text-xs"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
