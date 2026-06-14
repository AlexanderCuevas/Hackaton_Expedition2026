import { useState, useRef, useCallback, useEffect } from "react"

const SILENCE_TIMEOUT_MS = 2000

interface SpeechRecognitionHook {
  isListening: boolean
  startListening: () => void
  stopListening: () => void
  isSupported: boolean
  error: string | null
}

export function useSpeechRecognition(
  onInterim?: (text: string) => void,
  onFinal?: (text: string) => void,
): SpeechRecognitionHook {
  const [isListening, setIsListening] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const finalRef = useRef("")
  const onInterimRef = useRef(onInterim)
  const onFinalRef = useRef(onFinal)

  onInterimRef.current = onInterim
  onFinalRef.current = onFinal

  const SpeechRecognitionAPI =
    (typeof window !== "undefined" &&
      (window.SpeechRecognition || window.webkitSpeechRecognition)) ||
    null

  const isSupported = SpeechRecognitionAPI !== null

  const clearSilenceTimer = () => {
    if (silenceTimerRef.current !== null) {
      clearTimeout(silenceTimerRef.current)
      silenceTimerRef.current = null
    }
  }

  const stopListening = useCallback(() => {
    clearSilenceTimer()
    if (recognitionRef.current !== null) {
      try { recognitionRef.current.stop() } catch {}
      recognitionRef.current = null
    }
    setIsListening(false)
  }, [])

  const startListening = useCallback(() => {
    if (!SpeechRecognitionAPI) {
      setError("Speech recognition not supported")
      return
    }

    stopListening()

    const recognition = new SpeechRecognitionAPI()
    recognition.lang = "es"
    recognition.continuous = true
    recognition.interimResults = true

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let final = ""
      let interim = ""

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const r = event.results[i]
        if (r.isFinal) {
          final += r[0].transcript
        } else {
          interim += r[0].transcript
        }
      }

      if (final) finalRef.current += " " + final
      const display = (finalRef.current + " " + interim).trim()
      if (display) onInterimRef.current?.(display)

      clearSilenceTimer()
      silenceTimerRef.current = setTimeout(() => {
        try { recognition.stop() } catch {}
      }, SILENCE_TIMEOUT_MS)
    }

    recognition.onerror = () => {
      clearSilenceTimer()
      setIsListening(false)
    }

    recognition.onend = () => {
      clearSilenceTimer()
      setIsListening(false)
      const finalText = finalRef.current.trim()
      if (finalText) onFinalRef.current?.(finalText)
    }

    finalRef.current = ""
    recognitionRef.current = recognition
    recognition.start()
    setIsListening(true)
    setError(null)
  }, [SpeechRecognitionAPI, stopListening])

  useEffect(() => {
    return () => {
      clearSilenceTimer()
      if (recognitionRef.current !== null) {
        try { recognitionRef.current.abort() } catch {}
      }
    }
  }, [])

  return { isListening, startListening, stopListening, isSupported, error }
}
