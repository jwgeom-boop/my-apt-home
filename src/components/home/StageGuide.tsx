import { useState, useEffect } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";

const GUIDE_CHECK_KEY = "movein_guide_checks";

interface GuideItem {
  icon: string;
  title: string;
  desc: string;
}

interface StageGuideData {
  sectionTitle: string;
  items: GuideItem[];
}

const stageGuides: Record<number, StageGuideData> = {
  1: {
    sectionTitle: "📝 계약 완료 후 준비사항",
    items: [
      { icon: "📄", title: "납부 일정 확인", desc: "납부내역 탭에서 중도금/잔금 납부 기한 확인" },
      { icon: "🏦", title: "중도금 대출 준비", desc: "제휴 은행 상담 신청 → 잔금대출 비교 탭 참고" },
      { icon: "📋", title: "서류 준비", desc: "신분증, 도장, 계약서 사본 미리 준비" },
      { icon: "📱", title: "앱 알림 설정", desc: "마이페이지 → 알림 설정에서 납부/공지 알림 ON" },
    ],
  },
  2: {
    sectionTitle: "🔍 사전점검 준비사항",
    items: [
      { icon: "📅", title: "예약 확인", desc: "예약 탭에서 날짜/시간/대기번호 확인" },
      { icon: "🎫", title: "QR 코드 준비", desc: "QR 탭에서 입장 코드 미리 확인" },
      { icon: "📝", title: "체크리스트 준비", desc: "볼펜 지참, 하자 발견 즉시 앱으로 사진 촬영 접수" },
      { icon: "👟", title: "편한 복장", desc: "내부 이동이 많으므로 편한 신발 착용 권장" },
      { icon: "⏰", title: "시간 여유", desc: "세대당 1~2시간 소요, 여유 있게 방문" },
    ],
  },
  3: {
    sectionTitle: "🚚 이사 준비 체크리스트",
    items: [
      { icon: "📦", title: "포장 준비", desc: "귀중품, 깨지기 쉬운 물건 별도 포장" },
      { icon: "📮", title: "주소 변경", desc: "정부24에서 전입신고, 각종 기관 주소 변경" },
      { icon: "🏫", title: "자녀 학교 전학", desc: "전입신고 후 가까운 학교 배정 신청" },
      { icon: "📬", title: "우편물 전달 신청", desc: "우체국에서 구주소 → 신주소 우편 전달 신청" },
      { icon: "🚗", title: "차량 주소 변경", desc: "자동차등록증 주소 변경 (전입신고 후 30일 이내)" },
      { icon: "📱", title: "이사업체 최종 확인", desc: "이사 전날 업체에 시간/주소 재확인" },
    ],
  },
  4: {
    sectionTitle: "💰 잔금납부 및 등기 안내",
    items: [
      { icon: "🏦", title: "잔금 납부", desc: "납부내역 탭에서 계좌번호 확인 후 납부" },
      { icon: "📄", title: "잔금대출 실행", desc: "은행 방문 → 대출 실행 → 잔금 납부" },
      { icon: "⚖️", title: "소유권이전등기", desc: "잔금 납부 후 60일 이내 등기 신청 (서비스 탭 참고)" },
      { icon: "🔑", title: "열쇠 수령 준비", desc: "신분증 + 입주증 지참, 입주지원센터 방문" },
      { icon: "💡", title: "관리비 예치금", desc: "입주 전 관리비 예치금 납부 확인" },
    ],
  },
  5: {
    sectionTitle: "🏠 입주 당일 가이드",
    items: [
      { icon: "🔑", title: "열쇠 수령", desc: "입주지원센터 방문 → 신분증 + 입주증 지참" },
      { icon: "🚗", title: "주차 배정 확인", desc: "배정 주차구역 확인 후 차량 이동" },
      { icon: "🔥", title: "가스 개통 신청", desc: "도시가스 앱 또는 전화 신청 (당일 가능)" },
      { icon: "💡", title: "전기·수도 명의 변경", desc: "한전 고객센터 123 / 수도사업소 연락" },
      { icon: "📦", title: "이사 완료 후 공용부 확인", desc: "엘리베이터·복도 파손 여부 확인" },
      { icon: "💰", title: "관리비 예치금 납부", desc: "미납 시 앱 납부 탭에서 확인" },
    ],
  },
};

interface StageGuideProps {
  stage: number;
}

const StageGuide = ({ stage }: StageGuideProps) => {
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

  return (
    <div className="bg-card rounded-xl shadow-sm border border-border mt-4">
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground">📋 단계별 진행 가이드</h3>
          <span className="text-xs text-muted-foreground">
            {checkedCount}/{guideData.items.length} 완료
          </span>
        </div>
        <p className="text-xs text-primary font-semibold mt-1">{guideData.sectionTitle}</p>
      </div>

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
                    className="shrink-0"
                  />
                  <span className="text-base shrink-0">{item.icon}</span>
                  <span className={`text-sm font-medium ${isChecked ? "line-through text-muted-foreground" : "text-foreground"}`}>
                    {String(idx + 1).padStart(2, "0")}. {item.title}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-xs text-muted-foreground pl-14">{item.desc}</p>
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
  );
};

export default StageGuide;
