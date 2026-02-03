import { useState, useCallback } from 'react';
import { Message, Language } from '@/types/chat';

const generateId = () => Math.random().toString(36).substr(2, 9);

// Mock AI responses based on query content
const getMockResponse = (query: string, language: Language): { content: string; sources?: string[]; confidence: number } => {
  const lowerQuery = query.toLowerCase();
  
  // Weather-related
  if (lowerQuery.includes('طقس') || lowerQuery.includes('météo') || lowerQuery.includes('weather')) {
    const responses: Record<Language, string> = {
      darija: `🌤️ الطقس اليوم فالمنطقة ديالك:
      
• الحرارة: 24°C - 32°C
• الرطوبة: 45%
• الرياح: 15 كم/ساعة من الشمال الغربي
• ما كاينش شتا متوقعة هاد الأسبوع

💡 نصيحة: وقت مزيان للسقي فالصباح الباكر قبل الحرارة.`,
      french: `🌤️ Météo du jour dans votre région:

• Température: 24°C - 32°C  
• Humidité: 45%
• Vent: 15 km/h Nord-Ouest
• Pas de pluie prévue cette semaine

💡 Conseil: Bon moment pour l'irrigation tôt le matin avant la chaleur.`,
      arabic: `🌤️ الطقس اليوم في منطقتك:

• درجة الحرارة: 24°C - 32°C
• الرطوبة: 45%
• الرياح: 15 كم/ساعة من الشمال الغربي
• لا أمطار متوقعة هذا الأسبوع

💡 نصيحة: وقت مناسب للري في الصباح الباكر قبل الحرارة.`,
    };
    return { content: responses[language], sources: ['المعهد الوطني للأرصاد الجوية'], confidence: 0.95 };
  }

  // Disease-related
  if (lowerQuery.includes('مرض') || lowerQuery.includes('مريض') || lowerQuery.includes('maladie') || lowerQuery.includes('disease')) {
    const responses: Record<Language, string> = {
      darija: `🔍 باش نعرفو المرض ديال الزرع، خاصني نشوف الصورة ديال النبتة.

**الأعراض اللي خاص تراقبهم:**
• تغير اللون ديال الوراق (صفار، بني، بقع)
• ذبول أو جفاف
• بقع أو فطريات على الساق
• حشرات أو آفات

📸 صور النبتة المريضة وأنا نعطيك التشخيص والعلاج المناسب.`,
      french: `🔍 Pour identifier la maladie, j'ai besoin de voir une photo de la plante.

**Symptômes à observer:**
• Changement de couleur des feuilles (jaunissement, brunissement, taches)
• Flétrissement ou dessèchement
• Taches ou champignons sur la tige
• Insectes ou ravageurs

📸 Photographiez la plante malade et je vous donnerai le diagnostic et le traitement approprié.`,
      arabic: `🔍 لتحديد المرض، أحتاج رؤية صورة للنبات.

**الأعراض التي يجب مراقبتها:**
• تغير لون الأوراق (اصفرار، اسمرار، بقع)
• ذبول أو جفاف
• بقع أو فطريات على الساق
• حشرات أو آفات

📸 صور النبات المريض وسأعطيك التشخيص والعلاج المناسب.`,
    };
    return { content: responses[language], sources: ['INRA المغرب', 'دليل الأمراض النباتية'], confidence: 0.88 };
  }

  // Irrigation-related
  if (lowerQuery.includes('سقي') || lowerQuery.includes('ري') || lowerQuery.includes('irrigation') || lowerQuery.includes('arros')) {
    const responses: Record<Language, string> = {
      darija: `💧 نصائح السقي حسب الموسم:

**الصيف (الحرارة العالية):**
• سقي فالصباح الباكر (6-8) أو العشية (18-20)
• تجنب السقي فوقت الظهيرة
• زيد كمية الماء ب 20-30%

**الشتاء:**
• نقص عدد مرات السقي
• راقب الرطوبة ديال التربة

💡 نصيحة: استعمل السقي بالتنقيط لتوفير 40% من الماء.`,
      french: `💧 Conseils d'irrigation selon la saison:

**Été (fortes chaleurs):**
• Irriguer tôt le matin (6-8h) ou le soir (18-20h)
• Éviter l'arrosage en milieu de journée
• Augmenter la quantité d'eau de 20-30%

**Hiver:**
• Réduire la fréquence d'arrosage
• Surveiller l'humidité du sol

💡 Conseil: Utilisez l'irrigation goutte à goutte pour économiser 40% d'eau.`,
      arabic: `💧 نصائح الري حسب الموسم:

**الصيف (الحرارة العالية):**
• الري في الصباح الباكر (6-8) أو المساء (18-20)
• تجنب الري وقت الظهيرة
• زيادة كمية الماء بنسبة 20-30%

**الشتاء:**
• تقليل عدد مرات الري
• مراقبة رطوبة التربة

💡 نصيحة: استخدم الري بالتنقيط لتوفير 40% من الماء.`,
    };
    return { content: responses[language], sources: ['وزارة الفلاحة', 'ORMVA'], confidence: 0.92 };
  }

  // Prices-related
  if (lowerQuery.includes('ثمن') || lowerQuery.includes('أثمنة') || lowerQuery.includes('سعر') || lowerQuery.includes('prix') || lowerQuery.includes('price')) {
    const responses: Record<Language, string> = {
      darija: `📊 أثمنة السوق اليوم (الدار البيضاء):

**الخضراوات:**
• الطماطم: 6-8 درهم/كغ
• البصل: 4-5 درهم/كغ
• البطاطس: 5-7 درهم/كغ
• الجزر: 4-6 درهم/كغ

**الفواكه:**
• البرتقال: 8-10 درهم/كغ
• التفاح: 12-15 درهم/كغ

📈 الأثمنة طالعة مقارنة بالأسبوع الفايت (+5%)`,
      french: `📊 Prix du marché aujourd'hui (Casablanca):

**Légumes:**
• Tomates: 6-8 DH/kg
• Oignons: 4-5 DH/kg
• Pommes de terre: 5-7 DH/kg
• Carottes: 4-6 DH/kg

**Fruits:**
• Oranges: 8-10 DH/kg
• Pommes: 12-15 DH/kg

📈 Prix en hausse par rapport à la semaine dernière (+5%)`,
      arabic: `📊 أسعار السوق اليوم (الدار البيضاء):

**الخضروات:**
• الطماطم: 6-8 درهم/كغ
• البصل: 4-5 درهم/كغ
• البطاطس: 5-7 درهم/كغ
• الجزر: 4-6 درهم/كغ

**الفواكه:**
• البرتقال: 8-10 درهم/كغ
• التفاح: 12-15 درهم/كغ

📈 الأسعار مرتفعة مقارنة بالأسبوع الماضي (+5%)`,
    };
    return { content: responses[language], sources: ['سوق الجملة الدار البيضاء'], confidence: 0.85 };
  }

  // Default response
  const defaults: Record<Language, string> = {
    darija: `شكرا على السؤال! 🌱

أنا هنا باش نساعدك فكلشي يخص الفلاحة:
• الطقس والمناخ
• أمراض النباتات والعلاج
• السقي والري
• أثمنة السوق
• نصائح الزراعة

كيفاش نقدر نساعدك اليوم؟`,
    french: `Merci pour votre question! 🌱

Je suis là pour vous aider avec tout ce qui concerne l'agriculture:
• Météo et climat
• Maladies des plantes et traitements
• Irrigation et arrosage
• Prix du marché
• Conseils de culture

Comment puis-je vous aider aujourd'hui?`,
    arabic: `شكراً على سؤالك! 🌱

أنا هنا لمساعدتك في كل ما يخص الزراعة:
• الطقس والمناخ
• أمراض النباتات والعلاج
• الري والسقي
• أسعار السوق
• نصائح الزراعة

كيف يمكنني مساعدتك اليوم؟`,
  };

  return { content: defaults[language], confidence: 0.7 };
};

export function useChat(initialLanguage: Language = 'darija') {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [language, setLanguage] = useState<Language>(initialLanguage);

  const sendMessage = useCallback(async (content: string, imageUrl?: string) => {
    // Add user message
    const userMessage: Message = {
      id: generateId(),
      content,
      role: 'user',
      timestamp: new Date(),
      imageUrl,
    };
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate AI thinking
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

    // Get mock response
    const response = getMockResponse(content, language);
    
    const aiMessage: Message = {
      id: generateId(),
      content: response.content,
      role: 'assistant',
      timestamp: new Date(),
      confidence: response.confidence,
      sources: response.sources,
    };

    setMessages(prev => [...prev, aiMessage]);
    setIsTyping(false);
  }, [language]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isTyping,
    language,
    setLanguage,
    sendMessage,
    clearMessages,
  };
}
