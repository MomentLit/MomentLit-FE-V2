import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/src/utils/cn";

type FavoriteButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
};

export default function FavoriteButton({ active = false, className, ...props }: FavoriteButtonProps) {
  return (
    <button
      aria-label={active ? "좋아요 취소" : "좋아요"}
      className={cn("grid size-[24px] place-items-center text-[#DA294A]", !active && "text-[#222831]", className)}
      type="button"
      {...props}
    >
      <svg aria-hidden="true" className="size-[24px]" fill={active ? "currentColor" : "none"} viewBox="0 0 24 24">
        <path
          d="M12 20.3c-4.9-4.3-8-7-8-10.6A4.5 4.5 0 0 1 8.5 5c1.5 0 2.7.7 3.5 1.8A4.2 4.2 0 0 1 15.5 5 4.5 4.5 0 0 1 20 9.7c0 3.6-3.1 6.3-8 10.6Z"
          stroke="currentColor"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
    </button>
  );
}
