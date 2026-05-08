/**
 * models/Utils.ts
 *
 * Utility types
 */

// Context for notification
export type NotificationContextType = {
  setNotifActive: React.Dispatch<React.SetStateAction<boolean>>;
  notifVariant: "success" | "danger" | "primary";
  setNotifVariant: React.Dispatch<
    React.SetStateAction<"success" | "danger" | "primary">
  >;
  notifText: string;
  setNotifText: React.Dispatch<React.SetStateAction<string>>;
};
