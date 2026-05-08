import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Download, Award, ShieldCheck, Sparkles, Zap, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

const Certificate = ({ username, language, completedAt, certificateId, type, completionPercentage, rank }) => {
  const certRef = useRef(null);

  const getRankConfig = () => {
    // Priority 1: Use provided rank from DB
    if (rank === 'Gold') return { label: 'Gold Tier', color: '#FFD700', bg: 'rgba(255, 215, 0, 0.1)', shadow: '0 0 30px rgba(255, 215, 0, 0.3)' };
    if (rank === 'Silver') return { label: 'Silver Tier', color: '#C0C0C0', bg: 'rgba(192, 192, 192, 0.1)', shadow: '0 0 30px rgba(192, 192, 192, 0.3)' };
    if (rank === 'Bronze') return { label: 'Bronze Tier', color: '#CD7F32', bg: 'rgba(205, 127, 50, 0.1)', shadow: '0 0 30px rgba(205, 127, 50, 0.3)' };

    // Priority 2: Fallback logic based on percentage
    if (completionPercentage >= 90) return { label: 'Gold Tier', color: '#FFD700', bg: 'rgba(255, 215, 0, 0.1)', shadow: '0 0 30px rgba(255, 215, 0, 0.3)' };
    if (completionPercentage >= 70) return { label: 'Silver Tier', color: '#C0C0C0', bg: 'rgba(192, 192, 192, 0.1)', shadow: '0 0 30px rgba(192, 192, 192, 0.3)' };
    if (completionPercentage >= 40) return { label: 'Bronze Tier', color: '#CD7F32', bg: 'rgba(205, 127, 50, 0.1)', shadow: '0 0 30px rgba(205, 127, 50, 0.3)' };
    
    return { label: 'Standard Tier', color: '#00E5FF', bg: 'rgba(0, 229, 255, 0.1)', shadow: '0 0 30px rgba(0, 229, 255, 0.3)' };
  };

  const rankConfig = getRankConfig();

  const formattedDate = completedAt
    ? new Date(completedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const handleDownload = async () => {
    if (!certRef.current) return;
    
    try {
      // Small delay to ensure styles are applied
      await new Promise(resolve => setTimeout(resolve, 100));

      const canvas = await html2canvas(certRef.current, {
        scale: 3, // Higher scale for better quality
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 1200, // Fixed width for consistent capture
        windowHeight: 750, // Fixed height for consistent capture
        x: 0,
        y: 0,
        scrollX: 0,
        scrollY: 0
      });
      
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`NeoLingo_${type}_Certificate_${language}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <div className="flex flex-col items-center gap-10 w-full max-w-5xl mx-auto py-12 px-4">
      <div className="w-full overflow-auto flex justify-center pb-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          ref={certRef}
          className="relative w-[1000px] min-w-[1000px] aspect-[1.6/1] bg-white border-[6px] p-2 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden"
          style={{ transformOrigin: 'center', borderColor: rankConfig.color }}
        >
          {/* Futuristic Background Patterns */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
            style={{ 
              backgroundImage: `linear-gradient(to right, ${rankConfig.color} 1px, transparent 1px), linear-gradient(to bottom, ${rankConfig.color} 1px, transparent 1px)`,
              backgroundSize: '40px 40px'
            }} 
          />
          
          {/* Subtle Glow Orbs based on Rank */}
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] blur-[80px] rounded-full" style={{ backgroundColor: rankConfig.color, opacity: 0.1 }}></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] blur-[80px] rounded-full" style={{ backgroundColor: rankConfig.color, opacity: 0.1 }}></div>

          {/* Inner Content Area */}
          <div className="relative w-full h-full border border-slate-100 rounded-[2.8rem] bg-white/80 p-12 flex flex-col items-center text-center justify-between">
            
            {/* Header */}
            <div className="w-full flex justify-between items-start">
              <div className="flex items-center gap-2" style={{ color: rankConfig.color }}>
                <div className="p-2 border rounded-lg" style={{ backgroundColor: rankConfig.bg, borderColor: rankConfig.color }}>
                  <Cpu size={24} />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em]">Neural Network Verified</p>
                  <p className="text-[8px] font-bold opacity-60">RANK: {rankConfig.label.toUpperCase()}</p>
                </div>
              </div>
              <div className="h-20 w-20 border-2 rounded-2xl flex items-center justify-center shadow-lg" style={{ color: rankConfig.color, backgroundColor: rankConfig.bg, borderColor: rankConfig.color }}>
                <Award size={48} strokeWidth={2.5} />
              </div>
              <div className="text-right" style={{ color: rankConfig.color }}>
                <p className="text-[10px] font-black uppercase tracking-[0.2em]">Certificate ID</p>
                <p className="text-[8px] font-bold opacity-60">{certificateId || 'NL-88X-B2'}</p>
              </div>
            </div>

            {/* Main Body */}
            <div className="space-y-6">
              <div className="space-y-2">
                <h1 className="text-6xl font-black text-slate-900 uppercase tracking-tighter mb-2">
                  Mastery Certificate
                </h1>
                <div className="inline-flex items-center gap-3 px-6 py-2 border rounded-full" style={{ backgroundColor: rankConfig.bg, borderColor: rankConfig.color }}>
                  <Sparkles size={16} style={{ color: rankConfig.color }} />
                  <span className="text-sm font-black uppercase tracking-[0.3em]" style={{ color: rankConfig.color }}>{rankConfig.label}: {language} Sector</span>
                </div>
              </div>

              <div className="py-6 space-y-4">
                <p className="text-slate-500 text-lg font-medium tracking-wide">This digital record confirms the successful neural sync of</p>
                <h2 className="text-7xl font-black text-slate-900 tracking-tight inline-block relative">
                  {username}
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
                </h2>
                <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed pt-4">
                  Completed the <span className="text-slate-900 font-bold underline decoration-primary/30 underline-offset-8">14-Day Intensive Learning Sequence</span> with 
                  <span className="font-black" style={{ color: rankConfig.color }}> {completionPercentage}% sync accuracy </span> 
                  earning the <span className="font-black uppercase" style={{ color: rankConfig.color }}>{rankConfig.label}</span> status.
                </p>
              </div>
            </div>

            {/* Footer Footer */}
            <div className="w-full grid grid-cols-3 items-end gap-8 border-t border-slate-100 pt-8 mt-4">
              <div className="text-left">
                <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-60" style={{ color: rankConfig.color }}>Authorization Date</p>
                <p className="text-lg font-bold text-slate-800">{formattedDate}</p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="relative">
                  <ShieldCheck style={{ color: rankConfig.color }} size={40} />
                </div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">AI Verified Learner</div>
              </div>

              <div className="text-right">
                <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-60" style={{ color: rankConfig.color }}>System Signature</p>
                <div className="relative inline-block">
                  <p className="text-2xl font-black text-slate-900 italic tracking-tighter" style={{ fontFamily: 'monospace' }}>Neo_Lingo_AI_Core</p>
                  <div className="absolute top-[-10px] left-0 w-full h-[2px] opacity-30 skew-x-[-20deg]" style={{ backgroundColor: rankConfig.color }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative corner accents */}
          <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 rounded-tl-[3rem]" style={{ borderColor: rankConfig.color, opacity: 0.5 }}></div>
          <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 rounded-br-[3rem]" style={{ borderColor: rankConfig.color, opacity: 0.5 }}></div>
        </motion.div>
      </div>

      <div className="flex gap-4">
        <button 
          onClick={handleDownload}
          className="btn-duo btn-duo-primary px-12 py-5 text-xl flex items-center gap-3 shadow-[0_10px_30px_rgba(0,229,255,0.2)] transition-all hover:scale-105 active:scale-95"
        >
          <Download size={24} strokeWidth={3} />
          Export Data Packet (PDF)
        </button>
      </div>
    </div>
  );
};

export default Certificate;
