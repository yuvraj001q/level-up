'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Zap, ArrowRight, Sparkles, Swords, Trophy, BarChart3, Users, Download, Shield, Star } from 'lucide-react';

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/dashboard');
    }
  }, [status, router]);

  return (
    <div className="min-h-screen">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="relative z-10"
      >
        <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto">
          <motion.div variants={fadeUp} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-blue to-accent-cyan flex items-center justify-center shadow-lg shadow-accent-blue/20">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold gradient-text">Level Up</span>
          </motion.div>
          <motion.div variants={fadeUp} className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-accent-blue to-accent-cyan text-white text-sm font-semibold hover:opacity-90 transition-all hover:shadow-lg hover:shadow-accent-blue/20"
            >
              Get Started
            </Link>
          </motion.div>
        </nav>

        <div className="max-w-7xl mx-auto px-6 pt-20 pb-32">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div variants={fadeUp}>
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium bg-accent-blue/10 text-accent-blue border border-accent-blue/20 mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                AI-Powered Gamified Productivity
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-5xl md:text-7xl font-bold leading-tight mb-6"
            >
              Turn your life
              <br />
              <span className="gradient-text animate-gradient inline-block">into a game</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              Level up your life with AI-generated quests, XP rewards, achievements, and streaks. 
              The most engaging productivity platform ever built.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="flex items-center justify-center gap-4 flex-wrap"
            >
              <Link
                href="/register"
                className="group px-8 py-4 rounded-xl bg-gradient-to-r from-accent-blue to-accent-cyan text-white font-semibold text-lg hover:opacity-90 transition-all hover:shadow-xl hover:shadow-accent-blue/20 flex items-center gap-2"
              >
                Start Your Journey
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/login"
                className="px-8 py-4 rounded-xl glass text-text-primary font-semibold text-lg hover:bg-bg-glass-hover transition-all border-border-subtle"
              >
                Sign In
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-6">
              <Link
                href="/download"
                className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors group"
              >
                <Download className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                Download the mobile app
              </Link>
            </motion.div>

            {/* Stats row */}
            <motion.div
              variants={fadeUp}
              className="flex items-center justify-center gap-8 mt-12 flex-wrap"
            >
              {[
                { icon: Star, label: 'AI Quests', value: 'Smart' },
                { icon: Trophy, label: 'Levels', value: '10 Tiers' },
                { icon: Shield, label: 'Leagues', value: 'Ranked' },
              ].map((stat, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-text-muted">
                  <stat.icon className="w-4 h-4 text-accent-blue/60" />
                  <span>{stat.label}</span>
                  <span className="text-accent-blue font-medium">{stat.value}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Features */}
          <motion.div
            variants={fadeUp}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32 max-w-5xl mx-auto"
          >
            {[
              {
                icon: Swords,
                title: 'AI Quests',
                desc: 'Personalized tasks generated by AI based on your goals and progress. Every day brings fresh challenges.',
                color: 'text-accent-purple',
                bgColor: 'bg-accent-purple/10',
                borderColor: 'border-accent-purple/20',
                glowColor: 'shadow-purple-500/10',
              },
              {
                icon: Trophy,
                title: 'Level & XP',
                desc: 'Earn XP, level up through 10 ranks, unlock achievements, and maintain your streaks. Compete and rise.',
                color: 'text-accent-orange',
                bgColor: 'bg-accent-orange/10',
                borderColor: 'border-accent-orange/20',
                glowColor: 'shadow-orange-500/10',
              },
              {
                icon: BarChart3,
                title: 'Analytics',
                desc: 'Beautiful charts showing your growth, completion rates, and trends over time. Data that motivates.',
                color: 'text-accent-cyan',
                bgColor: 'bg-accent-cyan/10',
                borderColor: 'border-accent-cyan/20',
                glowColor: 'shadow-cyan-500/10',
              },
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={i}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className={`glass-hover p-8 text-center group ${feature.glowColor}`}
                >
                  <div
                    className={`w-16 h-16 mx-auto mb-5 rounded-2xl ${feature.bgColor} border ${feature.borderColor} flex items-center justify-center group-hover:scale-110 transition-transform`}
                  >
                    <Icon className={`w-8 h-8 ${feature.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{feature.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Social proof / community section */}
          <motion.div
            variants={fadeUp}
            className="mt-24 text-center max-w-2xl mx-auto"
          >
            <div className="glass p-8">
              <Users className="w-8 h-8 text-accent-blue mx-auto mb-4" />
              <p className="text-lg text-text-secondary">
                Join a growing community of players leveling up their lives.
                <br />
                <Link href="/register" className="text-accent-blue hover:text-accent-cyan transition-colors font-medium">
                  Start your journey today
                </Link>
              </p>
            </div>
          </motion.div>
        </div>

        <footer className="border-t border-border-subtle py-8">
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between flex-wrap gap-2">
            <p className="text-sm text-text-muted flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-accent-blue" />
              Level Up &mdash; Turn your life into a game
            </p>
            <p className="text-sm text-text-muted">&copy; {new Date().getFullYear()}</p>
          </div>
        </footer>
      </motion.div>
    </div>
  );
}
