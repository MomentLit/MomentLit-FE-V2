import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";

import { cn } from "@/utils/cn";

type BaseProps = {
  label?: ReactNode;
  containerClassName?: string;
  labelClassName?: string;
};

type TextInputProps = BaseProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
    type?: "text" | "email" | "password" | "tel" | "search" | "url";
    endAdornment?: ReactNode;
  };

type SelectInputProps = BaseProps &
  SelectHTMLAttributes<HTMLSelectElement> & {
    type: "select";
    options?: { label: string; value: string }[];
  };

type FormInputProps = TextInputProps | SelectInputProps;

export default function Input(props: FormInputProps) {
  const fieldClass =
    "min-h-[46px] w-full min-w-[200px] rounded-[12px] border border-[#D0D3DB] bg-[#FFFFFF] px-[14px] py-[12px] text-[16px] font-medium text-[#222831] outline-none placeholder:text-[#67728A] focus:border-[#00ADB5]";

  if (props.type === "select") {
    const {
      label = "인풋",
      containerClassName,
      labelClassName,
      className,
      options,
      type,
      ...selectProps
    } = props;

    return (
      <label className={cn("flex w-[300px] flex-col gap-[4px]", containerClassName)}>
        <span className={cn("text-[16px] font-medium text-[#222831]", labelClassName)}>{label}</span>
        <span className="relative block">
          <select
            {...selectProps}
            className={cn(fieldClass, "appearance-none pr-[40px] text-[#67728A]", className)}
            data-input-type={type}
          >
            {(options ?? [{ label: "표시 이름 입력", value: "" }]).map((option) => (
              <option key={option.value || option.label} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-[14px] top-1/2 -translate-y-1/2 text-[18px] leading-none text-[#67728A]">
            ›
          </span>
        </span>
      </label>
    );
  }

  const {
    label = "인풋",
    containerClassName,
    labelClassName,
    className,
    endAdornment,
    type = "text",
    ...inputProps
  } = props;

  return (
    <label className={cn("flex w-[300px] flex-col gap-[4px]", containerClassName)}>
      <span className={cn("text-[16px] font-medium text-[#222831]", labelClassName)}>{label}</span>
      <span className="relative block">
        <input
          {...inputProps}
          className={cn(fieldClass, Boolean(endAdornment) && "pr-[52px]", className)}
          placeholder={inputProps.placeholder ?? "표시 이름 입력"}
          type={type}
        />
        {endAdornment && (
          <span className="absolute right-[14px] top-1/2 -translate-y-1/2">{endAdornment}</span>
        )}
      </span>
    </label>
  );
}
