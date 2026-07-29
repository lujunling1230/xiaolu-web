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
  /** 登录 */
  login: (username: string, password: string) => { success: boolean; error?: string };
  /** 注册 */
  register: (username: string, password: string) => { success: boolean; error?: string };
  /** 退出 */
  logout: () => void;
  /** 刷新会话状态 */
  refresh: () => void;
}

const UserAuthContext = createContext<UserAuthContextValue>({
  isLoggedIn: false,
  username: null,
  session: null,
  login: () => ({ success: false, error: "" }),
  register: () => ({ success: false, error: "" }),
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

  const login = (username: string, password: string) => {
    const result = loginUser(username, password);
    if (result.success) {
      refresh();
    }
    return result;
  };

  const register = (username: string, password: string) => {
    const result = registerUser(username, password);
    if (result.success) {
      // 注册成功后自动登录
      loginUser(username, password);
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
