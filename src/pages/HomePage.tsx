import { useState, useEffect } from "react";
import { CheckCircle2, Circle, QrCode, CreditCard, AlertTriangle, ChevronRight, ClipboardList, ListChecks, Loader2, X, WifiOff, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "@/components/MobileLayout";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useOfflineDrafts } from "@/hooks/useOfflineDrafts";

const noticeItems = [
  { tag: "중요", tagColor: "bg-destructive/15 text-destructive", title: "사전점검 기간 지하주차장 이용 안내", unread: true },
  { tag: "안내", tagColor: "bg-primary/15 text-primary", title: "입주증 발급 및 열람 가능 시간 변경 공지", unread: true },
  { tag: "행사", tagColor: "bg-amber-100 text-amber-700", title: "입주민 환영 카페테리아 운영 안내", unread: false },
];

interface DefectRow {
  receipt_no: string;
  location: string;
  mid_category: string | null;
  status: string;
  is_urgent: boolean;
}

const statusColorMap: Record<string, string> = {
  "미배정": "text-muted-foreground",
  "접수완료": "text-primary",
  "배정완료": "text-primary",
  "처리중": "text-warning",
  "처리완료": "text-success",
  "완료": "text-success",
};

const getChecklistItems = () => [
  { id: 1, label: "잔금 납부", done: true, path: "/payment" },
  { id: 2, label: "사전점검 예약", done: true, path: "/reservation" },
  { id: 3, label: "QR 입장코드 발급", done: true, path: "/qr" },
  { id: 4, label: "이사 예약", done: localStorage.getItem("moveInReserved") === "true", path: "/reservation" },
  { id: 5, label: "동의서 서명", done: localStorage.getItem("consentSigned") === "true", path: "/consent" },
];

const HomePage = () => {
  const navigate = useNavigate();
  const { drafts, syncAll, syncing } = useOfflineDrafts();
  const checklistItems = getChecklistItems();
  const completedCount = checklistItems.filter((i) => i.done).length;
  const progressPercent = Math.round((completedCount / checklistItems.length) * 100);

  const [defects, setDefects] = useState<DefectRow[]>([]);
  const [loadingDefects, setLoadingDefects] = useState(true);
  const [showDefectList, setShowDefectList] = useState(false);
  const [showChecklist, setShowChecklist] = useState(false);
  const [showMoveInGuide, setShowMoveInGuide] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data: resident } = await supabase
        .from("residents")
        .select("id")
        .limit(1)
        .single();

      if (resident) {
        const { data } = await supabase
          .from("defects")
          .select("receipt_no, location, mid_category, status, is_urgent")
          .eq("resident_id", resident.id)
          .order("created_at", { ascending: false })
          .limit(10);

        if (data) setDefects(data);
      }
      setLoadingDefects(false);
    };
    load();
  }, []);

  const statusCounts = {
    접수완료: defects.filter((d) => ["미배정", "접수완료", "배정완료"].includes(d.status)).length,
    처리중: defects.filter((d) => d.status === "처리중").length,
    완료: defects.filter((d) => ["처리완료", "완료"].includes(d.status)).length,
  };

  return (
    <MobileLayout>
      {/* Greeting */}
      <div className="bg-accent text-accent-foreground rounded-xl p-4 mb-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium opacity-80">101동 1202호</p>
              <span className="text-[10px] bg-primary/20 text-primary-foreground px-2 py-0.5 rounded-full font-medium">
                입주 예정
              </span>
            </div>
            <h2 className="text-lg font-bold mt-1">홍길동님, 환영합니다!</h2>
          </div>
        </div>
      </div>

      {/* Offline drafts sync banner */}
      {drafts.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4 text-amber-600" />
            <div>
              <p className="text-xs font-bold text-amber-800">📱 임시 저장: {drafts.length}건</p>
              <p className="text-[10px] text-amber-600">전송 대기 중인 하자 접수가 있습니다</p>
            </div>
          </div>
          <button
            onClick={syncAll}
            disabled={syncing}
            className="flex items-center gap-1 bg-amber-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg active:scale-95 disabled:opacity-50"
          >
            <Upload className="w-3 h-3" />
            {syncing ? "전송 중..." : "일괄 전송"}
          </button>
        </div>
      )}

      {/* 📢 공지사항 배너 */}
      <div className="mb-3">
        <button
          onClick={() => navigate("/notice")}
          className="w-full flex items-center justify-between mb-2"
        >
          <div className="flex items-center gap-1.5">
            <Megaphone className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">공지사항</span>
            {noticeItems.some(n => n.unread) && (
              <span className="w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">
                N
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <span className="text-xs">더보기</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </button>
        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
          {noticeItems.map((n, i) => (
            <button
              key={i}
              onClick={() => navigate("/notice")}
              className="min-w-[240px] bg-card rounded-xl p-3 border border-border shadow-sm text-left shrink-0 active:scale-[0.98] transition-transform relative"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className={cn("text-[10px] px-2 py-0.5 rounded font-bold", n.tagColor)}>
                  {n.tag}
                </span>
                {n.unread && <span className="w-2 h-2 rounded-full bg-destructive" />}
              </div>
              <p className="text-sm font-semibold text-foreground truncate">{n.title}</p>
            </button>
          ))}
        </div>
      </div>

      {/* 하자 현황 통합 카드 */}
      <div className="bg-card rounded-xl p-4 mb-3 shadow-sm border border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-warning" />
            <h3 className="text-sm font-semibold text-foreground">하자 현황</h3>
          </div>
          <button
            onClick={() => navigate("/defect")}
            className="flex items-center gap-1 bg-destructive/10 text-destructive text-xs font-bold px-3 py-1.5 rounded-lg active:scale-95 transition-transform"
          >
            <ClipboardList className="w-3 h-3" />
            접수하기
          </button>
        </div>

        {loadingDefects ? (
          <div className="flex justify-center py-4">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-primary/10 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-primary">{statusCounts.접수완료}</p>
              <p className="text-[11px] text-muted-foreground mt-1">접수완료</p>
            </div>
            <div className="bg-warning/10 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-warning">{statusCounts.처리중}</p>
              <p className="text-[11px] text-muted-foreground mt-1">처리중</p>
            </div>
            <div className="bg-success/10 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-success">{statusCounts.완료}</p>
              <p className="text-[11px] text-muted-foreground mt-1">완료</p>
            </div>
          </div>
        )}

        <button
          onClick={() => setShowDefectList(true)}
          className="w-full flex items-center justify-center gap-1 mt-3 pt-3 border-t border-border text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ListChecks className="w-3.5 h-3.5" />
          나의 접수 내역 보기
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* Progress - 클릭하면 체크리스트 표시 */}
      <button
        onClick={() => setShowChecklist(true)}
        className="w-full bg-card rounded-xl p-4 mb-3 shadow-sm border border-border text-left active:scale-[0.99] transition-transform"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground">입주 진행률</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-primary">{progressPercent}%</span>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
        <Progress value={progressPercent} className="h-3" />
        <p className="text-xs text-muted-foreground mt-2">
          {completedCount}/{checklistItems.length}개 항목 완료
        </p>
      </button>

      {/* Quick Buttons */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => navigate("/loan")}
          className="flex items-center gap-3 bg-card rounded-xl p-4 shadow-sm border border-amber-300/40 active:scale-[0.98] transition-transform"
        >
          <div className="w-10 h-10 rounded-lg bg-amber-500/15 flex items-center justify-center">
            <span className="text-lg">🏦</span>
          </div>
          <div className="text-left">
            <span className="text-sm font-semibold text-foreground block">잔금대출</span>
            <span className="text-[10px] text-muted-foreground">금리 비교</span>
          </div>
        </button>
        <button
          onClick={() => navigate("/registry")}
          className="flex items-center gap-3 bg-card rounded-xl p-4 shadow-sm border border-amber-300/40 active:scale-[0.98] transition-transform"
        >
          <div className="w-10 h-10 rounded-lg bg-amber-500/15 flex items-center justify-center">
            <span className="text-lg">⚖️</span>
          </div>
          <div className="text-left">
            <span className="text-sm font-semibold text-foreground block">스마트등기</span>
            <span className="text-[10px] text-muted-foreground">등기 대행</span>
          </div>
        </button>
      </div>

      {/* 입주 당일 가이드 */}
      <button
        onClick={() => setShowMoveInGuide(true)}
        className="w-full bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-4 text-left active:scale-[0.99] transition-transform mt-3"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
            <span className="text-lg">🏠</span>
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">입주 당일 가이드</p>
            <p className="text-[10px] text-muted-foreground">준비할 것들을 확인하세요</p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto" />
        </div>
      </button>
      {/* 나의 접수 현황 슬라이드 패널 */}
      {showDefectList && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowDefectList(false)} />
          <div className="relative w-full max-w-[390px] bg-background rounded-t-2xl shadow-xl animate-slide-up max-h-[75vh] flex flex-col">
            {/* 핸들바 */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
            </div>
            {/* 헤더 */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-border">
              <h3 className="text-base font-bold text-foreground">나의 하자 접수 내역</h3>
              <button onClick={() => setShowDefectList(false)}>
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            {/* 내역 리스트 */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {loadingDefects ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                </div>
              ) : defects.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">접수된 하자가 없습니다</p>
              ) : (
                <div className="space-y-3">
                  {defects.map((d) => (
                    <div key={d.receipt_no} className="flex items-center justify-between bg-muted/30 rounded-xl px-4 py-3 border border-border">
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-foreground">{d.receipt_no}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{d.mid_category || ""} · {d.location}</p>
                      </div>
                      <span className={cn("text-sm font-bold shrink-0", statusColorMap[d.status] || "text-muted-foreground")}>
                        {d.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* 하단 버튼 */}
            <div className="px-5 py-4 border-t border-border">
              <button
                onClick={() => { setShowDefectList(false); navigate("/defect"); }}
                className="w-full bg-primary text-primary-foreground rounded-xl py-3 text-sm font-bold active:scale-[0.98] transition-transform"
              >
                새 하자 접수하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 입주 체크리스트 슬라이드 패널 */}
      {showChecklist && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowChecklist(false)} />
          <div className="relative w-full max-w-[390px] bg-background rounded-t-2xl shadow-xl animate-slide-up max-h-[75vh] flex flex-col">
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
            </div>
            <div className="flex items-center justify-between px-5 py-3 border-b border-border">
              <h3 className="text-base font-bold text-foreground">입주 체크리스트</h3>
              <button onClick={() => setShowChecklist(false)}>
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 pt-4 pb-24">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-muted-foreground">{completedCount}/{checklistItems.length}개 완료</span>
                <span className="text-lg font-bold text-primary">{progressPercent}%</span>
              </div>
              <Progress value={progressPercent} className="h-3 mb-5" />
              <ul className="space-y-3">
                {checklistItems.map((item) => (
                  <li key={item.id} className="flex items-center gap-3 bg-muted/30 rounded-xl px-4 py-3 border border-border">
                    {item.done ? (
                      <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    )}
                    <span className={cn("text-sm flex-1", item.done ? "text-foreground" : "text-muted-foreground")}>
                      {item.label}
                    </span>
                    {item.done ? (
                      <span className="text-xs font-bold text-success">완료</span>
                    ) : (
                      <button
                        onClick={() => {
                          setShowChecklist(false);
                          navigate(item.path);
                        }}
                        className="text-xs font-bold text-primary border border-primary/40 bg-primary/10 px-2.5 py-1 rounded-lg active:scale-95 transition-transform"
                      >
                        바로가기 →
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 입주 당일 가이드 슬라이드 패널 */}
      {showMoveInGuide && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowMoveInGuide(false)} />
          <div className="relative w-full max-w-[390px] bg-background rounded-t-2xl shadow-xl animate-slide-up max-h-[85vh] flex flex-col">
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
            </div>
            <div className="flex items-center justify-between px-5 py-3 border-b border-border">
              <h3 className="text-base font-bold text-foreground">🏠 입주 당일 가이드</h3>
              <button onClick={() => setShowMoveInGuide(false)}>
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <div className="space-y-3">
                {[
                  { step: "01", icon: "🔑", title: "열쇠 수령", desc: "입주지원센터 방문 → 신분증 + 입주증 지참" },
                  { step: "02", icon: "🚗", title: "주차 배정 확인", desc: "배정 주차구역 확인 후 차량 이동" },
                  { step: "03", icon: "🔥", title: "가스 개통 신청", desc: "도시가스 앱 또는 전화 신청 (당일 가능)" },
                  { step: "04", icon: "💡", title: "전기·수도 명의 변경", desc: "한전 고객센터 123 / 수도사업소 연락" },
                  { step: "05", icon: "📦", title: "이사 완료 후 공용부 확인", desc: "엘리베이터·복도 파손 여부 확인" },
                  { step: "06", icon: "💰", title: "관리비 예치금 납부", desc: "미납 시 앱 납부 탭에서 확인" },
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-3 bg-muted/30 rounded-xl px-4 py-3 border border-border">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-base">{item.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-foreground">{item.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                    </div>
                    <span className="text-[10px] text-muted-foreground font-medium shrink-0">{item.step}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 bg-primary/5 border border-primary/10 rounded-lg px-3 py-2">
                <p className="text-xs text-muted-foreground">💡 문의: 입주지원센터 1588-0000 (평일 09~18시)</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </MobileLayout>
  );
};

export default HomePage;
