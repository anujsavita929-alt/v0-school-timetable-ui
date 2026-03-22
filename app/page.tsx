'use client';

import Link from 'next/link';
import { Clock, Users, BookOpen, BarChart3, Sun, Moon, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function LandingPage() {
  const [dark, setDark] = useState(false);

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

  const featureCards = [
    { icon: Clock,     color: '#E74C3C', bg: 'bg-[#E74C3C]/10', label: 'Timetable' },
    { icon: Users,     color: '#27AE60', bg: 'bg-[#27AE60]/10', label: 'Students'  },
    { icon: BookOpen,  color: '#F39C12', bg: 'bg-[#F39C12]/10', label: 'Classes'   },
    { icon: BarChart3, color: '#E83E8C', bg: 'bg-[#E83E8C]/10', label: 'Analytics' },
  ];

  const sections = [
    {
      title: 'For Principals',
      icon: BarChart3,
      color: '#E74C3C',
      glow: 'card-glow-red',
      items: ['Manage all timetables', 'Student management', 'Teacher management', 'View analytics'],
    },
    {
      title: 'For Teachers',
      icon: BookOpen,
      color: '#27AE60',
      glow: 'card-glow-green',
      items: ['View timetable', 'Track assignments', 'Manage classes', 'See notifications'],
    },
    {
      title: 'For Students',
      icon: Users,
      color: '#E83E8C',
      glow: 'card-glow-pink',
      items: ['Personal schedule', 'Class details', 'Teacher info', 'Stay organized'],
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 overflow-hidden">

      {/* Ambient orbs */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="orb   absolute top-[-15%] left-[-8%]  w-[500px] h-[500px] rounded-full bg-[#E74C3C]/6 blur-[100px]" />
        <div className="orb-2 absolute bottom-[-10%] right-[-5%] w-[450px] h-[450px] rounded-full bg-[#E83E8C]/6 blur-[100px]" />
        <div className="orb-3 absolute top-[40%]  left-[40%]  w-[300px] h-[300px] rounded-full bg-[#27AE60]/5 blur-[80px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/50 backdrop-blur-md bg-background/80">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-[#E74C3C] rounded-lg flex items-center justify-center shadow-md shadow-[#E74C3C]/30">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <span className="arcane font-semibold text-lg">SchoolTime</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-lg border border-border/60 flex items-center justify-center hover:bg-muted transition-colors"
            >
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <Link href="/role-selection">
              <button className="px-4 py-2 rounded-lg bg-[#E74C3C] text-white text-sm font-semibold hover:bg-[#c0392b] transition-colors shadow-md shadow-[#E74C3C]/30">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="max-w-7xl mx-auto px-6 py-24 md:py-32">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/50 text-xs text-muted-foreground">
                <Sparkles className="w-3 h-3 text-[#E74C3C]" />
                Built for modern schools
              </div>

              <h1 className="arcane text-5xl md:text-6xl font-bold leading-tight">
                Manage School{' '}
                <span className="shimmer-text">Timetables</span>{' '}
                with Ease
              </h1>

              <p className="text-lg text-muted-foreground leading-relaxed">
                A comprehensive platform for principals, teachers, and students to manage schedules, track classes, and stay organized.
              </p>

              <div className="flex gap-4 flex-wrap">
                <Link href="/role-selection">
                  <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#E74C3C] text-white font-semibold hover:bg-[#c0392b] transition-all shadow-lg shadow-[#E74C3C]/30 hover:scale-[1.02]">
                    Start Now <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
                <button className="px-6 py-3 rounded-xl border border-border/60 font-semibold hover:bg-muted transition-colors">
                  Learn More
                </button>
              </div>

              <div className="space-y-2.5">
                {['Real-time timetable management', 'Role-based access control', 'Student and teacher management'].map(f => (
                  <div key={f} className="flex items-center gap-3 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-[#27AE60] flex-shrink-0" />
                    <span className="text-muted-foreground">{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero visual */}
            <div className="relative flex items-center justify-center h-80 md:h-96">
              <div className="absolute inset-0 bg-gradient-to-br from-[#E74C3C]/8 via-[#27AE60]/6 to-[#E83E8C]/8 rounded-3xl blur-2xl" />
              <div className="relative grid grid-cols-2 gap-4 w-full max-w-sm">
                {featureCards.map(({ icon: Icon, color, bg, label }, i) => (
                  <div
                    key={label}
                    className={`bg-card border border-border/50 rounded-xl p-4 shadow-lg hover:scale-105 transition-transform float-${i}`}
                  >
                    <div className={`w-9 h-9 ${bg} rounded-lg flex items-center justify-center mb-3`}>
                      <Icon className="w-5 h-5" style={{ color }} />
                    </div>
                    <p className="text-xs font-medium mb-2" style={{ color }}>{label}</p>
                    <div className="space-y-1.5">
                      <div className="h-1.5 bg-border rounded w-3/4" />
                      <div className="h-1.5 bg-border rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="bg-muted/30 py-24 border-y border-border/40">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="arcane text-4xl font-bold mb-3">Features for Everyone</h2>
              <p className="text-muted-foreground text-lg">Tailored experiences for principals, teachers, and students</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {sections.map(({ title, icon: Icon, color, glow, items }) => (
                <div key={title} className={`bg-card rounded-2xl p-8 border border-border/50 hover:scale-[1.02] transition-all duration-300 ${glow}`}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ backgroundColor: `${color}15` }}>
                    <Icon className="w-6 h-6" style={{ color }} />
                  </div>
                  <h3 className="arcane text-xl font-bold mb-4">{title}</h3>
                  <ul className="space-y-2.5">
                    {items.map(item => (
                      <li key={item} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="arcane text-4xl font-bold mb-4">Ready to streamline your school?</h2>
            <p className="text-muted-foreground text-lg mb-8">
              Join thousands of schools using SchoolTime to manage their timetables efficiently.
            </p>
            <Link href="/role-selection">
              <button className="px-8 py-4 rounded-xl bg-[#E74C3C] text-white font-semibold text-lg hover:bg-[#c0392b] transition-all shadow-xl shadow-[#E74C3C]/25 hover:scale-[1.02]">
                Get Started Today
              </button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/60 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-[#E74C3C] rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <span className="arcane font-semibold">SchoolTime</span>
              </div>
              <p className="text-sm text-muted-foreground">Making school management simple.</p>
            </div>
            {[
              { title: 'Product',  links: ['Features', 'Pricing', 'Security'] },
              { title: 'Company',  links: ['About', 'Blog', 'Contact'] },
              { title: 'Legal',    links: ['Privacy', 'Terms'] },
            ].map(({ title, links }) => (
              <div key={title}>
                <h4 className="font-semibold mb-3 text-sm">{title}</h4>
                <ul className="space-y-2">
                  {links.map(l => (
                    <li key={l}>
                      <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{l}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-border/50 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-muted-foreground">
            <p>© 2024 SchoolTime. All rights reserved.</p>
            <div className="flex gap-4">
              {['Twitter', 'LinkedIn', 'GitHub'].map(s => (
                <a key={s} href="#" className="hover:text-foreground transition-colors">{s}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}