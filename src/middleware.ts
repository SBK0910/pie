import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Create a matcher for protected routes
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/profile(.*)',
  // Add other protected routes here
]);

export default clerkMiddleware(async (auth, req) => {
  // Allow access to public routes without authentication
  if (!isProtectedRoute(req)) {
    return; // Allow public routes
  }
  
  // Allow access to auth routes when not signed in
  if (req.nextUrl.pathname.startsWith('/auth')) {
    return;
  }
  
  // For protected routes, require authentication
  const session = await auth();
  if (!session) {
    return Response.redirect(new URL('/auth/sign-in', req.url));
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