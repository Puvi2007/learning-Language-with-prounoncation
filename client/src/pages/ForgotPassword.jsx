import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Languages, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import api from '../utils/api';

const ForgotPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
    if (password !== confirmPassword) return setError('Passwords do not match.');
    
    setLoading(true);
    setError('');
    
    try {
      const res = await api.post(`/auth/reset-password/${token}`, { password });
      setStatus(res.data.message || 'Password reset successful!');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 transition-transform group-hover:scale-110">
              <Languages className="text-white" />
            </div>
            <span className="text-2xl font-black text-primary tracking-tight">LLWP</span>
          </Link>
        </div>

        <div className="bg-white rounded-[2rem] border-2 border-slate-200 p-8 shadow-sm">
          <h1 className="text-3xl font-black text-slate-900 mb-2">
            {token ? 'Set New Password' : 'Reset Password'}
          </h1>
          <p className="text-slate-500 font-bold mb-8 uppercase tracking-wide text-xs">
            {token ? 'Choose a strong new password' : 'Enter your email to get a reset link'}
          </p>

          {error && (
            <div className="mb-6 p-4 bg-danger/10 border-2 border-danger/20 rounded-xl text-danger text-sm font-bold">
              {error}
            </div>
          )}
          
          {status && (
            <div className="mb-6 p-4 bg-primary/10 border-2 border-primary/20 rounded-xl text-primary text-sm font-bold flex items-center gap-2">
              <CheckCircle2 size={18} />
              {status}
            </div>
          )}

          {token ? (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">New Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                  <input 
                    type="password" 
                    required 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 8 characters"
                    className="w-full pl-11 pr-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-primary focus:bg-white transition-all outline-none font-bold text-slate-700"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Confirm Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                  <input 
                    type="password" 
                    required 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full pl-11 pr-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-primary focus:bg-white transition-all outline-none font-bold text-slate-700"
                  />
                </div>
              </div>

              <button type="submit" disabled={loading || status} className="btn-duo btn-duo-primary w-full py-4 text-lg">
                {loading ? <Loader2 className="animate-spin mx-auto" /> : 'Update Password'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRequestReset} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                  <input 
                    type="email" 
                    required 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-11 pr-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-primary focus:bg-white transition-all outline-none font-bold text-slate-700"
                  />
                </div>
              </div>

              <button type="submit" disabled={loading || status} className="btn-duo btn-duo-primary w-full py-4 text-lg">
                {loading ? <Loader2 className="animate-spin mx-auto" /> : 'Send Reset Link'}
              </button>
            </form>
          )}

          <div className="mt-8 pt-8 border-t-2 border-slate-100 text-center">
            <Link to="/login" className="inline-flex items-center gap-2 text-slate-400 font-bold hover:text-primary transition-colors">
              <ArrowLeft size={18} />
              <span>Back to login</span>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
