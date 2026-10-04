"use client";

import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import TransfersClient from './TransfersClient';

export default function TransfersPage() {
  return (
    <>
      <Header />
      <TransfersClient />
      <Footer />
    </>
  );
}
