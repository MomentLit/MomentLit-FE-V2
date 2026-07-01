"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

import Button from "@/components/common/Button";
import Input from "@/components/common/Input";

import { useSignup } from "../hooks/useSignup";
import PasswordField from "./PasswordField";

const RequiredLabel = ({ children }: { children: string }) => (
  <>
    {children} <span className="text-[#DA294A]">*</span>
  </>
);

const inputClassName =
  "h-[58px] rounded-[16px] border-[1.35px] px-[19px] py-[16px] text-[17px]";

export default function SignupForm() {
  const { error, isLoading, signup } = useSignup();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password !== passwordConfirm) {
      setValidationError("비밀번호가 일치하지 않습니다.");
      return;
    }
    setValidationError(null);
    await signup({ email, name, password, phone });
  };

  return (
    <form className="flex w-full max-w-[405px] flex-col gap-[12px]" onSubmit={handleSubmit}>
      <h1 className="text-center text-[43px] font-semibold leading-[1.3] text-black">회원가입</h1>
      <div className="flex flex-col gap-[32px]">
        <div className="flex flex-col gap-[16px]">
          <Input
            autoComplete="name"
            className={inputClassName}
            containerClassName="w-full gap-[5px]"
            label={<RequiredLabel>이름</RequiredLabel>}
            labelClassName="text-[18px] leading-[1.3]"
            name="name"
            onChange={(event) => setName(event.target.value)}
            placeholder="표시 이름 입력"
            required
            value={name}
          />
          <Input
            autoComplete="tel"
            className={inputClassName}
            containerClassName="w-full gap-[5px]"
            label={<RequiredLabel>전화번호</RequiredLabel>}
            labelClassName="text-[18px] leading-[1.3]"
            name="phone"
            onChange={(event) => setPhone(event.target.value)}
            placeholder="전화번호 입력"
            required
            type="tel"
            value={phone}
          />
        </div>
        <div className="flex flex-col gap-[16px]">
          <Input
            autoComplete="email"
            className={inputClassName}
            containerClassName="w-full gap-[5px]"
            label={<RequiredLabel>이메일</RequiredLabel>}
            labelClassName="text-[18px] leading-[1.3]"
            name="email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="이메일 입력"
            required
            type="email"
            value={email}
          />
          <PasswordField
            autoComplete="new-password"
            label={<RequiredLabel>비밀번호</RequiredLabel>}
            name="password"
            onChange={setPassword}
            value={password}
          />
          <PasswordField
            autoComplete="new-password"
            label={<RequiredLabel>비밀번호 확인</RequiredLabel>}
            name="passwordConfirm"
            onChange={setPasswordConfirm}
            value={passwordConfirm}
          />
        </div>
      </div>
      {(validationError ?? error) && (
        <p aria-live="polite" className="text-center text-[13px] text-[#DA294A]">
          {validationError ?? error}
        </p>
      )}
      <Button
        className="h-[57px] rounded-[12px] px-[22px] py-[17px] text-[17px]"
        disabled={isLoading}
        fullWidth
        size="custom"
        type="submit"
      >
        {isLoading ? "가입 중" : "회원가입"}
      </Button>
      <Link className="text-center text-[13px] font-medium text-[#67728A]" href="/login">
        계정이 있다면?
      </Link>
    </form>
  );
}
