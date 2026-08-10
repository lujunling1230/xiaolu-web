/**
 * userAuth.ts
 *
 * 用户账号系统（服务端 + 本地降级）
 * - 注册/登录优先调用服务端 API（/api/auth），账号存储在 Supabase
 * - 服务端不可用时降级到 localStorage（仅当前浏览器可用）
 * - 旧版 localStorage 账号自动迁移到服务端
 * - 当前会话持久化在 localStorage
 */

export interface UserAccount {
  username: string;
  passwordHash: string;
  createdAt: number;
}

export interface UserSession {
  username: string;
  loginAt: number;
  /** 服务端 session token（旧版本地账号无此字段） */
  token?: string;
  /** token 过期时间戳（ms） */
  expires?: number;
}

const ACCOUNTS_KEY = "user_accounts";
const SESSION_KEY = "current_user_session";

/* ============ 内部工具：localStorage 账号管理 ============ */

function encodePassword(pw: string): string {
  try {
    return btoa(encodeURIComponent(pw));
  } catch {
    return pw;
  }
}

function loadAccounts(): UserAccount[] {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveAccounts(accounts: UserAccount[]): void {
  try {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch {
    /* ignore */
  }
}

function saveSession(session: UserSession): void {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    /* ignore */
  }
}

/* ============ 内部工具：本地注册/登录（降级方案） ============ */

function registerLocal(username: string, password: string): { success: boolean; error?: string } {
  const accounts = loadAccounts();
  if (accounts.some((a) => a.username === username)) {
    return { success: false, error: "该用户名已被注册" };
  }
  accounts.push({
    username,
    passwordHash: encodePassword(password),
    createdAt: Date.now(),
  });
  saveAccounts(accounts);
  const session: UserSession = { username, loginAt: Date.now() };
  saveSession(session);
  return { success: true };
}

function loginLocal(username: string, password: string): { success: boolean; error?: string } {
  const accounts = loadAccounts();
  const account = accounts.find((a) => a.username === username);
  if (!account) return { success: false, error: "用户名或密码错误" };
  if (account.passwordHash !== encodePassword(password)) {
    return { success: false, error: "用户名或密码错误" };
  }
  const session: UserSession = { username, loginAt: Date.now() };
  saveSession(session);
  return { success: true };
}

/* ============ 公开 API：注册（异步，服务端优先） ============ */

export async function registerUser(
  username: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  const trimmed = username.trim();
  if (!trimmed) return { success: false, error: "请输入用户名" };
  if (!password) return { success: false, error: "请输入密码" };
  if (trimmed.length < 2) return { success: false, error: "用户名至少2个字符" };
  if (trimmed.length > 20) return { success: false, error: "用户名最多20个字符" };
  if (password.length < 4) return { success: false, error: "密码至少4个字符" };

  // 1. 尝试服务端注册
  try {
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "register", username: trimmed, password }),
    });
    const data = await res.json();

    if (data.success) {
      // 服务端注册成功 → 保存 session + 本地备份
      const session: UserSession = {
        username: trimmed,
        loginAt: Date.now(),
        token: data.token,
        expires: data.expires,
      };
      saveSession(session);

      // 本地备份（离线降级用）
      const accounts = loadAccounts();
      if (!accounts.some((a) => a.username === trimmed)) {
        accounts.push({
          username: trimmed,
          passwordHash: encodePassword(password),
          createdAt: Date.now(),
        });
        saveAccounts(accounts);
      }
      return { success: true };
    }

    // 用户名已被注册 → 直接返回错误
    if (data.error === "该用户名已被注册") {
      return { success: false, error: data.error };
    }

    // 其他服务端错误 → 降级到本地
    return registerLocal(trimmed, password);
  } catch {
    // 网络错误 → 降级到本地
    return registerLocal(trimmed, password);
  }
}

/* ============ 公开 API：登录（异步，服务端优先） ============ */

export async function loginUser(
  username: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  const trimmed = username.trim();
  if (!trimmed || !password) return { success: false, error: "请输入用户名和密码" };

  // 1. 尝试服务端登录
  try {
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "login", username: trimmed, password }),
    });
    const data = await res.json();

    if (data.success) {
      const session: UserSession = {
        username: trimmed,
        loginAt: Date.now(),
        token: data.token,
        expires: data.expires,
      };
      saveSession(session);
      return { success: true };
    }

    // 服务端找不到用户 → 尝试本地登录（旧版账号）
    if (data.error === "用户名或密码错误") {
      const localResult = loginLocal(trimmed, password);
      if (localResult.success) {
        // 本地登录成功，尝试静默迁移到服务端
        try {
          const migrateRes = await fetch("/api/auth", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "register", username: trimmed, password }),
          });
          const migrateData = await migrateRes.json();
          if (migrateData.success) {
            // 迁移成功，更新 session 为服务端 token
            const session: UserSession = {
              username: trimmed,
              loginAt: Date.now(),
              token: migrateData.token,
              expires: migrateData.expires,
            };
            saveSession(session);
          }
        } catch {
          /* 迁移失败不影响登录，继续使用本地账号 */
        }
        return { success: true };
      }
    }

    return { success: false, error: data.error || "用户名或密码错误" };
  } catch {
    // 网络错误 → 降级到本地
    return loginLocal(trimmed, password);
  }
}

/* ============ 公开 API：退出登录 ============ */

export function logoutUser(): void {
  // 获取当前 session 中的 token
  const session = getCurrentSession();

  // 异步通知服务端注销（fire-and-forget）
  if (session?.token) {
    fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout", token: session.token }),
    }).catch(() => {
      /* ignore */
    });
  }

  // 清除本地 session
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
}

/* ============ 公开 API：验证 session token ============ */

export async function verifyToken(token: string): Promise<boolean> {
  try {
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "verify", token }),
    });
    const data = await res.json();
    return data.valid === true;
  } catch {
    // 网络错误时信任本地 session
    return true;
  }
}

/* ============ 公开 API：会话读取（同步） ============ */

export function getCurrentSession(): UserSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session: UserSession = JSON.parse(raw);
    if (session && session.username) return session;
    return null;
  } catch {
    return null;
  }
}

export function isLoggedIn(): boolean {
  return getCurrentSession() !== null;
}

export function getCurrentUsername(): string | null {
  const session = getCurrentSession();
  return session?.username ?? null;
}

/* ============ 公开 API：用户数据隔离 ============ */

export function getUserKeyPrefix(): string {
  const username = getCurrentUsername();
  if (!username) return "";
  return `u_${username}_`;
}

export function getUserStorageKey(baseKey: string): string {
  const prefix = getUserKeyPrefix();
  if (!prefix) return baseKey;
  return `${prefix}${baseKey}`;
}

/* ============ 公开 API：账号数据管理 ============ */

export function deleteCurrentUserData(): void {
  const prefix = getUserKeyPrefix();
  if (!prefix) return;
  const toRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(prefix)) {
      toRemove.push(key);
    }
  }
  toRemove.forEach((k) => localStorage.removeItem(k));
}

export function deleteAccount(username: string): void {
  const accounts = loadAccounts().filter((a) => a.username !== username);
  saveAccounts(accounts);

  const prefix = `u_${username}_`;
  const toRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(prefix)) {
      toRemove.push(key);
    }
  }
  toRemove.forEach((k) => localStorage.removeItem(k));

  const session = getCurrentSession();
  if (session?.username === username) {
    logoutUser();
  }
}
