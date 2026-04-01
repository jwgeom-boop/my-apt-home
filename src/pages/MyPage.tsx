import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, ChevronRight, Phone, MessageSquare, Loader2 } from "lucide-react";
import BottomTabBar from "@/components/BottomTabBar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const MyPage = () => {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // DB에서 가져올 데이터
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

  // DB에서 데이터 로드
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 첫 번째 입주자 데이터 가져오기 (데모용)
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

          // 알림 설정 가져오기
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

  // 알림 토글 → DB 업데이트
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
        // 롤백
        setNotifications(prev => ({ ...prev, [key]: !newValue }));
        toast.error("알림 설정 변경에 실패했습니다.");
        return;
      }
    }
    toast.success("알림 설정이 변경되었습니다.");
  };

  // 개인정보 저장 → DB 업데이트
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

  const menuItems = [
    { color: "bg-primary", label: "내 입주 현황", desc: "진행률·체크리스트 상세", action: () => navigate("/") },
    { color: "bg-green-500", label: "납부내역 조회", desc: "전체 납부 이력", action: () => navigate("/payment") },
    { color: "bg-navy", label: "하자 접수 이력", desc: "접수한 하자 목록·처리현황", action: () => navigate("/defect") },
    { color: "bg-amber-500", label: "알림 설정", desc: "푸시알림 항목별 ON/OFF", action: () => setShowNotification(true) },
    { color: "bg-muted-foreground", label: "개인정보 수정", desc: "연락처·차량번호 변경", action: () => setShowProfile(true) },
    { color: "bg-purple-500", label: "입주지원센터 연락", desc: "전화 / 채팅 문의", action: () => setShowContact(true) },
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
      {/* Profile Header */}
      <div className="bg-navy text-white px-6 pt-14 pb-10 flex flex-col items-center">
        <div className="w-20 h-20 rounded-full border-[3px] border-primary bg-white/10 flex items-center justify-center mb-3">
          <User className="w-10 h-10 text-white" />
        </div>
      </div>

      {/* Info Card */}
      <div className="px-4 -mt-6">
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <h2 className="text-sm font-bold text-foreground mb-1">세대 정보</h2>
          <p className="text-xs text-foreground">
            {unitNumber} · {area} · {complexName}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            연락처: {phone} · 등록차량: {carNumber}
          </p>
        </div>
      </div>

      {/* Menu List */}
      <div className="px-4 mt-4 flex-1">
        <div className="space-y-2">
          {menuItems.map((item, i) => (
            <button
              key={i}
              onClick={item.action}
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
        <button
          className="text-sm text-destructive font-medium"
          onClick={() => {
            localStorage.removeItem("isLoggedIn");
            navigate("/login");
          }}
        >
          로그아웃
        </button>
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
            <a
              href="tel:1588-0000"
              className="flex items-center gap-3 bg-primary/10 border border-primary/20 rounded-xl px-4 py-4 active:scale-[0.98] transition-all"
            >
              <Phone className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-bold text-foreground">전화 문의</p>
                <p className="text-xs text-muted-foreground">1588-0000 (평일 09~18시)</p>
              </div>
            </a>
            <a
              href="sms:1588-0000"
              className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-4 active:scale-[0.98] transition-all"
            >
              <MessageSquare className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-bold text-foreground">문자 문의</p>
                <p className="text-xs text-muted-foreground">1588-0000으로 문자 보내기</p>
              </div>
            </a>
            <p className="text-[11px] text-muted-foreground text-center mt-1">
              운영시간: 평일 09:00 ~ 18:00 (주말·공휴일 휴무)
            </p>
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
              <div
                key={item.key}
                className="flex items-center justify-between py-3 border-b border-border last:border-0"
              >
                <div>
                  <p className="text-sm font-semibold text-foreground">{item.label}</p>
                  <p className="text-[11px] text-muted-foreground">{item.desc}</p>
                </div>
                <Switch
                  checked={notifications[item.key]}
                  onCheckedChange={() => toggleNotification(item.key)}
                />
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyPage;
