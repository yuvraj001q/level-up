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

      {/* Emblem: each tier has a distinct crest matching its description */}
      <g
        transform={`translate(${cx}, ${cy}) scale(${size * 0.005})`}
        stroke={t.secondary}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        {/* IRON — Jagged W-shape, broken helmet, blunt and crude */}
        {league === 'IRON' && (
          <g filter={`url(#soft-glow-${league})`}>
            <path d="M-14,-4 L-8,-2 L-10,4 L-4,0 L-6,8 L0,2 L6,8 L4,0 L10,4 L8,-2 L14,-4 L12,6 L6,10 L0,12 L-6,10 L-12,6 Z"
              fill={t.primary} fillOpacity="0.12" stroke={t.primary} strokeWidth="1.8" />
            <path d="M-10,0 L-4,-6 L0,-2 L4,-6 L10,0" stroke={t.accent} strokeOpacity="0.4" strokeWidth="2" />
            <path d="M-6,4 L0,-1 L6,4" stroke={t.accent} strokeOpacity="0.25" strokeWidth="1.5" />
          </g>
        )}

        {/* BRONZE — Wider wingspan, central peak, sharp edges */}
        {league === 'BRONZE' && (
          <g filter={`url(#soft-glow-${league})`}>
            <path d="M-14,-6 L-8,-10 L-4,-4 L0,-8 L4,-4 L8,-10 L14,-6 L12,4 L6,10 L0,12 L-6,10 L-12,4 Z"
              fill={t.primary} fillOpacity="0.15" stroke={t.primary} strokeWidth="1.6" />
            <path d="M-10,0 L-5,-6 L0,-2 L5,-6 L10,0" stroke={t.accent} strokeOpacity="0.3" />
            <line x1="0" y1="-2" x2="0" y2="10" stroke={t.primary} strokeOpacity="0.4" />
          </g>
        )}

        {/* SILVER — Sweeping wing tips upward, pronounced central crest */}
        {league === 'SILVER' && (
          <g filter={`url(#soft-glow-${league})`}>
            <path d="M-14,-8 Q-10,-14 -6,-6 L-2,-2 L0,-4 L2,-2 L6,-6 Q10,-14 14,-8 L12,2 L6,8 L2,10 L-2,10 L-6,8 L-12,2 Z"
              fill={t.primary} fillOpacity="0.15" stroke={t.primary} strokeWidth="1.5" />
            <path d="M-10,-4 Q-6,-10 -3,-4" stroke={t.accent} strokeOpacity="0.3" />
            <path d="M10,-4 Q6,-10 3,-4" stroke={t.accent} strokeOpacity="0.3" />
            <line x1="0" y1="-4" x2="0" y2="8" stroke={t.primary} strokeOpacity="0.5" strokeWidth="2" />
            <circle cx="0" cy="4" r="2" fill={t.primary} fillOpacity="0.3" />
          </g>
        )}

        {/* GOLD — Thick multi-layered wings, wide */}
        {league === 'GOLD' && (
          <g filter={`url(#soft-glow-${league})`}>
            <path d="M-16,-2 Q-12,-12 -6,-8 L-3,-4 L0,-6 L3,-4 L6,-8 Q12,-12 16,-2 L14,6 L8,10 L3,12 L-3,12 L-8,10 L-14,6 Z"
              fill={t.primary} fillOpacity="0.18" stroke={t.primary} strokeWidth="1.8" />
            <path d="M-14,0 Q-8,-8 -4,-4" stroke={t.accent} strokeOpacity="0.3" strokeWidth="1.2" />
            <path d="M14,0 Q8,-8 4,-4" stroke={t.accent} strokeOpacity="0.3" strokeWidth="1.2" />
            <path d="M-4,4 L0,-2 L4,4" stroke={t.primary} strokeOpacity="0.5" strokeWidth="2" />
            <circle cx="0" cy="6" r="2.5" fill={t.primary} fillOpacity="0.25" />
          </g>
        )}

        {/* PLATINUM — Aggressive upward-pointing shards, angular */}
        {league === 'PLATINUM' && (
          <g filter={`url(#soft-glow-${league})`}>
            <path d="M-16,-2 L-12,-10 L-8,-4 L-4,-12 L0,-4 L4,-12 L8,-4 L12,-10 L16,-2 L14,6 L8,10 L4,12 L0,6 L-4,12 L-8,10 L-14,6 Z"
              fill={t.primary} fillOpacity="0.15" stroke={t.primary} strokeWidth="1.6" />
            <path d="M-10,0 L-6,-6 L-2,0" stroke={t.accent} strokeOpacity="0.3" />
            <path d="M10,0 L6,-6 L2,0" stroke={t.accent} strokeOpacity="0.3" />
            <polygon points="0,-6 3,0 0,4 -3,0" fill={t.primary} fillOpacity="0.2" />
          </g>
        )}

        {/* EMERALD — Wide sweeping upward arcs, crystalline yet organic */}
        {league === 'EMERALD' && (
          <g filter={`url(#soft-glow-${league})`}>
            <path d="M-16,-4 Q-12,-14 -6,-10 Q-3,-8 0,-10 Q3,-8 6,-10 Q12,-14 16,-4 L14,4 Q8,12 4,10 Q2,8 0,10 Q-2,8 -4,10 Q-8,12 -14,4 Z"
              fill={t.primary} fillOpacity="0.15" stroke={t.primary} strokeWidth="1.6" />
            <path d="M-12,-2 Q-6,-8 -2,-4" stroke={t.accent} strokeOpacity="0.3" strokeWidth="1.2" />
            <path d="M12,-2 Q6,-8 2,-4" stroke={t.accent} strokeOpacity="0.3" strokeWidth="1.2" />
            <path d="M-6,2 Q0,-4 6,2" stroke={t.primary} strokeOpacity="0.4" strokeWidth="1.5" />
          </g>
        )}

        {/* DIAMOND — Heavily faceted, sharp crystalline spikes */}
        {league === 'DIAMOND' && (
          <g filter={`url(#soft-glow-${league})`}>
            <path d="M0,-14 L6,-10 L10,-6 L12,0 L10,4 L6,8 L0,12 L-6,8 L-10,4 L-12,0 L-10,-6 L-6,-10 Z"
              fill={t.primary} fillOpacity="0.18" stroke={t.primary} strokeWidth="1.6" />
            <polygon points="0,-14 6,-6 0,-2 -6,-6" fill={t.primary} fillOpacity="0.1" stroke={t.primary} strokeOpacity="0.3" />
            <polygon points="-10,-6 -4,-2 0,4 -6,0" fill={t.primary} fillOpacity="0.1" stroke={t.primary} strokeOpacity="0.3" />
            <polygon points="10,-6 4,-2 0,4 6,0" fill={t.primary} fillOpacity="0.1" stroke={t.primary} strokeOpacity="0.3" />
            <polygon points="0,4 -4,8 4,8" fill={t.primary} fillOpacity="0.15" />
            <line x1="0" y1="-14" x2="0" y2="12" stroke={t.primary} strokeOpacity="0.3" strokeWidth="1" />
          </g>
        )}

        {/* MASTER — Arcane ethereal upward sweep, pure energy */}
        {league === 'MASTER' && (
          <g filter={`url(#soft-glow-${league})`}>
            <path d="M-16,-6 Q-10,-16 -4,-10 Q-2,-8 0,-10 Q2,-8 4,-10 Q10,-16 16,-6 L14,4 Q8,10 4,8 L2,6 L-2,6 L-4,8 Q-8,10 -14,4 Z"
              fill={t.primary} fillOpacity="0.15" stroke={t.primary} strokeWidth="1.6" />
            <path d="M-12,-2 Q-8,-10 -4,-6" stroke={t.accent} strokeOpacity="0.35" strokeWidth="1.3" />
            <path d="M12,-2 Q8,-10 4,-6" stroke={t.accent} strokeOpacity="0.35" strokeWidth="1.3" />
            <path d="M-8,2 Q-4,-4 0,0 Q4,-4 8,2" stroke={t.primary} strokeOpacity="0.5" strokeWidth="1.8" />
            <polygon points="0,-4 3,2 0,6 -3,2" fill={t.primary} fillOpacity="0.25" />
            <circle cx="0" cy="1" r="2" fill={t.primary} fillOpacity="0.4" />
          </g>
        )}

        {/* GRANDMASTER — Demonic/fiery V-center, massive flared top wings */}
        {league === 'GRANDMASTER' && (
          <g filter={`url(#soft-glow-${league})`}>
            <path d="M-18,-4 Q-14,-16 -6,-12 L-2,-8 L0,-14 L2,-8 L6,-12 Q14,-16 18,-4 L16,6 L10,12 L4,14 L0,10 L-4,14 L-10,12 L-16,6 Z"
              fill={t.primary} fillOpacity="0.18" stroke={t.primary} strokeWidth="1.8" />
            <path d="M-14,0 Q-8,-10 -4,-6" stroke={t.accent} strokeOpacity="0.35" strokeWidth="1.3" />
            <path d="M14,0 Q8,-10 4,-6" stroke={t.accent} strokeOpacity="0.35" strokeWidth="1.3" />
            <path d="M0,-14 L0,4" stroke={t.accent} strokeOpacity="0.4" strokeWidth="2" />
            <path d="M-6,2 Q0,-4 6,2" stroke={t.primary} strokeOpacity="0.5" strokeWidth="1.5" />
            <path d="M-4,6 L0,2 L4,6" stroke={t.accent} strokeOpacity="0.4" />
          </g>
        )}

        {/* CHALLENGER — Ultimate crown/crest, massive wingspan, star core */}
        {league === 'CHALLENGER' && (
          <g filter={`url(#soft-glow-${league})`}>
            <path d="M-20,-2 Q-16,-18 -8,-14 L-4,-10 L-2,-14 L0,-12 L2,-14 L4,-10 L8,-14 Q16,-18 20,-2 L18,8 L12,14 L6,16 L0,12 L-6,16 L-12,14 L-18,8 Z"
              fill={t.primary} fillOpacity="0.18" stroke={t.primary} strokeWidth="2" />
            <path d="M-16,2 Q-10,-12 -4,-6" stroke={t.accent} strokeOpacity="0.3" strokeWidth="1.3" />
            <path d="M16,2 Q10,-12 4,-6" stroke={t.accent} strokeOpacity="0.3" strokeWidth="1.3" />
            <polygon points="0,-12 3,-4 8,-4 4,1 6,8 0,4 -6,8 -4,1 -8,-4 -3,-4"
              fill={t.primary} fillOpacity="0.15" stroke={t.primary} strokeWidth="1.2" />
            <circle cx="0" cy="0" r="4" fill={t.accent} fillOpacity="0.15" stroke={t.accent} strokeWidth="1.5" />
            <circle cx="0" cy="0" r="2" fill={t.accent} fillOpacity="0.3" />
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
