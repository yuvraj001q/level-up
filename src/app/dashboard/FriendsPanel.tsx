'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, UserPlus, UserCheck, Check, X, Send, MessageCircle } from 'lucide-react';
import { LeagueShield, getLeagueLabel } from '@/components/ui/LeagueShield';
import type { Friend, UserProfile } from '@/types';
import { useStore } from '@/store/useStore';

interface FriendWithUser extends Friend {
  user: {
    id: string;
    name: string | null;
    image: string | null;
    level: number;
    league: import('@/types').League;
  };
}

export function FriendsPanel({ onStartChat }: { onStartChat: (friendId: string, name: string) => void }) {
  const { user } = useStore();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Friend[]>([]);
  const [searchEmail, setSearchEmail] = useState('');
  const [searchResult, setSearchResult] = useState<UserProfile | null>(null);
  const [searching, setSearching] = useState(false);
  const [activeTab, setActiveTab] = useState<'friends' | 'requests' | 'add'>('friends');

  const loadFriends = async () => {
    const res = await fetch('/api/friends');
    const data = await res.json();
    if (Array.isArray(data)) {
      setFriends(data.filter((f: Friend) => f.status === 'ACCEPTED'));
      setPendingRequests(data.filter((f: Friend) => f.status === 'PENDING' && f.addresseeId === user?.id));
    }
  };

  useEffect(() => { loadFriends(); }, []);

  const handleSearch = async () => {
    if (!searchEmail.trim()) return;
    setSearching(true);
    const res = await fetch(`/api/users?email=${encodeURIComponent(searchEmail)}`);
    const data = await res.json();
    setSearchResult(data?.id ? data : null);
    setSearching(false);
  };

  const handleSendRequest = async (addresseeId: string) => {
    const res = await fetch('/api/friends', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ addresseeId }),
    });
    if (res.ok) {
      setSearchResult(null);
      setSearchEmail('');
      loadFriends();
    }
  };

  const handleRespond = async (id: string, status: 'ACCEPTED' | 'BLOCKED') => {
    await fetch('/api/friends', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    loadFriends();
  };

  const handleRemove = async (id: string) => {
    await fetch('/api/friends', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    loadFriends();
  };

  const tabs: { key: 'friends' | 'requests' | 'add'; label: string; icon: typeof Users; count?: number }[] = [
    { key: 'friends', label: 'Friends', icon: Users, count: friends.length },
    { key: 'requests', label: 'Requests', icon: UserCheck, count: pendingRequests.length },
    { key: 'add', label: 'Add Friend', icon: UserPlus },
  ];

  return (
    <div className="glass p-4">
      <div className="flex gap-1 mb-4 bg-bg-primary/50 rounded-lg p-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all flex-1 justify-center ${
              activeTab === tab.key ? 'bg-accent-blue/20 text-accent-blue' : 'text-text-muted hover:text-text-primary'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span className="bg-accent-blue/20 text-accent-blue text-[10px] px-1.5 rounded-full">{tab.count}</span>
            )}
          </button>
        ))}
      </div>

      {activeTab === 'friends' && (
        <div className="space-y-1.5 max-h-60 overflow-y-auto">
          {friends.length === 0 ? (
            <p className="text-sm text-text-muted text-center py-4">No friends yet. Add some!</p>
          ) : (
            friends.map((f) => (
              <div key={f.id} className="flex items-center gap-3 p-2 rounded-xl glass-hover">
                <LeagueShield league={f.otherUser.league} size={24} animate={false} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{f.otherUser.name || 'Anonymous'}</p>
                  <p className="text-[10px] text-text-muted">Lv.{f.otherUser.level} {getLeagueLabel(f.otherUser.league)}</p>
                </div>
                <button
                  onClick={() => onStartChat(f.otherUser.id, f.otherUser.name || 'Anonymous')}
                  className="p-1.5 rounded-lg hover:bg-accent-blue/10 text-text-muted hover:text-accent-blue transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleRemove(f.id)}
                  className="p-1.5 rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-400 transition-all"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'requests' && (
        <div className="space-y-1.5 max-h-60 overflow-y-auto">
          {pendingRequests.length === 0 ? (
            <p className="text-sm text-text-muted text-center py-4">No pending requests</p>
          ) : (
            pendingRequests.map((f) => (
              <div key={f.id} className="flex items-center gap-3 p-2 rounded-xl glass-hover">
                <LeagueShield league={f.otherUser.league} size={24} animate={false} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{f.otherUser.name || 'Anonymous'}</p>
                  <p className="text-[10px] text-text-muted">Lv.{f.otherUser.level}</p>
                </div>
                <button
                  onClick={() => handleRespond(f.id, 'ACCEPTED')}
                  className="p-1.5 rounded-lg hover:bg-accent-green/10 text-text-muted hover:text-accent-green transition-all"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleRespond(f.id, 'BLOCKED')}
                  className="p-1.5 rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-400 transition-all"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'add' && (
        <div>
          <div className="flex gap-2 mb-3">
            <input
              type="email"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              placeholder="Search by email..."
              className="flex-1 bg-bg-primary/50 border border-border-subtle rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent-blue/50"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
              onClick={handleSearch}
              disabled={searching}
              className="px-3 py-2 rounded-lg bg-accent-blue/10 text-accent-blue text-sm font-medium hover:bg-accent-blue/20 transition-all disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          {searchResult && (
            <div className="flex items-center gap-3 p-2 rounded-xl glass-hover">
              <LeagueShield league={searchResult.league} size={24} animate={false} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{searchResult.name || 'Anonymous'}</p>
                <p className="text-[10px] text-text-muted">{searchResult.email}</p>
              </div>
              <button
                onClick={() => handleSendRequest(searchResult.id)}
                className="p-1.5 rounded-lg bg-accent-blue/10 text-accent-blue hover:bg-accent-blue/20 transition-all"
              >
                <UserPlus className="w-4 h-4" />
              </button>
            </div>
          )}
          {searchResult === null && searchEmail && !searching && (
            <p className="text-sm text-text-muted text-center py-2">No user found with that email</p>
          )}
        </div>
      )}
    </div>
  );
}
