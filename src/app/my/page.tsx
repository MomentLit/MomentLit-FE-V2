import MyPageScreen from "@/features/user/components/MyPageScreen";
import type { MyPageTab } from "@/features/user/hooks/useMyPageData";

type MyPageProps = {
  searchParams: Promise<{ tab?: string }>;
};

const tabs: MyPageTab[] = ["profile", "spaces", "matching", "admin"];

export default async function MyPage({ searchParams }: MyPageProps) {
  const params = await searchParams;
  const tab = tabs.includes(params.tab as MyPageTab)
    ? params.tab as MyPageTab
    : "profile";

  return <MyPageScreen tab={tab} />;
}
