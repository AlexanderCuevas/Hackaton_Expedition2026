import { Bell } from "lucide-react";
import { useNotification } from "../context/NotificationContext";
import { Button } from "./ui/button";

interface NotificationBellProps {
  onClick: () => void;
}

export default function NotificationBell({ onClick }: NotificationBellProps) {
  const { unreadCount } = useNotification();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className="relative h-9 w-9 rounded-full hover:bg-neutral-100"
    >
      <Bell className="h-5 w-5 text-neutral-700" />
      {unreadCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-[#B50E30] rounded-full leading-none">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </Button>
  );
}
