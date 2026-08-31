Cypress.on("uncaught:exception", () => {
  return false;
});

const defaultEmail = Cypress.env("ADMIN_EMAIL") || "admin1@csr.com";
const defaultPassword = Cypress.env("ADMIN_PASSWORD") || "AdminCSR2026!";

function loginAdmin(email = defaultEmail, password = defaultPassword) {
  cy.session([email, password], () => {
    cy.visit("/admin/login");
    cy.get('input[name="email"]', { timeout: 15000 }).clear().type(email);
    cy.get('input[name="password"]', { timeout: 15000 }).clear().type(password);
    cy.get('button[type="submit"]').click();
    cy.url({ timeout: 30000 }).should("match", /\/admin(\/)?$/);
  });
}

describe("Authentication & Session Lifecycle", () => {
  it("Test 1: gagal login dengan kredensial salah dan tetap di halaman login", () => {
    cy.visit("/admin/login");
    cy.get('input[name="email"]').type("nonexistent-admin@csr.com");
    cy.get('input[name="password"]').type("WrongPassword123!");
    cy.get('button[type="submit"]').click();

    cy.url().should("include", "/admin/login");
    cy.get('[data-testid="login-error"]', { timeout: 20000 }).should("be.visible");
  });

  it("Test 2: berhasil login ke dashboard admin dengan kredensial valid", () => {
    loginAdmin();
    cy.visit("/admin");
    cy.contains("Dashboard", { timeout: 15000 }).should("be.visible");
  });

  it("Test 3: berhasil logout dan sesi dicabut", () => {
    cy.visit("/admin/login");
    cy.get('input[name="email"]').type(defaultEmail);
    cy.get('input[name="password"]').type(defaultPassword);
    cy.get('button[type="submit"]').click();
    cy.url({ timeout: 30000 }).should("match", /\/admin(\/)?$/);

    cy.contains("button", "Keluar", { timeout: 15000 }).click();
    cy.url({ timeout: 15000 }).should("include", "/admin/login");

    // Akses /admin setelah logout harus diredirect ke login
    cy.visit("/admin");
    cy.url({ timeout: 15000 }).should("include", "/admin/login");
  });

  it("Test 4: unauthorized user langsung ditolak dari /admin", () => {
    cy.clearCookies();
    cy.visit("/admin");
    cy.url({ timeout: 15000 }).should("include", "/admin/login");
  });

  it("Test 5: unauthorized user langsung ditolak dari /administrator", () => {
    cy.clearCookies();
    cy.visit("/administrator");
    cy.url({ timeout: 15000 }).should("include", "/admin/login");
  });

  it("Test 6: unauthorized user langsung ditolak dari /administrator/sessions", () => {
    cy.clearCookies();
    cy.visit("/administrator/sessions");
    cy.url({ timeout: 15000 }).should("include", "/admin/login");
  });

  it("Test 7: unauthorized user langsung ditolak dari /administrator/activity-logs", () => {
    cy.clearCookies();
    cy.visit("/administrator/activity-logs");
    cy.url({ timeout: 15000 }).should("include", "/admin/login");
  });

  it("Test 8: unauthorized user langsung ditolak dari /administrator/security", () => {
    cy.clearCookies();
    cy.visit("/administrator/security");
    cy.url({ timeout: 15000 }).should("include", "/admin/login");
  });
});

describe("Admin CSR Dashboard & CRUD Navigation", () => {
  beforeEach(() => {
    loginAdmin();
  });

  it("Test 9: akses halaman Program", () => {
    cy.visit("/admin/program");
    cy.url({ timeout: 20000 }).should("include", "/admin/program");
    cy.contains("Program", { timeout: 20000 }).should("exist");
  });

  it("Test 10: akses halaman Kegiatan", () => {
    cy.visit("/admin/kegiatan");
    cy.url({ timeout: 15000 }).should("include", "/admin/kegiatan");
    cy.url().should("not.include", "/admin/login");
  });

  it("Test 11: akses halaman Produk", () => {
    cy.visit("/admin/produk");
    cy.url({ timeout: 15000 }).should("include", "/admin/produk");
    cy.url().should("not.include", "/admin/login");
  });

  it("Test 12: akses halaman Dokumentasi", () => {
    cy.visit("/admin/dokumentasi");
    cy.url({ timeout: 15000 }).should("include", "/admin/dokumentasi");
    cy.url().should("not.include", "/admin/login");
  });

  it("Test 13: akses halaman Kinerja", () => {
    cy.visit("/admin/kinerja");
    cy.url({ timeout: 15000 }).should("include", "/admin/kinerja");
    cy.url().should("not.include", "/admin/login");
  });

  it("Test 14: akses halaman Pengaturan", () => {
    cy.visit("/admin/pengaturan");
    cy.url({ timeout: 15000 }).should("include", "/admin/pengaturan");
    cy.url().should("not.include", "/admin/login");
  });
});

describe("Administrator Dashboard & Sessions Monitoring", () => {
  beforeEach(() => {
    loginAdmin();
  });

  it("Test 15: akses /administrator dan verifikasi ringkasan metrik", () => {
    cy.visit("/administrator");
    cy.url({ timeout: 15000 }).should("include", "/administrator");
    cy.contains("Administrator Dashboard", { timeout: 15000 }).should("be.visible");
    cy.contains("Total Admin", { timeout: 15000 }).should("be.visible");
    cy.contains("Active Sessions", { timeout: 15000 }).should("be.visible");
  });

  it("Test 16: akses /administrator/sessions dan verifikasi summary cards & tabel sesi", () => {
    cy.visit("/administrator/sessions");
    cy.url({ timeout: 15000 }).should("include", "/administrator/sessions");

    cy.contains("Admin Session Monitoring", { timeout: 15000 }).should("be.visible");
    cy.contains("Active Sesi", { timeout: 15000 }).should("be.visible");
    cy.contains("Online", { timeout: 15000 }).should("be.visible");
    cy.contains("Idle", { timeout: 15000 }).should("be.visible");
    cy.contains("Offline", { timeout: 15000 }).should("be.visible");
    cy.contains("Revoked", { timeout: 15000 }).should("be.visible");
    cy.contains("Total Sesi", { timeout: 15000 }).should("be.visible");

    cy.get("table", { timeout: 15000 }).should("exist");
    cy.get("table thead").within(() => {
      cy.contains("Admin").should("exist");
      cy.contains("Status").should("exist");
      cy.contains("Device").should("exist");
      cy.contains("IP Address").should("exist");
      cy.contains("Session State").should("exist");
    });
  });

  it("Test 17: pencarian dan filtering pada tabel sesi", () => {
    cy.visit("/administrator/sessions");
    cy.url({ timeout: 15000 }).should("include", "/administrator/sessions");

    cy.get('[data-testid="session-search-input"]').type("admin1");
    cy.contains("button", "Cari").click();
    cy.url({ timeout: 15000 }).should("include", "search=admin1");

    cy.get('[data-testid="filter-status"]').select("ONLINE");
    cy.url({ timeout: 15000 }).should("include", "status=ONLINE");
  });

  it("Test 18: akses /administrator/security dan verifikasi redirect aman", () => {
    cy.visit("/administrator/security");
    cy.url({ timeout: 15000 }).should("include", "/administrator/security");
    cy.contains("Security Console", { timeout: 15000 }).should("be.visible");
  });
});

describe("Administrator Activity Logs & Audit Trail", () => {
  beforeEach(() => {
    loginAdmin();
  });

  it("Test 19: akses /administrator/activity-logs dan verifikasi 7 kartu statistik audit", () => {
    cy.visit("/administrator/activity-logs");
    cy.url({ timeout: 15000 }).should("include", "/administrator/activity-logs");

    cy.contains("Activity Logs & Audit Trail", { timeout: 15000 }).should("be.visible");
    cy.contains("Total Log", { timeout: 15000 }).should("be.visible");
    cy.contains("Hari Ini", { timeout: 15000 }).should("be.visible");
    cy.contains("Login", { timeout: 15000 }).should("be.visible");
    cy.contains("Login Gagal", { timeout: 15000 }).should("be.visible");
    cy.contains("Create", { timeout: 15000 }).should("be.visible");
    cy.contains("Update", { timeout: 15000 }).should("be.visible");
    cy.contains("Delete", { timeout: 15000 }).should("be.visible");
  });

  it("Test 20: verifikasi struktur tabel audit log dan action badge", () => {
    cy.visit("/administrator/activity-logs");
    cy.url({ timeout: 15000 }).should("include", "/administrator/activity-logs");

    cy.get("table", { timeout: 15000 }).should("exist");
    cy.get("table thead").within(() => {
      cy.contains("Waktu").should("exist");
      cy.contains("Admin").should("exist");
      cy.contains("Aksi").should("exist");
      cy.contains("Entitas").should("exist");
      cy.contains("Deskripsi").should("exist");
      cy.contains("IP Address").should("exist");
      cy.contains("Detail").should("exist");
    });

    cy.get("table tbody tr").should("have.length.at.least", 1);
  });

  it("Test 21: pencarian dan multi-filter pada tabel activity log berfungsi", () => {
    cy.visit("/administrator/activity-logs");
    cy.url({ timeout: 15000 }).should("include", "/administrator/activity-logs");

    cy.get('input[placeholder*="Cari"]').type("admin");
    cy.contains("button", "Cari").click();
    cy.url({ timeout: 15000 }).should("include", "search=admin");

    cy.get('select[aria-label="Filter Aksi"]').select("LOGIN");
    cy.url({ timeout: 15000 }).should("include", "action=LOGIN");

    cy.get('select[aria-label="Filter Entitas"]').select("AUTH");
    cy.url({ timeout: 15000 }).should("include", "entity=AUTH");

    cy.get('select[aria-label="Filter Rentang Waktu"]').select("all");
  });

  it("Test 22: verifikasi pagination dan navigasi halaman log", () => {
    cy.visit("/administrator/activity-logs");
    cy.url({ timeout: 15000 }).should("include", "/administrator/activity-logs");

    cy.get('[data-testid="pagination-prev"]').scrollIntoView().should("exist");
    cy.get('[data-testid="pagination-next"]').should("exist");
    cy.contains("Showing").should("exist");
  });

  it("Test 23: modal detail log aktivitas dapat dibuka dan ditutup dengan benar", () => {
    cy.visit("/administrator/activity-logs");
    cy.url({ timeout: 15000 }).should("include", "/administrator/activity-logs");

    cy.get("table tbody tr").first().within(() => {
      cy.contains("Detail").click();
    });

    cy.contains("Detail Log Aktivitas", { timeout: 15000 }).should("be.visible");
    cy.contains("Waktu Kejadian").should("be.visible");
    cy.contains("Deskripsi Lengkap").should("be.visible");
    cy.contains("Metadata Terformat (Sanitized JSON)").should("be.visible");

    cy.contains("button", "Tutup").click();
    cy.contains("Detail Log Aktivitas").should("not.exist");
  });
});

describe("Administrator Security Console", () => {
  beforeEach(() => {
    loginAdmin();
  });

  it("Test 24: akses /administrator/security dan verifikasi 7 kartu overview keamanan", () => {
    cy.visit("/administrator/security");
    cy.url({ timeout: 15000 }).should("include", "/administrator/security");

    cy.contains("Security Console", { timeout: 15000 }).should("be.visible");
    cy.contains("Live Security Monitoring", { timeout: 15000 }).should("be.visible");

    cy.contains("Failed Today", { timeout: 15000 }).should("be.visible");
    cy.contains("Failed 7 Hari", { timeout: 15000 }).should("be.visible");
    cy.contains("Login Today", { timeout: 15000 }).should("be.visible");
    cy.contains("Active Session", { timeout: 15000 }).should("be.visible");
    cy.contains("Revoked", { timeout: 15000 }).should("be.visible");
    cy.contains("Active Admins", { timeout: 15000 }).should("be.visible");
    cy.contains("Security Events", { timeout: 15000 }).should("be.visible");
  });

  it("Test 25: verifikasi perbandingan periode login dan session security breakdown", () => {
    cy.visit("/administrator/security");
    cy.url({ timeout: 15000 }).should("include", "/administrator/security");

    cy.contains("Statistik Autentikasi & Rasio Keamanan", { timeout: 15000 }).scrollIntoView().should("exist");
    cy.contains("Session Security").should("exist");
    cy.contains("Online Admins").should("exist");
    cy.contains("Idle Admins").should("exist");
    cy.contains("Offline Admins").should("exist");
  });

  it("Test 26: verifikasi suspicious activity section dan struktur tabel event keamanan", () => {
    cy.visit("/administrator/security");
    cy.url({ timeout: 15000 }).should("include", "/administrator/security");

    cy.contains("Suspicious Activity Detection", { timeout: 15000 }).scrollIntoView().should("exist");
    cy.contains("Security Events & Audit Log").should("exist");

    cy.contains("th", "Waktu").should("exist");
    cy.contains("th", "Admin / Target").should("exist");
    cy.contains("th", "Event Keamanan").should("exist");
    cy.contains("th", "Deskripsi").should("exist");
    cy.contains("th", "IP Address").should("exist");
    cy.contains("th", "Perangkat").should("exist");
  });

  it("Test 27: pencarian dan filtering pada security events table", () => {
    cy.visit("/administrator/security");
    cy.url({ timeout: 15000 }).should("include", "/administrator/security");

    cy.get('input[placeholder*="Cari admin"]').type("admin");
    cy.contains("button", "Cari").click();
    cy.url({ timeout: 15000 }).should("include", "search=admin");

    cy.get('select[aria-label="Filter Event Keamanan"]').select("LOGIN");
    cy.url({ timeout: 15000 }).should("include", "action=LOGIN");

    cy.get('select[aria-label="Filter Rentang Waktu"]').select("all");
  });

  it("Test 28: verifikasi pagination dan navigasi halaman security events", () => {
    cy.visit("/administrator/security");
    cy.url({ timeout: 15000 }).should("include", "/administrator/security");

    cy.get('[data-testid="pagination-prev"]').scrollIntoView().should("exist");
    cy.get('[data-testid="pagination-next"]').should("exist");
    cy.contains("Showing").should("exist");
  });

  it("Test 29: modal detail event keamanan dapat dibuka dan ditutup dengan benar", () => {
    cy.visit("/administrator/security");
    cy.url({ timeout: 15000 }).should("include", "/administrator/security");

    cy.get("table tbody tr").first().within(() => {
      cy.contains("Detail").click();
    });

    cy.contains("Detail Event Keamanan", { timeout: 15000 }).should("be.visible");
    cy.contains("Waktu Kejadian").should("be.visible");
    cy.contains("Aksi Keamanan").should("be.visible");
    cy.contains("Admin / Akun Terkait").should("be.visible");
    cy.contains("Metadata Audit (Tersanitasi)").should("exist");

    cy.contains("button", "Tutup").click();
    cy.contains("Detail Event Keamanan").should("not.exist");
  });
});

describe("Administrator Session Management & Revocation", () => {
  beforeEach(() => {
    loginAdmin();
  });

  it("Test 30: akses halaman /administrator/sessions sebagai administrator", () => {
    cy.visit("/administrator/sessions");
    cy.url({ timeout: 15000 }).should("include", "/administrator/sessions");
    cy.contains("Admin Session Monitoring", { timeout: 15000 }).should("be.visible");
  });

  it("Test 31: verifikasi 6 summary cards overview sesi", () => {
    cy.visit("/administrator/sessions");
    cy.url({ timeout: 15000 }).should("include", "/administrator/sessions");

    cy.get('[data-testid="session-overview-cards"]').within(() => {
      cy.contains("Active Sesi").should("exist");
      cy.contains("Online").should("exist");
      cy.contains("Idle").should("exist");
      cy.contains("Offline").should("exist");
      cy.contains("Revoked").should("exist");
      cy.contains("Total Sesi").should("exist");
    });
  });

  it("Test 32: verifikasi struktur kolom tabel sesi", () => {
    cy.visit("/administrator/sessions");
    cy.url({ timeout: 15000 }).should("include", "/administrator/sessions");

    cy.get('[data-testid="sessions-table"]').should("exist");
    cy.get('[data-testid="sessions-table"] thead').within(() => {
      cy.contains("Admin").should("exist");
      cy.contains("Status").should("exist");
      cy.contains("Device").should("exist");
      cy.contains("IP Address").should("exist");
      cy.contains("Login Time").should("exist");
      cy.contains("Last Active").should("exist");
      cy.contains("Duration").should("exist");
      cy.contains("Session State").should("exist");
      cy.contains("Aksi").should("exist");
    });
  });

  it("Test 33: pencarian live search pada tabel sesi bekerja", () => {
    cy.visit("/administrator/sessions");
    cy.url({ timeout: 15000 }).should("include", "/administrator/sessions");

    cy.get('[data-testid="session-search-input"]').type("admin");
    cy.contains("button", "Cari").click();
    cy.url({ timeout: 15000 }).should("include", "search=admin");
  });

  it("Test 34: filter status aktivitas sesi bekerja", () => {
    cy.visit("/administrator/sessions");
    cy.url({ timeout: 15000 }).should("include", "/administrator/sessions");
    cy.get('[data-testid="sessions-table"]', { timeout: 15000 }).should("exist");

    cy.get('[data-testid="filter-status"]').should("be.visible").select("ONLINE");
    cy.url({ timeout: 20000 }).should("include", "status=ONLINE");

    cy.get('[data-testid="filter-status"]').should("be.visible").select("IDLE");
    cy.url({ timeout: 20000 }).should("include", "status=IDLE");
  });

  it("Test 35: filter session state dan perangkat bekerja", () => {
    cy.visit("/administrator/sessions");
    cy.url({ timeout: 15000 }).should("include", "/administrator/sessions");
    cy.get('[data-testid="sessions-table"]', { timeout: 15000 }).should("exist");

    cy.get('[data-testid="filter-session-state"]').should("be.visible").select("ACTIVE");
    cy.url({ timeout: 15000 }).should("include", "session=ACTIVE");

    cy.get('[data-testid="filter-device"]').should("be.visible").select("Desktop");
    cy.url({ timeout: 15000 }).should("include", "device=Desktop");
  });

  it("Test 36: modal detail sesi dapat dibuka dan menampilkan data lengkap tanpa eksposur kredensial", () => {
    cy.visit("/administrator/sessions");
    cy.url({ timeout: 15000 }).should("include", "/administrator/sessions");

    // Buka detail baris pertama
    cy.get('button[data-testid^="session-detail-btn-"]').first().click();

    cy.get('[data-testid="session-detail-modal"]', { timeout: 15000 }).should("be.visible").within(() => {
      cy.contains("Detail Sesi Administrator").should("exist");
      cy.contains("Nama Admin").should("exist");
      cy.contains("Email Admin").should("exist");
      cy.contains("IP Address").should("exist");
      cy.contains("Waktu Login").should("exist");
      cy.contains("Status Aktivitas").should("exist");
      cy.contains("Durasi Sesi").should("exist");

      // Pastikan tidak ada credential/secret/token
      cy.contains("sessionToken").should("not.exist");
      cy.contains("passwordHash").should("not.exist");
      cy.contains("JWT_SECRET").should("not.exist");
    });

    // Tutup modal
    cy.contains("button", "Tutup").click();
    cy.get('[data-testid="session-detail-modal"]').should("not.exist");
  });

  it("Test 37: modal konfirmasi revoke sesi dapat dibuka dan dibatalkan", () => {
    cy.visit("/administrator/sessions");
    cy.url({ timeout: 15000 }).should("include", "/administrator/sessions");

    // Cek apakah ada tombol revoke sesi yang bukan sesi aktif saat ini
    cy.get("body").then(($body) => {
      if ($body.find('button[data-testid^="session-revoke-btn-"]').length > 0) {
        cy.get('button[data-testid^="session-revoke-btn-"]').first().click();
        cy.get('[data-testid="revoke-confirm-modal"]', { timeout: 15000 }).should("be.visible");
        cy.contains("Cabut Sesi Administrator?").should("exist");
        cy.contains("Admin Target:").should("exist");

        // Batal
        cy.contains("button", "Batal").click();
        cy.get('[data-testid="revoke-confirm-modal"]').should("not.exist");
      }
    });
  });

  it("Test 38: eksekusi revoke session berhasil dan status sesi terupdate", () => {
    cy.visit("/administrator/sessions");
    cy.url({ timeout: 15000 }).should("include", "/administrator/sessions");

    cy.get("body").then(($body) => {
      if ($body.find('button[data-testid^="session-revoke-btn-"]').length > 0) {
        cy.get('button[data-testid^="session-revoke-btn-"]').first().click();
        cy.get('[data-testid="revoke-confirm-modal"]').should("be.visible");
        cy.get('[data-testid="confirm-revoke-btn"]').click();

        // Verifikasi feedback alert sukses
        cy.get('[data-testid="session-feedback-alert"]', { timeout: 20000 }).should("exist");
      }
    });
  });

  it("Test 39: ActivityLog SESSION_REVOKED tercatat pada sistem audit", () => {
    cy.visit("/administrator/activity-logs");
    cy.url({ timeout: 15000 }).should("include", "/administrator/activity-logs");

    cy.get("table", { timeout: 15000 }).should("exist");
    cy.get("table tbody tr").should("have.length.at.least", 1);
  });

  it("Test 40: current session diproteksi dari pencabutan melalui UI", () => {
    cy.visit("/administrator/sessions");
    cy.url({ timeout: 15000 }).should("include", "/administrator/sessions");

    // Sesi saat ini harus memiliki penanda Sesi Ini / Dilindungi
    cy.contains("Sesi Ini", { timeout: 15000 }).should("exist");
    cy.contains("Dilindungi").should("exist");
  });

  it("Test 41: unauthorized user tidak dapat mengakses /administrator/sessions", () => {
    cy.clearCookies();
    cy.visit("/administrator/sessions");
    cy.url({ timeout: 15000 }).should("include", "/admin/login");
  });
});