import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import HeroCarousel from "@/features/main/components/HeroCarousel";
import PopupSection from "@/features/main/components/PopupSection";
import {
  mainHeroes,
  recommendedPopups,
  todayPicks,
  trendingPopups,
} from "@/features/main/data/mainPageData";

export default function MainPage() {
  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      <Header type="top" />
      <main>
        <HeroCarousel items={mainHeroes} />
        <div className="mx-auto flex w-[1340px] max-w-[calc(100%-40px)] flex-col gap-[100px] pb-[55px]">
          <PopupSection accent="Pick" items={todayPicks} prefix="Today's " />
          <PopupSection accent="가장 핫한 곳" items={trendingPopups} prefix="요즘 " />
          <PopupSection accent="취향 저격" items={recommendedPopups} prefix="당신의 " twoRows />
        </div>
      </main>
      <Footer variant="mainPage" />
    </div>
  );
}
