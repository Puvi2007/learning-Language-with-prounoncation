import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const LANGUAGES = [
  { name: 'Tamil', flag: '🌺', script: 'தமிழ்', family: 'Dravidian' },
  { name: 'Hindi', flag: '🪷', script: 'हिन्दी', family: 'Indo-Aryan' },
  { name: 'Telugu', flag: '🌸', script: 'తెలుగు', family: 'Dravidian' },
  { name: 'Kannada', flag: '🌼', script: 'ಕನ್ನಡ', family: 'Dravidian' },
  { name: 'Malayalam', flag: '🌴', script: 'മലയാളം', family: 'Dravidian' },
  { name: 'Sanskrit', flag: '📿', script: 'संस्कृतम्', family: 'Indo-Aryan' },
  { name: 'English', flag: '🌍', script: 'English', family: 'Germanic' },
  { name: 'French', flag: '🥐', script: 'Français', family: 'Romance' }
];

const LanguageSelect = () => {
  const [selected, setSelected] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { updateUser } = useAuth();

  const handleSubmit = async () => {
    if (!selected) return setError('Please select a language.');
    
    setLoading(true);
    setError('');
    
    try {
      await api.post('/language/select', { language: selected });
      updateUser({ selectedLanguage: selected });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to set language.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: '40px 24px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ color: 'var(--primary)', marginBottom: '16px' }}>Choose Your Language</h1>
        <p className="text-muted" style={{ fontSize: '18px' }}>Select the language you want to master over the next 180 days.</p>
      </div>

      {error && <div className="text-danger" style={{ textAlign: 'center', marginBottom: '24px' }}>{error}</div>}

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '20px',
        marginBottom: '40px'
      }}>
        {LANGUAGES.map((lang) => {
          const isSelected = selected === lang.name;
          return (
            <div 
              key={lang.name}
              onClick={() => setSelected(lang.name)}
              className="card"
              style={{ 
                cursor: 'pointer', 
                border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border)',
                transform: isSelected ? 'translateY(-8px)' : 'none',
                boxShadow: isSelected ? 'var(--primary-glow)' : 'var(--shadow)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                textAlign: 'center',
                background: isSelected ? 'rgba(139, 92, 246, 0.1)' : 'var(--surface)'
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>{lang.flag}</div>
              <h3 style={{ margin: '0 0 8px 0' }}>{lang.name}</h3>
              <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{lang.script}</div>
            </div>
          );
        })}
      </div>

      <div style={{ textAlign: 'center', marginTop: 'auto' }}>
        <button 
          onClick={handleSubmit} 
          className="btn btn-primary" 
          disabled={!selected || loading}
          style={{ padding: '16px 48px', fontSize: '18px' }}
        >
          {loading ? 'Saving...' : 'Start Learning →'}
        </button>
      </div>
    </div>
  );
};

export default LanguageSelect;
