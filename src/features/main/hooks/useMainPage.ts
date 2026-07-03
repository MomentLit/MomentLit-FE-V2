"use client";

import { useEffect, useState } from "react";

import { getSpaces } from "@/apis/space";

import { defaultMainHeroes } from "../data/defaultMainHeroes";
import type { MainHero, MainSpaceItem } from "../types";

type MainPageData = {
  heroes: MainHero[];
  primarySpaces: MainSpaceItem[];
  secondarySpaces: MainSpaceItem[];
  moreSpaces: MainSpaceItem[];
};

const emptyData: MainPageData = {
  heroes: defaultMainHeroes,
  primarySpaces: [],
  secondarySpaces: [],
  moreSpaces: [],
};

export function useMainPage() {
  const [data, setData] = useState<MainPageData>(emptyData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    const loadSpaces = async () => {
      try {
        const response = await getSpaces();
        const items = response.data.spaces.map<MainSpaceItem>((space) => ({
          id: space.space_id,
          title: space.name,
          price: `${space.price_per_hour.toLocaleString("ko-KR")}원 / 1시간`,
          category: space.category,
          address: space.address.road_address || space.address.jibun_address,
          imageUrl: space.thumbnail_url || undefined,
        }));

        if (isActive) {
          setData({
            heroes: items.length > 0
              ? items.slice(0, 5).map((item) => ({ ...item, period: item.price }))
              : defaultMainHeroes,
            primarySpaces: items.slice(0, 6),
            secondarySpaces: items.slice(6, 12),
            moreSpaces: items.slice(12, 24),
          });
        }
      } catch {
        if (isActive) setError("공간 정보를 불러오지 못했습니다.");
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    void loadSpaces();
    return () => {
      isActive = false;
    };
  }, []);

  return { data, error, isLoading };
}
