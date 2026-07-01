"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { ButtonHTMLAttributes, MouseEvent } from "react";

import { cn } from "@/utils/cn";

type FavoriteButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
};

export default function FavoriteButton({ active = false, className, disabled, onClick, ...props }: FavoriteButtonProps) {
  const [isActive, setIsActive] = useState(active);
  const [isPopping, setIsPopping] = useState(false);
  const animationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (animationTimerRef.current) clearTimeout(animationTimerRef.current);
  }, []);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      setIsActive((current) => !current);
      setIsPopping(true);
      if (animationTimerRef.current) clearTimeout(animationTimerRef.current);
      animationTimerRef.current = setTimeout(() => setIsPopping(false), 180);
    }
    onClick?.(event);
  };

  return (
    <button
      aria-label={isActive ? "좋아요 취소" : "좋아요"}
      aria-pressed={isActive}
      className={cn(
        "grid size-[24px] cursor-pointer place-items-center transition-transform duration-150 active:scale-75 disabled:cursor-not-allowed motion-reduce:transition-none",
        className,
      )}
      disabled={disabled}
      onClick={handleClick}
      type="button"
      {...props}
    >
      <Image
        alt=""
        aria-hidden
        className={cn(
          "transition-transform duration-[180ms] ease-out motion-reduce:transition-none",
          isPopping ? "scale-125" : "scale-100",
        )}
        height={24}
        src={isActive ? "/icons/Like_True.svg" : "/icons/Like_False.svg"}
        width={24}
      />
    </button>
  );
}
