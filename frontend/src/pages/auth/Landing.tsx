import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Sprout, MessageSquare, Camera, Globe } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header - Mobile Optimized */}
      <header className="w-full px-4 sm:px-6 py-4 flex justify-between items-center sticky top-0 bg-gradient-to-br from-green-50/95 via-emerald-50/95 to-teal-50/95 backdrop-blur-sm z-10">
        <div className="flex items-center gap-2">
          <Sprout className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
          <h1 className="text-xl sm:text-2xl font-bold text-primary">AgriHelp</h1>
        </div>
        <div className="flex gap-2 sm:gap-3">
          <Button
            variant="ghost"
            onClick={() => navigate('/signin')}
            className="hover:bg-primary/10 h-11 px-4 sm:px-6 text-sm sm:text-base"
          >
            Sign In
          </Button>
          <Button
            onClick={() => navigate('/signup')}
            className="bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all h-11 px-4 sm:px-6 text-sm sm:text-base"
          >
            Get Started
          </Button>
        </div>
      </header>

      {/* Hero Section - Mobile First */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-12 text-center">
        <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 animate-fade-in-up w-full">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-2xl sm:blur-3xl rounded-full"></div>
              <div className="relative bg-white p-5 sm:p-6 rounded-full shadow-2xl">
                <Sprout className="w-16 h-16 sm:w-20 sm:h-20 text-primary" />
              </div>
            </div>
          </div>

          {/* Heading - Mobile Optimized */}
          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold text-primary leading-tight px-2">
              Your Agricultural
              <br />
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                AI Assistant
              </span>
            </h2>
            <p className="text-base sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto px-2">
              Get instant help with crop diseases, farming advice, and agricultural guidance in Darija, Arabic, or French
            </p>
          </div>

          {/* Features - Mobile Stacked */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-12">
            <div className="glass-card p-5 sm:p-6 space-y-3 active:scale-95 sm:hover:scale-105 transition-transform">
              <div className="w-14 h-14 sm:w-12 sm:h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto">
                <MessageSquare className="w-7 h-7 sm:w-6 sm:h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-base sm:text-lg">Smart Chat</h3>
              <p className="text-sm text-muted-foreground">
                Ask questions and get expert agricultural advice instantly
              </p>
            </div>

            <div className="glass-card p-5 sm:p-6 space-y-3 active:scale-95 sm:hover:scale-105 transition-transform">
              <div className="w-14 h-14 sm:w-12 sm:h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto">
                <Camera className="w-7 h-7 sm:w-6 sm:h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-base sm:text-lg">Image Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Upload photos of crops to diagnose diseases and get treatment plans
              </p>
            </div>

            <div className="glass-card p-5 sm:p-6 space-y-3 active:scale-95 sm:hover:scale-105 transition-transform sm:col-span-2 md:col-span-1">
              <div className="w-14 h-14 sm:w-12 sm:h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto">
                <Globe className="w-7 h-7 sm:w-6 sm:h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-base sm:text-lg">Multi-Language</h3>
              <p className="text-sm text-muted-foreground">
                Available in Darija, Arabic, and French for your convenience
              </p>
            </div>
          </div>

          {/* CTA - Mobile Optimized */}
          <div className="pt-6 sm:pt-8">
            <Button
              size="lg"
              onClick={() => navigate('/signup')}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 sm:px-10 py-6 sm:py-7 text-base sm:text-lg shadow-2xl active:scale-95 sm:hover:scale-105 transition-all w-full sm:w-auto min-h-[56px]"
            >
              Start Using AgriHelp Free
            </Button>
            <p className="text-xs sm:text-sm text-muted-foreground mt-4">
              No credit card required • Get started in seconds
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full px-4 sm:px-6 py-5 sm:py-6 text-center text-xs sm:text-sm text-muted-foreground border-t">
        <p>© 2026 AgriHelp. Empowering farmers with AI technology.</p>
      </footer>
    </div>
  );
};

export default Landing;
