import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

const GUIDE_CHECK_KEY = "movein_guide_checks";

interface GuideItem {
  icon: string;
  title: string;
  desc: string;
  link?: { label: string; path: string };
}

interface StageGuideData {
  sectionTitle: string;
  items: GuideItem[];
}

const stageGuides: Record<number, StageGuideData> = {
  1: {
    sectionTitle: "📝 계약 완료 후 준비 가이드",
    items: [
      { icon: "📄", title: "납부 일정 확인", desc: "납부내역 탭에서 중도금/잔금 납부 기한을 확인하세요.\n납부 기한을 놓치지 않도록 알림을 설정해두세요.", link: { label: "납부내역 바로가기", path: "/payment" } },
      { icon: "🏦", title: "중도금 대출 준비", desc: "제휴 은행 상담을 신청하세요.\n잔금대출 비교 탭에서 금리를 비교할 수 있습니다.", link: { label: "잔금대출 비교", path: "/loan" } },
      { icon: "📋", title: "서류 준비", desc: "신분증, 도장, 계약서 사본을 미리 준비하세요.\n서류가 누락되면 절차가 지연될 수 있습니다." },
      { icon: "📱", title: "앱 알림 설정", desc: "마이페이지 → 알림 설정에서 납부/공지 알림을 ON으로 설정하세요.\n중요한 일정을 놓치지 않을 수 있습니다.", link: { label: "마이페이지 바로가기", path: "/mypage" } },
    ],
  },
  2: {
    sectionTitle: "🔍 사전점검 준비 가이드",
    items: [
      { icon: "📅", title: "예약 확인", desc: "예약 탭에서 날짜/시간/대기번호를 확인하세요.\n예약 변경이 필요하면 예약 탭에서 수정 가능합니다.", link: { label: "예약 탭 바로가기", path: "/reservation" } },
      { icon: "🎫", title: "QR 코드 준비", desc: "사전점검 당일 입장 시 QR 코드가 필요합니다.\n미리 QR 탭에서 코드를 확인해두세요.", link: { label: "QR 탭 바로가기", path: "/qr" } },
      { icon: "📝", title: "체크리스트 준비", desc: "볼펜을 지참하세요.\n하자 발견 즉시 앱에서 사진 촬영 후 접수하면\n현장에서 바로 기록됩니다.", link: { label: "하자 접수하기", path: "/defect" } },
      { icon: "👟", title: "편한 복장", desc: "세대 내부 이동이 많습니다.\n편한 신발과 복장으로 방문하시기 바랍니다." },
      { icon: "⏰", title: "시간 여유", desc: "세대당 1~2시간이 소요됩니다.\n여유 있게 방문하시고 대기번호 순서를 확인하세요." },
    ],
  },
  3: {
    sectionTitle: "🚚 이사 준비 가이드",
    items: [
      { icon: "📦", title: "포장 준비", desc: "귀중품, 깨지기 쉬운 물건은 별도로 포장하세요.\n파손 방지를 위해 완충재를 충분히 사용하세요." },
      { icon: "📮", title: "주소 변경", desc: "정부24에서 전입신고를 진행하세요.\n각종 기관 주소도 함께 변경해두세요." },
      { icon: "🏫", title: "자녀 학교 전학", desc: "전입신고 후 가까운 학교에 배정 신청하세요.\n전학 서류는 기존 학교에서 미리 발급받으세요." },
      { icon: "📬", title: "우편물 전달 신청", desc: "우체국에서 구주소 → 신주소 우편 전달을 신청하세요.\n최대 6개월까지 전달 서비스 이용이 가능합니다." },
      { icon: "🚗", title: "차량 주소 변경", desc: "자동차등록증 주소를 변경하세요.\n전입신고 후 30일 이내에 처리해야 합니다." },
      { icon: "📱", title: "이사업체 최종 확인", desc: "이사 전날 업체에 시간/주소를 재확인하세요.\n당일 연락이 안 될 수 있으니 미리 확인하세요.", link: { label: "이사업체 보기", path: "/moving" } },
    ],
  },
  4: {
    sectionTitle: "💰 잔금납부 및 등기 가이드",
    items: [
      { icon: "🏦", title: "잔금 납부", desc: "납부내역 탭에서 계좌번호를 확인 후 납부하세요.\n납부 기한을 반드시 지켜주세요.", link: { label: "납부내역 바로가기", path: "/payment" } },
      { icon: "📄", title: "잔금대출 실행", desc: "은행에 방문하여 대출을 실행하세요.\n대출 실행 후 잔금을 납부합니다.", link: { label: "잔금대출 비교", path: "/loan" } },
      { icon: "⚖️", title: "소유권이전등기", desc: "잔금 납부 후 60일 이내에 등기를 신청하세요.\n서비스 탭에서 등기 대행 서비스를 확인할 수 있습니다.", link: { label: "서비스 바로가기", path: "/services" } },
      { icon: "🔑", title: "열쇠 수령 준비", desc: "신분증과 입주증을 지참하세요.\n입주지원센터를 방문하여 열쇠를 수령합니다." },
      { icon: "💡", title: "관리비 예치금", desc: "입주 전 관리비 예치금 납부를 확인하세요.\n미납 시 입주가 제한될 수 있습니다.", link: { label: "납부내역 바로가기", path: "/payment" } },
    ],
  },
  5: {
    sectionTitle: "🏠 입주 당일 가이드",
    items: [
      { icon: "🔑", title: "열쇠 수령", desc: "입주지원센터를 방문하세요.\n신분증과 입주증을 반드시 지참해야 합니다." },
      { icon: "🚗", title: "주차 배정 확인", desc: "배정된 주차구역을 확인 후 차량을 이동하세요.\n임시 주차 구역도 미리 확인해두세요." },
      { icon: "🔥", title: "가스 개통 신청", desc: "도시가스 앱 또는 전화로 신청하세요.\n당일 개통이 가능합니다." },
      { icon: "💡", title: "전기·수도 명의 변경", desc: "한전 고객센터 123번으로 전기 명의를 변경하세요.\n수도사업소에도 연락하여 명의를 변경합니다." },
      { icon: "📦", title: "이사 완료 후 공용부 확인", desc: "엘리베이터와 복도의 파손 여부를 확인하세요.\n파손이 발견되면 관리사무소에 즉시 알려주세요." },
      { icon: "💰", title: "관리비 예치금 납부", desc: "미납 시 앱 납부 탭에서 확인하세요.\n관리비 예치금이 납부되어야 관리 서비스가 시작됩니다.", link: { label: "납부내역 바로가기", path: "/payment" } },
    ],
  },
};

interface StageGuideProps {
  stage: number;
}

const StageGuide = ({ stage }: StageGuideProps) => {
  const navigate = useNavigate();
  const guideData = stageGuides[stage] || stageGuides[1];

  const [checked, setChecked] = useState<Record<string, boolean>>(() => {
    try {
      const stored = localStorage.getItem(GUIDE_CHECK_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem(GUIDE_CHECK_KEY, JSON.stringify(checked));
  }, [checked]);

  const toggleCheck = (key: string) => {
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const checkedCount = guideData.items.filter((_, i) => checked[`${stage}-${i}`]).length;
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-card rounded-xl shadow-sm border border-border mt-4">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full px-4 pt-4 pb-3 flex items-center justify-between"
      >
        <h3 className="text-sm font-bold text-foreground">{guideData.sectionTitle}</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {checkedCount}/{guideData.items.length} 완료
          </span>
          <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
        </div>
      </button>

      <div className={`grid transition-all duration-300 ease-in-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="overflow-hidden">
          <Accordion type="multiple" className="px-4 pb-2">
            {guideData.items.map((item, idx) => {
              const key = `${stage}-${idx}`;
              const isChecked = !!checked[key];

              return (
                <AccordionItem key={key} value={key} className="border-b border-border last:border-b-0">
                  <AccordionTrigger className="py-3 hover:no-underline">
                    <div className="flex items-center gap-3 text-left">
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={() => toggleCheck(key)}
                        onClick={(e) => e.stopPropagation()}
                        className="shrink-0 rounded-full h-5 w-5"
                      />
                      <span className="text-base shrink-0">{item.icon}</span>
                      <span className={`text-sm font-medium ${isChecked ? "line-through text-muted-foreground" : "text-foreground"}`}>
                        {String(idx + 1).padStart(2, "0")}. {item.title}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pl-14 space-y-2">
                      <p className="text-xs text-muted-foreground whitespace-pre-line">{item.desc}</p>
                      {item.link && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-sm text-primary border-primary rounded-lg h-8 px-3"
                          onClick={() => navigate(item.link!.path)}
                        >
                          {item.link.label}
                        </Button>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>

          <div className="px-4 pb-4">
            <div className="bg-primary/5 border border-primary/10 rounded-lg px-3 py-2">
              <p className="text-xs text-muted-foreground">💡 문의: 입주지원센터 1588-0000 (평일 09~18시)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StageGuide;
