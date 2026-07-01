import { cn } from "@/utils/cn";

import FavoriteButton from "./FavoriteButton";
import MarkerIcon from "./MarkerIcon";

type SpaceCardProps = {
  title?: string;
  price?: string;
  unit?: string;
  address?: string;
  imageUrl?: string;
  liked?: boolean;
  className?: string;
};

export default function SpaceCard({
  title = "제목",
  price = "N원",
  unit = "1시간",
  address = "주소",
  imageUrl,
  liked = false,
  className,
}: SpaceCardProps) {
  return (
    <article className={cn("flex flex-col gap-[8px]", className)}>
      <div
        className="flex h-[223px] w-[300px] items-start justify-end overflow-hidden rounded-[12px] bg-white bg-cover bg-center p-[8px]"
        style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : undefined}
      >
        <FavoriteButton active={liked} />
      </div>
      <div className="flex w-[240px] flex-col gap-[4px]">
        <h3 className="truncate text-[19px] font-bold leading-normal text-[#222831]">{title}</h3>
        <p className="text-[14px] leading-normal">
          <span className="font-medium text-[#00ADB5]">{price} </span>
          <span className="text-[#67728A]">/ {unit}</span>
        </p>
        <p className="flex w-full items-start gap-[2px] truncate text-[14px] leading-normal text-[#67728A]">
          <MarkerIcon className="h-[17px] w-[9px] text-[#8A94A8]" />
          <span className="truncate">{address}</span>
        </p>
      </div>
    </article>
  );
}
