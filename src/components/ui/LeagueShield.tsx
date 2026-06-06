'use client';

import { motion } from 'framer-motion';
import type { League } from '@/types';

interface LeagueShieldProps {
  league: League;
  size?: number;
  animate?: boolean;
}

const LEAGUE_CONFIG: Record<League, { primary: string; secondary: string; accent: string; label: string; icon: string }> = {
  BRONZE: {
    primary: '#cd7f32',
    secondary: '#8b5a2b',
    accent: '#a0522d',
    label: 'Bronze',
    icon: '🛡️',
  },
  SILVER: {
    primary: '#c0c0c0',
    secondary: '#808080',
    accent: '#a0a0a0',
    label: 'Silver',
    icon: '⚔️',
  },
  GOLD: {
    primary: '#ffd700',
    secondary: '#b8860b',
    accent: '#daa520',
    label: 'Gold',
    icon: '🌟',
  },
  PLATINUM: {
    primary: '#e5e4e2',
    secondary: '#6b8e9e',
    accent: '#87ceeb',
    label: 'Platinum',
    icon: '💎',
  },
  DIAMOND: {
    primary: '#00ffff',
    secondary: '#008b8b',
    accent: '#00ced1',
    label: 'Diamond',
    icon: '🔷',
  },
  MASTER: {
    primary: '#a855f7',
    secondary: '#6b21a8',
    accent: '#7c3aed',
    label: 'Master',
    icon: '👑',
  },
  GRANDMASTER: {
    primary: '#ef4444',
    secondary: '#7f1d1d',
    accent: '#dc2626',
    label: 'Grandmaster',
    icon: '⚡',
  },
};

function ShieldSvg({ league, size }: { league: League; size: number }) {
  const cfg = LEAGUE_CONFIG[league];
  const pad = size * 0.05;
  const viewBox = `0 0 ${size} ${size}`;
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.38;

  return (
    <svg width={size} height={size} viewBox={viewBox} fill="none">
      <defs>
        <radialGradient id={`shield-grad-${league}`} cx="40%" cy="35%">
          <stop offset="0%" stopColor={cfg.primary} stopOpacity="0.4" />
          <stop offset="100%" stopColor={cfg.secondary} stopOpacity="0.1" />
        </radialGradient>
        <linearGradient id={`shield-edge-${league}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={cfg.primary} />
          <stop offset="50%" stopColor={cfg.accent} />
          <stop offset="100%" stopColor={cfg.secondary} />
        </linearGradient>
        <filter id={`glow-${league}`}>
          <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={cfg.primary} floodOpacity="0.5" />
        </filter>
      </defs>
      {/* Outer shield shape */}
      <path
        d={`M ${cx} ${pad} L ${size - pad} ${cy * 0.4} Q ${size - pad} ${cy * 1.4} ${cx} ${size - pad} Q ${pad} ${cy * 1.4} ${pad} ${cy * 0.4} Z`}
        fill={`url(#shield-grad-${league})`}
        stroke={`url(#shield-edge-${league})`}
        strokeWidth="2"
        filter={`url(#glow-${league})`}
      />
      {/* Inner border */}
      <path
        d={`M ${cx} ${pad * 3} L ${size - pad * 3} ${cy * 0.45} Q ${size - pad * 3} ${cy * 1.3} ${cx} ${size - pad * 3} Q ${pad * 3} ${cy * 1.3} ${pad * 3} ${cy * 0.45} Z`}
        fill="none"
        stroke={cfg.accent}
        strokeWidth="0.8"
        strokeOpacity="0.4"
      />
      {/* Center star/diamond */}
      <polygon
        points={`${cx},${cy - r * 0.5} ${cx + r * 0.3},${cy} ${cx},${cy + r * 0.5} ${cx - r * 0.3},${cy}`}
        fill={cfg.primary}
        fillOpacity="0.6"
        stroke={cfg.accent}
        strokeWidth="0.8"
      />
    </svg>
  );
}

export function LeagueShield({ league, size = 48, animate = true }: LeagueShieldProps) {
  const cfg = LEAGUE_CONFIG[league];

  if (!animate) {
    return <ShieldSvg league={league} size={size} />;
  }

  return (
    <motion.div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
      animate={{ rotate: [0, 5, -5, 3, -3, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* Swirling glow ring */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: `conic-gradient(from 0deg, transparent, ${cfg.primary}, transparent, ${cfg.accent}, transparent)`,
          filter: 'blur(8px)',
          opacity: 0.6,
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      />
      {/* Second swirl - counter rotating */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: `conic-gradient(from 90deg, transparent, ${cfg.secondary}, transparent, ${cfg.primary}, transparent)`,
          filter: 'blur(6px)',
          opacity: 0.4,
        }}
        animate={{ rotate: -360 }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
      />
      {/* Shield */}
      <motion.div
        className="relative z-10"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ShieldSvg league={league} size={size} />
      </motion.div>
    </motion.div>
  );
}

export function getLeagueLabel(league: League): string {
  return LEAGUE_CONFIG[league].label;
}
