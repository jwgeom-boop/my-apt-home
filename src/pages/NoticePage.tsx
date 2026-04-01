import { useState } from "react";
import MobileLayout from "@/components/MobileLayout";
import { cn } from "@/lib/utils";

type NoticeType = "전체" | "안내문" | "공지" | "동의서";

const filters: NoticeType[] = ["전체", "안내문", "공지", "동의서"];

const notices = [
  { type: "안내문" as const, title: "잔금 납부 기한 안내", desc: "2026.04.07까지 납부 계좌로...", date: "오늘 09:10", unread: true },
  { type: "공지" as const, title: "사전점검 일정 안내", desc: "4월 1일~5일, 09:00~17:00", date: "03.30", unread: false },
  { type: "동의서" as const, title: "층간소음 동의서 서명 요청", desc: "서명 미완료 — 앱에서 바로 서명", date: "03.28", unread: true },
  { type: "안내문" as const, title: "이사 차량 사전 등록 안내", desc: "이사 1주일 전까지 차량번호...", date: "03.25", unread: false },
  { type: "공지" as const, title: "입주지원센터 운영시간", desc: "평일 09:00~17:00, 주말 휴무", date: "03.20", unread: false },
];

const typeColors: Record<string, string> = {
  안내문: "bg-primary text-primary-foreground",
  공지: "bg-accent text-accent-foreground",
  동의서: "bg-warning text-warning-foreground",
};

const NoticePage = () => {
  const [active, setActive] = useState<NoticeType>("전체");
  const filtered = active === "전체" ? notices : notices.filter((n) => n.type === active);

  return (
    <MobileLayout title="공지·안내문">
      <div className="flex gap-2 mb-4">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActive(f)}
            className={cn(
              "px-4 py-1.5 rounded-full text-xs font-medium transition-colors",
              active === f ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((n, i) => (
          <div
            key={i}
            className={cn(
              "bg-card rounded-xl p-4 border shadow-sm relative",
              n.type === "동의서" && n.unread ? "border-warning" : "border-border"
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={cn("text-[10px] px-2 py-0.5 rounded font-semibold", typeColors[n.type])}>
                {n.type}
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-muted-foreground">{n.date}</span>
                {n.unread && <span className="w-2 h-2 rounded-full bg-destructive" />}
              </div>
            </div>
            <h4 className="text-sm font-semibold text-foreground">{n.title}</h4>
            <p className="text-xs text-muted-foreground mt-1">{n.desc}</p>
          </div>
        ))}
      </div>
    </MobileLayout>
  );
};

export default NoticePage;
