'use client';

import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
  shape: 'circle' | 'diamond';
}

const COLORS = ['bg-accent-blue/10', 'bg-accent-cyan/10', 'bg-accent-purple/10', 'bg-accent-green/10'];

export function FloatingElements() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const generated: Particle[] = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 8,
      color: COLORS[i % COLORS.length],
      shape: i % 5 === 0 ? 'diamond' : 'circle',
    }));
    setParticles(generated);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Top gradient accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-accent-blue/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent-purple/5 blur-[120px] rounded-full" />

      {particles.map((p) => (
        <div
          key={p.id}
          className={`absolute ${p.color} ${p.shape === 'diamond' ? 'rotate-45' : ''}`}
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size * 1.5,
            height: p.shape === 'diamond' ? p.size * 1.5 : p.size,
            borderRadius: p.shape === 'diamond' ? '2px' : '50%',
            animation: `float ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
