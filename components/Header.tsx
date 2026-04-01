'use client';

import React from 'react';
import { useAuth } from '@/context/auth';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { useState } from 'react';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          🦗 Grasshoppers
        </Link>

        {user && (
          <>
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/dashboard"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Dashboard
              </Link>
              {user.role === 'admin' && (
                <>
                  <Link
                    href="/admin"
                    className="text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    Admin Panel
                  </Link>
                  <Link
                    href="/holidays"
                    className="text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    Holidays
                  </Link>
                </>
              )}
              <div className="border-l border-gray-300 pl-6 flex items-center gap-4">
                <div className="text-sm">
                  <p className="font-semibold text-gray-900">{user.name}</p>
                  <p className="text-gray-600 capitalize">{user.role}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  title="Logout"
                >
                  <FiLogOut size={20} />
                </button>
              </div>
            </nav>

            {/* Mobile Menu */}
            <div className="md:hidden flex items-center gap-4">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
            </div>

            {isMenuOpen && (
              <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 md:hidden">
                <nav className="flex flex-col p-4 gap-4">
                  <Link
                    href="/dashboard"
                    className="text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    Dashboard
                  </Link>
                  {user.role === 'admin' && (
                    <>
                      <Link
                        href="/admin"
                        className="text-gray-700 hover:text-blue-600 transition-colors"
                      >
                        Admin Panel
                      </Link>
                      <Link
                        href="/holidays"
                        className="text-gray-700 hover:text-blue-600 transition-colors"
                      >
                        Holidays
                      </Link>
                    </>
                  )}
                  <button
                    onClick={handleLogout}
                    className="text-left text-red-600 hover:text-red-700 transition-colors"
                  >
                    Logout
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </header>
  );
};
