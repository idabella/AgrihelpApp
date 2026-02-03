import { useState } from 'react';
import { ChevronDown, Leaf, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Language, LANGUAGES } from '@/types/chat';

interface ChatHeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export function ChatHeader({ language, onLanguageChange }: ChatHeaderProps) {
  const currentLang = LANGUAGES[language];

  return (
    <header className="gradient-header text-primary-foreground px-4 py-3 shadow-medium sticky top-0 z-50">
      <div className="flex items-center justify-between max-w-lg mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center backdrop-blur-sm">
            <Leaf className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">
              {language === 'french' ? 'FallahAssist' : 'فلاح أسيست'}
            </h1>
            <p className="text-xs opacity-80">
              {language === 'french' ? 'Votre assistant agricole' : 'مساعدك الفلاحي'}
            </p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-primary-foreground hover:bg-primary-foreground/10 gap-1 px-3"
            >
              <span className="text-sm font-medium">{currentLang.nativeName}</span>
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[140px]">
            {(Object.entries(LANGUAGES) as [Language, typeof currentLang][]).map(([key, lang]) => (
              <DropdownMenuItem
                key={key}
                onClick={() => onLanguageChange(key)}
                className={`cursor-pointer ${language === key ? 'bg-primary/10' : ''}`}
              >
                <span className={lang.dir === 'rtl' ? 'font-arabic' : ''}>
                  {lang.nativeName}
                </span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
