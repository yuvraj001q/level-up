'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Users } from 'lucide-react';
import { FriendsPanel } from '@/components/social/FriendsPanel';
import { MessagesPanel } from '@/components/social/MessagesPanel';

export default function SocialPage() {
  const [chatTarget, setChatTarget] = useState<{ id: string; name: string } | null>(null);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
          <Users className="w-7 h-7 text-accent-purple" />
          Social
        </h1>
        <p className="text-text-muted mt-1">Connect with friends, chat, and build streaks</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <FriendsPanel onStartChat={(id, name) => setChatTarget({ id, name })} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <MessagesPanel
            key={chatTarget?.id || 'inbox'}
            friendId={chatTarget?.id}
            friendName={chatTarget?.name}
            onClose={() => setChatTarget(null)}
          />
        </motion.div>
      </div>
    </div>
  );
}
