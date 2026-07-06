import Link from "next/link";

import MarkerIcon from "@/components/ui/MarkerIcon";
import type { MainSpaceItem } from "@/features/main/types";

type MainSpaceCardProps = {
  item: MainSpaceItem;
};

export default function MainSpaceCard({ item }: MainSpaceCardProps) {
  return (
    <Link className="flex w-[200px] flex-col gap-[8px]" href={`/spaces/${item.id}`}>
      <span
        className="h-[266px] w-[200px] rounded-[12px] bg-[#EEEEEE] bg-cover bg-center"
        style={item.imageUrl ? { backgroundImage: `url(${item.imageUrl})` } : undefined}
      />
      <span className="flex w-[200px] flex-col gap-[4px]">
        <strong className="truncate text-[16px] font-bold leading-normal text-[#222831]">{item.title}</strong>
        <span className="truncate text-[12px] font-medium leading-normal text-[#00ADB5]">{item.price}</span>
        <span className="flex w-full items-start gap-[2px] text-[12px] leading-normal text-[#67728A]">
          <MarkerIcon className="shrink-0 text-[#8A94A8]" />
          <span className="truncate">{item.address}</span>
        </span>
      </span>
    </Link>
  );
}
