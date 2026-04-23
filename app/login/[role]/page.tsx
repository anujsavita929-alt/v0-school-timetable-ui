'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Clock, Eye, EyeOff, ChevronDown, Crown, BookOpen, GraduationCap, Moon, Sun, ShieldCheck, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { sessionStorage } from '@/lib/session';

const roleConfig = {
  principal: {
    color: '#E74C3C',
    glow: 'card-glow-red',
    icon: Crown,
    label: 'Principal',
    tagline: 'Command the institution',
    orbColors: ['#E74C3C', '#F39C12', '#C0392B'],
  },
  teacher: {
    color: '#27AE60',
    glow: 'card-glow-green',
    icon: BookOpen,
    label: 'Teacher',
    tagline: 'Own your schedule',
    orbColors: ['#27AE60', '#1ABC9C', '#2ECC71'],
  },
  student: {
    color: '#E83E8C',
    glow: 'card-glow-pink',
    icon: GraduationCap,
    label: 'Student',
    tagline: 'Your schedule, your world',
    orbColors: ['#E83E8C', '#9B59B6', '#8E44AD'],
  },
};

const organizations = [
  'Springfield High School',
  'Lincoln Academy',
  'Washington Institute',
  'Jefferson College',
];

export default function LoginPage() {
  const params = useParams();
  const router = useRouter();
  const role = (params.role as string) || 'student';
  const config = roleConfig[role as keyof typeof roleConfig] ?? roleConfig.student;
  const Icon = config.icon;

  const [dark, setDark] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState(organizations[0]);
  const [showOrgDropdown, setShowOrgDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const sys = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = saved === 'dark' || (!saved && sys);
    setDark(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  const toggleTheme = () => {
    setDark(d => {
      const next = !d;
      document.documentElement.classList.toggle('dark', next);
      localStorage.setItem('theme', next ? 'dark' : 'light');
      return next;
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      sessionStorage.set({
        id: 'demo-user',
        role: role as 'principal' | 'teacher' | 'student',
        name: email.split('@')[0].split(/[._-]/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
        email,
      });
      router.push(`/dashboard/${role}`);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 flex items-center justify-center px-4 relative overflow-hidden">

      {/* Animated Floating Orbs */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        {config.orbColors.map((clr, i) => (
          <div 
            key={i}
            className="absolute rounded-full blur-[120px] opacity-[0.15] animate-float"
            style={{ 
              backgroundColor: clr,
              width: `${300 + i * 100}px`,
              height: `${300 + i * 100}px`,
              left: `${10 + i * 25}%`,
              top: `${10 + i * 20}%`,
              animation: `orbDrift ${20 + i * 5}s ease-in-out infinite alternate`,
              animationDelay: `${i * 2}s`
            }} 
          />
        ))}
      </div>

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 z-50 w-9 h-9 rounded-lg border border-border/60 flex items-center justify-center hover:bg-muted transition-colors bg-background/80 backdrop-blur-sm"
      >
        {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </button>

      <div className="w-full max-w-md">

        {/* Glass Card */}
        <div className={`glass-card rounded-[2.5rem] overflow-hidden ${config.glow} transition-all duration-500`}>

          {/* Coloured top band */}
          <div className="h-32 flex items-center justify-center relative overflow-hidden bg-gray-500/5 dark:bg-transparent">
            <div className="absolute inset-0 opacity-40 dark:opacity-20"
              style={{ background: `linear-gradient(45deg, ${config.color}, transparent)` }} />
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl relative z-10"
              style={{ backgroundColor: config.color }}>
              <Icon className="w-8 h-8 text-white" strokeWidth={1.5} />
            </div>
          </div>

          {/* Header text */}
          <div className="px-10 pt-8 pb-6 border-b border-white/10 dark:border-white/10 border-black/5">
            <Link href="/" className="flex items-center gap-2 mb-6 hover:opacity-80 transition-opacity w-fit">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg"
                style={{ backgroundColor: config.color }}>
                <Clock className="w-4 h-4 text-white" />
              </div>
              <span className="arcane font-bold text-gray-900 dark:text-white tracking-tight">SchoolTime</span>
            </Link>

            <p className="text-xs font-bold tracking-[0.2em] uppercase mb-1.5 text-gray-700 dark:opacity-70"
              style={{ color: dark ? config.color : '#374151' }}>
              {config.tagline}
            </p>
            <h1 className="arcane text-4xl font-bold mb-2 text-gray-900 dark:text-white">Welcome Back</h1>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/5 w-fit border border-black/5 dark:border-white/10">
              <ShieldCheck className="w-4 h-4" style={{ color: config.color }} />
              <p className="text-xs text-gray-700 dark:text-white/70">
                Secure Portal: <span className="font-bold text-gray-900 dark:text-white uppercase ml-1">{config.label}</span>
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="px-10 py-8 space-y-6">

            {/* Organization */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-500 dark:text-white/50 tracking-wider uppercase ml-1">Organization</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowOrgDropdown(!showOrgDropdown)}
                  className="w-full px-5 py-3.5 rounded-2xl glass-input text-left flex items-center justify-between text-sm focus:outline-none focus:ring-2 text-gray-900 dark:text-white"
                  style={{ '--tw-ring-color': config.color } as React.CSSProperties}
                >
                  <span className="font-medium">{selectedOrg}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 dark:text-white/40 transition-transform ${showOrgDropdown ? 'rotate-180' : ''}`} />
                </button>
                {showOrgDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-3 glass-card rounded-2xl shadow-2xl z-20 overflow-hidden animate-in fade-in slide-in-from-top-2 bg-white dark:bg-[#111118]">
                    {organizations.map(org => (
                      <button key={org} type="button"
                        onClick={() => { setSelectedOrg(org); setShowOrgDropdown(false); }}
                        className="w-full text-left px-5 py-3.5 text-sm hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-700 dark:text-white/80">
                        {org}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-500 dark:text-white/50 tracking-wider uppercase ml-1">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-5 py-3.5 rounded-2xl glass-input text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/30"
                style={{ '--tw-ring-color': config.color } as React.CSSProperties}
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-sm font-bold text-gray-500 dark:text-white/50 tracking-wider uppercase">Password</label>
                <Link href="#" className="text-xs font-bold hover:underline" style={{ color: config.color }}>Forgot?</Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full px-5 py-3.5 pr-12 rounded-2xl glass-input text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/30"
                  style={{ '--tw-ring-color': config.color } as React.CSSProperties}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-white/40 dark:hover:text-white transition-colors">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-3 ml-1">
              <input type="checkbox" id="remember" checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                className="w-5 h-5 rounded-lg border-gray-300 dark:border-white/20 bg-gray-50 dark:bg-white/5 cursor-pointer accent-primary" />
              <label htmlFor="remember" className="text-sm text-gray-700 dark:text-white/60 font-medium cursor-pointer">Stay logged in for 30 days</label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-2xl text-white text-base font-bold transition-all shadow-2xl disabled:opacity-60 overflow-hidden relative group"
              style={{ 
                backgroundColor: config.color, 
                boxShadow: `0 0 30px ${config.color}50`,
                animation: 'glow-pulse-idle 3s infinite'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shine-sweep" />
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <Clock className="w-5 h-5 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    Sign In to Dashboard
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
            </button>
          </form>

          {/* Footer */}
          <div className="px-10 py-6 border-t border-black/5 dark:border-white/10 bg-black/[0.02] dark:bg-white/5 text-center">
            <p className="text-sm text-gray-500 dark:text-white/50 font-medium">
              Not sure which role?{' '}
              <Link href="/role-selection" className="font-bold hover:underline" style={{ color: config.color }}>
                Switch Access Role
              </Link>
            </p>
          </div>
        </div>

        {/* Demo credentials */}
        <div className="mt-8 rounded-2xl border border-black/10 dark:border-white/10 p-5 text-sm glass-card overflow-hidden relative">
          <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: config.color }} />
          <p className="font-bold mb-2 uppercase tracking-widest text-xs text-gray-500 dark:opacity-70" style={{ color: dark ? config.color : '#6b7280' }}>Quick Access</p>
          <div className="space-y-1 text-gray-500 dark:text-white/50">
            <p className="flex justify-between"><span>Email:</span> <span className="text-gray-900 dark:text-white/80 font-mono">demo@schooltime.com</span></p>
            <p className="flex justify-between"><span>Password:</span> <span className="text-gray-900 dark:text-white/80 font-mono">demo123</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}