"use server";

import { prisma } from "@/lib/prisma";
import { encrypt } from "@/lib/auth";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

export async function loginAction(formData: FormData) {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    return { error: "Email dan password wajib diisi." };
  }

  const user = await prisma.user.findUnique({
    where: { email },
    include: { sector: true }
  });

  if (!user) {
    return { error: "Kredensial tidak valid." };
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  
  if (!isPasswordValid) {
    return { error: "Kredensial tidak valid." };
  }

  // Set Cookie Active Sector untuk ADMIN_PUSAT/SUPER_ADMIN akan dibiarkan kosong,
  // sehingga mereka masuk dalam mode agregasi "Semua Sektor" secara default.
  if (user.role === "ADMIN_SEKTOR" && user.sectorId) {
    const cookieStore = await cookies();
    cookieStore.set("active_sector", user.sectorId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 hari
      path: "/",
    });
  }

  const session = await encrypt({
    userId: user.id,
    role: user.role,
    sectorId: user.sectorId,
    name: user.name
  });

  const cookieStore = await cookies();
  cookieStore.set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24, // 1 hari
    path: "/",
  });

  return { success: true };
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  cookieStore.delete("active_sector");
}

export async function switchActiveSectorAction(sectorId: string) {
  const cookieStore = await cookies();
  
  if (sectorId === "ALL") {
    cookieStore.delete("active_sector");
  } else {
    cookieStore.set("active_sector", sectorId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 hari
      path: "/",
    });
  }
}
