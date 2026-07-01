import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/utils/cn";

type ButtonVariant = "primary" | "secondary" | "outline";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: ReactNode;
  variant?: ButtonVariant;
  pressed?: boolean;
  fullWidth?: boolean;
};

const baseClass =
  "inline-flex h-[53px] items-center justify-center rounded-[12px] px-[20px] py-[16px] text-center text-[16px] font-bold leading-[1.3] transition-colors disabled:cursor-not-allowed";

const variantClass: Record<ButtonVariant, string> = {
  primary:
    "bg-[#00ADB5] text-white hover:bg-[#007E84] active:bg-[#003F42] active:text-white/70 disabled:bg-[#D0D3DB] disabled:text-[#67728A]",
  secondary:
    "bg-[#FFFFFF] text-[#67728A] hover:bg-[#D0D3DB] active:bg-[#99A1B1] disabled:bg-[#FFFFFF] disabled:text-[#67728A]",
  outline:
    "border-[2.5px] border-[#00ADB5] bg-[#FFFFFF] text-[#00ADB5] hover:border-[#007E84] hover:bg-[#EEEEEE]/90 hover:text-[#007E84] active:border-[#003F42] active:bg-[#EEEEEE]/70 active:text-[#003F42] disabled:border-[#D0D3DB] disabled:text-[#67728A]",
};

export default function Button({
  children = "버튼",
  variant = "primary",
  pressed = false,
  fullWidth = false,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        baseClass,
        variantClass[variant],
        pressed && variant === "primary" && "bg-[#003F42] text-white/70",
        pressed && variant === "secondary" && "bg-[#99A1B1] text-[#67728A]",
        pressed && variant === "outline" && "border-[#003F42] bg-[#EEEEEE]/70 text-[#003F42]",
        fullWidth ? "w-full" : "w-[400px]",
        className,
      )}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
}
