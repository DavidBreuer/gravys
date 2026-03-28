import { createContext } from "react";

export interface AuthState {
  username: string;
  authHeader: string;
  logout: () => void;
}

export const AuthContext = createContext<AuthState>({
  username: "",
  authHeader: "",
  logout: () => {},
});
