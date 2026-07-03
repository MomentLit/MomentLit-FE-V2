import type { MainHero } from "../types";

const titles = [
  "당신의 순간을 위한 공간",
  "새로운 공간을 준비 중입니다",
  "MomentLit 추천 공간",
  "팝업을 위한 공간",
  "함께 만드는 공간",
];

export const defaultMainHeroes: MainHero[] = titles.map((title, index) => ({
  id: -(index + 1),
  title,
  price: "공간 정보 업데이트 예정",
  period: "공간 정보 업데이트 예정",
  category: "",
  address: "MomentLit",
}));
