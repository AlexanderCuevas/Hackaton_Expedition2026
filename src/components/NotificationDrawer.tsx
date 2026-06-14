import { X, Check, UserPlus, UserCheck, ThumbsUp, MessageSquare, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useNotification } from "../context/NotificationContext";
import { Button } from "./ui/button";
import type { NotificationType } from "../types";

interface NotificationDrawerProps {
  open: boolean;
  onClose: () => void;
}

function NotificationIcon({ type }: { type: NotificationType }) {
  const className = "h-4 w-4 shrink-0";
  switch (type) {
    case "connection_request":
      return <UserPlus className={`${className} text-blue-500`} />;
    case "connection_accepted":
      return <UserCheck className={`${className} text-emerald-500`} />;
    case "like":
      return <ThumbsUp className={`${className} text-rose-500`} />;
    case "comment":
      return <MessageSquare className={`${className} text-amber-500`} />;
    case "system":
      return <Sparkles className={`${className} text-[#B50E30]`} />;
  }
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Ahora";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d`;
  return new Date(iso).toLocaleDateString("es-PE", { day: "numeric", month: "short" });
}

export default function NotificationDrawer({ open, onClose }: NotificationDrawerProps) {
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification } = useNotification();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="notif-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 z-40"
            onClick={onClose}
          />

          <motion.div
            key="notif-drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl z-50 flex flex-col border-l border-gray-200"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-gray-900">Notificaciones</h2>
                {unreadCount > 0 && (
                  <span className="text-[10px] font-bold text-white bg-[#B50E30] px-2 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-[11px] font-semibold text-gray-500 hover:text-gray-900 h-auto px-2 py-1"
                  >
                    <Check className="h-3.5 w-3.5 mr-1" />
                    Leer todo
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="h-8 w-8 rounded-full text-gray-400 hover:text-gray-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-6">
                  <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                    <Sparkles className="h-6 w-6 text-gray-300" />
                  </div>
                  <p className="text-sm font-semibold text-gray-500">Sin notificaciones</p>
                  <p className="text-xs text-gray-400 mt-1">Tus actividades aparecerán aquí</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markAsRead(n.id)}
                      className={`flex items-start gap-3 px-5 py-4 transition cursor-pointer hover:bg-gray-50 ${
                        n.read ? "opacity-70" : "bg-[#B50E30]/[0.03]"
                      }`}
                    >
                      <div className="mt-0.5">
                        <NotificationIcon type={n.type} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-900 leading-snug">
                          {n.title}
                        </p>
                        {n.description && (
                          <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed line-clamp-2">
                            {n.description}
                          </p>
                        )}
                        <p className="text-[10px] text-gray-400 mt-1 font-medium">
                          {timeAgo(n.timestamp)}
                        </p>
                      </div>
                      {!n.read && (
                        <span className="h-2 w-2 rounded-full bg-[#B50E30] shrink-0 mt-1.5" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
