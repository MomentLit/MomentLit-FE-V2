import { cn } from "@/utils/cn";

import MarkerIcon from "./MarkerIcon";

type BigCardProps = {
  title?: string;
  period?: string;
  address?: string;
  imageUrl?: string;
  overlay?: boolean;
  className?: string;
};

export default function BigCard({
  title = "제목",
  period = "2026.03.18 ~ 2026.03.20",
  address = "주소",
  imageUrl,
  overlay = false,
  className,
}: BigCardProps) {
  return (
    <article
      className={cn(
        "relative flex h-[466px] w-[350px] flex-col justify-end overflow-hidden rounded-[12px] bg-white bg-cover bg-center",
        className,
      )}
      style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : undefined}
    >
      {overlay && (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent from-[28%] to-black/50 backdrop-blur-[2px]" />
          <div className="relative z-10 flex w-full flex-col px-[12px] py-[8px] text-white">
            <h3 className="truncate text-[24px] font-bold leading-normal">{title}</h3>
            <p className="text-[16px] leading-normal">{period}</p>
            <p className="flex items-start gap-[2px] truncate text-[16px] leading-normal">
              <MarkerIcon className="h-[19px] w-[11px] text-white" />
              <span className="truncate">{address}</span>
            </p>
          </div>
        </>
      )}
    </article>
  );
}
