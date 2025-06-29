import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPrivateRoute = createRouteMatcher([
  '/dashboard',
  '/dashboard/(.*)',
  '/dashboard(.*)',
  '/home',
  '/home/(.*)',
  '/home(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  if (isPrivateRoute(req)) {
    try {
      await auth.protect();

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_e) {
      // 🔁 Redirect to custom sign-in page
      return NextResponse.redirect(new URL('/', req.url));
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
