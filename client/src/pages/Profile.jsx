import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Award, Target, Flame, 
  ChevronRight, MapPin, Mail, Phone
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import ContributionGraph from '../components/ContributionGraph';
import Certificate from '../components/Certificate';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Profile = () => {
  const { user } = useAuth();
  const [progress, setProgress] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCert, setActiveCert] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [progRes, certRes] = await Promise.all([
          api.get(`/language/progress?language=${user.selectedLanguage}`),
          api.get(`/language/certificate?language=${user.selectedLanguage}`)
        ]);
        setProgress(progRes.data.progress);
        setCertificates(certRes.data.certificates || []);
      } catch (err) {
        console.error("Profile data fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };
    if (user?.selectedLanguage) fetchData();
    else setLoading(false);
  }, [user]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground lg:pl-64 transition-colors duration-300">
      <Sidebar />
      
      <main className="p-4 sm:p-8 max-w-5xl mx-auto space-y-8">
        {/* Profile Header */}
        <div className="bg-surface-solid rounded-[3rem] p-8 border-2 border-border shadow-sm overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl" />
          
          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            <div className="relative group">
              <div className="h-40 w-40 rounded-[2.5rem] bg-secondary flex items-center justify-center text-white text-7xl font-black shadow-2xl shadow-secondary/20">
                {user?.username?.[0]?.toUpperCase()}
              </div>
              <div className="absolute -bottom-2 -right-2 h-12 w-12 bg-primary rounded-2xl border-4 border-white flex items-center justify-center text-white shadow-lg">
                <Flame size={24} fill="currentColor" />
              </div>
            </div>

            <div className="flex-1 text-center md:text-left space-y-4">
              <div>
                <h1 className="text-4xl font-black text-foreground tracking-tight">{user?.username}</h1>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-1">Learner since {new Date(user?.createdAt).getFullYear()}</p>
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <div className="flex items-center gap-2 text-slate-500 font-bold text-sm bg-slate-50 px-4 py-2 rounded-xl">
                  <Mail size={16} className="text-slate-300" />
                  {user?.email}
                </div>
                {user?.phone && (
                  <div className="flex items-center gap-2 text-slate-500 font-bold text-sm bg-slate-50 px-4 py-2 rounded-xl">
                    <Phone size={16} className="text-slate-300" />
                    {user?.phone}
                  </div>
                )}
                <div className="flex items-center gap-2 text-slate-500 font-bold text-sm bg-slate-50 px-4 py-2 rounded-xl">
                  <MapPin size={16} className="text-slate-300" />
                  {user?.region || 'India'}
                </div>
              </div>

              <div className="flex justify-center md:justify-start gap-6 pt-2">
                <div className="text-center">
                  <p className="text-2xl font-black text-foreground">{user?.streak || 0}</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Day Streak</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-black text-slate-900">{user?.xp || 0}</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total XP</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-black text-slate-900">{certificates.length}</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Certificates</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-black text-foreground uppercase tracking-tight flex items-center gap-2">
              <Target className="text-primary" /> Learning Heatmap
            </h3>
            <ContributionGraph completedDays={progress?.completedDays || []} />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
              <Award className="text-accent" /> Your Certificates
            </h3>
            <div className="bg-surface-solid rounded-3xl border-2 border-border p-6 space-y-4 min-h-[300px]">
              {certificates.length > 0 ? (
                <div className="grid grid-cols-1 gap-3">
                  {certificates.map((cert) => (
                    <button
                      key={cert._id}
                      onClick={() => setActiveCert(cert)}
                      className="flex items-center justify-between p-4 bg-slate-50 hover:bg-primary/5 rounded-2xl border-2 border-transparent hover:border-primary/20 transition-all group text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-surface rounded-xl flex items-center justify-center text-primary shadow-sm border border-border">
                          <Award size={24} />
                        </div>
                        <div>
                          <h4 className="font-black text-slate-700 text-sm">{cert.certificateType} Certificate</h4>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{cert.language} • {cert.completionPercentage}% Done</p>
                        </div>
                      </div>
                      <ChevronRight className="text-slate-300 group-hover:text-primary transition-colors" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                  <div className="h-16 w-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200">
                    <Award size={32} />
                  </div>
                  <p className="text-slate-400 font-bold text-sm uppercase tracking-widest leading-relaxed">
                    Complete Day 1 to earn your first Daily Certificate!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Certificate Viewer Modal */}
        {activeCert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[3rem] w-full max-w-5xl max-h-[90vh] overflow-y-auto relative"
            >
              <button 
                onClick={() => setActiveCert(null)}
                className="absolute top-8 right-8 z-20 h-12 w-12 bg-slate-100 hover:bg-slate-200 rounded-2xl flex items-center justify-center text-slate-500 transition-colors"
              >
                ✕
              </button>
              
              <div className="p-8">
                <Certificate 
                  username={user.username}
                  language={activeCert.language}
                  completedAt={activeCert.completedAt}
                  certificateId={activeCert.certificateId}
                  type={activeCert.certificateType}
                  completionPercentage={activeCert.completionPercentage}
                />
              </div>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Profile;
