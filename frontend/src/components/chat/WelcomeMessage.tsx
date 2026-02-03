import { Leaf, Sparkles } from 'lucide-react';
import { Language } from '@/types/chat';

interface WelcomeMessageProps {
  language: Language;
}

const welcomeContent: Record<Language, { title: string; subtitle: string; tips: string[] }> = {
  darija: {
    title: 'مرحبا بك! 🌱',
    subtitle: 'أنا فلاح أسيست، مساعدك الفلاحي الذكي',
    tips: [
      'سولني على الطقس أو الأمراض ديال الزرع',
      'صور النبتة المريضة وأنا نعطيك الحل',
      'اعرف الأثمنة ديال السوق كل يوم',
    ],
  },
  french: {
    title: 'Bienvenue! 🌱',
    subtitle: 'Je suis FallahAssist, votre assistant agricole intelligent',
    tips: [
      'Demandez-moi la météo ou les maladies des cultures',
      'Photographiez une plante malade pour un diagnostic',
      'Consultez les prix du marché quotidiennement',
    ],
  },
  arabic: {
    title: 'مرحباً بك! 🌱',
    subtitle: 'أنا فلاح أسيست، مساعدك الزراعي الذكي',
    tips: [
      'اسألني عن الطقس أو أمراض المحاصيل',
      'صور النبات المريض وسأعطيك الحل',
      'تعرف على أسعار السوق يومياً',
    ],
  },
};

export function WelcomeMessage({ language }: WelcomeMessageProps) {
  const content = welcomeContent[language];
  const isRtl = language !== 'french';

  return (
    <div 
      className="flex flex-col items-center text-center px-6 py-8 animate-fade-in"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Logo */}
      <div className="w-20 h-20 rounded-full gradient-success flex items-center justify-center mb-4 shadow-elevated">
        <Leaf className="w-10 h-10 text-primary-foreground" />
      </div>

      {/* Title */}
      <h2 className="text-2xl font-bold text-foreground mb-2">
        {content.title}
      </h2>
      <p className="text-muted-foreground mb-6 max-w-xs">
        {content.subtitle}
      </p>

      {/* Tips */}
      <div className="w-full max-w-sm space-y-3">
        {content.tips.map((tip, index) => (
          <div
            key={index}
            className="flex items-start gap-3 bg-card rounded-xl p-3 shadow-soft animate-fade-in"
            style={{ animationDelay: `${0.1 + index * 0.1}s` }}
          >
            <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-3 h-3 text-accent" />
            </div>
            <p className="text-sm text-foreground/80 text-start leading-relaxed">
              {tip}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
