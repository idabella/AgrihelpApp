import { Check, Copy, Share2, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Message, Language } from '@/types/chat';

interface ChatMessageProps {
  message: Message;
  language: Language;
}

export function ChatMessage({ message, language }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';
  const isRtl = language !== 'french';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        text: message.content,
      });
    }
  };

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className={`max-w-[85%] ${isUser ? 'order-1' : 'order-2'}`}>
        {/* Message bubble */}
        <div className={isUser ? 'chat-bubble-user' : 'chat-bubble-ai'}>
          {message.imageUrl && (
            <img
              src={message.imageUrl}
              alt="Uploaded"
              className="rounded-lg mb-2 max-w-full"
            />
          )}
          <p className="text-[15px] leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
        </div>

        {/* AI message extras */}
        {!isUser && (
          <div className="mt-2 flex items-center gap-2 px-1">
            {/* Confidence score */}
            {message.confidence && (
              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                {Math.round(message.confidence * 100)}%{' '}
                {language === 'french' ? 'confiance' : 'ثقة'}
              </span>
            )}

            {/* Action buttons */}
            <div className="flex gap-1 ml-auto">
              <Button
                variant="ghost"
                size="iconSm"
                onClick={handleCopy}
                className="h-7 w-7"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-primary" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="iconSm"
                onClick={handleShare}
                className="h-7 w-7"
              >
                <Share2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        )}

        {/* Sources */}
        {message.sources && message.sources.length > 0 && (
          <div className="mt-2 px-1">
            <p className="text-xs text-muted-foreground mb-1">
              {language === 'french' ? 'Sources:' : 'المصادر:'}
            </p>
            <div className="flex flex-wrap gap-1">
              {message.sources.map((source, index) => (
                <a
                  key={index}
                  href="#"
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline bg-primary/5 px-2 py-0.5 rounded-full"
                >
                  <ExternalLink className="w-3 h-3" />
                  {source}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Timestamp */}
        <p className={`text-[10px] text-muted-foreground mt-1 px-1 ${isUser ? 'text-right' : 'text-left'}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
}
