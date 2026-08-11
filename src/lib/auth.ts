import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

const secretKey = "csr-secret-key-super-secure";
const key = new TextEncoder().encode(secretKey);

export type SessionPayload = {
  userId: string;
  role: string;
  sectorId?: string | null;
  name: string;
};

export async function encrypt(payload: SessionPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(key);
}

export async function decrypt(input: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ["HS256"],
    });
    return payload as SessionPayload;
  } catch (error) {
    return null;
  }
}

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function getActiveSectorId() {
  const session = await getSession();
  if (!session) return null;

  if (session.role === "ADMIN_SEKTOR" && session.sectorId) {
    return session.sectorId;
  }

  // Untuk ADMIN_PUSAT atau SUPER_ADMIN, ambil dari cookie active_sector
  const cookieStore = await cookies();
  const activeSector = cookieStore.get("active_sector")?.value;
  return activeSector || null;
}

export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function requireSectorAccess(sectorId: string) {
  const session = await requireAuth();
  
  if (session.role === "ADMIN_SEKTOR" && session.sectorId !== sectorId) {
    throw new Error("Forbidden: You do not have access to this sector");
  }
  
  return session;
}
