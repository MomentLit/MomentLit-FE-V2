import { cn } from "@/utils/cn";

import MarkerIcon from "./MarkerIcon";

type BigCardProps = {
  title?: string;
  period?: string;
  address?: string;
  imageUrl?: string;
  overlay?: boolean;
  size?: "small" | "medium" | "large";
  className?: string;
};

const sizeClasses = {
  small: "h-[466px] w-[350px] max-md:h-[360px] max-md:w-[270px]",
  medium: "h-[519px] w-[390px] max-md:h-[400px] max-md:w-[300px]",
  large: "h-[559px] w-[420px] max-md:h-[448px] max-md:w-[calc(100vw-48px)]",
};

export default function BigCard({
  title = "제목",
  period = "2026.03.18 ~ 2026.03.20",
  address = "주소",
  imageUrl,
  overlay = false,
  size = "small",
  className,
}: BigCardProps) {
  return (
    <article
      className={cn(
        "group relative flex shrink-0 flex-col justify-end overflow-hidden rounded-[12px] bg-white bg-cover bg-center outline-none",
        sizeClasses[size],
        className,
      )}
      style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : undefined}
      tabIndex={0}
    >
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-b from-transparent from-[28%] to-black/50 opacity-0 backdrop-blur-[2px] transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100",
          overlay && "opacity-100",
        )}
      />
      <div
        className={cn(
          "relative z-10 flex w-full translate-y-[8px] flex-col px-[12px] py-[8px] text-white opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100",
          overlay && "translate-y-0 opacity-100",
        )}
      >
        <h3 className="truncate text-[24px] font-bold leading-normal">{title}</h3>
        <p className="text-[16px] leading-normal">{period}</p>
        <p className="flex items-start gap-[2px] truncate text-[16px] leading-normal">
          <MarkerIcon className="h-[19px] w-[11px] text-white" />
          <span className="truncate">{address}</span>
        </p>
      </div>
    </article>
  );
}
