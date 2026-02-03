import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { Sprout, Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SignUp = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (formData.password !== formData.confirmPassword) {
            toast({
                title: "Passwords don't match",
                description: "Please make sure your passwords match.",
                variant: "destructive",
            });
            return;
        }

        if (formData.password.length < 6) {
            toast({
                title: "Password too short",
                description: "Password must be at least 6 characters.",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);

        // Simulate registration - replace with actual Supabase auth
        setTimeout(() => {
            setIsLoading(false);
            toast({
                title: "Account created!",
                description: "Welcome to AgriHelp. Let's get started!",
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
                    <h2 className="text-xl sm:text-2xl font-semibold text-foreground">Create Your Account</h2>
                    <p className="text-sm sm:text-base text-muted-foreground mt-2">Start your agricultural journey today</p>
                </div>

                {/* Form Card - Mobile First */}
                <div className="glass-card p-6 sm:p-8 space-y-6">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Name */}
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-medium">
                                Full Name
                            </Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="pl-10 h-12 sm:h-13 text-base"
                                    required
                                />
                            </div>
                        </div>

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

                        {/* Confirm Password */}
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-sm font-medium">
                                Confirm Password
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    className="pl-10 pr-12 h-12 sm:h-13 text-base"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 min-w-[44px] min-h-[44px] flex items-center justify-center"
                                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Terms */}
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            By signing up, you agree to our{' '}
                            <button type="button" className="text-primary hover:underline">
                                Terms of Service
                            </button>{' '}
                            and{' '}
                            <button type="button" className="text-primary hover:underline">
                                Privacy Policy
                            </button>
                        </p>

                        {/* Submit Button - Mobile Optimized */}
                        <Button
                            type="submit"
                            className="w-full h-12 sm:h-13 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all active:scale-95 text-base sm:text-lg min-h-[48px]"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Creating account...
                                </div>
                            ) : (
                                'Create Account'
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

                    {/* Sign In Link */}
                    <div className="text-center">
                        <p className="text-sm sm:text-base text-muted-foreground">
                            Already have an account?{' '}
                            <button
                                onClick={() => navigate('/signin')}
                                className="text-primary font-semibold hover:underline min-h-[44px] inline-flex items-center"
                            >
                                Sign in
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

export default SignUp;
