'use client'

import { useEffect } from 'react'
import Header from '@/components/layout/Header'
// import { redirect } from 'next/navigation';

export default function Home() {
  useEffect(() => {
    // redirect('/dashboard');
  }, [])




  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <Header />
      <div>홈 인데 사용안해</div>
    </main>
  )
} 