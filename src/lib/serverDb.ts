import fs from "fs";
import path from "path";
import { BASE_MAIN_USER, BASE_OYKU, UserProfile } from "@/context/AuthContext";
import { BlogArticle } from "@/context/BlogContext";
import { CommunityPost } from "@/context/CommunityContext";
import { JobListing } from "@/app/ilanlar/page";

export interface StoredUser extends UserProfile {
  password?: string;
}

export interface DatabaseSchema {
  users: StoredUser[];
  adminPasswords: {
    siyah: string;
    oyku: string;
  };
  posts: CommunityPost[];
  articles: BlogArticle[];
  jobs: JobListing[];
  lastUpdated: number;
}

const DATA_DIR = path.join(process.cwd(), ".data");
const DB_FILE = path.join(DATA_DIR, "database.json");

// Default initial state (Clean, no phantom demo posts)
const INITIAL_DATABASE: DatabaseSchema = {
  users: [
    {
      ...BASE_MAIN_USER,
      password: "siyah2026heycoderz!",
    },
    {
      ...BASE_OYKU,
      password: "oyku2026heycoderz!",
    },
  ],
  adminPasswords: {
    siyah: "siyah2026heycoderz!",
    oyku: "oyku2026heycoderz!",
  },
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

// Check Cloud KV / Upstash credentials
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
    return getDatabase();
  }

  try {
    // 1. Try standard Upstash REST command
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
      inMemoryDb = {
        ...INITIAL_DATABASE,
        ...parsed,
        users: parsed.users && parsed.users.length > 0 ? parsed.users : INITIAL_DATABASE.users,
        adminPasswords: parsed.adminPasswords || INITIAL_DATABASE.adminPasswords,
        posts: Array.isArray(parsed.posts) ? parsed.posts : [],
        articles: Array.isArray(parsed.articles) ? parsed.articles : [],
        jobs: Array.isArray(parsed.jobs) ? parsed.jobs : [],
      };
      return inMemoryDb;
    }
  } catch (e) {
    console.warn("Could not fetch from Upstash Cloud DB, falling back to local:", e);
  }

  return getDatabase();
}

export function getDatabase(): DatabaseSchema {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      inMemoryDb = {
        ...INITIAL_DATABASE,
        ...parsed,
        users: parsed.users && parsed.users.length > 0 ? parsed.users : INITIAL_DATABASE.users,
        adminPasswords: parsed.adminPasswords || INITIAL_DATABASE.adminPasswords,
        posts: Array.isArray(parsed.posts) ? parsed.posts : [],
      };
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
  inMemoryDb = updated;

  // 1. Persist to Cloud Database (Upstash Redis)
  const creds = getCloudCredentials();
  if (creds) {
    try {
      await fetch(creds.url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${creds.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(["SET", "heycoderz_database_v2", JSON.stringify(updated)]),
      });
    } catch (e) {
      console.warn("Could not persist to Upstash Cloud DB:", e);
    }
  }

  // 2. Persist locally to file if possible
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
  inMemoryDb = updated;

  // Background cloud save if credentials exist
  const creds = getCloudCredentials();
  if (creds) {
    fetch(creds.url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${creds.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(["SET", "heycoderz_database_v2", JSON.stringify(updated)]),
    }).catch(() => {});
  }

  try {
    if (ensureDataDir()) {
      fs.writeFileSync(DB_FILE, JSON.stringify(updated, null, 2), "utf-8");
    }
  } catch {}

  return updated;
}
