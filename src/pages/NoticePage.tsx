import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "@/components/MobileLayout";
import { cn } from "@/lib/utils";
import { notices } from "@/data/notices";

type NoticeType = "전체" | "안내문" | "공지" | "동의서";

const filters: NoticeType[] = ["전체", "안내문", "공지", "동의서"];

const badgeColors: Record<string, string> = {
  안내문: "bg-destructive/15 text-destructive border-destructive/30",
  공지: "bg-primary/15 text-primary border-primary/30",
  동의서: "bg-amber-100 text-amber-700 border-amber-300",
};

const cardBorder: Record<string, string> = {
  안내문: "border-destructive/30",
  공지: "border-border",
  동의서: "border-amber-300",
};

const NoticePage = () => {
  const [active, setActive] = useState<NoticeType>("전체");
  const navigate = useNavigate();
  const filtered = active === "전체" ? notices : notices.filter((n) => n.type === active);

  const handleCardClick = (notice: typeof notices[0]) => {
    if (notice.type === "동의서") {
      navigate("/consent");
    } else {
      navigate(`/notice/${notice.id}`);
    }
  };

  return (
    <MobileLayout title="공지·안내문">
      {/* Filter Tabs */}
      <div className="flex gap-2 mb-4">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActive(f)}
            className={cn(
              "px-4 py-2 rounded-full text-xs font-medium transition-colors border",
              active === f
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-foreground border-border"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Notice Cards */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <span className="text-2xl">📭</span>
            </div>
            <p className="text-sm font-semibold text-foreground mb-1">공지사항이 없습니다</p>
            <p className="text-xs text-muted-foreground">해당 카테고리의 공지가 없어요</p>
          </div>
        ) : (
          filtered.map((n) => (
            <button
              key={n.id}
              onClick={() => handleCardClick(n)}
              className={cn(
                "w-full text-left bg-card rounded-xl p-4 border shadow-sm relative",
                cardBorder[n.type]
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={cn("text-[10px] px-2 py-0.5 rounded border font-semibold", badgeColors[n.type])}>
                  {n.type}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-muted-foreground">{n.date}</span>
                  {n.unread && <span className="w-2.5 h-2.5 rounded-full bg-destructive" />}
                </div>
              </div>
              <h4 className="text-sm font-semibold text-foreground">{n.title}</h4>
              <p className="text-xs text-muted-foreground mt-1">{n.desc}</p>
            </button>
          ))
        )}
      </div>
    </MobileLayout>
  );
};

export default NoticePage;
