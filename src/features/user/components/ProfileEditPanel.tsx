"use client";

import { FormEvent, useState } from "react";

import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import type { UserSearchResponse, UserUpdateRequest } from "@/types/user";

type ProfileEditPanelProps = {
  profile: UserSearchResponse;
  onSave: (body: UserUpdateRequest) => Promise<void>;
};

export default function ProfileEditPanel({ profile, onSave }: ProfileEditPanelProps) {
  const [name, setName] = useState(profile.name);
  const [phone, setPhone] = useState(profile.phone ?? "");
  const [intro, setIntro] = useState(profile.intro ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      await onSave({ name, phone, intro });
      setMessage("프로필이 저장되었습니다.");
    } catch {
      setMessage("프로필을 저장하지 못했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="flex flex-col gap-[24px] rounded-[30px] bg-white p-[28px]">
      <h2 className="text-[30px] font-bold text-[#222831]">프로필 기본 정보</h2>
      <form className="flex flex-col gap-[24px]" onSubmit={handleSubmit}>
        <div className="grid gap-[24px] md:grid-cols-3">
          <Input containerClassName="w-full" label="이름" onChange={(event) => setName(event.target.value)} value={name} />
          <Input className="bg-[#F7F7F7] text-[#67728A]" containerClassName="w-full" disabled label="이메일" type="email" value={profile.email} />
          <Input containerClassName="w-full" label="연락처" onChange={(event) => setPhone(event.target.value)} type="tel" value={phone} />
        </div>
        <label className="flex flex-col gap-[4px]">
          <span className="text-[16px] font-medium text-[#222831]">소개말</span>
          <textarea
            className="h-[220px] resize-none rounded-[12px] bg-[#F7F7F7] px-[14px] py-[12px] text-[16px] font-medium text-[#222831] outline-none placeholder:text-[#67728A] focus:ring-1 focus:ring-[#00ADB5]"
            onChange={(event) => setIntro(event.target.value)}
            placeholder="소개말을 입력해주세요."
            value={intro}
          />
        </label>
        <div className="flex min-h-[53px] items-center justify-end gap-[12px]">
          {message && <p className="mr-auto text-[14px] text-[#67728A]" role="status">{message}</p>}
          <Button className="w-[160px] bg-[#F7F7F7] text-[#67728A] hover:bg-[#EEEEEE]" disabled={isSaving} onClick={() => {
            setName(profile.name);
            setPhone(profile.phone ?? "");
            setIntro(profile.intro ?? "");
          }} size="custom" variant="secondary">
            취소
          </Button>
          <Button className="w-[160px]" disabled={isSaving} size="custom" type="submit">
            {isSaving ? "저장 중" : "저장"}
          </Button>
        </div>
      </form>
    </section>
  );
}
