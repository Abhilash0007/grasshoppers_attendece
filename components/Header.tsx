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

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-white/70 border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="text-lg font-semibold tracking-tight text-gray-900">
          Grasshoppers
        </Link>

        {user && (
          <>
            {/* Desktop Nav */}
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
                  <Link href="/admin/punch-history" className="text-sm text-gray-600 hover:text-black">
                    📋 Punch History
                  </Link>
                  <Link href="/admin/announcements" className="text-sm text-gray-600 hover:text-black">
                    📝 Manage Updates
                  </Link>
                </>
              )}

              {/* User Info */}
              <div className="flex items-center gap-3 ml-4 pl-4 border-l">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                </div>

                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center text-sm font-semibold">
                  {user.name?.charAt(0)}
                </div>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg hover:bg-gray-100 transition"
                >
                  <FiLogOut size={18} />
                </button>
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {isMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </>
        )}
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && user && (
        <div className="md:hidden bg-white border-t shadow-sm">
          <div className="p-4 space-y-4">

            <Link
              href="/dashboard"
              className="block text-gray-700"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>

            <Link
              href="/announcements"
              className="block text-gray-700"
              onClick={() => setIsMenuOpen(false)}
            >
              📢 Updates
            </Link>
            <Link
              href="/holidays"
              className="block text-gray-700"
              onClick={() => setIsMenuOpen(false)}
            >
              Holidays
            </Link>

            {user.role === 'admin' && (
              <>
                <Link
                  href="/admin"
                  className="block text-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin
                </Link>
                <Link
                  href="/admin/punch-history"
                  className="block text-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  📋 Punch History
                </Link>
                <Link
                  href="/admin/announcements"
                  className="block text-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  📝 Manage Updates
                </Link>
              </>
            )}

            <div className="border-t pt-3">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user.role}</p>
            </div>

            <button
              onClick={handleLogout}
              className="text-red-600 text-sm"
            >
              Logout
            </button>

          </div>
        </div>
      )}
    </header>
  );
};