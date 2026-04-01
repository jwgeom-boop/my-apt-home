import { useNavigate } from "react-router-dom";
import { User, ChevronRight } from "lucide-react";
import BottomTabBar from "@/components/BottomTabBar";

const menuItems = [
  { color: "bg-primary", label: "내 입주 현황", desc: "진행률·체크리스트 상세", path: "/" },
  { color: "bg-green-500", label: "납부내역 조회", desc: "전체 납부 이력", path: "/payment" },
  { color: "bg-navy", label: "하자 접수 이력", desc: "접수한 하자 목록·처리현황", path: "/defect" },
  { color: "bg-amber-500", label: "알림 설정", desc: "푸시알림 항목별 ON/OFF", path: "#" },
  { color: "bg-muted-foreground", label: "개인정보 수정", desc: "연락처·차량번호 변경", path: "#" },
  { color: "bg-purple-500", label: "입주지원센터 연락", desc: "전화 / 채팅 문의", path: "#" },
];

const MyPage = () => {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-[390px] min-h-screen bg-background flex flex-col">
      {/* Profile Header */}
      <div className="bg-navy text-white px-6 pt-14 pb-10 flex flex-col items-center">
        <div className="w-20 h-20 rounded-full border-[3px] border-primary bg-white/10 flex items-center justify-center mb-3">
          <User className="w-10 h-10 text-white" />
        </div>
      </div>

      {/* Info Card - overlapping header */}
      <div className="px-4 -mt-6">
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <h2 className="text-sm font-bold text-foreground mb-1">세대 정보</h2>
          <p className="text-xs text-foreground">
            101동 0102호 · 59㎡ · oo아파트 101현장
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            연락처: 010-9876-5432 · 등록차량: 34나5678
          </p>
        </div>
      </div>

      {/* Menu List */}
      <div className="px-4 mt-4 flex-1">
        <div className="space-y-2">
          {menuItems.map((item, i) => (
            <button
              key={i}
              onClick={() => item.path !== "#" && navigate(item.path)}
              className="w-full flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-3.5 hover:bg-muted/30 transition-colors text-left"
            >
              <div className={`w-3 h-3 rounded-full ${item.color} shrink-0`} />
              <div className="flex-1 min-w-0">
                <span className="text-sm font-semibold text-foreground block">{item.label}</span>
                <span className="text-[11px] text-muted-foreground">{item.desc}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* Logout */}
      <div className="px-4 py-4 pb-24 text-center">
        <button className="text-sm text-destructive font-medium">로그아웃</button>
      </div>

      <BottomTabBar />
    </div>
  );
};

export default MyPage;
