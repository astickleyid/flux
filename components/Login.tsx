import React from 'react';
import { useAuth } from '../hooks/useAuth';

export const Login: React.FC = () => {
  const { signInWithGoogle, loading, error } = useAuth();

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error('Sign in error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-8">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Logo */}
        <div className="space-y-2">
          <h1 className="text-6xl font-serif text-stone-900">Flux</h1>
          <p className="text-stone-500 text-lg">The Behavioral Architect</p>
        </div>

        {/* Manifesto Quote */}
        <div className="py-8">
          <p className="text-stone-600 italic font-serif text-xl leading-relaxed">
            "Chaos precedes order. Flux is the architect."
          </p>
        </div>

        {/* Sign In Button */}
        <div className="space-y-4">
          <button
            onClick={handleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-white border-2 border-stone-200 text-stone-800 text-lg font-medium rounded-full hover:border-stone-900 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {loading ? 'Signing in...' : 'Continue with Google'}
          </button>

          {error && (
            <p className="text-red-600 text-sm">{error.message}</p>
          )}
        </div>

        {/* Features */}
        <div className="pt-8 space-y-3 text-left">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🧠</span>
            <div>
              <h3 className="font-medium text-stone-800">AI-Powered Planning</h3>
              <p className="text-sm text-stone-500">Strategic task organization with Gemini AI</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚡</span>
            <div>
              <h3 className="font-medium text-stone-800">Flow Mode</h3>
              <p className="text-sm text-stone-500">Distraction-free execution environment</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">🔄</span>
            <div>
              <h3 className="font-medium text-stone-800">Real-time Sync</h3>
              <p className="text-sm text-stone-500">Access your tasks across all devices</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
