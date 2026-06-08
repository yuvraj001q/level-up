'use client';

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

function LeagueBadgeSvg({ league, size }: { league: League; size: number }) {
  const t = TIERS[league];
  const cx = size / 2;
  const cy = size / 2;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id={`soft-glow-${league}`}>
          <feDropShadow dx="0" dy="0" stdDeviation={size * 0.04} floodColor={t.primary} floodOpacity="0.35" />
        </filter>
      </defs>

      {/* Emblem scales to fill ~70% of the SVG */}
      <g
        transform={`translate(${cx}, ${cy}) scale(${size * 0.018})`}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* IRON — Jagged broken helmet, crude W-shape, blunt edges */}
        {league === 'IRON' && (
          <g filter={`url(#soft-glow-${league})`}>
            <path d="M-10,-8 L-6,-4 L-8,0 L-3,2 L-5,6 L0,3 L5,6 L3,2 L8,0 L6,-4 L10,-8 L8,2 L4,6 L-4,6 L-8,2 Z"
              fill={t.primary} fillOpacity="0.15" stroke={t.primary} strokeWidth="1.4" />
            <path d="M-6,6 L-2,1 L2,1 L6,6" stroke={t.secondary} strokeOpacity="0.4" strokeWidth="1.5" />
            <path d="M-7,-2 L-3,-5 L0,-2 L3,-5 L7,-2" stroke={t.accent} strokeOpacity="0.5" strokeWidth="1.5" />
            <line x1="0" y1="-2" x2="0" y2="3" stroke={t.secondary} strokeOpacity="0.3" strokeWidth="1" />
          </g>
        )}

        {/* BRONZE — Wider wings, sharp tips, central peak */}
        {league === 'BRONZE' && (
          <g filter={`url(#soft-glow-${league})`}>
            <path d="M-12,-6 L-7,-9 L-3,-4 L0,-7 L3,-4 L7,-9 L12,-6 L10,2 L6,8 L0,10 L-6,8 L-10,2 Z"
              fill={t.primary} fillOpacity="0.18" stroke={t.primary} strokeWidth="1.5" />
            <path d="M-8,0 L-3,-5 L0,-2 L3,-5 L8,0" stroke={t.secondary} strokeOpacity="0.4" />
            <line x1="0" y1="-2" x2="0" y2="8" stroke={t.accent} strokeOpacity="0.35" strokeWidth="1.5" />
            <circle cx="0" cy="3" r="1.5" fill={t.primary} fillOpacity="0.3" />
          </g>
        )}

        {/* SILVER — Sweeping up-turned wing tips, pronounced crest */}
        {league === 'SILVER' && (
          <g filter={`url(#soft-glow-${league})`}>
            <path d="M-12,-6 Q-8,-12 -4,-5 L-2,-2 L0,-4 L2,-2 L4,-5 Q8,-12 12,-6 L10,1 L5,7 L2,9 L-2,9 L-5,7 L-10,1 Z"
              fill={t.primary} fillOpacity="0.18" stroke={t.primary} strokeWidth="1.5" />
            <path d="M-8,-2 Q-5,-7 -2,-3" stroke={t.secondary} strokeOpacity="0.35" />
            <path d="M8,-2 Q5,-7 2,-3" stroke={t.secondary} strokeOpacity="0.35" />
            <line x1="0" y1="-4" x2="0" y2="7" stroke={t.accent} strokeOpacity="0.4" strokeWidth="1.5" />
            <circle cx="0" cy="3" r="2" fill={t.primary} fillOpacity="0.2" />
          </g>
        )}

        {/* GOLD — Thick multi-layered wings, wide spread */}
        {league === 'GOLD' && (
          <g filter={`url(#soft-glow-${league})`}>
            <path d="M-14,-1 Q-10,-10 -5,-7 L-2,-3 L0,-5 L2,-3 L5,-7 Q10,-10 14,-1 L12,5 L7,9 L3,11 L-3,11 L-7,9 L-12,5 Z"
              fill={t.primary} fillOpacity="0.2" stroke={t.primary} strokeWidth="1.6" />
            <path d="M-12,1 Q-7,-6 -3,-3" stroke={t.secondary} strokeOpacity="0.3" strokeWidth="0.8" fill="none" />
            <path d="M12,1 Q7,-6 3,-3" stroke={t.secondary} strokeOpacity="0.3" strokeWidth="0.8" fill="none" />
            <path d="M-4,3 L0,-1 L4,3" stroke={t.accent} strokeOpacity="0.5" strokeWidth="2" />
            <circle cx="0" cy="5" r="2" fill={t.primary} fillOpacity="0.25" />
          </g>
        )}

        {/* PLATINUM — Sharp upward-pointing shards, highly angular */}
        {league === 'PLATINUM' && (
          <g filter={`url(#soft-glow-${league})`}>
            <path d="M-14,0 L-11,-8 L-7,-3 L-4,-10 L0,-3 L4,-10 L7,-3 L11,-8 L14,0 L12,5 L7,9 L4,11 L0,5 L-4,11 L-7,9 L-12,5 Z"
              fill={t.primary} fillOpacity="0.18" stroke={t.primary} strokeWidth="1.4" />
            <polygon points="-8,-1 -4,-6 -1,-1" fill={t.primary} fillOpacity="0.15" stroke={t.secondary} strokeOpacity="0.3" strokeWidth="0.8" />
            <polygon points="8,-1 4,-6 1,-1" fill={t.primary} fillOpacity="0.15" stroke={t.secondary} strokeOpacity="0.3" strokeWidth="0.8" />
            <polygon points="0,-4 2,1 0,4 -2,1" fill={t.primary} fillOpacity="0.25" />
          </g>
        )}

        {/* EMERALD — Wide sweeping upward arcs, crystalline organic */}
        {league === 'EMERALD' && (
          <g filter={`url(#soft-glow-${league})`}>
            <path d="M-14,-2 Q-10,-12 -5,-9 Q-2,-7 0,-9 Q2,-7 5,-9 Q10,-12 14,-2 L12,4 Q7,10 4,9 Q2,7 0,9 Q-2,7 -4,9 Q-7,10 -12,4 Z"
              fill={t.primary} fillOpacity="0.18" stroke={t.primary} strokeWidth="1.5" />
            <path d="M-10,0 Q-5,-6 -2,-3" stroke={t.secondary} strokeOpacity="0.35" strokeWidth="1" />
            <path d="M10,0 Q5,-6 2,-3" stroke={t.secondary} strokeOpacity="0.35" strokeWidth="1" />
            <path d="M-5,3 Q0,-2 5,3" stroke={t.accent} strokeOpacity="0.4" strokeWidth="1.5" />
            <circle cx="0" cy="4" r="1.5" fill={t.primary} fillOpacity="0.2" />
          </g>
        )}

        {/* DIAMOND — Heavily faceted crystal, sharp spikes */}
        {league === 'DIAMOND' && (
          <g filter={`url(#soft-glow-${league})`}>
            <path d="M0,-12 L5,-9 L9,-5 L11,0 L9,4 L5,7 L0,11 L-5,7 L-9,4 L-11,0 L-9,-5 L-5,-9 Z"
              fill={t.primary} fillOpacity="0.2" stroke={t.primary} strokeWidth="1.5" />
            <polygon points="0,-12 5,-5 0,-1 -5,-5" fill={t.primary} fillOpacity="0.1" stroke={t.secondary} strokeOpacity="0.3" strokeWidth="0.8" />
            <polygon points="-9,-5 -3,-1 0,3 -5,0" fill={t.primary} fillOpacity="0.1" stroke={t.secondary} strokeOpacity="0.3" strokeWidth="0.8" />
            <polygon points="9,-5 3,-1 0,3 5,0" fill={t.primary} fillOpacity="0.1" stroke={t.secondary} strokeOpacity="0.3" strokeWidth="0.8" />
            <polygon points="0,3 -4,7 4,7" fill={t.primary} fillOpacity="0.15" />
            <line x1="0" y1="-12" x2="0" y2="11" stroke={t.accent} strokeOpacity="0.3" strokeWidth="1" />
          </g>
        )}

        {/* MASTER — Arcane ethereal upward sweep, pure energy */}
        {league === 'MASTER' && (
          <g filter={`url(#soft-glow-${league})`}>
            <path d="M-14,-4 Q-9,-14 -3,-9 Q-1,-7 0,-9 Q1,-7 3,-9 Q9,-14 14,-4 L12,3 Q7,9 3,7 L1,5 L-1,5 L-3,7 Q-7,9 -12,3 Z"
              fill={t.primary} fillOpacity="0.18" stroke={t.primary} strokeWidth="1.5" />
            <path d="M-10,1 Q-6,-7 -3,-4" stroke={t.secondary} strokeOpacity="0.4" strokeWidth="1.2" />
            <path d="M10,1 Q6,-7 3,-4" stroke={t.secondary} strokeOpacity="0.4" strokeWidth="1.2" />
            <path d="M-6,3 Q-3,-2 0,1 Q3,-2 6,3" stroke={t.accent} strokeOpacity="0.5" strokeWidth="1.8" />
            <polygon points="0,-3 2,2 0,5 -2,2" fill={t.primary} fillOpacity="0.25" />
            <circle cx="0" cy="1" r="1.5" fill={t.primary} fillOpacity="0.4" />
          </g>
        )}

        {/* GRANDMASTER — Demonic V-center, fiery flared top wings */}
        {league === 'GRANDMASTER' && (
          <g filter={`url(#soft-glow-${league})`}>
            <path d="M-16,-2 Q-12,-14 -5,-11 L-2,-7 L0,-13 L2,-7 L5,-11 Q12,-14 16,-2 L14,5 L9,11 L4,13 L0,9 L-4,13 L-9,11 L-14,5 Z"
              fill={t.primary} fillOpacity="0.2" stroke={t.primary} strokeWidth="1.6" />
            <path d="M-12,1 Q-7,-8 -3,-5" stroke={t.secondary} strokeOpacity="0.4" strokeWidth="1.2" />
            <path d="M12,1 Q7,-8 3,-5" stroke={t.secondary} strokeOpacity="0.4" strokeWidth="1.2" />
            <path d="M0,-13 L0,3" stroke={t.accent} strokeOpacity="0.45" strokeWidth="2" />
            <path d="M-5,3 Q0,-3 5,3" stroke={t.accent} strokeOpacity="0.5" strokeWidth="1.5" />
            <path d="M-3,7 L0,3 L3,7" stroke={t.secondary} strokeOpacity="0.5" strokeWidth="1.5" />
          </g>
        )}

        {/* CHALLENGER — Supreme crown/crest, massive wingspan, star core */}
        {league === 'CHALLENGER' && (
          <g filter={`url(#soft-glow-${league})`}>
            <path d="M-18,0 Q-14,-16 -7,-13 L-3,-9 L-1,-13 L0,-11 L1,-13 L3,-9 L7,-13 Q14,-16 18,0 L16,7 L11,13 L5,15 L0,11 L-5,15 L-11,13 L-16,7 Z"
              fill={t.primary} fillOpacity="0.2" stroke={t.primary} strokeWidth="1.8" />
            <path d="M-14,2 Q-9,-10 -3,-5" stroke={t.secondary} strokeOpacity="0.35" strokeWidth="1.2" />
            <path d="M14,2 Q9,-10 3,-5" stroke={t.secondary} strokeOpacity="0.35" strokeWidth="1.2" />
            <polygon points="0,-11 3,-2 7,-2 4,2 6,8 0,5 -6,8 -4,2 -7,-2 -3,-2"
              fill={t.primary} fillOpacity="0.12" stroke={t.accent} strokeWidth="1.2" />
            <circle cx="0" cy="0" r="3.5" fill={t.accent} fillOpacity="0.12" stroke={t.accent} strokeWidth="1.5" />
            <circle cx="0" cy="0" r="1.8" fill={t.accent} fillOpacity="0.3" />
          </g>
        )}
      </g>
    </svg>
  );
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
export const LEAGUE_ORDER_DESC: League[] = ['CHALLENGER', 'GRANDMASTER', 'MASTER', 'DIAMOND', 'EMERALD', 'PLATINUM', 'GOLD', 'SILVER', 'BRONZE', 'IRON'];
