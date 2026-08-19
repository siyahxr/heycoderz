import fs from "fs";
import path from "path";
import { BASE_EFE, BASE_OYKU, UserProfile } from "@/context/AuthContext";
import { BlogArticle } from "@/context/BlogContext";
import { CommunityPost } from "@/context/CommunityContext";
import { JobListing } from "@/app/ilanlar/page";

export interface StoredUser extends UserProfile {
  password?: string;
}

export interface DatabaseSchema {
  users: StoredUser[];
  adminPasswords: {
    efe: string;
    oyku: string;
  };
  posts: CommunityPost[];
  articles: BlogArticle[];
  jobs: JobListing[];
  lastUpdated: number;
}

const DATA_DIR = path.join(process.cwd(), ".data");
const DB_FILE = path.join(DATA_DIR, "database.json");

// Default initial state
const INITIAL_DATABASE: DatabaseSchema = {
  users: [
    {
      ...BASE_EFE,
      password: "efe2008efeAxA!!3131",
    },
    {
      ...BASE_OYKU,
      password: "oyku2026heycoderz!",
    },
  ],
  adminPasswords: {
    efe: "efe2008efeAxA!!3131",
    oyku: "oyku2026heycoderz!",
  },
  posts: [
    {
      id: "post-welcome",
      authorId: "admin-master",
      authorName: "Efe Taşkın",
      authorUsername: "efe",
      authorAvatar: "https://api.dicebear.com/7.x/bottts/svg?seed=1787085332805",
      authorBadge: "Kurucu & Baş Geliştirici",
      authorRole: "admin",
      title: "Hey Coder'z Platformu Yayında! 🚀",
      body: "heycoderz platformuna hoş geldiniz! Burada yeni nesil araçları keşfedebilir, kod playground alanında denemeler yapabilir ve geliştirici topluluğuyla etkileşime geçebilirsiniz.",
      codeSnippet: `// heycoderz geliştirici manifestosu
const platform = {
  name: "heycoderz",
  mission: "Geliştiricileri güçlendirmek",
  openTools: true,
  communityFirst: true
};`,
      tag: "Genel",
      likes: 1,
      likedByUserIds: ["admin-master"],
      comments: [],
      createdAt: Date.now() - 3600000 * 2,
      timestamp: Date.now() - 3600000 * 2,
    },
  ],
  articles: [],
  jobs: [],
  lastUpdated: Date.now(),
};

// In-memory fallback (for serverless environments where fs is read-only)
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
        posts: parsed.posts || INITIAL_DATABASE.posts,
      };
      return inMemoryDb;
    }
  } catch (err) {
    console.warn("Could not read from DB file, using in-memory db:", err);
  }
  return inMemoryDb;
}

export function saveDatabase(data: Partial<DatabaseSchema>): DatabaseSchema {
  const current = getDatabase();
  const updated: DatabaseSchema = {
    ...current,
    ...data,
    lastUpdated: Date.now(),
  };
  inMemoryDb = updated;

  try {
    if (ensureDataDir()) {
      fs.writeFileSync(DB_FILE, JSON.stringify(updated, null, 2), "utf-8");
    }
  } catch (err) {
    console.warn("Could not write to DB file, data kept in memory:", err);
  }

  return updated;
}
