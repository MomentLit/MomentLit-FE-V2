"use client";

import Image from "next/image";
import { useState } from "react";
import type { ChangeEvent, ReactNode } from "react";

import Input from "@/components/common/Input";

type PasswordFieldProps = {
  label: ReactNode;
  name: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete: string;
};

export default function PasswordField({
  label,
  name,
  value,
  onChange,
  autoComplete,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <Input
      autoComplete={autoComplete}
      className="h-[58px] rounded-[16px] border-[1.35px] px-[19px] py-[16px] text-[17px]"
      containerClassName="w-full gap-[5px]"
      endAdornment={
        <button
          aria-label={visible ? "비밀번호 숨기기" : "비밀번호 보기"}
          className="grid size-[28px] place-items-center"
          onClick={() => setVisible((current) => !current)}
          type="button"
        >
          <Image alt="" aria-hidden height={21} src="/icons/eye.svg" width={21} />
        </button>
      }
      label={label}
      labelClassName="text-[18px] leading-[1.3]"
      name={name}
      onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value)}
      placeholder="비밀번호 입력"
      required
      type={visible ? "text" : "password"}
      value={value}
    />
  );
}
