import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bell, ClipboardList, Home, CheckCheck } from "lucide-react";
import BottomTabBar from "@/components/BottomTabBar";
import { Button } from "@/components/ui/button";

interface Notification {
  id: string;
  icon: "bell" | "clipboard" | "home";
  title: string;
  summary: string;
  date: string;
  read: boolean;
}

const initialNotifications: Notification[] = [
  { id: "1", icon: "home", title: "이사 예약 확정", summary: "이사 예약이 확정되었습니다.", date: "2026-04-06", read: false },
  { id: "2", icon: "clipboard", title: "하자 처리 완료", summary: "하자 접수 #003 처리가 완료되었습니다.", date: "2026-04-05", read: false },
  { id: "3", icon: "bell", title: "새 공지사항", summary: "새 공지사항이 등록되었습니다: 입주 일정 안내", date: "2026-04-04", read: true },
  { id: "4", icon: "clipboard", title: "하자 접수 접수완료", summary: "하자 접수 #004가 정상 접수되었습니다.", date: "2026-04-03", read: true },
  { id: "5", icon: "bell", title: "납부 안내", summary: "잔금 납부 기한이 7일 남았습니다.", date: "2026-04-02", read: true },
];

const iconMap = {
  bell: Bell,
  clipboard: ClipboardList,
  home: Home,
};

const NotificationsPage = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="mx-auto max-w-[390px] min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-base font-bold text-foreground flex-1">알림 내역</h1>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" className="text-xs text-primary" onClick={markAllRead}>
            <CheckCheck className="w-4 h-4 mr-1" /> 전체 읽음
          </Button>
        )}
      </div>

      {/* List */}
      <div className="flex-1 px-4 py-4">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh] text-center gap-2">
            <Bell className="w-12 h-12 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">알림 내역이 없습니다</p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((n) => {
              const Icon = iconMap[n.icon];
              return (
                <div
                  key={n.id}
                  onClick={() => setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, read: true } : item))}
                  className={`bg-card border rounded-xl px-4 py-3.5 flex items-start gap-3 cursor-pointer transition-colors hover:bg-muted/30 ${
                    !n.read ? "border-l-4 border-l-primary border-t border-r border-b border-border" : "border-border"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${!n.read ? "bg-primary/10" : "bg-muted"}`}>
                    <Icon className={`w-4 h-4 ${!n.read ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold ${!n.read ? "text-foreground" : "text-muted-foreground"}`}>{n.title}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{n.summary}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">{n.date}</p>
                  </div>
                  {!n.read && <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <BottomTabBar />
    </div>
  );
};

export default NotificationsPage;
