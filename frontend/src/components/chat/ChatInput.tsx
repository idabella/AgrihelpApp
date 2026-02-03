import { useState, useRef } from 'react';
import { Send, Mic, Camera, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Language } from '@/types/chat';

interface ChatInputProps {
  language: Language;
  onSendMessage: (message: string) => void;
  onCameraClick: () => void;
  disabled?: boolean;
}

const placeholders: Record<Language, string> = {
  darija: 'اكتب سؤالك هنا...',
  french: 'Posez votre question...',
  arabic: 'اكتب سؤالك هنا...',
};

export function ChatInput({ language, onSendMessage, onCameraClick, disabled }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const isRtl = language !== 'french';

  const handleSubmit = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
      if (inputRef.current) {
        inputRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    // Auto-resize
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Voice recording logic would go here
  };

  return (
    <div className="border-t border-border bg-background px-3 py-3 sticky bottom-0">
      <div className="max-w-lg mx-auto">
        <div className="flex items-end gap-2">
          {/* Camera button */}
          <Button
            variant="input"
            size="icon"
            onClick={onCameraClick}
            className="shrink-0"
          >
            <Camera className="w-5 h-5" />
          </Button>

          {/* Input container */}
          <div 
            className="flex-1 flex items-end bg-muted rounded-3xl px-4 py-2 min-h-[44px] gap-2"
            dir={isRtl ? 'rtl' : 'ltr'}
          >
            <textarea
              ref={inputRef}
              value={message}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder={placeholders[language]}
              disabled={disabled}
              rows={1}
              className={`flex-1 bg-transparent border-none outline-none resize-none text-[15px] placeholder:text-muted-foreground/60 max-h-[120px] py-1 ${
                isRtl ? 'text-right font-arabic' : 'text-left'
              }`}
            />
          </div>

          {/* Voice / Send button */}
          {message.trim() ? (
            <Button
              variant="accent"
              size="icon"
              onClick={handleSubmit}
              disabled={disabled}
              className="shrink-0"
            >
              <Send className="w-5 h-5" />
            </Button>
          ) : (
            <Button
              variant={isRecording ? 'destructive' : 'default'}
              size="icon"
              onClick={toggleRecording}
              className="shrink-0"
            >
              {isRecording ? (
                <MicOff className="w-5 h-5" />
              ) : (
                <Mic className="w-5 h-5" />
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
