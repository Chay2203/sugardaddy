'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import WalletVerification from '@/components/WalletVerification';
import RegisteredList from '@/components/RegisteredList';

const ReactConfetti = dynamic(() => import('react-confetti'), {
  ssr: false
});

export default function Home() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });
  const [showVerification, setShowVerification] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    if (typeof window !== 'undefined') {
      handleResize();
      window.addEventListener('resize', handleResize);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-white relative overflow-x-hidden">
      <ReactConfetti
        width={windowSize.width}
        height={windowSize.height}
        numberOfPieces={50}
        recycle={true}
        run={true}
        gravity={0.1}
        wind={0.01}
        opacity={0.7}
        colors={['#FFB84C', '#1B365D', '#FFA726', '#FFD700']}
      />
      <main className="relative max-w-6xl mx-auto px-4 py-8 sm:py-12 min-h-screen flex flex-col items-center justify-center">
        {!showVerification ? (
          <div className="flex flex-col items-center justify-center space-y-6 sm:space-y-8">
            <div className="text-center">
              <button className="bg-[#FFA726] text-[#1B365D] text-lg sm:text-xl font-poppins font-medium px-6 sm:px-8 py-2 sm:py-3 rounded-full transition-all transform rotate-[-5deg] hover:scale-105 hover:rotate-[-10deg] italic tracking-tighter mb-4">
                are you a?
              </button>
              <h1 className="text-[48px] sm:text-[80px] md:text-[120px] font-serif text-[#1B365D] leading-none italic mt-4">
                Sugar Daddy
              </h1>
            </div>
            <button
              onClick={() => setShowVerification(true)}
              className="bg-[#1B365D] hover:bg-[#1B365D]/90 text-[#FFB84C] text-lg sm:text-xl font-poppins font-medium px-8 sm:px-10 py-3 sm:py-4 rounded-full transition-all transform italic tracking-tighter"
            >
              Join the Exclusive Waitlist
            </button>
            <RegisteredList />
          </div>
        ) : (
          <div className="w-full max-w-2xl mx-auto">
            <WalletVerification />
            <RegisteredList />
          </div>
        )}
        
        <div className="absolute bottom-4 left-0 right-0 text-center">
          <p className="font-poppins text-[#1B365D]/70 text-xs sm:text-sm tracking-wider uppercase">
            Built on <span className="font-semibold">Solana</span>
          </p>
        </div>
      </main>
    </div>
  );
}
