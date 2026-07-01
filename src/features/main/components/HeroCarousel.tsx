"use client";

import { useMemo, useState } from "react";

import ArrowButton from "@/components/ui/ArrowButton";
import BigCard from "@/components/ui/BigCard";
import type { MainHero } from "@/features/main/data/mainPageData";

type HeroCarouselProps = {
  items: MainHero[];
};

const offsets = [-2, -1, 0, 1, 2] as const;

export default function HeroCarousel({ items }: HeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(2);
  const visibleItems = useMemo(
    () =>
      offsets.map((offset) => ({
        item: items[(activeIndex + offset + items.length) % items.length],
        offset,
      })),
    [activeIndex, items],
  );

  const move = (direction: -1 | 1) => {
    setActiveIndex((current) => (current + direction + items.length) % items.length);
  };

  return (
    <section className="relative overflow-hidden pb-[38px] pt-[38px]" aria-label="추천 팝업">
      <div className="flex h-[559px] items-center justify-center max-md:h-[448px]">
        <div className="flex min-w-max items-center gap-[20px] transition-transform duration-300 ease-out">
          {visibleItems.map(({ item, offset }) => {
            const size = offset === 0 ? "large" : Math.abs(offset) === 1 ? "medium" : "small";

            return (
              <BigCard
                address={item.address}
                imageUrl={item.imageUrl}
                key={`${item.id}-${offset}`}
                overlay={offset === 0}
                period={item.period}
                size={size}
                title={item.title}
              />
            );
          })}
        </div>
      </div>
      <ArrowButton
        className="absolute left-[48px] top-1/2 z-10 -translate-y-1/2 shadow-[0_2px_12px_rgba(34,40,49,0.12)] max-md:left-[12px]"
        direction="left"
        onClick={() => move(-1)}
      />
      <ArrowButton
        className="absolute right-[48px] top-1/2 z-10 -translate-y-1/2 shadow-[0_2px_12px_rgba(34,40,49,0.12)] max-md:right-[12px]"
        direction="right"
        onClick={() => move(1)}
      />
    </section>
  );
}
