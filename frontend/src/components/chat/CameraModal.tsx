import { useState, useRef } from 'react';
import { X, Camera, Upload, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Language } from '@/types/chat';

interface CameraModalProps {
  open: boolean;
  onClose: () => void;
  onImageCapture: (imageUrl: string) => void;
  language: Language;
}

const labels: Record<Language, { title: string; take: string; upload: string; analyze: string }> = {
  darija: {
    title: 'صور النبتة المريضة',
    take: 'صور',
    upload: 'طلع صورة',
    analyze: 'حلل الصورة',
  },
  french: {
    title: 'Photographier la plante',
    take: 'Prendre',
    upload: 'Importer',
    analyze: 'Analyser',
  },
  arabic: {
    title: 'صور النبات المريض',
    take: 'التقط',
    upload: 'رفع صورة',
    analyze: 'تحليل الصورة',
  },
};

export function CameraModal({ open, onClose, onImageCapture, language }: CameraModalProps) {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const content = labels[language];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCapturedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = () => {
    if (capturedImage) {
      onImageCapture(capturedImage);
      setCapturedImage(null);
      onClose();
    }
  };

  const handleReset = () => {
    setCapturedImage(null);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md mx-4 rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-center">{content.title}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-4">
          {capturedImage ? (
            <>
              <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-muted">
                <img
                  src={capturedImage}
                  alt="Captured"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex gap-3 w-full">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleReset}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  {language === 'french' ? 'Reprendre' : 'إعادة'}
                </Button>
                <Button
                  variant="success"
                  className="flex-1"
                  onClick={handleAnalyze}
                >
                  {content.analyze}
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="w-full aspect-square rounded-xl bg-muted flex flex-col items-center justify-center gap-4 border-2 border-dashed border-border">
                <Camera className="w-16 h-16 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">
                  {language === 'french' 
                    ? 'Prenez une photo claire de la plante' 
                    : 'خذ صورة واضحة للنبات'}
                </p>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileUpload}
                className="hidden"
              />

              <div className="flex gap-3 w-full">
                <Button
                  variant="default"
                  className="flex-1"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="w-4 h-4 mr-2" />
                  {content.take}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    if (fileInputRef.current) {
                      fileInputRef.current.removeAttribute('capture');
                      fileInputRef.current.click();
                      fileInputRef.current.setAttribute('capture', 'environment');
                    }
                  }}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {content.upload}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
