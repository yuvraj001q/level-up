'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Zap, Smartphone, Package, Download, ArrowLeft, ExternalLink } from 'lucide-react';

export default function DownloadPage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent-blue/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-cyan/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-accent-blue to-accent-cyan flex items-center justify-center">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-3">
            Get the <span className="gradient-text">App</span>
          </h1>
          <p className="text-text-secondary max-w-xl mx-auto">
            Install Level Up on your device for the best experience. Choose your preferred method below.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <div className="glass p-8 h-full">
              <div className="w-12 h-12 rounded-xl bg-accent-blue/10 flex items-center justify-center mb-4">
                <Smartphone className="w-6 h-6 text-accent-blue" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Install via Browser</h2>
              <p className="text-sm text-text-secondary mb-4">
                No download needed. Works on Android and iOS directly from your browser.
              </p>
              <ul className="text-sm text-text-muted space-y-2 mb-6">
                <li>1. Open level-up-theta-tawny.vercel.app in Chrome</li>
                <li>2. Tap the menu (three dots)</li>
                <li>3. Select &quot;Add to Home Screen&quot;</li>
                <li>4. The app appears on your home screen</li>
              </ul>
              <a
                href="https://level-up-theta-tawny.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-accent-blue hover:text-accent-cyan transition-colors"
              >
                Open Website <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <div className="glass p-8 h-full">
              <div className="w-12 h-12 rounded-xl bg-accent-purple/10 flex items-center justify-center mb-4">
                <Package className="w-6 h-6 text-accent-purple" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Download APK</h2>
              <p className="text-sm text-text-secondary mb-4">
                Native Android app. Sideload on any device for a full-screen experience.
              </p>
              <ul className="text-sm text-text-muted space-y-2 mb-6">
                <li>1. Download the APK file below</li>
                <li>2. Open the file on your Android device</li>
                <li>3. Allow installation from unknown sources</li>
                <li>4. Launch Level Up from your app drawer</li>
              </ul>
              <div className="flex flex-col gap-2">
                <a
                  href="https://github.com/yuvraj001q/level-up/releases/download/latest/level-up.apk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-accent-purple to-accent-blue text-white font-semibold text-sm hover:opacity-90 transition-opacity"
                >
                  <Download className="w-4 h-4" />
                  Download APK
                </a>
                <p className="text-xs text-text-muted">Version 1.0 &bull; Android 8.0+ &bull; Built automatically via GitHub</p>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="glass p-6 text-center">
          <p className="text-sm text-text-secondary">
            The APK is built automatically on every code push. After a push, wait ~5 minutes for GitHub Actions to finish, then refresh this page to download.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
