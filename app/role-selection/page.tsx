'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Crown, GraduationCap, BookOpen, Sun, Moon, Sparkles, Clock, ShieldCheck, ArrowRight } from 'lucide-react';
import { useTransition } from '@/components/transition-provider';

const roles = [
  {
    id: 'principal',
    title: 'Principal',
    tagline: 'Command the institution',
    description: 'Oversee every timetable, manage staff, and drive school-wide analytics.',
    icon: Crown,
    color: '#E74C3C',
    glow: 'card-glow-red',
    floatClass: 'float-0',
    iconBg: 'bg-[#E74C3C]',
    headerBg: 'bg-[#E74C3C]/10 dark:bg-[#E74C3C]/5',
    btnStyle: { backgroundColor: '#E74C3C' },
    features: ['Full timetable control', 'Student management', 'Teacher oversight', 'Analytics & reports'],
    href: '/login/principal',
  },
  {
    id: 'teacher',
    title: 'Teacher',
    tagline: 'Own your schedule',
    description: 'View your classes, track assignments, and stay on top of every period.',
    icon: BookOpen,
    color: '#27AE60',
    glow: 'card-glow-green',
    floatClass: 'float-1',
    iconBg: 'bg-[#27AE60]',
    headerBg: 'bg-[#27AE60]/10 dark:bg-[#27AE60]/5',
    btnStyle: { backgroundColor: '#27AE60' },
    features: ['View timetable', 'Track assignments', 'Manage classes', 'Notifications'],
    href: '/login/teacher',
  },
  {
    id: 'student',
    title: 'Student',
    tagline: 'Your schedule, your world',
    description: 'Access your personal timetable, class info, and stay perfectly organised.',
    icon: GraduationCap,
    color: '#E83E8C',
    glow: 'card-glow-pink',
    floatClass: 'float-2',
    iconBg: 'bg-[#E83E8C]',
    headerBg: 'bg-[#E83E8C]/10 dark:bg-[#E83E8C]/5',
    btnStyle: { backgroundColor: '#E83E8C' },
    features: ['Personal schedule', 'Class details', 'Teacher info', 'Stay organized'],
    href: '/login/student',
  },
];

export default function RoleSelectionPage() {
  const [dark, setDark] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const { triggerTransition } = useTransition();

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

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden transition-colors duration-300">

      {/* Ambient background orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="orb   absolute top-[-15%] left-[-8%]  w-[500px] h-[500px] rounded-full bg-[#E74C3C]/6 blur-[100px]" />
        <div className="orb-2 absolute bottom-[-10%] right-[-8%] w-[450px] h-[450px] rounded-full bg-[#E83E8C]/6 blur-[100px]" />
        <div className="orb-3 absolute top-[35%]  left-[40%]  w-[300px] h-[300px] rounded-full bg-[#27AE60]/5 blur-[80px]" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-border/50">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-9 h-9 bg-[#E74C3C] rounded-lg flex items-center justify-center shadow-md shadow-[#E74C3C]/30">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <span className="arcane font-semibold text-lg">SchoolTime</span>
        </Link>
        <button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-lg border border-border/60 flex items-center justify-center hover:bg-muted transition-colors"
          aria-label="Toggle theme"
        >
          {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </nav>

      {/* Hero */}
      <div className="relative z-10 text-center pt-14 pb-10 px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/50 text-xs text-muted-foreground mb-5">
          <Sparkles className="w-3 h-3 text-[#E74C3C]" />
          Secure role-based access
          <ShieldCheck className="w-3 h-3 text-[#E74C3C]" />
        </div>
        <h1 className="arcane text-4xl md:text-5xl font-bold mb-3 shimmer-text">
          Choose Your Role
        </h1>
        <p className="text-muted-foreground text-base max-w-md mx-auto">
          Select your role to access the appropriate dashboard and features
        </p>
      </div>

      {/* Role Cards */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 pb-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        {roles.map((role) => {
          const Icon = role.icon;
          const isHovered = hovered === role.id;
          return (
            <div
              key={role.id}
              onMouseEnter={() => setHovered(role.id)}
              onMouseLeave={() => setHovered(null)}
              className={`
                relative rounded-2xl border border-border/50
                bg-card overflow-hidden
                transition-all duration-300 ease-out
                ${role.glow}
                ${isHovered ? 'scale-[1.03] -translate-y-2 border-opacity-80' : ''}
              `}
            >
              {/* Coloured header band */}
              <div className={`h-28 ${role.headerBg} flex items-center justify-center relative overflow-hidden`}>
                {/* Inner radial glow on hover */}
                <div
                  className="absolute inset-0 transition-opacity duration-300"
                  style={{
                    background: `radial-gradient(ellipse at center, ${role.color}30 0%, transparent 70%)`,
                    opacity: isHovered ? 1 : 0,
                  }}
                />
                <div className={`${role.iconBg} ${role.floatClass} w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl`}>
                  <Icon className="w-8 h-8 text-white" strokeWidth={1.5} />
                </div>
              </div>

              {/* Card body */}
              <div className="p-6">
                <p
                  className="text-[11px] font-semibold tracking-[0.15em] uppercase mb-1"
                  style={{ color: role.color }}
                >
                  {role.tagline}
                </p>
                <h2 className="arcane text-2xl font-bold mb-2">{role.title}</h2>
                <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                  {role.description}
                </p>

                <ul className="space-y-2 mb-6">
                  {role.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: role.color }} />
                      {f}
                    </li>
                  ))}
                </ul>

                  <button
                    onClick={(e) => triggerTransition(role.href, e)}
                    className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all duration-300 hover:opacity-90 hover:shadow-xl active:scale-[0.96] flex items-center justify-center gap-2 group/btn"
                    style={role.btnStyle}
                  >
                    Continue as {role.title}
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Don't have an account */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 pb-20">
        <div className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm p-8">
          <h3 className="arcane text-xl font-semibold mb-6 text-center">Don't have an account?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            {[
              { role: 'Principals', text: 'Contact your school administrator to get your principal account set up.' },
              { role: 'Teachers', text: 'Ask your school administrator for teacher account access.' },
              { role: 'Students', text: 'You can create an account using your student ID and email.' },
            ].map(({ role, text }) => (
              <div key={role}>
                <p className="font-semibold mb-1">For {role}</p>
                <p className="text-muted-foreground leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}