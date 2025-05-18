import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, CircularProgress } from '@mui/material';
import { Mic, Stop } from '@mui/icons-material';

interface SpeechRecognitionProps {
  languageCode: string;
  onResult: (transcript: string) => void;
}

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

const SpeechRecognition: React.FC<SpeechRecognitionProps> = ({ languageCode, onResult }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = languageCode;

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result) => result.transcript)
          .join('');
        
        setTranscript(transcript);
        if (event.results[0].isFinal) {
          onResult(transcript);
          setIsListening(false);
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognition);
    }

    return () => {
      if (recognition) {
        recognition.abort();
      }
    };
  }, [languageCode, onResult]);

  const startListening = () => {
    if (recognition) {
      recognition.start();
      setIsListening(true);
      setTranscript('');
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  if (!recognition) {
    return (
      <Typography color="error">
        Speech recognition is not supported in your browser.
      </Typography>
    );
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Button
          variant="contained"
          color={isListening ? 'error' : 'primary'}
          startIcon={isListening ? <Stop /> : <Mic />}
          onClick={isListening ? stopListening : startListening}
        >
          {isListening ? 'Stop Recording' : 'Start Recording'}
        </Button>
        {isListening && <CircularProgress size={24} />}
      </Box>
      
      {transcript && (
        <Typography variant="body1" sx={{ mt: 2 }}>
          Your answer: {transcript}
        </Typography>
      )}
    </Box>
  );
};

export default SpeechRecognition; 