"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

import { AUTH_CHANGE_EVENT, getAccessToken } from "@/apis/auth/tokenStorage";
import Button from "@/components/common/Button";
import FilterChip from "@/components/common/FilterChip";
import MyPageDropdown from "@/features/user/components/MyPageDropdown";
import { useMyPageMenu } from "@/features/user/hooks/useMyPageMenu";
import { cn } from "@/utils/cn";

import AlertDropdown from "../ui/AlertDropdown";
import type { AlertItem } from "../ui/AlertDropdown";
import BellIcon from "../ui/AlertIcon";
import DefaultProfile from "../ui/DefaultProfile";
import MessageDropdown from "../ui/MessageDropdown";
import type { MessageItem } from "../ui/MessageDropdown";
import MessageIcon from "../ui/MessageIcon";

type HeaderType = "top" | "topSearch" | "landing" | "unauth" | "scroll" | "noSearch";

type HeaderProps = {
  type?: HeaderType;
  activeNav?: "home" | "spaces" | null;
  alerts?: AlertItem[];
  alertError?: string | null;
  alertsLoading?: boolean;
  messages?: MessageItem[];
  messageError?: string | null;
  messagesLoading?: boolean;
  searchValue?: string;
  categoryValue?: string;
  categoryOptions?: string[];
  onSearchValueChange?: (value: string) => void;
  onCategoryChange?: (value: string) => void;
  onSearch?: () => void;
  className?: string;
};

const navItems = [
  { href: "/main", label: "홈" },
  { href: "/search", label: "공간 찾기" },
  { href: "#", label: "AI 공간 매칭" },
];

const subscribeToAuth = (onStoreChange: () => void) => {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === "access_token") onStoreChange();
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener(AUTH_CHANGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(AUTH_CHANGE_EVENT, onStoreChange);
  };
};

const getAuthSnapshot = () => Boolean(getAccessToken());
const getServerAuthSnapshot = () => false;

export default function Header({
  type = "top",
  activeNav,
  alerts = [],
  alertError,
  alertsLoading = false,
  messages = [],
  messageError,
  messagesLoading = false,
  searchValue,
  categoryValue = "",
  categoryOptions = [],
  onSearchValueChange,
  onCategoryChange,
  onSearch,
  className,
}: HeaderProps) {
  const [activeDropdown, setActiveDropdown] = useState<"alert" | "message" | "profile" | null>(null);
  const {
    handleSignOut,
    isProfileLoading,
    isSigningOut,
    loadProfile,
    profile,
    profileError,
  } = useMyPageMenu();
  const isAuthenticated = useSyncExternalStore(
    subscribeToAuth,
    getAuthSnapshot,
    getServerAuthSnapshot,
  );
  const actionsRef = useRef<HTMLDivElement>(null);
  const showNav = type !== "scroll" && type !== "noSearch";
  const showSearch = type === "top" || type === "topSearch" || type === "scroll";
  const showFilters = type === "topSearch";
  const showAuth = type === "unauth" || !isAuthenticated;
  const showActions = type !== "unauth" && isAuthenticated;
  const activeNavIndex = activeNav === null
    ? -1
    : activeNav === "spaces"
      ? 1
      : activeNav === "home"
        ? 0
        : type === "topSearch"
          ? 1
          : 0;

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!actionsRef.current?.contains(event.target as Node)) setActiveDropdown(null);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveDropdown(null);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <header className={cn("relative z-50 w-full border-b border-[#D0D3DB]", type === "unauth" ? "bg-[#F8FBFB]" : "bg-[#FFFFFF]", className)}>
      <div className="flex h-[64px] w-full items-center justify-between px-[20px]">
        <Link className="flex h-[48px] w-[172px] cursor-pointer items-center" aria-label="MomentLit 홈" href="/main">
          <Image alt="" aria-hidden height={48} src="/icons/icon.svg" width={48} />
        </Link>
        {showNav && (
          <nav className="hidden h-[64px] items-center gap-[4px] md:flex" aria-label="주요 메뉴">
            {navItems.map((item, index) => {
              const linkClassName = cn(
                "flex h-[64px] items-center px-[16px] text-[18px] font-semibold",
                index === activeNavIndex && type !== "unauth"
                  ? "text-[#00ADB5]"
                  : "text-[#67728A]",
              );

              return item.href.startsWith("/") ? (
                <Link className={linkClassName} href={item.href} key={item.label}>
                  {item.label}
                </Link>
              ) : (
                <a className={linkClassName} href={item.href} key={item.label}>
                  {item.label}
                </a>
              );
            })}
          </nav>
        )}
        {showAuth ? (
          <div className="flex items-center gap-[8px] sm:gap-[12px]">
            <Button className="h-[40px] w-[72px] px-[10px] py-[12px] text-[11px] sm:w-[80px] sm:px-[16px]" href="/login" size="custom">로그인</Button>
            <Button className="h-[40px] w-[72px] px-[10px] py-[12px] text-[11px] sm:w-[80px] sm:px-[16px]" href="/signup" size="custom" variant="outline">
              회원가입
            </Button>
          </div>
        ) : (
          showActions && (
            <div className="flex w-[164px] items-center justify-end gap-[20px]" ref={actionsRef}>
              <div className="relative">
                <button
                  aria-expanded={activeDropdown === "alert"}
                  aria-label="알림 보기"
                  className="grid size-[32px] cursor-pointer place-items-center"
                  onClick={() => setActiveDropdown((current) => current === "alert" ? null : "alert")}
                  type="button"
                >
                  <BellIcon alert={alerts.some((item) => item.unread)} className="size-[32px]" />
                </button>
                {activeDropdown === "alert" && (
                  <AlertDropdown
                    className="absolute right-0 top-[36px] z-50 shadow-[0_8px_24px_rgba(34,40,49,0.12)]"
                    error={alertError}
                    isLoading={alertsLoading}
                    items={alerts}
                  />
                )}
              </div>
              <div className="relative">
                <button
                  aria-expanded={activeDropdown === "message"}
                  aria-label="메시지 보기"
                  className="grid size-[32px] cursor-pointer place-items-center"
                  onClick={() => setActiveDropdown((current) => current === "message" ? null : "message")}
                  type="button"
                >
                  <MessageIcon alert={messages.some((item) => item.unread)} className="size-[32px]" />
                </button>
                {activeDropdown === "message" && (
                  <MessageDropdown
                    className="absolute right-0 top-[36px] z-50 shadow-[0_8px_24px_rgba(34,40,49,0.12)]"
                    error={messageError}
                    isLoading={messagesLoading}
                    items={messages}
                  />
                )}
              </div>
              <div className="relative">
                <button
                  aria-expanded={activeDropdown === "profile"}
                  aria-label="마이페이지 메뉴 보기"
                  className="grid size-[32px] cursor-pointer place-items-center"
                  onClick={() => {
                    const isOpening = activeDropdown !== "profile";
                    setActiveDropdown(isOpening ? "profile" : null);
                    if (isOpening) void loadProfile();
                  }}
                  type="button"
                >
                  <DefaultProfile className="size-[32px]" />
                </button>
                {activeDropdown === "profile" && (
                  <MyPageDropdown
                    className="absolute right-0 top-[36px] z-50 shadow-[0_8px_24px_rgba(34,40,49,0.12)]"
                    error={profileError}
                    isLoading={isProfileLoading}
                    isSigningOut={isSigningOut}
                    onSignOut={() => void handleSignOut()}
                    profile={profile}
                  />
                )}
              </div>
            </div>
          )
        )}
      </div>
      {showSearch && (
        <div
          className={cn(
            "flex h-[64px] w-full items-center gap-[24px] px-[20px]",
            showFilters ? "justify-between" : "justify-center",
          )}
        >
          {showFilters && (
            <div className="hidden gap-[8px] lg:flex">
              <FilterChip chipType="select" compact disabled>지역</FilterChip>
              <label className="relative flex min-h-[36px] items-center gap-[2px] rounded-[12px] bg-[#EDEDED] px-[14px] py-[9px] text-[12px] font-semibold leading-none text-[#5E687E]">
                <span className="sr-only">유형</span>
                <select
                  aria-label="유형"
                  className="cursor-pointer appearance-none bg-transparent pr-[13px] outline-none"
                  onChange={(event) => onCategoryChange?.(event.target.value)}
                  value={categoryValue}
                >
                  <option value="">유형</option>
                  {categoryOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
                <span className="pointer-events-none absolute right-[14px] rotate-90 text-[11px] leading-none">›</span>
              </label>
              <FilterChip chipType="select" compact disabled>수용 인원</FilterChip>
              <FilterChip chipType="select" compact disabled>가격</FilterChip>
            </div>
          )}
          <form
            className={cn("flex max-w-full items-center gap-[14px] rounded-full border border-[#D0D3DB] bg-white py-[5px] pl-[18px] pr-[5px]", showFilters ? "w-[439px]" : "w-[650px]")}
            onSubmit={(event) => {
              event.preventDefault();
              onSearch?.();
            }}
          >
            <label className="sr-only" htmlFor="header-search">검색어</label>
            <input
              className="min-w-0 flex-1 bg-transparent text-[16px] font-medium text-[#222831] outline-none placeholder:text-[#67728A]"
              id="header-search"
              onChange={(event) => onSearchValueChange?.(event.target.value)}
              placeholder="검색어를 입력해주세요."
              type="search"
              value={searchValue}
            />
            {searchValue && (
              <button
                aria-label="검색어 지우기"
                className="grid size-[24px] cursor-pointer place-items-center text-[20px] font-bold leading-none text-[#4F7DBE]"
                onClick={() => onSearchValueChange?.("")}
                type="button"
              >
                ×
              </button>
            )}
            <button aria-label="검색" className="grid size-[32px] cursor-pointer place-items-center" type="submit">
              <Image alt="" aria-hidden height={32} src="/icons/Search.svg" width={32} />
            </button>
          </form>
        </div>
      )}
    </header>
  );
}
