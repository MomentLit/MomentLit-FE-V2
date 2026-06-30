import { cn } from "@/src/utils/cn";

type BrandIconMode = "white" | "dark" | "transparentWhite" | "transparentDark";

type BrandIconProps = {
  mode?: BrandIconMode;
  className?: string;
};

export default function BrandIcon({ mode = "white", className }: BrandIconProps) {
  const isDark = mode === "dark" || mode === "transparentDark";
  const hasBackground = mode === "white" || mode === "dark";

  return (
    <span
      className={cn(
        "inline-flex size-[256px] items-center justify-center overflow-hidden",
        hasBackground && (isDark ? "bg-[#222831]" : "bg-[#FFFFFF]"),
        className,
      )}
    >
      <svg aria-label="MomentLit" className="h-[130px] w-[202px]" fill="none" viewBox="0 0 202 130">
        <path d="M18 82 50 33l32 49" stroke="#00ADB5" strokeLinecap="round" strokeWidth="28" />
        <path d="M50 33v63" stroke={isDark ? "#007E84" : "#98E5E8"} strokeLinecap="round" strokeWidth="28" />
        <path d="M82 33v63" stroke="#00ADB5" strokeLinecap="round" strokeWidth="28" />
        <path d="M114 33 146 82" stroke="#00ADB5" strokeLinecap="round" strokeWidth="28" />
        <circle cx="176" cy="96" fill="#00ADB5" r="14" />
      </svg>
    </span>
  );
}
