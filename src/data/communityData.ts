export interface CommunityPost {
  id: string;
  board: "free" | "anonymous";
  title: string;
  content: string;
  author: string;
  createdAt: string;
  likes: number;
  comments: CommunityComment[];
  photos: string[];
  likedByMe: boolean;
}

export interface CommunityComment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

export const dummyPosts: CommunityPost[] = [
  {
    id: "1",
    board: "free",
    title: "입주 준비 팁 공유합니다",
    content: "이사 전에 미리 준비하면 좋은 것들을 정리해봤어요. 청소용품, 커튼 사이즈 재기, 인터넷 설치 예약 등등...",
    author: "101동 주민",
    createdAt: "2026-04-07",
    likes: 12,
    comments: [
      { id: "c1", author: "102동 주민", content: "좋은 정보 감사합니다!", createdAt: "2026-04-07" },
      { id: "c2", author: "103동 주민", content: "커튼 사이즈 어떻게 재셨나요?", createdAt: "2026-04-07" },
      { id: "c3", author: "101동 주민", content: "창문 틀 안쪽을 재면 됩니다", createdAt: "2026-04-07" },
      { id: "c4", author: "104동 주민", content: "인터넷은 어디로 하셨어요?", createdAt: "2026-04-08" },
      { id: "c5", author: "105동 주민", content: "저도 궁금해요!", createdAt: "2026-04-08" },
    ],
    photos: [],
    likedByMe: false,
  },
  {
    id: "2",
    board: "free",
    title: "이사 업체 추천해주세요",
    content: "다음 달 이사 예정인데 혹시 괜찮은 이사 업체 아시는 분 계신가요? 가격대도 궁금합니다.",
    author: "202동 주민",
    createdAt: "2026-04-06",
    likes: 8,
    comments: [
      { id: "c6", author: "201동 주민", content: "OO이사 추천합니다", createdAt: "2026-04-06" },
      { id: "c7", author: "203동 주민", content: "저는 XX이사 이용했어요", createdAt: "2026-04-07" },
      { id: "c8", author: "202동 주민", content: "감사합니다! 견적 받아볼게요", createdAt: "2026-04-07" },
    ],
    photos: [],
    likedByMe: false,
  },
  {
    id: "3",
    board: "free",
    title: "사전점검 시 주의사항",
    content: "사전점검 다녀왔는데 꼭 확인해야 할 항목들 정리합니다. 수전, 전기 콘센트, 벽지 접합부 등 꼼꼼하게 보세요.",
    author: "301동 주민",
    createdAt: "2026-04-05",
    likes: 21,
    comments: Array.from({ length: 9 }, (_, i) => ({
      id: `c${10 + i}`,
      author: `${100 + i}동 주민`,
      content: "유용한 정보 감사합니다!",
      createdAt: "2026-04-05",
    })),
    photos: [],
    likedByMe: false,
  },
  {
    id: "4",
    board: "anonymous",
    title: "관리비 기준이 궁금해요",
    content: "아직 입주 전인데 관리비가 어느 정도 나올지 궁금합니다. 비슷한 평수 다른 단지 사시는 분 있으신가요?",
    author: "익명",
    createdAt: "2026-04-07",
    likes: 6,
    comments: [
      { id: "c20", author: "익명", content: "저도 궁금해요", createdAt: "2026-04-07" },
      { id: "c21", author: "익명", content: "보통 20~30만원 정도라고 들었어요", createdAt: "2026-04-08" },
    ],
    photos: [],
    likedByMe: false,
  },
  {
    id: "5",
    board: "anonymous",
    title: "주차 공간 배정 언제 되나요?",
    content: "주차 공간 배정 일정이 아직 안 나온 것 같은데, 혹시 아시는 분 계신가요?",
    author: "익명",
    createdAt: "2026-04-06",
    likes: 4,
    comments: Array.from({ length: 7 }, (_, i) => ({
      id: `c${30 + i}`,
      author: "익명",
      content: i === 0 ? "관리사무소에 문의해보셨나요?" : "저도 기다리고 있어요",
      createdAt: "2026-04-06",
    })),
    photos: [],
    likedByMe: false,
  },
];
