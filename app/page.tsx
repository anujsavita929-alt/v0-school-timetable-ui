'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Clock, Users, BookOpen, BarChart3 } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function LandingPage() {
  const [particles, setParticles] = useState<Array<{ id: number; left: number; delay: number }>>([]);

  useEffect(() => {
    // Generate falling clock particles
    const newParticles = Array.from({ length: 5 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.5,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute animate-fall text-4xl opacity-10"
            style={{
              left: `${particle.left}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${4 + Math.random() * 2}s`,
            }}
          >
            🕐
          </div>
        ))}
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#E74C3C] rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">SchoolTime</span>
          </div>
          <Link href="/role-selection">
            <Button className="bg-[#E74C3C] hover:bg-red-700 text-white">
              Get Started
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10">
        <section className="max-w-7xl mx-auto px-6 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                  Manage School <span className="text-[#E74C3C]">Timetables</span> with Ease
                </h1>
                <p className="text-xl text-gray-600">
                  A comprehensive platform for principals, teachers, and students to manage schedules, track classes, and stay organized.
                </p>
              </div>

              <div className="flex gap-4">
                <Link href="/role-selection">
                  <Button size="lg" className="bg-[#E74C3C] hover:bg-red-700 text-white">
                    Start Now
                  </Button>
                </Link>
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </div>

              {/* Features List */}
              <div className="space-y-3 pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#27AE60] rounded-full"></div>
                  <span className="text-gray-700">Real-time timetable management</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#27AE60] rounded-full"></div>
                  <span className="text-gray-700">Role-based access control</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#27AE60] rounded-full"></div>
                  <span className="text-gray-700">Student and teacher management</span>
                </div>
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative h-96 md:h-full flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-[#E74C3C]/10 via-[#27AE60]/10 to-[#E83E8C]/10 rounded-3xl blur-3xl"></div>
              <div className="relative grid grid-cols-2 gap-4 w-full h-64">
                {/* Timetable Preview Cards */}
                <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200 transform hover:scale-105 transition-transform">
                  <div className="w-8 h-8 bg-[#E74C3C]/10 rounded-lg flex items-center justify-center mb-3">
                    <Clock className="w-5 h-5 text-[#E74C3C]" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200 transform hover:scale-105 transition-transform">
                  <div className="w-8 h-8 bg-[#27AE60]/10 rounded-lg flex items-center justify-center mb-3">
                    <Users className="w-5 h-5 text-[#27AE60]" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200 transform hover:scale-105 transition-transform">
                  <div className="w-8 h-8 bg-[#F39C12]/10 rounded-lg flex items-center justify-center mb-3">
                    <BookOpen className="w-5 h-5 text-[#F39C12]" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200 transform hover:scale-105 transition-transform">
                  <div className="w-8 h-8 bg-[#E83E8C]/10 rounded-lg flex items-center justify-center mb-3">
                    <BarChart3 className="w-5 h-5 text-[#E83E8C]" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Features for Everyone
              </h2>
              <p className="text-xl text-gray-600">
                Tailored experiences for principals, teachers, and students
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Principal Card */}
              <div className="bg-white rounded-xl p-8 shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-[#E74C3C]/10 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-[#E74C3C]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">For Principals</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#E74C3C] rounded-full"></span>
                    Manage all timetables
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#E74C3C] rounded-full"></span>
                    Student management
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#E74C3C] rounded-full"></span>
                    Teacher management
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#E74C3C] rounded-full"></span>
                    View analytics
                  </li>
                </ul>
              </div>

              {/* Teacher Card */}
              <div className="bg-white rounded-xl p-8 shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-[#27AE60]/10 rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-[#27AE60]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">For Teachers</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#27AE60] rounded-full"></span>
                    View timetable
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#27AE60] rounded-full"></span>
                    Track assignments
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#27AE60] rounded-full"></span>
                    Manage classes
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#27AE60] rounded-full"></span>
                    See notifications
                  </li>
                </ul>
              </div>

              {/* Student Card */}
              <div className="bg-white rounded-xl p-8 shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-[#E83E8C]/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-[#E83E8C]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">For Students</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#E83E8C] rounded-full"></span>
                    Personal schedule
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#E83E8C] rounded-full"></span>
                    Class details
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#E83E8C] rounded-full"></span>
                    Teacher info
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#E83E8C] rounded-full"></span>
                    Stay organized
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-white py-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Ready to streamline your school?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of schools using SchoolTime to manage their timetables efficiently.
            </p>
            <Link href="/role-selection">
              <Button size="lg" className="bg-[#E74C3C] hover:bg-red-700 text-white">
                Get Started Today
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-[#E74C3C] rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-white">SchoolTime</span>
              </div>
              <p className="text-sm">Making school management simple.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Features</a></li>
                <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex justify-between items-center text-sm">
            <p>&copy; 2024 SchoolTime. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition">Twitter</a>
              <a href="#" className="hover:text-white transition">LinkedIn</a>
              <a href="#" className="hover:text-white transition">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
