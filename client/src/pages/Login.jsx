import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/auth/login', form);
      const { user, token, progress } = res.data;
      
      login(user, token, progress);
      
      if (!user.selectedLanguage) {
        navigate('/select-language');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div style={{ textAlign: 'center', fontSize: '40px', marginBottom: '8px' }}>🌐</div>
        <h1 style={{ textAlign: 'center', marginBottom: '32px', fontSize: '28px' }}>Welcome back</h1>
        
        {error && <div className="text-danger" style={{ marginBottom: '16px', textAlign: 'center' }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input name="email" type="email" required value={form.email} onChange={handleChange} />
          </div>
          
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <label style={{ marginBottom: 0 }}>Password</label>
              <Link to="/forgot-password" style={{ fontSize: '14px', color: 'var(--primary)', textDecoration: 'none' }}>Forgot password?</Link>
            </div>
            <div style={{ position: 'relative' }}>
              <input 
                name="password" 
                type={showPassword ? "text" : "password"} 
                required 
                value={form.password} 
                onChange={handleChange} 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '12px', top: '12px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '16px' }} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <span className="text-muted">New here? </span>
          <Link to="/signup" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 500 }}>Create account</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
