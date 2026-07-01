import { cn } from "@/utils/cn";

type DefaultProfileProps = {
  className?: string;
};

export default function DefaultProfile({ className }: DefaultProfileProps) {
  return (
    <span className={cn("grid size-[48px] place-items-center rounded-full bg-[#99A1B1]", className)}>
      <svg aria-hidden="true" className="size-[36px]" fill="none" viewBox="0 0 36 36">
        <circle cx="18" cy="12.5" fill="#3E435C" r="6" />
        <path d="M8.5 28c1.5-5 5-7.4 9.5-7.4s8 2.4 9.5 7.4c.2.8-.4 1.5-1.2 1.5H9.7c-.8 0-1.4-.7-1.2-1.5Z" fill="#3E435C" />
      </svg>
    </span>
  );
}
