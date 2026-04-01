import React from 'react';
import type { AppProps } from 'next/app';
import { AuthProvider } from '@/context/auth';
import { Header } from '@/components/Header';
import { Toaster } from 'react-hot-toast';
import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Component {...pageProps} />
      </main>
      <Toaster position="top-right" />
    </AuthProvider>
  );
}
