import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProgressBar from './ProgressBar';

const Sidebar = ({ progress }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const toggleSidebar = () => setOpen(!open);
  const closeSidebar = () => setOpen(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <button 
        onClick={toggleSidebar}
        style={{
          position: 'fixed',
          top: '16px',
          left: '16px',
          zIndex: 1000,
          background: 'var(--surface)',
          backdropFilter: 'var(--glass-blur)',
          WebkitBackdropFilter: 'var(--glass-blur)',
          border: '1px solid var(--border)',
          borderRadius: '10px',
          boxShadow: 'var(--shadow)',
          width: '44px',
          height: '44px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          fontSize: '20px',
          color: 'var(--text)'
        }}
      >
        {open ? '✕' : '☰'}
      </button>

      {open && (
        <div 
          onClick={closeSidebar}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.3)',
            zIndex: 998
          }}
        />
      )}

      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: open ? 0 : '-300px',
          width: '280px',
          height: '100%',
          background: 'var(--surface)',
          backdropFilter: 'var(--glass-blur)',
          WebkitBackdropFilter: 'var(--glass-blur)',
          zIndex: 999,
          boxShadow: 'var(--shadow-lg)',
          transition: 'left 0.3s ease',
          display: 'flex',
          flexDirection: 'column',
          padding: '24px 20px',
          borderRight: '1px solid var(--border)'
        }}
      >
        <div style={{ paddingLeft: '50px', marginBottom: '24px' }}>
          <h2 style={{ color: 'var(--primary)', margin: 0 }}>🌐 LangLearn</h2>
          <span style={{ fontSize: '12px' }} className="text-muted">Pronunciation Master</span>
        </div>

        <div style={{
          background: 'var(--primary-light)',
          borderRadius: '12px',
          padding: '14px',
          marginBottom: '24px'
        }}>
          <div style={{ fontWeight: 'bold' }}>{user?.username || 'User'}</div>
          <div style={{ fontSize: '12px' }} className="text-muted">{user?.email || ''}</div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          <Link to="/dashboard" onClick={closeSidebar} style={{ textDecoration: 'none', color: 'inherit', padding: '10px 14px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }} className="nav-link">
            🏠 Dashboard
          </Link>
          <Link to="/select-language" onClick={closeSidebar} style={{ textDecoration: 'none', color: 'inherit', padding: '10px 14px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }} className="nav-link">
            🌍 Select Language
          </Link>
          <Link to="/settings" onClick={closeSidebar} style={{ textDecoration: 'none', color: 'inherit', padding: '10px 14px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }} className="nav-link">
            ⚙️ Settings
          </Link>
        </nav>

        {progress && (
          <div style={{ marginBottom: '24px' }}>
            <ProgressBar value={progress.overallProgress || 0} showLabel={true} />
            <div style={{ fontSize: '12px', marginTop: '8px', textAlign: 'center' }} className="text-muted">
              Current Day: {progress.currentDay || 1} • Streak: {progress.currentStreak || 0} 🔥
            </div>
          </div>
        )}

        <button 
          onClick={handleLogout}
          className="btn btn-outline"
          style={{ width: '100%', marginTop: 'auto' }}
        >
          Logout
        </button>
      </div>
    </>
  );
};

export default Sidebar;
