'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Clock, Eye, EyeOff, ChevronDown, Crown, BookOpen, GraduationCap, Moon, Sun, ShieldCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import { sessionStorage } from '@/lib/session';

const roleConfig = {
  principal: {
    color: '#E74C3C',
    glow: 'card-glow-red',
    icon: Crown,
    label: 'Principal',
    tagline: 'Command the institution',
    orbColor: 'bg-[#E74C3C]',
  },
  teacher: {
    color: '#27AE60',
    glow: 'card-glow-green',
    icon: BookOpen,
    label: 'Teacher',
    tagline: 'Own your schedule',
    orbColor: 'bg-[#27AE60]',
  },
  student: {
    color: '#E83E8C',
    glow: 'card-glow-pink',
    icon: GraduationCap,
    label: 'Student',
    tagline: 'Your schedule, your world',
    orbColor: 'bg-[#E83E8C]',
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
        name: 'Demo User',
        email,
      });
      router.push(`/dashboard/${role}`);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 flex items-center justify-center px-4 relative overflow-hidden">

      {/* Ambient orbs */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="orb   absolute top-[-15%] left-[-8%]  w-[500px] h-[500px] rounded-full blur-[100px]"
          style={{ backgroundColor: `${config.color}10` }} />
        <div className="orb-2 absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full blur-[100px]"
          style={{ backgroundColor: `${config.color}08` }} />
      </div>

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 z-50 w-9 h-9 rounded-lg border border-border/60 flex items-center justify-center hover:bg-muted transition-colors bg-background/80 backdrop-blur-sm"
      >
        {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </button>

      <div className="w-full max-w-md">

        {/* Card */}
        <div className={`bg-card rounded-2xl border border-border/50 overflow-hidden ${config.glow}`}>

          {/* Coloured top band */}
          <div className="h-24 flex items-center justify-center relative overflow-hidden"
            style={{ backgroundColor: `${config.color}12` }}>
            <div className="absolute inset-0"
              style={{ background: `radial-gradient(ellipse at center, ${config.color}25 0%, transparent 70%)` }} />
            <div className={`${config.orbColor} float-0 w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl`}>
              <Icon className="w-7 h-7 text-white" strokeWidth={1.5} />
            </div>
          </div>

          {/* Header text */}
          <div className="px-8 pt-6 pb-4 border-b border-border/50">
            <Link href="/" className="flex items-center gap-2 mb-5 hover:opacity-80 transition-opacity w-fit">
              <div className="w-8 h-8 bg-[#E74C3C] rounded-lg flex items-center justify-center shadow-md shadow-[#E74C3C]/30">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <span className="arcane font-semibold">SchoolTime</span>
            </Link>

            <p className="text-xs font-semibold tracking-widest uppercase mb-1"
              style={{ color: config.color }}>
              {config.tagline}
            </p>
            <h1 className="arcane text-2xl font-bold mb-1">Welcome Back</h1>
            <p className="text-sm text-muted-foreground flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" style={{ color: config.color }} />
              Logging in as <span className="font-semibold" style={{ color: config.color }}>{config.label}</span>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="px-8 py-6 space-y-5">

            {/* Organization */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Organization</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowOrgDropdown(!showOrgDropdown)}
                  className="w-full px-4 py-2.5 rounded-xl border border-border/60 bg-background text-left flex items-center justify-between hover:bg-muted/50 transition-colors text-sm focus:outline-none focus:ring-2"
                  style={{ '--tw-ring-color': config.color } as React.CSSProperties}
                >
                  <span>{selectedOrg}</span>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${showOrgDropdown ? 'rotate-180' : ''}`} />
                </button>
                {showOrgDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border/60 rounded-xl shadow-xl z-20 overflow-hidden">
                    {organizations.map(org => (
                      <button key={org} type="button"
                        onClick={() => { setSelectedOrg(org); setShowOrgDropdown(false); }}
                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-muted transition-colors">
                        {org}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-border/60 bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all"
                style={{ '--tw-ring-color': config.color } as React.CSSProperties}
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Password</label>
                <Link href="#" className="text-xs font-medium hover:underline" style={{ color: config.color }}>Forgot?</Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 pr-10 rounded-xl border border-border/60 bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all"
                  style={{ '--tw-ring-color': config.color } as React.CSSProperties}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-2">
              <input type="checkbox" id="remember" checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded cursor-pointer" />
              <label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">Remember me</label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] shadow-lg disabled:opacity-60"
              style={{ backgroundColor: config.color, boxShadow: `0 4px 20px ${config.color}40` }}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* Footer */}
          <div className="px-8 py-5 border-t border-border/50 bg-muted/20 text-center">
            <p className="text-sm text-muted-foreground">
              Not sure which role?{' '}
              <Link href="/role-selection" className="font-semibold hover:underline" style={{ color: config.color }}>
                Choose your role
              </Link>
            </p>
          </div>
        </div>

        {/* Demo credentials */}
        <div className="mt-5 rounded-xl border p-4 text-sm"
          style={{ borderColor: `${config.color}40`, backgroundColor: `${config.color}08` }}>
          <p className="font-semibold mb-1.5" style={{ color: config.color }}>Demo Credentials</p>
          <p className="text-muted-foreground">Email: demo@schooltime.com</p>
          <p className="text-muted-foreground">Password: demo123</p>
        </div>
      </div>
    </div>
  );
}