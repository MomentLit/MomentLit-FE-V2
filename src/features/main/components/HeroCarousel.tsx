"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import ArrowButton from "@/components/ui/ArrowButton";
import BigCard from "@/components/ui/BigCard";
import type { MainHero } from "@/features/main/types";
import { cn } from "@/utils/cn";

type HeroCarouselProps = {
  items: MainHero[];
};

const AUTO_PLAY_DELAY = 5000;
const TRANSITION_DURATION = 500;

const positionClasses = {
  "-2": "-ml-[815px] max-md:-ml-[646px]",
  "-1": "-ml-[425px] max-md:-ml-[341px]",
  "0": "ml-0",
  "1": "ml-[425px] max-md:ml-[341px]",
  "2": "ml-[815px] max-md:ml-[646px]",
} as const;

const layerClasses = {
  "-2": "z-10",
  "-1": "z-20",
  "0": "z-30",
  "1": "z-20",
  "2": "z-10",
} as const;

export default function HeroCarousel({ items }: HeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(Math.min(2, Math.max(items.length - 1, 0)));
  const [slideDirection, setSlideDirection] = useState<-1 | 0 | 1>(0);
  const [isPaused, setIsPaused] = useState(false);
  const isAnimatingRef = useRef(false);
  const transitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const move = useCallback((direction: -1 | 1) => {
    if (items.length < 2 || isAnimatingRef.current) return;

    isAnimatingRef.current = true;
    setSlideDirection(direction);
    setActiveIndex((current) => (current + direction + items.length) % items.length);
    transitionTimerRef.current = setTimeout(() => {
      isAnimatingRef.current = false;
      setSlideDirection(0);
    }, TRANSITION_DURATION);
  }, [items.length]);

  useEffect(() => {
    if (isPaused || items.length < 2) return;
    const interval = setInterval(() => move(1), AUTO_PLAY_DELAY);
    return () => clearInterval(interval);
  }, [isPaused, items.length, move]);

  useEffect(() => () => {
    if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
  }, []);

  if (items.length === 0) return null;

  const getOffset = (index: number) => {
    const rawOffset = (index - activeIndex + items.length) % items.length;
    return rawOffset > Math.floor(items.length / 2) ? rawOffset - items.length : rawOffset;
  };

  return (
    <section
      aria-label="추천 팝업"
      className="relative overflow-hidden pb-[38px] pt-[38px]"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsPaused(false);
      }}
      onFocus={() => setIsPaused(true)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative h-[559px] max-md:h-[448px]">
        {items.map((item, index) => {
          const offset = getOffset(index);
          const normalizedOffset = Math.max(-2, Math.min(2, offset)) as -2 | -1 | 0 | 1 | 2;
          const size = normalizedOffset === 0 ? "large" : Math.abs(normalizedOffset) === 1 ? "medium" : "small";
          const isWrapping = (slideDirection === 1 && normalizedOffset === 2) || (slideDirection === -1 && normalizedOffset === -2);

          const positionKey = String(normalizedOffset) as keyof typeof positionClasses;

          return (
            <div
              className={cn(
                "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-[margin-left,opacity] duration-500 ease-out motion-reduce:transition-none",
                positionClasses[positionKey],
                layerClasses[positionKey],
                isWrapping && "opacity-0 transition-none",
              )}
              key={item.id}
            >
              <BigCard
                address={item.address}
                className="transition-[width,height] duration-500 ease-out motion-reduce:transition-none"
                imageUrl={item.imageUrl}
                period={item.period}
                size={size}
                title={item.title}
              />
            </div>
          );
        })}
      </div>
      <ArrowButton
        className="absolute left-[48px] top-1/2 z-40 -translate-y-1/2 shadow-[0_2px_12px_rgba(34,40,49,0.12)] max-md:left-[12px]"
        direction="left"
        disabled={slideDirection !== 0}
        onClick={() => move(-1)}
      />
      <ArrowButton
        className="absolute right-[48px] top-1/2 z-40 -translate-y-1/2 shadow-[0_2px_12px_rgba(34,40,49,0.12)] max-md:right-[12px]"
        direction="right"
        disabled={slideDirection !== 0}
        onClick={() => move(1)}
      />
    </section>
  );
}
