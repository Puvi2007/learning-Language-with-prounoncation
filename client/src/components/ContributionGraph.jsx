import React from 'react';
import { motion } from 'framer-motion';

const ContributionGraph = ({ activityHistory = [], language = 'Tamil' }) => {
  // Classic GitHub Green Theme (User requested Green)
  const theme = { 
    primary: '#22c55e', // Dark Green
    light: '#dcfce7',   // Lightest Green
    med: '#86efac',     // Medium Green
    bold: '#166534'      // Deep Forest Green
  };

  // Generate last 112 days (16 weeks)
  const today = new Date();
  const days = [];
  for (let i = 111; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    days.push(date);
  }

  // Group by weeks
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  // Helper to get count for a date
  const getCount = (date) => {
    // Manual YYYY-MM-DD to avoid locale issues
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const entry = activityHistory.find(a => a.date === dateStr);
    return entry ? entry.count : 0;
  };

  return (
    <div className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-100 shadow-sm overflow-x-auto">
      <div className="flex flex-col gap-6 min-w-[750px]">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-green-50 rounded-xl">
              <div className="w-5 h-5 rounded-md" style={{ backgroundColor: theme.primary }}></div>
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Learning Consistency</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Today is {today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
            <span>Relaxed</span>
            <div className="flex gap-1.5">
              <div className="w-3.5 h-3.5 rounded-sm bg-slate-200"></div>
              <div className="w-3.5 h-3.5 rounded-sm" style={{ backgroundColor: theme.light }}></div>
              <div className="w-3.5 h-3.5 rounded-sm" style={{ backgroundColor: theme.med }}></div>
              <div className="w-3.5 h-3.5 rounded-sm" style={{ backgroundColor: theme.primary }}></div>
              <div className="w-3.5 h-3.5 rounded-sm" style={{ backgroundColor: theme.bold }}></div>
            </div>
            <span>On Fire</span>
          </div>
        </div>

        {/* Month Labels like GitHub */}
        <div className="flex gap-2 text-[10px] font-black text-slate-300 uppercase tracking-tighter">
          {weeks.map((week, wi) => {
            const firstDate = week[0];
            const showMonth = wi === 0 || firstDate.getDate() <= 7;
            return (
              <div key={wi} className="w-4 text-center">
                {showMonth ? firstDate.toLocaleDateString('en-US', { month: 'short' }) : ''}
              </div>
            );
          })}
        </div>

        <div className="flex gap-2">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-2">
              {week.map((date) => {
                const count = getCount(date);
                const dateKey = date.toISOString();
                
                // GitHub-style thresholds:
                // 1-3 tasks: Tier 1 (Light)
                // 4-6 tasks: Tier 2 (Medium)
                // 7-10 tasks: Tier 3 (Primary/Dark)
                // > 10 tasks: Tier 4 (Bold)
                let bgColor = 'transparent';
                if (count > 0 && count <= 3) bgColor = theme.light;
                else if (count > 3 && count <= 6) bgColor = theme.med;
                else if (count > 6 && count <= 10) bgColor = theme.primary;
                else if (count > 10) bgColor = theme.bold;

                return (
                  <motion.div
                    key={dateKey}
                    whileHover={{ scale: 1.4, zIndex: 10, borderRadius: '6px' }}
                    style={{ backgroundColor: count > 0 ? bgColor : undefined }}
                    className={`
                      w-4 h-4 rounded-[4px] transition-all cursor-pointer border
                      ${count === 0 ? 'bg-slate-50 border-slate-100 hover:bg-slate-200' : 'border-black/5'}
                    `}
                    title={`${date.toLocaleDateString()}: ${count} activities completed`}
                  />
                );
              })}
            </div>
          ))}
        </div>
        
        <div className="flex justify-between text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">
          <span>Activity History (Last 16 Weeks)</span>
          <div className="flex gap-8">
            <span className="text-primary">{today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContributionGraph;
