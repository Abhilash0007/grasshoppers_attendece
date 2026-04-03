import React from 'react';
import { useAuth } from '@/context/auth';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiArrowRight, FiClock, FiUsers, FiTrendingUp, FiSmartphone } from 'react-icons/fi';

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (isAuthenticated) router.push('/dashboard');
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center px-4">
      
      {/* Main Container */}
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-10 items-center">

        {/* LEFT SIDE (Hero) */}
        <div className="space-y-6 text-center md:text-left">
          <div className="inline-block px-4 py-1 bg-white/10 rounded-full text-sm">
            🦗 Smart Attendance System
          </div>

          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Manage Attendance <br /> Like a Pro
          </h1>

          <p className="text-gray-300 text-lg">
            Punch in/out, track employees, and monitor reports in real-time with a modern mobile-first experience.
          </p>

          {!isAuthenticated && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link href="/login" className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2">
                Login <FiArrowRight />
              </Link>
              <Link href="/signup" className="px-6 py-3 rounded-xl border border-white/20 hover:bg-white/10">
                Create Account
              </Link>
            </div>
          )}
        </div>

        {/* RIGHT SIDE (App Preview Card) */}
        <div className="flex justify-center">
          <div className="relative w-[320px] h-[600px] bg-white text-black rounded-[2.5rem] shadow-2xl overflow-hidden border">

            

            {/* App Content */}
            <div className="p-4 space-y-4">

              {/* Punch Button */}
              <button className="w-full bg-green-500 text-white py-3 rounded-xl font-semibold">
                Punch In
              </button>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 p-3 rounded-xl">
                  <p className="text-xs text-gray-500">Today</p>
                  <h3 className="font-bold">Present</h3>
                </div>
                <div className="bg-green-50 p-3 rounded-xl">
                  <p className="text-xs text-gray-500">Status</p>
                  <h3 className="font-bold">On Time</h3>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-3">
                {[
                  { icon: FiClock, text: 'Real-time Tracking' },
                  { icon: FiUsers, text: 'Manage Employees' },
                  { icon: FiTrendingUp, text: 'View Reports' },
                  { icon: FiSmartphone, text: 'Mobile Friendly' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl">
                    <item.icon className="text-blue-600" />
                    <span className="text-sm">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Nav */}
            <div className="absolute bottom-0 left-0 right-0 border-t bg-white flex justify-around py-2 text-xs">
              <div>Home</div>
              <div>Team</div>
              <div>Stats</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
