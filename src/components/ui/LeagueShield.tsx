'use client';

import { motion } from 'framer-motion';
import type { League } from '@/types';
import '@/app/league-tiers.css';

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
}

const TIERS: Record<League, TierArt> = {
  IRON: {
    primary: '#6b7280',
    secondary: '#4b5563',
    accent: '#374151',
    glow: 'rgba(107,114,128,0.5)',
    bgFrom: '#0f0f11',
    bgTo: '#1a1a1f',
    label: 'Iron',
  },
  BRONZE: {
    primary: '#cd7f32',
    secondary: '#a0522d',
    accent: '#8b5a2b',
    glow: 'rgba(205,127,50,0.4)',
    bgFrom: '#1a0f08',
    bgTo: '#2d1a0e',
    label: 'Bronze',
  },
  SILVER: {
    primary: '#c0c0c0',
    secondary: '#a0a0a0',
    accent: '#808080',
    glow: 'rgba(192,192,192,0.4)',
    bgFrom: '#0f1215',
    bgTo: '#1a1f24',
    label: 'Silver',
  },
  GOLD: {
    primary: '#ffd700',
    secondary: '#daa520',
    accent: '#b8860b',
    glow: 'rgba(255,215,0,0.5)',
    bgFrom: '#1a1200',
    bgTo: '#2d2000',
    label: 'Gold',
  },
  PLATINUM: {
    primary: '#e5e4e2',
    secondary: '#87ceeb',
    accent: '#6b8e9e',
    glow: 'rgba(135,206,235,0.4)',
    bgFrom: '#0a0f14',
    bgTo: '#141c24',
    label: 'Platinum',
  },
  EMERALD: {
    primary: '#50c878',
    secondary: '#2e8b57',
    accent: '#1a6b3c',
    glow: 'rgba(80,200,120,0.4)',
    bgFrom: '#05140a',
    bgTo: '#0a1f10',
    label: 'Emerald',
  },
  DIAMOND: {
    primary: '#00ffff',
    secondary: '#00ced1',
    accent: '#008b8b',
    glow: 'rgba(0,255,255,0.4)',
    bgFrom: '#000a0f',
    bgTo: '#001419',
    label: 'Diamond',
  },
  MASTER: {
    primary: '#a855f7',
    secondary: '#7c3aed',
    accent: '#6b21a8',
    glow: 'rgba(168,85,247,0.4)',
    bgFrom: '#0f0518',
    bgTo: '#1a0a2e',
    label: 'Master',
  },
  GRANDMASTER: {
    primary: '#ef4444',
    secondary: '#dc2626',
    accent: '#7f1d1d',
    glow: 'rgba(239,68,68,0.5)',
    bgFrom: '#1a0505',
    bgTo: '#2e0a0a',
    label: 'Grandmaster',
  },
  CHALLENGER: {
    primary: '#fbbf24',
    secondary: '#f59e0b',
    accent: '#d97706',
    glow: 'rgba(251,191,36,0.6)',
    bgFrom: '#141005',
    bgTo: '#241a08',
    label: 'Challenger',
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

      {/* Big centered emblem (no number — like Critique AI character avatars) */}
      <g
        transform={`translate(${cx}, ${cy}) scale(${size * 0.005})`}
        stroke={t.secondary}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        {/* IRON — Anvil / ingot */}
        {league === 'IRON' && (
          <g filter={`url(#soft-glow-${league})`}>
            <rect x="-8" y="-6" width="16" height="12" rx="2" fill={t.primary} fillOpacity="0.2" stroke={t.primary} />
            <rect x="-4" y="-8" width="8" height="2" rx="1" fill={t.primary} fillOpacity="0.3" stroke={t.primary} strokeWidth="1.2" />
            <line x1="-6" y1="0" x2="6" y2="0" stroke={t.primary} strokeOpacity="0.5" />
            <line x1="-5" y1="3" x2="5" y2="3" stroke={t.primary} strokeOpacity="0.3" />
          </g>
        )}
        {/* BRONZE — Large shield */}
        {league === 'BRONZE' && (
          <g filter={`url(#soft-glow-${league})`}>
            <path d="M0,-14 L12,-9 L12,4 Q12,10 0,14 Q-12,10 -12,4 L-12,-9 Z" fill={t.primary} fillOpacity="0.25" stroke={t.primary} />
            <line x1="0" y1="-8" x2="0" y2="8" stroke={t.primary} strokeOpacity="0.6" />
            <line x1="-5" y1="-3" x2="5" y2="-3" stroke={t.primary} strokeOpacity="0.6" />
          </g>
        )}
        {/* SILVER — Crossed swords */}
        {league === 'SILVER' && (
          <g filter={`url(#soft-glow-${league})`}>
            <line x1="-10" y1="-10" x2="10" y2="10" stroke={t.primary} />
            <line x1="10" y1="-10" x2="-10" y2="10" stroke={t.primary} />
            <circle cx="0" cy="0" r="3" fill={t.primary} fillOpacity="0.3" />
          </g>
        )}
        {/* GOLD — Crown */}
        {league === 'GOLD' && (
          <g filter={`url(#soft-glow-${league})`}>
            <path d="M-12,-6 L-8,-12 L-4,-4 L0,-10 L4,-4 L8,-12 L12,-6 L12,6 L-12,6 Z" fill={t.primary} fillOpacity="0.25" stroke={t.primary} />
            <circle cx="0" cy="4" r="2" fill={t.primary} fillOpacity="0.5" />
          </g>
        )}
        {/* PLATINUM — Shooting star / comet */}
        {league === 'PLATINUM' && (
          <g filter={`url(#soft-glow-${league})`}>
            <path d="M-14,0 L-8,-6 L-4,-2 L10,-10 L6,2 L12,6 L-2,8 L-6,12 L-8,2 Z" fill={t.primary} fillOpacity="0.2" stroke={t.primary} />
            <circle cx="0" cy="0" r="2" fill={t.primary} fillOpacity="0.6" />
          </g>
        )}
        {/* EMERALD — Laurel / leaf crest */}
        {league === 'EMERALD' && (
          <g filter={`url(#soft-glow-${league})`}>
            <path d="M-10,0 Q-6,-14 0,-6 Q6,-14 10,0 Q6,8 0,10 Q-6,8 -10,0Z" fill={t.primary} fillOpacity="0.2" stroke={t.primary} />
            <line x1="-6" y1="-2" x2="6" y2="-2" stroke={t.primary} strokeOpacity="0.4" />
            <line x1="0" y1="-6" x2="0" y2="8" stroke={t.primary} strokeOpacity="0.3" />
            <circle cx="0" cy="0" r="2" fill={t.primary} fillOpacity="0.4" />
          </g>
        )}
        {/* DIAMOND — Geometric crystal */}
        {league === 'DIAMOND' && (
          <g filter={`url(#soft-glow-${league})`}>
            <polygon points="0,-12 10,-4 10,6 0,12 -10,6 -10,-4" fill={t.primary} fillOpacity="0.2" stroke={t.primary} />
            <line x1="0" y1="-12" x2="0" y2="12" stroke={t.primary} strokeOpacity="0.4" />
            <line x1="-10" y1="-4" x2="10" y2="-4" stroke={t.primary} strokeOpacity="0.4" />
            <polygon points="0,-4 6,0 0,4 -6,0" fill={t.primary} fillOpacity="0.3" />
          </g>
        )}
        {/* MASTER — Wings */}
        {league === 'MASTER' && (
          <g filter={`url(#soft-glow-${league})`}>
            <path d="M-2,0 Q-8,-6 -14,-4 Q-10,2 -6,0 Q-10,6 -14,10 Q-8,8 -2,4" fill={t.primary} fillOpacity="0.2" stroke={t.primary} />
            <path d="M2,0 Q8,-6 14,-4 Q10,2 6,0 Q10,6 14,10 Q8,8 2,4" fill={t.primary} fillOpacity="0.2" stroke={t.primary} />
            <circle cx="0" cy="2" r="2" fill={t.primary} fillOpacity="0.5" />
          </g>
        )}
        {/* GRANDMASTER — Dragon / flame crest */}
        {league === 'GRANDMASTER' && (
          <g filter={`url(#soft-glow-${league})`}>
            <path d="M0,-12 Q6,-8 8,-4 Q12,-2 10,2 Q8,6 4,8 Q6,12 2,10 Q0,14 -2,10 Q-6,12 -4,8 Q-8,6 -10,2 Q-12,-2 -8,-4 Q-6,-8 0,-12Z" fill={t.primary} fillOpacity="0.2" stroke={t.primary} />
            <circle cx="0" cy="0" r="2.5" fill={t.primary} fillOpacity="0.5" />
            <path d="M-3,-6 L0,-10 L3,-6" stroke={t.primary} strokeOpacity="0.6" />
          </g>
        )}
        {/* CHALLENGER — Radiant star / crest */}
        {league === 'CHALLENGER' && (
          <g filter={`url(#soft-glow-${league})`}>
            <path d="M0,-14 L3,-5 L12,-5 L5,1 L8,10 L0,5 L-8,10 L-5,1 L-12,-5 L-3,-5 Z" fill={t.primary} fillOpacity="0.2" stroke={t.primary} />
            <circle cx="0" cy="0" r="2.5" fill={t.primary} fillOpacity="0.5" />
            <path d="M-6,-6 L6,6" stroke={t.primary} strokeOpacity="0.3" />
            <path d="M6,-6 L-6,6" stroke={t.primary} strokeOpacity="0.3" />
          </g>
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
    <div
      className={`league-tier league-tier--${league}`}
      style={{ width: size, height: showLabel ? size + 18 : size }}
    >
      <div className="league-tier__container" style={animate ? {
        animation: `tier-float var(--tier-float-duration, 3s) ease-in-out infinite`,
      } : { animation: 'none' }}>
        {/* Outer glow aura */}
        <div
          className={`league-tier__aura ${animate ? 'is-animated' : ''}`}
          style={{
            background: `radial-gradient(circle, ${t.glow} 0%, transparent 70%)`,
            filter: `blur(${size * 0.25}px)`,
            animationDuration: animate ? undefined : '0s',
          }}
        />

        {/* Rotating light rings */}
        <div className="league-tier__ring league-tier__ring--primary" />
        <div className="league-tier__ring league-tier__ring--secondary" />

        {/* Heat distortion (Grandmaster+) */}
        {['GRANDMASTER', 'CHALLENGER'].includes(league) && animate && (
          <div className="league-tier__heat-distort" />
        )}

        {/* Metallic shine overlay (Platinum+) */}
        {['PLATINUM', 'EMERALD', 'DIAMOND', 'MASTER', 'GRANDMASTER', 'CHALLENGER'].includes(league) && (
          <div className="league-tier__shine" />
        )}

        {/* Core flash (Master+) */}
        {['MASTER', 'GRANDMASTER', 'CHALLENGER'].includes(league) && (
          <div className="league-tier__core-flash" />
        )}

        {/* Floating particles (Challenger only) */}
        {league === 'CHALLENGER' && animate && (
          <div className="league-tier__particles">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="league-tier__particle" />
            ))}
          </div>
        )}

        {/* The badge SVG */}
        <div className="league-tier__emblem">
          <LeagueBadgeSvg league={league} size={size} />
        </div>
      </div>

      {/* Label */}
      {showLabel && (
        <span className="league-tier__label" style={{ color: t.primary }}>
          {t.label}
        </span>
      )}
    </div>
  );
}

export function getLeagueLabel(league: League): string {
  return TIERS[league].label;
}

export const LEAGUE_ORDER: League[] = ['IRON', 'BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'EMERALD', 'DIAMOND', 'MASTER', 'GRANDMASTER', 'CHALLENGER'];
