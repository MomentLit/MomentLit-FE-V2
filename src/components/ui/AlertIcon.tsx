import Image from "next/image";

import { cn } from "@/utils/cn";

type BellIconProps = {
  alert?: boolean;
  className?: string;
};

export default function BellIcon({ alert = true, className }: BellIconProps) {
  return (
    <Image
      alt=""
      aria-hidden
      className={cn("size-[24px]", className)}
      height={24}
      src={alert ? "/icons/Alert_True.svg" : "/icons/Alert_False.svg"}
      width={24}
    />
  );
}
