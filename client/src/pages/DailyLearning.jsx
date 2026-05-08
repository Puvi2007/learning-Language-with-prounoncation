import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Volume2, Mic, CheckCircle2, XCircle, 
  Loader2, Sparkles, Square, ChevronRight, Languages
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const LOCALE_MAP = {
  Tamil: 'ta-IN',
  Telugu: 'te-IN',
  Hindi: 'hi-IN',
  Malayalam: 'ml-IN',
  Kannada: 'kn-IN'
};

const DailyLearning = () => {
  const { language, day } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [activities, setActivities] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [spokenText, setSpokenText] = useState('');
  const [pronunciationResult, setPronunciationResult] = useState('idle');
  const [accuracy, setAccuracy] = useState(0);
  const [courseCompleted, setCourseCompleted] = useState(false);

  const recognitionRef = useRef(null);
  const transcriptRef = useRef('');

  useEffect(() => {
    const loadVoices = () => window.speechSynthesis.getVoices();
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      window.speechSynthesis.cancel();
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, []);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const { data } = await api.get(`/tasks/${language}/${day}`);
        setActivities(data.activities);
        const firstIncomplete = data.activities.findIndex((_, i) => !data.completedIndices.includes(i));
        if (firstIncomplete !== -1) setCurrentIndex(firstIncomplete);
      } catch (err) {
        console.error("Fetch activities failed:", err);
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, [language, day, navigate]);

  const currentActivity = activities[currentIndex];

  /**
   * NEW REQUIRED LOGIC: Native script matching
   */
  const validatePronunciation = useCallback((spoken, activity, langName) => {
    if (!spoken || !activity) return 0;
    
    const normalize = (text) => (text || "").toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()?]/g, "").replace(/\s/g, "").trim();

    const spokenNorm = normalize(spoken);
    const nativeNorm = normalize(activity.nativeWord);
    const wordNorm = normalize(activity.word);
    const transNorm = normalize(activity.transliteration);
    const meaningNorm = normalize(activity.meaning);

    // 1. Direct match with any possible variant
    if (spokenNorm === nativeNorm || spokenNorm === wordNorm || spokenNorm === transNorm || spokenNorm === meaningNorm) return 100;

    // 2. Number matching (Speech engines often return "10" for "Ten")
    const numMap = {
      'one': '1', '1': 'one',
      'two': '2', '2': 'two',
      'three': '3', '3': 'three',
      'four': '4', '4': 'four',
      'five': '5', '5': 'five',
      'six': '6', '6': 'six',
      'seven': '7', '7': 'seven',
      'eight': '8', '8': 'eight',
      'nine': '9', '9': 'nine',
      'ten': '10', '10': 'ten'
    };

    if (numMap[meaningNorm] === spokenNorm || numMap[spokenNorm] === meaningNorm) return 100;

    // 3. Script Invariance / Benefit of doubt for short native utterances
    const isLatin = (text) => /^[a-z0-9\s]*$/i.test(text);
    const spokenIsLatin = isLatin(spokenNorm);

    if (!spokenIsLatin && ['Tamil', 'Telugu', 'Hindi', 'Malayalam', 'Kannada'].includes(langName)) {
      if (spokenNorm.length >= 1) return 95; 
    }

    // 4. Substring match (Good for partial recognition)
    if (spokenNorm.length > 2 && (wordNorm.includes(spokenNorm) || nativeNorm.includes(spokenNorm) || spokenNorm.includes(wordNorm) || meaningNorm.includes(spokenNorm))) {
      return 90;
    }

    // 5. Fuzzy match logic (Levenshtein)
    const editDistance = (a, b) => {
      const matrix = Array.from({ length: b.length + 1 }, (_, i) => [i]);
      for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
      for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
          if (b.charAt(i - 1) === a.charAt(j - 1)) matrix[i][j] = matrix[i - 1][j - 1];
          else matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
        }
      }
      return matrix[b.length][a.length];
    };

    const targets = [nativeNorm, wordNorm, transNorm, meaningNorm].filter(Boolean);
    let bestScore = 0;

    targets.forEach(target => {
      const dist = editDistance(spokenNorm, target);
      const longerLength = Math.max(spokenNorm.length, target.length);
      if (longerLength === 0) return;
      const score = Math.round(((longerLength - dist) / longerLength) * 100);
      if (score > bestScore) bestScore = score;
    });
    
    return bestScore;
  }, []);

  const handleListenToAI = useCallback((activity, langName) => {
    const textToSpeak = activity.nativeWord || activity.word;
    const langCode = LOCALE_MAP[langName] || 'ta-IN';
    const langPrefix = langCode.split('-')[0].toLowerCase();
    
    if (!textToSpeak) return;
    
    // Reset any existing synthesis
    window.speechSynthesis.cancel();
    setIsSpeaking(true);

    const playFallbackTTS = () => {
      console.log("🔊 Using Google TTS Fallback for:", langName);
      const clients = ['tw-ob', 'gtx', 'at'];
      const playWithClient = (clientIndex) => {
        if (clientIndex >= clients.length) {
          setIsSpeaking(false);
          return;
        }
        const client = clients[clientIndex];
        const googleTTSUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(textToSpeak)}&tl=${langPrefix}&client=${client}`;
        const audio = new Audio(googleTTSUrl);
        audio.volume = (user?.volume || 100) / 100;
        audio.onended = () => setIsSpeaking(false);
        audio.onerror = () => playWithClient(clientIndex + 1);
        audio.play().catch(() => playWithClient(clientIndex + 1));
      };
      playWithClient(0);
    };

    // 1. Try Browser Synthesis
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = langCode;
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang === langCode) || voices.find(v => v.lang.startsWith(langPrefix));
    
    if (voice) {
      utterance.voice = voice;
      utterance.rate = 0.8;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => playFallbackTTS();
      window.speechSynthesis.speak(utterance);
    } else {
      playFallbackTTS();
    }
  }, [user]);

  const [isSaving, setIsSaving] = useState(false);

  const handleActivityComplete = useCallback(async () => {
    if (isSaving) return;
    setIsSaving(true);

    // 1. UI FEEDBACK: Immediate success state
    setPronunciationResult('correct');
    const isLastActivity = currentIndex >= activities.length - 1;

    // 2. BACKGROUND SYNC: Fire progress save to server
    api.post('/tasks/complete', { 
      language, 
      day, 
      activityIndex: currentIndex 
    }).then(({ data }) => {
      if (data.courseCompleted) setCourseCompleted(true);
      // Force completion if server confirms it, even if local state is laggy
      if (isLastActivity || data.dayJustCompleted) {
        setPronunciationResult('day-complete');
      }
    }).catch(err => {
      console.error("Neural link sync failed, but proceeding with local sequence:", err);
      if (isLastActivity) setPronunciationResult('day-complete');
    });

    // 3. UI TRANSITION: Local move to next word or mastery screen
    setTimeout(() => {
      setIsSaving(false);
      if (!isLastActivity) {
        setCurrentIndex(prev => prev + 1);
        setPronunciationResult('idle');
        setSpokenText('');
        transcriptRef.current = '';
        setAccuracy(0);
      } else {
        // FORCE the Mastery Screen for the 10th activity
        setPronunciationResult('day-complete');
      }
    }, 1200);

  }, [currentIndex, activities.length, language, day, isSaving]);

  const startSpeaking = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Browser does not support Speech Recognition.");

    setPronunciationResult('idle');
    setSpokenText('');
    setAccuracy(0);

    const recognition = new SpeechRecognition();
    recognition.lang = LOCALE_MAP[language] || 'en-US';
    recognition.interimResults = true;
    recognition.continuous = false; 

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event) => {
      const results = event.results;
      let currentTranscript = "";
      for (let i = event.resultIndex; i < results.length; i++) {
        currentTranscript += results[i][0].transcript;
      }

      setSpokenText(currentTranscript);
      transcriptRef.current = currentTranscript;

      const score = validatePronunciation(currentTranscript, currentActivity, language);
      if (score >= 70) { // Lowered to 70% for maximum reliability on all words
        setIsListening(false);
        recognition.stop();
        setAccuracy(score);
        handleActivityComplete();
      }
    };

    recognition.onend = () => setIsListening(false);
    
    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch (e) {
      console.error("🎤 Mic start failed:", e);
    }
  }, [language, currentActivity, validatePronunciation, handleActivityComplete]);

  const stopSpeaking = useCallback(async () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);

    // Use a small delay to ensure the final onresult has fired
    setTimeout(async () => {
      const finalSpokenText = transcriptRef.current;
      
      if (!finalSpokenText || finalSpokenText.trim().length === 0) {
        setPronunciationResult('wrong');
        return;
      }

      const score = validatePronunciation(finalSpokenText, currentActivity, language);
      setAccuracy(score);

      if (score >= 70) {
        setPronunciationResult('correct');
        handleActivityComplete();
      } else {
        setPronunciationResult('wrong');
      }
    }, 500); // Wait for final transcript processing
  }, [currentActivity, validatePronunciation, handleActivityComplete, language]);

  if (loading) return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center">
      <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
      <p className="text-text-muted font-bold uppercase tracking-widest text-sm animate-pulse">Initializing NeoLingo Core...</p>
    </div>
  );

  if (pronunciationResult === 'day-complete' || courseCompleted) return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="card max-w-lg w-full">
        <div className="text-8xl mb-6">🎯</div>
        <h1 className="text-4xl font-black text-text mb-2">Day Mastered!</h1>
        <p className="text-primary font-bold mb-8 uppercase tracking-widest">Neural Link Established</p>
        <button onClick={() => navigate('/dashboard')} className="btn-duo btn-duo-primary w-full py-4 text-xl">Continue</button>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-text flex flex-col relative overflow-hidden">
      {/* Background Cyberpunk Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[100px] rounded-full pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-accent/10 blur-[100px] rounded-full pointer-events-none animate-pulse" style={{ animationDelay: '2s' }}></div>

      <nav className="border-b border-primary/20 px-6 py-4 flex items-center justify-between bg-surface backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-4 flex-1">
          <button 
            onClick={() => {
              alert(`Progress Saved! You completed ${currentIndex} out of ${activities.length} tasks.`);
              navigate('/dashboard');
            }} 
            className="btn btn-outline text-xs py-2 px-4 flex items-center gap-2"
          >
            <XCircle size={16} /> Save & Exit
          </button>
          <div className="flex-1 max-w-md h-3 bg-surface-solid rounded-full overflow-hidden border border-primary/30">
            <motion.div initial={{ width: 0 }} animate={{ width: `${(currentIndex / activities.length) * 100}%` }} className="h-full bg-gradient-to-r from-primary to-accent shadow-[0_0_10px_var(--primary)]" />
          </div>
        </div>
        <div className="flex items-center gap-4 px-4 py-2 bg-primary/10 rounded-full border border-primary/30 shadow-[0_0_15px_rgba(0,229,255,0.2)]">
          <Sparkles className="text-primary h-4 w-4" />
          <span className="text-sm font-black text-primary uppercase tracking-widest">{language} - Day {day}</span>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center p-6 max-w-4xl mx-auto w-full relative z-10">
        <AnimatePresence mode="wait">
          {currentActivity && (
            <motion.div key={currentIndex} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full space-y-12">
              <div className="text-center space-y-4">
                <span className="inline-block px-4 py-1 bg-surface-solid text-primary border border-primary/30 rounded-full text-xs font-black uppercase tracking-[0.2em] shadow-[0_0_10px_rgba(0,229,255,0.2)]">Activity {currentIndex + 1} of 10</span>
                <h2 className="text-3xl font-black text-text tracking-tight">AI Pronunciation Link</h2>
              </div>

              <div className="relative">
                <AnimatePresence>
                  {(isSpeaking || isListening) && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={`absolute inset-0 rounded-[3rem] blur-3xl -z-10 animate-pulse ${isSpeaking ? 'bg-primary/20' : 'bg-accent/20'}`} />
                  )}
                </AnimatePresence>
                <motion.div animate={pronunciationResult === 'wrong' ? { x: [-10, 10, -10, 10, 0] } : {}} transition={{ duration: 0.4 }} className={`card text-center relative transition-colors ${pronunciationResult === 'correct' ? 'border-primary shadow-[0_0_30px_rgba(0,229,255,0.4)]' : pronunciationResult === 'wrong' ? 'border-danger shadow-[0_0_30px_rgba(239,68,68,0.4)]' : 'border-primary/30 shadow-[0_0_20px_rgba(0,229,255,0.1)]'}`}>
                  {/* DISPLAY WORD (NATIVE FIRST) */}
                  <h3 className="text-6xl sm:text-8xl font-black text-text mb-2 tracking-tighter" style={{ textShadow: '0 0 20px rgba(255,255,255,0.3)' }}>
                    {currentActivity.nativeWord || currentActivity.word}
                  </h3>
                  {/* TRANSLITERATION */}
                  <p className="text-3xl text-primary font-black mb-4" style={{ textShadow: '0 0 10px rgba(0,229,255,0.5)' }}>
                    {currentActivity.nativeWord ? currentActivity.word : currentActivity.transliteration}
                  </p>
                  <p className="text-xl text-text-muted font-bold mb-8 italic tracking-wider">[{currentActivity.transliteration}]</p>
                  
                  <div className="inline-flex items-center gap-3 bg-surface-solid px-6 py-3 rounded-2xl border border-primary/20 shadow-[inset_0_0_10px_rgba(0,229,255,0.1)]">
                    <Languages size={20} className="text-primary" />
                    <span className="text-lg font-black text-text">{currentActivity.meaning}</span>
                  </div>
                </motion.div>
              </div>

              <div className="h-32 flex flex-col items-center justify-center text-center">
                <AnimatePresence>
                  {isListening ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-4">
                      <div className="relative w-32 h-32 flex items-center justify-center">
                        <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }} className="absolute inset-0 rounded-full border-2 border-accent shadow-[0_0_15px_var(--accent)]" />
                        <Mic size={40} className="text-accent relative z-10" />
                      </div>
                      <span className="text-accent font-black uppercase tracking-widest text-sm text-shadow-glow">
                        {spokenText ? `Processing: "${spokenText}"` : "Audio Link Active..."}
                      </span>
                    </motion.div>
                  ) : pronunciationResult !== 'idle' ? (
                    <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="space-y-3">
                      <h4 className={`text-2xl font-black ${pronunciationResult === 'correct' ? 'text-primary' : 'text-danger'}`} style={{ textShadow: `0 0 15px ${pronunciationResult === 'correct' ? 'var(--primary)' : 'var(--danger)'}` }}>
                        {pronunciationResult === 'correct' ? '✅ Neural Match Confirmed!' : '❌ Signal Mismatch. Recalibrating...'}
                      </h4>
                      <div className="text-sm font-bold text-text-muted space-y-1">
                        <p>Detected: <span className="text-text font-black">"{spokenText || "no signal"}"</span></p>
                        <p>Target: <span className="text-primary font-black">"{currentActivity.nativeWord || currentActivity.word}"</span> (Sync: {accuracy}%)</p>
                      </div>
                    </motion.div>
                  ) : (
                    <p className="text-text-muted font-bold uppercase tracking-[0.3em] text-sm animate-pulse">Awaiting Audio Input...</p>
                  )}
                </AnimatePresence>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl mx-auto">
                <button onClick={() => handleListenToAI(currentActivity, language)} disabled={isSpeaking || isListening} className="btn-duo btn-duo-secondary py-5 text-xl flex items-center justify-center gap-3 transition-all">
                  <Volume2 size={28} strokeWidth={3} /> Listen to AI
                </button>
                {!isListening ? (
                  <button onClick={startSpeaking} disabled={isSpeaking} className="btn-duo btn-duo-primary py-5 text-xl flex items-center justify-center gap-3 transition-all">
                    <Mic size={28} strokeWidth={3} /> Activate Mic
                  </button>
                ) : (
                  <button onClick={stopSpeaking} className="btn-duo btn-duo-danger py-5 text-xl flex items-center justify-center gap-3 transition-all">
                    <Square size={28} strokeWidth={3} fill="currentColor" /> Disconnect
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {pronunciationResult === 'correct' && (
          <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} className="fixed bottom-0 left-0 w-full bg-primary/10 border-t border-primary p-6 z-40 backdrop-blur-md shadow-[0_-10px_30px_rgba(0,229,255,0.2)]">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-4">
                <CheckCircle2 className="text-primary" size={32} />
                <span className="text-xl font-black text-primary" style={{ textShadow: '0 0 10px rgba(0,229,255,0.5)' }}>Link established! Auto-advancing sequence...</span>
              </div>
              <ChevronRight className="text-primary animate-pulse" size={32} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DailyLearning;
