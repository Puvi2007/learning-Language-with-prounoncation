import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const ForgotPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  
  // Mode A states (No token)
  const [email, setEmail] = useState('');
  
  // Mode B states (With token)
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Shared states
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setStatus('');
    
    try {
      const res = await api.post('/auth/forgot-password', { email });
      setStatus(res.data.message || 'Password reset link sent to your email.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process request.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError('Passwords do not match.');
    }
    
    setLoading(true);
    setError('');
    
    try {
      const res = await api.post(`/auth/reset-password/${token}`, { password });
      setStatus(res.data.message || 'Password reset successful!');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. The token may be invalid or expired.');
    } finally {
      setLoading(false);
    }
  };

  if (token) {
    // Mode B: Reset Password Form
    return (
      <div className="auth-wrapper">
        <div className="auth-card">
          <h2 style={{ textAlign: 'center', marginBottom: '24px', color: 'var(--primary)' }}>Set New Password</h2>
          
          {error && <div className="text-danger" style={{ marginBottom: '16px', textAlign: 'center' }}>{error}</div>}
          {status && <div className="text-success" style={{ marginBottom: '16px', textAlign: 'center' }}>{status}<br/>Redirecting to login...</div>}
          
          <form onSubmit={handleResetPassword}>
            <div className="form-group">
              <label>New Password</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            
            <div className="form-group">
              <label>Confirm New Password</label>
              <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading || status}>
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Mode A: Forgot Password Form
  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2 style={{ textAlign: 'center', marginBottom: '16px', color: 'var(--primary)' }}>Reset Password</h2>
        <p className="text-muted" style={{ textAlign: 'center', marginBottom: '24px' }}>
          Enter your email address and we'll send you a link to reset your password.
        </p>
        
        {error && <div className="text-danger" style={{ marginBottom: '16px', textAlign: 'center' }}>{error}</div>}
        {status && <div className="text-success" style={{ marginBottom: '16px', textAlign: 'center' }}>{status}</div>}
        
        <form onSubmit={handleRequestReset}>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginBottom: '16px' }} disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div style={{ textAlign: 'center' }}>
          <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none' }}>← Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
