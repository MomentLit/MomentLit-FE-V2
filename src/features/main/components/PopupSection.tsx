import Link from "next/link";

import PopupCard from "@/components/ui/PopupCard";
import type { MainPopup } from "@/features/main/data/mainPageData";
import { cn } from "@/utils/cn";

type PopupSectionProps = {
  prefix: string;
  accent: string;
  items: MainPopup[];
  twoRows?: boolean;
};

export default function PopupSection({ prefix, accent, items, twoRows = false }: PopupSectionProps) {
  return (
    <section className="flex flex-col gap-[20px]">
      <div className="flex h-[36px] items-center justify-between">
        <h2 className="text-[24px] font-bold leading-normal text-[#222831]">
          {prefix}
          <span className="text-[#00ADB5]">{accent}</span>
        </h2>
        <Link className="text-[16px] font-medium text-[#5E687E] hover:text-[#00ADB5]" href="/search">
          더보기
        </Link>
      </div>
      <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div
          className={cn(
            "grid min-w-max grid-flow-col gap-x-[28px] gap-y-[24px] xl:min-w-0 xl:grid-flow-row xl:grid-cols-[repeat(6,200px)] xl:justify-between",
            twoRows ? "grid-rows-2 xl:grid-rows-[repeat(2,329px)]" : "grid-rows-1",
          )}
        >
          {items.map((item) => (
            <PopupCard
              address={item.address}
              imageUrl={item.imageUrl}
              key={item.id}
              liked={item.liked}
              period={item.period}
              title={item.title}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
