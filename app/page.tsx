'use client';

import Link from 'next/link';
import { Clock, Users, BookOpen, BarChart3, Sun, Moon, Sparkles, ArrowRight, CheckCircle2, Shield, Zap, Globe, MessageSquare } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useTransition } from '@/components/transition-provider';

function CTAButton({ 
  children, 
  href, 
  className = "", 
  variant = 'primary' 
}: { 
  children: React.ReactNode, 
  href: string, 
  className?: string,
  variant?: 'primary' | 'secondary'
}) {
  const { triggerTransition } = useTransition();
  const [ripples, setRipples] = useState<{ x: number, y: number, id: number }[]>([]);

  const handleClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setRipples([...ripples, { x, y, id: Date.now() }]);
    
    // Trigger the page transition
    setTimeout(() => triggerTransition(href, e), 100);
  };

  const baseStyles = "relative overflow-hidden transition-all duration-300 active:scale-[0.96] font-semibold rounded-xl px-8 py-4 flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-[#E74C3C] text-white hover:opacity-90 shadow-xl shadow-[#E74C3C]/25 hover:gradient-sweep-animated",
    secondary: "border border-border/60 hover:bg-muted"
  };

  return (
    <button 
      onClick={handleClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {ripples.map(r => (
        <span 
          key={r.id} 
          className="ripple-effect" 
          style={{ left: r.x, top: r.y, width: 20, height: 20 }} 
          onAnimationEnd={() => setRipples(ripples.filter(rip => rip.id !== r.id))}
        />
      ))}
      {children}
    </button>
  );
}

// Custom hook for scroll position
function useScrollY() {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return scrollY;
}

function RainbowCard({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`group relative p-[1px] rounded-2xl transition-all duration-500 hover:scale-[1.02] ${className}`}>
      {/* Rainbow background that shows on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-[2px]" />
      <div className="relative bg-card rounded-[15px] p-8 h-full border border-border/50 group-hover:border-transparent transition-colors duration-500">
        {children}
      </div>
    </div>
  );
}

function ParallaxSection({ 
  image, 
  title, 
  description, 
  reverse = false 
}: { 
  image: string, 
  title: string, 
  description: string, 
  reverse?: boolean 
}) {
  const scrollY = useScrollY();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (sectionRef.current) {
      const rect = sectionRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const elementHeight = rect.height;
      const elementCenter = rect.top + elementHeight / 2;
      const viewportCenter = viewportHeight / 2;
      
      // Calculate distance from viewport center
      const distanceFromCenter = elementCenter - viewportCenter;
      
      // Clamp the offset to prevent revealing edges
      // With h-[120%], we have 10% extra on top and 10% on bottom.
      // 10% of 400px is 40px.
      const rawOffset = distanceFromCenter * 0.1;
      const clampedOffset = Math.max(-40, Math.min(40, rawOffset));
      
      setOffset(clampedOffset);
    }
  }, [scrollY]);

  return (
    <section ref={sectionRef} className="py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className={`flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-16`}>
          <div className="flex-1 space-y-6">
            <h2 className="arcane text-4xl md:text-5xl font-bold leading-tight">{title}</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">{description}</p>
            <div className="pt-4">
              <button className="flex items-center gap-2 group text-[#E74C3C] font-semibold">
                Explore Features <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
          <div className="flex-1 relative h-[400px] w-full rounded-3xl overflow-hidden shadow-2xl border border-border/20">
            <div 
              className="absolute -inset-[10%] bg-cover bg-center transition-transform duration-300 ease-out h-[120%] w-[120%]"
              style={{ 
                backgroundImage: `url(${image})`,
                transform: `translateY(${offset}px)`
              }}
            />
            <div className="absolute inset-0 bg-black/5 dark:bg-black/10 transition-opacity group-hover:opacity-0" />
          </div>
        </div>
      </div>
    </section>
  );
}

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
    { icon: Clock, color: '#E74C3C', bg: 'bg-[#E74C3C]/10', label: 'Smart Scheduling' },
    { icon: Users, color: '#27AE60', bg: 'bg-[#27AE60]/10', label: 'Live Collaboration' },
    { icon: BookOpen, color: '#F39C12', bg: 'bg-[#F39C12]/10', label: 'Resource Mgmt' },
    { icon: BarChart3, color: '#E83E8C', bg: 'bg-[#E83E8C]/10', label: 'AI Analytics' },
  ];

  const corePrinciples = [
    { 
      icon: Zap, 
      title: "Lightning Fast", 
      desc: "Generate full-school timetables in seconds using our advanced genetic algorithms, saving weeks of manual work.",
      color: "#F39C12"
    },
    { 
      icon: Shield, 
      title: "Conflict Proof", 
      desc: "Our engine ensures zero scheduling conflicts across teachers, rooms, and students with 100% accuracy.",
      color: "#E74C3C"
    },
    { 
      icon: Globe, 
      title: "Always Sync", 
      desc: "Real-time updates across all devices. When a schedule changes, everyone is notified instantly via SMS or app.",
      color: "#27AE60"
    }
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

              <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
                The ultimate AI-powered system for educational institutions. Join over 500+ schools worldwide transforming how they schedule, manage, and optimize their daily academic operations.
              </p>

              <div className="flex gap-4 flex-wrap">
                <CTAButton href="/role-selection">
                  Start Now <ArrowRight className="w-4 h-4" />
                </CTAButton>
                <CTAButton href="/role-selection" variant="secondary">
                  Learn More
                </CTAButton>
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

        {/* Our Principles - Rainbow Cards */}
        <section className="py-24 border-t border-border/40">
          <div className="max-w-7xl mx-auto px-6 text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
              <Sparkles className="w-3 h-3" />
              Why Choose Us
            </div>
            <h2 className="arcane text-4xl md:text-5xl font-bold mb-6 italic">Built on Innovation</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our platform goes beyond simple scheduling. We provide a complete ecosystem designed for efficiency, transparency, and growth.
            </p>
          </div>
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">
            {corePrinciples.map(({ icon: Icon, title, desc, color }) => (
              <RainbowCard key={title}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm" style={{ backgroundColor: `${color}15` }}>
                  <Icon className="w-7 h-7" style={{ color }} />
                </div>
                <h3 className="arcane text-2xl font-bold mb-4">{title}</h3>
                <p className="text-muted-foreground leading-relaxed">{desc}</p>
              </RainbowCard>
            ))}
          </div>
        </section>

        {/* Parallax Section 1 */}
        <ParallaxSection 
          image="/school-building.png"
          title="Transform Your Institution's Landscape"
          description="Architecture meets education. Our platform provides a modern digital infrastructure that complements your physical school, creating a seamless environment for both administrative excellence and academic success."
        />

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

        {/* Parallax Section 2 */}
        <ParallaxSection 
          image="/dashboard-preview.png"
          reverse
          title="Data-Driven Academic Insights"
          description="Harness the power of analytics to understand trends in attendance, room utilization, and teacher workloads. Our dashboard brings clarity to complex data, enabling principals to make informed decisions that improve the overall school performance."
        />

        {/* CTA */}
        <section className="py-24">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="arcane text-4xl font-bold mb-4">Ready to streamline your school?</h2>
            <p className="text-muted-foreground text-lg mb-8">
              Join thousands of schools using SchoolTime to manage their timetables efficiently.
            </p>
            <div className="flex justify-center">
              <CTAButton href="/role-selection" className="text-lg">
                Get Started Today
              </CTAButton>
            </div>
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
              { title: 'Product', links: ['Features', 'Pricing', 'Security'] },
              { title: 'Company', links: ['About', 'Blog', 'Contact'] },
              { title: 'Legal', links: ['Privacy', 'Terms'] },
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