'use client';

import { useEffect, useState } from 'react';
import { useRequireAuth } from '@/lib/useRequireAuth';
import { motion } from 'framer-motion';
import { Gift, Copy, Check, Users, MousePointerClick, Loader2 } from 'lucide-react';

export default function ReferralPage() {
  const { session, status } = useRequireAuth();
  const [data, setData] = useState<{
    referralCode: string;
    referralPoints: number;
    referredBy: { name: string; username: string } | null;
    totalReferrals: number;
    totalVisits: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  useEffect(() => {
    if (status !== 'authenticated') return;
    fetch('/api/referral')
      .then((r) => r.json())
      .then((d) => {
        if (d?.referralCode) setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [status]);

  const referralLink = data && origin ? `${origin}/register?ref=${data.referralCode}` : '';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-accent-blue" /></div>;

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
          <Gift className="w-7 h-7 text-accent-cyan" />
          Referral Program
        </h1>
        <p className="text-text-muted mt-1">Share your link and earn 10 points for every new user who signs up through it</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass p-5 text-center"
        >
          <div className="w-10 h-10 rounded-xl bg-accent-green/10 flex items-center justify-center mx-auto mb-3">
            <Gift className="w-5 h-5 text-accent-green" />
          </div>
          <p className="text-2xl font-bold text-accent-green">{data?.referralPoints || 0}</p>
          <p className="text-xs text-text-muted mt-1">Referral Points</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="glass p-5 text-center"
        >
          <div className="w-10 h-10 rounded-xl bg-accent-blue/10 flex items-center justify-center mx-auto mb-3">
            <Users className="w-5 h-5 text-accent-blue" />
          </div>
          <p className="text-2xl font-bold text-accent-blue">{data?.totalReferrals || 0}</p>
          <p className="text-xs text-text-muted mt-1">Total Referrals</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="glass p-5 text-center"
        >
          <div className="w-10 h-10 rounded-xl bg-accent-purple/10 flex items-center justify-center mx-auto mb-3">
            <MousePointerClick className="w-5 h-5 text-accent-purple" />
          </div>
          <p className="text-2xl font-bold text-accent-purple">{data?.totalVisits || 0}</p>
          <p className="text-xs text-text-muted mt-1">Link Clicks</p>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="glass p-6 mb-6"
      >
        <h2 className="text-sm font-semibold mb-3">Your Referral Code</h2>
        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            readOnly
            value={data?.referralCode || ''}
            className="flex-1 bg-bg-primary border border-border-subtle rounded-xl px-4 py-3 text-sm text-text-primary font-mono text-center tracking-widest uppercase focus:outline-none"
          />
          <button
            onClick={() => { navigator.clipboard.writeText(data?.referralCode || ''); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-accent-blue/10 text-accent-blue text-sm font-medium hover:bg-accent-blue/20 transition-all whitespace-nowrap"
          >
            {copied ? <Check className="w-4 h-4 text-accent-green" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>

        <h2 className="text-sm font-semibold mb-3">Your Referral Link</h2>
        <div className="flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={referralLink}
            className="flex-1 bg-bg-primary border border-border-subtle rounded-xl px-4 py-3 text-sm text-text-primary font-mono focus:outline-none"
          />
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-accent-blue/10 text-accent-blue text-sm font-medium hover:bg-accent-blue/20 transition-all whitespace-nowrap"
          >
            {copiedLink ? <Check className="w-4 h-4 text-accent-green" /> : <Copy className="w-4 h-4" />}
            {copiedLink ? 'Copied' : 'Copy'}
          </button>
        </div>
      </motion.div>

      {data?.referredBy && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="glass p-4 text-sm text-text-secondary"
        >
          You were referred by <span className="text-text-primary font-medium">{data.referredBy.name || `@${data.referredBy.username}`}</span>
        </motion.div>
      )}
    </div>
  );
}
