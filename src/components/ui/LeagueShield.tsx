'use client';

import { motion } from 'framer-motion';
import type { League } from '@/types';

interface LeagueShieldProps {
  league: League;
  size?: number;
  animate?: boolean;
  showLabel?: boolean;
}

interface TierArt {
  primary: string;
  secondary: string;
  accent: string;
  glow: string;
  bgFrom: string;
  bgTo: string;
  label: string;
  number: number;
  path: string;
  ornament: string;
}

const TIERS: Record<League, TierArt> = {
  BRONZE: {
    primary: '#cd7f32',
    secondary: '#a0522d',
    accent: '#8b5a2b',
    glow: 'rgba(205,127,50,0.4)',
    bgFrom: '#1a0f08',
    bgTo: '#2d1a0e',
    label: 'Bronze',
    number: 1,
    path: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
    ornament: 'M8 8l2 2 4-4',
  },
  SILVER: {
    primary: '#c0c0c0',
    secondary: '#a0a0a0',
    accent: '#808080',
    glow: 'rgba(192,192,192,0.4)',
    bgFrom: '#0f1215',
    bgTo: '#1a1f24',
    label: 'Silver',
    number: 2,
    path: 'M4 4h16v16H4zM8 8h8v8H8z',
    ornament: 'M12 8v8M8 12h8',
  },
  GOLD: {
    primary: '#ffd700',
    secondary: '#daa520',
    accent: '#b8860b',
    glow: 'rgba(255,215,0,0.5)',
    bgFrom: '#1a1200',
    bgTo: '#2d2000',
    label: 'Gold',
    number: 3,
    path: 'M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z',
    ornament: 'M12 6v12M6 12h12',
  },
  PLATINUM: {
    primary: '#e5e4e2',
    secondary: '#87ceeb',
    accent: '#6b8e9e',
    glow: 'rgba(135,206,235,0.4)',
    bgFrom: '#0a0f14',
    bgTo: '#141c24',
    label: 'Platinum',
    number: 4,
    path: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
    ornament: 'M6 6l12 12M18 6L6 18',
  },
  DIAMOND: {
    primary: '#00ffff',
    secondary: '#00ced1',
    accent: '#008b8b',
    glow: 'rgba(0,255,255,0.4)',
    bgFrom: '#000a0f',
    bgTo: '#001419',
    label: 'Diamond',
    number: 5,
    path: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
    ornament: 'M12 5v14M5 12h14',
  },
  MASTER: {
    primary: '#a855f7',
    secondary: '#7c3aed',
    accent: '#6b21a8',
    glow: 'rgba(168,85,247,0.4)',
    bgFrom: '#0f0518',
    bgTo: '#1a0a2e',
    label: 'Master',
    number: 6,
    path: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM12 6v6l4 2',
    ornament: 'M9 12l2 2 4-4',
  },
  GRANDMASTER: {
    primary: '#ef4444',
    secondary: '#dc2626',
    accent: '#7f1d1d',
    glow: 'rgba(239,68,68,0.5)',
    bgFrom: '#1a0505',
    bgTo: '#2e0a0a',
    label: 'Grandmaster',
    number: 7,
    path: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
    ornament: 'M8 12h8M12 8v8',
  },
};

const BG_PARTICLES = 8;

function LeagueBadgeSvg({ league, size }: { league: League; size: number }) {
  const t = TIERS[league];
  const pad = size * 0.08;
  const cx = size / 2;
  const cy = size / 2;
  const innerR = size * 0.32;
  const outerR = size * 0.42;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      <defs>
        <radialGradient id={`bg-${league}`} cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor={t.bgFrom} />
          <stop offset="100%" stopColor={t.bgTo} />
        </radialGradient>
        <radialGradient id={`core-${league}`} cx="40%" cy="35%">
          <stop offset="0%" stopColor={t.primary} stopOpacity="0.3" />
          <stop offset="60%" stopColor={t.accent} stopOpacity="0.1" />
          <stop offset="100%" stopColor={t.bgFrom} stopOpacity="0.95" />
        </radialGradient>
        <linearGradient id={`rim-${league}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={t.primary} />
          <stop offset="30%" stopColor={t.secondary} />
          <stop offset="70%" stopColor={t.accent} />
          <stop offset="100%" stopColor={t.primary} />
        </linearGradient>
        <linearGradient id={`rim-shade-${league}`} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor={t.primary} stopOpacity="0.3" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
        <filter id={`glow-${league}`}>
          <feDropShadow dx="0" dy="0" stdDeviation={size * 0.06} floodColor={t.primary} floodOpacity="0.6" />
        </filter>
        <filter id={`soft-glow-${league}`}>
          <feDropShadow dx="0" dy="0" stdDeviation={size * 0.03} floodColor={t.primary} floodOpacity="0.3" />
        </filter>
        <clipPath id={`clip-${league}`}>
          <path d={generateShieldPath(cx, cy, outerR, pad)} />
        </clipPath>
      </defs>

      {/* Background circle */}
      <circle cx={cx} cy={cy} r={size / 2 - pad * 0.5} fill="url(#bg-bg)" fillOpacity="0.3" />

      {/* Floating orbital particles */}
      {Array.from({ length: BG_PARTICLES }).map((_, i) => {
        const angle = (i / BG_PARTICLES) * Math.PI * 2;
        const dist = outerR * 1.15;
        const px = cx + Math.cos(angle) * dist;
        const py = cy + Math.sin(angle) * dist;
        const r = size * 0.015 + Math.random() * size * 0.01;
        return (
          <circle key={i} cx={px} cy={py} r={r} fill={t.primary} fillOpacity={0.15 + Math.random() * 0.15} />
        );
      })}

      {/* Outer ring glow */}
      <path
        d={generateShieldPath(cx, cy, outerR + size * 0.02, pad - size * 0.02)}
        fill="none"
        stroke={t.glow}
        strokeWidth={size * 0.04}
        strokeOpacity="0.3"
        filter={`url(#glow-${league})`}
      />

      {/* Shield background with gradient */}
      <path d={generateShieldPath(cx, cy, outerR, pad)} fill="url(#core-bg)" stroke="none" />
      <path d={generateShieldPath(cx, cy, outerR, pad)} fill="url(#core)" stroke="none" />

      {/* Shield rim */}
      <path
        d={generateShieldPath(cx, cy, outerR, pad)}
        fill="none"
        stroke={`url(#rim-${league})`}
        strokeWidth={size * 0.025}
        filter={`url(#soft-glow-${league})`}
      />

      {/* Inner rim highlight */}
      <path
        d={generateShieldPath(cx, cy, outerR - size * 0.04, pad + size * 0.04)}
        fill="none"
        stroke={t.primary}
        strokeWidth={size * 0.008}
        strokeOpacity="0.3"
      />

      {/* Inner decorative ring (orbit) */}
      <ellipse
        cx={cx}
        cy={cy}
        rx={innerR * 1.1}
        ry={innerR * 0.6}
        fill="none"
        stroke={t.primary}
        strokeWidth={size * 0.008}
        strokeOpacity="0.2"
        transform={`rotate(-15 ${cx} ${cy})`}
      />
      <ellipse
        cx={cx}
        cy={cy}
        rx={innerR * 1.1}
        ry={innerR * 0.6}
        fill="none"
        stroke={t.accent}
        strokeWidth={size * 0.008}
        strokeOpacity="0.15"
        transform={`rotate(15 ${cx} ${cy})`}
      />

      {/* Center emblem area — dark circle */}
      <circle cx={cx} cy={cy} r={innerR * 0.55} fill={t.bgTo} fillOpacity="0.6" stroke={t.primary} strokeWidth={size * 0.015} strokeOpacity="0.35" />

      {/* Tier number */}
      <text
        x={cx}
        y={cy - innerR * 0.15}
        textAnchor="middle"
        dominantBaseline="central"
        fill={t.primary}
        fontSize={size * 0.16}
        fontWeight="900"
        fontFamily="system-ui, sans-serif"
        filter={`url(#soft-glow-${league})`}
      >
        {t.number}
      </text>

      {/* Unique tier symbol below number */}
      <g
        transform={`translate(${cx}, ${cy + innerR * 0.2}) scale(${size * 0.004})`}
        stroke={t.secondary}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        {/* Star burst */}
        {t.number === 1 && (
          <>
            <polygon points="0,-10 3,-3 10,-3 5,2 7,10 0,5 -7,10 -5,2 -10,-3 -3,-3" fill={t.primary} fillOpacity="0.4" />
          </>
        )}
        {t.number === 2 && (
          <>
            <path d={t.path} stroke={t.primary} />
            <line x1="-6" y1="-6" x2="6" y2="6" stroke={t.primary} strokeOpacity="0.5" />
          </>
        )}
        {t.number === 3 && (
          <>
            <path d={t.path} fill={t.primary} fillOpacity="0.3" stroke={t.accent} />
            <line x1="0" y1="-4" x2="0" y2="4" stroke={t.primary} />
          </>
        )}
        {t.number === 4 && (
          <>
            <circle cx="0" cy="0" r="6" fill="none" stroke={t.primary} strokeWidth="1.5" />
            <circle cx="0" cy="0" r="2" fill={t.primary} fillOpacity="0.5" />
          </>
        )}
        {t.number === 5 && (
          <>
            <polygon points="0,-8 4,-3 8,-3 5,1 6,6 0,3 -6,6 -5,1 -8,-3 -4,-3" fill={t.primary} fillOpacity="0.3" />
            <circle cx="0" cy="0" r="2" fill={t.primary} fillOpacity="0.6" />
          </>
        )}
        {t.number === 6 && (
          <>
            <path d="M-6,-6 Q0,-10 6,-6 Q10,0 6,6 Q0,10 -6,6 Q-10,0 -6,-6Z" fill={t.primary} fillOpacity="0.2" stroke={t.accent} />
            <circle cx="0" cy="0" r="2" fill={t.primary} />
          </>
        )}
        {t.number === 7 && (
          <>
            <path d="M0,-8 L6,6 L0,3 L-6,6 Z" fill={t.primary} fillOpacity="0.3" stroke={t.accent} strokeWidth="1.5" />
            <circle cx="0" cy="1" r="1.5" fill={t.primary} />
          </>
        )}
      </g>
    </svg>
  );
}

function generateShieldPath(cx: number, cy: number, r: number, pad: number): string {
  const top = cy - r;
  const bottom = cy + r * 0.75;
  const left = cx - r;
  const right = cx + r;
  const midY = cy;
  return `M ${cx} ${top + pad}
    Q ${right + pad * 0.5} ${midY - r * 0.3}
    ${right - pad} ${midY + r * 0.1}
    Q ${right} ${midY + r * 0.6}
    ${cx} ${bottom}
    Q ${left} ${midY + r * 0.6}
    ${left + pad} ${midY + r * 0.1}
    Q ${left - pad * 0.5} ${midY - r * 0.3}
    ${cx} ${top + pad} Z`;
}

export function LeagueShield({ league, size = 48, animate = true, showLabel = false }: LeagueShieldProps) {
  const t = TIERS[league];

  return (
    <motion.div
      className="relative inline-flex flex-col items-center justify-center gap-1"
      style={{ width: size, height: showLabel ? size + 18 : size }}
    >
      <motion.div
        className="relative"
        style={{ width: size, height: size }}
        animate={
          animate
            ? {
                y: [0, -size * 0.02, 0],
              }
            : undefined
        }
        transition={
          animate
            ? { duration: 3, repeat: Infinity, ease: 'easeInOut' }
            : undefined
        }
      >
        {/* Outer glow aura */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, ${t.glow} 0%, transparent 70%)`,
            filter: 'blur(12px)',
          }}
          animate={
            animate
              ? {
                  scale: [1, 1.08, 1],
                  opacity: [0.5, 0.8, 0.5],
                }
              : undefined
          }
          transition={
            animate
              ? { duration: 2.5, repeat: Infinity, ease: 'easeInOut' }
              : undefined
          }
        />

        {/* Rotating light ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: `conic-gradient(from 0deg, transparent, ${t.primary}, transparent, ${t.accent}, transparent)`,
            filter: 'blur(6px)',
            opacity: 0.35,
          }}
          animate={animate ? { rotate: 360 } : undefined}
          transition={animate ? { duration: 5, repeat: Infinity, ease: 'linear' } : undefined}
        />

        {/* Counter-rotating ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: `conic-gradient(from 90deg, transparent, ${t.secondary}, transparent, ${t.primary}, transparent)`,
            filter: 'blur(4px)',
            opacity: 0.2,
          }}
          animate={animate ? { rotate: -360 } : undefined}
          transition={animate ? { duration: 7, repeat: Infinity, ease: 'linear' } : undefined}
        />

        {/* The badge SVG */}
        <div className="relative z-10 w-full h-full">
          <LeagueBadgeSvg league={league} size={size} />
        </div>
      </motion.div>

      {/* Label */}
      {showLabel && (
        <motion.span
          className="text-[10px] font-bold uppercase tracking-widest"
          style={{ color: t.primary }}
          animate={animate ? { opacity: [0.7, 1, 0.7] } : undefined}
          transition={animate ? { duration: 2, repeat: Infinity, ease: 'easeInOut' } : undefined}
        >
          {t.label}
        </motion.span>
      )}
    </motion.div>
  );
}

export function getLeagueLabel(league: League): string {
  return TIERS[league].label;
}

export function getLeagueTierNumber(league: League): number {
  return TIERS[league].number;
}

export const LEAGUE_ORDER: League[] = ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND', 'MASTER', 'GRANDMASTER'];
