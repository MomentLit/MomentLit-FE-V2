import Button from "@/components/common/Button";
import FilterChip from "@/components/common/FilterChip";
import { cn } from "@/utils/cn";

import BellIcon from "../ui/BellIcon";
import BrandIcon from "../ui/BrandIcon";
import DefaultProfile from "../ui/DefaultProfile";
import MessageIcon from "../ui/MessageIcon";

type HeaderType = "top" | "topSearch" | "landing" | "unauth" | "scroll" | "noSearch";

type HeaderProps = {
  type?: HeaderType;
  className?: string;
};

const navItems = [
  { href: "/main", label: "홈" },
  { href: "/search", label: "공간 찾기" },
  { href: "#", label: "AI 공간 매칭" },
];

export default function Header({ type = "top", className }: HeaderProps) {
  const showNav = type !== "scroll" && type !== "noSearch";
  const showSearch = type === "top" || type === "topSearch" || type === "scroll";
  const showFilters = type === "topSearch";
  const showAuth = type === "unauth";
  const showActions = type !== "unauth";

  return (
    <header className={cn("w-full border-b border-[#D0D3DB]", type === "unauth" ? "bg-[#F8FBFB]" : "bg-[#FFFFFF]", className)}>
      <div className="mx-auto flex h-[64px] max-w-[1440px] items-center justify-between px-[20px]">
        <a aria-label="MomentLit 홈" href="/main">
          <BrandIcon className="h-[40px] w-[48px]" mode="transparentWhite" />
        </a>
        {showNav && (
          <nav className="hidden h-[64px] items-center gap-[4px] md:flex" aria-label="주요 메뉴">
            {navItems.map((item, index) => (
              <a
                className={cn(
                  "flex h-[64px] items-center px-[16px] text-[18px] font-semibold",
                  index === 0 && type !== "unauth" ? "text-[#00ADB5]" : "text-[#67728A]",
                )}
                href={item.href}
                key={item.label}
              >
                {item.label}
              </a>
            ))}
          </nav>
        )}
        {showAuth ? (
          <div className="flex items-center gap-[8px] sm:gap-[12px]">
            <Button className="h-[40px] w-[72px] px-[10px] py-[12px] text-[11px] sm:w-[80px] sm:px-[16px]" href="/login">로그인</Button>
            <Button className="h-[40px] w-[72px] px-[10px] py-[12px] text-[11px] sm:w-[80px] sm:px-[16px]" href="/signup" variant="outline">
              회원가입
            </Button>
          </div>
        ) : (
          showActions && (
            <div className="flex w-[164px] items-center justify-end gap-[20px]">
              <BellIcon />
              <MessageIcon />
              <DefaultProfile className="size-[32px]" />
            </div>
          )
        )}
      </div>
      {showSearch && (
        <div className="mx-auto flex max-w-[1440px] items-center justify-center gap-[24px] px-[20px] py-[5px]">
          {showFilters && (
            <div className="flex gap-[8px]">
              {["지역", "유형", "수용 인원", "가격"].map((label) => (
                <FilterChip className="min-h-[34px] px-[14px] py-[9px] text-[14px]" chipType="select" key={label}>
                  {label}
                </FilterChip>
              ))}
            </div>
          )}
          <label className={cn("flex items-center gap-[14px] rounded-full border border-[#D0D3DB] bg-white py-[5px] pl-[18px] pr-[5px]", showFilters ? "w-[439px]" : "w-[650px]")}>
            <span className="sr-only">검색어</span>
            <input
              className="min-w-0 flex-1 bg-transparent text-[16px] font-medium text-[#222831] outline-none placeholder:text-[#67728A]"
              placeholder="검색어를 입력해주세요."
              type="search"
            />
            <span className="grid size-[32px] place-items-center rounded-full bg-[#00ADB5] text-white">⌕</span>
          </label>
        </div>
      )}
    </header>
  );
}
