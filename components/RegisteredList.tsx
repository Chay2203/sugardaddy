import { useEffect, useState } from 'react';

export default function RegisteredList() {
  const [count, setCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        setError(null);
        const response = await fetch('/api/count');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch count');
        }
        const data = await response.json();
        if (typeof data.count !== 'number') {
          throw new Error('Invalid count data received');
        }
        setCount(data.count);
      } catch (error) {
        console.error('Failed to fetch count:', error);
        setError('Failed to load whale count');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCount();

    // Set up polling for real-time updates
    const interval = setInterval(fetchCount, 5000);

    return () => clearInterval(interval);
  }, []);


  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white/30 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-[#1B365D]/10">
        <h2 className="text-[#1B365D] font-poppins font-medium text-xl text-center">
          Verified Whales
        </h2>
        <div className="text-center">
          {isLoading ? (
            <div className="animate-pulse">
              <div className="h-12 bg-[#1B365D]/5 rounded-lg"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 font-poppins text-sm py-4">
              {error}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-[48px] font-serif text-[#1B365D] leading-none">
                {count}
              </div>
              <p className="text-[#1B365D]/70 font-poppins text-sm">
                {count === 1 ? 'Whale Verified' : 'Whales Verified'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 