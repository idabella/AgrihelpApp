import { CloudSun, Bug, Droplets, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Language, QUICK_ACTIONS } from '@/types/chat';

const iconMap: Record<string, React.ReactNode> = {
  'cloud-sun': <CloudSun className="w-6 h-6 text-secondary" />,
  'bug': <Bug className="w-6 h-6 text-destructive" />,
  'droplets': <Droplets className="w-6 h-6 text-primary" />,
  'trending-up': <TrendingUp className="w-6 h-6 text-accent" />,
};

interface QuickActionsProps {
  language: Language;
  onActionClick: (query: string) => void;
}

export function QuickActions({ language, onActionClick }: QuickActionsProps) {
  return (
    <div className="grid grid-cols-4 gap-2 px-4 py-3 bg-card/50 border-b border-border">
      {QUICK_ACTIONS.map((action, index) => (
        <Button
          key={action.id}
          variant="quickAction"
          onClick={() => onActionClick(action.query[language])}
          className="animate-fade-in"
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          {iconMap[action.icon]}
          <span className="text-xs font-medium text-foreground/80 mt-1">
            {action.label[language]}
          </span>
        </Button>
      ))}
    </div>
  );
}
