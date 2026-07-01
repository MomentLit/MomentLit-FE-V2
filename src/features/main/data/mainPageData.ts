export type MainPopup = {
  id: number;
  title: string;
  period: string;
  address: string;
  imageUrl?: string;
  liked?: boolean;
};

export type MainHero = MainPopup;

const period = "2026.03.18 ~ 2026.03.20";
const address = "주소";

const popupTitles = [
  "관악 책방 팝업",
  "오뚜기 팝업",
  "5등분의 신부 팝업",
  "올리브영 팝업",
  "스너글 팝업",
  "부산 청년 로컬 팝업",
  "봄날의 기록 팝업",
  "취향 상점 팝업",
  "모먼트 마켓",
  "리빙 브랜드 팝업",
  "성수 디저트 팝업",
  "로컬 크리에이터 팝업",
  "필름 아카이브 팝업",
  "주말 책방 팝업",
  "그린 라이프 팝업",
  "오늘의 문구점",
  "스튜디오 마켓",
  "브랜드 쇼룸",
  "커피 페어 팝업",
  "뮤직 라운지 팝업",
  "제로웨이스트 팝업",
  "독립출판 마켓",
  "로컬 푸드 팝업",
  "관악 책방 팝업",
] as const;

export const mainPopups: MainPopup[] = popupTitles.map((title, index) => ({
  id: index + 1,
  title,
  period,
  address,
  liked: index === 3 || index === 14,
}));

export const todayPicks = mainPopups.slice(0, 6);
export const trendingPopups = mainPopups.slice(6, 12);
export const recommendedPopups = mainPopups.slice(12, 24);

export const mainHeroes: MainHero[] = [
  "관악 로컬 페어",
  "모먼트 브랜드 위크",
  "부산 청년 로컬 팝업",
  "취향 발견 마켓",
  "봄날의 크리에이터 쇼룸",
].map((title, index) => ({
  id: index + 1,
  title,
  period,
  address,
}));
