import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, CheckCircle2, Play, BookOpen, X } from 'lucide-react';
import api from '../utils/api';

const CourseRoadmap = ({ currentDay, completedDays, language }) => {
  const [selectedDay, setSelectedDay] = useState(null);
  const [dayWords, setDayWords] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleDayClick = async (day) => {
    // Users can click any day to preview the curriculum

    setSelectedDay(day);
    setLoading(true);
    try {
      const { data } = await api.get(`/tasks/${language}/${day}`);
      setDayWords(data.activities || data.tasks || []);
    } catch (err) {
      console.error("Failed to fetch day words:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-black uppercase tracking-tight" style={{ color: 'var(--text)' }}>
          14-Day Roadmap
        </h3>
        <span className="text-xs font-black px-3 py-1 bg-primary/10 text-primary rounded-full uppercase tracking-widest">
          {completedDays?.length || 0} / 14 Days
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4">
        {Array.from({ length: 14 }).map((_, i) => {
          const dayNum = i + 1;
          const isCompleted = completedDays?.includes(dayNum);
          const isCurrent = dayNum === currentDay;
          const isLocked = dayNum > currentDay;

          return (
            <motion.button
              key={dayNum}
              whileHover={!isLocked ? { scale: 1.05, y: -2 } : {}}
              whileTap={!isLocked ? { scale: 0.95 } : {}}
              onClick={() => handleDayClick(dayNum)}
              className={`relative h-20 rounded-3xl border-2 flex flex-col items-center justify-center transition-all shadow-sm ${
                isCompleted 
                  ? 'border-primary bg-primary/5' 
                  : isCurrent 
                    ? 'border-secondary bg-secondary/5 ring-4 ring-secondary/10' 
                    : isLocked 
                      ? 'border-border bg-surface opacity-40 grayscale cursor-not-allowed' 
                      : 'border-border bg-surface'
              }`}
            >
              {isCompleted ? (
                <CheckCircle2 className="text-primary mb-1" size={18} />
              ) : isLocked ? (
                <Lock className="text-text-muted mb-1" size={18} />
              ) : (
                <Play className={`${isCurrent ? 'text-secondary' : 'text-text-muted'} mb-1`} size={18} fill="currentColor" />
              )}
              <span className={`text-xs font-black uppercase tracking-widest ${isCurrent ? 'text-secondary' : 'text-text'}`}>
                Day {dayNum}
              </span>

              {/* Progress Connector line logic could be added here for a path view */}
            </motion.button>
          );
        })}
      </div>

      {/* Day Words Modal */}
      <AnimatePresence>
        {selectedDay && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDay(null)}
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg rounded-[3rem] p-8 border-4 overflow-hidden shadow-2xl"
              style={{ backgroundColor: 'var(--surface-solid)', borderColor: 'var(--border)' }}
            >
              <button 
                onClick={() => setSelectedDay(null)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-surface transition-colors"
              >
                <X size={24} />
              </button>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <BookOpen className="text-primary" size={32} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black uppercase tracking-tight" style={{ color: 'var(--text)' }}>
                      Day {selectedDay} Vocabulary
                    </h3>
                    <p className="text-xs font-black text-primary uppercase tracking-widest">
                      {language} Mastery
                    </p>
                  </div>
                </div>

                <div className="max-h-[50vh] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                  {loading ? (
                    <div className="py-12 flex flex-col items-center gap-4">
                      <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                      <p className="font-bold text-sm uppercase tracking-widest text-text-muted">Fetching curriculum...</p>
                    </div>
                  ) : dayWords.length > 0 ? (
                    dayWords.map((word, idx) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        key={idx}
                        className="p-4 rounded-2xl border-2 flex items-center justify-between"
                        style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
                      >
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">{word.meaning}</p>
                          <h4 className="text-xl font-black" style={{ color: 'var(--text)' }}>{word.word}</h4>
                          <p className="text-xs font-bold text-text-muted">{word.nativeWord}</p>
                        </div>
                        <div className="text-right">
                           <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Pronunciation</p>
                           <p className="text-sm font-bold italic text-secondary">{word.transliteration}</p>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-center py-8 font-bold text-text-muted uppercase tracking-widest">No words found for this day.</p>
                  )}
                </div>

                <button 
                  onClick={() => setSelectedDay(null)}
                  className="btn-duo btn-duo-primary w-full py-4 text-lg"
                >
                  Got it!
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CourseRoadmap;
