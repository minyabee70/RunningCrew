/** Google OAuth credentials look valid for NextAuth (server-side only). */
export function isGoogleAuthConfigured(): boolean {
  const id = process.env.GOOGLE_CLIENT_ID?.trim() ?? '';
  const secret = process.env.GOOGLE_CLIENT_SECRET?.trim() ?? '';
  if (!id || !secret) return false;
  if (id === 'placeholder' || secret === 'placeholder') return false;
  if (id.includes('your_google') || secret.includes('your_google')) return false;
  // Google OAuth client IDs end with .apps.googleusercontent.com
  return id.includes('.apps.googleusercontent.com') && secret.length >= 10;
}
