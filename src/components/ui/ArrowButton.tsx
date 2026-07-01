import Image from "next/image";
import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/utils/cn";

type ArrowButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  direction?: "left" | "right";
};

export default function ArrowButton({ direction = "right", className, ...props }: ArrowButtonProps) {
  return (
    <button
      aria-label={direction === "right" ? "다음" : "이전"}
      className={cn("grid size-[48px] cursor-pointer place-items-center rounded-full disabled:cursor-not-allowed disabled:opacity-60", className)}
      type="button"
      {...props}
    >
      <Image
        alt=""
        aria-hidden
        height={48}
        src={direction === "left" ? "/icons/Arrow_Left.svg" : "/icons/Arrow_Right.svg"}
        width={48}
      />
    </button>
  );
}
