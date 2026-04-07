import React from 'react';
import type { AppProps } from 'next/app';
import { AuthProvider } from '@/context/auth';
import { NotificationProvider } from '@/context/notifications';
import { Header } from '@/components/Header';
import { NotificationCenter } from '@/components/NotificationCenter';
import { Toaster } from 'react-hot-toast';
import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NotificationProvider>
      <AuthProvider>
        <Header />
        <NotificationCenter />
        <main className="container mx-auto px-4 py-8">
          <Component {...pageProps} />
        </main>
        <Toaster position="top-right" />
      </AuthProvider>
    </NotificationProvider>
  );
}
