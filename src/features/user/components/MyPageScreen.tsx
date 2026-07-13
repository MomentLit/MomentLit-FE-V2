"use client";

import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

import type { MyPageTab } from "../hooks/useMyPageData";
import { useMyPageData } from "../hooks/useMyPageData";
import AdminSpacesPanel from "./AdminSpacesPanel";
import MyMatchingPanel from "./MyMatchingPanel";
import MyPageSidebar from "./MyPageSidebar";
import MySpacesPanel from "./MySpacesPanel";
import ProfileEditPanel from "./ProfileEditPanel";

type MyPageScreenProps = {
  tab: MyPageTab;
};

const titles: Record<MyPageTab, string> = {
  profile: "정보 수정",
  spaces: "나의 공간 및 팝업",
  matching: "나의 매칭",
  admin: "공간 승인 및 거부",
};

export default function MyPageScreen({ tab }: MyPageScreenProps) {
  const data = useMyPageData(tab);

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      <Header className="bg-[#F8FBFB]" type="landing" />
      <main className="mx-auto flex w-full max-w-[1440px] flex-col gap-[28px] px-[20px] py-[30px] sm:px-[32px] lg:flex-row lg:px-[50px]">
        <MyPageSidebar
          activeTab={tab}
          isSigningOut={data.isSigningOut}
          onSignOut={() => void data.handleSignOut()}
          profile={data.profile}
        />
        <div className="flex min-w-0 flex-1 flex-col gap-[24px] lg:w-[932px] lg:flex-none">
          <h1 className="text-[32px] font-bold leading-normal text-[#222831] sm:text-[42px]">{titles[tab]}</h1>
          {tab === "profile" && data.isProfileLoading && (
            <p className="rounded-[30px] bg-white px-[28px] py-[80px] text-center text-[#67728A]">프로필을 불러오는 중입니다.</p>
          )}
          {tab === "profile" && data.profileError && (
            <p className="rounded-[30px] bg-white px-[28px] py-[80px] text-center text-[#DA294A]">{data.profileError}</p>
          )}
          {tab === "profile" && data.profile && (
            <ProfileEditPanel key={data.profile.email} onSave={data.saveProfile} profile={data.profile} />
          )}
          {tab === "spaces" && (
            <MySpacesPanel
              error={data.contentError}
              isLoading={data.isContentLoading}
              matchings={data.matchings}
              onDeleteSpace={data.removeSpace}
              popups={data.popups}
              spaces={data.spaces}
            />
          )}
          {tab === "matching" && (
            <MyMatchingPanel
              error={data.contentError}
              isLoading={data.isContentLoading}
              matchings={data.matchings}
              onDecision={data.decideMatching}
              profileName={data.profile?.name}
              sentMatchings={data.sentMatchings}
            />
          )}
          {tab === "admin" && (
            <AdminSpacesPanel
              error={data.contentError}
              isLoading={data.isContentLoading}
              onDecision={data.decideAdminSpace}
              matchings={data.adminMatchings}
            />
          )}
        </div>
      </main>
      <Footer className="mt-[64px]" variant="mainPage" />
    </div>
  );
}
