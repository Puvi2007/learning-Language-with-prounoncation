import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Flame, Target, Calendar, ArrowRight, 
  CheckCircle2, Star, Award, Zap, Languages
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import ContributionGraph from '../components/ContributionGraph';
import ProgressBar from '../components/ProgressBar';
import CourseRoadmap from '../components/CourseRoadmap';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedAchievement, setSelectedAchievement] = useState(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const { data } = await api.get(`/language/progress?language=${user.selectedLanguage}`);
        setProgress({
          ...data.progress,
          activityHistory: data.activityHistory || []
        });
      } catch (err) {
        console.error("Failed to fetch progress:", err);
      } finally {
        setLoading(false);
      }
    };
    if (user?.selectedLanguage) fetchProgress();
    else setLoading(false);
  }, [user]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent shadow-[0_0_15px_var(--primary)]"></div>
      </div>
    );
  }

  // If no language selected, redirect to start-course
  if (!user?.selectedLanguage) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-background">
        <div className="p-12 rounded-[3rem] shadow-[0_0_40px_rgba(0,229,255,0.15)] max-w-md card">
          <Languages className="h-20 w-20 text-primary mx-auto mb-6 drop-shadow-[0_0_10px_var(--primary)]" />
          <h1 className="text-3xl font-black mb-4 text-text">No Language Selected</h1>
          <p className="font-bold mb-8 uppercase tracking-wide text-text-muted">Start your NeoLingo journey today!</p>
          <Link to="/start-course" className="btn-duo btn-duo-primary w-full py-4">Initialize Link</Link>
        </div>
      </div>
    );
  }

  const currentDay = progress?.currentDay || 1;
  const progressPercent = progress?.progressPercentage || 0;

  return (
    <>
    <div className="min-h-screen lg:pl-64 bg-background relative overflow-hidden">
      {/* Background Cyberpunk Elements */}
      <div className="absolute top-[10%] left-[20%] w-[30%] h-[30%] bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] bg-accent/5 blur-[120px] rounded-full pointer-events-none"></div>

      <Sidebar />
      
      <main className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 relative z-10">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tight mb-2 text-text text-shadow-glow">
              Hello, {user?.username}! 👋
            </h1>
            <p className="font-bold uppercase tracking-widest text-sm text-primary">
              System active. Maintain momentum on your {user?.selectedLanguage} link.
            </p>
          </div>
          <div className="flex gap-3">
            <div className="px-6 py-3 rounded-2xl card flex items-center gap-3">
              <Flame className="text-accent drop-shadow-[0_0_10px_var(--accent)]" size={24} />
              <span className="text-xl font-black text-text">{user?.streak || 0}</span>
            </div>
            <div className="px-6 py-3 rounded-2xl card flex items-center gap-3">
              <Zap className="text-secondary drop-shadow-[0_0_10px_var(--secondary)]" size={24} />
              <span className="text-xl font-black text-text">{user?.xp || 0}</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Course Progress */}
          <section className="lg:col-span-2 space-y-8">
            <div className="p-8 rounded-[2.5rem] card relative overflow-hidden group">
              <div className="relative z-10">
                <h2 className="text-2xl font-black mb-6 uppercase tracking-tight text-text">Active Link: <span className="text-primary">{user?.selectedLanguage}</span></h2>
                
                <div className="mb-10">
                  <ProgressBar value={progressPercent} height={24} showLabel={true} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Link 
                    to={`/learning/${user.selectedLanguage}/${currentDay}`}
                    className="btn-duo btn-duo-primary py-5 text-xl flex items-center justify-center gap-3"
                  >
                    Resume Sequence
                    <ArrowRight size={24} strokeWidth={3} />
                  </Link>
                  <div className="rounded-2xl px-6 py-4 flex items-center justify-between bg-surface-solid border border-primary/20 shadow-[inset_0_0_15px_rgba(0,229,255,0.05)]">
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-text-muted">Current Objective</p>
                      <h4 className="text-xl font-black text-text">Phase {currentDay} / 14</h4>
                    </div>
                    <Calendar className="text-primary opacity-50" size={32} />
                  </div>
                </div>
              </div>
            </div>

            {/* Course Roadmap */}
            <div className="p-8 rounded-[2.5rem] card">
              <CourseRoadmap 
                currentDay={currentDay} 
                completedDays={progress?.completedDays || []} 
                language={user?.selectedLanguage} 
              />
            </div>

            {/* Contribution Graph */}
            <div className="card border-none bg-transparent shadow-none p-0">
              <h3 className="text-lg font-black mb-4 uppercase tracking-tight flex items-center gap-2 text-text">
                <Target className="text-primary" /> Learning Consistency
              </h3>
              <ContributionGraph 
                activityHistory={progress?.activityHistory || []} 
                language={user?.selectedLanguage}
              />
            </div>
          </section>

          {/* Sidebar Stats */}
          <aside className="space-y-8">
            {/* Achievements Card */}
            <div className="p-8 rounded-[2.5rem] card">
              <h3 className="text-lg font-black mb-6 uppercase tracking-tight flex items-center gap-2 text-text">
                <Award className="text-accent" /> Network Milestones
              </h3>
              <div className="space-y-4">
                {[
                  { icon: <Star />, title: "First Word", desc: "Completed 1 activity", color: "#eab308", done: true, current: 1, goal: 1 },
                  { icon: <Flame />, title: "3 Day Streak", desc: "Learn for 3 days", color: "#f97316", done: user?.streak >= 3, current: user?.streak || 0, goal: 3 },
                  { icon: <Target />, title: "Halfway There", desc: "Complete 7 days", color: "var(--primary)", done: progress?.completedDays?.length >= 7, current: progress?.completedDays?.length || 0, goal: 7 },
                  { icon: <Award />, title: "Polyglot", desc: "Complete 14 days", color: "var(--secondary)", done: progress?.isCompleted, current: progress?.completedDays?.length || 0, goal: 14 },
                ].map((ach, i) => (
                  <button 
                    key={i} 
                    onClick={() => setSelectedAchievement(ach)}
                    className={`w-full flex items-center gap-4 p-3 rounded-2xl border-2 transition-all hover:scale-[1.02] active:scale-95 ${ach.done ? 'border-primary/30 shadow-[0_0_10px_rgba(0,229,255,0.1)]' : 'opacity-40 border-transparent hover:border-primary/10'}`} 
                    style={{ backgroundColor: ach.done ? 'var(--surface)' : 'transparent' }}
                  >
                    <div className="h-12 w-12 rounded-xl flex items-center justify-center shadow-sm" style={{ backgroundColor: 'var(--surface-solid)', color: ach.color }}>
                      {ach.icon}
                    </div>
                    <div className="text-left">
                      <h4 className="font-black text-sm text-text">{ach.title}</h4>
                      <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{ach.desc}</p>
                    </div>
                    {ach.done && <CheckCircle2 className="ml-auto text-primary drop-shadow-[0_0_5px_var(--primary)]" size={16} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Certificates Preview */}
            <div className="card bg-surface-solid border-accent/20 shadow-[0_0_30px_rgba(168,85,247,0.15)] relative overflow-hidden group">
              <div className="absolute -bottom-10 -right-10 text-accent/10 rotate-12 group-hover:rotate-6 transition-transform">
                <Award size={180} />
              </div>
              <h3 className="text-lg font-black mb-4 uppercase tracking-tight relative z-10 text-accent text-shadow-glow">Certification</h3>
              <p className="text-text-muted font-bold text-sm mb-6 relative z-10 leading-relaxed">
                Complete the full 14-day sequence to unlock your AI-Verified Certificate of Completion.
              </p>
              {progress?.isCompleted ? (
                <Link to="/profile" className="btn-duo btn-duo-accent w-full py-3 relative z-10">
                  View Certificate
                </Link>
              ) : (
                <div className="w-full relative z-10">
                  <ProgressBar value={progressPercent} height={8} />
                </div>
              )}
            </div>
          </aside>
        </div>
      </main>
    </div>
    
    {/* Achievement Modal */}
    <AnimatePresence>
      {selectedAchievement && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={() => setSelectedAchievement(null)}
            className="absolute inset-0 bg-background/90 backdrop-blur-md"
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-sm rounded-[3rem] p-8 border border-primary/30 shadow-[0_0_50px_rgba(0,229,255,0.2)] overflow-hidden bg-surface-solid"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10">
              {selectedAchievement.icon}
            </div>
            
            <div className="text-center space-y-6 relative z-10">
              <div className="inline-flex h-24 w-24 rounded-[2rem] items-center justify-center shadow-[0_0_20px_currentColor] bg-surface" style={{ color: selectedAchievement.color }}>
                {React.cloneElement(selectedAchievement.icon, { size: 48, strokeWidth: 3 })}
              </div>
              
              <div>
                <h3 className="text-2xl font-black uppercase tracking-tight text-text">
                  {selectedAchievement.title}
                </h3>
                <p className="font-bold uppercase tracking-widest text-xs text-primary">
                  {selectedAchievement.done ? 'Network Milestone Reached!' : 'Locked Sector'}
                </p>
              </div>

              <div className="p-6 rounded-3xl space-y-4 bg-surface border border-primary/10">
                <p className="text-sm font-bold leading-relaxed text-text">
                  {selectedAchievement.desc}
                </p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-text-muted">
                    <span>Progress</span>
                    <span>{selectedAchievement.current} / {selectedAchievement.goal}</span>
                  </div>
                  <ProgressBar value={(selectedAchievement.current / selectedAchievement.goal) * 100} height={12} />
                </div>
              </div>

              <button 
                onClick={() => setSelectedAchievement(null)}
                className="btn-duo btn-duo-primary w-full py-4 text-lg"
              >
                {selectedAchievement.done ? 'Acknowledge' : 'Return to Hub'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
    </>
  );
};

export default Dashboard;
