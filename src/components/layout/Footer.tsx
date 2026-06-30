import { cn } from "@/src/utils/cn";

import BrandIcon from "../ui/BrandIcon";

type FooterVariant = "landing" | "mainPage";

type FooterProps = {
  variant?: FooterVariant;
  className?: string;
};

export default function Footer({ variant = "landing", className }: FooterProps) {
  const navItems = variant === "mainPage" ? ["홈", "공간 찾기", "캘린더", "AI 공간 매칭"] : ["메인", "솔루션", "서비스", "소개"];

  return (
    <footer className={cn("h-[400px] w-full border-t border-[#D0D3DB] bg-[#FFFFFF]", className)}>
      <div className="mx-auto flex h-full max-w-[1280px] items-center justify-between px-[32px]">
        <div className="flex flex-col gap-[20px]">
          <div className="flex items-center gap-[12px] text-[24px] font-bold text-[#67728A]">
            <span>MomentLit</span>
            <BrandIcon className="size-[42px]" mode="transparentWhite" />
          </div>
          <div className="flex flex-col gap-[18px] text-[24px] font-medium text-[#67728A]">
            <p>주소: 부산광역시 강서구 가락대로 1393 (46708)</p>
            <p>이메일: momentlit@exam.com</p>
          </div>
        </div>
        <nav className="flex flex-col gap-[28px] text-[24px] font-semibold text-[#67728A]" aria-label="푸터 메뉴">
          {navItems.map((item) => (
            <a href="#" key={item}>
              {item}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
