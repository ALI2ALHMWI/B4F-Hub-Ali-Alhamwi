import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Queue from "../../data-structures/Queue";

export type NotificationKind = "success" | "error" | "info";

interface NotificationItem {
  id: number;
  message: string;
  kind: NotificationKind;
}

interface NotificationContextValue {
  notify: (message: string, kind?: NotificationKind) => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(
  null,
);

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const notificationQueue = useRef(new Queue<NotificationItem>());

  const nextNotificationId = useRef(1);

  const [currentNotification, setCurrentNotification] =
    useState<NotificationItem | null>(null);

  const notify = useCallback(
    (message: string, kind: NotificationKind = "success"): void => {
      const newNotification: NotificationItem = {
        id: nextNotificationId.current,
        message,
        kind,
      };

      nextNotificationId.current += 1;

      if (currentNotification === null) {
        setCurrentNotification(newNotification);
        return;
      }

      notificationQueue.current.enqueue(newNotification);
    },
    [currentNotification],
  );

  function dismissNotification(): void {
    const nextNotification = notificationQueue.current.dequeue();

    setCurrentNotification(nextNotification ?? null);
  }

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}

      {currentNotification && (
        <div
          className={`notification notification-${currentNotification.kind}`}
          role="status"
          aria-live="polite"
        >
          <span>{currentNotification.message}</span>

          <button
            className="notification-close"
            type="button"
            onClick={dismissNotification}
            aria-label="Dismiss notification"
          >
            ×
          </button>
        </div>
      )}
    </NotificationContext.Provider>
  );
}

export function useNotifications(): NotificationContextValue {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(
      "useNotifications must be used inside NotificationProvider",
    );
  }

  return context;
}
