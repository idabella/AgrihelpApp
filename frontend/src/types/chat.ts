export type Language = 'darija' | 'french' | 'arabic';

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  confidence?: number;
  sources?: string[];
  imageUrl?: string;
}

export interface QuickAction {
  id: string;
  icon: string;
  label: Record<Language, string>;
  query: Record<Language, string>;
}

export const LANGUAGES: Record<Language, { name: string; nativeName: string; dir: 'ltr' | 'rtl' }> = {
  darija: { name: 'Darija', nativeName: 'الدارجة', dir: 'rtl' },
  french: { name: 'French', nativeName: 'Français', dir: 'ltr' },
  arabic: { name: 'Arabic', nativeName: 'العربية', dir: 'rtl' },
};

export const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'weather',
    icon: 'cloud-sun',
    label: {
      darija: 'الطقس',
      french: 'Météo',
      arabic: 'الطقس',
    },
    query: {
      darija: 'شنو هو الطقس ديال اليوم؟',
      french: 'Quel temps fait-il aujourd\'hui?',
      arabic: 'ما هو الطقس اليوم؟',
    },
  },
  {
    id: 'diseases',
    icon: 'bug',
    label: {
      darija: 'الأمراض',
      french: 'Maladies',
      arabic: 'الأمراض',
    },
    query: {
      darija: 'كيفاش نعرف الأمراض ديال الزرع؟',
      french: 'Comment identifier les maladies des cultures?',
      arabic: 'كيف أتعرف على أمراض المحاصيل؟',
    },
  },
  {
    id: 'irrigation',
    icon: 'droplets',
    label: {
      darija: 'السقي',
      french: 'Irrigation',
      arabic: 'الري',
    },
    query: {
      darija: 'وقتاش خاصني نسقي الزرع؟',
      french: 'Quand dois-je irriguer mes cultures?',
      arabic: 'متى يجب أن أسقي المحاصيل؟',
    },
  },
  {
    id: 'prices',
    icon: 'trending-up',
    label: {
      darija: 'الأثمنة',
      french: 'Prix',
      arabic: 'الأسعار',
    },
    query: {
      darija: 'شحال الأثمنة ديال الخضرة اليوم؟',
      french: 'Quels sont les prix du marché aujourd\'hui?',
      arabic: 'ما هي أسعار السوق اليوم؟',
    },
  },
];
