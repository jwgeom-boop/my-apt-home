// 하자 접수 카테고리 데이터 (대분류 > 중분류 > 소분류) + 점검 가이드

export interface SubCategory {
  name: string;
  guides: string[];
  isUrgent?: boolean; // 긴급 하자 자동 분류
}

export interface MidCategory {
  name: string;
  subs: SubCategory[];
}

export interface MainCategory {
  name: string;
  icon: string;
  mids: MidCategory[];
}

export const defectCategories: MainCategory[] = [
  {
    name: "안방",
    icon: "🛏️",
    mids: [
      {
        name: "도배",
        subs: [
          {
            name: "벽면",
            guides: ["벽지 이음선 일자 확인", "들뜸/기포/오염 체크"],
          },
          {
            name: "천장",
            guides: ["벽지 이음선 일자 확인", "들뜸/기포/오염 체크"],
          },
        ],
      },
      {
        name: "바닥",
        subs: [
          {
            name: "마루",
            guides: ["수평 확인(물건 굴리기)", "꿀렁임/소음 체크", "걸레받이 들뜸 확인"],
          },
        ],
      },
      {
        name: "문/창호",
        subs: [
          {
            name: "방문",
            guides: ["개폐 시 걸림/소음 확인", "문틀 간격 일정 여부", "손잡이 부드러움 체크"],
          },
          {
            name: "창문",
            guides: ["개폐 시 걸림/소음 확인", "잠금장치 작동 확인", "방충망 상태 확인"],
          },
        ],
      },
      {
        name: "가구",
        subs: [
          {
            name: "붙박이장",
            guides: ["문짝 수평 및 흔들림", "서랍 레일 3회 이상 작동 확인", "내부 마감 확인"],
          },
        ],
      },
    ],
  },
  {
    name: "거실",
    icon: "🛋️",
    mids: [
      {
        name: "도배",
        subs: [
          {
            name: "벽면",
            guides: ["벽지 이음선 일자 확인", "들뜸/기포/오염 체크"],
          },
          {
            name: "천장",
            guides: ["벽지 이음선 일자 확인", "들뜸/기포/오염 체크"],
          },
        ],
      },
      {
        name: "바닥",
        subs: [
          {
            name: "마루",
            guides: ["수평 확인(물건 굴리기)", "꿀렁임/소음 체크", "걸레받이 들뜸 확인"],
          },
        ],
      },
      {
        name: "문/창호",
        subs: [
          {
            name: "발코니도어",
            guides: ["개폐 시 걸림/소음 확인", "문틀 간격 일정 여부", "잠금장치 작동 확인"],
          },
        ],
      },
    ],
  },
  {
    name: "주방",
    icon: "🍳",
    mids: [
      {
        name: "가구",
        subs: [
          {
            name: "싱크대",
            guides: ["문짝 수평 및 흔들림", "서랍 레일 3회 이상 작동 확인", "내부 마감 확인"],
          },
          {
            name: "상부장",
            guides: ["문짝 수평 및 흔들림", "내부 마감 확인"],
          },
        ],
      },
      {
        name: "설비",
        subs: [
          {
            name: "수전",
            guides: ["수압 및 온수 확인", "배수 원활 여부"],
          },
          {
            name: "배수구",
            guides: ["배수 원활 여부", "누수 여부 확인"],
            isUrgent: true,
          },
        ],
      },
      {
        name: "바닥",
        subs: [
          {
            name: "타일",
            guides: ["바닥 물 고임(구배) 확인", "줄눈 벌어짐/오염 체크"],
          },
        ],
      },
    ],
  },
  {
    name: "욕실",
    icon: "🚿",
    mids: [
      {
        name: "설비",
        subs: [
          {
            name: "수전/샤워기",
            guides: ["수압 및 온수 확인", "배수 원활 여부", "누수 여부 확인"],
            isUrgent: true,
          },
          {
            name: "변기",
            guides: ["변기/세면대 흔들림 고정 확인", "배수 원활 여부"],
          },
          {
            name: "세면대",
            guides: ["변기/세면대 흔들림 고정 확인", "수압 및 온수 확인", "배수 원활 여부"],
          },
        ],
      },
      {
        name: "타일/베란다",
        subs: [
          {
            name: "바닥타일",
            guides: ["바닥 물 고임(구배) 확인", "줄눈 벌어짐/오염 체크"],
          },
          {
            name: "벽타일",
            guides: ["줄눈 벌어짐/오염 체크", "들뜸/파손 확인"],
          },
        ],
      },
      {
        name: "문/창호",
        subs: [
          {
            name: "욕실문",
            guides: ["개폐 시 걸림/소음 확인", "문틀 간격 일정 여부", "손잡이 부드러움 체크"],
          },
        ],
      },
    ],
  },
  {
    name: "베란다",
    icon: "🌿",
    mids: [
      {
        name: "타일/베란다",
        subs: [
          {
            name: "바닥타일",
            guides: ["바닥 물 고임(구배) 확인", "줄눈 벌어짐/오염 체크"],
          },
        ],
      },
      {
        name: "설비",
        subs: [
          {
            name: "배수구",
            guides: ["배수 원활 여부", "누수 여부 확인"],
            isUrgent: true,
          },
        ],
      },
      {
        name: "문/창호",
        subs: [
          {
            name: "창문",
            guides: ["개폐 시 걸림/소음 확인", "잠금장치 작동 확인", "방충망 상태 확인"],
          },
        ],
      },
    ],
  },
  {
    name: "현관",
    icon: "🚪",
    mids: [
      {
        name: "문/창호",
        subs: [
          {
            name: "현관문",
            guides: ["개폐 시 걸림/소음 확인", "잠금장치 작동 확인", "디지털 도어록 작동 확인"],
            isUrgent: true,
          },
        ],
      },
      {
        name: "바닥",
        subs: [
          {
            name: "타일",
            guides: ["바닥 물 고임(구배) 확인", "줄눈 벌어짐/오염 체크"],
          },
        ],
      },
      {
        name: "설비",
        subs: [
          {
            name: "전기/통신",
            guides: ["인터폰 작동 확인", "조명 스위치 작동 확인"],
            isUrgent: true,
          },
        ],
      },
    ],
  },
];

// 긴급 키워드 (가이드 메시지에 포함되면 자동 긴급 분류)
export const URGENT_KEYWORDS = ["누수", "단전", "잠금장치"];

export function checkUrgency(sub: SubCategory, checkedGuides: string[]): boolean {
  if (sub.isUrgent) return true;
  return checkedGuides.some((g) =>
    URGENT_KEYWORDS.some((kw) => g.includes(kw))
  );
}
