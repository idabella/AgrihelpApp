import { Leaf } from 'lucide-react';

export function TypingIndicator() {
  return (
    <div className="flex justify-start animate-fade-in">
      <div className="chat-bubble-ai flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
          <Leaf className="w-3 h-3 text-primary" />
        </div>
        <div className="flex gap-1">
          <span className="w-2 h-2 bg-primary/60 rounded-full typing-dot" />
          <span className="w-2 h-2 bg-primary/60 rounded-full typing-dot" />
          <span className="w-2 h-2 bg-primary/60 rounded-full typing-dot" />
        </div>
      </div>
    </div>
  );
}
