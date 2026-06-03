'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Zap, CheckCircle, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { useStore } from '@/store/useStore';

export default function AnalyticsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { user } = useStore();
  const [xpData, setXpData] = useState<{ date: string; xp: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
    if (status !== 'authenticated' || !session?.user?.id) return;

    Promise.all([
      fetch(`/api/xp?userId=${session.user.id}`).then((r) => r.json()),
      fetch(`/api/tasks?userId=${session.user.id}`).then((r) => r.json()),
    ]).then(([xpData, tasks]) => {
      setXpData(xpData.chartData || []);
      // Set category stats
      const categories: Record<string, { total: number; completed: number }> = {};
      tasks.forEach((t: { category: string | null; status: string }) => {
        const cat = t.category || 'OTHER';
        if (!categories[cat]) categories[cat] = { total: 0, completed: 0 };
        categories[cat].total++;
        if (t.status === 'COMPLETED') categories[cat].completed++;
      });
      setLoading(false);
    });
  }, [status, session, router]);

  if (status === 'loading' || loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-accent-blue" /></div>;

  const completedTasks = 0;
  const totalTasks = 0;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Analytics</h1>
        <p className="text-text-muted mt-1">Track your performance and growth</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="glass p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-accent-blue/10 flex items-center justify-center">
                <Zap className="w-5 h-5 text-accent-blue" />
              </div>
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wider">Total XP</p>
                <p className="text-2xl font-bold">{user?.xp || 0}</p>
              </div>
            </div>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="glass p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-accent-green/10 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-accent-green" />
              </div>
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wider">Level</p>
                <p className="text-2xl font-bold">{user?.level || 1}</p>
              </div>
            </div>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="glass p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-accent-purple/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-accent-purple" />
              </div>
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wider">Rank</p>
                <p className="text-2xl font-bold gradient-text">{user?.rank || 'Newcomer'}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <div className="glass p-6">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-accent-blue" />
              XP Growth (30 days)
            </h3>
            {xpData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={xpData}>
                  <defs>
                    <linearGradient id="xpGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
                    labelStyle={{ color: '#f1f5f9' }}
                  />
                  <Area type="monotone" dataKey="xp" stroke="#3b82f6" fill="url(#xpGradient)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-text-muted text-sm">
                No data yet. Complete tasks to see your growth!
              </div>
            )}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <div className="glass p-6">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-accent-cyan" />
              XP Trend
            </h3>
            {xpData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={xpData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
                    labelStyle={{ color: '#f1f5f9' }}
                  />
                  <Line type="monotone" dataKey="xp" stroke="#06b6d4" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-text-muted text-sm">
                Start completing tasks to see trends
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
