'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react';
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<{ type: 'user' | 'password' | 'general'; message: string } | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Fix for localStorage during SSR
  useEffect(() => {
    setIsClient(true);
    // Load remembered email from localStorage
    if (typeof window !== 'undefined') {
      const rememberedEmail = localStorage.getItem('rememberedEmail');
      if (rememberedEmail) {
        setEmail(rememberedEmail);
        setRememberMe(true);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Basic validation
    if (!email.trim() || !password.trim()) {
      setError({ type: 'general', message: 'Please fill in all fields' });
      return;
    }

    try {
      await login({ email, password });
      
      // Save to localStorage only on client side
      if (isClient && rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      } else if (isClient) {
        localStorage.removeItem('rememberedEmail');
      }
      
      router.push('/dashboard');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Login failed';
      
      if (errorMessage.toLowerCase().includes('user') || errorMessage.toLowerCase().includes('email')) {
        setError({ 
          type: 'user', 
          message: 'User not found. Please check your email or register.' 
        });
      } else if (errorMessage.toLowerCase().includes('password') || errorMessage.toLowerCase().includes('credentials')) {
        setError({ 
          type: 'password', 
          message: 'Incorrect password. Please try again.' 
        });
      } else {
        setError({ 
          type: 'general', 
          message: 'Login failed. Please try again.' 
        });
      }
    }
  };

  const handleForgotPassword = () => {
    if (!email.trim()) {
      alert('Please enter your email first to reset password');
      return;
    }
    alert(`Password reset link would be sent to: ${email}`);
  };

  const handleSocialLogin = (provider: 'google' | 'github') => {
    alert(`${provider.charAt(0).toUpperCase() + provider.slice(1)} login would initiate here`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 via-gray-800 to-black p-4">
      <Card className="w-full max-w-md bg-linear-to-b from-gray-800/90 to-gray-900/90 backdrop-blur-sm border-gray-700 shadow-2xl">
        <CardHeader className="space-y-3 pb-6">
          <div className="flex justify-center mb-2">
            <div className="h-12 w-12 rounded-full bg-linear-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <Lock className="h-6 w-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl text-center font-bold text-white">
            Welcome Back
          </CardTitle>
          <p className="text-center text-gray-400 text-sm">
            Sign in to your account to continue your journey
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Social Login Buttons */}
          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              className="w-full h-12 border-gray-600 bg-gray-800 hover:bg-gray-700 hover:border-gray-500 text-white flex items-center justify-center gap-3 rounded-xl transition-all duration-300"
              onClick={() => handleSocialLogin('google')}
              disabled={isLoading}
            >
              <FcGoogle className="h-5 w-5" />
              <span className="font-medium">Continue with Google</span>
            </Button>
            
            <Button
              type="button"
              variant="outline"
              className="w-full h-12 border-gray-600 bg-gray-800 hover:bg-gray-700 hover:border-gray-500 text-white flex items-center justify-center gap-3 rounded-xl transition-all duration-300"
              onClick={() => handleSocialLogin('github')}
              disabled={isLoading}
            >
              <FaGithub className="h-5 w-5" />
              <span className="font-medium">Continue with GitHub</span>
            </Button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-gray-900 text-gray-400">or continue with email</span>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Messages */}
            {error && (
              <div className={`
                p-4 rounded-xl text-sm flex items-start gap-3 border
                ${error.type === 'user' ? 'bg-amber-900/20 text-amber-300 border-amber-800/50' : ''}
                ${error.type === 'password' ? 'bg-red-900/20 text-red-300 border-red-800/50' : ''}
                ${error.type === 'general' ? 'bg-red-900/20 text-red-300 border-red-800/50' : ''}
              `}>
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <span>{error.message}</span>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-300 block">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-500" />
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full h-12 pl-10 pr-4 bg-gray-800 border-gray-700 text-white placeholder-gray-500 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-gray-600 transition-all"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="text-sm font-medium text-gray-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-blue-400 hover:text-blue-300 hover:underline transition-colors disabled:text-gray-600 disabled:cursor-not-allowed disabled:no-underline"
                  disabled={isLoading}
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500" />
                </div>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full h-12 pl-10 pr-12 bg-gray-800 border-gray-700 text-white placeholder-gray-500 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-gray-600 transition-all"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors disabled:text-gray-700 disabled:cursor-not-allowed"
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
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isLoading}
                className="h-4 w-4 rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              />
              <label
                htmlFor="remember"
                className="text-sm text-gray-400 cursor-pointer select-none hover:text-gray-300 transition-colors"
              >
                Remember me on this device
              </label>
            </div>

            {/* Sign In Button */}
            <Button
              type="submit"
              className="w-full h-12 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-blue-600 disabled:hover:to-purple-600"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  <span>Authenticating...</span>
                </div>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Sign In
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

            {/* Register Link */}
            <div className="text-center pt-2">
              <p className="text-gray-500 text-sm">
                New to our platform?{' '}
                <a
                  href="/register"
                  className="font-semibold text-blue-400 hover:text-blue-300 hover:underline transition-all duration-300"
                >
                  Create an account
                </a>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}