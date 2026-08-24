import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

const secretKey = process.env.JWT_SECRET || "csr-secret-key-super-secure";
const key = new TextEncoder().encode(secretKey);

export type SessionPayload = {
  userId: string;
  role: string;
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

  // Membaca cookie active_sector sebagai filter tampilan murni
  const cookieStore = await cookies();
  const activeSector = cookieStore.get("active_sector")?.value;
  
  if (!activeSector || activeSector === "ALL") {
    return null;
  }
  
  return activeSector;
}

export async function requireAuth() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN_CSR") {
    throw new Error("Unauthorized: Akses dibatasi hanya untuk ADMIN_CSR");
  }
  return session;
}
