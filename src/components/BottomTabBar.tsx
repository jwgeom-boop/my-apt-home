import { Home, CreditCard, QrCode, CalendarDays, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const tabs = [
  { path: "/", label: "홈", icon: Home },
  { path: "/payment", label: "납부", icon: CreditCard },
  { path: "/qr", label: "QR", icon: QrCode },
  { path: "/reservation", label: "예약", icon: CalendarDays },
  { path: "/mypage", label: "공지/마이", icon: User },
];

const BottomTabBar = () => {
  const location = useLocation();
  const navigate = useNavigate();

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
                "flex flex-col items-center justify-center gap-0.5 w-16 h-full transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive && "stroke-[2.5]")} />
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
