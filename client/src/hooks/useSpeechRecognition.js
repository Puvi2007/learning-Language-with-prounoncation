import { useState, useRef, useCallback } from 'react';

/**
 * useSpeechRecognition Hook
 * Uses browser Web Speech API - works in Chrome only
 * Listens to user speech and compares with target word
 */

const LOCALE_MAP = {
  Tamil: 'ta-IN',
  Hindi: 'hi-IN',
  Telugu: 'te-IN',
  Kannada: 'kn-IN',
  Malayalam: 'ml-IN',
  Sanskrit: 'sa-IN', // Some browsers might need hi-IN fallback for Sanskrit
  English: 'en-US',
  French: 'fr-FR'
};

const useSpeechRecognition = ({ targetWord, language, onSuccess, onError }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');
  const recognitionRef = useRef(null);

  const startListening = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError('Speech recognition not supported. Use Chrome browser.');
      return;
    }

    // Stop any existing recognition
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.warn("Error stopping existing recognition:", e);
      }
    }

    const recognition = new SpeechRecognition();
    
    // Recognition language setup
    let recognitionLang = LOCALE_MAP[language] || 'en-US';
    recognition.lang = recognitionLang;
    
    recognition.continuous = false;
    recognition.interimResults = true; // Changed to true for better feedback
    recognition.maxAlternatives = 5;

    recognition.onstart = () => {
      setIsListening(true);
      setError('');
      setTranscript('');
      console.log('🎤 Listening in:', recognition.lang);
    };

    recognition.onresult = (event) => {
      const results = event.results[event.results.length - 1];
      const isFinal = results.isFinal;
      const allAlternatives = Array.from(results).map(r => r.transcript.trim().toLowerCase());
      
      const bestTranscript = allAlternatives[0];
      setTranscript(bestTranscript);

      if (isFinal) {
        console.log('🎤 Final results:', allAlternatives);
        console.log('🎯 Target word:', targetWord);

        const target = targetWord.trim().toLowerCase();

        // Match checking - multiple strategies
        const isMatch = allAlternatives.some(spoken => {
          // Exact match
          if (spoken === target) return true;
          // Contains match
          if (spoken.includes(target)) return true;
          if (target.includes(spoken)) return true;
          // Remove punctuation and spaces and check
          const cleanSpoken = spoken.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").replace(/\s/g, '');
          const cleanTarget = target.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").replace(/\s/g, '');
          if (cleanSpoken === cleanTarget) return true;
          // First word match (for multi-word targets)
          const spokenFirst = spoken.split(' ')[0];
          const targetFirst = target.split(' ')[0];
          if (spokenFirst === targetFirst && spokenFirst.length > 1) return true;
          return false;
        });

        if (isMatch) {
          console.log('✅ MATCH!');
          onSuccess(bestTranscript);
        } else {
          console.log('❌ NO MATCH');
          onError(bestTranscript);
        }
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech error:', event.error);
      setIsListening(false);
      if (event.error === 'no-speech') {
        onError('No speech detected');
      } else if (event.error === 'not-allowed') {
        setError('Microphone permission denied. Please allow mic access.');
      } else {
        onError(`Error: ${event.error}`);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();

  }, [targetWord, language, onSuccess, onError]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, []);

  return { isListening, transcript, error, startListening, stopListening };
};

export default useSpeechRecognition;