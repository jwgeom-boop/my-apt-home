import { useState, useRef, useCallback, useEffect } from "react";
import { Mic, MicOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface VoiceMemoButtonProps {
  onTranscript: (text: string) => void;
}

const SpeechRecognition =
  (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

const VoiceMemoButton = ({ onTranscript }: VoiceMemoButtonProps) => {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const supported = !!SpeechRecognition;

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  const start = useCallback(() => {
    if (!supported) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "ko-KR";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setListening(true);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onTranscript(transcript);
      setListening(false);
    };

    recognition.onerror = () => {
      toast.error("음성 인식에 실패했습니다. 다시 시도해주세요.");
      setListening(false);
    };

    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
    recognition.start();
  }, [supported, onTranscript]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  if (!supported) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            disabled
            className="p-2 rounded-lg bg-muted text-muted-foreground opacity-50 cursor-not-allowed"
          >
            <MicOff className="w-4 h-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">이 브라우저는 음성 인식을 지원하지 않습니다</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      {listening && (
        <span className="text-[10px] text-destructive font-semibold animate-pulse">
          음성 인식 중...
        </span>
      )}
      <button
        onClick={listening ? stop : start}
        className={cn(
          "p-2 rounded-lg transition-all active:scale-95",
          listening
            ? "bg-destructive/10 text-destructive animate-pulse"
            : "bg-primary/10 text-primary hover:bg-primary/20"
        )}
      >
        {listening ? (
          <Mic className="w-4 h-4" />
        ) : (
          <Mic className="w-4 h-4" />
        )}
      </button>
    </div>
  );
};

export default VoiceMemoButton;
