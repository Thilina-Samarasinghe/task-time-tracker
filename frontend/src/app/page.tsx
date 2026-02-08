'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle, BarChart3, Clock, Sparkles, Zap, TrendingUp } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-violet-900/20 via-slate-950 to-slate-950"></div>
        <div className="absolute top-0 -right-40 w-96 h-96 bg-purple-500/30 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-0 -left-40 w-96 h-96 bg-cyan-500/30 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-fuchsia-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Noise Texture Overlay */}
      <div className="fixed inset-0 z-0 opacity-[0.015] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")' }}></div>

      <div className="relative z-10">
        {/* Header Navigation */}
        <nav className="border-b border-white/5 backdrop-blur-xl bg-slate-950/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex justify-between items-center">
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-violet-400 via-fuchsia-400 to-cyan-400" style={{ fontFamily: '"Space Grotesk", system-ui, sans-serif' }}>
              TaskTracker
            </h2>
            <div className="flex gap-3">
              <Link href="/login">
                <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-all duration-300">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-linear-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white shadow-lg shadow-violet-500/50 hover:shadow-violet-500/70 transition-all duration-300 hover:scale-105">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="text-center space-y-8">
            {/* Badge with animation */}
            <div className="inline-block animate-in fade-in slide-in-from-bottom-4 duration-700">
              <span className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-violet-500/10 via-fuchsia-500/10 to-cyan-500/10 backdrop-blur-sm border border-violet-500/20 px-5 py-2.5 text-sm font-semibold text-violet-300 shadow-lg shadow-violet-500/10">
                <Sparkles className="w-4 h-4" />
                Boost your productivity today
              </span>
            </div>
            
            {/* Main Heading with staggered animation */}
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black text-white leading-[1.1] tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-700" style={{ fontFamily: '"Cabinet Grotesk", "Space Grotesk", system-ui, sans-serif', animationDelay: '100ms' }}>
              Track tasks,
              <br />
              <span className="bg-clip-text text-transparent bg-linear-to-r from-violet-400 via-fuchsia-400 to-cyan-400">
                manage time,
              </span>
              <br />
              achieve more
            </h1>
            
            <p className="text-xl sm:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700" style={{ fontFamily: '"Inter", system-ui, sans-serif', animationDelay: '200ms' }}>
              The complete task and time tracking solution. Monitor your progress with real-time analytics, organize work by priorities, and unlock your full productivity potential.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 animate-in fade-in slide-in-from-bottom-10 duration-700" style={{ animationDelay: '300ms' }}>
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto px-8 py-7 text-base bg-linear-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white shadow-2xl shadow-violet-500/50 hover:shadow-violet-500/70 transition-all duration-300 hover:scale-105">
                  <Zap className="w-5 h-5 mr-2" />
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 py-7 text-base bg-white/5 backdrop-blur-sm border-2 border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                  Sign In to Account
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 sm:py-32 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-5xl sm:text-6xl font-black text-white mb-6 tracking-tight" style={{ fontFamily: '"Cabinet Grotesk", "Space Grotesk", system-ui, sans-serif' }}>
                Everything you need
                <br />
                <span className="bg-clip-text text-transparent bg-linear-to-r from-amber-400 via-orange-400 to-rose-400">
                  to succeed
                </span>
              </h2>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto">Powerful features designed to help you stay organized and productive</p>
            </div>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {/* Feature 1 - Cyan/Blue */}
              <div className="group relative">
                <div className="absolute inset-0 bg-linear-to-br from-cyan-500/20 to-blue-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
                <div className="relative p-8 bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl hover:border-cyan-500/50 transition-all duration-500 hover:scale-[1.02] cursor-pointer overflow-hidden">
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-linear-to-br from-cyan-500/0 to-blue-500/0 group-hover:from-cyan-500/5 group-hover:to-blue-500/5 transition-all duration-500"></div>
                  
                  <div className="relative">
                    <div className="mb-6 inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-cyan-500 to-blue-600 rounded-2xl shadow-lg shadow-cyan-500/50 group-hover:shadow-cyan-500/70 group-hover:scale-110 transition-all duration-500">
                      <CheckCircle className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-cyan-400 transition-colors duration-300" style={{ fontFamily: '"Space Grotesk", system-ui, sans-serif' }}>
                      Smart Task Management
                    </h3>
                    <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors duration-300">
                      Create, organize, and manage tasks effortlessly. Set priorities, assign categories, mark completion status, and track everything in one place.
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature 2 - Emerald/Green */}
              <div className="group relative">
                <div className="absolute inset-0 bg-linear-to-br from-emerald-500/20 to-teal-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
                <div className="relative p-8 bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl hover:border-emerald-500/50 transition-all duration-500 hover:scale-[1.02] cursor-pointer overflow-hidden">
                  <div className="absolute inset-0 bg-linear-to-br from-emerald-500/0 to-teal-500/0 group-hover:from-emerald-500/5 group-hover:to-teal-500/5 transition-all duration-500"></div>
                  
                  <div className="relative">
                    <div className="mb-6 inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg shadow-emerald-500/50 group-hover:shadow-emerald-500/70 group-hover:scale-110 transition-all duration-500">
                      <Clock className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-emerald-400 transition-colors duration-300" style={{ fontFamily: '"Space Grotesk", system-ui, sans-serif' }}>
                      Real-time Time Tracking
                    </h3>
                    <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors duration-300">
                      Start and stop timers instantly for any task. Automatic time logging ensures accurate tracking of hours spent on projects and activities.
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature 3 - Amber/Orange */}
              <div className="group relative">
                <div className="absolute inset-0 bg-linear-to-br from-amber-500/20 to-orange-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
                <div className="relative p-8 bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl hover:border-amber-500/50 transition-all duration-500 hover:scale-[1.02] cursor-pointer overflow-hidden">
                  <div className="absolute inset-0 bg-linear-to-br from-amber-500/0 to-orange-500/0 group-hover:from-amber-500/5 group-hover:to-orange-500/5 transition-all duration-500"></div>
                  
                  <div className="relative">
                    <div className="mb-6 inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-amber-500 to-orange-600 rounded-2xl shadow-lg shadow-amber-500/50 group-hover:shadow-amber-500/70 group-hover:scale-110 transition-all duration-500">
                      <BarChart3 className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-amber-400 transition-colors duration-300" style={{ fontFamily: '"Space Grotesk", system-ui, sans-serif' }}>
                      Powerful Analytics
                    </h3>
                    <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors duration-300">
                      View detailed charts and statistics about your productivity. Track completion rates, time distribution, and weekly performance metrics.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-24 sm:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-5xl font-black text-white mb-8 tracking-tight" style={{ fontFamily: '"Cabinet Grotesk", "Space Grotesk", system-ui, sans-serif' }}>
                  Why
                  <br />
                  <span className="bg-clip-text text-transparent bg-linear-to-r from-violet-400 to-fuchsia-400">
                    TaskTracker?
                  </span>
                </h2>
                <ul className="space-y-5">
                  {[
                    { text: 'Intuitive interface that takes seconds to learn', color: 'from-cyan-400 to-blue-400' },
                    { text: 'Real-time synchronization across all your devices', color: 'from-emerald-400 to-teal-400' },
                    { text: 'Detailed productivity insights with interactive charts', color: 'from-amber-400 to-orange-400' },
                    { text: 'Secure authentication and data protection', color: 'from-rose-400 to-pink-400' },
                    { text: 'Filter and sort tasks by status, priority, and category', color: 'from-violet-400 to-purple-400' },
                    { text: 'Track weekly and daily productivity metrics', color: 'from-fuchsia-400 to-pink-400' },
                  ].map((item, index) => (
                    <li key={index} className="flex gap-4 items-start group cursor-pointer">
                      <div className={`mt-1 w-6 h-6 rounded-full bg-linear-to-r ${item.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      <span className="text-slate-300 text-lg leading-relaxed group-hover:text-white transition-colors duration-300">
                        {item.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Stats Cards */}
              <div className="space-y-4">
                {[
                  { label: 'Daily Tasks Completed', value: '12 tasks', icon: CheckCircle, gradient: 'from-cyan-500 to-blue-600', border: 'border-cyan-500/30', shadow: 'shadow-cyan-500/20' },
                  { label: 'Hours Tracked This Week', value: '32.5 hours', icon: Clock, gradient: 'from-emerald-500 to-teal-600', border: 'border-emerald-500/30', shadow: 'shadow-emerald-500/20' },
                  { label: 'Completion Rate', value: '94%', icon: TrendingUp, gradient: 'from-amber-500 to-orange-600', border: 'border-amber-500/30', shadow: 'shadow-amber-500/20' },
                ].map((stat, index) => (
                  <div
                    key={index}
                    className={`group relative p-6 bg-slate-900/50 backdrop-blur-xl border ${stat.border} rounded-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer overflow-hidden`}
                  >
                    <div className={`absolute inset-0 bg-linear-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                    <div className="relative flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-400 mb-2">{stat.label}</p>
                        <p className="text-4xl font-bold text-white" style={{ fontFamily: '"Space Grotesk", system-ui, sans-serif' }}>
                          {stat.value}
                        </p>
                      </div>
                      <div className={`w-14 h-14 rounded-xl bg-linear-to-br ${stat.gradient} flex items-center justify-center shadow-lg ${stat.shadow} group-hover:scale-110 transition-transform duration-300`}>
                        <stat.icon className="w-7 h-7 text-white" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 sm:py-32 relative">
          <div className="absolute inset-0 bg-linear-to-r from-violet-600/20 via-fuchsia-600/20 to-cyan-600/20 backdrop-blur-3xl"></div>
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
            <h2 className="text-5xl sm:text-6xl font-black text-white tracking-tight" style={{ fontFamily: '"Cabinet Grotesk", "Space Grotesk", system-ui, sans-serif' }}>
              Ready to take control
              <br />
              <span className="bg-clip-text text-transparent bg-linear-to-r from-violet-400 via-fuchsia-400 to-cyan-400">
                of your time?
              </span>
            </h2>
            <p className="text-xl text-slate-300">
              Join thousands of users who are already tracking their productivity.
            </p>
            <Link href="/register">
              <Button size="lg" className="px-10 py-8 text-lg bg-white text-violet-600 hover:bg-slate-100 font-bold shadow-2xl shadow-white/20 hover:shadow-white/30 hover:scale-105 transition-all duration-300">
                <Sparkles className="w-5 h-5 mr-2" />
                Get Started Free Today
              </Button>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/5 backdrop-blur-xl bg-slate-950/50 py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-slate-400">
                <span className="font-semibold text-white">TaskTracker</span> — Your productivity companion
              </p>
              <div className="flex gap-8">
                <Link href="/login" className="text-slate-400 hover:text-white text-sm transition-colors duration-300">
                  Login
                </Link>
                <Link href="/register" className="text-slate-400 hover:text-white text-sm transition-colors duration-300">
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}