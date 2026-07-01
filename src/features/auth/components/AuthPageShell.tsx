import type { ReactNode } from "react";

import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { cn } from "@/utils/cn";

type AuthPageShellProps = {
  children: ReactNode;
  page: "login" | "signup";
};

export default function AuthPageShell({ children, page }: AuthPageShellProps) {
  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      <Header type="unauth" />
      <main
        className={cn(
          "flex justify-center px-[20px]",
          page === "login"
            ? "min-h-[721px] pt-[130px]"
            : "min-h-[872px] pt-[60px]",
        )}
      >
        {children}
      </main>
      <Footer variant="mainPage" />
    </div>
  );
}
