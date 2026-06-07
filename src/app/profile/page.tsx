'use client';

import { useEffect, useState } from 'react';
import { useRequireAuth } from '@/lib/useRequireAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Loader2, Zap, Award, Flame, BarChart3, Trophy, Mail, Lock, Eye, EyeOff, CheckCircle2, Phone, Smartphone } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { getLevelInfo } from '@/lib/game';
import { getLeagueLabel } from '@/components/ui/LeagueShield';
import type { Goal } from '@/types';

const GOALS: { value: Goal; label: string; emoji: string }[] = [
  { value: 'FITNESS', label: 'Fitness', emoji: '💪' },
  { value: 'LEARNING', label: 'Learning', emoji: '📚' },
  { value: 'CODING', label: 'Coding', emoji: '💻' },
  { value: 'READING', label: 'Reading', emoji: '📖' },
  { value: 'BUSINESS', label: 'Business', emoji: '💼' },
  { value: 'SELF_IMPROVEMENT', label: 'Self Improvement', emoji: '🌱' },
  { value: 'NDA_PREPARATION', label: 'NDA Preparation', emoji: '🎯' },
  { value: 'CAREER_GROWTH', label: 'Career Growth', emoji: '📈' },
  { value: 'COMMUNICATION_SKILLS', label: 'Communication', emoji: '🗣️' },
  { value: 'CREATIVITY', label: 'Creativity', emoji: '🎨' },
  { value: 'MINDFULNESS', label: 'Mindfulness', emoji: '🧘' },
  { value: 'PRODUCTIVITY', label: 'Productivity', emoji: '⚡' },
  { value: 'FINANCE', label: 'Finance', emoji: '💰' },
  { value: 'HEALTH_WELLNESS', label: 'Health & Wellness', emoji: '🏥' },
  { value: 'TRAVEL', label: 'Travel', emoji: '✈️' },
  { value: 'SOCIAL_SKILLS', label: 'Social Skills', emoji: '🤝' },
  { value: 'WRITING', label: 'Writing', emoji: '✍️' },
  { value: 'LANGUAGE', label: 'Language', emoji: '🌍' },
  { value: 'MUSIC', label: 'Music', emoji: '🎵' },
];

const LEAGUE_LABELS: Record<string, string> = {};

const getLeagueLabelSafe = (league: string) => getLeagueLabel(league as any) || league;

export default function ProfilePage() {
  const { session, status, update } = useRequireAuth();
  const { user, setUser } = useStore();
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [bio, setBio] = useState('');
  const [selectedGoals, setSelectedGoals] = useState<Goal[]>([]);
  const [interestsStr, setInterestsStr] = useState('');
  const [saving, setSaving] = useState(false);
  const [tasksCompleted, setTasksCompleted] = useState(0);
  const [questsCompleted, setQuestsCompleted] = useState(0);

  const [showEmailEdit, setShowEmailEdit] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [emailPassword, setEmailPassword] = useState('');
  const [emailUpdating, setEmailUpdating] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [emailSuccess, setEmailSuccess] = useState(false);

  const [showPasswordEdit, setShowPasswordEdit] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordUpdating, setPasswordUpdating] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [showCurPw, setShowCurPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfPw, setShowConfPw] = useState(false);

  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [phoneUpdating, setPhoneUpdating] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [phoneSuccess, setPhoneSuccess] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);

  useEffect(() => {
    if (status !== 'authenticated' || !session?.user?.id) return;

    fetch(`/api/users/${session.user.id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.id) {
          setUser(data);
          setName(data.name || '');
          setAge(data.age || '');
          setBio(data.bio || '');
          setSelectedGoals(data.goals || []);
          setInterestsStr((data.interests || []).join(', '));
          setPhone(data.phone || '');
          setPhoneVerified(data.phoneVerified || false);
        }
      })
      .catch(() => {});

    fetch(`/api/tasks?userId=${session.user.id}`)
      .then((r) => r.json())
      .then((data) => setTasksCompleted(Array.isArray(data) ? data.filter((t: any) => t.status === 'COMPLETED').length : 0))
      .catch(() => {});

    fetch(`/api/quests?userId=${session.user.id}`)
      .then((r) => r.json())
      .then((data) => setQuestsCompleted(Array.isArray(data) ? data.filter((q: any) => q.status === 'COMPLETED').length : 0))
      .catch(() => {});
  }, [status, session, setUser]);

  const handleSave = async () => {
    if (!session?.user?.id) return;
    setSaving(true);

    const res = await fetch('/api/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: session.user.id,
        name,
        age: age || null,
        bio,
        goals: selectedGoals,
        interests: interestsStr.split(',').map((s) => s.trim()).filter(Boolean),
      }),
    });

    if (res.ok) {
      const updated = await res.json();
      setUser(updated);
      await update();
    }
    setSaving(false);
  };

  const handleEmailUpdate = async () => {
    if (!session?.user?.id || !newEmail || !emailPassword) return;
    setEmailUpdating(true);
    setEmailError('');
    setEmailSuccess(false);
    const res = await fetch('/api/auth/update-credentials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: session.user.id, currentPassword: emailPassword, newEmail }),
    });
    const data = await res.json();
    if (res.ok) {
      setEmailSuccess(true);
      setNewEmail('');
      setEmailPassword('');
      setTimeout(() => { setShowEmailEdit(false); setEmailSuccess(false); }, 2000);
      await update();
    } else {
      setEmailError(data.error || 'Failed to update email');
    }
    setEmailUpdating(false);
  };

  const handlePasswordUpdate = async () => {
    if (!session?.user?.id || !currentPassword || !newPassword) return;
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }
    setPasswordUpdating(true);
    setPasswordError('');
    setPasswordSuccess(false);
    const res = await fetch('/api/auth/update-credentials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: session.user.id, currentPassword, newPassword }),
    });
    const data = await res.json();
    if (res.ok) {
      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => { setShowPasswordEdit(false); setPasswordSuccess(false); }, 2000);
    } else {
      setPasswordError(data.error || 'Failed to update password');
    }
    setPasswordUpdating(false);
  };

  const handleSendOtp = async () => {
    if (!session?.user?.id || !phone) return;
    setPhoneUpdating(true);
    setPhoneError('');
    setPhoneSuccess(false);
    const res = await fetch('/api/auth/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: session.user.id, phone }),
    });
    const data = await res.json();
    if (res.ok) {
      setOtpSent(true);
      setOtpCode('');
      if (data.debug) console.log('OTP:', data.debug);
    } else {
      setPhoneError(data.error || 'Failed to send OTP');
    }
    setPhoneUpdating(false);
  };

  const handleVerifyOtp = async () => {
    if (!session?.user?.id || !phone || !otpCode) return;
    setPhoneUpdating(true);
    setPhoneError('');
    setPhoneSuccess(false);
    const res = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: session.user.id, phone, otp: otpCode }),
    });
    const data = await res.json();
    if (res.ok) {
      setPhoneVerified(true);
      setPhoneSuccess(true);
      setOtpSent(false);
      setOtpCode('');
      if (data.user) setUser(data.user);
      setTimeout(() => setPhoneSuccess(false), 3000);
    } else {
      setPhoneError(data.error || 'Verification failed');
    }
    setPhoneUpdating(false);
  };

  const toggleGoal = (goal: Goal) => {
    setSelectedGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
  };

  if (status === 'loading') return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-accent-blue border-t-transparent rounded-full animate-spin" /></div>;

  const levelInfo = user ? getLevelInfo(user.xp) : null;

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Profile</h1>
        <p className="text-text-muted mt-1">Manage your profile and preferences</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="glass p-6">
              <h2 className="text-lg font-semibold mb-4">Personal Info</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-text-secondary mb-1">Name</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-bg-primary border border-border-subtle rounded-xl py-2.5 px-4 text-sm text-text-primary focus:outline-none focus:border-accent-blue/50"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm text-text-secondary mb-1">Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value ? parseInt(e.target.value) : '')}
                    className="w-full bg-bg-primary border border-border-subtle rounded-xl py-2.5 px-4 text-sm text-text-primary focus:outline-none focus:border-accent-blue/50"
                    placeholder="Your age"
                    min={1}
                    max={150}
                  />
                </div>
                <div>
                  <label className="block text-sm text-text-secondary mb-1">Bio</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full bg-bg-primary border border-border-subtle rounded-xl py-2.5 px-4 text-sm text-text-primary focus:outline-none focus:border-accent-blue/50 resize-none"
                    rows={3}
                    placeholder="Tell us about yourself"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <div className="glass p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Email</h2>
                <button onClick={() => { setShowEmailEdit(!showEmailEdit); setEmailError(''); setEmailSuccess(false); }} className="text-xs text-accent-blue hover:underline">
                  {showEmailEdit ? 'Cancel' : 'Change'}
                </button>
              </div>
              <p className="text-sm text-text-secondary mb-1">Current email</p>
              <p className="text-sm font-medium mb-3">{user?.email}</p>

              <AnimatePresence>
                {showEmailEdit && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden space-y-3">
                    <div>
                      <label className="block text-sm text-text-secondary mb-1">New Email</label>
                      <input
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        className="w-full bg-bg-primary border border-border-subtle rounded-xl py-2 px-3 text-sm text-text-primary focus:outline-none focus:border-accent-blue/50"
                        placeholder="new@email.com"
                        type="email"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-text-secondary mb-1">Current Password</label>
                      <input
                        value={emailPassword}
                        onChange={(e) => setEmailPassword(e.target.value)}
                        className="w-full bg-bg-primary border border-border-subtle rounded-xl py-2 px-3 text-sm text-text-primary focus:outline-none focus:border-accent-blue/50"
                        placeholder="Enter password to confirm"
                        type="password"
                      />
                    </div>
                    {emailError && <p className="text-xs text-accent-red">{emailError}</p>}
                    {emailSuccess && <p className="text-xs text-accent-green flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Email updated!</p>}
                    <button
                      onClick={handleEmailUpdate}
                      disabled={emailUpdating || !newEmail || !emailPassword}
                      className="w-full py-2 rounded-xl bg-accent-blue/10 text-accent-blue border border-accent-blue/20 text-sm font-medium hover:bg-accent-blue/20 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {emailUpdating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Mail className="w-3 h-3" />}
                      Update Email
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="glass p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Password</h2>
                <button onClick={() => { setShowPasswordEdit(!showPasswordEdit); setPasswordError(''); setPasswordSuccess(false); }} className="text-xs text-accent-blue hover:underline">
                  {showPasswordEdit ? 'Cancel' : 'Change'}
                </button>
              </div>
              <p className="text-xs text-text-muted">••••••••</p>

              <AnimatePresence>
                {showPasswordEdit && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden space-y-3 mt-3">
                    <div>
                      <label className="block text-sm text-text-secondary mb-1">Current Password</label>
                      <div className="relative">
                        <input
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full bg-bg-primary border border-border-subtle rounded-xl py-2 px-3 text-sm text-text-primary focus:outline-none focus:border-accent-blue/50 pr-9"
                          type={showCurPw ? 'text' : 'password'}
                          placeholder="Current password"
                        />
                        <button onClick={() => setShowCurPw(!showCurPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary">
                          {showCurPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-text-secondary mb-1">New Password</label>
                      <div className="relative">
                        <input
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full bg-bg-primary border border-border-subtle rounded-xl py-2 px-3 text-sm text-text-primary focus:outline-none focus:border-accent-blue/50 pr-9"
                          type={showNewPw ? 'text' : 'password'}
                          placeholder="Min 6 characters"
                        />
                        <button onClick={() => setShowNewPw(!showNewPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary">
                          {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-text-secondary mb-1">Confirm New Password</label>
                      <div className="relative">
                        <input
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full bg-bg-primary border border-border-subtle rounded-xl py-2 px-3 text-sm text-text-primary focus:outline-none focus:border-accent-blue/50 pr-9"
                          type={showConfPw ? 'text' : 'password'}
                          placeholder="Re-enter new password"
                        />
                        <button onClick={() => setShowConfPw(!showConfPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary">
                          {showConfPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    {passwordError && <p className="text-xs text-accent-red">{passwordError}</p>}
                    {passwordSuccess && <p className="text-xs text-accent-green flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Password updated!</p>}
                    <button
                      onClick={handlePasswordUpdate}
                      disabled={passwordUpdating || !currentPassword || !newPassword || !confirmPassword}
                      className="w-full py-2 rounded-xl bg-accent-orange/10 text-accent-orange border border-accent-orange/20 text-sm font-medium hover:bg-accent-orange/20 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {passwordUpdating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Lock className="w-3 h-3" />}
                      Update Password
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}>
            <div className="glass p-6">
              <h2 className="text-lg font-semibold mb-4">Phone Number</h2>
              <p className="text-xs text-text-muted mb-3">
                {phoneVerified
                  ? 'Your phone number is verified.'
                  : phone
                    ? 'Verify your phone number to enable it.'
                    : 'Add a phone number for extra account security.'}
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="flex-1 relative">
                    <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                      value={phone}
                      onChange={(e) => { setPhone(e.target.value); setOtpSent(false); setPhoneVerified(false); }}
                      className="w-full bg-bg-primary border border-border-subtle rounded-xl py-2.5 pl-9 pr-4 text-sm text-text-primary focus:outline-none focus:border-accent-blue/50 disabled:opacity-50"
                      placeholder="+1 (555) 123-4567"
                      disabled={phoneVerified}
                    />
                  </div>
                  {!phoneVerified && phone && (
                    <button
                      onClick={otpSent ? handleVerifyOtp : handleSendOtp}
                      disabled={phoneUpdating || !phone}
                      className="px-4 py-2.5 rounded-xl text-xs font-medium bg-accent-blue/10 text-accent-blue border border-accent-blue/20 hover:bg-accent-blue/20 transition-colors disabled:opacity-50 whitespace-nowrap"
                    >
                      {phoneUpdating ? <Loader2 className="w-3 h-3 animate-spin" /> : otpSent ? 'Verify' : 'Send OTP'}
                    </button>
                  )}
                  {phoneVerified && (
                    <span className="flex items-center gap-1 text-xs text-accent-green"><CheckCircle2 className="w-3 h-3" /> Verified</span>
                  )}
                </div>
                {otpSent && !phoneVerified && (
                  <div className="flex items-center gap-2">
                    <input
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="w-32 bg-bg-primary border border-border-subtle rounded-xl py-2 px-3 text-sm text-text-primary text-center tracking-widest focus:outline-none focus:border-accent-blue/50"
                      placeholder="000000"
                      maxLength={6}
                    />
                    <button onClick={handleSendOtp} disabled={phoneUpdating} className="text-xs text-accent-blue hover:underline">
                      Resend
                    </button>
                  </div>
                )}
                {phoneError && <p className="text-xs text-accent-red">{phoneError}</p>}
                {phoneSuccess && <p className="text-xs text-accent-green flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Phone verified successfully!</p>}
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.27 }}>
            <div className="glass p-6">
              <h2 className="text-lg font-semibold mb-4">Your Goals</h2>
              <p className="text-xs text-text-muted mb-4">Select the areas you want to improve in</p>
              <div className="flex flex-wrap gap-2">
                {GOALS.map((goal) => (
                  <button
                    key={goal.value}
                    onClick={() => toggleGoal(goal.value)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      selectedGoals.includes(goal.value)
                        ? 'bg-accent-blue/10 text-accent-blue border border-accent-blue/20'
                        : 'bg-bg-glass text-text-muted border border-border-subtle hover:text-text-secondary'
                    }`}
                  >
                    {goal.emoji} {goal.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <div className="glass p-6">
              <h2 className="text-lg font-semibold mb-4">Interests</h2>
              <p className="text-xs text-text-muted mb-4">Comma-separated list of your interests (e.g., Yoga, Python, Marketing)</p>
              <input
                value={interestsStr}
                onChange={(e) => setInterestsStr(e.target.value)}
                className="w-full bg-bg-primary border border-border-subtle rounded-xl py-2.5 px-4 text-sm text-text-primary focus:outline-none focus:border-accent-blue/50"
                placeholder="Yoga, Python, Marketing, Reading..."
              />
            </div>
          </motion.div>
        </div>

        <div className="space-y-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="glass p-6 text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-accent-blue to-accent-cyan flex items-center justify-center">
                <span className="text-3xl font-bold text-white">
                  {user?.name?.[0]?.toUpperCase() || '?'}
                </span>
              </div>
              <p className="text-lg font-semibold">{user?.name || 'Anonymous'}</p>
              <p className="text-sm text-text-muted">{user?.email}</p>
            </div>
          </motion.div>

          {levelInfo && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <div className="glass p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <Zap className="w-4 h-4 text-accent-blue" />
                  <div className="flex-1">
                    <p className="text-xs text-text-muted">Level {levelInfo.level} — {levelInfo.rank}</p>
                    <div className="mt-1 h-1.5 w-full bg-bg-primary rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-accent-blue to-accent-cyan rounded-full transition-all" style={{ width: `${levelInfo.progress}%` }} />
                    </div>
                    <p className="text-[10px] text-text-muted mt-0.5">{levelInfo.currentXp} / {levelInfo.xpForNext} XP</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Trophy className="w-4 h-4 text-accent-orange" />
                  <div>
                    <p className="text-xs text-text-muted">League</p>
                    <p className="text-sm font-medium">{LEAGUE_LABELS[user?.league || 'BRONZE'] || user?.league}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Award className="w-4 h-4 text-accent-purple" />
                  <div>
                    <p className="text-xs text-text-muted">Achievement Points</p>
                    <p className="text-sm font-medium">{user?.achievementPoints || 0}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Flame className="w-4 h-4 text-accent-orange" />
                  <div>
                    <p className="text-xs text-text-muted">Best Streak</p>
                    <p className="text-sm font-medium">{user?.longestStreak || 0} days</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-4 h-4 text-accent-green" />
                  <div>
                    <p className="text-xs text-text-muted">Completed</p>
                    <p className="text-sm font-medium">{tasksCompleted} tasks · {questsCompleted} quests</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            disabled={saving}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-accent-blue to-accent-cyan text-white font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : 'Save Changes'}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
