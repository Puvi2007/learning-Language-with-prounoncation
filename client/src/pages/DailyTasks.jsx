import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useSpeechRecognition from '../hooks/useSpeechRecognition';
import api from '../utils/api';

const LOCALE_MAP = {
  Tamil: 'ta-IN',
  Telugu: 'te-IN',
  Hindi: 'hi-IN',
  Malayalam: 'ml-IN',
  Kannada: 'kn-IN'
};

const DailyTasks = () => {
  const { language, day } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedIndices, setCompletedIndices] = useState([]);
  const [theme, setTheme] = useState('');
  const [loading, setLoading] = useState(true);
  const [taskStatus, setTaskStatus] = useState('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [dayDone, setDayDone] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data } = await api.get(`/tasks/${language}/${day}`);
        setTasks(data.tasks || []);
        setTheme(data.theme || '');
        const completed = data.completedTaskIndices || [];
        setCompletedIndices(completed);
        const firstIncomplete = (data.tasks || []).findIndex(
          (_, i) => !completed.includes(i)
        );
        if (firstIncomplete !== -1) setCurrentIndex(firstIncomplete);
        else setCurrentIndex(0);
      } catch (err) {
        console.error('Failed to fetch tasks', err);
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [language, day, navigate]);

  useEffect(() => {
    // Pre-load voices for speech synthesis
    const loadVoices = () => {
      window.speechSynthesis.getVoices();
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const currentTask = tasks[currentIndex];

  const speakWord = useCallback(() => {
    if (!currentTask) return;

    const text = currentTask.nativeWord || currentTask.word;
    const lang = LOCALE_MAP[language] || 'ta-IN';
    const langPrefix = lang.split('-')[0].toLowerCase();

    // Reset synthesis
    window.speechSynthesis.cancel();
    setIsSpeaking(true);

    const playFallbackTTS = () => {
      console.log("🔊 Using Google TTS Fallback for:", language);
      const clients = ['tw-ob', 'gtx', 'at'];
      const playWithClient = (clientIndex) => {
        if (clientIndex >= clients.length) {
          setIsSpeaking(false);
          return;
        }
        const client = clients[clientIndex];
        const googleTTSUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${langPrefix}&client=${client}`;
        const audio = new Audio(googleTTSUrl);
        audio.volume = (user?.volume !== undefined ? user.volume : 100) / 100;
        audio.onended = () => setIsSpeaking(false);
        audio.onerror = () => playWithClient(clientIndex + 1);
        audio.play().catch(() => playWithClient(clientIndex + 1));
      };
      playWithClient(0);
    };

    // 1. Try Browser Synthesis
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang;
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang === lang) || voices.find(v => v.lang.startsWith(langPrefix));

    if (voice) {
      utter.voice = voice;
      const speedMap = { 'Slow': 0.7, 'Normal': 1.0, 'Fast': 1.3 };
      utter.rate = speedMap[user?.voiceSpeed] || 0.9;
      utter.onend = () => setIsSpeaking(false);
      utter.onerror = () => playFallbackTTS();
      window.speechSynthesis.speak(utter);
    } else {
      playFallbackTTS();
    }
  }, [currentTask, language, user]);

  const markTaskComplete = useCallback(async () => {
    setTaskStatus('success');
    setStatusMessage('Excellent pronunciation!');
    try {
      const { data } = await api.post('/tasks/complete', {
        language,
        day,
        taskIndex: currentIndex
      });
      
      const newCompleted = [...completedIndices, currentIndex];
      setCompletedIndices(newCompleted);
      
      // AUTO-ADVANCE logic
      setTimeout(() => {
        if (newCompleted.length === tasks.length || data.dayJustCompleted) {
          setDayDone(true);
        } else {
          setTaskStatus('idle');
          setStatusMessage('');
          const nextIncomplete = tasks.findIndex(
            (_, i) => !newCompleted.includes(i)
          );
          if (nextIncomplete !== -1) setCurrentIndex(nextIncomplete);
        }
      }, 1500);
    } catch (error) {
      console.error('Error saving progress', error);
    }
  }, [currentIndex, completedIndices, tasks, language, day]);

  const handleSpeechError = useCallback(() => {
    setTaskStatus('error');
    setStatusMessage('Try again! Listen to AI first');
    setTimeout(() => {
      setTaskStatus('idle');
      setStatusMessage('');
      speakWord();
    }, 2000);
  }, [speakWord]);

  const { isListening, startListening, stopListening } = useSpeechRecognition({
    targetActivity: currentTask,
    language,
    onSuccess: markTaskComplete,
    onError: handleSpeechError
  });

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  if (dayDone) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', background: 'var(--bg)' }}>
        <div style={{ maxWidth: '500px', width: '100%', textAlign: 'center', padding: '40px', background: 'var(--surface)', borderRadius: '20px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)' }}>
          <div style={{ fontSize: '72px', marginBottom: '24px' }}>🎯</div>
          <h2 style={{ marginBottom: '16px', color: 'var(--primary)', fontSize: '32px', fontWeight: 900 }}>Day {day} Mastered!</h2>
          <p style={{ marginBottom: '32px', color: 'var(--text-muted)', fontSize: '16px', fontWeight: 600 }}>
            Amazing job! You've successfully completed all tasks for today.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', fontSize: '18px', padding: '16px', borderRadius: '16px', fontWeight: 900 }}
          >
            Continue to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', padding: '24px', backgroundColor: 'var(--bg)' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '24px', margin: 0, color: 'var(--text)' }}>
              Day {day}: {theme}
            </h1>
            <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
              {language} · {completedIndices.length}/{tasks.length} tasks done
            </span>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn btn-outline"
            style={{ padding: '8px 16px' }}
          >
            ← Back
          </button>
        </div>

        {/* Task Pills */}
        <div style={{ background: 'var(--surface)', borderRadius: '16px', padding: '20px', border: '1px solid var(--border)' }}>
          <h3 style={{ marginBottom: '16px', fontSize: '14px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Tasks Progress
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: '8px' }}>
            {tasks.map((_, i) => {
              const isCompleted = completedIndices.includes(i);
              const isActive = currentIndex === i;
              // A task is accessible if it's completed, active, or if the immediately preceding task is completed.
              const isAccessible = isCompleted || isActive || (i > 0 && completedIndices.includes(i - 1)) || i === 0;

              return (
                <button
                  key={i}
                  onClick={() => isAccessible && setCurrentIndex(i)}
                  disabled={!isAccessible}
                  style={{
                    aspectRatio: '1',
                    borderRadius: '8px',
                    background: isCompleted ? '#10b981' : isActive ? 'var(--primary)' : 'var(--bg)',
                    color: isCompleted || isActive ? 'white' : isAccessible ? 'var(--text)' : 'var(--text-muted)',
                    border: isActive ? '2px solid var(--primary)' : '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    cursor: isAccessible ? 'pointer' : 'not-allowed',
                    fontSize: '14px',
                    opacity: isAccessible ? 1 : 0.4,
                    transition: 'all 0.2s'
                  }}
                >
                  {isCompleted ? '✓' : i + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Task Card */}
        {currentTask && (
          <div style={{ background: 'var(--surface)', borderRadius: '20px', padding: '40px', border: '1px solid var(--border)', boxShadow: 'var(--shadow)', textAlign: 'center' }}>

            {/* Word Display */}
            <div style={{ marginBottom: '40px' }}>
              <div style={{ fontSize: '64px', fontWeight: 900, color: 'var(--primary)', marginBottom: '12px', lineHeight: 1.2 }}>
                {currentTask.word}
              </div>
              <div style={{ fontSize: '22px', color: 'var(--text-muted)', marginBottom: '8px', fontStyle: 'italic' }}>
                [{currentTask.transliteration}]
              </div>
              <div style={{ fontSize: '18px', color: 'var(--text)', background: 'var(--primary-light)', padding: '8px 20px', borderRadius: '20px', display: 'inline-block' }}>
                {currentTask.meaning}
              </div>
              {currentTask.exampleSentence && (
                <div style={{ marginTop: '16px', fontSize: '14px', color: 'var(--text-muted)', background: 'var(--bg)', padding: '12px', borderRadius: '10px' }}>
                  📝 {currentTask.exampleSentence}
                </div>
              )}
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '32px', flexWrap: 'wrap' }}>

              {/* Listen to AI */}
              <button
                onClick={speakWord}
                disabled={isSpeaking}
                className="btn btn-outline"
                style={{ minWidth: '180px', fontSize: '16px', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                {isSpeaking ? (
                   <>
                     <div className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }} />
                     Speaking...
                   </>
                ) : '🎧 Listen to AI'}
              </button>

              {/* Speak Button */}
              <button
                onClick={isListening ? stopListening : startListening}
                className={`btn ${isListening ? 'btn-danger' : 'btn-primary'}`}
                style={{ minWidth: '180px', fontSize: '16px', padding: '14px 24px', borderRadius: '50px' }}
              >
                {isListening ? '🛑 Stop Speaking' : '🎤 Start Speaking'}
              </button>
            </div>

            {/* Status Message */}
            <div style={{ minHeight: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {isListening && (
                <div style={{ color: 'var(--danger)', fontSize: '18px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }} />
                  🔴 Listening... speak now!
                </div>
              )}

              {!isListening && taskStatus === 'success' && (
                <div style={{ color: '#065f46', fontWeight: 800, fontSize: '20px', background: '#dcfce7', padding: '16px 32px', borderRadius: '16px', border: '2px solid #22c55e' }}>
                  ✅ Correct! Moving to next...
                </div>
              )}

              {!isListening && taskStatus === 'error' && (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: '#b91c1c', fontWeight: 800, fontSize: '18px', background: '#fee2e2', padding: '16px 32px', borderRadius: '16px', border: '2px solid #ef4444', marginBottom: '8px' }}>
                    ❌ Try again! Match the AI pronunciation.
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>
                    Expected: <span style={{ color: 'var(--primary)' }}>{currentTask.nativeWord || currentTask.word}</span>
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default DailyTasks;