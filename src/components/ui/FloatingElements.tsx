'use client';

import { useEffect, useState, useRef } from 'react';

interface Orb {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
  driftX: number;
  driftY: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
  shape: 'circle' | 'diamond' | 'star';
  driftX: number;
  driftY: number;
  rotation: number;
  rotateSpeed: number;
}

const ORB_COLORS = [
  'rgba(59, 130, 246, 0.12)',
  'rgba(6, 182, 212, 0.10)',
  'rgba(139, 92, 246, 0.10)',
  'rgba(16, 185, 129, 0.08)',
  'rgba(245, 158, 11, 0.06)',
];

const PARTICLE_COLORS = [
  'bg-accent-blue/20',
  'bg-accent-cyan/20',
  'bg-accent-purple/20',
  'bg-accent-green/20',
  'bg-accent-orange/20',
  'bg-white/10',
  'bg-accent-blue/30',
  'bg-accent-cyan/15',
];

function FloatingOrb({ orb, mouseX, mouseY }: { orb: Orb; mouseX: number; mouseY: number }) {
  const parallaxX = (mouseX - 50) * 0.02;
  const parallaxY = (mouseY - 50) * 0.02;

  return (
    <div
      className="absolute rounded-full"
      style={{
        left: `${orb.x}%`,
        top: `${orb.y}%`,
        width: orb.size,
        height: orb.size,
        background: `radial-gradient(circle at 30% 30%, ${orb.color}, transparent)`,
        transform: `translate(${parallaxX}px, ${parallaxY}px)`,
        animation: `orb-drift-${orb.id} ${orb.duration}s ease-in-out ${orb.delay}s infinite alternate`,
        willChange: 'transform',
      }}
    />
  );
}

export function FloatingElements() {
  const [orbs, setOrbs] = useState<Orb[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;

    const generatedOrbs: Orb[] = Array.from({ length: 5 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 300 + 200,
      color: ORB_COLORS[i % ORB_COLORS.length],
      duration: Math.random() * 10 + 15,
      delay: Math.random() * 5,
      driftX: (Math.random() - 0.5) * 15,
      driftY: (Math.random() - 0.5) * 15,
    }));

    const generatedParticles: Particle[] = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 10,
      color: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
      shape: i % 6 === 0 ? 'diamond' : i % 10 === 0 ? 'star' : 'circle',
      driftX: (Math.random() - 0.5) * 10,
      driftY: -Math.random() * 5 - 2,
      rotation: Math.random() * 360,
      rotateSpeed: (Math.random() - 0.5) * 2,
    }));

    setOrbs(generatedOrbs);
    setParticles(generatedParticles);

    const handleMouse = (e: MouseEvent) => {
      if (!mounted.current) return;
      setMousePos({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouse);
    return () => {
      mounted.current = false;
      window.removeEventListener('mousemove', handleMouse);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Base gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-bg-primary via-bg-primary/95 to-bg-primary" />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Animated orbs */}
      {orbs.map((orb) => (
        <FloatingOrb key={orb.id} orb={orb} mouseX={mousePos.x} mouseY={mousePos.y} />
      ))}

      {/* Particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className={`absolute ${p.color}`}
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.shape === 'diamond' ? p.size * 2 : p.size,
            height: p.size,
            borderRadius: p.shape === 'circle' ? '50%' : p.shape === 'diamond' ? '2px' : '50% 50% 0 50%',
            transform: `rotate(${p.rotation}deg)`,
            animation: `particle-float-${p.id % 3} ${p.duration}s ease-in-out ${p.delay}s infinite alternate`,
            willChange: 'transform',
          }}
        />
      ))}

      {/* Scan line overlay */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
        }}
      />
    </div>
  );
}
