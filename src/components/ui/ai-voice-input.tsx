import { Mic, MicOff } from "lucide-react"
import { cn } from "@/src/lib/utils"
import { useSpeechRecognition } from "@/src/hooks/use-speech-recognition"

interface AIVoiceInputProps {
  onInterimTranscript?: (text: string) => void
  onFinalTranscript?: (text: string) => void
  disabled?: boolean
  className?: string
  compact?: boolean
}

export function AIVoiceInput({
  onInterimTranscript,
  onFinalTranscript,
  disabled = false,
  className,
  compact = false,
}: AIVoiceInputProps) {
  const { isListening, startListening, stopListening, isSupported, error } =
    useSpeechRecognition(onInterimTranscript, onFinalTranscript)

  const handleClick = () => {
    if (disabled) return
    if (isListening) stopListening()
    else startListening()
  }

  if (compact) {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled || !isSupported}
        title={
          !isSupported
            ? "Reconocimiento de voz no disponible. Usa Chrome."
            : isListening
              ? "Detener"
              : "Hablar"
        }
        className={cn(
          "h-10 w-10 flex items-center justify-center rounded-none transition shrink-0 border cursor-pointer",
          isListening
            ? "bg-[#B50E30] text-white border-[#B50E30] animate-pulse"
            : "bg-white text-black border-utp-border hover:border-black",
          disabled && "opacity-50 cursor-not-allowed",
          className,
        )}
      >
        {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
      </button>
    )
  }

  return (
    <div className={cn("w-full py-4", className)}>
      <div className="relative max-w-xl w-full mx-auto flex items-center flex-col gap-2">
        <button
          type="button"
          onClick={handleClick}
          disabled={disabled || !isSupported}
          className={cn(
            "w-16 h-16 rounded-xl flex items-center justify-center transition-colors cursor-pointer",
            isListening
              ? "bg-[#B50E30] text-white animate-pulse"
              : "bg-black/5 hover:bg-black/10 text-black/70",
            disabled && "opacity-50 cursor-not-allowed",
          )}
        >
          {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
        </button>

        {!isSupported && (
          <p className="text-xs text-red-500 font-medium">
            Tu navegador no soporta reconocimiento de voz. Usa Chrome.
          </p>
        )}

        {error && <p className="text-xs text-red-400 font-medium">{error}</p>}
      </div>
    </div>
  )
}
