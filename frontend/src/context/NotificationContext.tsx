/**
 * context/NotificationContext.tsx
 *
 * Context for logged in user
 */
import { createContext } from "react";
import type { NotificationContextType } from "@models";
export const NotificationContext =
  createContext<NotificationContextType | null>(null);
