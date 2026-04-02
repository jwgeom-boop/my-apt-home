import { Home, CreditCard, QrCode, CalendarDays, Bell, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const tabs = [
  { path: "/", label: "홈", icon: Home },
  { path: "/payment", label: "납부", icon: CreditCard },
  { path: "/qr", label: "QR", icon: QrCode },
  { path: "/reservation", label: "예약", icon: CalendarDays },
  { path: "/notice", label: "공지", icon: Bell },
  { path: "/mypage", label: "마이", icon: User },
];

const BottomTabBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const unreadCount = 2;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border">
      <div className="mx-auto max-w-[390px] flex items-center justify-around h-16 pb-safe">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          const Icon = tab.icon;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 w-14 h-full transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <div className="relative">
                <Icon className={cn("w-5 h-5", isActive && "stroke-[2.5]")} />
                {tab.path === "/notice" && unreadCount > 0 && (
                  <div className="absolute top-0 right-0 w-4 h-4 rounded-full bg-destructive text-white text-[9px] font-bold flex items-center justify-center -translate-y-1/2 translate-x-1/2">
                    {unreadCount}
                  </div>
                )}
              </div>
              <span className={cn("text-[10px]", isActive ? "font-semibold" : "font-medium")}>
                {tab.label}
              </span>
              {isActive && (
                <div className="absolute top-0 w-10 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomTabBar;
