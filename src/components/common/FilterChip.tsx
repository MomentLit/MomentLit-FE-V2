import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/src/utils/cn";

type FilterChipProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
  chipType?: "button" | "select" | "tag";
  children?: ReactNode;
};

export default function FilterChip({
  active = false,
  chipType = "button",
  children,
  className,
  ...props
}: FilterChipProps) {
  const isTag = chipType === "tag";
  const isSelect = chipType === "select";
  const label = children ?? (active || isTag ? "전체" : "대기");

  return (
    <button
      className={cn(
        "inline-flex min-h-[61px] items-center gap-[4px] rounded-[12px] px-[24px] py-[16px] text-[24px] font-semibold leading-none transition-colors",
        active && !isTag && "bg-[#00ADB5] text-[#E6F7F8]",
        !active && "bg-[#D0D3DB] text-[#5E687E]",
        isTag && "bg-[#B3E6EA] text-[#00ADB5]",
        className,
      )}
      type="button"
      {...props}
    >
      <span>{label}</span>
      {isSelect && <span className="rotate-90 text-[22px] leading-none">›</span>}
      {isTag && <span className="text-[28px] leading-none text-[#67728A]">×</span>}
    </button>
  );
}
