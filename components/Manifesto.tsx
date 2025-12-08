import React from 'react';
import { AppState } from '../types';

interface ManifestoProps {
  onComplete: () => void;
}

const Section: React.FC<{ title: string; subtitle: string; children: React.ReactNode; dark?: boolean }> = ({ title, subtitle, children, dark }) => (
  <div className={`min-h-screen flex flex-col justify-center items-center p-8 md:p-16 transition-colors duration-700 ${dark ? 'bg-stone-900 text-stone-100' : 'bg-[#FDFBF7] text-stone-800'}`}>
    <div className="max-w-3xl w-full space-y-8">
      <div className="space-y-2">
        <h2 className={`text-sm uppercase tracking-[0.2em] font-medium ${dark ? 'text-stone-400' : 'text-stone-500'}`}>{subtitle}</h2>
        <h1 className="text-4xl md:text-6xl font-serif leading-tight">{title}</h1>
      </div>
      <div className={`text-lg md:text-xl font-light leading-relaxed opacity-90 ${dark ? 'text-stone-300' : 'text-stone-700'}`}>
        {children}
      </div>
    </div>
  </div>
);

export const Manifesto: React.FC<ManifestoProps> = ({ onComplete }) => {
  return (
    <div className="snap-y snap-mandatory h-screen overflow-y-scroll scroll-smooth">
      {/* Intro */}
      <div className="snap-start">
        <Section title="Flux" subtitle="The Behavioral Architect" dark={false}>
          <p>
            You asked for a tool. We built an ecosystem.
          </p>
          <p className="mt-4">
            Flux is not just a to-do list. It is a psychological intervention designed to bridge the "Execution Gap"—the chasm between knowing what to do and actually doing it.
          </p>
          <div className="mt-12 animate-bounce opacity-50">
            Scroll to explore the philosophy ↓
          </div>
        </Section>
      </div>

      {/* Phase 1: Psychology */}
      <div className="snap-start">
        <Section title="The Resistance Profile" subtitle="Phase 1: Deep Analysis" dark={true}>
          <p>
            Why do we fail? It is not laziness. It is <strong>Decision Fatigue</strong>, <strong>Time Blindness</strong>, and <strong>Analysis Paralysis</strong>.
          </p>
          <p className="mt-4">
            Flux understands your brain. For the <strong>Neurotic</strong>, we offer reassurance and calm. For the <strong>Conscientious</strong>, we offer raw efficiency.
          </p>
          <p className="mt-4">
            Our "Invisible Hand" mechanic acts as a benevolent guide, auto-rescheduling missed tasks without shame, preserving your dopamine loops.
          </p>
        </Section>
      </div>

      {/* Phase 2: Design */}
      <div className="snap-start">
        <Section title="Calm Technology" subtitle="Phase 2: Design System" dark={false}>
          <p>
            The interface is "God-tier" aesthetic. We blend <strong>Neumorphism</strong> with <strong>Swiss Style typography</strong>.
          </p>
          <p className="mt-4">
            Information density adapts to your stress level. In the morning: a broad view. During deep work: a singular focus. This is the <strong>Dynamic Dashboard</strong>.
          </p>
          <p className="mt-4">
             We reduce the "Time to Flow State" to zero.
          </p>
        </Section>
      </div>

      {/* Call to Action */}
      <div className="snap-start bg-stone-900 flex items-center justify-center h-screen p-8">
        <div className="text-center space-y-8">
          <h1 className="text-5xl md:text-7xl font-serif text-white">Ready to execute?</h1>
          <p className="text-stone-400 max-w-lg mx-auto">
            Experience the Phase 3 MVP. The Brain is active. The Design is live.
          </p>
          <button 
            onClick={onComplete}
            className="px-8 py-4 bg-white text-black text-lg font-medium rounded-full hover:scale-105 transition-transform duration-300"
          >
            Enter Flux Ecosystem
          </button>
        </div>
      </div>
    </div>
  );
};