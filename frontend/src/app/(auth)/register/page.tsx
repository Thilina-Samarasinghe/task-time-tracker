'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle2, Shield } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading } = useAuthStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState<{ type: 'name' | 'email' | 'password' | 'confirm' | 'terms' | 'general'; message: string } | null>(null);
  
  // Password strength calculation
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: '',
    color: '',
    percentage: 0
  });

  // Calculate password strength
  useEffect(() => {
    if (!password) {
      setPasswordStrength({ score: 0, label: '', color: '', percentage: 0 });
      return;
    }

    let score = 0;
    let label = '';
    let color = '';

    // Length check
    if (password.length >= 6) score += 1;
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;

    // Complexity checks
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^a-zA-Z0-9]/.test(password)) score += 1;

    // Determine strength label and color
    if (score <= 2) {
      label = 'Weak';
      color = 'bg-red-500';
    } else if (score <= 4) {
      label = 'Medium';
      color = 'bg-yellow-500';
    } else {
      label = 'Strong';
      color = 'bg-green-500';
    }

    const percentage = (score / 6) * 100;

    setPasswordStrength({ score, label, color, percentage });
  }, [password]);

  const validateForm = () => {
    // Name validation
    if (!name.trim()) {
      setError({ type: 'name', message: 'Please enter your full name' });
      return false;
    }

    if (name.trim().length < 2) {
      setError({ type: 'name', message: 'Name must be at least 2 characters' });
      return false;
    }

    // Email validation
    if (!email.trim()) {
      setError({ type: 'email', message: 'Please enter your email address' });
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError({ type: 'email', message: 'Please enter a valid email address' });
      return false;
    }

    // Password validation
    if (!password) {
      setError({ type: 'password', message: 'Please enter a password' });
      return false;
    }

    if (password.length < 6) {
      setError({ type: 'password', message: 'Password must be at least 6 characters' });
      return false;
    }

    // Confirm password validation
    if (!confirmPassword) {
      setError({ type: 'confirm', message: 'Please confirm your password' });
      return false;
    }

    if (password !== confirmPassword) {
      setError({ type: 'confirm', message: 'Passwords do not match' });
      return false;
    }

    // Terms validation
    if (!acceptedTerms) {
      setError({ type: 'terms', message: 'You must accept the Terms & Conditions' });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!validateForm()) {
      return;
    }

    try {
      await register({ name, email, password });
      router.push('/dashboard');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Registration failed';
      setError({ type: 'general', message: errorMessage });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 via-gray-800 to-black p-4">
      <Card className="w-full max-w-md bg-linear-to-b from-gray-800/90 to-gray-900/90 backdrop-blur-sm border-gray-700 shadow-2xl">
        <CardHeader className="space-y-3 pb-6">
          <div className="flex justify-center mb-2">
            <div className="h-12 w-12 rounded-full bg-linear-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl text-center font-bold text-white">
            Create Account
          </CardTitle>
          <p className="text-center text-gray-400 text-sm">
            Join us today and start your journey
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Messages */}
            {error && (
              <div className={`
                p-4 rounded-xl text-sm flex items-start gap-3 border
                ${error.type === 'terms' ? 'bg-amber-900/20 text-amber-300 border-amber-800/50' : 'bg-red-900/20 text-red-300 border-red-800/50'}
              `}>
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <span>{error.message}</span>
              </div>
            )}

            {/* Name Field */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-300 block">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                  <User className="h-5 w-5 text-gray-500" />
                </div>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full h-12 pl-10 pr-4 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-gray-600 transition-all"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Email Field with Verification */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-300 block">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                  <Mail className="h-5 w-5 text-gray-500" />
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full h-12 pl-10 pr-4 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-gray-600 transition-all"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-300 block">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                  <Lock className="h-5 w-5 text-gray-500" />
                </div>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full h-12 pl-10 pr-12 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-gray-600 transition-all"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors disabled:text-gray-700 disabled:cursor-not-allowed z-10"
                  disabled={isLoading}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              {/* Password Strength Meter */}
              {password && (
                <div className="space-y-2 mt-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400">Password Strength:</span>
                    <span className={`font-semibold ${
                      passwordStrength.label === 'Weak' ? 'text-red-400' :
                      passwordStrength.label === 'Medium' ? 'text-yellow-400' :
                      'text-green-400'
                    }`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                      style={{ width: `${passwordStrength.percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={password.length >= 6 ? 'text-green-400' : 'text-gray-500'}>
                        {password.length >= 6 ? '✓' : '○'} At least 6 characters
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-300 block">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                  <Lock className="h-5 w-5 text-gray-500" />
                </div>
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full h-12 pl-10 pr-12 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-gray-600 transition-all"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors disabled:text-gray-700 disabled:cursor-not-allowed z-10"
                  disabled={isLoading}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-red-400 mt-1">Passwords do not match</p>
              )}
              {confirmPassword && password === confirmPassword && (
                <p className="text-xs text-green-400 mt-1 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Passwords match
                </p>
              )}
            </div>

            {/* Terms & Conditions Checkbox */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="terms"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  disabled={isLoading}
                  className="h-4 w-4 mt-0.5 rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-gray-400 cursor-pointer select-none hover:text-gray-300 transition-colors"
                >
                  I agree to the{' '}
                  <a
                    href="/terms"
                    target="_blank"
                    className="text-blue-400 hover:text-blue-300 hover:underline font-medium"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Terms & Conditions
                  </a>
                  {' '}and{' '}
                  <a
                    href="/privacy"
                    target="_blank"
                    className="text-blue-400 hover:text-blue-300 hover:underline font-medium"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Privacy Policy
                  </a>
                </label>
              </div>
            </div>

            {/* Register Button */}
            <Button
              type="submit"
              className="w-full h-12 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-blue-600 disabled:hover:to-purple-600"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  <span>Creating Account...</span>
                </div>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Create Account
                  <svg 
                    className="w-4 h-4" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              )}
            </Button>

            {/* Login Link */}
            <div className="text-center pt-2">
              <p className="text-gray-500 text-sm">
                Already have an account?{' '}
                <a
                  href="/login"
                  className="font-semibold text-blue-400 hover:text-blue-300 hover:underline transition-all duration-300"
                >
                  Sign in
                </a>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}