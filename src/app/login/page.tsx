'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Zap, Mail, Lock, Loader2, Eye, EyeOff, Sparkles } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (!result) {
        setError('Authentication service unavailable');
        setLoading(false);
      } else if (result.error) {
        setError('Invalid email or password');
        setLoading(false);
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connection failed. Check your network and try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative md:-ml-64 md:w-[calc(100%+16rem)]">
      {/* Decorative corner elements */}
      <div className="absolute top-10 left-10 w-16 h-16 border border-accent-blue/10 rounded-2xl rotate-12 hidden lg:block" />
      <div className="absolute top-20 left-20 w-8 h-8 border border-accent-cyan/10 rounded-lg -rotate-12 hidden lg:block" />
      <div className="absolute bottom-10 right-10 w-20 h-20 border border-accent-purple/10 rounded-full hidden lg:block" />
      <div className="absolute bottom-20 right-20 w-10 h-10 border border-accent-green/10 rounded-xl rotate-45 hidden lg:block" />
      <div className="absolute top-1/3 right-10 w-4 h-4 bg-accent-blue/10 rounded-full animate-pulse hidden lg:block" />
      <div className="absolute bottom-1/3 left-10 w-3 h-3 bg-accent-cyan/10 rounded-full animate-pulse hidden lg:block" style={{ animationDelay: '1s' }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <div
          className="relative rounded-2xl p-[1px]"
          style={{ animation: 'border-glow 3s ease-in-out infinite' }}
        >
          <div className="glass p-8 rounded-2xl bg-bg-secondary/90 backdrop-blur-xl">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              <motion.div variants={itemVariants} className="text-center">
                <div className="relative inline-block mb-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                    className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-blue to-accent-cyan flex items-center justify-center relative"
                  >
                    <Zap className="w-8 h-8 text-white" />
                    <motion.div
                      animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 rounded-2xl bg-accent-blue/20"
                    />
                  </motion.div>
                </div>
                <h1 className="text-2xl font-bold gradient-text">Welcome Back</h1>
                <p className="text-text-muted text-sm mt-1">Continue your journey</p>
              </motion.div>

              <motion.form
                variants={containerVariants}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">Email</label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-accent-blue transition-colors" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-bg-primary border border-border-subtle rounded-xl py-3 pl-10 pr-4 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-blue/50 focus:ring-1 focus:ring-accent-blue/20 transition-all"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-accent-blue transition-colors" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-bg-primary border border-border-subtle rounded-xl py-3 pl-10 pr-10 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-blue/50 focus:ring-1 focus:ring-accent-blue/20 transition-all"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </motion.div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-accent-red text-sm bg-accent-red/5 rounded-xl px-4 py-2 border border-accent-red/10"
                  >
                    {error}
                  </motion.p>
                )}

                <motion.button
                  variants={itemVariants}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-accent-blue to-accent-cyan text-white font-semibold text-sm hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors" />
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  {loading ? 'Signing in...' : 'Sign In'}
                </motion.button>
              </motion.form>

              <motion.div variants={itemVariants} className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border-subtle" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-bg-secondary px-3 text-text-muted">New here?</span>
                </div>
              </motion.div>

              <motion.p
                variants={itemVariants}
                className="text-center text-sm text-text-muted"
              >
                <Link
                  href="/register"
                  className="text-accent-blue hover:text-accent-cyan transition-colors font-medium"
                >
                  Create an account &rarr;
                </Link>
              </motion.p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
