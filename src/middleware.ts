import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

function getJwtKey() {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error(
      "JWT_SECRET environment variable is not set. " +
      "Configure it in your .env file (development) or Vercel environment variables (production)."
    );
  }
  return new TextEncoder().encode(jwtSecret);
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Proteksi route /admin (kecuali /admin/login) dan /administrator
  const isAdminRoute = pathname.startsWith('/admin') && !pathname.startsWith('/admin/login');
  const isAdministratorRoute = pathname.startsWith('/administrator');

  if (isAdminRoute || isAdministratorRoute) {
    const session = request.cookies.get('session')?.value;

    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    try {
      const key = getJwtKey();
      // Verifikasi signature + expiry token
      const { payload } = await jwtVerify(session, key, { algorithms: ['HS256'] });

      // Verifikasi role — hanya ADMIN_CSR yang boleh mengakses
      if (!payload.role || payload.role !== 'ADMIN_CSR') {
        const response = NextResponse.redirect(new URL('/admin/login', request.url));
        response.cookies.delete('session');
        return response;
      }

      return NextResponse.next();
    } catch {
      // Token tidak valid atau kadaluarsa
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      response.cookies.delete('session');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/administrator/:path*'],
};


