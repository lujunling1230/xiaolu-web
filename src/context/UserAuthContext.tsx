import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  getCurrentSession,
  getCurrentUsername,
  isLoggedIn as checkLoggedIn,
  loginUser,
  logoutUser,
  registerUser,
  type UserSession,
} from "../utils/userAuth";

interface UserAuthContextValue {
  /** 是否已登录 */
  isLoggedIn: boolean;
  /** 当前用户名 */
  username: string | null;
  /** 当前会话 */
  session: UserSession | null;
  /** 登录（异步，调用服务端 API） */
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  /** 注册（异步，调用服务端 API） */
  register: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  /** 退出 */
  logout: () => void;
  /** 刷新会话状态 */
  refresh: () => void;
}

const UserAuthContext = createContext<UserAuthContextValue>({
  isLoggedIn: false,
  username: null,
  session: null,
  login: async () => ({ success: false, error: "" }),
  register: async () => ({ success: false, error: "" }),
  logout: () => {},
  refresh: () => {},
});

export function UserAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<UserSession | null>(null);

  const refresh = () => {
    setSession(getCurrentSession());
  };

  useEffect(() => {
    refresh();
  }, []);

  const login = async (username: string, password: string) => {
    const result = await loginUser(username, password);
    if (result.success) {
      refresh();
    }
    return result;
  };

  const register = async (username: string, password: string) => {
    const result = await registerUser(username, password);
    if (result.success) {
      // 注册成功后已自动登录（loginUser/registerUser 内部保存了 session）
      refresh();
    }
    return result;
  };

  const logout = () => {
    logoutUser();
    refresh();
  };

  return (
    <UserAuthContext.Provider
      value={{
        isLoggedIn: checkLoggedIn(),
        username: getCurrentUsername(),
        session,
        login,
        register,
        logout,
        refresh,
      }}
    >
      {children}
    </UserAuthContext.Provider>
  );
}

export function useUserAuth(): UserAuthContextValue {
  return useContext(UserAuthContext);
}
