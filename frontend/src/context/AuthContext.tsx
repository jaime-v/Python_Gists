/**
 * context/AuthContext.tsx
 *
 * Context for logged in user
 */
import { createContext } from "react";
import type { AuthContextType } from "@models";
export const AuthContext = createContext<AuthContextType | null>(null);
