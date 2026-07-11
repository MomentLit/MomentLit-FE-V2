"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

import { useMainPage } from "../hooks/useMainPage";
import HeroCarousel from "./HeroCarousel";
import SpaceSection from "./SpaceSection";

export default function MainPageScreen() {
  const router = useRouter();
  const { data, error, isLoading } = useMainPage();
  const [searchValue, setSearchValue] = useState("");

  const submitSearch = () => {
    const keyword = searchValue.trim();
    router.push(keyword ? `/search?name=${encodeURIComponent(keyword)}` : "/search");
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      <Header
        activeNav="home"
        onSearch={submitSearch}
        onSearchValueChange={setSearchValue}
        searchValue={searchValue}
        type="top"
      />
      <main>
        <HeroCarousel items={data.heroes} />
        {isLoading && <p className="py-[80px] text-center text-[#67728A]">공간 정보를 불러오는 중입니다.</p>}
        {!isLoading && error && <p className="py-[80px] text-center text-[#DA294A]">{error}</p>}
        {!isLoading && !error && (
          <div className="mx-auto flex w-[1340px] max-w-[calc(100%-40px)] flex-col gap-[100px] pb-[55px] pt-[48px]">
            <SpaceSection accent="공간" items={data.primarySpaces} title="새로운" />
            <SpaceSection accent="공간" items={data.secondarySpaces} title="둘러볼" />
            <SpaceSection accent="공간" items={data.moreSpaces} title="더 많은" twoRows />
          </div>
        )}
      </main>
      <Footer variant="mainPage" />
    </div>
  );
}
