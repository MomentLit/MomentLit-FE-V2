import { cn } from "@/src/utils/cn";

import FavoriteButton from "./FavoriteButton";
import MarkerIcon from "./MarkerIcon";

type PopupCardProps = {
  title?: string;
  period?: string;
  address?: string;
  imageUrl?: string;
  liked?: boolean;
  className?: string;
};

export default function PopupCard({
  title = "제목",
  period = "2026.03.18 ~ 2026.03.20",
  address = "주소",
  imageUrl,
  liked = false,
  className,
}: PopupCardProps) {
  return (
    <article className={cn("flex w-[200px] flex-col gap-[8px]", className)}>
      <div
        className="flex h-[266px] w-[200px] items-start justify-end overflow-hidden rounded-[12px] bg-white bg-cover bg-center p-[8px]"
        style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : undefined}
      >
        <FavoriteButton active={liked} />
      </div>
      <div className="flex w-[200px] flex-col gap-[4px]">
        <h3 className="truncate text-[16px] font-bold leading-normal text-[#222831]">{title}</h3>
        <p className="text-[12px] leading-normal text-[#5E687E]">{period}</p>
        <p className="flex w-full items-start gap-[2px] truncate text-[12px] leading-normal text-[#67728A]">
          <MarkerIcon className="text-[#8A94A8]" />
          <span className="truncate">{address}</span>
        </p>
      </div>
    </article>
  );
}
