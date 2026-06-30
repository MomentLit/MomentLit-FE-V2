import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";

import { cn } from "@/utils/cn";

type BaseProps = {
  label?: ReactNode;
  containerClassName?: string;
};

type TextInputProps = BaseProps &
  InputHTMLAttributes<HTMLInputElement> & {
    type?: "text";
  };

type SelectInputProps = BaseProps &
  SelectHTMLAttributes<HTMLSelectElement> & {
    type: "select";
    options?: { label: string; value: string }[];
  };

type FormInputProps = TextInputProps | SelectInputProps;

export default function Input(props: FormInputProps) {
  const { label = "인풋", containerClassName, className } = props;
  const fieldClass =
    "min-h-[46px] w-full min-w-[200px] rounded-[12px] border border-[#D0D3DB] bg-[#FFFFFF] px-[14px] py-[12px] text-[16px] font-medium text-[#222831] outline-none placeholder:text-[#67728A] focus:border-[#00ADB5]";

  return (
    <label className={cn("flex w-[300px] flex-col gap-[4px]", containerClassName)}>
      <span className="text-[16px] font-medium text-[#222831]">{label}</span>
      {props.type === "select" ? (
        <span className="relative block">
          <select
            {...props}
            className={cn(fieldClass, "appearance-none pr-[40px] text-[#67728A]", className)}
          >
            {(props.options ?? [{ label: "표시 이름 입력", value: "" }]).map((option) => (
              <option key={option.value || option.label} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-[14px] top-1/2 -translate-y-1/2 text-[18px] leading-none text-[#67728A]">
            ›
          </span>
        </span>
      ) : (
        <input
          {...props}
          className={cn(fieldClass, className)}
          placeholder={props.placeholder ?? "표시 이름 입력"}
          type="text"
        />
      )}
    </label>
  );
}
