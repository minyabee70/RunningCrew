/**
 * Phase 1 manual test scenarios — subscription tier logic (no DB required).
 * Run: npx tsx src/scripts/test-subscription-scenarios.ts
 */
import {
  resolveEffectiveTier,
  trialDaysLeft,
  canAccessFeature,
} from '../services/subscriptionService';
import type { User } from '../types';

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

function baseUser(overrides: Partial<User>): User {
  return {
    id: '1',
    google_id: 'g1',
    email: 'user@example.com',
    display_name: 'User',
    role: 'member',
    trial_started_at: daysAgo(0),
    subscription_status: 'trial',
    subscription_expires_at: null,
    language: 'ko',
    ui_theme: 'default',
    font_scale: 100,
    height_cm: 175,
    weight_kg: 70,
    created_at: new Date(),
    updated_at: new Date(),
    ...overrides,
  };
}

let passed = 0;
let failed = 0;

function assert(name: string, cond: boolean) {
  if (cond) {
    passed++;
    console.log(`  ✓ ${name}`);
  } else {
    failed++;
    console.error(`  ✗ ${name}`);
  }
}

console.log('Scenario 1: Google signup → 10-day trial (subscriber tier)');
{
  const u = baseUser({ trial_started_at: daysAgo(0), subscription_status: 'trial' });
  assert('trial days left > 0', trialDaysLeft(u) > 0);
  assert('effective tier subscriber', resolveEffectiveTier(u) === 'subscriber');
  assert('precision analysis allowed', canAccessFeature(resolveEffectiveTier(u), 'analysis_precision'));
}

console.log('\nScenario 2: trial_started_at 11 days ago → member lock');
{
  const u = baseUser({ trial_started_at: daysAgo(11), subscription_status: 'trial' });
  assert('trial days left = 0', trialDaysLeft(u) === 0);
  assert('effective tier member', resolveEffectiveTier(u) === 'member');
  assert('precision analysis locked', !canAccessFeature(resolveEffectiveTier(u), 'analysis_precision'));
  assert('journal still allowed', canAccessFeature(resolveEffectiveTier(u), 'journal'));
}

console.log('\nScenario 3: Admin grants active → premium unlocked');
{
  const u = baseUser({ subscription_status: 'active', trial_started_at: daysAgo(10) });
  assert('effective tier subscriber', resolveEffectiveTier(u) === 'subscriber');
  assert('advanced history allowed', canAccessFeature(resolveEffectiveTier(u), 'history_advanced'));
}

console.log('\nScenario 4: Admin sets free → member only');
{
  const u = baseUser({ subscription_status: 'free', trial_started_at: daysAgo(10) });
  assert('effective tier member', resolveEffectiveTier(u) === 'member');
  assert('advanced analysis locked', !canAccessFeature(resolveEffectiveTier(u), 'analysis_advanced'));
}

console.log('\nScenario 5: creator always admin tier');
{
  const u = baseUser({
    email: 'minyabee70@gmail.com',
    role: 'creator',
    subscription_status: 'free',
    trial_started_at: daysAgo(30),
  });
  assert('effective tier admin', resolveEffectiveTier(u) === 'admin');
  assert('admin_users allowed', canAccessFeature(resolveEffectiveTier(u), 'admin_users'));
}

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
