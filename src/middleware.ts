import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const secretKey = process.env.JWT_SECRET || "csr-secret-key-super-secure";
const key = new TextEncoder().encode(secretKey);

export async function middleware(request: NextRequest) {
  // Hanya proteksi route /admin kecuali /admin/login
  if (request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.startsWith('/admin/login')) {
    const session = request.cookies.get('session')?.value;
    
    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    
    try {
      // Verifikasi token
      const { payload } = await jwtVerify(session, key, { algorithms: ['HS256'] });
      
      // Admin Pusat perlu memastikan mereka memiliki active_sector terpilih jika mereka mengakses /admin/program dll.
      // (Bisa juga ditangani di page/layout masing-masing, tapi middleware baik untuk cek awal)
      
      return NextResponse.next();
    } catch (error) {
      // Token tidak valid atau kadaluarsa
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      response.cookies.delete('session');
      return response;
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
