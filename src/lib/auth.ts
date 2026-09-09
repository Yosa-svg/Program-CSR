import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { getAdminSession } from "@/lib/adminSession";
import { getValidatedJwtSecret } from "@/lib/env";

function getJwtKey() {
  const jwtSecret = getValidatedJwtSecret();
  return new TextEncoder().encode(jwtSecret);
}

export type SessionRole = "ADMIN_CSR" | "ADMINISTRATOR";

export type SessionPayload = {
  userId: string;
  role: SessionRole;
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

    // Validasi struktur claims token
    if (
      !payload ||
      typeof payload.userId !== "string" ||
      typeof payload.role !== "string" ||
      (payload.role !== "ADMIN_CSR" && payload.role !== "ADMINISTRATOR")
    ) {
      return null;
    }

    return {
      userId: payload.userId,
      role: payload.role as SessionRole,
      name: typeof payload.name === "string" ? payload.name : "Admin",
    };
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
    if (!payload || (payload.role !== "ADMIN_CSR" && payload.role !== "ADMINISTRATOR")) {
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

export const requireAdminCsrAuth = requireAuth;

/**
 * Server-side guard khusus untuk route Administrator.
 * Memastikan sesi valid, role ADMINISTRATOR terverifikasi, dan akun aktif.
 */
export async function requireAdministratorAuth(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session || session.role !== "ADMINISTRATOR") {
    try {
      const cookieStore = await cookies();
      cookieStore.delete("session");
    } catch {
      // Abaikan jika dipanggil dalam read-only component context
    }
    throw new Error("Unauthorized: Akses dibatasi hanya untuk ADMINISTRATOR dengan sesi aktif");
  }
  return session;
}


