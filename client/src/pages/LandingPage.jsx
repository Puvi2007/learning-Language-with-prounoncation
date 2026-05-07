import React from 'react';
import { Link } from 'react-router-dom';

const FEATURES = [
  { icon: '🤖', title: 'AI Voice Pronunciation', desc: 'Hear every word spoken perfectly by AI before you try it' },
  { icon: '🎤', title: 'Mic Recognition', desc: 'Speak into your mic — AI checks your pronunciation instantly' },
  { icon: '📅', title: '180-Day Journey', desc: '10 tasks per day, from alphabet to fluency in 6 months' },
  { icon: '🏆', title: 'Certificate', desc: 'Earn a certificate after completing all 180 days' },
  { icon: '🔥', title: 'Streak Tracking', desc: 'Keep your daily streak alive and build a habit' },
  { icon: '🌍', title: '8 Languages', desc: 'Tamil, Hindi, Telugu, Kannada, Malayalam, Sanskrit, English, French' }
];

const LandingPage = () => {
  return (
    <div style={{ minHeight: '100vh', padding: '40px 24px', textAlign: 'center' }}>
      <header style={{ marginBottom: '60px', marginTop: '40px' }}>
        <h1 style={{ 
          fontSize: '64px', 
          fontWeight: 700,
          background: 'linear-gradient(135deg, #f8fafc 0%, #94a3b8 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '24px',
          letterSpacing: '-1px'
        }}>
          Learn Language with <span style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Pronunciation</span>
        </h1>
        <p style={{ fontSize: '20px', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 32px' }}>
          Master 8 different languages with our AI-powered pronunciation coach. Start your 180-day journey today.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <Link to="/signup" className="btn btn-primary" style={{ padding: '14px 32px', fontSize: '18px' }}>
            Start Learning Free
          </Link>
          <Link to="/login" className="btn btn-outline" style={{ padding: '14px 32px', fontSize: '18px' }}>
            Login
          </Link>
        </div>
      </header>

      <section style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '24px', 
        maxWidth: '1000px', 
        margin: '0 auto' 
      }}>
        {FEATURES.map((feat, i) => (
          <div key={i} className="card" style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>{feat.icon}</div>
            <h3 style={{ marginBottom: '8px' }}>{feat.title}</h3>
            <p className="text-muted">{feat.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default LandingPage;
