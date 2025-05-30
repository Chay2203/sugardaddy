import { useState } from 'react';
import { z } from 'zod';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const emailSchema = z.string().email();

interface VerificationState {
  step: 'initial' | 'email' | 'success';
  isLoading: boolean;
  error: string | null;
  balance: number | null;
  attempts: number;
}

export default function WalletVerification() {
  const { publicKey, connected } = useWallet();
  const [email, setEmail] = useState('');
  const [state, setState] = useState<VerificationState>({
    step: 'initial',
    isLoading: false,
    error: null,
    balance: null,
    attempts: 0,
  });

  const validateInputs = () => {
    try {
      if (state.step === 'email') {
        emailSchema.parse(email);
      }
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setState(prev => ({
          ...prev,
          error: 'Invalid email format',
          isLoading: false,
        }));
      }
      return false;
    }
  };

  const verifyWallet = async () => {
    if (!publicKey) return;
    
    if (state.attempts >= 5) {
      setState(prev => ({
        ...prev,
        error: 'Too many attempts. Please try again later.',
        isLoading: false,
      }));
      return;
    }

    setState(prev => ({ 
      ...prev, 
      isLoading: true, 
      error: null,
      attempts: prev.attempts + 1 
    }));

    try {
      const response = await fetch('/api/get-balance', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        credentials: 'same-origin',
        body: JSON.stringify({ 
          address: publicKey.toString(),
          timestamp: Date.now() 
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to verify wallet');
      }

      const data = await response.json();
      const balanceInSOL = data.balance / 1000000000; // Convert lamports to SOL

      if (balanceInSOL >= 250) {
        setState(prev => ({
          ...prev,
          step: 'email',
          balance: balanceInSOL,
          isLoading: false,
        }));
      } else {
        setState(prev => ({
          ...prev,
          error: 'Wallet balance must be above 500 SOL to join the waitlist',
          isLoading: false,
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to verify wallet balance. Please try again.',
        isLoading: false,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateInputs()) {
      return;
    }

    if (state.step === 'initial' && connected) {
      await verifyWallet();
    } else if (state.step === 'email') {
      setState(prev => ({ ...prev, isLoading: true }));
      try {
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          },
          credentials: 'same-origin',
          body: JSON.stringify({
            wallet_address: publicKey?.toString(),
            email: email.trim().toLowerCase(),
            timestamp: Date.now()
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to register');
        }

        setState(prev => ({ ...prev, step: 'success', isLoading: false }));
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Failed to register. Please try again.',
          isLoading: false,
        }));
      }
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mb-6">
      {state.step === 'initial' && (
        <div className="space-y-4">
          <div className="flex justify-center">
            <WalletMultiButton className="!bg-[#1B365D] !text-[#FFB84C] !py-3 !px-6 !rounded-full !font-poppins !transition-all hover:!bg-[#1B365D]/90" />
          </div>
          {connected && (
            <button
              onClick={() => verifyWallet()}
              disabled={state.isLoading || state.attempts >= 5}
              className="w-full bg-[#1B365D] text-[#FFB84C] py-3 rounded-full font-poppins transition-all hover:bg-[#1B365D]/90 disabled:opacity-50"
            >
              {state.isLoading ? 'Verifying...' : 'Verify Balance'}
            </button>
          )}
        </div>
      )}

      {state.step === 'email' && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-[#1B365D] font-poppins text-sm mb-4">
            Verified! Balance: {state.balance?.toFixed(2)} SOL
          </p>
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
              placeholder="Enter your email for exclusive access"
              className="w-full px-4 py-3 rounded-full border border-[#1B365D]/20 focus:outline-none focus:border-[#1B365D] font-poppins text-[#1B365D]"
              required
              maxLength={255}
            />
          </div>
          <button
            type="submit"
            disabled={state.isLoading}
            className="w-full bg-[#1B365D] text-[#FFB84C] py-3 rounded-full font-poppins transition-all hover:bg-[#1B365D]/90 disabled:opacity-50"
          >
            {state.isLoading ? 'Joining...' : 'Join Waitlist'}
          </button>
        </form>
      )}

      {state.step === 'success' && (
        <div className="text-center">
          <h3 className="text-[#1B365D] font-poppins font-medium text-xl mb-2">
            Welcome to the club! 🎉
          </h3>
          <p className="text-[#1B365D]/70 font-poppins text-sm">
            We&apos;ll be in touch with exclusive access details.
          </p>
        </div>
      )}

      {state.error && (
        <p className="mt-4 text-red-500 font-poppins text-sm text-center">
          {state.error}
        </p>
      )}
    </div>
  );
} 