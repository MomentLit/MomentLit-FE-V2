import Image from "next/image";

import { cn } from "@/utils/cn";

type MessageIconProps = {
  alert?: boolean;
  className?: string;
};

export default function MessageIcon({ alert = true, className }: MessageIconProps) {
  return (
    <Image
      alt=""
      aria-hidden
      className={cn("size-[24px]", className)}
      height={24}
      src={alert ? "/icons/Message_True.svg" : "/icons/Message_False.svg"}
      width={24}
    />
  );
}
