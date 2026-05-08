import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Volume2, Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AIAssistant = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi! I'm Neo, your AI Language Assistant. What word do you want to translate today?", sender: 'ai' }
  ]);
  const [input, setInput] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const messagesEndRef = useRef(null);

  const targetLang = user?.selectedLanguage || 'Tamil';
  const langCodePair = targetLang === 'Tamil' ? 'en|ta' : 'en|te';
  const ttsLangCode = targetLang === 'Tamil' ? 'ta-IN' : 'te-IN';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleTranslate = async (e) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    setInput('');
    setMessages(prev => [...prev, { id: Date.now(), text: userText, sender: 'user' }]);
    setIsTranslating(true);

    try {
      // Using free MyMemory translation API
      const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(userText)}&langpair=${langCodePair}`);
      const data = await res.json();
      
      let translatedText = data.responseData.translatedText;
      if (!translatedText || data.responseStatus !== 200) {
        translatedText = `(Mock Translation) ${userText}`;
      }

      setMessages(prev => [...prev, { id: Date.now(), text: translatedText, sender: 'ai', original: userText }]);
      speakText(translatedText, ttsLangCode);
    } catch (err) {
      setMessages(prev => [...prev, { id: Date.now(), text: "Sorry, my translation circuits are offline.", sender: 'ai' }]);
    } finally {
      setIsTranslating(false);
    }
  };

  const speakText = (text, lang) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.9;
      
      const voices = window.speechSynthesis.getVoices();
      utterance.voice = voices.find(v => v.lang.startsWith(lang.split('-')[0]));
      
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 h-16 w-16 rounded-full bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(0,229,255,0.6)] border-2 border-primary-dark cursor-pointer text-background"
        style={{ display: isOpen ? 'none' : 'flex' }}
      >
        <Sparkles className="absolute inset-0 m-auto text-white opacity-50 animate-ping" size={32} />
        <MessageSquare size={28} />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 bg-surface-solid border border-primary/30 rounded-3xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.8),0_0_20px_rgba(0,229,255,0.15)] flex flex-col"
            style={{ maxHeight: '80vh', height: '500px' }}
          >
            {/* Header */}
            <div className="bg-surface p-4 flex items-center justify-between border-b border-primary/20 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 border border-primary text-primary">
                  <Sparkles size={20} className="animate-pulse" />
                  <span className="absolute top-0 right-0 w-3 h-3 bg-primary rounded-full border-2 border-surface-solid"></span>
                </div>
                <div>
                  <h3 className="font-bold text-text uppercase tracking-widest text-sm">Neo AI</h3>
                  <p className="text-xs text-primary font-semibold">Translating to {targetLang}</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-text-muted hover:text-primary transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-background/50">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, x: msg.sender === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-3 text-sm shadow-md ${
                      msg.sender === 'user'
                        ? 'bg-primary text-background rounded-br-sm'
                        : 'bg-surface border border-primary/20 text-text rounded-bl-sm'
                    }`}
                  >
                    {msg.text}
                    {msg.sender === 'ai' && msg.id !== 1 && (
                      <button 
                        onClick={() => speakText(msg.text, ttsLangCode)}
                        className="mt-2 flex items-center gap-1 text-xs text-primary bg-primary/10 px-2 py-1 rounded-md hover:bg-primary/20 transition-colors"
                      >
                        <Volume2 size={12} /> Listen
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
              {isTranslating && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="bg-surface border border-primary/20 text-primary p-3 rounded-2xl rounded-bl-sm flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin" /> Processing...
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleTranslate} className="p-3 bg-surface border-t border-primary/20 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a word in English..."
                className="flex-1 bg-background border border-primary/30 rounded-xl px-4 py-2 text-sm text-text focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-text-muted/50"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTranslating}
                className="bg-primary text-background p-2 rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={20} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIAssistant;
