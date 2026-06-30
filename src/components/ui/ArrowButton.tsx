import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/utils/cn";

type ArrowButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  direction?: "left" | "right";
};

export default function ArrowButton({ direction = "right", className, ...props }: ArrowButtonProps) {
  return (
    <button
      aria-label={direction === "right" ? "다음" : "이전"}
      className={cn("grid size-[48px] place-items-center rounded-full bg-white text-[#00ADB5]", className)}
      type="button"
      {...props}
    >
      <svg
        aria-hidden="true"
        className={cn("size-[24px]", direction === "left" && "rotate-180")}
        fill="none"
        viewBox="0 0 24 24"
      >
        <path d="m9 5 7 7-7 7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      </svg>
    </button>
  );
}
