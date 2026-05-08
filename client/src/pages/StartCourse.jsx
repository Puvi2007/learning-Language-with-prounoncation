import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const LANGUAGES = [
  { id: 'Tamil', name: 'Tamil', flag: '🌺', script: 'தமிழ்', color: 'bg-red-500', border: 'border-red-200' },
  { id: 'Telugu', name: 'Telugu', flag: '🌸', script: 'తెలుగు', color: 'bg-orange-500', border: 'border-orange-200' }
];

const StartCourse = () => {
  const [selected, setSelected] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { updateUser, user } = useAuth();

  const handleStart = async () => {
    if (!selected) return;
    setLoading(true);
    try {
      await api.post('/language/select', { language: selected });
      updateUser({ selectedLanguage: selected });
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to initialize course. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-background relative overflow-hidden">
      {/* Background Cyberpunk Elements */}
      <div className="absolute top-0 left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[100px] rounded-full pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 blur-[100px] rounded-full pointer-events-none animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-[2rem] border border-primary/20 mb-6 shadow-[0_0_20px_rgba(0,229,255,0.2)]">
            <Sparkles className="text-primary w-10 h-10 animate-pulse" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-black mb-4 tracking-tight text-text text-shadow-glow">
            Welcome, {user?.username}!
          </h1>
          <p className="text-xl font-bold text-text-muted">
            Initialize your neural link. Select a language module.
          </p>
        </motion.div>

        {error && (
          <div className="mb-8 p-4 bg-danger/10 border-2 border-danger/20 rounded-2xl text-danger font-bold text-center shadow-[0_0_15px_rgba(239,68,68,0.2)]">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          {LANGUAGES.map((lang) => (
            <motion.div
              key={lang.id}
              whileHover={{ y: -5, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelected(lang.id)}
              className={`
                relative cursor-pointer p-6 rounded-[2rem] border transition-all
                ${selected === lang.id 
                  ? 'border-primary shadow-[0_0_30px_rgba(0,229,255,0.4)] bg-primary/5' 
                  : 'hover:border-primary/50 border-primary/10 bg-surface shadow-md'}
              `}
            >
              <div className="flex items-center gap-6">
                <div className={`h-20 w-20 rounded-[2rem] bg-background flex items-center justify-center text-4xl border border-primary/20 shadow-[inset_0_0_15px_rgba(0,0,0,0.5)]`}>
                  <span className="drop-shadow-lg">{lang.flag}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-black text-text tracking-tight">{lang.name}</h3>
                  <p className="text-lg font-bold text-primary tracking-widest">{lang.script}</p>
                </div>
                {selected === lang.id && (
                  <div className="absolute top-6 right-6 h-8 w-8 bg-primary rounded-full flex items-center justify-center text-background shadow-[0_0_10px_var(--primary)]">
                    <Check size={20} strokeWidth={4} />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="flex justify-center"
          initial={false}
          animate={{ opacity: selected ? 1 : 0.5, y: selected ? 0 : 10 }}
        >
          <button
            onClick={handleStart}
            disabled={!selected || loading}
            className={`
              btn-duo btn-duo-primary px-12 py-5 text-xl min-w-[300px] flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(0,229,255,0.3)]
              ${!selected && 'cursor-not-allowed'}
            `}
          >
            {loading ? (
              <div className="h-6 w-6 border-4 border-background border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Initialize Link
                <ArrowRight size={24} strokeWidth={3} />
              </>
            )}
          </button>
        </motion.div>

        <p className="mt-12 text-center text-primary/50 font-bold uppercase tracking-[0.3em] text-xs">
          Each module includes 140 AI-generated neural activities
        </p>
      </div>
    </div>
  );
};

export default StartCourse;
