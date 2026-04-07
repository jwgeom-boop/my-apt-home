import { Home, CreditCard, ClipboardList, CalendarDays, ShoppingBag, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const tabs = [
  { path: "/", label: "홈", icon: Home },
  { path: "/payment", label: "납부", icon: CreditCard },
  { path: "/defect", label: "하자", icon: ClipboardList, badge: { count: 3, color: "bg-amber-500" } },
  { path: "/reservation", label: "예약", icon: CalendarDays },
  { path: "/services", label: "서비스", icon: ShoppingBag },
  { path: "/mypage", label: "마이", icon: User },
];

// Dummy unread notice count
const UNREAD_NOTICE_COUNT = 2;

const BottomTabBar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const getBadge = (path: string) => {
    if (path === "/defect") return { count: 3, color: "bg-amber-500" };
    return null;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border">
      <div className="mx-auto max-w-[390px] flex items-center justify-around h-16 pb-safe">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          const Icon = tab.icon;
          const badge = getBadge(tab.path);
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
                {badge && badge.count > 0 && (
                  <span className={cn(
                    "absolute -top-1.5 -right-2.5 min-w-[16px] h-4 rounded-full flex items-center justify-center text-[10px] font-bold text-white px-1",
                    badge.color
                  )}>
                    {badge.count > 99 ? "99+" : badge.count}
                  </span>
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
