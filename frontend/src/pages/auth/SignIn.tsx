import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { Sprout, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SignIn = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate authentication - replace with actual Supabase auth
        setTimeout(() => {
            setIsLoading(false);
            toast({
                title: "Welcome back!",
                description: "You've successfully signed in.",
            });
            navigate('/chat');
        }, 1500);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 px-4 py-8">
            <div className="w-full max-w-md">
                {/* Logo - Mobile Optimized */}
                <div className="text-center mb-6 sm:mb-8">
                    <div className="inline-flex items-center gap-2 mb-3 sm:mb-4">
                        <Sprout className="w-9 h-9 sm:w-10 sm:h-10 text-primary" />
                        <h1 className="text-2xl sm:text-3xl font-bold text-primary">AgriHelp</h1>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-semibold text-foreground">Welcome Back</h2>
                    <p className="text-sm sm:text-base text-muted-foreground mt-2">Sign in to continue to your account</p>
                </div>

                {/* Form Card - Mobile First */}
                <div className="glass-card p-6 sm:p-8 space-y-6">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium">
                                Email Address
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="pl-10 h-12 sm:h-13 text-base"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-medium">
                                Password
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="pl-10 pr-12 h-12 sm:h-13 text-base"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 min-w-[44px] min-h-[44px] flex items-center justify-center"
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Forgot Password */}
                        <div className="flex justify-end">
                            <button
                                type="button"
                                className="text-sm text-primary hover:underline min-h-[44px] flex items-center"
                                onClick={() => toast({ title: "Feature coming soon!" })}
                            >
                                Forgot password?
                            </button>
                        </div>

                        {/* Submit Button - Mobile Optimized */}
                        <Button
                            type="submit"
                            className="w-full h-12 sm:h-13 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all active:scale-95 text-base sm:text-lg min-h-[48px]"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Signing in...
                                </div>
                            ) : (
                                'Sign In'
                            )}
                        </Button>
                    </form>

                    {/* Divider */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-card text-muted-foreground">Or</span>
                        </div>
                    </div>

                    {/* Sign Up Link */}
                    <div className="text-center">
                        <p className="text-sm sm:text-base text-muted-foreground">
                            Don't have an account?{' '}
                            <button
                                onClick={() => navigate('/signup')}
                                className="text-primary font-semibold hover:underline min-h-[44px] inline-flex items-center"
                            >
                                Sign up for free
                            </button>
                        </p>
                    </div>
                </div>

                {/* Back to Home */}
                <div className="text-center mt-6">
                    <button
                        onClick={() => navigate('/')}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors min-h-[44px] inline-flex items-center"
                    >
                        ← Back to home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
