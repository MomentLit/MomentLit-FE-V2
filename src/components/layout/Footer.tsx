import { cn } from "@/utils/cn";

import BrandIcon from "../ui/BrandIcon";

type FooterVariant = "landing" | "mainPage";

type FooterProps = {
  variant?: FooterVariant;
  className?: string;
};

export default function Footer({ variant = "landing", className }: FooterProps) {
  const navItems = variant === "mainPage" ? ["홈", "공간 찾기", "캘린더", "AI 공간 매칭"] : ["메인", "솔루션", "서비스", "소개"];
  const navHrefs = variant === "mainPage" ? ["/main", "/search", "#", "#"] : ["#", "#", "#", "#"];

  return (
    <footer className={cn("min-h-[400px] w-full border-t border-[#D0D3DB]", variant === "mainPage" ? "bg-[#F8FBFB]" : "bg-[#FFFFFF]", className)}>
      <div className="mx-auto flex min-h-[400px] max-w-[1440px] flex-col justify-center gap-[48px] px-[20px] py-[48px] sm:px-[40px] md:flex-row md:items-center md:justify-between md:px-[80px] md:py-0">
        <div className="flex flex-col gap-[20px]">
          <div className="flex items-center gap-[12px] text-[24px] font-bold text-[#67728A]">
            <span>MomentLit</span>
            <BrandIcon className="h-[32px] w-[42px]" mode="transparentWhite" />
          </div>
          <div className="flex flex-col gap-[18px] text-[16px] font-medium text-[#67728A] md:text-[24px]">
            <p>주소: 부산광역시 강서구 가락대로 1393 (46708)</p>
            <p>이메일: momentlit@exam.com</p>
          </div>
        </div>
        <nav className="grid grid-cols-2 gap-x-[32px] gap-y-[20px] text-[18px] font-semibold text-[#67728A] md:flex md:flex-col md:gap-[28px] md:text-[24px]" aria-label="푸터 메뉴">
          {navItems.map((item, index) => (
            <a href={navHrefs[index]} key={item}>
              {item}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
