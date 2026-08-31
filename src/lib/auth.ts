import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { getAdminSession } from "@/lib/adminSession";

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

export type SessionPayload = {
  userId: string;
  role: string;
  name: string;
};

export async function encrypt(payload: SessionPayload) {
  const key = getJwtKey();
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(key);
}

export async function decrypt(input: string): Promise<SessionPayload | null> {
  try {
    const key = getJwtKey();
    const { payload } = await jwtVerify(input, key, {
      algorithms: ["HS256"],
    });
    return payload as SessionPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Mengambil dan memvalidasi session dengan pertahanan berlapis:
 * 1. JWT signature valid dan belum expired.
 * 2. AdminSession record di database aktif (isActive === true && isRevoked === false).
 */
export async function getSession(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session")?.value;
    if (!sessionToken) return null;

    // Lapis 1: JWT Signature & Expiration Check
    const payload = await decrypt(sessionToken);
    if (!payload || payload.role !== "ADMIN_CSR") {
      return null;
    }

    // Lapis 2: Database AdminSession Check
    const adminSession = await getAdminSession(sessionToken, true);
    if (!adminSession) {
      return null;
    }

    return payload;
  } catch (error) {
    return null;
  }
}

export async function getCurrentAdminSession() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session")?.value;
    if (!sessionToken) return null;

    return await getAdminSession(sessionToken, true);
  } catch (error) {
    return null;
  }
}

export async function getActiveSectorId() {
  const session = await getSession();
  if (!session) return null;

  // Membaca cookie active_sector sebagai filter tampilan murni
  const cookieStore = await cookies();
  const activeSector = cookieStore.get("active_sector")?.value;
  
  if (!activeSector || activeSector === "ALL") {
    return null;
  }
  
  return activeSector;
}

export async function requireAuth(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session || session.role !== "ADMIN_CSR") {
    try {
      const cookieStore = await cookies();
      cookieStore.delete("session");
    } catch {
      // Abaikan jika dipanggil dalam read-only component context
    }
    throw new Error("Unauthorized: Akses dibatasi hanya untuk ADMIN_CSR dengan sesi aktif");
  }
  return session;
}

/**
 * Server-side guard khusus untuk route Administrator.
 * Memastikan sesi valid, role ADMIN_CSR terverifikasi, dan akun aktif.
 */
export async function requireAdministratorAuth(): Promise<SessionPayload> {
  const session = await requireAuth();
  
  // Evaluasi Administrator:
  // Pada Fase 5A Foundation, karena role database tunggal (ADMIN_CSR),
  // autentikasi dilakukan dengan validasi sesi database yang ketat.
  return session;
}


