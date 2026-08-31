"use client";

import { useEffect } from "react";
import { heartbeatAction } from "@/actions/authActions";

export default function SessionHeartbeat() {
  useEffect(() => {
    // 1. Eksekusi heartbeat awal saat mount
    heartbeatAction().catch(() => {});

    // 2. Pasang interval berkala setiap 60 detik (1 menit)
    const interval = setInterval(() => {
      heartbeatAction().catch(() => {});
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return null; // Komponen non-visual murni untuk pemeliharaan status session
}
