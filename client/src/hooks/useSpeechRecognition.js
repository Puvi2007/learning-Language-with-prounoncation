import { useState, useRef, useCallback } from 'react';

const LOCALE_MAP = {
  Tamil: 'ta-IN',
  Telugu: 'te-IN',
  Hindi: 'hi-IN',
  Malayalam: 'ml-IN',
  Kannada: 'kn-IN'
};

const useSpeechRecognition = ({ targetActivity, language, onSuccess, onError }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [accuracy, setAccuracy] = useState(0);
  const [error, setError] = useState('');
  const recognitionRef = useRef(null);
  const transcriptRef = useRef('');

  const calculateAccuracy = (spoken, activity, langName) => {
    if (!spoken || !activity) return 0;
    
    const normalize = (text) => (text || "").toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()?]/g, "").replace(/\s/g, "").trim();

    const spokenNorm = normalize(spoken);
    const nativeNorm = normalize(activity.nativeWord);
    const wordNorm = normalize(activity.word);
    const transNorm = normalize(activity.transliteration);
    const meaningNorm = normalize(activity.meaning);

    // 1. Direct match with any variant
    if (spokenNorm === nativeNorm || spokenNorm === wordNorm || spokenNorm === transNorm || spokenNorm === meaningNorm) return 100;

    // 2. Number matching
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

    // 4. Substring match
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
  };

  const startListening = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError('Speech recognition not supported in this browser.');
      return;
    }

    if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
    }

    const recognition = new SpeechRecognition();
    recognition.lang = LOCALE_MAP[language] || 'en-US';
    recognition.interimResults = true;
    recognition.maxAlternatives = 3;

    recognition.onstart = () => {
      setIsListening(true);
      setError('');
      setTranscript('');
      setAccuracy(0);
    };

    recognition.onresult = (event) => {
      const results = event.results;
      let currentTranscript = "";
      for (let i = event.resultIndex; i < results.length; i++) {
        currentTranscript += results[i][0].transcript;
      }
      
      const isFinal = results[results.length - 1].isFinal;
      setTranscript(currentTranscript);
      transcriptRef.current = currentTranscript;

      if (isFinal) {
        const acc = calculateAccuracy(currentTranscript, targetActivity, language);
        setAccuracy(acc);
        
        if (acc >= 70) {
          onSuccess(currentTranscript, acc);
        } else {
          onError(currentTranscript, acc);
        }
      }
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      setError(event.error);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();

  }, [targetActivity, language, onSuccess, onError]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      
      // Process the latest transcript even if onresult isFinal hasn't fired
      setTimeout(() => {
        const finalTranscript = transcriptRef.current;
        if (finalTranscript) {
          const acc = calculateAccuracy(finalTranscript, targetActivity, language);
          setAccuracy(acc);
          if (acc >= 70) onSuccess(finalTranscript, acc);
          else onError(finalTranscript, acc);
        } else {
          onError('', 0);
        }
      }, 300);
    }
  }, [targetActivity, language, onSuccess, onError]);

  return { isListening, transcript, accuracy, error, startListening, stopListening };
};

export default useSpeechRecognition;
