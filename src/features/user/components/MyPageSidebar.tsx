import Link from "next/link";

import DefaultProfile from "@/components/ui/DefaultProfile";
import type { UserSearchResponse } from "@/types/user";
import { cn } from "@/utils/cn";

import type { MyPageTab } from "../hooks/useMyPageData";

type MyPageSidebarProps = {
  activeTab: MyPageTab;
  profile?: UserSearchResponse | null;
  isSigningOut: boolean;
  onSignOut: () => void;
};

const menuItems: Array<{ href: string; label: string; tab: MyPageTab }> = [
  { href: "/my", label: "정보 수정", tab: "profile" },
  { href: "/my?tab=spaces", label: "나의 공간 및 팝업", tab: "spaces" },
  { href: "/my?tab=matching", label: "나의 매칭", tab: "matching" },
];

export default function MyPageSidebar({
  activeTab,
  profile,
  isSigningOut,
  onSignOut,
}: MyPageSidebarProps) {
  const items = profile?.role === "ADMIN"
    ? [...menuItems, { href: "/my?tab=admin", label: "공간 승인 및 거부", tab: "admin" as const }]
    : menuItems;

  return (
    <aside className="flex w-full shrink-0 flex-col gap-[20px] lg:w-[320px]">
      <section className="flex flex-col gap-[18px] rounded-[28px] bg-white p-[28px]">
        <DefaultProfile className="size-[72px]" />
        <p className="truncate text-[28px] font-bold text-[#222831]">
          {profile?.name ?? "사용자"} 님, 반가워요
        </p>
      </section>

      <nav className="flex flex-col gap-[10px] rounded-[28px] bg-white p-[28px]" aria-label="마이페이지 메뉴">
        <p className="text-[14px] font-bold text-[#222831]">마이페이지 메뉴</p>
        {items.map((item) => (
          <Link
            aria-current={activeTab === item.tab ? "page" : undefined}
            className={cn(
              "flex min-h-[44px] items-center rounded-[12px] px-[20px] text-[13px] font-semibold transition-colors",
              activeTab === item.tab
                ? "bg-[#00ADB5] text-white"
                : "bg-[#F7F7F7] text-[#5E687E] hover:bg-[#EEEEEE] hover:text-[#00ADB5]",
            )}
            href={item.href}
            key={item.tab}
          >
            {item.label}
          </Link>
        ))}
        <button
          className="flex min-h-[44px] items-center rounded-[12px] bg-[#F7F7F7] px-[20px] text-[13px] font-semibold text-[#4F5D73] transition-colors hover:bg-[#EEEEEE] hover:text-[#DA294A] disabled:opacity-60"
          disabled={isSigningOut}
          onClick={onSignOut}
          type="button"
        >
          {isSigningOut ? "로그아웃 중" : "로그아웃"}
        </button>
      </nav>
    </aside>
  );
}
