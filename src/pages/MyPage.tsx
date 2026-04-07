import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, ChevronRight, Phone, MessageSquare, Loader2, Bell, BellRing, FileText, Award, HelpCircle, Settings, UserCog, LogOut } from "lucide-react";
import BottomTabBar from "@/components/BottomTabBar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const MyPage = () => {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [residentId, setResidentId] = useState<string | null>(null);
  const [unitNumber, setUnitNumber] = useState("");
  const [area, setArea] = useState("");
  const [complexName, setComplexName] = useState("");
  const [phone, setPhone] = useState("");
  const [carNumber, setCarNumber] = useState("");

  const [notifications, setNotifications] = useState({
    defectStatus: true,
    payment: true,
    moveIn: true,
    notice: false,
    event: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: resident, error: resError } = await supabase
          .from("residents")
          .select("*")
          .limit(1)
          .single();

        if (resError) throw resError;

        if (resident) {
          setResidentId(resident.id);
          setUnitNumber(resident.unit_number);
          setArea(resident.area);
          setComplexName(resident.complex_name);
          setPhone(resident.phone);
          setCarNumber(resident.car_number || "");

          const { data: notifData } = await supabase
            .from("notification_settings")
            .select("*")
            .eq("resident_id", resident.id)
            .single();

          if (notifData) {
            setNotifications({
              defectStatus: notifData.defect_status,
              payment: notifData.payment,
              moveIn: notifData.move_in,
              notice: notifData.notice,
              event: notifData.event,
            });
          }
        }
      } catch (err) {
        console.error("데이터 로드 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleNotification = async (key: keyof typeof notifications) => {
    const newValue = !notifications[key];
    setNotifications(prev => ({ ...prev, [key]: newValue }));

    const dbFieldMap: Record<string, string> = {
      defectStatus: "defect_status",
      payment: "payment",
      moveIn: "move_in",
      notice: "notice",
      event: "event",
    };

    if (residentId) {
      const { error } = await supabase
        .from("notification_settings")
        .update({ [dbFieldMap[key]]: newValue })
        .eq("resident_id", residentId);

      if (error) {
        setNotifications(prev => ({ ...prev, [key]: !newValue }));
        toast.error("알림 설정 변경에 실패했습니다.");
        return;
      }
    }
    toast.success("알림 설정이 변경되었습니다.");
  };

  const handleProfileSave = async () => {
    if (!residentId) return;
    setSaving(true);

    const { error } = await supabase
      .from("residents")
      .update({ phone, car_number: carNumber })
      .eq("id", residentId);

    setSaving(false);

    if (error) {
      toast.error("저장에 실패했습니다. 다시 시도해주세요.");
      return;
    }

    toast.success("개인정보가 수정되었습니다.");
    setShowProfile(false);
  };

  // Extract unit short label (e.g. "101동 1202호" → "1202")
  const unitShort = unitNumber.match(/(\d+)호/)?.[1] || unitNumber;

  const menuSections = [
    {
      title: "서비스",
      items: [
        { icon: FileText, label: "공지·안내문", desc: "공지·안내문·동의서 모아보기", action: () => navigate("/notice") },
        { icon: Award, label: "입주증", desc: "디지털 입주증 확인 및 저장", action: () => navigate("/certificate") },
        { icon: HelpCircle, label: "자주 묻는 질문", desc: "잔금·등기·하자 등 FAQ", action: () => navigate("/faq") },
      ],
    },
    {
      title: "알림",
      items: [
        { icon: Bell, label: "알림 내역", desc: "전체 앱 알림 기록 확인", action: () => navigate("/notifications") },
        { icon: BellRing, label: "알림 설정", desc: "푸시알림 항목별 ON/OFF", action: () => setShowNotification(true) },
      ],
    },
    {
      title: "계정",
      items: [
        { icon: UserCog, label: "개인정보 수정", desc: "연락처·차량번호 변경", action: () => setShowProfile(true) },
        { icon: Phone, label: "입주지원센터 연락", desc: "전화 / 채팅 문의", action: () => setShowContact(true) },
        { icon: LogOut, label: "로그아웃", desc: "", action: () => { localStorage.removeItem("isLoggedIn"); navigate("/login"); }, destructive: true },
      ],
    },
  ];

  if (loading) {
    return (
      <div className="mx-auto max-w-[390px] min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[390px] min-h-screen bg-background flex flex-col">
      {/* App Bar */}
      <div className="sticky top-0 z-10 bg-background border-b border-border px-4 py-3">
        <h1 className="text-base font-bold text-foreground text-center">마이페이지</h1>
      </div>

      {/* Info Card */}
      <div className="px-4 mt-4">
        <Accordion type="single" collapsible>
          <AccordionItem value="info" className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
            <AccordionTrigger className="px-4 py-3 text-sm font-bold text-foreground hover:no-underline">
              세대 정보 보기
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-3">
              <div className="grid grid-cols-2 gap-y-2 text-xs">
                <span className="text-muted-foreground">호수</span>
                <span className="text-foreground font-medium">{unitNumber}</span>
                <span className="text-muted-foreground">면적</span>
                <span className="text-foreground font-medium">{area}</span>
                <span className="text-muted-foreground">단지명</span>
                <span className="text-foreground font-medium">{complexName}</span>
                <span className="text-muted-foreground">연락처</span>
                <span className="text-foreground font-medium">{phone}</span>
                <span className="text-muted-foreground">차량번호</span>
                <span className="text-foreground font-medium">{carNumber || "미등록"}</span>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Menu Sections */}
      <div className="px-4 mt-4 flex-1">
        {menuSections.map((section) => (
          <div key={section.title} className="mb-4">
            <p className="text-[11px] font-semibold text-muted-foreground mb-1.5 px-1">{section.title}</p>
            <div className="space-y-1.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isDestructive = (item as any).destructive;
                return (
                  <button
                    key={item.label}
                    onClick={item.action}
                    className="w-full flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-3.5 hover:bg-muted/30 transition-colors text-left"
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isDestructive ? "text-destructive" : "text-primary"}`} />
                    <div className="flex-1 min-w-0">
                      <span className={`text-sm font-semibold block ${isDestructive ? "text-destructive" : "text-foreground"}`}>{item.label}</span>
                      {item.desc && <span className="text-[11px] text-muted-foreground">{item.desc}</span>}
                    </div>
                    {!isDestructive && <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* App Version */}
      <div className="text-center pb-24 pt-2">
        <p className="text-[11px] text-muted-foreground">입주ON v1.0.0</p>
      </div>

      <BottomTabBar />

      {/* 개인정보 수정 다이얼로그 */}
      <Dialog open={showProfile} onOpenChange={setShowProfile}>
        <DialogContent className="max-w-[360px] rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-base">개인정보 수정</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 pt-2">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">연락처</label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="010-0000-0000" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">등록 차량번호</label>
              <Input value={carNumber} onChange={(e) => setCarNumber(e.target.value)} placeholder="00가0000" />
            </div>
            <Button onClick={handleProfileSave} disabled={saving} className="w-full bg-primary text-primary-foreground">
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              저장하기
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 입주지원센터 연락 다이얼로그 */}
      <Dialog open={showContact} onOpenChange={setShowContact}>
        <DialogContent className="max-w-[360px] rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-base">입주지원센터 연락</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3 pt-2">
            <a href="tel:1588-0000" className="flex items-center gap-3 bg-primary/10 border border-primary/20 rounded-xl px-4 py-4 active:scale-[0.98] transition-all">
              <Phone className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-bold text-foreground">전화 문의</p>
                <p className="text-xs text-muted-foreground">1588-0000 (평일 09~18시)</p>
              </div>
            </a>
            <a href="sms:1588-0000" className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-4 active:scale-[0.98] transition-all">
              <MessageSquare className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-bold text-foreground">문자 문의</p>
                <p className="text-xs text-muted-foreground">1588-0000으로 문자 보내기</p>
              </div>
            </a>
            <p className="text-[11px] text-muted-foreground text-center mt-1">운영시간: 평일 09:00 ~ 18:00 (주말·공휴일 휴무)</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* 알림 설정 다이얼로그 */}
      <Dialog open={showNotification} onOpenChange={setShowNotification}>
        <DialogContent className="max-w-[360px] rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-base">알림 설정</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-1 pt-2">
            {[
              { key: "defectStatus" as const, label: "하자 처리 현황", desc: "접수/처리중/완료 상태 변경 시" },
              { key: "payment" as const, label: "납부 안내", desc: "납부 기한 및 완납 알림" },
              { key: "moveIn" as const, label: "입주 일정", desc: "사전점검·입주 관련 공지" },
              { key: "notice" as const, label: "공지사항", desc: "관리사무소 공지 알림" },
              { key: "event" as const, label: "이벤트·혜택", desc: "입주민 이벤트 및 할인 정보" },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-semibold text-foreground">{item.label}</p>
                  <p className="text-[11px] text-muted-foreground">{item.desc}</p>
                </div>
                <Switch checked={notifications[item.key]} onCheckedChange={() => toggleNotification(item.key)} />
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyPage;
