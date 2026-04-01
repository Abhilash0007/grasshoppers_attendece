import React from 'react';
import { useAuth } from '@/context/auth';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiArrowRight, FiClock, FiUsers, FiTrendingUp, FiSmartphone } from 'react-icons/fi';

export default function HomePage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  return (
    <>
      {/* Hero Section */}
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-0 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-2000"></div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="text-center max-w-4xl mx-auto animate-slide-in-down">
            <div className="mb-6 inline-block">
              <span className="px-4 py-2 bg-blue-100/80 text-blue-700 rounded-full text-sm font-semibold border border-blue-200">
                🦗 Grasshoppers Attendance System
              </span>
            </div>
            <h1 className="heading-1 mb-6 leading-tight">
              Modern Punch Attendance<br className="hidden md:block" /> System for Your Team
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Track employee attendance with ease. Real-time punch in/out, location tracking, and instant notifications for admins.
            </p>

            {!isAuthenticated && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/login"
                  className="btn-primary btn-lg inline-flex items-center justify-center gap-2"
                >
                  <FiArrowRight /> Login Now
                </Link>
                <Link
                  href="/signup"
                  className="btn-secondary btn-lg inline-flex items-center justify-center gap-2"
                >
                  <FiArrowRight /> Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white relative">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16 animate-slide-in-up">
            <h2 className="heading-2 mb-4">✨ Powerful Features</h2>
            <p className="text-lg text-gray-600">Everything you need for modern attendance management</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-in-up">
            <div className="card-hover">
              <div className="p-4 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl mb-4 inline-block">
                <FiClock className="text-blue-600 w-8 h-8" />
              </div>
              <h3 className="heading-3 mb-3">Real-time Tracking</h3>
              <p className="text-gray-600">Accurate punch in/out with timestamps and precise location recording for accountability</p>
            </div>

            <div className="card-hover">
              <div className="p-4 bg-gradient-to-br from-green-100 to-green-50 rounded-xl mb-4 inline-block">
                <FiUsers className="text-green-600 w-8 h-8" />
              </div>
              <h3 className="heading-3 mb-3">Employee Management</h3>
              <p className="text-gray-600">Easily manage employees, departments, roles, and access permissions all in one place</p>
            </div>

            <div className="card-hover">
              <div className="p-4 bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl mb-4 inline-block">
                <FiTrendingUp className="text-purple-600 w-8 h-8" />
              </div>
              <h3 className="heading-3 mb-3">Analytics & Reports</h3>
              <p className="text-gray-600">Detailed attendance reports, statistics, and insights with visual dashboards</p>
            </div>

            <div className="card-hover">
              <div className="p-4 bg-gradient-to-br from-pink-100 to-pink-50 rounded-xl mb-4 inline-block">
                <FiSmartphone className="text-pink-600 w-8 h-8" />
              </div>
              <h3 className="heading-3 mb-3">PWA App</h3>
              <p className="text-gray-600">Works offline and installs on any device for seamless mobile attendance tracking</p>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-20 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center max-w-2xl mx-auto mb-16 animate-slide-in-up">
            <h2 className="heading-2 mb-4">💡 Why Choose Grasshoppers?</h2>
            <p className="text-lg text-gray-600">Built for modern teams that value efficiency and transparency</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-in-up">
            {[
              { icon: '✓', title: 'Simple & Intuitive', desc: 'Beautiful interface that anyone can use without training' },
              { icon: '📱', title: 'Offline Support', desc: 'Works perfectly with limited connectivity using PWA technology' },
              { icon: '🔔', title: 'Real-time Notifications', desc: 'Admins get instant alerts when employees punch in/out' },
              { icon: '📧', title: 'Email Alerts', desc: 'Automatic email notifications for punch events' },
              { icon: '📍', title: 'Location Tracking', desc: 'Accurate geolocation enabled attendance records' },
              { icon: '📲', title: 'Mobile Friendly', desc: 'Fully responsive design works on phones and tablets' },
              { icon: '🔒', title: 'Secure & Private', desc: 'Enterprise-grade security with JWT authentication' },
              { icon: '📅', title: 'Holiday Management', desc: 'Built-in holiday calendar and time-off management' },
            ].map((benefit, idx) => (
              <div key={idx} className="card-hover group">
                <div className="flex items-start gap-4">
                  <div className="text-3xl flex-shrink-0 group-hover:scale-125 transition-transform">
                    {benefit.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg text-gray-900 mb-2">{benefit.title}</h4>
                    <p className="text-gray-600">{benefit.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>

        <div className="container mx-auto px-4 text-center relative z-10 animate-slide-in-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Transform Your Attendance?</h2>
          <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">Join hundreds of companies using Grasshoppers for efficient attendance management</p>

          {!isAuthenticated && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup" className="btn-secondary btn-lg inline-flex items-center gap-2">
                Get Started Free <FiArrowRight />
              </Link>
              <Link href="/login" className="btn-lg px-8 py-4 rounded-2xl bg-white/20 hover:bg-white/30 border-2 border-white transition-all">
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Footer Section */}
      <div className="py-12 bg-gray-900 text-gray-300">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-4">🦗 Grasshoppers Attendance System</p>
          <p className="text-sm opacity-75">Modern attendance tracking for modern teams | © 2026</p>
        </div>
      </div>
    </>
  );
}
