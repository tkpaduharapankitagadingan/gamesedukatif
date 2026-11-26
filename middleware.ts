import { NextRequest, NextResponse } from 'next/server';

const LEGACY_HOST = 'game.tkpaduharapankitagadingan.sch.id';
const PRIMARY_ORIGIN = 'https://games.tkpaduharapankitagadingan.sch.id';

export function middleware(request: NextRequest) {
  const rawHost =
    request.headers.get('x-forwarded-host') ||
    request.headers.get('host') ||
    '';
  const hostname = rawHost.split(':')[0].toLowerCase();

  if (hostname === LEGACY_HOST) {
    const { pathname, search } = request.nextUrl;
    const destinationUrl = new URL(`${pathname}${search}`, PRIMARY_ORIGIN);
    return NextResponse.redirect(destinationUrl, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static files and Next.js internals
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
