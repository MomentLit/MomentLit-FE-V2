import PopupCreatePageScreen from "@/features/popup/components/PopupCreatePageScreen";

type PopupCreatePageProps = {
  searchParams: Promise<{ matchingId?: string }>;
};

export default async function PopupCreatePage({ searchParams }: PopupCreatePageProps) {
  const params = await searchParams;
  const matchingId = Number(params.matchingId);

  return <PopupCreatePageScreen matchingId={Number.isFinite(matchingId) ? matchingId : null} />;
}
