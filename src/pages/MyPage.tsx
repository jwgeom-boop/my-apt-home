import { useNavigate } from "react-router-dom";
import { User, FileText, Shield, Phone, Bell, HelpCircle, LogOut, ChevronRight } from "lucide-react";

const menuItems = [
  { icon: FileText, label: "입주증 보기", path: "/certificate" },
  { icon: Shield, label: "동의서 서명", path: "/consent" },
  { icon: FileText, label: "하자접수 내역", path: "/defect" },
  { icon: Phone, label: "관리사무소 연락처", path: "#" },
  { icon: Bell, label: "알림 설정", path: "#" },
  { icon: HelpCircle, label: "자주 묻는 질문", path: "#" },
];

const MyPage = () => {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-[390px] min-h-screen bg-background flex flex-col">
      {/* Profile Header */}
      <div className="bg-navy text-white px-6 pt-14 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold">홍길동</h1>
            <p className="text-sm text-white/70">101동 0102호</p>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="px-4 -mt-3">
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <div className="grid grid-cols-3 text-center divide-x divide-border">
            <div>
              <p className="text-xs text-muted-foreground">입주상태</p>
              <p className="text-sm font-bold text-primary mt-1">진행중</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">진행률</p>
              <p className="text-sm font-bold text-foreground mt-1">60%</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">동의서</p>
              <p className="text-sm font-bold text-foreground mt-1">2/4</p>
            </div>
          </div>
        </div>
      </div>

      {/* Menu List */}
      <div className="px-4 mt-4 flex-1">
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          {menuItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <button
                key={i}
                onClick={() => item.path !== "#" && navigate(item.path)}
                className="w-full flex items-center gap-3 px-4 py-3.5 border-b border-border last:border-0 hover:bg-muted/30 transition-colors text-left"
              >
                <Icon className="w-5 h-5 text-muted-foreground" />
                <span className="flex-1 text-sm font-medium text-foreground">{item.label}</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Logout */}
      <div className="px-4 py-6">
        <button className="w-full flex items-center justify-center gap-2 h-12 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition-colors">
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">로그아웃</span>
        </button>
      </div>
    </div>
  );
};

export default MyPage;
