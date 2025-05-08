'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const ReactConfetti = dynamic(() => import('react-confetti'), {
  ssr: false
});

export default function Home() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });

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
    <div className="min-h-screen bg-white relative overflow-hidden "> 
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
      <main className="relative z-10 max-w-6xl mx-auto px-4 py-8 sm:py-20 flex flex-col items-center justify-center min-h-screen pb-25">
        <div className="relative mb-2 w-full sm:w-auto text-center">
          <button 
            className="bg-[#FFA726] hover:bg-[#FFA726] text-[#1B365D] text-lg sm:text-xl font-poppins font-medium px-6 sm:px-8 py-2 sm:py-3 rounded-full transition-all transform rotate-[-5deg] hover:scale-105 hover:rotate-[-10deg] italic tracking-tighter w-[50%] mb-4 sm:mb-0 sm:w-auto"
          >
            wanna be a?
          </button>
        </div>
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-[48px] sm:text-[80px] md:text-[120px] font-serif text-[#1B365D] leading-none italic">
            Sugar Daddy
          </h1>
        </div>
        
        <div className="fixed bottom-50 sm:bottom-8 text-center w-full sm:w-auto px-4">
          <p className="font-poppins text-[#1B365D]/70 text-xs sm:text-sm tracking-wider uppercase mb-1">
            Built on <span className="font-semibold">Solana</span>
          </p>
          <p className="font-poppins text-[#1B365D]/60 text-[10px] sm:text-xs tracking-widest">
            Coming Soon
          </p>
        </div>
      </main>
    </div>
  );
}
