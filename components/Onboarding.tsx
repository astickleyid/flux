import React, { useState } from 'react';
import { UserProfile } from '../types';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');

  const handleNext = () => {
    if (step === 1 && name) setStep(2);
    else if (step === 2 && email) setStep(3);
    else if (step === 3) {
      onComplete({ name, email, bio });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleNext();
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-8 text-stone-800 transition-all">
      <div className="max-w-xl w-full">
        
        {/* Progress Dots */}
        <div className="flex gap-2 mb-12 justify-center">
           {[1, 2, 3].map(i => (
             <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${step >= i ? 'w-8 bg-stone-800' : 'w-2 bg-stone-200'}`}></div>
           ))}
        </div>

        <div className="min-h-[300px] flex flex-col justify-between animate-fade-in-up">
          
          {/* Step 1: Name */}
          {step === 1 && (
            <div className="space-y-8">
               <h1 className="text-3xl md:text-5xl font-serif text-center leading-tight">
                 What should we call you?
               </h1>
               <input 
                 autoFocus
                 type="text" 
                 value={name}
                 onChange={e => setName(e.target.value)}
                 onKeyDown={handleKeyDown}
                 placeholder="Enter your name"
                 className="w-full bg-transparent border-b-2 border-stone-200 text-center text-3xl p-4 focus:outline-none focus:border-stone-800 transition-colors placeholder:text-stone-300 font-light"
               />
            </div>
          )}

          {/* Step 2: Email */}
          {step === 2 && (
            <div className="space-y-8 animate-fade-in">
               <h1 className="text-3xl md:text-5xl font-serif text-center leading-tight">
                 Where is your digital HQ?
               </h1>
               <p className="text-center text-stone-500">We need this to simulate email & calendar actions.</p>
               <input 
                 autoFocus
                 type="email" 
                 value={email}
                 onChange={e => setEmail(e.target.value)}
                 onKeyDown={handleKeyDown}
                 placeholder="name@example.com"
                 className="w-full bg-transparent border-b-2 border-stone-200 text-center text-3xl p-4 focus:outline-none focus:border-stone-800 transition-colors placeholder:text-stone-300 font-light"
               />
            </div>
          )}

           {/* Step 3: Context */}
           {step === 3 && (
            <div className="space-y-8 animate-fade-in">
               <h1 className="text-3xl md:text-5xl font-serif text-center leading-tight">
                 Any critical context?
               </h1>
               <p className="text-center text-stone-500">E.g., "I'm a chemist banned from labs" or "I code vibes."</p>
               <input 
                 autoFocus
                 type="text" 
                 value={bio}
                 onChange={e => setBio(e.target.value)}
                 onKeyDown={handleKeyDown}
                 placeholder="Your unique constraint..."
                 className="w-full bg-transparent border-b-2 border-stone-200 text-center text-3xl p-4 focus:outline-none focus:border-stone-800 transition-colors placeholder:text-stone-300 font-light"
               />
            </div>
          )}
          
          <div className="mt-12 flex justify-center">
             <button 
               onClick={handleNext}
               disabled={(step === 1 && !name) || (step === 2 && !email)}
               className="px-10 py-4 bg-stone-900 text-white rounded-full text-lg hover:scale-105 transition-all disabled:opacity-20 disabled:scale-100"
             >
               {step === 3 ? 'Initialize Ecosystem' : 'Next'}
             </button>
          </div>
        </div>

      </div>
    </div>
  );
};
