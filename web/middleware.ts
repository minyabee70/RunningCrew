export { default } from 'next-auth/middleware';

export const config = {
  matcher: ['/((?!login|privacy|terms|api/auth).*)'],
};
