import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import './Settings.css';

const Settings = () => {
  const { user, updateUser, logout } = useAuth();
  
  // Local state for profile inputs to avoid excessive API calls while typing
  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    bio: user?.bio || '',
    phone: user?.phone || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: ''
  });

  const [message, setMessage] = useState({ text: '', type: '' });

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const saveProfile = async () => {
    await updateUser(profileData);
    setMessage({ text: 'Profile updated successfully!', type: 'success' });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const handleChangePassword = async () => {
    try {
      const token = localStorage.getItem('llwp_token');
      const res = await fetch('http://localhost:5000/api/user/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(passwordData)
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ text: 'Password changed!', type: 'success' });
        setPasswordData({ currentPassword: '', newPassword: '' });
      } else {
        setMessage({ text: data.message, type: 'danger' });
      }
    } catch (err) {
      setMessage({ text: 'Failed to change password', type: 'danger' });
    }
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to deactivate your account? This action can be reversed by contacting support.')) {
      try {
        const token = localStorage.getItem('llwp_token');
        await fetch('http://localhost:5000/api/user/', {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        logout();
      } catch (err) {
        alert('Failed to deactivate account');
      }
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      
      <main className="settings-container">
        <header className="settings-header">
          <h1>Settings</h1>
          <p className="text-muted">Manage your account and app preferences</p>
          {message.text && (
            <div className={`text-${message.type}`} style={{ marginTop: '10px', fontWeight: '500' }}>
              {message.text}
            </div>
          )}
        </header>

        <div className="settings-grid">
          {/* Section 1: Profile & Account */}
          <section className="settings-section">
            <h2>👤 Profile & Account</h2>
            
            <div className="profile-preview">
              <div className="profile-avatar">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <div style={{ fontWeight: '600' }}>{user?.username || 'User'}</div>
                <div className="text-muted" style={{ fontSize: '13px' }}>Update photo and bio</div>
              </div>
            </div>

            <div className="settings-item">
              <label className="settings-item-label">Display Name</label>
              <input 
                type="text" 
                name="username"
                className="settings-input" 
                value={profileData.username} 
                onChange={handleProfileChange}
                placeholder="Enter your name" 
              />
            </div>

            <div className="settings-item">
              <label className="settings-item-label">Email Address</label>
              <input 
                type="email" 
                name="email"
                className="settings-input" 
                value={profileData.email} 
                onChange={handleProfileChange}
                placeholder="Enter email" 
              />
            </div>

            <div className="settings-item">
              <label className="settings-item-label">Phone Number</label>
              <input 
                type="tel" 
                name="phone"
                className="settings-input" 
                value={profileData.phone} 
                onChange={handleProfileChange}
                placeholder="+1 (555) 000-0000" 
              />
            </div>

            <div className="settings-item">
              <label className="settings-item-label">Bio</label>
              <textarea 
                name="bio"
                className="settings-input" 
                style={{ minHeight: '80px', resize: 'vertical' }} 
                value={profileData.bio} 
                onChange={handleProfileChange}
                placeholder="Tell us about yourself..." 
              />
            </div>

            <button className="btn btn-primary" onClick={saveProfile} style={{ marginTop: '10px' }}>Save Profile Changes</button>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '10px 0' }} />
            
            <div className="settings-item">
              <label className="settings-item-label">Current Password</label>
              <input 
                type="password" 
                className="settings-input" 
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
              />
            </div>
            <div className="settings-item">
              <label className="settings-item-label">New Password</label>
              <input 
                type="password" 
                className="settings-input" 
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
              />
            </div>
            <button className="btn btn-outline" onClick={handleChangePassword}>Update Password</button>
          </section>

          {/* Section 2: Appearance & Language */}
          <section className="settings-section">
            <h2>🎨 Appearance & Language</h2>
            
            <div className="settings-item">
              <div className="settings-item-header">
                <div>
                  <div className="settings-item-label">Dark Mode</div>
                  <div className="settings-item-desc">Adjust the app's visual theme</div>
                </div>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={user?.themeMode !== 'light'} 
                    onChange={(e) => updateUser({ themeMode: e.target.checked ? 'dark' : 'light' })} 
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>

            <div className="settings-item">
              <label className="settings-item-label">Theme / Colors</label>
              <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                {['#8b5cf6', '#f97316', '#10b981', '#3b82f6', '#ef4444'].map(color => (
                  <div 
                    key={color} 
                    onClick={() => updateUser({ themeColor: color })}
                    style={{ 
                      width: '24px', 
                      height: '24px', 
                      borderRadius: '50%', 
                      background: color, 
                      cursor: 'pointer',
                      border: '2px solid transparent',
                      boxShadow: user?.themeColor === color ? '0 0 0 2px var(--text)' : 'none',
                      transition: 'transform 0.2s'
                    }} 
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  />
                ))}
              </div>
            </div>

            <div className="settings-item">
              <label className="settings-item-label">Font Size</label>
              <select 
                className="settings-select" 
                value={user?.fontSize || 'Medium'} 
                onChange={(e) => updateUser({ fontSize: e.target.value })}
              >
                <option>Small</option>
                <option>Medium</option>
                <option>Large</option>
                <option>Extra Large</option>
              </select>
            </div>

            <div className="settings-item">
              <label className="settings-item-label">App Language</label>
              <select 
                className="settings-select" 
                value={user?.appLanguage || 'English'} 
                onChange={(e) => updateUser({ appLanguage: e.target.value })}
              >
                <option>English</option>
                <option>Tamil</option>
                <option>Hindi</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
            </div>

            <div className="settings-item">
              <label className="settings-item-label">Region / Country</label>
              <select 
                className="settings-select"
                value={user?.region || 'India'}
                onChange={(e) => updateUser({ region: e.target.value })}
              >
                <option>India</option>
                <option>United States</option>
                <option>United Kingdom</option>
                <option>Canada</option>
              </select>
            </div>
          </section>

          {/* Section 3: Audio & Accessibility */}
          <section className="settings-section">
            <h2>🔊 Audio & Accessibility</h2>
            
            <div className="settings-item">
              <div className="settings-item-header">
                <div className="settings-item-label">Master Volume</div>
                <div className="settings-item-label">{user?.volume || 80}%</div>
              </div>
              <input 
                type="range" 
                className="range-slider" 
                min="0" 
                max="100" 
                value={user?.volume || 80} 
                onChange={(e) => updateUser({ volume: parseInt(e.target.value) })} 
              />
            </div>

            <div className="settings-item">
              <label className="settings-item-label">Voice Speed</label>
              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                {['Slow', 'Normal', 'Fast'].map(speed => (
                  <button 
                    key={speed}
                    onClick={() => updateUser({ voiceSpeed: speed })}
                    className={`btn ${user?.voiceSpeed === speed ? 'btn-primary' : 'btn-outline'}`}
                    style={{ flex: 1, padding: '8px', fontSize: '13px' }}
                  >
                    {speed}
                  </button>
                ))}
              </div>
            </div>

            <div className="settings-item">
              <div className="settings-item-header">
                <div>
                  <div className="settings-item-label">Sound Effects</div>
                  <div className="settings-item-desc">Enable UI interactions sounds</div>
                </div>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={user?.soundEffectsEnabled !== false} 
                    onChange={(e) => updateUser({ soundEffectsEnabled: e.target.checked })}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>

            <div className="settings-item">
              <div className="settings-item-header">
                <div>
                  <div className="settings-item-label">Captions & Subtitles</div>
                  <div className="settings-item-desc">Show text for all audio content</div>
                </div>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={user?.captionsEnabled === true}
                    onChange={(e) => updateUser({ captionsEnabled: e.target.checked })}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>

            <div className="settings-item">
              <div className="settings-item-header">
                <div>
                  <div className="settings-item-label">Screen Reader Support</div>
                  <div className="settings-item-desc">Optimized for accessibility tools</div>
                </div>
                <label className="switch">
                  <input type="checkbox" />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </section>

          {/* Section 4: System & Advanced */}
          <section className="settings-section">
            <h2>⚙️ System & Advanced</h2>
            
            <div className="settings-item">
              <div className="settings-item-header">
                <div>
                  <div className="settings-item-label">Auto Updates</div>
                  <div className="settings-item-desc">Keep LangLearn up to date automatically</div>
                </div>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={user?.autoUpdatesEnabled !== false} 
                    onChange={(e) => updateUser({ autoUpdatesEnabled: e.target.checked })}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>

            <div className="settings-item">
              <label className="settings-item-label">Date & Time Format</label>
              <select className="settings-select">
                <option>24-hour (14:00)</option>
                <option>12-hour (2:00 PM)</option>
              </select>
            </div>

            <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button className="btn btn-outline" style={{ justifyContent: 'flex-start' }} onClick={() => alert('App is up to date!')}>
                🔄 Check for System Updates
              </button>
              <button className="btn btn-outline" style={{ justifyContent: 'flex-start' }} onClick={() => alert('Settings reset to default')}>
                🧹 Reset All Settings
              </button>
              <button className="btn btn-outline" style={{ justifyContent: 'flex-start', color: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={() => alert('Factory reset initiated...')}>
                💀 Factory Reset
              </button>
            </div>
          </section>

          {/* Danger Zone */}
          <section className="settings-section danger-zone" style={{ gridColumn: '1 / -1' }}>
            <h2>⚠️ Danger Zone</h2>
            <div className="settings-item">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <div>
                  <div className="settings-item-label">Reset Learning Progress</div>
                  <div className="settings-item-desc">Restart your 180-day journey for {user?.selectedLanguage} from Day 1.</div>
                </div>
                <button 
                  className="btn btn-outline" 
                  style={{ borderColor: 'var(--warning)', color: 'var(--warning)' }}
                  onClick={async () => {
                    if (window.confirm(`Are you sure you want to reset your ${user?.selectedLanguage} progress? This cannot be undone.`)) {
                      try {
                        const token = localStorage.getItem('llwp_token');
                        const res = await fetch('http://localhost:5000/api/language/reset-progress', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                          body: JSON.stringify({ language: user?.selectedLanguage })
                        });
                        const data = await res.json();
                        if (data.success) {
                          alert('Progress reset! Redirecting to dashboard...');
                          window.location.href = '/dashboard';
                        }
                      } catch (err) {
                        alert('Failed to reset progress');
                      }
                    }
                  }}
                >
                  Reset {user?.selectedLanguage} Progress
                </button>
              </div>
            </div>
            
            <hr style={{ border: 'none', borderTop: '1px solid rgba(239, 68, 68, 0.2)', margin: '20px 0' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div className="settings-item-label">Deactivate or Delete Account</div>
                <div className="settings-item-desc">This action is permanent and cannot be undone.</div>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn btn-outline" onClick={handleDeleteAccount}>Deactivate</button>
                <button className="btn btn-danger" onClick={() => alert('Permanent deletion requires verification code sent to email.')}>Delete Account</button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Settings;
