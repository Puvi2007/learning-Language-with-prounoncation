import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Lock, Palette, ShieldAlert, 
  Trash2, ShieldCheck, AlertTriangle
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Settings = () => {
  const { user, updateUser, logout } = useAuth();
  
  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    bio: user?.bio || '',
    phone: user?.phone || '',
    region: user?.region || 'India'
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: ''
  });

  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const saveProfile = async () => {
    setLoading(true);
    try {
      await updateUser(profileData);
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
    } catch (err) {
      setMessage({ text: 'Failed to update profile.', type: 'error' });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  };

  const handleChangePassword = async () => {
    try {
      const res = await api.post('/user/change-password', passwordData);
      if (res.data.success) {
        setMessage({ text: 'Password changed!', type: 'success' });
        setPasswordData({ currentPassword: '', newPassword: '' });
      } else {
        setMessage({ text: res.data.message, type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'Failed to change password.', type: 'error' });
    }
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to deactivate your account? This cannot be undone easily.')) {
      try {
        await api.delete('/user/');
        logout();
      } catch (err) {
        alert('Failed to deactivate account');
      }
    }
  };

  const resetProgress = async () => {
    if (window.confirm(`Reset all progress for ${user?.selectedLanguage}?`)) {
      try {
        await api.post('/language/reset-progress', { language: user?.selectedLanguage });
        window.location.href = '/dashboard';
      } catch (err) {
        alert('Failed to reset progress');
      }
    }
  };

  const SectionHeader = ({ icon, title, desc }) => (
    <div className="flex items-center gap-4 mb-8">
      <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
        {icon}
      </div>
      <div>
        <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">{title}</h2>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{desc}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen lg:pl-64" style={{ backgroundColor: 'var(--bg)' }}>
      <Sidebar />
      
      <main className="p-4 sm:p-8 max-w-5xl mx-auto space-y-8">
        <header>
          <h1 className="text-4xl font-black tracking-tight mb-2" style={{ color: 'var(--text)' }}>Settings</h1>
          <p className="font-bold uppercase tracking-widest text-xs" style={{ color: 'var(--text-muted)' }}>Manage your learning preferences</p>
        </header>

        {message.text && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-2xl border-2 font-bold text-center ${message.type === 'success' ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-danger/10 border-danger/20 text-danger'}`}
          >
            {message.text}
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Profile Section */}
          <section className="p-8 rounded-[2.5rem] border-2 shadow-sm space-y-6" style={{ backgroundColor: 'var(--surface-solid)', borderColor: 'var(--border)' }}>
            <SectionHeader icon={<User />} title="Profile" desc="How the community sees you" />
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Username</label>
                <input 
                  name="username"
                  value={profileData.username}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-3 rounded-xl outline-none font-bold"
                  style={{ backgroundColor: 'var(--surface)', border: '2px solid var(--border)', color: 'var(--text)' }}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email</label>
                <input 
                  name="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-3 rounded-xl outline-none font-bold"
                  style={{ backgroundColor: 'var(--surface)', border: '2px solid var(--border)', color: 'var(--text)' }}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Bio</label>
                <textarea 
                  name="bio"
                  value={profileData.bio}
                  onChange={handleProfileChange}
                  placeholder="Tell us about yourself..."
                  className="w-full px-4 py-3 rounded-xl outline-none font-bold h-24 resize-none"
                  style={{ backgroundColor: 'var(--surface)', border: '2px solid var(--border)', color: 'var(--text)' }}
                />
              </div>
              <button 
                onClick={saveProfile} 
                disabled={loading}
                className="btn-duo btn-duo-primary w-full py-3"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </section>

          {/* Security Section */}
          <section className="p-8 rounded-[2.5rem] border-2 shadow-sm space-y-6" style={{ backgroundColor: 'var(--surface-solid)', borderColor: 'var(--border)' }}>
            <SectionHeader icon={<Lock />} title="Security" desc="Password & Protection" />
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Current Password</label>
                <input 
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  className="w-full px-4 py-3 bg-surface border-2 border-border rounded-xl focus:border-primary outline-none font-bold"
                  style={{ color: 'var(--text)' }}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">New Password</label>
                <input 
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  className="w-full px-4 py-3 bg-surface border-2 border-border rounded-xl focus:border-primary outline-none font-bold"
                  style={{ color: 'var(--text)' }}
                />
              </div>
              <button 
                onClick={handleChangePassword}
                className="btn-duo btn-duo-secondary w-full py-3"
              >
                Update Password
              </button>
            </div>
          </section>

          {/* Preferences Section */}
          <section className="p-8 rounded-[2.5rem] border-2 shadow-sm space-y-6" style={{ backgroundColor: 'var(--surface-solid)', borderColor: 'var(--border)' }}>
            <SectionHeader icon={<Palette />} title="Preferences" desc="App look and feel" />
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-black text-sm" style={{ color: 'var(--text)' }}>Dark Mode</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Toggle visual theme</p>
                </div>
                <button 
                  onClick={() => updateUser({ themeMode: user?.themeMode === 'light' ? 'dark' : 'light' })}
                  className={`w-14 h-8 rounded-full p-1 transition-colors ${user?.themeMode === 'dark' ? 'bg-primary' : 'bg-slate-300'}`}
                >
                  <motion.div 
                    animate={{ x: user?.themeMode === 'dark' ? 24 : 0 }}
                    className="w-6 h-6 bg-white rounded-full shadow-md"
                  />
                </button>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Theme Color</label>
                <div className="flex flex-wrap gap-3">
                  {['#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#ef4444'].map(color => (
                    <button 
                      key={color}
                      onClick={() => updateUser({ themeColor: color })}
                      className={`h-10 w-10 rounded-xl border-4 transition-all ${user?.themeColor === color ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Volume</label>
                <input 
                  type="range"
                  min="0"
                  max="100"
                  value={user?.volume || 80}
                  onChange={(e) => updateUser({ volume: parseInt(e.target.value) })}
                  className="w-full accent-primary h-2 bg-slate-100 rounded-full appearance-none cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Learning Region</label>
                <select 
                  value={user?.region || 'India'}
                  onChange={(e) => updateUser({ region: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl outline-none font-bold"
                  style={{ backgroundColor: 'var(--surface)', border: '2px solid var(--border)', color: 'var(--text)' }}
                >
                  <option>India</option>
                  <option>United States</option>
                  <option>United Kingdom</option>
                </select>
              </div>
            </div>
          </section>

          {/* Danger Zone Section */}
          <section className="p-8 rounded-[2.5rem] border-2 shadow-sm space-y-6" style={{ backgroundColor: 'var(--surface-solid)', borderColor: 'var(--border)' }}>
            <SectionHeader icon={<ShieldAlert className="text-danger" />} title="Danger Zone" desc="Permanent Actions" />
            
            <div className="space-y-4">
              <button 
                onClick={resetProgress}
                className="w-full flex items-center justify-between p-4 bg-orange-500/10 hover:bg-orange-500/20 rounded-2xl border-2 border-orange-500/20 transition-all group"
              >
                <div className="text-left">
                  <h4 className="font-black text-orange-700 text-sm">Reset Progress</h4>
                  <p className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">Restart {user?.selectedLanguage} Course</p>
                </div>
                <AlertTriangle className="text-orange-400 group-hover:scale-110 transition-transform" />
              </button>

              <button 
                onClick={handleDeleteAccount}
                className="w-full flex items-center justify-between p-4 bg-red-500/10 hover:bg-red-500/20 rounded-2xl border-2 border-red-500/20 transition-all group"
              >
                <div className="text-left">
                  <h4 className="font-black text-red-700 text-sm">Deactivate Account</h4>
                  <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest">This cannot be undone</p>
                </div>
                <Trash2 className="text-red-400 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </section>
        </div>

        <footer className="pt-12 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-slate-200/50 rounded-2xl text-slate-400 font-bold text-xs uppercase tracking-widest">
            <ShieldCheck size={16} />
            LLWP Secure Settings v2.0
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Settings;
