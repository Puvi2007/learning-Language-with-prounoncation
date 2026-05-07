import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import api from '../utils/api';

const Dashboard = () => {
  const { user, progress, setProgress } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.selectedLanguage) {
      navigate('/select-language');
      return;
    }

    const fetchProgress = async () => {
      try {
        const res = await api.get(`/language/progress?language=${user.selectedLanguage}`);
        setProgress(res.data.progress);
      } catch (err) {
        setError('Failed to load progress.');
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [user, navigate, setProgress]);

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg)' }}>
      <Sidebar progress={progress} />
      
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '80px 24px 40px' }}>
        {error && <div className="text-danger" style={{ marginBottom: '16px' }}>{error}</div>}
        
        <section style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Welcome back, {user?.username}! 👋</h1>
          <p className="text-muted" style={{ fontSize: '18px' }}>
            Learning {user?.selectedLanguage} — keep the streak alive!
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <div className="card" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, height: '4px', background: 'var(--primary)', width: `${(progress?.currentDay / 180) * 100}%`, transition: 'width 1s ease' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '20px', margin: 0 }}>Course Progress</h2>
              <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Day {progress?.currentDay || 1} of 180</span>
            </div>
            <div style={{ height: '12px', background: 'rgba(255,255,255,0.1)', borderRadius: '6px', marginBottom: '8px' }}>
              <div style={{ height: '100%', background: 'linear-gradient(90deg, var(--primary), var(--secondary))', borderRadius: '6px', width: `${(progress?.currentDay / 180) * 100}%`, transition: 'width 1s ease' }} />
            </div>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: 0 }}>
              {Math.round((progress?.currentDay / 180) * 100)}% of the 6-month {user?.selectedLanguage} curriculum completed.
            </p>
          </div>
        </section>

        <section style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', 
          gap: '16px',
          marginBottom: '40px'
        }}>
          <div className="card" style={{ textAlign: 'center', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>📅</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--primary)' }}>Day {progress?.currentDay || 1}</div>
            <div className="text-muted" style={{ fontSize: '14px' }}>Target Day</div>
          </div>
          
          <div className="card" style={{ textAlign: 'center', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>📊</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--success)' }}>{progress?.overallProgress || 0}%</div>
            <div className="text-muted" style={{ fontSize: '14px' }}>Accuracy Score</div>
          </div>
          
          <div className="card" style={{ textAlign: 'center', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>🔥</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--warning)' }}>{progress?.currentStreak || 0} days</div>
            <div className="text-muted" style={{ fontSize: '14px' }}>Active Streak</div>
          </div>
        </section>

        <section className="card" style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          textAlign: 'center', 
          padding: '60px 24px',
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.1))',
          border: '1px solid var(--primary)'
        }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            borderRadius: '50%', 
            background: 'var(--primary)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontSize: '40px',
            marginBottom: '24px',
            boxShadow: '0 0 20px var(--primary)'
          }}>
            🚀
          </div>
          <h2 style={{ fontSize: '32px', marginBottom: '16px' }}>Ready for Day {progress?.currentDay || 1}?</h2>
          <p className="text-muted" style={{ marginBottom: '32px', maxWidth: '500px', fontSize: '18px' }}>
            Your next set of 10 {user?.selectedLanguage} tasks is ready. Master these to advance your 180-day journey!
          </p>
          <button 
            onClick={() => navigate(`/tasks/${user?.selectedLanguage}/${progress?.currentDay || 1}`)}
            className="btn btn-primary"
            style={{ 
              padding: '20px 60px', 
              fontSize: '20px', 
              fontWeight: 'bold',
              borderRadius: '50px',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}
          >
            Start Today's Tasks
          </button>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
