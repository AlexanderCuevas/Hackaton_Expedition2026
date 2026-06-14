import React, { useState, useEffect, useRef } from 'react';
import { Mic, Square } from 'lucide-react';

interface AIVoiceInputProps {
  compact?: boolean;
  onTranscriptReceived: (transcript: string) => void;
  onStart?: () => void;
  onStop?: (duration: number) => void;
  disabled?: boolean;
}

export function AIVoiceInput({ 
  compact, 
  onTranscriptReceived, 
  onStart, 
  onStop,
  disabled = false
}: AIVoiceInputProps) {
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'es-ES';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onTranscriptReceived(transcript);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
        const duration = Date.now() - startTimeRef.current;
        if (onStop) onStop(duration);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Error en el micrófono:", event.error);
        setIsRecording(false);
      };
    } else {
      console.warn("Tu navegador no soporta el reconocimiento de voz nativo.");
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [onTranscriptReceived, onStop]);

  const toggleRecording = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!recognitionRef.current) {
      alert("Tu navegador no soporta reconocimiento de voz. Usa Chrome o Edge.");
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      startTimeRef.current = Date.now();
      if (onStart) onStart();
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  return (
    <button
      type="button"
      onClick={toggleRecording}
      disabled={disabled || !recognitionRef.current}
      className={`flex items-center justify-center transition-colors border ${
        isRecording 
          ? 'bg-red-500 hover:bg-red-600 text-white border-red-500 animate-pulse' 
          : 'bg-neutral-100 hover:bg-neutral-200 text-black border-neutral-300'
      } ${compact ? 'h-10 w-10 rounded-none' : 'px-4 py-2 rounded-none'} ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      }`}
      title={isRecording ? "Detener grabación" : "Hablar por micrófono"}
    >
      {isRecording ? (
        <Square className="h-4 w-4 fill-current" />
      ) : (
        <Mic className="h-4 w-4" />
      )}
    </button>
  );
}