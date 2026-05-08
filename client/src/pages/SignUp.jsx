import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Languages, Mail, Lock, User, ArrowRight, Loader2, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const SignUp = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const res = await api.post('/auth/signup', form);
      const { user, token } = res.data;
      
      login(user, token);
      navigate('/start-course');
    } catch (err) {
      if (err.response?.data?.errors) {
        setError(err.response.data.errors[0].msg);
      } else {
        setError(err.response?.data?.message || 'Something went wrong during registration.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-center items-center p-4 py-12 transition-colors duration-300">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="h-12 w-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 transition-transform group-hover:scale-110">
              <Languages className="text-white" />
            </div>
            <span className="text-3xl font-black text-primary tracking-tight">LLWP</span>
          </Link>
        </div>

        <div className="bg-surface-solid rounded-[2rem] border-2 border-border p-8 shadow-sm relative overflow-hidden">
          {/* Decorative Background */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
          
          <h1 className="text-3xl font-black text-foreground mb-2 relative z-10">Create Account</h1>
          <p className="text-text-muted font-bold mb-8 uppercase tracking-wide text-xs relative z-10">Start your 14-day mastery today</p>
          
          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-6 p-4 bg-danger/10 border-2 border-danger/20 rounded-xl text-danger text-sm font-bold flex items-center gap-2"
            >
              <div className="h-2 w-2 rounded-full bg-danger animate-pulse" />
              {error}
            </motion.div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Username</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                <input 
                  name="username" 
                  type="text" 
                  required 
                  minLength={3}
                  value={form.username} 
                  onChange={handleChange}
                  placeholder="Choose a username"
                  className="w-full pl-12 pr-4 py-4 bg-surface border-2 border-border rounded-2xl focus:border-primary focus:bg-surface-solid transition-all outline-none font-bold text-foreground placeholder:text-text-muted"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                <input 
                  name="email" 
                  type="email" 
                  required 
                  value={form.email} 
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full pl-12 pr-4 py-4 bg-surface border-2 border-border rounded-2xl focus:border-primary focus:bg-surface-solid transition-all outline-none font-bold text-foreground placeholder:text-text-muted"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                <input 
                  name="password" 
                  type="password" 
                  required 
                  minLength={8}
                  value={form.password} 
                  onChange={handleChange}
                  placeholder="Minimum 8 characters"
                  className="w-full pl-12 pr-4 py-4 bg-surface border-2 border-border rounded-2xl focus:border-primary focus:bg-surface-solid transition-all outline-none font-bold text-foreground placeholder:text-text-muted"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Confirm Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                <input 
                  name="confirmPassword" 
                  type="password" 
                  required 
                  minLength={8}
                  value={form.confirmPassword} 
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="w-full pl-12 pr-4 py-4 bg-surface border-2 border-border rounded-2xl focus:border-primary focus:bg-surface-solid transition-all outline-none font-bold text-foreground placeholder:text-text-muted"
                />
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-surface rounded-2xl border-2 border-border">
              <CheckCircle className="text-primary mt-1 shrink-0" size={18} />
              <p className="text-xs font-bold text-slate-500 leading-relaxed">
                By signing up, you agree to our Terms and that you will complete the 14-day challenge.
              </p>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="btn-duo btn-duo-primary w-full py-4 text-lg mt-4 flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  Create Account 
                  <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t-2 border-slate-100 text-center relative z-10">
            <p className="text-slate-500 font-bold">
              Already have an account? {' '}
              <Link to="/login" className="text-secondary hover:text-secondary-dark border-b-2 border-transparent hover:border-secondary transition-all">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUp;
