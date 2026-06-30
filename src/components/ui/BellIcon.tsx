import { cn } from "@/src/utils/cn";

type BellIconProps = {
  alert?: boolean;
  className?: string;
};

export default function BellIcon({ alert = true, className }: BellIconProps) {
  return (
    <span className={cn("relative inline-flex size-[24px] items-center justify-center", className)}>
      <svg aria-hidden="true" className="size-[22px]" fill="none" viewBox="0 0 24 24">
        <path
          d="M18 9.8c0-3.3-2.1-5.8-6-5.8S6 6.5 6 9.8v3.5l-1.4 2.5c-.4.7.1 1.5.9 1.5h13c.8 0 1.3-.8.9-1.5L18 13.3V9.8Z"
          stroke="#67728A"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
        <path d="M9.8 19.2c.5.8 1.2 1.2 2.2 1.2s1.8-.4 2.2-1.2" stroke="#67728A" strokeLinecap="round" strokeWidth="1.8" />
      </svg>
      {alert && <span className="absolute right-[3px] top-[1px] size-[7px] rounded-full bg-[#DA294A]" />}
    </span>
  );
}
