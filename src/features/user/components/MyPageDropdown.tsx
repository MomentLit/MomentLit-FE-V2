import Link from "next/link";

import type { UserSearchResponse } from "@/types/user";
import { cn } from "@/utils/cn";

type MyPageDropdownProps = {
  profile?: UserSearchResponse | null;
  isLoading?: boolean;
  error?: string | null;
  isSigningOut?: boolean;
  onSignOut: () => void;
  className?: string;
};

const menuItems = [
  { href: "/my", label: "정보 수정" },
  { href: "/my?tab=spaces", label: "나의 공간 및 팝업" },
  { href: "/my?tab=matching", label: "나의 매칭" },
];

export default function MyPageDropdown({
  profile,
  isLoading = false,
  error,
  isSigningOut = false,
  onSignOut,
  className,
}: MyPageDropdownProps) {
  const name = profile?.name ?? (isLoading ? "불러오는 중" : "사용자");
  const email = profile?.email ?? (error || "프로필 정보를 확인해주세요.");
  const items = profile?.role === "ADMIN"
    ? [...menuItems, { href: "/my?tab=admin", label: "공간 승인 및 거부" }]
    : menuItems;

  return (
    <section
      aria-label="마이페이지 메뉴"
      className={cn(
        "flex w-[320px] flex-col gap-[12px] rounded-[20px] border border-[#D0D3DB] bg-white p-[16px]",
        className,
      )}
    >
      <Link
        className="flex h-[88px] shrink-0 items-center gap-[10px] rounded-[12px] bg-[#F8FBFB] p-[12px] transition-colors hover:bg-[#EEEEEE]"
        href="/my"
      >
        <span className="grid size-[64px] shrink-0 place-items-center rounded-full bg-[#00ADB5] text-[14px] font-bold text-white">
          프로필
        </span>
        <span className="flex min-w-0 flex-1 flex-col gap-[4px]">
          <span className="truncate text-[16px] leading-normal text-[#222831]">
            <strong className="font-bold">{name}</strong>
            <span>님</span>
          </span>
          <span className={cn("truncate text-[14px] font-medium leading-[1.35]", error ? "text-[#DA294A]" : "text-[#67728A]")}>
            {email}
          </span>
        </span>
      </Link>

      {items.map((item) => (
        <Link
          className="flex h-[44px] shrink-0 items-center rounded-[12px] bg-[#F7F7F7] px-[20px] text-[16px] font-semibold text-[#5E687E] transition-colors hover:bg-[#EEEEEE] hover:text-[#00ADB5]"
          href={item.href}
          key={item.label}
        >
          {item.label}
        </Link>
      ))}

      <button
        className="flex h-[44px] shrink-0 items-center rounded-[12px] bg-[#F7F7F7] px-[20px] text-[16px] font-semibold text-[#4F5D73] transition-colors hover:bg-[#EEEEEE] hover:text-[#DA294A] disabled:opacity-60"
        disabled={isSigningOut}
        onClick={onSignOut}
        type="button"
      >
        {isSigningOut ? "로그아웃 중" : "로그아웃"}
      </button>
    </section>
  );
}
