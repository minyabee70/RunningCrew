import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { syncAuth } from '@/services/api';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        const googleId = profile.sub ?? account.providerAccountId;
        const email = profile.email ?? '';
        const displayName = profile.name ?? email;
        try {
          const { token: apiToken, user } = await syncAuth({ googleId, email, displayName });
          token.apiToken = apiToken;
          token.userId = user.id as string;
          token.effectiveTier = user.effectiveTier as string;
          token.trialDaysLeft = user.trialDaysLeft as number;
          token.role = user.role as string;
          token.subscription_status = user.subscription_status as string;
        } catch (e) {
          console.error('Auth sync failed', e);
        }
      }
      return token;
    },
    async session({ session, token }) {
      const extended = session as unknown as Record<string, unknown>;
      if (session.user) {
        extended.apiToken = token.apiToken;
        extended.userId = token.userId;
        extended.effectiveTier = token.effectiveTier;
        extended.trialDaysLeft = token.trialDaysLeft;
        extended.role = token.role;
        extended.subscription_status = token.subscription_status;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
