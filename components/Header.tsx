'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/auth';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiLogOut, FiMenu, FiX } from 'react-icons/fi';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  React.useEffect(() => {
    setIsMenuOpen(false);
  }, [user]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <>
      {/* HEADER */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">

          {/* LOGO */}
          <Link href="/" className="text-lg font-semibold tracking-tight text-gray-900">
            Grasshoppers
          </Link>

          {user && (
            <>
              {/* DESKTOP NAV */}
              <nav className="hidden md:flex items-center gap-6">
                <Link href="/dashboard" className="text-sm text-gray-600 hover:text-black">
                  Dashboard
                </Link>

                <Link href="/announcements" className="text-sm text-gray-600 hover:text-black">
                  📢 Updates
                </Link>

                <Link href="/holidays" className="text-sm text-gray-600 hover:text-black">
                  Holidays
                </Link>

                {user.role === 'admin' && (
                  <>
                    <Link href="/admin" className="text-sm text-gray-600 hover:text-black">
                      Admin
                    </Link>
                    <Link href="/admin/teams" className="text-sm text-gray-600 hover:text-black">
                      👥 Teams
                    </Link>
                    <Link href="/admin/punch-history" className="text-sm text-gray-600 hover:text-black">
                      📋 Punch History
                    </Link>
                    <Link href="/admin/announcements" className="text-sm text-gray-600 hover:text-black">
                      📝 Manage Updates
                    </Link>
                  </>
                )}

                {/* USER */}
                <div className="flex items-center gap-3 ml-4 pl-4 border-l">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                  </div>

                  <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center text-sm font-semibold">
                    {user.name?.charAt(0)}
                  </div>

                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-lg hover:bg-gray-100 transition"
                  >
                    <FiLogOut size={18} />
                  </button>
                </div>
              </nav>

              {/* MOBILE BUTTON */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition"
              >
                {isMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
              </button>
            </>
          )}
        </div>
      </header>

      {/* MOBILE DRAWER */}
      {user && (
        <>
          {/* BACKDROP */}
          <div
            onClick={() => setIsMenuOpen(false)}
            className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-all duration-300 ${
              isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
            }`}
          />

          {/* DRAWER */}
          <div
            className={`fixed top-0 right-0 h-full w-[85%] max-w-sm z-50 
            bg-white/90 backdrop-blur-2xl shadow-2xl border-l border-white/20
            transform transition-transform duration-300 ease-out
            ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
          >
            <div className="flex flex-col h-full">

              {/* TOP USER */}
              <div className="p-5 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                </div>

                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition"
                >
                  <FiX size={20} />
                </button>
              </div>

              {/* MENU */}
              <div className="flex-1 overflow-y-auto p-5 space-y-3">

                <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 transition">
                  🏠 <span className="font-medium">Dashboard</span>
                </Link>

                <Link href="/announcements" onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 transition">
                  📢 <span className="font-medium">Updates</span>
                </Link>

                <Link href="/holidays" onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 transition">
                  📅 <span className="font-medium">Holidays</span>
                </Link>

                {user.role === 'admin' && (
                  <>
                    <div className="pt-4 pb-2 text-xs text-gray-400 font-semibold">
                      ADMIN
                    </div>

                    <Link href="/admin" onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 transition">
                      ⚙️ <span className="font-medium">Admin Panel</span>
                    </Link>

                    <Link href="/admin/teams" onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 transition">
                      👥 <span className="font-medium">Teams</span>
                    </Link>

                    <Link href="/admin/punch-history" onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 transition">
                      📊 <span className="font-medium">Punch History</span>
                    </Link>

                    <Link href="/admin/announcements" onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 transition">
                      📝 <span className="font-medium">Manage Updates</span>
                    </Link>
                  </>
                )}
              </div>

              {/* LOGOUT */}
              <div className="p-5 border-t border-gray-200">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl 
                  bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold
                  shadow-lg shadow-red-500/30 active:scale-95 transition"
                >
                  <FiLogOut />
                  Logout
                </button>
              </div>

            </div>
          </div>
        </>
      )}
    </>
  );
};