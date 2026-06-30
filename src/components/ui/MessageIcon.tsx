import { cn } from "@/utils/cn";

type MessageIconProps = {
  alert?: boolean;
  className?: string;
};

export default function MessageIcon({ alert = true, className }: MessageIconProps) {
  return (
    <span className={cn("relative inline-flex size-[24px] items-center justify-center", className)}>
      <svg aria-hidden="true" className="size-[22px]" fill="none" viewBox="0 0 24 24">
        <path
          d="M20.3 4.4 3.8 11.2c-.9.4-.8 1.7.2 1.9l6.3 1.3 1.3 6.3c.2 1 1.5 1.1 1.9.2l6.8-16.5Z"
          stroke="#67728A"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
        <path d="m10.4 14.2 4.1-4.1" stroke="#67728A" strokeLinecap="round" strokeWidth="1.8" />
      </svg>
      {alert && <span className="absolute right-[2px] top-[1px] size-[7px] rounded-full bg-[#DA294A]" />}
    </span>
  );
}
