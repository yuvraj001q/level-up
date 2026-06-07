'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Send, ArrowLeft, Users } from 'lucide-react';
import type { Conversation, MessageData } from '@/types';
import { useStore } from '@/store/useStore';

interface Props {
  friendId?: string;
  friendName?: string;
  onClose: () => void;
}

export function MessagesPanel({ friendId, friendName, onClose }: Props) {
  const { user } = useStore();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [input, setInput] = useState('');
  const messagesEnd = useRef<HTMLDivElement>(null);

  const loadConversations = async () => {
    const res = await fetch('/api/conversations');
    const data = await res.json();
    if (Array.isArray(data)) setConversations(data);
  };

  const loadMessages = async (convId: string) => {
    const res = await fetch(`/api/messages?conversationId=${convId}`);
    const data = await res.json();
    if (Array.isArray(data)) setMessages(data);
  };

  useEffect(() => { loadConversations(); }, []);

  useEffect(() => {
    if (!friendId) return;
    const findOrCreateConv = async () => {
      const res = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participantIds: [friendId] }),
      });
      const conv = await res.json();
      if (conv?.id) {
        setActiveConv(conv);
        loadMessages(conv.id);
        loadConversations();
      }
    };
    findOrCreateConv();
  }, [friendId]);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !activeConv) return;
    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conversationId: activeConv.id, content: input }),
    });
    const msg = await res.json();
    if (msg?.id) {
      setMessages((prev) => [...prev, msg]);
      setInput('');
    }
  };

  const openConversation = (conv: Conversation) => {
    setActiveConv(conv);
    loadMessages(conv.id);
  };

  const otherParticipants = (conv: Conversation) =>
    conv.participants.filter((p) => p.id !== user?.id);

  if (activeConv) {
    return (
      <div className="glass p-4 flex flex-col h-full">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => { setActiveConv(null); onClose(); }} className="p-1 rounded-lg hover:bg-bg-primary/50 transition-colors">
            <ArrowLeft className="w-4 h-4 text-text-muted" />
          </button>
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-accent-blue" />
            <p className="text-sm font-medium">
              {otherParticipants(activeConv).map((p) => p.name || 'Anonymous').join(', ') || 'Chat'}
            </p>
          </div>
        </div>

        <div className="flex-1 space-y-2 overflow-y-auto max-h-64 mb-3 px-1">
          {messages.length === 0 ? (
            <p className="text-sm text-text-muted text-center py-8">Start a conversation!</p>
          ) : (
            messages.map((msg) => {
              const isMe = msg.senderId === user?.id;
              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[75%] px-3 py-2 rounded-xl text-sm ${
                      isMe
                        ? 'bg-accent-blue/20 text-accent-blue rounded-tr-sm'
                        : 'bg-bg-primary/50 text-text-primary rounded-tl-sm'
                    }`}
                  >
                    <p>{msg.content}</p>
                    <p className="text-[10px] opacity-60 mt-0.5">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEnd} />
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-bg-primary/50 border border-border-subtle rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent-blue/50"
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="p-2 rounded-lg bg-accent-blue/10 text-accent-blue hover:bg-accent-blue/20 transition-all disabled:opacity-30"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass p-4">
      <div className="flex items-center gap-2 mb-3">
        <Users className="w-4 h-4 text-accent-purple" />
        <h3 className="text-sm font-semibold">Conversations</h3>
      </div>
      <div className="space-y-1 max-h-60 overflow-y-auto">
        {conversations.length === 0 ? (
          <p className="text-sm text-text-muted text-center py-4">No conversations yet</p>
        ) : (
          conversations.map((conv) => {
            const others = otherParticipants(conv);
            return (
              <button
                key={conv.id}
                onClick={() => openConversation(conv)}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl glass-hover text-left"
              >
                <div className="w-8 h-8 rounded-full bg-accent-purple/10 flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-accent-purple" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {others.map((p) => p.name || 'Anonymous').join(', ') || 'Chat'}
                  </p>
                  {conv.lastMessage && (
                    <p className="text-xs text-text-muted truncate">
                      {conv.lastMessage.senderId === user?.id ? 'You: ' : ''}{conv.lastMessage.content}
                    </p>
                  )}
                </div>
                {conv.lastMessage && (
                  <span className="text-[10px] text-text-muted">
                    {new Date(conv.lastMessage.createdAt).toLocaleDateString()}
                  </span>
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
