"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";

import { startGoogleOAuth } from "@/apis/auth";
import Button from "@/components/common/Button";
import Checkbox from "@/components/common/Checkbox";
import Input from "@/components/common/Input";

import { useLogin } from "../hooks/useLogin";
import PasswordField from "./PasswordField";

const SAVED_EMAIL_KEY = "saved_email";

export default function LoginForm() {
  const { error, isLoading, login } = useLogin();
  const [email, setEmail] = useState(() =>
    typeof window === "undefined" ? "" : localStorage.getItem(SAVED_EMAIL_KEY) ?? "",
  );
  const [password, setPassword] = useState("");
  const [rememberEmail, setRememberEmail] = useState(true);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (rememberEmail) localStorage.setItem(SAVED_EMAIL_KEY, email);
    else localStorage.removeItem(SAVED_EMAIL_KEY);
    await login({ email, password });
  };

  return (
    <form className="flex w-full max-w-[405px] flex-col gap-[12px]" onSubmit={handleSubmit}>
      <h1 className="text-center text-[43px] font-semibold leading-[1.3] text-black">로그인</h1>
      <div className="flex flex-col gap-[16px]">
        <Input
          autoComplete="email"
          className="h-[58px] rounded-[16px] border-[1.35px] px-[19px] py-[16px] text-[17px]"
          containerClassName="w-full gap-[5px]"
          label="이메일"
          labelClassName="text-[18px] leading-[1.3]"
          name="email"
          onChange={(event) => setEmail(event.target.value)}
          placeholder="이메일 입력"
          required
          type="email"
          value={email}
        />
        <PasswordField
          autoComplete="current-password"
          label="비밀번호"
          name="password"
          onChange={setPassword}
          value={password}
        />
      </div>
      <div className="flex items-center justify-between gap-[12px]">
        <Checkbox
          checked={rememberEmail}
          label="아이디 저장"
          onChange={(event) => setRememberEmail(event.target.checked)}
        />
        <div className="flex items-center gap-[4px] text-[13px] font-medium text-[#67728A]">
          <a href="#">아이디 찾기</a>
          <span aria-hidden className="h-[11px] border-l border-[#D0D3DB]" />
          <a href="#">비밀번호 찾기</a>
        </div>
      </div>
      {error && (
        <p aria-live="polite" className="text-center text-[13px] text-[#DA294A]">
          {error}
        </p>
      )}
      <div className="flex flex-col gap-[13px]">
        <Button
          className="h-[57px] rounded-[12px] px-[22px] py-[17px] text-[17px]"
          disabled={isLoading}
          fullWidth
          size="custom"
          type="submit"
        >
          {isLoading ? "로그인 중" : "로그인"}
        </Button>
        <Button
          className="h-[57px] gap-[9px] rounded-[13px] border border-[#D0D3DB] px-[22px] py-[17px] text-[17px] font-semibold text-[#222831]"
          fullWidth
          onClick={startGoogleOAuth}
          size="custom"
          variant="secondary"
        >
          <Image alt="" aria-hidden height={26} src="/icons/google.svg" width={26} />
          Google로 시작하기
        </Button>
      </div>
      <Link className="text-center text-[13px] font-medium text-[#67728A]" href="/signup">
        계정이 없다면?
      </Link>
    </form>
  );
}
