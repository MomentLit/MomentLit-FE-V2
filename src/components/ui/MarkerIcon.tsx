import { cn } from "@/src/utils/cn";

type MarkerIconProps = {
  className?: string;
};

export default function MarkerIcon({ className }: MarkerIconProps) {
  return (
    <svg aria-hidden="true" className={cn("h-[14px] w-[8px] shrink-0", className)} fill="none" viewBox="0 0 8 14">
      <path
        d="M4 13s4-4.6 4-8.2A4 4 0 0 0 0 4.8C0 8.4 4 13 4 13Z"
        fill="currentColor"
      />
      <circle cx="4" cy="4.8" fill="#FFFFFF" r="1.4" />
    </svg>
  );
}
