import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';  // Import getToken to retrieve JWT from request

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });  // Retrieve JWT token from request

  const pathname = req.nextUrl.pathname;

  // Check if user is authenticated
  if (!token) {
    // If not logged in, redirect to login page
    if (!pathname.startsWith("/login") && !pathname.startsWith("/signup")) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }

  // Define roles and pages access mapping
  const rolesAllowed: { [key: string]: string[] } = {
    "/users": ["admin"],
    "/dashboard": ["client", "va", "admin"],
  };

  const loginUserNotAllowed = [
    "/login",
    "/"
  ]
  const userRoles = token.roles || [];


  if(loginUserNotAllowed.includes(pathname)){
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
  
  // If the page requires specific roles, check if user has access
  if (rolesAllowed[pathname] && !rolesAllowed[pathname].some(role => userRoles.includes(role))) {
    // Redirect to unauthorized page if the user doesn't have the required role
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Continue to the requested page if user has the required role
  return NextResponse.next();
}

export const config = {
  // Apply middleware to all routes except for certain ones (like API routes, static files, images, etc.)
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$|.*\\.svg$).*)'],
};
