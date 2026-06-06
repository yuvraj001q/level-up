import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const sha = process.env.VERCEL_GIT_COMMIT_SHA || 'dev';
  const deployedAt = process.env.VERCEL_GIT_COMMIT_SHA
    ? new Date().toISOString()
    : new Date().toISOString();

  return NextResponse.json({
    version: sha.slice(0, 7),
    fullSha: sha,
    deployedAt,
    env: process.env.VERCEL_ENV || 'development',
  });
}
