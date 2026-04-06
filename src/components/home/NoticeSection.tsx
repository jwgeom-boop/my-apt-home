import { useNavigate } from "react-router-dom";

const NoticeSection = () => {
  const navigate = useNavigate();

  const notices = [
    { id: 1, badge: "공지", badgeClass: "bg-primary/15 text-primary", title: "입주 오리엔테이션 안내", date: "2026.03.28" },
    { id: 2, badge: "안내문", badgeClass: "bg-success/15 text-success", title: "잔금 납부 및 등기 절차 안내", date: "2026.03.25" },
  ];

  return (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-base font-bold text-foreground">📢 공지사항</span>
        <button onClick={() => navigate("/notice")} className="text-sm text-primary font-medium">
          전체보기 →
        </button>
      </div>
      <div className="bg-card rounded-xl overflow-hidden shadow-sm border border-border divide-y divide-border">
        {notices.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(`/notice/${item.id}`)}
            className="w-full flex items-center justify-between py-3 px-4 text-left hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className={`text-xs font-bold px-1.5 py-0.5 rounded shrink-0 ${item.badgeClass}`}>{item.badge}</span>
              <span className="text-sm font-medium text-foreground truncate">{item.title}</span>
            </div>
            <span className="text-xs text-muted-foreground shrink-0 ml-2">{item.date}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default NoticeSection;
