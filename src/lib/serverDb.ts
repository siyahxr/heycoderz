import fs from "fs";
import path from "path";
import { BASE_MAIN_USER, BASE_OYKU, UserProfile } from "@/context/AuthContext";
import { BlogArticle } from "@/context/BlogContext";
import { CommunityPost } from "@/context/CommunityContext";
import { JobListing } from "@/app/ilanlar/page";

export interface StoredUser extends UserProfile {
  // Security Fix: Plaintext password property REMOVED.
  passwordHash?: string;
  email_verified?: boolean;
  verificationTokenHash?: string;
  verificationTokenExpires?: number;
  resetPasswordTokenHash?: string;
  resetPasswordTokenExpires?: number;
  pendingEmailTokenHash?: string;
  pendingEmailTokenExpires?: number;
  tokenVersion?: number;
}

export interface DatabaseSchema {
  users: StoredUser[];
  posts: CommunityPost[];
  articles: BlogArticle[];
  jobs: JobListing[];
  lastUpdated: number;
}

const DATA_DIR = path.join(process.cwd(), ".data");
const DB_FILE = path.join(DATA_DIR, "database.json");

// Pre-computed secure hashes (PBKDF2-SHA512, 100k iterations) for initial admin accounts
const SIYAH_INITIAL_HASH = "pbkdf2:100000:723e74ba1e309cc8d9047bfaf42b2bc6d73fcc40dc0809bf35a4d4a8e3fcefb0:00e6c518b2ab4826d9c6be368a3297a7e3760434ec9c11867c2cd86bba78c93debeaa60c3afc64da5e6fb4e9c148bb042a9b6c93425121b671ecf2e1a3296c0f";
const OYKU_INITIAL_HASH = "pbkdf2:100000:3a1ab9c8a2b53f6087eb47781fbc0d1d73c73449339e0839de8c9d29fc6d463e:0088b975e54d5b2cf4ed99951cbdf465d3ec6ed45c1103f7e9124a919241ceb17e471d8825c9ed5a40a28f731c3c9c9103c800c01a2cbb54d7e97f08c35b387e";

const INITIAL_DATABASE: DatabaseSchema = {
  users: [
    {
      ...BASE_MAIN_USER,
      email_verified: true,
      passwordHash: SIYAH_INITIAL_HASH,
    },
    {
      ...BASE_OYKU,
      email_verified: true,
      passwordHash: OYKU_INITIAL_HASH,
    },
  ],
  posts: [],
  articles: [],
  jobs: [],
  lastUpdated: Date.now(),
};

// In-memory fallback
let inMemoryDb: DatabaseSchema = { ...INITIAL_DATABASE };

function ensureDataDir(): boolean {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    return true;
  } catch {
    return false;
  }
}

function getCloudCredentials() {
  const rawUrl = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const rawToken = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!rawUrl || !rawToken) return null;
  const url = rawUrl.replace(/^["']|["']$/g, "").trim();
  const token = rawToken.replace(/^["']|["']$/g, "").trim();
  return { url, token };
}

export async function fetchCloudDatabase(): Promise<DatabaseSchema> {
  const creds = getCloudCredentials();
  if (!creds) {
    if (process.env.NODE_ENV === "production") {
      console.error("[REDIS] Missing UPSTASH_REDIS_REST_URL / TOKEN in production environment!");
    }
    return getDatabase();
  }

  try {
    const res = await fetch(creds.url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${creds.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(["GET", "heycoderz_database_v2"]),
      cache: "no-store",
    });
    const data = await res.json();

    if (data?.result) {
      const parsed = typeof data.result === "string" ? JSON.parse(data.result) : data.result;

      // Sanitization: Ensure no plaintext passwords leak from old DB states
      const sanitizedUsers = (parsed.users || []).map((u: any) => {
        const { password, adminPasswords, ...rest } = u;
        return rest;
      });

      inMemoryDb = {
        ...INITIAL_DATABASE,
        ...parsed,
        users: sanitizedUsers.length > 0 ? sanitizedUsers : INITIAL_DATABASE.users,
        posts: Array.isArray(parsed.posts) ? parsed.posts : [],
        articles: Array.isArray(parsed.articles) ? parsed.articles : [],
        jobs: Array.isArray(parsed.jobs) ? parsed.jobs : [],
      };

      // Cleanup legacy adminPasswords from root if it exists
      if ("adminPasswords" in inMemoryDb) {
        delete (inMemoryDb as any).adminPasswords;
      }

      return inMemoryDb;
    }
  } catch (e: any) {
    console.error("[REDIS] Could not fetch database from Upstash Cloud DB:", e?.message);
    if (process.env.NODE_ENV === "production") {
      throw new Error("Veritabanı bağlantı hatası oluştu. Lütfen birazdan tekrar deneyin.");
    }
  }

  return getDatabase();
}

export function getDatabase(): DatabaseSchema {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, "utf-8");
      const parsed = JSON.parse(raw);

      const sanitizedUsers = (parsed.users || []).map((u: any) => {
        const { password, ...rest } = u;
        return rest;
      });

      inMemoryDb = {
        ...INITIAL_DATABASE,
        ...parsed,
        users: sanitizedUsers.length > 0 ? sanitizedUsers : INITIAL_DATABASE.users,
        posts: Array.isArray(parsed.posts) ? parsed.posts : [],
      };

      if ("adminPasswords" in inMemoryDb) {
        delete (inMemoryDb as any).adminPasswords;
      }

      return inMemoryDb;
    }
  } catch (err) {
    console.warn("Could not read from DB file, using in-memory db:", err);
  }
  return inMemoryDb;
}

export async function saveCloudDatabase(data: Partial<DatabaseSchema>): Promise<DatabaseSchema> {
  const current = await fetchCloudDatabase();
  const updated: DatabaseSchema = {
    ...current,
    ...data,
    lastUpdated: Date.now(),
  };

  // Enforce schema sanitization before save
  if ("adminPasswords" in updated) delete (updated as any).adminPasswords;
  updated.users = updated.users.map(u => {
    const { password, ...safeUser } = u as any;
    return safeUser;
  });

  inMemoryDb = updated;

  const creds = getCloudCredentials();
  if (creds) {
    try {
      const res = await fetch(creds.url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${creds.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(["SET", "heycoderz_database_v2", JSON.stringify(updated)]),
      });
      if (!res.ok) {
        throw new Error(`Upstash REST API returned status ${res.status}`);
      }
    } catch (e: any) {
      console.error("[REDIS] Could not persist to Upstash Cloud DB:", e?.message);
      if (process.env.NODE_ENV === "production") {
        throw new Error("Veritabanı kayıt hatası oluştu. Lütfen tekrar deneyin.");
      }
    }
  } else if (process.env.NODE_ENV === "production") {
    console.error("[REDIS] Cannot persist data: Missing Upstash credentials in production!");
    throw new Error("Veritabanı yapılandırma hatası.");
  }

  try {
    if (ensureDataDir()) {
      fs.writeFileSync(DB_FILE, JSON.stringify(updated, null, 2), "utf-8");
    }
  } catch {}

  return updated;
}

export function saveDatabase(data: Partial<DatabaseSchema>): DatabaseSchema {
  const current = getDatabase();
  const updated: DatabaseSchema = {
    ...current,
    ...data,
    lastUpdated: Date.now(),
  };

  // Enforce schema sanitization before save
  if ("adminPasswords" in updated) delete (updated as any).adminPasswords;
  updated.users = updated.users.map(u => {
    const { password, ...safeUser } = u as any;
    return safeUser;
  });

  inMemoryDb = updated;

  const creds = getCloudCredentials();
  if (creds) {
    fetch(creds.url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${creds.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(["SET", "heycoderz_database_v2", JSON.stringify(updated)]),
    }).catch(() => { });
  }

  try {
    if (ensureDataDir()) {
      fs.writeFileSync(DB_FILE, JSON.stringify(updated, null, 2), "utf-8");
    }
  } catch { }

  return updated;
}

/**
 * Atomically consumes a verification token to prevent race conditions.
 * First request locks and consumes it; concurrent requests will fail.
 */
export async function consumeVerificationTokenAtomic(tokenHash: string): Promise<boolean> {
  const creds = getCloudCredentials();
  const lockKey = `lock:verify:${tokenHash}`;

  if (creds) {
    try {
      // SETNX (SET if Not eXists) provides an atomic lock
      const res = await fetch(creds.url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${creds.token}`,
          "Content-Type": "application/json",
        },
        // SET key value NX EX seconds
        body: JSON.stringify(["SET", lockKey, "1", "NX", "EX", "300"]), // 5 min lock
        cache: "no-store"
      });

      const data = await res.json();
      // If result is null, the key already existed (another request holds the lock)
      if (data.result === null) {
        return false;
      }
      return true; // We acquired the lock atomically
    } catch {
      // Fallback to local memory lock on network error
    }
  }

  // Fallback to in-memory lock
  if ((global as any).__verifyLocks?.has(tokenHash)) {
    return false;
  }
  if (!(global as any).__verifyLocks) {
    (global as any).__verifyLocks = new Set();
  }
  (global as any).__verifyLocks.add(tokenHash);

  // Clean up lock after 5 minutes
  setTimeout(() => {
    (global as any).__verifyLocks?.delete(tokenHash);
  }, 5 * 60 * 1000);

  return true;
}

/**
 * Mask IP address for privacy compliance (e.g. 192.168.1.55 -> 192.168.1.xxx)
 */
export function maskIp(ip?: string): string {
  if (!ip) return "unknown";
  if (ip === "127.0.0.1" || ip === "::1") return "localhost";
  if (ip.includes(".")) {
    const parts = ip.split(".");
    if (parts.length === 4) {
      return `${parts[0]}.${parts[1]}.${parts[2]}.xxx`;
    }
  }
  if (ip.includes(":")) {
    const parts = ip.split(":");
    return parts.slice(0, 3).join(":") + ":xxxx";
  }
  return "xxx.xxx.xxx.xxx";
}

/**
 * Appends a privacy-safe security event to the user's activity log.
 * Never stores passwords, tokens, hashes, or credentials.
 * Keeps at most 30 recent entries.
 */
export async function appendSecurityLog(
  userId: string,
  type:
    | "LOGIN_SUCCESS"
    | "LOGIN_FAILED"
    | "EMAIL_VERIFIED"
    | "PASSWORD_CHANGED"
    | "PASSWORD_RESET_REQUESTED"
    | "PASSWORD_RESET_COMPLETED"
    | "EMAIL_CHANGE_REQUESTED"
    | "EMAIL_CHANGED"
    | "LOGOUT"
    | "ACCOUNT_DELETED",
  ip?: string,
  details?: string
): Promise<void> {
  try {
    const db = await fetchCloudDatabase();
    const userIndex = db.users.findIndex((u) => u.id === userId || u.username === userId);
    if (userIndex === -1) return;

    const user = db.users[userIndex];
    const logs = Array.isArray(user.securityLogs) ? [...user.securityLogs] : [];

    const newLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      type,
      timestamp: Date.now(),
      ip: maskIp(ip),
      details: details ? details.slice(0, 150) : undefined,
    };

    // Keep only the most recent 30 events
    const updatedLogs = [newLog, ...logs].slice(0, 30);

    const updatedUser = {
      ...user,
      securityLogs: updatedLogs,
    };

    const updatedUsers = [...db.users];
    updatedUsers[userIndex] = updatedUser;

    await saveCloudDatabase({ users: updatedUsers });
    console.log(`[SECURITY] Logged event: ${type} for user: ${user.username}`);
  } catch (err) {
    console.error("[SECURITY] Failed to record security log:", err);
  }
}

