/**
 * Server-side Input Validation & Sanitization Library
 * CSR ANTAM Application
 *
 * PHASE 5.3: INPUT VALIDATION & WEB SECURITY
 * Memberikan validasi ketat di sisi server untuk seluruh mutasi, FormData,
 * mencegah XSS, IDOR, SQL injection, open redirect, serta kebocoran error internal.
 */

// ==========================================
// 1. TEXT & STRING VALIDATION
// ==========================================

/**
 * Server-side Input Validation & Sanitization Library
 * CSR ANTAM Application
 *
 * PHASE 5.3: INPUT VALIDATION & WEB SECURITY
 * Memberikan validasi ketat di sisi server untuk seluruh mutasi, FormData,
 * mencegah XSS, IDOR, SQL injection, open redirect, serta kebocoran error internal.
 */

export type ValidationSuccess<T> = {
  valid: true;
  success: true;
  value: T;
  data: T;
  error?: never;
};

export type ValidationFailure = {
  valid: false;
  success: false;
  error: string;
  value?: never;
  data?: never;
};

export type ValidationResult<T> = ValidationSuccess<T> | ValidationFailure;

function success<T>(val: T): ValidationSuccess<T> {
  return { valid: true, success: true, value: val, data: val };
}

function failure(err: string): ValidationFailure {
  return { valid: false, success: false, error: err };
}

// ==========================================
// 1. TEXT & STRING VALIDATION
// ==========================================

export function validateRequiredString(
  val: unknown,
  fieldName = "Kolom",
  minLen = 1,
  maxLen = 255
): ValidationResult<string> {
  if (val === null || val === undefined) {
    return failure(`${fieldName} wajib diisi.`);
  }
  const str = String(val).trim();
  if (str.length < minLen) {
    return failure(`${fieldName} minimal ${minLen} karakter.`);
  }
  if (str.length > maxLen) {
    return failure(`${fieldName} maksimal ${maxLen} karakter.`);
  }
  return success(str);
}

export function validateOptionalString(
  val: unknown,
  arg2?: string | number,
  arg3?: number
): ValidationResult<string | null> {
  let maxLen = 1000;
  let fieldName = "Teks";

  if (typeof arg2 === "string") {
    fieldName = arg2;
    if (typeof arg3 === "number") {
      maxLen = arg3;
    }
  } else if (typeof arg2 === "number") {
    maxLen = arg2;
  }

  if (val === null || val === undefined) {
    return success(null);
  }
  const str = String(val).trim();
  if (str === "") {
    return success(null);
  }
  if (str.length > maxLen) {
    return failure(`${fieldName} melebihi batas maksimal ${maxLen} karakter.`);
  }
  return success(str);
}

// ==========================================
// 2. EMAIL VALIDATION
// ==========================================

export function validateEmail(val: unknown): ValidationResult<string> {
  if (!val || typeof val !== "string") {
    return failure("Email wajib diisi.");
  }
  const trimmed = val.trim().toLowerCase();
  if (trimmed.length > 255) {
    return failure("Email maksimal 255 karakter.");
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return failure("Format email tidak valid.");
  }
  return success(trimmed);
}

// ==========================================
// 3. SAFE URL VALIDATION (ANTI-XSS & ANTI-OPEN-REDIRECT)
// ==========================================

export function validateSafeUrl(
  val: unknown,
  optionsOrFieldName?: string | { allowRelative?: boolean; maxLen?: number; fieldName?: string }
): ValidationResult<string | null> {
  let allowRelative = false;
  let maxLen = 1000;
  let fieldName = "URL";

  if (typeof optionsOrFieldName === "string") {
    fieldName = optionsOrFieldName;
  } else if (optionsOrFieldName && typeof optionsOrFieldName === "object") {
    if (optionsOrFieldName.allowRelative !== undefined) allowRelative = optionsOrFieldName.allowRelative;
    if (optionsOrFieldName.maxLen !== undefined) maxLen = optionsOrFieldName.maxLen;
    if (optionsOrFieldName.fieldName !== undefined) fieldName = optionsOrFieldName.fieldName;
  }

  if (val === null || val === undefined) {
    return success(null);
  }
  const str = String(val).trim();
  if (str === "") {
    return success(null);
  }
  if (str.length > maxLen) {
    return failure(`${fieldName} melebihi batas maksimal ${maxLen} karakter.`);
  }

  // Tolak skema berbahaya: javascript:, data:, vbscript:, null byte, carriage return, newline
  const lower = str.toLowerCase();
  if (
    lower.startsWith("javascript:") ||
    lower.startsWith("data:") ||
    lower.startsWith("vbscript:") ||
    lower.includes("\0") ||
    lower.includes("\r") ||
    lower.includes("\n")
  ) {
    return failure(`${fieldName} mengandung skema atau karakter tidak aman.`);
  }

  // Jika URL relatif diizinkan (misal path gambar internal "/images/...")
  if (allowRelative && str.startsWith("/")) {
    // Cegah protocol-relative //evil.com atau Windows backslash /\evil.com
    if (str.startsWith("//") || str.startsWith("/\\")) {
      return failure(`${fieldName} relatif tidak valid.`);
    }
    return success(str);
  }

  // Absolute URL: wajib http: atau https:
  try {
    const parsed = new URL(str);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return failure(`${fieldName} harus menggunakan protokol HTTP atau HTTPS.`);
    }
    return success(parsed.toString());
  } catch {
    return failure(`Format ${fieldName} tidak valid.`);
  }
}

// ==========================================
// 4. ENUM & STATUS VALIDATION
// ==========================================

export function validateEnum<T extends string>(
  val: unknown,
  allowedValues: readonly T[],
  defaultValue?: T,
  fieldName = "Pilihan"
): ValidationResult<T> {
  if (val === null || val === undefined || String(val).trim() === "") {
    if (defaultValue !== undefined) {
      return success(defaultValue);
    }
    return failure(`${fieldName} wajib dipilih.`);
  }
  const str = String(val).trim();
  if ((allowedValues as readonly string[]).includes(str)) {
    return success(str as T);
  }
  if (defaultValue !== undefined) {
    return success(defaultValue);
  }
  return failure(`Nilai ${fieldName} tidak valid.`);
}

// ==========================================
// 5. NUMBER & INTEGER VALIDATION
// ==========================================

export function validateOptionalNumber(
  val: unknown,
  fieldName = "Angka",
  min = -Infinity,
  max = Infinity
): ValidationResult<number | null> {
  if (val === null || val === undefined || String(val).trim() === "") {
    return success(null);
  }
  const num = Number(val);
  if (!Number.isFinite(num)) {
    return failure(`${fieldName} harus berupa angka numerik valid.`);
  }
  if (num < min || num > max) {
    return failure(`${fieldName} harus berada di antara ${min} dan ${max}.`);
  }
  return success(num);
}

export function validateOptionalInteger(
  val: unknown,
  fieldName = "Bilangan bulat",
  min = -Infinity,
  max = Infinity
): ValidationResult<number | null> {
  if (val === null || val === undefined || String(val).trim() === "") {
    return success(null);
  }
  const num = Number(val);
  if (!Number.isInteger(num)) {
    return failure(`${fieldName} harus berupa bilangan bulat.`);
  }
  if (num < min || num > max) {
    return failure(`${fieldName} harus berada di antara ${min} dan ${max}.`);
  }
  return success(num);
}

// ==========================================
// 6. DATE VALIDATION
// ==========================================

export function validateOptionalDate(
  val: unknown,
  fieldName = "Tanggal"
): ValidationResult<Date | null> {
  if (val === null || val === undefined || String(val).trim() === "") {
    return success(null);
  }
  const str = String(val).trim();
  const d = new Date(str);
  if (isNaN(d.getTime())) {
    return failure(`Format ${fieldName} tidak valid.`);
  }
  return success(d);
}

// ==========================================
// 7. IDENTIFIER / UUID VALIDATION
// ==========================================

export function validateId(
  val: unknown,
  fieldName?: string,
  required?: true
): ValidationResult<string>;
export function validateId(
  val: unknown,
  fieldName: string,
  required: false
): ValidationResult<string | null>;
export function validateId(
  val: unknown,
  fieldName = "ID",
  required = true
): ValidationResult<string | null> {
  if (val === null || val === undefined || String(val).trim() === "") {
    if (!required) {
      return success(null);
    }
    return failure(`${fieldName} tidak valid.`);
  }
  const str = String(val).trim();
  if (str.length > 100 || !/^[a-zA-Z0-9_-]+$/.test(str)) {
    return failure(`Format ${fieldName} tidak valid.`);
  }
  return success(str);
}

export function validateOptionalId(
  val: unknown,
  fieldName = "ID"
): ValidationResult<string | null> {
  return validateId(val, fieldName, false);
}

// ==========================================
// 8. ERROR MESSAGE SANITIZATION (ANTI-LEAKAGE)
// ==========================================

/**
 * Memastikan pesan error ke client tidak membocorkan detail internal database,
 * SQL syntax, Prisma model internals, database host, atau stack trace.
 */
export function toSafeErrorMessage(error: unknown, fallback: string): string {
  // Hanya log ke console server
  if (process.env.NODE_ENV !== "production") {
    console.error("[SafeErrorGuard] Internal error suppressed:", error);
  }
  return fallback;
}
