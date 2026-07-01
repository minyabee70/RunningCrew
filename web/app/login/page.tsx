import { isGoogleAuthConfigured } from '@/lib/auth-config';
import { LoginClient } from './LoginClient';

export default function LoginPage() {
  return <LoginClient oauthReady={isGoogleAuthConfigured()} />;
}
