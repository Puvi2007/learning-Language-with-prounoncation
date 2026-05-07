import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const passwordChecks = [
  { label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { label: 'One uppercase letter (A-Z)', test: (p) => /[A-Z]/.test(p) },
  { label: 'One lowercase letter (a-z)', test: (p) => /[a-z]/.test(p) },
  { label: 'One number (0-9)', test: (p) => /[0-9]/.test(p) },
  { label: 'One special character', test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p) }
];

const SignUp = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const allPasswordChecksPassed = passwordChecks.every(c => c.test(form.password));

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!allPasswordChecksPassed) {
      return setError('Please meet all password requirements.');
    }
    if (form.password !== form.confirmPassword) {
      return setError('Passwords do not match.');
    }

    setLoading(true);
    setError('');

    try {
      const res = await api.post('/auth/signup', {
        username: form.username,
        email: form.email,
        password: form.password,
        confirmPassword: form.confirmPassword
      });
      login(res.data.user, res.data.token, null);
      navigate('/select-language');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2 style={{ textAlign: 'center', marginBottom: '24px', color: 'var(--primary)' }}>Create Account</h2>
        
        {error && <div className="text-danger" style={{ marginBottom: '16px', textAlign: 'center' }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input name="username" type="text" required value={form.username} onChange={handleChange} />
          </div>
          
          <div className="form-group">
            <label>Email</label>
            <input name="email" type="email" required value={form.email} onChange={handleChange} />
          </div>
          
          <div className="form-group">
            <label>Password</label>
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

          <div style={{ marginBottom: '16px', fontSize: '14px' }}>
            {passwordChecks.map((check, i) => {
              const pass = check.test(form.password);
              return (
                <div key={i} style={{ color: pass ? 'var(--accent)' : 'var(--text-muted)', marginBottom: '4px' }}>
                  {pass ? '✓' : '○'} {check.label}
                </div>
              );
            })}
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input name="confirmPassword" type="password" required value={form.confirmPassword} onChange={handleChange} />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Creating...' : 'Sign Up'}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <span className="text-muted">Already have an account? </span>
          <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 500 }}>Login here</Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
