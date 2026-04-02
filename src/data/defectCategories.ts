// 하자 접수 카테고리 데이터 (대분류 > 중분류 > 소분류) + 점검 가이드

export interface SubCategory {
  name: string;
  guides: string[];
  isUrgent?: boolean;
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

// ── 공통 중분류 블록 ──

const MID_도배 = (): MidCategory => ({
  name: "도배",
  subs: [
    { name: "들뜸", guides: ["벽지 이음선 일자 확인", "들뜸/기포/오염 체크"] },
    { name: "오염", guides: ["벽지 오염/얼룩 확인"] },
    { name: "파손", guides: ["벽지 찢김/긁힘 확인"] },
    { name: "이음선", guides: ["벽지 이음선 벌어짐 확인"] },
    { name: "곰팡이", guides: ["곰팡이/결로 흔적 확인"], isUrgent: true },
    { name: "기타", guides: ["기타 하자 사항 직접 기재"] },
  ],
});

const MID_바닥_마루 = (): MidCategory => ({
  name: "바닥",
  subs: [
    { name: "마루 들뜸", guides: ["수평 확인(물건 굴리기)", "꿀렁임/소음 체크"] },
    { name: "마루 파손", guides: ["마루 긁힘/깨짐 확인"] },
    { name: "걸레받이", guides: ["걸레받이 들뜸 확인", "걸레받이 이음새 벌어짐 체크"] },
    { name: "수평상태", guides: ["바닥 수평 확인(물건 굴리기)"] },
    { name: "오염", guides: ["시멘트/페인트 오염 확인"] },
    { name: "기타", guides: ["기타 하자 사항 직접 기재"] },
  ],
});

const MID_문창호_방 = (): MidCategory => ({
  name: "문/창호",
  subs: [
    { name: "방문", guides: ["개폐 시 걸림/소음 확인", "문틀 간격 일정 여부", "손잡이 부드러움 체크"] },
    { name: "창문", guides: ["개폐 시 걸림/소음 확인", "잠금장치 작동 확인", "방충망 상태 확인"] },
    { name: "문틀", guides: ["문틀 스크래치/파손 확인", "문틀 코킹 상태 확인"] },
    { name: "기타", guides: ["기타 하자 사항 직접 기재"] },
  ],
});

const MID_가구 = (): MidCategory => ({
  name: "가구",
  subs: [
    { name: "붙박이장", guides: ["문짝 수평 및 흔들림", "서랍 레일 3회 이상 작동 확인", "내부 마감 확인"] },
    { name: "자재불량", guides: ["자재 색상/질감 불량 확인"] },
    { name: "파손", guides: ["문짝/선반 파손 확인"] },
    { name: "오염", guides: ["내부/외부 오염 여부 확인"] },
    { name: "기타", guides: ["기타 하자 사항 직접 기재"] },
  ],
});

const MID_천장 = (): MidCategory => ({
  name: "천장",
  subs: [
    { name: "오염", guides: ["천장 오염 여부 확인"] },
    { name: "들뜸", guides: ["천장 벽지 들뜸/기포 체크"] },
    { name: "자재불량", guides: ["자재 색상/질감 불량 확인"] },
    { name: "기타", guides: ["기타 하자 사항 직접 기재"] },
  ],
});

const MID_전기 = (): MidCategory => ({
  name: "전기",
  subs: [
    { name: "조명", guides: ["조명 스위치 작동 확인", "조명 밝기/점멸 체크"] },
    { name: "콘센트", guides: ["콘센트 통전 확인", "콘센트 위치/수량 확인"] },
    { name: "스위치", guides: ["스위치 작동 여부 확인", "스위치 흔들림 체크"] },
    { name: "기타", guides: ["기타 하자 사항 직접 기재"] },
  ],
});

const MID_욕실설비 = (): MidCategory => ({
  name: "설비",
  subs: [
    { name: "수전/샤워기", guides: ["수압 및 온수 확인", "배수 원활 여부", "누수 여부 확인"], isUrgent: true },
    { name: "변기", guides: ["변기 흔들림 고정 확인", "배수 원활 여부", "물 내림 작동 확인"] },
    { name: "세면대", guides: ["세면대 흔들림 고정 확인", "수압 및 온수 확인", "배수 원활 여부"] },
    { name: "배수구", guides: ["배수 원활 여부", "누수 여부 확인", "트랩 설치 확인"], isUrgent: true },
    { name: "욕조", guides: ["욕조 배수 확인", "코킹 상태 확인", "표면 스크래치 확인"] },
    { name: "기타", guides: ["기타 하자 사항 직접 기재"] },
  ],
});

const MID_욕실바닥 = (): MidCategory => ({
  name: "바닥",
  subs: [
    { name: "타일 들뜸", guides: ["타일 들뜸 두드려 확인", "보행 시 흔들림 체크"] },
    { name: "타일 파손", guides: ["타일 깨짐/크랙 육안 확인"] },
    { name: "줄눈", guides: ["줄눈 벌어짐/오염 체크", "줄눈 높이 균일 여부"] },
    { name: "구배", guides: ["바닥 물 고임(구배) 확인", "배수 방향 확인"] },
    { name: "오염", guides: ["시멘트/페인트 오염 확인"] },
    { name: "기타", guides: ["기타 하자 사항 직접 기재"] },
  ],
});

const MID_욕실벽 = (): MidCategory => ({
  name: "벽",
  subs: [
    { name: "타일 들뜸", guides: ["벽 타일 들뜸 두드려 확인"] },
    { name: "타일 파손", guides: ["벽 타일 깨짐/크랙 확인"] },
    { name: "줄눈", guides: ["줄눈 벌어짐/오염 체크"] },
    { name: "코킹", guides: ["욕조/세면대 주변 코킹 상태 확인"] },
    { name: "기타", guides: ["기타 하자 사항 직접 기재"] },
  ],
});

const MID_욕실문 = (): MidCategory => ({
  name: "문/창호",
  subs: [
    { name: "욕실문", guides: ["개폐 시 걸림/소음 확인", "문틀 간격 일정 여부", "손잡이 부드러움 체크"] },
    { name: "환풍기", guides: ["환풍기 작동 확인", "소음 정도 체크"] },
    { name: "기타", guides: ["기타 하자 사항 직접 기재"] },
  ],
});

const MID_욕실천장 = (): MidCategory => ({
  name: "천장",
  subs: [
    { name: "오염", guides: ["천장 오염 여부 확인"] },
    { name: "들뜸", guides: ["천장 마감 들뜸 체크"] },
    { name: "기타", guides: ["기타 하자 사항 직접 기재"] },
  ],
});

const MID_욕실전기 = (): MidCategory => ({
  name: "전기",
  subs: [
    { name: "조명", guides: ["조명 스위치 작동 확인", "방수등 상태 확인"] },
    { name: "콘센트", guides: ["콘센트 방수 커버 확인", "통전 확인"] },
    { name: "기타", guides: ["기타 하자 사항 직접 기재"] },
  ],
});

const MID_베란다바닥 = (): MidCategory => ({
  name: "바닥",
  subs: [
    { name: "타일 들뜸", guides: ["타일 들뜸 두드려 확인", "보행 시 흔들림 체크"] },
    { name: "타일 파손", guides: ["타일 깨짐/크랙 육안 확인"] },
    { name: "줄눈", guides: ["줄눈 벌어짐/오염 체크", "줄눈 높이 균일 여부"] },
    { name: "구배", guides: ["바닥 물 고임(구배) 확인", "배수 방향 확인"] },
    { name: "오염", guides: ["시멘트/페인트 오염 확인"] },
    { name: "기타", guides: ["기타 하자 사항 직접 기재"] },
  ],
});

const MID_베란다설비 = (): MidCategory => ({
  name: "설비",
  subs: [
    { name: "배수구", guides: ["배수 원활 여부", "누수 여부 확인"], isUrgent: true },
    { name: "수전", guides: ["수압 확인", "누수 여부 확인"] },
    { name: "기타", guides: ["기타 하자 사항 직접 기재"] },
  ],
});

const MID_베란다문 = (): MidCategory => ({
  name: "문/창호",
  subs: [
    { name: "창문", guides: ["개폐 시 걸림/소음 확인", "잠금장치 작동 확인", "방충망 상태 확인"] },
    { name: "방충망", guides: ["방충망 찢김/변형 확인", "레일 작동 확인"] },
    { name: "기타", guides: ["기타 하자 사항 직접 기재"] },
  ],
});

const MID_베란다벽 = (): MidCategory => ({
  name: "벽",
  subs: [
    { name: "도장", guides: ["도장 벗겨짐/기포 확인"] },
    { name: "오염", guides: ["벽면 오염 여부 확인"] },
    { name: "크랙", guides: ["벽면 크랙/균열 확인"], isUrgent: true },
    { name: "기타", guides: ["기타 하자 사항 직접 기재"] },
  ],
});

const MID_베란다천장 = (): MidCategory => ({
  name: "천장",
  subs: [
    { name: "오염", guides: ["천장 오염 여부 확인"] },
    { name: "누수흔적", guides: ["천장 누수 흔적/얼룩 확인"], isUrgent: true },
    { name: "기타", guides: ["기타 하자 사항 직접 기재"] },
  ],
});

const MID_베란다전기 = (): MidCategory => ({
  name: "전기",
  subs: [
    { name: "조명", guides: ["조명 스위치 작동 확인"] },
    { name: "콘센트", guides: ["콘센트 통전 확인", "방수 커버 확인"] },
    { name: "기타", guides: ["기타 하자 사항 직접 기재"] },
  ],
});

// ── 침실 공통 mids ──
const bedroomMids = (): MidCategory[] => [
  MID_도배(), MID_바닥_마루(), MID_문창호_방(), MID_가구(), MID_천장(), MID_전기(),
];

// ── 욕실 공통 mids ──
const bathroomMids = (): MidCategory[] => [
  MID_욕실설비(), MID_욕실바닥(), MID_욕실벽(), MID_욕실문(), MID_욕실천장(), MID_욕실전기(),
];

// ── 발코니 공통 mids ──
const balconyMids = (): MidCategory[] => [
  MID_베란다바닥(), MID_베란다설비(), MID_베란다문(), MID_베란다벽(), MID_베란다천장(), MID_베란다전기(),
];

// ── 거실 중분류 ──
const MID_거실문 = (): MidCategory => ({
  name: "문/창호",
  subs: [
    { name: "발코니도어", guides: ["개폐 시 걸림/소음 확인", "문틀 간격 일정 여부", "잠금장치 작동 확인"] },
    { name: "창문", guides: ["개폐 시 걸림/소음 확인", "잠금장치 작동 확인", "방충망 상태 확인"] },
    { name: "문틀", guides: ["문틀 스크래치/파손 확인", "문틀 코킹 상태 확인"] },
    { name: "기타", guides: ["기타 하자 사항 직접 기재"] },
  ],
});

const MID_거실천장 = (): MidCategory => ({
  name: "천장",
  subs: [
    { name: "오염", guides: ["천장 오염 여부 확인"] },
    { name: "들뜸", guides: ["천장 벽지 들뜸/기포 체크"] },
    { name: "몰딩", guides: ["몰딩 이음새/들뜸 확인"] },
    { name: "기타", guides: ["기타 하자 사항 직접 기재"] },
  ],
});

// ── 주방 중분류 ──
const MID_주방가구 = (): MidCategory => ({
  name: "가구",
  subs: [
    { name: "싱크대", guides: ["문짝 수평 및 흔들림", "서랍 레일 3회 이상 작동 확인", "내부 마감 확인"] },
    { name: "상부장", guides: ["문짝 수평 및 흔들림", "내부 마감 확인"] },
    { name: "하부장", guides: ["문짝 수평 및 흔들림", "서랍 레일 작동 확인", "내부 마감 확인"] },
    { name: "자재불량", guides: ["자재 색상/질감 불량 확인"] },
    { name: "파손", guides: ["문짝/선반 파손 확인"] },
    { name: "오염", guides: ["내부/외부 오염 여부 확인"] },
    { name: "기타", guides: ["기타 하자 사항 직접 기재"] },
  ],
});

const MID_주방설비 = (): MidCategory => ({
  name: "설비",
  subs: [
    { name: "수전", guides: ["수압 및 온수 확인", "배수 원활 여부"] },
    { name: "배수구", guides: ["배수 원활 여부", "누수 여부 확인"], isUrgent: true },
    { name: "가스배관", guides: ["가스 누설 여부 확인", "밸브 작동 확인"], isUrgent: true },
    { name: "기타", guides: ["기타 하자 사항 직접 기재"] },
  ],
});

const MID_주방바닥 = (): MidCategory => ({
  name: "바닥",
  subs: [
    { name: "타일 들뜸", guides: ["타일 들뜸 두드려 확인", "보행 시 흔들림 체크"] },
    { name: "타일 파손", guides: ["타일 깨짐/크랙 육안 확인"] },
    { name: "줄눈", guides: ["줄눈 벌어짐/오염 체크", "줄눈 높이 균일 여부"] },
    { name: "수평상태", guides: ["바닥 물 고임(구배) 확인"] },
    { name: "오염", guides: ["시멘트/페인트 오염 확인"] },
    { name: "기타", guides: ["기타 하자 사항 직접 기재"] },
  ],
});

const MID_주방벽 = (): MidCategory => ({
  name: "벽",
  subs: [
    { name: "타일", guides: ["벽 타일 들뜸/파손 확인", "줄눈 벌어짐/오염 체크"] },
    { name: "오염", guides: ["벽면 오염 여부 확인"] },
    { name: "기타", guides: ["기타 하자 사항 직접 기재"] },
  ],
});

const MID_주방천장 = (): MidCategory => ({
  name: "천장",
  subs: [
    { name: "오염", guides: ["천장 오염 여부 확인"] },
    { name: "들뜸", guides: ["천장 마감 들뜸/기포 체크"] },
    { name: "기타", guides: ["기타 하자 사항 직접 기재"] },
  ],
});

const MID_주방전기 = (): MidCategory => ({
  name: "전기",
  subs: [
    { name: "조명", guides: ["조명 스위치 작동 확인"] },
    { name: "콘센트", guides: ["콘센트 통전 확인"] },
    { name: "기타", guides: ["기타 하자 사항 직접 기재"] },
  ],
});

// ── 현관 중분류 ──
const MID_현관문 = (): MidCategory => ({
  name: "문",
  subs: [
    { name: "파손", guides: ["현관문 외관 파손/찍힘 확인", "잠금장치 작동 확인"], isUrgent: true },
    { name: "열림상태", guides: ["개폐 시 걸림/소음 확인", "문틀 간격 일정 여부", "디지털 도어록 작동 확인"], isUrgent: true },
    { name: "패킹", guides: ["문틈 패킹 밀착 상태 확인", "바람/소음 차단 여부 체크"] },
  ],
});

const MID_현관바닥 = (): MidCategory => ({
  name: "바닥",
  subs: [
    { name: "들뜸", guides: ["타일 들뜸 두드려 확인", "보행 시 흔들림 체크"] },
    { name: "파손", guides: ["타일 깨짐/크랙 육안 확인"] },
    { name: "미시공", guides: ["타일 누락 구간 확인"] },
    { name: "오염", guides: ["시멘트/페인트 오염 확인"] },
    { name: "자재불량", guides: ["타일 색상 차이/무늬 불량 확인"] },
    { name: "줄눈", guides: ["줄눈 벌어짐/오염 체크", "줄눈 높이 균일 여부"] },
    { name: "수평상태", guides: ["바닥 수평 확인(물건 굴리기)", "바닥 물 고임(구배) 확인"] },
  ],
});

const MID_신발장 = (): MidCategory => ({
  name: "신발장",
  subs: [
    { name: "자재불량", guides: ["자재 색상/질감 불량 확인"] },
    { name: "파손", guides: ["문짝/선반 파손 확인"] },
    { name: "오염", guides: ["내부/외부 오염 여부 확인"] },
    { name: "수평상태", guides: ["신발장 문 수평 확인", "문짝 수평 및 흔들림"] },
  ],
});

const MID_팬트리 = (): MidCategory => ({
  name: "팬트리",
  subs: [
    { name: "전기", guides: ["조명 스위치 작동 확인", "콘센트 통전 확인"] },
    { name: "바닥", guides: ["바닥 마감 상태 확인"] },
    { name: "천장", guides: ["천장 마감 상태 확인", "들뜸/기포 체크"] },
    { name: "자재불량", guides: ["자재 색상/질감 불량 확인"] },
    { name: "파손", guides: ["선반/문짝 파손 확인"] },
    { name: "오염", guides: ["내부 오염 여부 확인"] },
    { name: "기타", guides: ["기타 하자 사항 직접 기재"] },
  ],
});

const MID_현관천장 = (): MidCategory => ({
  name: "천장",
  subs: [
    { name: "오염", guides: ["천장 오염 여부 확인"] },
    { name: "미시공", guides: ["마감 누락 구간 확인"] },
    { name: "자재불량", guides: ["자재 색상/질감 불량 확인"] },
    { name: "기타", guides: ["기타 하자 사항 직접 기재"] },
  ],
});

const MID_중문 = (): MidCategory => ({
  name: "중문",
  subs: [
    { name: "자재불량", guides: ["중문 자재 색상/질감 불량 확인"] },
    { name: "파손", guides: ["중문 파손/찍힘 확인"] },
    { name: "오염", guides: ["중문 오염 여부 확인"] },
    { name: "수평상태", guides: ["중문 수평 확인", "개폐 시 걸림/소음 확인"] },
    { name: "기타", guides: ["기타 하자 사항 직접 기재"] },
  ],
});

const MID_현관전기 = (): MidCategory => ({
  name: "전기",
  subs: [
    { name: "센서등", guides: ["센서등 감지 작동 확인", "조명 밝기/점멸 체크"] },
    { name: "인터폰", guides: ["인터폰 작동 확인", "영상/음성 통화 테스트"], isUrgent: true },
  ],
});

// ── 메인 카테고리 배열 ──

export const defectCategories: MainCategory[] = [
  {
    name: "침실1(안방)",
    icon: "🛏️",
    mids: bedroomMids(),
  },
  {
    name: "침실2",
    icon: "🛏️",
    mids: bedroomMids(),
  },
  {
    name: "침실3",
    icon: "🛏️",
    mids: bedroomMids(),
  },
  {
    name: "드레스룸",
    icon: "👗",
    mids: [MID_가구(), MID_바닥_마루(), MID_문창호_방(), MID_천장(), MID_전기()],
  },
  {
    name: "욕실1",
    icon: "🚿",
    mids: bathroomMids(),
  },
  {
    name: "욕실2",
    icon: "🛁",
    mids: bathroomMids(),
  },
  {
    name: "현관",
    icon: "🚪",
    mids: [MID_현관문(), MID_현관바닥(), MID_신발장(), MID_팬트리(), MID_현관천장(), MID_중문(), MID_현관전기()],
  },
  {
    name: "거실",
    icon: "🛋️",
    mids: [MID_도배(), MID_바닥_마루(), MID_거실문(), MID_거실천장(), MID_전기()],
  },
  {
    name: "주방/식당",
    icon: "🍳",
    mids: [MID_주방가구(), MID_주방설비(), MID_주방바닥(), MID_주방벽(), MID_주방천장(), MID_주방전기()],
  },
  {
    name: "알파룸",
    icon: "🏠",
    mids: [MID_도배(), MID_바닥_마루(), MID_문창호_방(), MID_천장(), MID_전기()],
  },
  {
    name: "발코니(하)",
    icon: "🌿",
    mids: balconyMids(),
  },
  {
    name: "발코니(우)",
    icon: "🌿",
    mids: balconyMids(),
  },
];

// 긴급 키워드
export const URGENT_KEYWORDS = ["누수", "단전", "잠금장치"];

export function checkUrgency(sub: SubCategory, checkedGuides: string[]): boolean {
  if (sub.isUrgent) return true;
  return checkedGuides.some((g) =>
    URGENT_KEYWORDS.some((kw) => g.includes(kw))
  );
}
