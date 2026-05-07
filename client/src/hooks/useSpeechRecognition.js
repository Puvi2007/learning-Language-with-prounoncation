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
  Sanskrit: 'sa-IN',
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
      recognitionRef.current.stop();
    }

    const recognition = new SpeechRecognition();
    recognition.lang = LOCALE_MAP[language] || 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 5;

    recognition.onstart = () => {
      setIsListening(true);
      setError('');
      setTranscript('');
    };

    recognition.onresult = (event) => {
      const results = Array.from(event.results[0]);

      // Get all alternatives
      const allAlternatives = results.map(r => r.transcript.trim().toLowerCase());
      console.log('🎤 You said:', allAlternatives);
      console.log('🎯 Target word:', targetWord);

      const target = targetWord.trim().toLowerCase();
      const spokenText = allAlternatives[0]; // best match
      setTranscript(spokenText);

      // Match checking - multiple strategies
      const isMatch = allAlternatives.some(spoken => {
        // Exact match
        if (spoken === target) return true;
        // Contains match
        if (spoken.includes(target)) return true;
        if (target.includes(spoken)) return true;
        // Remove spaces and check
        if (spoken.replace(/\s/g, '') === target.replace(/\s/g, '')) return true;
        // First word match (for multi-word targets)
        const spokenFirst = spoken.split(' ')[0];
        const targetFirst = target.split(' ')[0];
        if (spokenFirst === targetFirst && spokenFirst.length > 1) return true;
        return false;
      });

      if (isMatch) {
        console.log('✅ MATCH!');
        onSuccess(spokenText);
      } else {
        console.log('❌ NO MATCH');
        onError(spokenText);
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