import type { InputHTMLAttributes, ReactNode } from "react";

import { cn } from "@/src/utils/cn";

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label?: ReactNode;
};

export default function Checkbox({ label = "Check", className, ...props }: CheckboxProps) {
  return (
    <label className={cn("inline-flex items-center gap-[8px] text-[13px] font-medium text-[#222831]", className)}>
      <span className="relative grid size-[18px] place-items-center">
        <input className="peer sr-only" type="checkbox" {...props} />
        <span className="size-[18px] rounded-[3px] border border-[#D0D3DB] bg-transparent peer-checked:border-[#00ADB5] peer-checked:bg-[#00ADB5]" />
        <span className="pointer-events-none absolute hidden text-[14px] font-bold leading-none text-white peer-checked:block">
          ✓
        </span>
      </span>
      <span>{label}</span>
    </label>
  );
}
