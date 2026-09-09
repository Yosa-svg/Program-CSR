import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { getValidatedJwtSecret } from '@/lib/env';

function getJwtKey() {
  const jwtSecret = getValidatedJwtSecret();
  return new TextEncoder().encode(jwtSecret);
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Proteksi route /admin (kecuali /admin/login) dan /administrator
  const isAdminRoute = (pathname === '/admin' || pathname.startsWith('/admin/')) && !pathname.startsWith('/admin/login');
  const isAdministratorRoute = pathname === '/administrator' || pathname.startsWith('/administrator/');

  if (isAdminRoute || isAdministratorRoute) {
    const session = request.cookies.get('session')?.value;

    // A. Tidak ada session -> redirect ke /admin/login
    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    try {
      const key = getJwtKey();
      // Verifikasi signature + expiry token
      const { payload } = await jwtVerify(session, key, { algorithms: ['HS256'] });

      const role = payload.role;

      // D. Role tidak dikenali / claims tidak valid -> hapus cookie, redirect /admin/login
      if (role !== 'ADMIN_CSR' && role !== 'ADMINISTRATOR') {
        const response = NextResponse.redirect(new URL('/admin/login', request.url));
        response.cookies.delete('session');
        return response;
      }

      // B. ADMIN_CSR: /admin/* => ALLOW, /administrator/* => DENY (redirect ke /admin)
      if (role === 'ADMIN_CSR') {
        if (isAdministratorRoute) {
          return NextResponse.redirect(new URL('/admin', request.url));
        }
        return NextResponse.next();
      }

      // C. ADMINISTRATOR: /administrator/* => ALLOW, /admin/* => DENY (redirect ke /administrator)
      if (role === 'ADMINISTRATOR') {
        if (isAdminRoute) {
          return NextResponse.redirect(new URL('/administrator', request.url));
        }
        return NextResponse.next();
      }

      return NextResponse.next();
    } catch {
      // D. Token tidak valid atau kadaluarsa
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


