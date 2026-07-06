import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/utils/cn";

type FilterChipProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
  chipType?: "button" | "select" | "tag";
  children?: ReactNode;
  compact?: boolean;
};

export default function FilterChip({
  active = false,
  chipType = "button",
  children,
  className,
  compact = false,
  ...props
}: FilterChipProps) {
  const isTag = chipType === "tag";
  const isSelect = chipType === "select";
  const label = children ?? (active || isTag ? "전체" : "대기");

  return (
    <button
      className={cn(
        "inline-flex items-center rounded-[12px] font-semibold leading-none transition-colors",
        compact
          ? "min-h-[36px] gap-[2px] px-[14px] py-[9px] !text-[12px] !font-semibold !leading-none"
          : "min-h-[61px] gap-[4px] px-[24px] py-[16px] text-[24px]",
        active && !isTag && "bg-[#00ADB5] text-[#E6F7F8]",
        !active && (compact ? "bg-[#EDEDED] text-[#5E687E]" : "bg-[#D0D3DB] text-[#5E687E]"),
        isTag && "bg-[#B3E6EA] text-[#00ADB5]",
        className,
      )}
      type="button"
      {...props}
    >
      <span>{label}</span>
      {isSelect && (
        <span className={cn("rotate-90 leading-none", compact ? "text-[11px]" : "text-[22px]")}>›</span>
      )}
      {isTag && <span className="text-[28px] leading-none text-[#67728A]">×</span>}
    </button>
  );
}
