import { useState, useRef, useEffect } from 'react';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { QuickActions } from '@/components/chat/QuickActions';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { ChatInput } from '@/components/chat/ChatInput';
import { TypingIndicator } from '@/components/chat/TypingIndicator';
import { WelcomeMessage } from '@/components/chat/WelcomeMessage';
import { CameraModal } from '@/components/chat/CameraModal';
import { useChat } from '@/hooks/useChat';

const Index = () => {
  const { messages, isTyping, language, setLanguage, sendMessage } = useChat('darija');
  const [cameraOpen, setCameraOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isRtl = language !== 'french';

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleQuickAction = (query: string) => {
    sendMessage(query);
  };

  const handleImageCapture = (imageUrl: string) => {
    const prompts = {
      darija: 'شوف هاد الصورة وعطيني التشخيص ديال المرض والعلاج',
      french: 'Analysez cette image et donnez-moi le diagnostic et le traitement',
      arabic: 'حلل هذه الصورة وأعطني التشخيص والعلاج',
    };
    sendMessage(prompts[language], imageUrl);
  };

  return (
    <div 
      className="flex flex-col h-screen max-w-lg mx-auto bg-background moroccan-pattern"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Header */}
      <ChatHeader 
        language={language} 
        onLanguageChange={setLanguage} 
      />

      {/* Quick Actions */}
      <QuickActions 
        language={language} 
        onActionClick={handleQuickAction} 
      />

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 ? (
          <WelcomeMessage language={language} />
        ) : (
          <>
            {messages.map((message) => (
              <ChatMessage 
                key={message.id} 
                message={message} 
                language={language} 
              />
            ))}
            {isTyping && <TypingIndicator />}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <ChatInput
        language={language}
        onSendMessage={sendMessage}
        onCameraClick={() => setCameraOpen(true)}
        disabled={isTyping}
      />

      {/* Camera Modal */}
      <CameraModal
        open={cameraOpen}
        onClose={() => setCameraOpen(false)}
        onImageCapture={handleImageCapture}
        language={language}
      />
    </div>
  );
};

export default Index;
