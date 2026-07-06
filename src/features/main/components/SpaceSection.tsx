import Link from "next/link";

import type { MainSpaceItem } from "@/features/main/types";
import { cn } from "@/utils/cn";

import MainSpaceCard from "./MainSpaceCard";

type SpaceSectionProps = {
  title: string;
  accent: string;
  items: MainSpaceItem[];
  twoRows?: boolean;
};

export default function SpaceSection({ title, accent, items, twoRows = false }: SpaceSectionProps) {
  return (
    <section className="flex flex-col gap-[20px]">
      <div className="flex min-h-[36px] items-center justify-between gap-[16px]">
        <h2 className="text-[24px] font-bold leading-normal text-[#222831]">
          {title} <span className="text-[#00ADB5]">{accent}</span>
        </h2>
        <Link className="shrink-0 text-[16px] font-medium text-[#5E687E] hover:text-[#00ADB5]" href="/search">
          더보기
        </Link>
      </div>
      {items.length === 0 ? (
        <p className="rounded-[12px] bg-white px-[20px] py-[48px] text-center text-[14px] text-[#67728A]">표시할 공간이 없습니다.</p>
      ) : (
        <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div
            className={cn(
              "grid min-w-max grid-flow-col gap-x-[28px] gap-y-[24px] xl:min-w-0 xl:grid-flow-row xl:grid-cols-[repeat(6,200px)] xl:justify-between",
              twoRows ? "grid-rows-2 xl:grid-rows-[repeat(2,329px)]" : "grid-rows-1",
            )}
          >
            {items.map((item) => <MainSpaceCard item={item} key={item.id} />)}
          </div>
        </div>
      )}
    </section>
  );
}
