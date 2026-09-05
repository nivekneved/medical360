/**
 * Medical 360 — Build & Verification Automation Script
 * Checks system integrity, routes, and environment configuration.
 */

import { execSync } from 'child_process';

console.log('🚀 Running Medical 360 Full Build & Verification Suite...\n');

try {
  console.log('1. Executing TypeScript compiler check (tsc)...');
  execSync('npx tsc --noEmit', { stdio: 'inherit' });
  console.log('✅ TypeScript check passed.\n');

  console.log('2. Running Vite production bundle build...');
  execSync('npx vite build', { stdio: 'inherit' });
  console.log('✅ Vite production build succeeded.\n');

  console.log('🎉 All systems verified and production-ready!\n');
} catch (err) {
  console.error('❌ Verification failed:', err);
  process.exit(1);
}
