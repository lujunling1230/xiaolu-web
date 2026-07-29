/**
 * userAuth.ts
 *
 * 本地用户账号系统
 * - 注册/登录/退出
 * - 密码使用简单 base64 编码（非安全场景，仅做基础隔离）
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
}

const ACCOUNTS_KEY = "user_accounts";
const SESSION_KEY = "current_user_session";

function encodePassword(pw: string): string {
  // 简单编码，防止明文存储
  try {
    return btoa(encodeURIComponent(pw));
  } catch {
    return pw;
  }
}

function decodePassword(hash: string): string {
  try {
    return decodeURIComponent(atob(hash));
  } catch {
    return hash;
  }
}

/** 读取所有账号 */
function loadAccounts(): UserAccount[] {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/** 保存账号列表 */
function saveAccounts(accounts: UserAccount[]): void {
  try {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch {
    /* ignore */
  }
}

/** 注册新账号 */
export function registerUser(username: string, password: string): { success: boolean; error?: string } {
  const trimmed = username.trim();
  if (!trimmed) return { success: false, error: "请输入用户名" };
  if (!password) return { success: false, error: "请输入密码" };
  if (trimmed.length < 2) return { success: false, error: "用户名至少2个字符" };
  if (trimmed.length > 20) return { success: false, error: "用户名最多20个字符" };
  if (password.length < 4) return { success: false, error: "密码至少4个字符" };

  const accounts = loadAccounts();
  if (accounts.some((a) => a.username === trimmed)) {
    return { success: false, error: "该用户名已被注册" };
  }

  accounts.push({
    username: trimmed,
    passwordHash: encodePassword(password),
    createdAt: Date.now(),
  });
  saveAccounts(accounts);
  return { success: true };
}

/** 登录 */
export function loginUser(username: string, password: string): { success: boolean; error?: string } {
  const trimmed = username.trim();
  if (!trimmed || !password) return { success: false, error: "请输入用户名和密码" };

  const accounts = loadAccounts();
  const account = accounts.find((a) => a.username === trimmed);
  if (!account) return { success: false, error: "用户名或密码错误" };

  if (account.passwordHash !== encodePassword(password)) {
    return { success: false, error: "用户名或密码错误" };
  }

  const session: UserSession = { username: trimmed, loginAt: Date.now() };
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    /* ignore */
  }
  return { success: true };
}

/** 退出登录 */
export function logoutUser(): void {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
}

/** 获取当前会话 */
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

/** 是否已登录 */
export function isLoggedIn(): boolean {
  return getCurrentSession() !== null;
}

/** 获取当前用户名 */
export function getCurrentUsername(): string | null {
  const session = getCurrentSession();
  return session?.username ?? null;
}

/** 获取用户数据前缀 */
export function getUserKeyPrefix(): string {
  const username = getCurrentUsername();
  if (!username) return "";
  return `u_${username}_`;
}

/** 将基础 key 转换为当前用户隔离的 key */
export function getUserStorageKey(baseKey: string): string {
  const prefix = getUserKeyPrefix();
  if (!prefix) return baseKey;
  return `${prefix}${baseKey}`;
}

/** 删除当前用户的所有数据（注销账号用） */
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

/** 注销账号（删除账号 + 所有数据） */
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
