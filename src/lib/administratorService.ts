import { prisma } from "@/lib/prisma";
import { calculateSessionStatus } from "@/lib/adminSession";
import { sanitizeMetadata } from "@/lib/activityLog";
import type { ActivityAction } from "@prisma/client";

export type AdminDashboardStats = {
  totalAdmin: number;
  onlineAdmin: number;
  idleAdmin: number;
  offlineAdmin: number;
  activeSessions: number;
  activityToday: number;
  failedLoginToday: number;
};

export type ActivityLogStats = {
  totalActivity: number;
  todayActivity: number;
  loginCount: number;
  loginFailedCount: number;
  logoutCount: number;
  createCount: number;
  updateCount: number;
  deleteCount: number;
};

export type ActivityLogItem = {
  id: string;
  userId: string | null;
  adminName: string;
  adminEmail: string;
  action: ActivityAction;
  entityType: string;
  entityId: string | null;
  entityTitle: string | null;
  description: string;
  metadata: any;
  ipAddress: string | null;
  userAgent: string | null;
  userAgentSummary: string;
  createdAt: Date;
};

export type ActivityLogQueryFilters = {
  search?: string;
  action?: string;
  entityType?: string;
  dateRange?: string; // "all" | "today" | "7days" | "30days"
  page?: number;
  pageSize?: number;
};

export type ActivityLogsResult = {
  logs: ActivityLogItem[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type SecurityOverviewStats = {
  failedLoginToday: number;
  failedLogin7Days: number;
  successLoginToday: number;
  activeSessions: number;
  revokedSessions: number;
  activeAdmins: number;
  totalSecurityEvents: number;
  totalAdmins: number;
  onlineAdmins: number;
  idleAdmins: number;
  offlineAdmins: number;
};

export type LoginPeriodStats = {
  login: number;
  failed: number;
};

export type LoginSecurityComparison = {
  today: LoginPeriodStats;
  last7Days: LoginPeriodStats;
  last30Days: LoginPeriodStats;
};

export type SuspiciousIpItem = {
  ipAddress: string;
  failedCount: number;
  lastFailedAt: Date;
  status: "HIGH" | "MODERATE" | "LOW";
};

export type SecurityConsoleStats = {
  overview: SecurityOverviewStats;
  comparison: LoginSecurityComparison;
  suspiciousIps: SuspiciousIpItem[];
};

export type AdminSessionItem = {
  id: string;
  userId: string;
  adminName: string;
  adminEmail: string;
  ipAddress: string | null;
  userAgent: string | null;
  userAgentSummary: string;
  deviceType: string;
  isActive: boolean;
  isRevoked: boolean;
  revokedAt: Date | null;
  revokedReason: string | null;
  lastActiveAt: Date;
  createdAt: Date;
  endedAt: Date | null;
  status: "ONLINE" | "IDLE" | "OFFLINE";
  sessionState: "Active" | "Ended" | "Revoked";
};

export type AdminSessionManagementStats = {
  activeSessions: number;
  onlineSessions: number;
  idleSessions: number;
  offlineSessions: number;
  revokedSessions: number;
  totalSessions: number;
  totalAdmins: number;
  onlineAdmins: number;
  idleAdmins: number;
  offlineAdmins: number;
};

export type AdminSessionQueryFilters = {
  search?: string;
  status?: string; // "ALL" | "ONLINE" | "IDLE" | "OFFLINE"
  sessionState?: string; // "ALL" | "Active" | "Ended" | "Revoked"
  deviceType?: string; // "ALL" | "Desktop" | "Mobile" | "Tablet"
  dateRange?: string; // "all" | "today" | "7days" | "30days"
  page?: number;
  pageSize?: number;
};

export type AdminSessionsPagedResult = {
  sessions: AdminSessionItem[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

/**
 * Format ringkas User Agent untuk tampilan monitoring tabel administrator.
 */
export function formatUserAgentSummary(
  userAgent?: string | null,
  deviceType?: string | null,
): string {
  if (!userAgent) return deviceType || "Unknown";
  const ua = userAgent.toLowerCase();

  let os = "OS";
  if (ua.includes("windows")) os = "Windows";
  else if (ua.includes("macintosh") || ua.includes("mac os")) os = "macOS";
  else if (ua.includes("android")) os = "Android";
  else if (ua.includes("iphone") || ua.includes("ipad") || ua.includes("ios"))
    os = "iOS";
  else if (ua.includes("linux")) os = "Linux";

  let browser = "Browser";
  if (ua.includes("edg/")) browser = "Edge";
  else if (ua.includes("chrome") && !ua.includes("edg/")) browser = "Chrome";
  else if (ua.includes("safari") && !ua.includes("chrome")) browser = "Safari";
  else if (ua.includes("firefox")) browser = "Firefox";
  else if (ua.includes("opera") || ua.includes("opr/")) browser = "Opera";

  return `${browser} / ${os}`;
}

/**
 * Mengambil statistik agregasi real-time untuk Administrator Dashboard Overview.
 * Data dihitung secara dinamis dari database tanpa angka hardcoded.
 */
export async function getAdministratorDashboardStats(): Promise<AdminDashboardStats> {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  // Jalankan query agregasi paralel untuk efisiensi
  const [
    totalAdmin,
    activeSessions,
    activityToday,
    failedLoginToday,
    usersWithSessions,
  ] = await Promise.all([
    // 1. Total Admin terdaftar
    prisma.user.count(),

    // 5. Active Sessions
    prisma.adminSession.count({
      where: {
        isActive: true,
        isRevoked: false,
      },
    }),

    // 6. Activity Today (sejak awal hari ini)
    prisma.activityLog.count({
      where: {
        createdAt: {
          gte: startOfDay,
        },
      },
    }),

    // 7. Failed Login Today
    prisma.activityLog.count({
      where: {
        action: "LOGIN_FAILED",
        createdAt: {
          gte: startOfDay,
        },
      },
    }),

    // Ambil session aktif terbaru untuk setiap admin guna menghitung Online / Idle / Offline
    prisma.user.findMany({
      select: {
        id: true,
        sessions: {
          where: {
            isActive: true,
            isRevoked: false,
          },
          orderBy: {
            lastActiveAt: "desc",
          },
          take: 1,
          select: {
            lastActiveAt: true,
            isActive: true,
            isRevoked: true,
          },
        },
      },
    }),
  ]);

  // Hitung status masing-masing admin secara unik (satu admin = satu status)
  let onlineAdmin = 0;
  let idleAdmin = 0;
  let offlineAdmin = 0;

  for (const user of usersWithSessions) {
    const latestSession = user.sessions[0];

    if (!latestSession) {
      offlineAdmin++;
      continue;
    }

    const status = calculateSessionStatus(
      latestSession.lastActiveAt,
      latestSession.isActive,
      latestSession.isRevoked,
    );

    if (status === "ONLINE") {
      onlineAdmin++;
    } else if (status === "IDLE") {
      idleAdmin++;
    } else {
      offlineAdmin++;
    }
  }

  return {
    totalAdmin,
    onlineAdmin,
    idleAdmin,
    offlineAdmin,
    activeSessions,
    activityToday,
    failedLoginToday,
  };
}

/**
 * Mengambil 6 Ringkasan Kartu Statistik Administrator Session Management.
 * Real data dari TiDB Cloud.
 */
export async function getAdminSessionManagementStats(): Promise<AdminSessionManagementStats> {
  // Query 1: Total Sesi
  const totalSessions = await prisma.adminSession.count();

  // Query 2: Sesi Dicabut
  const revokedSessions = await prisma.adminSession.count({
    where: {
      isRevoked: true,
    },
  });

  // Query 3: Record seluruh sesi aktif untuk menghitung status sesi & jumlah sesi aktif
  const allActiveSessionsRecords = await prisma.adminSession.findMany({
    where: {
      isActive: true,
      isRevoked: false,
    },
    select: {
      lastActiveAt: true,
      isActive: true,
      isRevoked: true,
    },
  });

  // Query 4: Admin unik beserta sesi aktif terbarunya
  const usersWithSessions = await prisma.user.findMany({
    select: {
      id: true,
      sessions: {
        where: {
          isActive: true,
          isRevoked: false,
        },
        orderBy: {
          lastActiveAt: "desc",
        },
        take: 1,
        select: {
          lastActiveAt: true,
          isActive: true,
          isRevoked: true,
        },
      },
    },
  });

  const activeSessions = allActiveSessionsRecords.length;

  // Status aktivitas hanya dihitung dari session yang masih aktif.
  // Session yang sudah ended/revoked tidak masuk ke kategori Online/Idle/Offline.
  let onlineSessions = 0;
  let idleSessions = 0;
  let offlineSessions = 0;

  for (const s of allActiveSessionsRecords) {
    const status = calculateSessionStatus(
      s.lastActiveAt,
      s.isActive,
      s.isRevoked,
    );
    if (status === "ONLINE") {
      onlineSessions++;
    } else if (status === "IDLE") {
      idleSessions++;
    } else {
      offlineSessions++;
    }
  }

  // Hitung status admin unik
  let onlineAdmins = 0;
  let idleAdmins = 0;
  let offlineAdmins = 0;

  for (const user of usersWithSessions) {
    const latest = user.sessions[0];
    if (!latest) {
      offlineAdmins++;
      continue;
    }
    const status = calculateSessionStatus(
      latest.lastActiveAt,
      latest.isActive,
      latest.isRevoked,
    );
    if (status === "ONLINE") {
      onlineAdmins++;
    } else if (status === "IDLE") {
      idleAdmins++;
    } else {
      offlineAdmins++;
    }
  }

  return {
    activeSessions,
    onlineSessions,
    idleSessions,
    offlineSessions,
    revokedSessions,
    totalSessions,
    totalAdmins: usersWithSessions.length,
    onlineAdmins,
    idleAdmins,
    offlineAdmins,
  };
}

/**
 * Mengambil daftar seluruh AdminSession dari database untuk halaman monitoring sesi (Non-paged legacy fallback).
 * Mengabaikan sessionToken, password, dan kredensial sensitif lainnya.
 */
export async function getAdministratorSessionsList(): Promise<
  AdminSessionItem[]
> {
  const result = await getAdministratorSessionsPaged({
    page: 1,
    pageSize: 100,
  });
  return result.sessions;
}

/**
 * Mengambil daftar AdminSession terpaginasi dengan server-side filtering.
 * JANGAN PERNAH MENYERTAKAN sessionToken, JWT, password, atau credential.
 */
export async function getAdministratorSessionsPaged(
  filters: AdminSessionQueryFilters = {},
): Promise<AdminSessionsPagedResult> {
  const page = Math.max(1, Number(filters.page) || 1);
  const pageSize = Math.max(1, Math.min(100, Number(filters.pageSize) || 20));

  const where: any = {};

  // 1. Date Range Filter
  if (filters.dateRange && filters.dateRange !== "all") {
    const now = new Date();
    if (filters.dateRange === "today") {
      const startOfDay = new Date(now);
      startOfDay.setHours(0, 0, 0, 0);
      where.createdAt = { gte: startOfDay };
    } else if (filters.dateRange === "7days") {
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      where.createdAt = { gte: sevenDaysAgo };
    } else if (filters.dateRange === "30days") {
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      where.createdAt = { gte: thirtyDaysAgo };
    }
  }

  // 2. Session State Filter (Active / Ended / Revoked)
  if (filters.sessionState && filters.sessionState !== "ALL") {
    const state = filters.sessionState.toUpperCase();
    if (state === "ACTIVE") {
      where.isActive = true;
      where.isRevoked = false;
    } else if (state === "REVOKED") {
      where.isRevoked = true;
    } else if (state === "ENDED") {
      where.isActive = false;
      where.isRevoked = false;
    }
  }

  // 3. Device Type Filter (Desktop / Mobile / Tablet)
  if (filters.deviceType && filters.deviceType !== "ALL") {
    where.deviceType = {
      equals: filters.deviceType,
    };
  }

  // 4. Search Filter (Admin Name, Email, IP Address, Device, User Agent)
  if (filters.search && filters.search.trim()) {
    const query = filters.search.trim();
    where.OR = [
      { user: { name: { contains: query } } },
      { user: { email: { contains: query } } },
      { ipAddress: { contains: query } },
      { userAgent: { contains: query } },
      { deviceType: { contains: query } },
    ];
  }

  // Query database dengan explicit select (Mengecualikan sessionToken)
  const selectFields = {
    id: true,
    userId: true,
    ipAddress: true,
    userAgent: true,
    deviceType: true,
    isActive: true,
    isRevoked: true,
    revokedAt: true,
    revokedReason: true,
    lastActiveAt: true,
    createdAt: true,
    endedAt: true,
    user: {
      select: {
        id: true,
        name: true,
        email: true,
      },
    },
  };

  // Jika ada filter status aktivitas (ONLINE / IDLE / OFFLINE), kita hitung status dinamisnya
  const hasStatusFilter = filters.status && filters.status !== "ALL";

  if (hasStatusFilter) {
    const targetStatus = filters.status!.toUpperCase();

    // Ambil data yang match filter database non-status
    const rawSessions = await prisma.adminSession.findMany({
      where,
      select: selectFields,
      orderBy: {
        lastActiveAt: "desc",
      },
    });

    const mappedSessions: AdminSessionItem[] = [];

    for (const s of rawSessions) {
      const status = calculateSessionStatus(
        s.lastActiveAt,
        s.isActive,
        s.isRevoked,
      );
      if (status !== targetStatus) continue;

      let sessionState: "Active" | "Ended" | "Revoked" = "Ended";
      if (s.isRevoked) {
        sessionState = "Revoked";
      } else if (s.isActive) {
        sessionState = "Active";
      }

      mappedSessions.push({
        id: s.id,
        userId: s.userId,
        adminName: s.user?.name || "Admin",
        adminEmail: s.user?.email || "-",
        ipAddress: s.ipAddress,
        userAgent: s.userAgent,
        userAgentSummary: formatUserAgentSummary(s.userAgent, s.deviceType),
        deviceType: s.deviceType || "Desktop",
        isActive: s.isActive,
        isRevoked: s.isRevoked,
        revokedAt: s.revokedAt,
        revokedReason: s.revokedReason,
        lastActiveAt: s.lastActiveAt,
        createdAt: s.createdAt,
        endedAt: s.endedAt,
        status,
        sessionState,
      });
    }

    const totalCount = mappedSessions.length;
    const totalPages = Math.ceil(totalCount / pageSize) || 1;
    const paginatedSessions = mappedSessions.slice(
      (page - 1) * pageSize,
      page * pageSize,
    );

    return {
      sessions: paginatedSessions,
      totalCount,
      page,
      pageSize,
      totalPages,
    };
  }

  // Tanpa filter status dinamis, lakukan pagination langsung di query engine database
  const [totalCount, rawSessions] = await Promise.all([
    prisma.adminSession.count({ where }),
    prisma.adminSession.findMany({
      where,
      select: selectFields,
      orderBy: {
        lastActiveAt: "desc",
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  const sessions: AdminSessionItem[] = rawSessions.map((s) => {
    const status = calculateSessionStatus(
      s.lastActiveAt,
      s.isActive,
      s.isRevoked,
    );
    let sessionState: "Active" | "Ended" | "Revoked" = "Ended";
    if (s.isRevoked) {
      sessionState = "Revoked";
    } else if (s.isActive) {
      sessionState = "Active";
    }

    return {
      id: s.id,
      userId: s.userId,
      adminName: s.user?.name || "Admin",
      adminEmail: s.user?.email || "-",
      ipAddress: s.ipAddress,
      userAgent: s.userAgent,
      userAgentSummary: formatUserAgentSummary(s.userAgent, s.deviceType),
      deviceType: s.deviceType || "Desktop",
      isActive: s.isActive,
      isRevoked: s.isRevoked,
      revokedAt: s.revokedAt,
      revokedReason: s.revokedReason,
      lastActiveAt: s.lastActiveAt,
      createdAt: s.createdAt,
      endedAt: s.endedAt,
      status,
      sessionState,
    };
  });

  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  return {
    sessions,
    totalCount,
    page,
    pageSize,
    totalPages,
  };
}

/**
 * Mengambil statistik agregasi ActivityLog (Total, Today, dan counts per Action).
 */
export async function getActivityLogStats(): Promise<ActivityLogStats> {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  // Total log aktivitas keseluruhan
  const totalActivity = await prisma.activityLog.count();

  // Total log aktivitas hari ini
  const todayActivity = await prisma.activityLog.count({
    where: {
      createdAt: {
        gte: startOfDay,
      },
    },
  });

  // Agregasi jumlah berdasarkan ActivityAction
  const actionGroups = await prisma.activityLog.groupBy({
    by: ["action"],
    _count: {
      _all: true,
    },
  });

  const counts: Record<string, number> = {
    LOGIN: 0,
    LOGIN_FAILED: 0,
    LOGOUT: 0,
    CREATE: 0,
    UPDATE: 0,
    DELETE: 0,
  };

  for (const group of actionGroups) {
    counts[group.action] = group._count._all;
  }

  return {
    totalActivity,
    todayActivity,
    loginCount: counts.LOGIN || 0,
    loginFailedCount: counts.LOGIN_FAILED || 0,
    logoutCount: counts.LOGOUT || 0,
    createCount: counts.CREATE || 0,
    updateCount: counts.UPDATE || 0,
    deleteCount: counts.DELETE || 0,
  };
}

/**
 * Mengambil daftar ActivityLog dengan dukungan filter dinamis, pencarian, dan pagination server-side.
 * Sanitasi ketat: Tidak pernah mengambil atau mengekspos token, password, atau credential.
 */
export async function getAdministratorActivityLogs(
  filters: ActivityLogQueryFilters = {},
): Promise<ActivityLogsResult> {
  const page = Math.max(1, Number(filters.page) || 1);
  const pageSize = Math.min(100, Math.max(5, Number(filters.pageSize) || 20));
  const skip = (page - 1) * pageSize;

  const where: any = {};

  // 1. Filter Date Range
  if (filters.dateRange && filters.dateRange !== "all") {
    const now = new Date();
    if (filters.dateRange === "today") {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      where.createdAt = { gte: startOfDay };
    } else if (filters.dateRange === "7days") {
      const past7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      where.createdAt = { gte: past7Days };
    } else if (filters.dateRange === "30days") {
      const past30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      where.createdAt = { gte: past30Days };
    }
  }

  // 2. Filter Action
  if (filters.action && filters.action !== "ALL") {
    where.action = filters.action as ActivityAction;
  }

  // 3. Filter Entity Type
  if (filters.entityType && filters.entityType !== "ALL") {
    where.entityType = filters.entityType.toUpperCase();
  }

  // 4. Search Filter (nama admin, email, description, entityTitle, ipAddress)
  if (filters.search && filters.search.trim()) {
    const query = filters.search.trim();
    where.OR = [
      { description: { contains: query } },
      { entityTitle: { contains: query } },
      { ipAddress: { contains: query } },
      {
        user: {
          OR: [{ name: { contains: query } }, { email: { contains: query } }],
        },
      },
    ];
  }

  // Jalankan query secara sekuensial untuk stabilitas connection pool
  const totalCount = await prisma.activityLog.count({ where });
  const rawLogs = await prisma.activityLog.findMany({
    where,
    skip,
    take: pageSize,
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      userId: true,
      action: true,
      entityType: true,
      entityId: true,
      entityTitle: true,
      description: true,
      metadata: true,
      ipAddress: true,
      userAgent: true,
      createdAt: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  const logs: ActivityLogItem[] = rawLogs.map((log) => {
    return {
      id: log.id,
      userId: log.userId,
      adminName:
        log.user?.name || (log.userId ? "Admin" : "System / Anonymous"),
      adminEmail: log.user?.email || "-",
      action: log.action,
      entityType: log.entityType,
      entityId: log.entityId,
      entityTitle: log.entityTitle,
      description: log.description,
      metadata: sanitizeMetadata(log.metadata),
      ipAddress: log.ipAddress,
      userAgent: log.userAgent,
      userAgentSummary: formatUserAgentSummary(log.userAgent),
      createdAt: log.createdAt,
    };
  });

  return {
    logs,
    totalCount,
    page,
    pageSize,
    totalPages,
  };
}

/**
 * Mengambil statistik komprehensif untuk halaman Security Console.
 */
export async function getAdministratorSecurityStats(): Promise<SecurityConsoleStats> {
  const now = new Date();
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const past7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const past30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [
    totalAdmins,
    failedToday,
    failed7Days,
    failed30Days,
    successToday,
    success7Days,
    success30Days,
    totalSecurityEvents,
    activeSessions,
    revokedSessions,
    usersWithSessions,
    suspiciousIpGroups,
  ] = await Promise.all([
    // Total admin
    prisma.user.count(),

    // Failed logins
    prisma.activityLog.count({
      where: {
        action: "LOGIN_FAILED",
        createdAt: { gte: startOfDay },
      },
    }),
    prisma.activityLog.count({
      where: {
        action: "LOGIN_FAILED",
        createdAt: { gte: past7Days },
      },
    }),
    prisma.activityLog.count({
      where: {
        action: "LOGIN_FAILED",
        createdAt: { gte: past30Days },
      },
    }),

    // Successful logins
    prisma.activityLog.count({
      where: {
        action: "LOGIN",
        createdAt: { gte: startOfDay },
      },
    }),
    prisma.activityLog.count({
      where: {
        action: "LOGIN",
        createdAt: { gte: past7Days },
      },
    }),
    prisma.activityLog.count({
      where: {
        action: "LOGIN",
        createdAt: { gte: past30Days },
      },
    }),

    // Total security events (LOGIN, LOGIN_FAILED, LOGOUT)
    prisma.activityLog.count({
      where: {
        action: {
          in: ["LOGIN", "LOGIN_FAILED", "LOGOUT"],
        },
      },
    }),

    // Session counts
    prisma.adminSession.count({
      where: {
        isActive: true,
        isRevoked: false,
      },
    }),
    prisma.adminSession.count({
      where: {
        isRevoked: true,
      },
    }),

    // User sessions for calculating online/idle/offline admins
    prisma.user.findMany({
      select: {
        id: true,
        sessions: {
          where: {
            isActive: true,
            isRevoked: false,
          },
          orderBy: {
            lastActiveAt: "desc",
          },
          take: 1,
          select: {
            lastActiveAt: true,
            isActive: true,
            isRevoked: true,
          },
        },
      },
    }),

    // Grouping suspicious IPs with failed logins
    prisma.activityLog.groupBy({
      by: ["ipAddress"],
      where: {
        action: "LOGIN_FAILED",
        ipAddress: {
          not: null,
        },
      },
      _count: {
        _all: true,
      },
      orderBy: {
        _count: {
          ipAddress: "desc",
        },
      },
      take: 5,
    }),
  ]);

  // Calculate unique admin status
  let onlineAdmins = 0;
  let idleAdmins = 0;
  let offlineAdmins = 0;

  for (const user of usersWithSessions) {
    const latestSession = user.sessions[0];
    if (!latestSession) {
      offlineAdmins++;
      continue;
    }

    const status = calculateSessionStatus(
      latestSession.lastActiveAt,
      latestSession.isActive,
      latestSession.isRevoked,
    );

    if (status === "ONLINE") {
      onlineAdmins++;
    } else if (status === "IDLE") {
      idleAdmins++;
    } else {
      offlineAdmins++;
    }
  }

  // Format suspicious IPs with latest timestamp
  const suspiciousIps: SuspiciousIpItem[] = [];
  for (const group of suspiciousIpGroups) {
    if (!group.ipAddress) continue;
    const failedCount = group._count._all;

    // Ambil log login gagal terbaru untuk IP ini
    const latestFailed = await prisma.activityLog.findFirst({
      where: {
        action: "LOGIN_FAILED",
        ipAddress: group.ipAddress,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        createdAt: true,
      },
    });

    let status: "HIGH" | "MODERATE" | "LOW" = "LOW";
    if (failedCount >= 5) {
      status = "HIGH";
    } else if (failedCount >= 2) {
      status = "MODERATE";
    }

    suspiciousIps.push({
      ipAddress: group.ipAddress,
      failedCount,
      lastFailedAt: latestFailed?.createdAt || new Date(),
      status,
    });
  }

  return {
    overview: {
      failedLoginToday: failedToday,
      failedLogin7Days: failed7Days,
      successLoginToday: successToday,
      activeSessions,
      revokedSessions,
      activeAdmins: onlineAdmins + idleAdmins,
      totalSecurityEvents,
      totalAdmins,
      onlineAdmins,
      idleAdmins,
      offlineAdmins,
    },
    comparison: {
      today: {
        login: successToday,
        failed: failedToday,
      },
      last7Days: {
        login: success7Days,
        failed: failed7Days,
      },
      last30Days: {
        login: success30Days,
        failed: failed30Days,
      },
    },
    suspiciousIps,
  };
}

/**
 * Mengambil daftar Security Events (LOGIN, LOGIN_FAILED, LOGOUT) dengan filter dan pagination.
 */
export async function getAdministratorSecurityEvents(
  filters: ActivityLogQueryFilters = {},
): Promise<ActivityLogsResult> {
  const page = Math.max(1, Number(filters.page) || 1);
  const pageSize = Math.min(100, Math.max(5, Number(filters.pageSize) || 20));
  const skip = (page - 1) * pageSize;

  const where: any = {
    action: {
      in: ["LOGIN", "LOGIN_FAILED", "LOGOUT"],
    },
  };

  // 1. Filter Action (jika user memilih spesifik LOGIN / LOGIN_FAILED / LOGOUT)
  if (filters.action && filters.action !== "ALL") {
    where.action = filters.action as ActivityAction;
  }

  // 2. Filter Date Range
  if (filters.dateRange && filters.dateRange !== "all") {
    const now = new Date();
    if (filters.dateRange === "today") {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      where.createdAt = { gte: startOfDay };
    } else if (filters.dateRange === "7days") {
      const past7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      where.createdAt = { gte: past7Days };
    } else if (filters.dateRange === "30days") {
      const past30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      where.createdAt = { gte: past30Days };
    }
  }

  // 3. Search Filter
  if (filters.search && filters.search.trim()) {
    const query = filters.search.trim();
    where.AND = [
      {
        OR: [
          { description: { contains: query } },
          { entityTitle: { contains: query } },
          { ipAddress: { contains: query } },
          {
            user: {
              OR: [
                { name: { contains: query } },
                { email: { contains: query } },
              ],
            },
          },
        ],
      },
    ];
  }

  const [totalCount, rawLogs] = await Promise.all([
    prisma.activityLog.count({ where }),
    prisma.activityLog.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        userId: true,
        action: true,
        entityType: true,
        entityId: true,
        entityTitle: true,
        description: true,
        metadata: true,
        ipAddress: true,
        userAgent: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    }),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  const logs: ActivityLogItem[] = rawLogs.map((log) => {
    return {
      id: log.id,
      userId: log.userId,
      adminName:
        log.user?.name || (log.userId ? "Admin" : "System / Anonymous"),
      adminEmail: log.user?.email || "-",
      action: log.action,
      entityType: log.entityType,
      entityId: log.entityId,
      entityTitle: log.entityTitle,
      description: log.description,
      metadata: sanitizeMetadata(log.metadata),
      ipAddress: log.ipAddress,
      userAgent: log.userAgent,
      userAgentSummary: formatUserAgentSummary(log.userAgent),
      createdAt: log.createdAt,
    };
  });

  return {
    logs,
    totalCount,
    page,
    pageSize,
    totalPages,
  };
}
