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
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#1E3A5F] shadow-[0_-4px_12px_rgba(0,0,0,0.15)]">
      <div className="mx-auto max-w-[390px] flex items-center justify-around h-[68px] pb-safe">
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
                isActive ? "text-white" : "text-white/40"
              )}
            >
              <div className={cn(
                "relative flex items-center justify-center transition-all",
                isActive && "bg-white/20 rounded-xl px-3 py-1"
              )}>
                <Icon className={cn(
                  isActive ? "w-6 h-6 stroke-[2.5]" : "w-5 h-5"
                )} />
                {badge && badge.count > 0 && (
                  <span className={cn(
                    "absolute -top-1.5 -right-1 min-w-[16px] h-4 rounded-full flex items-center justify-center text-[10px] font-bold text-white px-1",
                    badge.color
                  )}>
                    {badge.count > 99 ? "99+" : badge.count}
                  </span>
                )}
              </div>
              <span className={cn(
                isActive ? "text-white font-bold text-[11px]" : "text-white/40 font-medium text-[10px]"
              )}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomTabBar;
